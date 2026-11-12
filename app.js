/* Synora Copys — app.js
   Site estático (GitHub Pages). Sem dependência de extensão — config e dados ficam em localStorage. */

// ═══════════════════════════════════════════════ LIMPEZA DAS COPYS (v1) ═══
// Roda uma vez por navegador: apaga copys e caches de copys guardados localmente.
(function limparCopysLocais() {
  try {
    if (localStorage.getItem('gerador_limpeza_v1')) return;
    ['gerador_copys_custom', 'gerador_mineradas_cache', 'gerador_recentes', 'gerador_grade_manual', 'gerador_copy_counts', 'gerador_vistos_disparos']
      .forEach((k) => localStorage.removeItem(k));
    Object.keys(localStorage).filter((k) => k.startsWith('gerador_vistos_')).forEach((k) => localStorage.removeItem(k));
    localStorage.setItem('gerador_limpeza_v1', '1');
  } catch (e) { /* sem localStorage: nada a limpar */ }
})();

// ═══════════════════════════════════════════════ LOGIN + ATIVIDADE (Firebase) ═══

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCJ8kKdGZHhHzsFYicUGzyy9Z_J-aoiPmM",
  authDomain: "synora-copys.firebaseapp.com",
  projectId: "synora-copys",
  storageBucket: "synora-copys.firebasestorage.app",
  messagingSenderId: "201340469613",
  appId: "1:201340469613:web:59825e32a56ebe13d2da64"
};
const ADMIN_EMAIL = 'rickempresa1@gmail.com';

firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db = firebase.firestore();
let usuarioAtual = null;
let souAdmin = false;
let feedAdminAtivo = false;
let unsubAtividade = null;
let unsubFuncionarios = null;

function configurarLogin() {
  const overlay = document.getElementById('loginOverlay');
  const shell = document.getElementById('appShell');
  const msg = document.getElementById('loginMsg');

  document.getElementById('loginForm').addEventListener('submit', (e) => { e.preventDefault(); fazerLogin(); });

  async function fazerLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;
    if (!email || !senha) { msg.textContent = 'Preenche e-mail e senha.'; return; }
    const btn = document.getElementById('btnLogin');
    btn.disabled = true;
    btn.textContent = 'Entrando…';
    msg.textContent = '';
    try {
      await auth.signInWithEmailAndPassword(email, senha);
    } catch (err) {
      const mapa = {
        'auth/invalid-email': 'E-mail inválido.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
        'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco.'
      };
      msg.textContent = mapa[err.code] || ('Erro: ' + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  }

  document.getElementById('btnLogout').addEventListener('click', () => auth.signOut());

  auth.onAuthStateChanged(async (user) => {
    usuarioAtual = user;

    // Limpa qualquer estado/listener da sessão anterior (evita vazar dado de uma conta pra outra na mesma aba)
    if (unsubAtividade) { unsubAtividade(); unsubAtividade = null; }
    if (unsubFuncionarios) { unsubFuncionarios(); unsubFuncionarios = null; }
    if (unsubFavoritos) { unsubFavoritos(); unsubFavoritos = null; }
    if (unsubFeedbackCopy) { unsubFeedbackCopy(); unsubFeedbackCopy = null; }
    if (unsubRegrasIA) { unsubRegrasIA(); unsubRegrasIA = null; }
    if (unsubPromptBase) { unsubPromptBase(); unsubPromptBase = null; }
    if (unsubMetricas) { unsubMetricas(); unsubMetricas = null; }
    feedAdminAtivo = false;
    feedFuncionariosAtivo = false;
    favoritos = [];
    feedbackCopy = {};
    regrasIA = [];
    metricasGlobais = { copysGeradas: 0, copysCopiadas: 0, porHora: {} };
    const listaFunc = document.getElementById('listaFuncionarios');
    const listaAtiv = document.getElementById('atividadeEquipe');
    if (listaFunc) listaFunc.innerHTML = '';
    if (listaAtiv) listaAtiv.innerHTML = '';
    irParaTab('dashboard', { semHash: true });

    if (!user) {
      souAdmin = false;
      document.getElementById('navAdmin').classList.add('hidden');
      overlay.classList.remove('hidden');
      shell.hidden = true;
      document.getElementById('loginEmail').value = '';
      document.getElementById('loginSenha').value = '';
      return;
    }

    if (!user.displayName) {
      const nome = prompt('Bem-vindo! Como podemos te chamar?');
      if (nome && nome.trim()) { try { await user.updateProfile({ displayName: nome.trim() }); } catch (e) {} }
    }

    souAdmin = user.email === ADMIN_EMAIL;
    document.getElementById('navAdmin').classList.toggle('hidden', !souAdmin);
    document.getElementById('usuarioLogado').textContent = '👤 ' + (user.displayName || user.email);

    overlay.classList.add('hidden');
    shell.hidden = false;
    setTimeout(atualizarNavGlider, 0);

    const ativo = await upsertFuncionario(user);
    if (!ativo && !souAdmin) {
      overlay.classList.remove('hidden');
      shell.hidden = true;
      msg.textContent = 'Sua conta foi desativada. Fale com o administrador.';
      msg.style.color = 'var(--red)';
      await auth.signOut();
      return;
    }

    registrarAtividade('Entrou no sistema', '');
    iniciarFeedFavoritos();
    iniciarFeedFeedbackCopy();
    iniciarFeedRegrasIA();
    iniciarFeedPromptBase(false);
    iniciarFeedMetricas();
    if (souAdmin) { iniciarFeedAdmin(); iniciarFeedFuncionarios(); limparCopysFirestore(); }
  });
}

// Roda uma vez (marcada em metricas/limpeza_copys): apaga favoritos, avaliações e contadores de copys da equipe.
async function limparCopysFirestore() {
  try {
    const marca = db.collection('metricas').doc('limpeza_copys');
    const snapMarca = await marca.get();
    if (snapMarca.exists && snapMarca.data().v2) return;
    let total = 0;
    for (const nome of ['favoritos', 'feedback_copy']) {
      const snap = await db.collection(nome).get();
      for (let i = 0; i < snap.docs.length; i += 400) {
        const lote = db.batch();
        snap.docs.slice(i, i + 400).forEach((d) => lote.delete(d.ref));
        await lote.commit();
      }
      total += snap.size;
    }
    await db.collection('metricas').doc('global').set({ copysGeradas: 0, copysCopiadas: 0, porHora: {} });
    await marca.set({ v1: true, v2: true, apagados: total, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    toast(`Limpeza feita: ${total} favoritos/avaliações apagados`);
  } catch (err) {
    console.error('[limpeza]', err);
    toast('Erro na limpeza das copys: ' + err.message);
  }
}

async function upsertFuncionario(user) {
  try {
    const ref = db.collection('funcionarios').doc(user.uid);
    const snap = await ref.get();
    const dados = {
      nome: user.displayName || user.email,
      email: user.email,
      ultimoAcesso: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (!snap.exists) {
      dados.cargo = souAdmin ? 'Administrador' : 'Funcionário';
      dados.ativo = true;
    }
    await ref.set(dados, { merge: true });
    const atual = snap.exists ? snap.data() : dados;
    return atual.ativo !== false;
  } catch (err) {
    console.error('[funcionarios]', err);
    return true;
  }
}

const CORES_AVATAR = ['#a855f7', '#ec4899', '#34d399', '#fbbf24', '#60a5fa', '#f472b6', '#38bdf8', '#fb923c'];
function corAvatar(texto) {
  let h = 0;
  for (let i = 0; i < texto.length; i++) h = texto.charCodeAt(i) + ((h << 5) - h);
  return CORES_AVATAR[Math.abs(h) % CORES_AVATAR.length];
}
function iniciais(nome) {
  const partes = (nome || '?').trim().split(/\s+/);
  return ((partes[0]?.[0] || '') + (partes[1]?.[0] || '')).toUpperCase() || '?';
}

let feedFuncionariosAtivo = false;
let funcionariosCache = [];
function iniciarFeedFuncionarios() {
  if (feedFuncionariosAtivo) return;
  feedFuncionariosAtivo = true;
  unsubFuncionarios = db.collection('funcionarios').orderBy('nome')
    .onSnapshot((snap) => {
      funcionariosCache = snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
      renderListaFuncionarios();
    }, (err) => console.error('[feed funcionarios]', err));

  const busca = document.getElementById('buscaFuncionarios');
  if (busca && !busca.dataset.ligado) {
    busca.dataset.ligado = '1';
    busca.addEventListener('input', renderListaFuncionarios);
  }
}

function renderListaFuncionarios() {
  const container = document.getElementById('listaFuncionarios');
  if (!container) return;
  const termo = (document.getElementById('buscaFuncionarios')?.value || '').toLowerCase().trim();
  const lista = termo ? funcionariosCache.filter((d) => (d.nome || '').toLowerCase().includes(termo) || (d.email || '').toLowerCase().includes(termo)) : funcionariosCache;
  if (!lista.length) { container.innerHTML = `<p class="empty-hint">${funcionariosCache.length ? 'Nenhum funcionário encontrado.' : 'Nenhum funcionário ainda.'}</p>`; return; }
  container.innerHTML = lista.map((d) => {
    const uidItem = d.uid;
    const acesso = d.ultimoAcesso ? d.ultimoAcesso.toDate().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '—';
    const cargo = d.cargo || 'Funcionário';
    const ativo = d.ativo !== false;
    const ehVoceMesmo = usuarioAtual && uidItem === usuarioAtual.uid;
    const geradas = d.copysGeradas || 0;
    const usadas = d.copysUsadas || 0;
    const fBoa = d.feedbackBoa || 0;
    const fRuim = d.feedbackRuim || 0;
    const totalF = fBoa + fRuim;
    const pctF = totalF ? Math.round((fBoa / totalF) * 100) + '% positivo' : '—';
    return `<div class="funcionario-item ${ativo ? '' : 'funcionario-inativo'}">
      <div class="funcionario-avatar" style="background:${corAvatar(d.nome || d.email || uidItem)}">${esc(iniciais(d.nome))}</div>
      <div class="funcionario-info">
        <div class="funcionario-nome">${esc(d.nome || '—')} <span class="funcionario-cargo-badge">${esc(cargo)}</span>${ativo ? '' : ' <span class="funcionario-cargo-badge funcionario-badge-inativo">Desativado</span>'}</div>
        <div class="funcionario-email">${esc(d.email || '')}</div>
        <div class="funcionario-stats">✨ ${geradas} geradas · 📋 ${usadas} usadas · 👍 ${esc(pctF)}</div>
      </div>
      <select class="funcionario-cargo-select" data-uid="${escAttr(uidItem)}">
        <option value="Funcionário" ${cargo === 'Funcionário' ? 'selected' : ''}>Funcionário</option>
        <option value="Sênior" ${cargo === 'Sênior' ? 'selected' : ''}>Sênior</option>
        <option value="Administrador" ${cargo === 'Administrador' ? 'selected' : ''}>Administrador</option>
      </select>
      ${ehVoceMesmo ? '' : `<div class="funcionario-acoes">
        <button class="btn btn-sm ${ativo ? 'btn-secondary' : 'btn-primary'} funcionario-toggle-ativo" data-uid="${escAttr(uidItem)}" data-ativo="${ativo}">${ativo ? 'Desativar' : 'Ativar'}</button>
        <button class="icon-btn funcionario-excluir" data-uid="${escAttr(uidItem)}" title="Excluir registro">🗑</button>
      </div>`}
      <div class="funcionario-meta">Último acesso<br>${esc(acesso)}</div>
    </div>`;
  }).join('');
  container.querySelectorAll('.funcionario-cargo-select').forEach((sel) => {
    sel.addEventListener('change', () => {
      db.collection('funcionarios').doc(sel.dataset.uid).update({ cargo: sel.value })
        .then(() => toast('Cargo atualizado.'))
        .catch((err) => toast('Erro: ' + err.message));
    });
  });
  container.querySelectorAll('.funcionario-toggle-ativo').forEach((btn) => {
    btn.addEventListener('click', () => {
      const estavaAtivo = btn.dataset.ativo === 'true';
      const nomeItem = btn.closest('.funcionario-item').querySelector('.funcionario-nome').textContent.trim();
      if (estavaAtivo && !confirm(`Desativar o acesso de "${nomeItem}"? A pessoa não vai mais conseguir entrar.`)) return;
      db.collection('funcionarios').doc(btn.dataset.uid).update({ ativo: !estavaAtivo })
        .then(() => toast(estavaAtivo ? 'Acesso desativado.' : 'Acesso reativado.'))
        .catch((err) => toast('Erro: ' + err.message));
    });
  });
  container.querySelectorAll('.funcionario-excluir').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nomeItem = btn.closest('.funcionario-item').querySelector('.funcionario-nome').textContent.trim();
      if (!confirm(`Excluir "${nomeItem}" da lista de funcionários?\n\nIsso apaga o registro e as estatísticas dela. Se a senha ainda for válida, a pessoa consegue entrar de novo e volta a aparecer como ativa — pra bloquear o acesso de vez, use "Desativar" antes de excluir.`)) return;
      db.collection('funcionarios').doc(btn.dataset.uid).delete()
        .then(() => { toast('Funcionário excluído.'); registrarAtividade('Excluiu um funcionário', nomeItem); })
        .catch((err) => toast('Erro: ' + err.message));
    });
  });
}

function registrarAtividade(acao, detalhe) {
  if (!usuarioAtual) return;
  db.collection('atividade').add({
    uid: usuarioAtual.uid,
    nome: usuarioAtual.displayName || usuarioAtual.email,
    acao,
    detalhe: (detalhe || '').slice(0, 200),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).catch((err) => console.error('[atividade]', err));
}

function hashTexto(texto) {
  let h = 0;
  const s = (texto || '').slice(0, 300);
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return 'c' + Math.abs(h).toString(36);
}

// Copy marcada como "ruim" some da equipe toda (não dá pra apagar da planilha/arquivo de verdade, só escondemos)
function naoEhRuim(texto) {
  return feedbackCopy[hashTexto(texto)] !== 'ruim';
}

// ═══════════════════════════════════════════════ FAVORITOS COMPARTILHADOS (equipe) ═══

function iniciarFeedFavoritos() {
  if (unsubFavoritos) return;
  unsubFavoritos = db.collection('favoritos').onSnapshot((snap) => {
    favoritosDocs = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((d) => d.texto)
      .sort((a, b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
    favoritos = favoritosDocs.map((d) => d.texto);
    renderDashboard();
    renderFavoritos();
  }, (err) => console.error('[favoritos]', err));
}

function toggleFavorito(texto, meta) {
  if (!usuarioAtual || !texto) return false;
  const id = hashTexto(texto);
  const ref = db.collection('favoritos').doc(id);
  const jaEhFavorito = favoritos.includes(texto);
  if (jaEhFavorito) {
    favoritos = favoritos.filter((t) => t !== texto);
    ref.delete().catch((err) => toast('Erro: ' + err.message));
  } else {
    favoritos = favoritos.concat(texto);
    const base = {
      adicionadoPor: usuarioAtual.displayName || usuarioAtual.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    ref.set({ ...base, texto: texto.slice(0, 4000), origem: meta?.origem || 'disparo', categoria: meta?.categoria || '' })
      // Se as regras do Firestore só aceitarem o formato antigo, salva do jeito antigo em vez de perder o favorito
      .catch((err) => {
        console.warn('[favoritos] formato novo recusado, tentando o antigo:', err.message);
        return ref.set({ ...base, texto: texto.slice(0, 300) });
      })
      .catch((err) => {
        favoritos = favoritos.filter((t) => t !== texto);
        document.querySelectorAll('.btn-fav').forEach((b) => { if (b.dataset.texto === texto) b.classList.remove('favorito-ativo'); });
        toast('Não deu pra favoritar: ' + err.message);
      });
  }
  registrarAtividade(jaEhFavorito ? 'Desfavoritou uma copy' : 'Favoritou uma copy', texto.slice(0, 80));
  return !jaEhFavorito;
}

// Um handler só pra toda ⭐ do app (cards, Gerador, Grade do Dia, aba Favoritos)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-fav');
  if (!btn) return;
  const texto = btn.dataset.texto;
  const ativo = toggleFavorito(texto, { origem: btn.dataset.origem, categoria: btn.dataset.cat });
  document.querySelectorAll('.btn-fav').forEach((b) => { if (b.dataset.texto === texto) b.classList.toggle('favorito-ativo', ativo); });
  toast(ativo ? '⭐ Salva nos favoritos' : 'Removida dos favoritos');
});

function botaoFavHtml(texto, origem, categoria) {
  const ativo = favoritos.includes(texto);
  return `<button class="icon-btn btn-fav ${ativo ? 'favorito-ativo' : ''}" title="${ativo ? 'Remover dos favoritos' : 'Favoritar'}" data-texto="${escAttr(texto)}" data-origem="${escAttr(origem || '')}" data-cat="${escAttr(categoria || '')}">⭐</button>`;
}

// ═══════════════════════════════════════════════ COPYS NOVAS (desde a última visita) ═══
// Guarda no navegador os ids das copys já vistas. Na 1ª vez marca tudo como visto, pra não acender 1.500 "novas".

const novidades = { mineradas: new Set(), disparos: new Set() };
const somenteNovas = { mineradas: false, disparos: false };

function idMinerada(c) { return hashTexto((c.modelo || '') + '|' + (c.mensagem || '')); }

function calcularNovidades(tipo, ids) {
  const chave = 'gerador_vistos_' + tipo;
  const vistos = safeParse(chave, null);
  if (!Array.isArray(vistos)) {
    localStorage.setItem(chave, JSON.stringify(ids));
    novidades[tipo] = new Set();
  } else {
    const jaVistos = new Set(vistos);
    novidades[tipo] = new Set(ids.filter((id) => !jaVistos.has(id)));
  }
  atualizarSinalNovidades(tipo);
}

function marcarComoVistas(tipo) {
  if (!novidades[tipo].size) return;
  const chave = 'gerador_vistos_' + tipo;
  const vistos = new Set(safeParse(chave, []));
  novidades[tipo].forEach((id) => vistos.add(id));
  try { localStorage.setItem(chave, JSON.stringify([...vistos])); } catch (e) { /* cota cheia */ }
  novidades[tipo] = new Set();
  somenteNovas[tipo] = false;
  atualizarSinalNovidades(tipo);
}

function atualizarSinalNovidades(tipo) {
  const qtd = novidades[tipo].size;
  const badge = document.querySelector(`.nav-item[data-tab="${tipo}"] .nav-badge`);
  if (badge) { badge.textContent = qtd > 99 ? '99+' : qtd; badge.hidden = !qtd; }
  const chip = document.getElementById('chipNovas-' + tipo);
  if (chip) {
    chip.hidden = !qtd;
    chip.classList.toggle('ativo', somenteNovas[tipo]);
    chip.querySelector('.chip-novas-qtd').textContent = qtd;
  }
  const kpi = document.getElementById('kpiNovasMineradas');
  if (kpi && tipo === 'mineradas') { kpi.textContent = '+' + qtd + ' novas'; kpi.hidden = !qtd; }
}

// ═══════════════════════════════════════════════ ABA FAVORITOS ═══

const ORIGEM_FAV = {
  disparo: { nome: 'Banco', icone: '➤' },
  minerada: { nome: 'Copys', icone: '▤' },
  ia: { nome: 'IA', icone: '✨' }
};
let filtroOrigemFav = 'todas';

function renderFavoritos() {
  const container = document.getElementById('listaFavoritos');
  if (!container) return;
  const termo = (document.getElementById('buscaFavoritos').value || '').toLowerCase().trim();
  const contagem = { todas: favoritosDocs.length, disparo: 0, minerada: 0, ia: 0 };
  favoritosDocs.forEach((d) => { const o = ORIGEM_FAV[d.origem] ? d.origem : 'disparo'; contagem[o]++; });
  document.querySelectorAll('#filtroOrigemFav [data-origem]').forEach((b) => {
    b.classList.toggle('ativo', b.dataset.origem === filtroOrigemFav);
    b.querySelector('.fav-count').textContent = contagem[b.dataset.origem] || 0;
  });

  const lista = favoritosDocs.filter((d) => {
    const o = ORIGEM_FAV[d.origem] ? d.origem : 'disparo';
    return (filtroOrigemFav === 'todas' || o === filtroOrigemFav) && (!termo || d.texto.toLowerCase().includes(termo) || (d.categoria || '').toLowerCase().includes(termo));
  });
  if (!lista.length) {
    container.innerHTML = `<div class="empty-state"><span class="empty-ico">⭐</span><p>${favoritosDocs.length ? 'Nenhum favorito com esse filtro.' : 'Nenhuma copy favoritada ainda. Toque na ⭐ de qualquer copy (da aba Copys ou gerada pela IA) pra guardar aqui.'}</p></div>`;
    return;
  }
  container.innerHTML = lista.map((d) => {
    const o = ORIGEM_FAV[d.origem] ? d.origem : 'disparo';
    return cardCopyHtml({
      texto: d.texto, categoria: d.categoria || ORIGEM_FAV[o].nome, icone: ORIGEM_FAV[o].icone, comIA: true,
      origem: 'favorito', origemFav: o,
      data: d.adicionadoPor ? 'por ' + d.adicionadoPor : ''
    });
  }).join('');
  ligarEventosCard(container);
}

function configurarNovidades() {
  ['mineradas'].forEach((tipo) => {
    const chip = document.getElementById('chipNovas-' + tipo);
    chip.addEventListener('click', (e) => {
      if (e.target.closest('.chip-novas-ok')) { marcarComoVistas(tipo); }
      else { somenteNovas[tipo] = !somenteNovas[tipo]; atualizarSinalNovidades(tipo); }
      paginaMineradas = 1; aplicarFiltroMineradas();
    });
  });
  // Fechou o app com a aba aberta = viu
  window.addEventListener('pagehide', () => { if (novidades[abaAtual]) marcarComoVistas(abaAtual); });
}

function configurarFavoritos() {
  document.getElementById('buscaFavoritos').addEventListener('input', renderFavoritos);
  document.querySelectorAll('#filtroOrigemFav [data-origem]').forEach((b) => b.addEventListener('click', () => {
    filtroOrigemFav = b.dataset.origem;
    renderFavoritos();
  }));
}

// ═══════════════════════════════════════════════ FEEDBACK DE COPY (boa/ruim, treina a IA) ═══

function iniciarFeedFeedbackCopy() {
  if (unsubFeedbackCopy) return;
  unsubFeedbackCopy = db.collection('feedback_copy').onSnapshot((snap) => {
    feedbackCopy = {};
    snap.docs.forEach((d) => { feedbackCopy[d.id] = d.data().avaliacao; });
    if (typeof todasMineradas !== 'undefined' && todasMineradas.length) aplicarFiltroMineradas();
  }, (err) => console.error('[feedback_copy]', err));
}

function avaliarCopy(texto, avaliacao) {
  if (!usuarioAtual) return;
  const id = hashTexto(texto);
  const ref = db.collection('feedback_copy').doc(id);
  const atual = feedbackCopy[id];
  if (atual === avaliacao) {
    ref.delete().catch((err) => toast('Erro: ' + err.message));
    registrarAtividade('Removeu avaliação de copy', texto.slice(0, 80));
  } else {
    ref.set({
      texto: texto.slice(0, 300),
      avaliacao,
      avaliadoPor: usuarioAtual.displayName || usuarioAtual.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch((err) => toast('Erro: ' + err.message));
    registrarAtividade(avaliacao === 'boa' ? 'Marcou copy como boa' : 'Marcou copy como ruim', texto.slice(0, 80));
    incrementarContadorFuncionario(avaliacao === 'boa' ? 'feedbackBoa' : 'feedbackRuim', 1);
  }
}

// Busca as últimas 40 avaliadas (cache de 5 min) e sorteia uma amostra, pra IA não ver sempre os mesmos exemplos
const cacheExemplos = {};
async function buscarExemplosAvaliados(avaliacao, limite) {
  const c = cacheExemplos[avaliacao];
  if (!c || Date.now() - c.ts > 5 * 60 * 1000) {
    try {
      const snap = await db.collection('feedback_copy').where('avaliacao', '==', avaliacao).orderBy('timestamp', 'desc').limit(40).get();
      cacheExemplos[avaliacao] = { ts: Date.now(), textos: snap.docs.map((d) => d.data().texto).filter(Boolean) };
    } catch (err) {
      console.error('[buscarExemplosAvaliados]', err);
      return [];
    }
  }
  return amostra(cacheExemplos[avaliacao].textos, limite);
}


function amostra(lista, n) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copia[i], copia[j]] = [copia[j], copia[i]]; }
  return copia.slice(0, n);
}


// ═══════════════════════════════════════════════ REGRAS DA IA (Treinar IA) ═══

function iniciarFeedRegrasIA() {
  if (unsubRegrasIA) return;
  unsubRegrasIA = db.collection('regras_ia').orderBy('timestamp', 'desc').onSnapshot((snap) => {
    regrasIA = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }, (err) => console.error('[regras_ia]', err));
}





// ═══════════════════════════════════════════════ MÉTRICAS COMPARTILHADAS ═══

function iniciarFeedMetricas() {
  if (unsubMetricas) return;
  unsubMetricas = db.collection('metricas').doc('global').onSnapshot((doc) => {
    metricasGlobais = doc.exists ? { copysGeradas: 0, copysCopiadas: 0, porHora: {}, ...doc.data() } : { copysGeradas: 0, copysCopiadas: 0, porHora: {} };
    renderDashboard();
  }, (err) => console.error('[metricas]', err));
}


function incrementarContadorFuncionario(campo, valor) {
  if (!usuarioAtual) return;
  db.collection('funcionarios').doc(usuarioAtual.uid).set({
    [campo]: firebase.firestore.FieldValue.increment(valor)
  }, { merge: true }).catch((err) => console.error('[funcionario incrementar]', err));
}

function iniciarFeedAdmin() {
  if (feedAdminAtivo) return;
  feedAdminAtivo = true;
  unsubAtividade = db.collection('atividade').orderBy('timestamp', 'desc').limit(50)
    .onSnapshot((snap) => {
      const container = document.getElementById('atividadeEquipe');
      if (!container) return;
      if (snap.empty) { container.innerHTML = '<p class="empty-hint">Nenhuma atividade ainda.</p>'; return; }
      container.innerHTML = snap.docs.map((doc) => {
        const d = doc.data();
        const hora = d.timestamp ? d.timestamp.toDate().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '…';
        return `<div class="activity-item"><span class="activity-dot"></span>
          <div><div class="activity-text"><b>${esc(d.nome || '—')}</b> · ${esc(d.acao || '')}${d.detalhe ? ' — ' + esc(d.detalhe) : ''}</div><div class="activity-meta">${esc(hora)}</div></div>
        </div>`;
      }).join('');
    }, (err) => console.error('[feed admin]', err));
}

function configurarCriarAtendente() {
  const btn = document.getElementById('btnCriarAtendente');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const nome = document.getElementById('novoAtendenteNome').value.trim();
    const email = document.getElementById('novoAtendenteEmail').value.trim();
    const senha = document.getElementById('novoAtendenteSenha').value;
    const cargo = document.getElementById('novoAtendenteCargo').value;
    const msg = document.getElementById('criarAtendenteMsg');
    msg.className = 'login-msg';
    if (!nome || !email || !senha) { msg.textContent = 'Preenche nome, e-mail e senha.'; return; }
    if (senha.length < 6) { msg.textContent = 'Senha precisa ter no mínimo 6 caracteres.'; return; }

    btn.disabled = true;
    btn.textContent = 'Criando…';
    msg.textContent = '';

    // Usa um app Firebase secundário só pra criar a conta, sem trocar a sua sessão de admin
    const nomeAppSecundario = 'CriarAtendente_' + Date.now();
    const appSecundario = firebase.initializeApp(FIREBASE_CONFIG, nomeAppSecundario);
    const authSecundario = appSecundario.auth();
    try {
      const cred = await authSecundario.createUserWithEmailAndPassword(email, senha);
      await cred.user.updateProfile({ displayName: nome });
      const novoUid = cred.user.uid;
      await authSecundario.signOut();
      await db.collection('funcionarios').doc(novoUid).set({
        nome, email, cargo,
        ultimoAcesso: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      msg.style.color = 'var(--green)';
      msg.textContent = `Conta de "${nome}" criada! Já pode passar o e-mail e a senha pra ela.`;
      document.getElementById('novoAtendenteNome').value = '';
      document.getElementById('novoAtendenteEmail').value = '';
      document.getElementById('novoAtendenteSenha').value = '';
      registrarAtividade('Criou login de atendente', `${nome} (${email})`);
    } catch (err) {
      const mapa = {
        'auth/email-already-in-use': 'Já existe uma conta com esse e-mail.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres).'
      };
      msg.style.color = 'var(--red)';
      msg.textContent = mapa[err.code] || ('Erro: ' + err.message);
    } finally {
      await appSecundario.delete();
      btn.disabled = false;
      btn.textContent = 'Criar Conta';
    }
  });
}

// ═══════════════════════════════════════════════ CONFIG (localStorage) ═══

const CONFIG_PADRAO = {
  sheetsUrl: '',
  openrouterKey: '',
  openrouterModel: 'google/gemini-2.5-flash',
  persona: 'Letícia Vargas, 18 anos, universitária, vocabulário: "vida", "corre lá", "prévia", "amor", "bb"',
  personaTipo: 'universitaria',
  comprimento: 'medio',
  emoji: '2',
  tom: 'natural',
  abreviacoes: 'sim',
  personaAtivaId: 'default'
};

// ═══════════════════════════════════════════════ PERSONAS SALVAS (presets) ═══

function uid() { return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }



const TIPO_PERSONA_DESC = {
  universitaria: 'Universitária, patricinha de família tradicional/rígida — comportada e certinha por fora, safadinha por dentro, faz tudo escondido.',
  novinha: 'Novinha traquina e curiosa, adora provocar, testar limites e brincar com a curiosidade do lead.',
  casada: 'Casada discreta, safada escondido do marido — a adrenalina do proibido é o gatilho principal.',
  dominadora: 'Dominadora — assume o controle da conversa, manda, testa e submete o lead ao seu ritmo.',
  carente: 'Carente e romântica — busca conexão emocional e afeto antes de esquentar o papo.',
  vizinha: 'Vizinha gostosa e disponível — tom informal, brincalhão, de quem "mora ali do lado".',
  coroa: 'Mulher mais velha e segura de si, sem joguinho — ensina e guia o lead com confiança e experiência.',
  timida: 'Tímida e insegura, primeira vez nesse tipo de conteúdo — desperta vontade de incentivar e sensação de exclusividade por ser "a primeira vez dela".',
  executiva: 'Executiva estressada, trabalha o dia todo — busca o papo como válvula de escape e recompensa depois de um dia puxado.',
  professora: 'Postura de comando com verniz educacional — "ensina" o lead, fantasia de autoridade e aprendizado.',
  proibida: 'Está online escondida (do namorado, da família) — sensação de risco, urgência e proibido.',
  popstar: 'Vida badalada e exclusiva — poucos têm acesso a ela, gera senso de status e sorte por ser escolhido.',
  interiorana: 'Jeito caseiro e simples do interior — contraste entre inocência e safadeza foge do padrão "sofisticada".',
  sortuda: 'Acabou de ganhar algo bom e está eufórica/generosa — usa o clima bom como gancho pra mimar e ser mimada.',
  custom: ''
};

const COMPRIMENTO_TOKENS = { curto: 120, medio: 350, longo: 650 };
function tokensParaComprimento(mult = 1) {
  const cfg = getConfig();
  return (COMPRIMENTO_TOKENS[cfg.comprimento] || COMPRIMENTO_TOKENS.medio) * mult;
}

const COMPRIMENTO_DESC = {
  curto: 'Escreva BEM curto: 1 linha só, direta, sem enrolação.',
  medio: 'Escreva médio: 2 a 3 linhas, no ritmo de uma mensagem real de zap.',
  longo: 'Escreva mais longo: 4 a 6 linhas, com um mini storytelling antes do gancho final.'
};

const EMOJI_DESC = {
  nenhum: 'Não use nenhum emoji.',
  '1': 'Use no máximo 1 emoji na copy toda.',
  '2': 'Use no máximo 2 emojis na copy toda.'
};

const TOM_DESC = {
  natural: 'Tom natural, conversa como uma pessoa real, sem forçar personagem.',
  provocante: 'Tom mais provocante e ousado, insinua e provoca mais que o normal.',
  carinhosa: 'Tom mais carinhoso e afetuoso, busca conexão emocional antes de qualquer coisa.',
  direta: 'Tom direto e sem rodeios, vai direto ao ponto.'
};

const ABREV_DESC = {
  sim: 'Pode usar abreviações comuns de zap: "vc", "pq", "tb", "blz", "kkk".',
  nao: 'Não use abreviações — escreva as palavras por extenso.'
};

function getConfig() {
  try { return { ...CONFIG_PADRAO, ...JSON.parse(localStorage.getItem('gerador_config') || '{}') }; }
  catch (e) { return { ...CONFIG_PADRAO }; }
}
function salvarConfig(cfg) {
  localStorage.setItem('gerador_config', JSON.stringify({ ...getConfig(), ...cfg }));
}

const PAGE_INFO = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral do seu banco de copys' },
  gerador: { title: 'Gerador', subtitle: 'Sorteia copys da modelo prontas pra colar no disparo' },
  extrair: { title: 'Extrair', subtitle: 'Todas as copys de uma vez, no formato do disparo' },
  favoritos: { title: 'Favoritos', subtitle: 'As copys que a equipe guardou' },
  mineradas: { title: 'Copys', subtitle: 'Copys das modelos, direto do Google Docs' },
  admin: { title: 'Admin', subtitle: 'Criar acessos e ver a atividade da equipe' }
};

// ═══════════════════════════════════════════════ ESTADO ═══

const COR_TIPO = {
  Venda: '#ef4444', Saudacao: '#22c55e', Engajamento: '#3b82f6', Reengajamento: '#f97316',
  Conteudo: '#a855f7', Upsell: '#ec4899', Aquecimento: '#f472b6', Chamada: '#06b6d4',
  Pergunta: '#84cc16', Outro: '#64748b'
};

// Arquétipos possíveis de horário da grade — sem horário fixo, a grade sorteia
// entre 5 e 8 desses, em horários aleatórios do dia (veja gerarSlotsAleatorios()).
const TIPOS_GRADE = [
  { nome: 'Primeiro Contato', categorias: ['Primeiro Contato'], tipoMinerada: 'Saudacao' },
  { nome: 'Bom Dia', categorias: ['Bom Dia'], tipoMinerada: 'Saudacao' },
  { nome: 'Boa Noite', categorias: ['Boa Noite'], tipoMinerada: 'Aquecimento' },
  { nome: 'Gatilhos Sensuais', categorias: ['Gatilhos Sensuais'], tipoMinerada: 'Conteudo' },
  { nome: 'Gatilhos de Banho', categorias: ['Gatilhos de Banho'], tipoMinerada: 'Conteudo' },
  { nome: 'Gatilhos Temáticos', categorias: ['Gatilhos Temáticos'], tipoMinerada: 'Conteudo' },
  { nome: 'Reengajamento', categorias: ['Reengajamento'], tipoMinerada: 'Reengajamento' },
  { nome: 'Remarketing', categorias: ['Remarketing'], tipoMinerada: 'Reengajamento' },
  { nome: 'Aquecimento pra Pack', categorias: ['Aquecimento pra Pack'], tipoMinerada: 'Aquecimento' },
  { nome: 'Escassez e Urgência', categorias: ['Escassez e Urgência'], tipoMinerada: 'Venda' },
  { nome: 'Desconto e Bônus', categorias: ['Desconto e Bônus'], tipoMinerada: 'Venda' },
  { nome: 'Chamada com Preço', categorias: ['Chamada com Preço'], tipoMinerada: 'Venda' },
  { nome: 'Venda de Conteúdo', categorias: ['Venda de Conteúdo'], tipoMinerada: 'Venda' },
  { nome: 'Chamada de Vídeo', categorias: ['Chamada de Vídeo'], tipoMinerada: 'Chamada' }
];

function gerarSlotsAleatorios() {
  const qtd = 5 + Math.floor(Math.random() * 4); // 5 a 8
  const inicioMin = 8 * 60; // 08:00
  const fimMin = 23 * 60 + 30; // 23:30
  const janela = (fimMin - inicioMin) / qtd;
  const embaralhados = [...TIPOS_GRADE].sort(() => Math.random() - 0.5);
  const slots = [];
  for (let i = 0; i < qtd; i++) {
    const base = inicioMin + i * janela;
    const minuto = Math.round(base + Math.random() * Math.max(janela - 15, 5));
    const hh = String(Math.floor(minuto / 60)).padStart(2, '0');
    const mm = String(minuto % 60).padStart(2, '0');
    const arquetipo = embaralhados[i % embaralhados.length];
    slots.push({
      tag: 'S' + i,
      hora: `${hh}:${mm}`,
      tipo: arquetipo.nome,
      cor: COR_TIPO[arquetipo.tipoMinerada] || 'var(--accent)',
      categorias: arquetipo.categorias,
      tipoMinerada: arquetipo.tipoMinerada
    });
  }
  return slots;
}


let todasMineradas = [];
let mineradasFiltradas = [];
let paginaMineradas = 1;
// Script do Google Docs (extensão copys-privacy grava lá; o site só lê)
const DOCS_URL = 'https://script.google.com/macros/s/AKfycbyZZjrqt2ZdkhdU_C0k5cWqHdjR8uDrnwQ6bSQ4iiIbnAsdq18b4hqfyUuIFDYZaXnSbw/exec';
const DOCS_TOKEN = '300106';
const CATEGORIAS_COPYS = ['PPV', 'Prévias', 'Boas-vindas', 'Remarketing', 'Expirados', 'Promoções', 'VIP', 'Chamadas', 'Disparos em massa', 'Pós-venda', 'Reengajamento', 'Testes'];


let favoritos = []; // agora compartilhado via Firestore (coleção "favoritos"), veja iniciarFeedFavoritos()
let favoritosDocs = []; // mesmos favoritos com origem/categoria/quem salvou, pra aba Favoritos
let feedbackCopy = {}; // hash(texto) -> 'boa' | 'ruim', compartilhado via Firestore (coleção "feedback_copy")
let unsubFavoritos = null;
let unsubFeedbackCopy = null;
let regrasIA = []; // compartilhado via Firestore (coleção "regras_ia")
let unsubRegrasIA = null;
let metricasGlobais = { copysGeradas: 0, copysCopiadas: 0, porHora: {} }; // compartilhado via Firestore (metricas/global)
let unsubMetricas = null;
let copyCounts = safeParse('gerador_copy_counts', {});

function safeParse(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v || fallback; } catch (e) { return fallback; }
}

// ═══════════════════════════════════════════════ CLIPBOARD ═══

function copiarTexto(texto) {
  registrarCopia(texto);
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(texto).catch(() => fallbackCopy(texto));
  }
  return fallbackCopy(texto);
}
function fallbackCopy(texto) {
  return new Promise((resolve) => {
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    resolve();
  });
}
function registrarCopia(texto) {
  const chave = (texto || '').slice(0, 80);
  if (!chave) return;
  copyCounts[chave] = (copyCounts[chave] || 0) + 1;
  localStorage.setItem('gerador_copy_counts', JSON.stringify(copyCounts));
  registrarAtividade('Copiou uma copy', chave);
  incrementarContadorFuncionario('copysUsadas', 1);
  const hora = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', hour12: false });
  db.collection('metricas').doc('global').set({
    copysCopiadas: firebase.firestore.FieldValue.increment(1),
    ['porHora.' + hora]: firebase.firestore.FieldValue.increment(1)
  }, { merge: true }).catch((err) => console.error('[metricas copia]', err));
}

// ═══════════════════════════════════════════════ HELPERS ═══

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}
function escAttr(str) { return esc(str).replace(/"/g, '&quot;'); }
function formatarData(valor) {
  if (!valor) return '';
  const d = new Date(valor);
  if (isNaN(d.getTime())) return String(valor);
  const hoje = new Date();
  const mesmodia = d.toDateString() === hoje.toDateString();
  if (mesmodia) return 'Hoje ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function toast(msg) {
  const c = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}
function setStatus(texto, tipo) {
  const bar = document.getElementById('statusBar');
  bar.classList.remove('ok', 'erro', 'aviso');
  if (tipo) bar.classList.add(tipo);
  document.getElementById('statusTexto').textContent = texto;
  const sidebarStatus = document.getElementById('sidebarStatus');
  sidebarStatus.classList.remove('ok', 'warn');
  if (tipo === 'ok') sidebarStatus.classList.add('ok');
  else if (tipo === 'erro' || tipo === 'aviso') sidebarStatus.classList.add('warn');
  document.getElementById('sidebarStatusTxt').textContent = texto;
}

const ESTILOS_REESCRITA = {
  romantica: 'Reescreva no estilo ABERTURA ROMÂNTICA: carinhosa, vulnerável, cria conexão emocional e curiosidade afetiva.',
  safada: 'Reescreva no estilo ABERTURA SAFADA: direta, provocante, ativa o tesão imediato.',
  ego: 'Reescreva no estilo QUEBRA DE EGO: provoca o lead, faz ele querer provar valor, desafia ele.',
  controle: 'Reescreva no estilo ABERTURA DE CONTROLE: firme, decidida, modelo no comando.',
  curta: 'Reescreva em no máximo 1-2 linhas. Vai direto ao ponto, mantendo o tom provocante.'
};

// ═══════════════════════════════════════════════ TABS / NAV / SIDEBAR ═══

function atualizarNavGlider() {
  const glider = document.getElementById('navGlider');
  const ativo = document.querySelector('.nav-item.active');
  if (!glider || !ativo || ativo.offsetHeight === 0) return;
  glider.style.transform = `translateY(${ativo.offsetTop + 4}px)`;
  glider.style.height = (ativo.offsetHeight - 8) + 'px';
  glider.classList.add('pronto');
}
window.addEventListener('resize', atualizarNavGlider);

let abaAtual = 'dashboard';
function irParaTab(tab, opts) {
  if (!PAGE_INFO[tab]) return;
  if (tab === 'admin' && !souAdmin) tab = 'dashboard';
  if (abaAtual !== tab && novidades[abaAtual]) marcarComoVistas(abaAtual);
  abaAtual = tab;
  document.body.classList.toggle('aba-copys', tab === 'mineradas');
  document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === `tab-${tab}`));
  atualizarNavGlider();
  // Título no estilo da referência: etiqueta "0N / SEÇÃO" + última palavra em destaque
  const ordem = [...document.querySelectorAll('.nav-item')].map((b) => b.dataset.tab);
  const titulo = PAGE_INFO[tab].title.split(' ');
  const ultima = titulo.pop();
  document.getElementById('pageEyebrow').textContent = String(ordem.indexOf(tab) + 1).padStart(2, '0') + ' / ' + PAGE_INFO[tab].title;
  document.getElementById('pageTitle').innerHTML = titulo.length ? esc(titulo.join(' ')) + ' <span class="titulo-destaque">' + esc(ultima) + '</span>' : esc(ultima);
  document.getElementById('pageSubtitle').textContent = PAGE_INFO[tab].subtitle;
  fecharSidebarMobile();
  if (!opts || !opts.semHash) {
    history.replaceState(null, '', '#' + tab);
  }
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'favoritos') renderFavoritos();
  if (tab === 'gerador') abrirGerador();
  if (tab === 'extrair') abrirExtrair();
  renderAbasCopys();
}

function abrirTabDaHash() {
  const tab = (location.hash || '').replace('#', '');
  if (PAGE_INFO[tab]) irParaTab(tab, { semHash: true });
}

function abrirSidebarMobile() { document.getElementById('sidebar').classList.add('open'); document.getElementById('scrim').classList.add('show'); }
function fecharSidebarMobile() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('scrim').classList.remove('show'); }

function configurarNav() {
  document.querySelectorAll('.nav-item').forEach((btn) => btn.addEventListener('click', () => irParaTab(btn.dataset.tab)));
  document.getElementById('menuBtn').addEventListener('click', abrirSidebarMobile);
  document.getElementById('sidebarClose').addEventListener('click', fecharSidebarMobile);
  document.getElementById('scrim').addEventListener('click', fecharSidebarMobile);
}

function configurarConfigModal() {
  const backdrop = document.getElementById('modalBackdrop');
  document.getElementById('btnAbrirConfig').addEventListener('click', () => {
    const cfg = getConfig();
    document.getElementById('appsScriptUrlInput').value = cfg.sheetsUrl || '';
    document.getElementById('openRouterKeyInput').value = cfg.openrouterKey || '';
    document.getElementById('openRouterModelInput').value = cfg.openrouterModel || '';
    backdrop.classList.add('open');
  });
  document.getElementById('btnFecharConfig').addEventListener('click', () => backdrop.classList.remove('open'));
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.classList.remove('open'); });

  document.getElementById('btnSalvarConfigHeader').addEventListener('click', () => {
    salvarConfig({
      sheetsUrl: document.getElementById('appsScriptUrlInput').value.trim(),
      openrouterKey: document.getElementById('openRouterKeyInput').value.trim(),
      openrouterModel: document.getElementById('openRouterModelInput').value.trim() || CONFIG_PADRAO.openrouterModel
    });
    mostrarMsgConfig('Configurações salvas!', 'ok');
    toast('Configurações salvas.');
  });

  document.getElementById('btnTestarConfig').addEventListener('click', async () => {
    const key = document.getElementById('openRouterKeyInput').value.trim();
    if (!key) { mostrarMsgConfig('Cole a API Key do OpenRouter primeiro.', 'erro'); return; }
    const btn = document.getElementById('btnTestarConfig');
    btn.disabled = true;
    btn.textContent = 'Testando…';
    try {
      const modelo = document.getElementById('openRouterModelInput').value.trim() || CONFIG_PADRAO.openrouterModel;
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelo, messages: [{ role: 'user', content: 'Responda apenas "OK".' }], max_tokens: 10 })
      });
      if (resp.ok) mostrarMsgConfig('IA conectada! Modelo: ' + modelo, 'ok');
      else { const err = await resp.json().catch(() => ({})); mostrarMsgConfig('Erro: ' + (err.error?.message || resp.status), 'erro'); }
    } catch (err) {
      mostrarMsgConfig('Falha: ' + err.message, 'erro');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Testar IA';
    }
  });
}
function mostrarMsgConfig(texto, tipo) {
  const el = document.getElementById('msgConfig');
  el.textContent = texto;
  el.className = 'msg-config ' + (tipo === 'ok' ? 'ok' : 'erro');
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

// ═══════════════════════════════════════════════ MINERADAS ═══

function configurarMineradas() {
  document.getElementById('btnRecarregarMineradas').addEventListener('click', carregarMineradas);
  document.getElementById('buscaMineradas').addEventListener('input', () => { paginaMineradas = 1; aplicarFiltroMineradas(); });
  document.getElementById('filtroModeloMineradas').addEventListener('change', () => { paginaMineradas = 1; aplicarFiltroMineradas(); });
  document.getElementById('filtroTipoMineradas').addEventListener('change', () => { paginaMineradas = 1; aplicarFiltroMineradas(); });
  document.getElementById('buscaModelos').addEventListener('input', renderAbasCopys);
  configurarCalendario();
  document.getElementById('ordemCopys').addEventListener('change', (e) => { ordemCopys = e.target.value; aplicarFiltroMineradas(); });
  document.getElementById('periodoCopys').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-periodo]');
    if (!btn) return;
    periodoCopys = btn.dataset.periodo;
    calIni = calFim = null; rotuloCalendario();
    document.querySelectorAll('#periodoCopys button').forEach((b) => b.classList.toggle('ativo', b === btn));
    aplicarFiltroMineradas();
  });
  ['abasModelos', 'abasCategorias'].forEach((id) => document.getElementById(id).addEventListener('click', (e) => {
    const btn = e.target.closest('[data-valor]');
    if (!btn) return;
    const sel = document.getElementById(id === 'abasModelos' ? 'filtroModeloMineradas' : 'filtroTipoMineradas');
    sel.value = btn.dataset.valor;
    paginaMineradas = 1;
    if (id === 'abasModelos') {
      // modelo escolhida na barra lateral: abre a aba Copys já filtrada
      if (!document.getElementById('tab-mineradas').classList.contains('active')) irParaTab('mineradas');
      else fecharSidebarMobile();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    aplicarFiltroMineradas();
  }));
}

// Faixa de modelos (fotos da Privacy) e de categorias (contagem respeita a modelo escolhida)
let avataresModelos = {};
function normTexto(t) { return String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
function renderAbasCopys() {
  const selModelo = document.getElementById('filtroModeloMineradas');
  const selTipo = document.getElementById('filtroTipoMineradas');
  const termo = normTexto(document.getElementById('buscaModelos').value);
  // contagens sem repetição (mesma copy enviada várias vezes conta 1), igual à lista
  const chaveCopy = (c) => c.modelo + '|' + normTexto(c.mensagem);
  const unicas = (lista) => new Set(lista.map(chaveCopy)).size;
  const contagem = {};
  const vistos = new Set();
  todasMineradas.forEach((c) => { const k = chaveCopy(c); if (vistos.has(k)) return; vistos.add(k); contagem[c.modelo] = (contagem[c.modelo] || 0) + 1; });
  const modelos = [...selModelo.options].map((o) => o.value).filter(Boolean)
    .filter((m) => !termo || normTexto(m).includes(termo) || m === selModelo.value)
    .sort((x, y) => (contagem[y] || 0) - (contagem[x] || 0) || x.localeCompare(y));
  const item = (valor, nome, qtd, ativa) => {
    const foto = valor && avataresModelos[valor];
    return `<button type="button" class="sb-modelo ${ativa ? 'ativo' : ''}" data-valor="${escAttr(valor)}" role="listitem" title="${escAttr(nome)}" ${ativa ? 'aria-current="true"' : ''}>
      <span class="sb-av" style="--cor:${valor ? corAvatar(nome) : 'var(--accent)'}">${valor ? esc(iniciais(nome)) : '✦'}${foto ? `<img src="${escAttr(foto)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}</span>
      <span class="sb-nome${valor ? ' sb-nome-modelo' : ''}">${esc(valor ? nome : 'Todas as modelos')}</span>
      <span class="sb-qtd">${qtd}</span>
    </button>`;
  };
  const lista = document.getElementById('abasModelos');
  const copysAtivo = document.getElementById('tab-mineradas').classList.contains('active');
  lista.innerHTML = (termo ? '' : item('', 'Todas', vistos.size, copysAtivo && !selModelo.value))
    + modelos.map((m) => item(m, m, contagem[m] || 0, copysAtivo && selModelo.value === m)).join('')
    + (termo && !modelos.length ? '<p class="sb-vazio">Nenhuma modelo com esse nome</p>' : '')
    + (!todasMineradas.length ? '<p class="sb-vazio">Carregando…</p>' : '');
  lista.querySelectorAll('.sb-av img').forEach((img) => { img.onerror = () => img.remove(); });
  document.getElementById('sbTotalModelos').textContent = Object.keys(contagem).length || '';
  const sub = document.getElementById('pageSubtitle');
  if (copysAtivo && sub) sub.textContent = selModelo.value ? `Copys de ${selModelo.value}` : PAGE_INFO.mineradas.subtitle;

  const daModelo = todasMineradas.filter((c) => !selModelo.value || c.modelo === selModelo.value);
  renderHeroCopys(selModelo.value, daModelo, contagem);
  const extras = [...new Set(daModelo.map((c) => c.tipo).filter((t) => t && !CATEGORIAS_COPYS.includes(t)))];
  const cats = CATEGORIAS_COPYS.concat(extras);
  const atualTipo = selTipo.value;
  selTipo.innerHTML = '<option value="">Todas</option>' + cats.map((c) => `<option value="${escAttr(c)}">${esc(c)}</option>`).join('');
  selTipo.value = cats.includes(atualTipo) ? atualTipo : '';
  const tab = (valor, rotulo, qtd, ativa) => `<button type="button" class="cp-tab ${ativa ? 'ativo' : ''}" data-valor="${escAttr(valor)}" style="--cat:${COR_CATEGORIA[valor] || 'var(--accent)'}">${esc(rotulo)}<span>${qtd}</span></button>`;
  document.getElementById('abasCategorias').innerHTML = tab('', 'Todas', unicas(daModelo), !selTipo.value)
    + cats.map((c) => [c, unicas(daModelo.filter((x) => x.tipo === c))]).filter(([c, n]) => n || selTipo.value === c)
      .map(([c, n]) => tab(c, c, n, selTipo.value === c)).join('');
}

// Cabeçalho da aba Copys: quem é a modelo e os números dela
function renderHeroCopys(modelo, daModelo, contagem) {
  const hero = document.getElementById('cpHero');
  if (!hero) return;
  if (!todasMineradas.length) { hero.innerHTML = ''; return; }
  const vistos = new Set();
  const unicas = daModelo.filter((c) => { const k = c.modelo + '|' + normTexto(c.mensagem); if (vistos.has(k)) return false; vistos.add(k); return true; });
  const comPreco = unicas.filter((c) => Number(c.preco) > 0);
  const ticket = comPreco.length ? comPreco.reduce((t, c) => t + Number(c.preco), 0) / comPreco.length : 0;
  const cats = new Set(unicas.map((c) => c.tipo).filter(Boolean)).size;
  const ultima = Math.max(0, ...daModelo.map(tsCopy));
  const quando = ultima ? `${rotuloDia(inicioDoDia(ultima)).split(',')[0].toLowerCase()}${new Date(ultima).getHours() || new Date(ultima).getMinutes() ? ' às ' + new Date(ultima).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}` : '—';
  const stat = (valor, rotulo) => `<div class="cp-stat"><strong>${valor}</strong><span>${rotulo}</span></div>`;
  const av = (m, cls) => { const foto = avataresModelos[m]; return `<span class="${cls}" style="--cor:${corAvatar(m)}">${esc(iniciais(m))}${foto ? `<img src="${escAttr(foto)}" alt="" referrerpolicy="no-referrer">` : ''}</span>`; };
  let ident;
  if (modelo) {
    ident = `${av(modelo, 'cp-hero-av')}
      <div class="cp-hero-txt"><span class="cp-hero-eyebrow">Modelo</span><h2 class="cp-hero-nome">${esc(modelo)}</h2></div>`;
  } else {
    const top = Object.entries(contagem).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([m]) => m);
    ident = `<div class="cp-hero-pilha">${top.map((m) => av(m, 'cp-hero-av mini')).join('')}</div>
      <div class="cp-hero-txt"><span class="cp-hero-eyebrow">${Object.keys(contagem).length} modelos</span><h2 class="cp-hero-nome sem-cap">Todas as modelos</h2></div>`;
  }
  hero.innerHTML = `<div class="cp-hero-id">${ident}</div>
    <div class="cp-hero-stats">
      ${stat(unicas.length, unicas.length === 1 ? 'copy' : 'copys')}
      ${stat(cats, cats === 1 ? 'categoria' : 'categorias')}
      ${stat(ticket ? precoCopy(ticket) : '—', 'ticket médio')}
      ${stat(esc(quando), 'última copy')}
    </div>
    ${modelo ? `<button type="button" class="cp-hero-gerar" id="cpHeroGerar">🎲 Gerar copys dela</button>` : ''}`;
  hero.querySelectorAll('img').forEach((img) => { img.onerror = () => img.remove(); });
  const btn = document.getElementById('cpHeroGerar');
  if (btn) btn.addEventListener('click', () => { grModelo = modelo; trocouModeloGerador(); irParaTab('gerador'); });
}

async function carregarMineradas() {
  const btn = document.getElementById('btnRecarregarMineradas');
  btn.disabled = true;
  const textoOriginal = btn.textContent;
  btn.classList.add('girando');
  if (!todasMineradas.length) renderMineradas();
  setStatus(todasMineradas.length ? `${todasMineradas.length} copys (versão salva) — atualizando…` : 'Buscando copys do Google Docs…', 'aviso');

  try {
    const resp = await fetch(`${DOCS_URL}?acao=mineradas&token=${encodeURIComponent(DOCS_TOKEN)}`, { redirect: 'follow' });
    if (!resp.ok) throw new Error('Servidor retornou erro ' + resp.status);
    const data = await resp.json();
    if (data.status === 'erro') throw new Error(data.msg || data.mensagem);

    avataresModelos = data.avatares || {};
    aplicarDadosMineradas(data.copys || [], data.modelos);
    try { localStorage.setItem('gerador_mineradas_cache', JSON.stringify({ ts: Date.now(), copys: todasMineradas, modelos: data.modelos || null, avatares: avataresModelos })); } catch (e) { /* cota cheia: segue sem cache */ }
    const qtdNovas = novidades.mineradas.size;
    setStatus(`${todasMineradas.length} copys carregadas do Google Docs` + (qtdNovas ? ` · ${qtdNovas} nova${qtdNovas > 1 ? 's' : ''} desde sua última visita` : ' · nenhuma nova desde sua última visita'), 'ok');
  } catch (err) {
    if (todasMineradas.length) {
      setStatus('Não deu pra atualizar as copys agora (' + err.message + '). Mostrando a última versão salva.', 'aviso');
    } else {
      setStatus('Erro: ' + err.message, 'erro');
      document.getElementById('listaMineradas').innerHTML = `<div class="empty-state"><p>Erro ao carregar: ${esc(err.message)}</p></div>`;
    }
  } finally {
    btn.disabled = false;
    btn.textContent = textoOriginal;
    btn.classList.remove('girando');
  }
}

function aplicarDadosMineradas(copys, modelosServidor) {
  // o Google Docs guarda a quebra de linha da copy como quebra suave (\u000b): volta pra quebra normal
  copys.forEach((c) => { if (c.mensagem) c.mensagem = String(c.mensagem).replace(/[\u000b\r]/g, '\n'); });
  todasMineradas = copys;
  calcularNovidades('mineradas', todasMineradas.map(idMinerada));
  const modelos = modelosServidor || [...new Set(todasMineradas.map((c) => c.modelo).filter(Boolean))].sort();
  preencherSelect('filtroModeloMineradas', 'Todas as modelos', modelos);
  preencherSelect('filtroTipoMineradas', 'Todos os tipos', [...new Set(todasMineradas.map((c) => c.tipo).filter(Boolean))].sort());
  const pill = document.getElementById('pillCopys');
  pill.textContent = `${todasMineradas.length} copys · ${modelos.length} modelos`;
  pill.hidden = false;
  aplicarFiltroMineradas();
  renderDashboard();
  if (document.getElementById('tab-gerador').classList.contains('active')) abrirGerador();
  if (document.getElementById('tab-extrair').classList.contains('active')) abrirExtrair();
}

// Repopula um <select> mantendo o valor escolhido, se ainda existir
function preencherSelect(id, rotuloTodos, valores) {
  const sel = document.getElementById(id);
  const atual = sel.value;
  sel.innerHTML = `<option value="">${esc(rotuloTodos)}</option>` + valores.map((v) => `<option value="${escAttr(v)}">${esc(v)}</option>`).join('');
  sel.value = valores.includes(atual) ? atual : '';
}

// Mostra na hora a última versão salva da planilha; a atualização vem por trás
function carregarMineradasDoCache() {
  const cache = safeParse('gerador_mineradas_cache', null);
  if (!cache || !Array.isArray(cache.copys) || !cache.copys.length) return false;
  avataresModelos = cache.avatares || {};
  aplicarDadosMineradas(cache.copys, cache.modelos);
  return true;
}

// Estado da lista da aba Copys
let ordemCopys = 'recentes';
let periodoCopys = 'tudo';
let limiteCopys = 60;
let calIni = null, calFim = null;          // dias escolhidos no calendário (início do dia, ms)
let calMes = null;                          // mês mostrado (Date no dia 1)

function diasComCopy() {
  const modelo = document.getElementById('filtroModeloMineradas').value;
  const tipo = document.getElementById('filtroTipoMineradas').value;
  const porDia = {}; const vistos = new Set();
  todasMineradas.forEach((c) => {
    if ((modelo && c.modelo !== modelo) || (tipo && c.tipo !== tipo) || !tsCopy(c)) return;
    const k = c.modelo + '|' + normTexto(c.mensagem) + '|' + inicioDoDia(tsCopy(c));
    if (vistos.has(k)) return; vistos.add(k);
    const d = inicioDoDia(tsCopy(c)); porDia[d] = (porDia[d] || 0) + 1;
  });
  return porDia;
}

function rotuloCalendario() {
  const el = document.getElementById('calRotulo');
  const btn = document.getElementById('btnCalendario');
  const f = (ts) => new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  if (!calIni) { el.textContent = 'Datas'; btn.classList.remove('ativo'); return; }
  el.textContent = calFim && calFim !== calIni ? `${f(calIni)} – ${f(calFim)}` : f(calIni);
  btn.classList.add('ativo');
}

function renderCalendario() {
  const box = document.getElementById('calendarioCopys');
  const porDia = diasComCopy();
  const max = Math.max(1, ...Object.values(porDia));
  if (!calMes) {
    const ultimo = Math.max(0, ...Object.keys(porDia).map(Number));
    const base = ultimo ? new Date(ultimo) : new Date();
    calMes = new Date(base.getFullYear(), base.getMonth(), 1);
  }
  const ano = calMes.getFullYear(), mes = calMes.getMonth();
  const primeiroSemana = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const hoje = inicioDoDia(Date.now());
  const titulo = calMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  let celulas = '';
  for (let i = 0; i < primeiroSemana; i++) celulas += '<span></span>';
  for (let d = 1; d <= diasNoMes; d++) {
    const ts = new Date(ano, mes, d).getTime();
    const n = porDia[ts] || 0;
    const fim = calFim || calIni;
    const sel = calIni && ts >= calIni && ts <= fim;
    const borda = calIni && (ts === calIni || ts === fim);
    celulas += `<button type="button" class="cal-dia ${n ? 'tem' : ''} ${sel ? 'sel' : ''} ${borda ? 'borda' : ''} ${ts === hoje ? 'hoje' : ''}" data-ts="${ts}"
      style="--int:${(0.18 + 0.82 * n / max).toFixed(2)}" ${n ? `title="${n} ${n === 1 ? 'copy' : 'copys'}"` : 'title="Sem copys"'}>
      <span>${d}</span>${n ? `<i>${n}</i>` : ''}</button>`;
  }
  box.innerHTML = `<div class="cal-head">
      <button type="button" class="cal-nav" data-nav="-1" aria-label="Mês anterior">‹</button>
      <strong>${esc(titulo.charAt(0).toUpperCase() + titulo.slice(1))}</strong>
      <button type="button" class="cal-nav" data-nav="1" aria-label="Próximo mês">›</button>
    </div>
    <div class="cal-semana">${['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((x) => `<span>${x}</span>`).join('')}</div>
    <div class="cal-grade">${celulas}</div>
    <div class="cal-rodape">
      <span class="cal-dica">${calIni && !calFim ? 'Clique em outro dia pra fazer um período' : 'Clique num dia, ou em dois pra um período'}</span>
      <button type="button" class="cal-limpar" ${calIni ? '' : 'disabled'}>Limpar</button>
    </div>`;
}

function configurarCalendario() {
  const btn = document.getElementById('btnCalendario');
  const box = document.getElementById('calendarioCopys');
  const fechar = () => { box.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!box.hidden) return fechar();
    renderCalendario(); box.hidden = false; btn.setAttribute('aria-expanded', 'true');
  });
  box.addEventListener('click', (e) => {
    e.stopPropagation();
    const nav = e.target.closest('[data-nav]');
    if (nav) { calMes = new Date(calMes.getFullYear(), calMes.getMonth() + Number(nav.dataset.nav), 1); return renderCalendario(); }
    if (e.target.closest('.cal-limpar')) { calIni = calFim = null; aplicarCalendario(); return renderCalendario(); }
    const dia = e.target.closest('.cal-dia');
    if (!dia) return;
    const ts = Number(dia.dataset.ts);
    if (!calIni || calFim) { calIni = ts; calFim = null; }
    else if (ts < calIni) { calFim = calIni; calIni = ts; }
    else calFim = ts;
    aplicarCalendario();
    renderCalendario();
    if (calFim) setTimeout(fechar, 250);
  });
  document.addEventListener('click', fechar);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
}

function aplicarCalendario() {
  if (calIni) {
    periodoCopys = 'calendario';
    document.querySelectorAll('#periodoCopys button').forEach((b) => b.classList.remove('ativo'));
  } else if (periodoCopys === 'calendario') {
    periodoCopys = 'tudo';
    document.querySelector('#periodoCopys [data-periodo="tudo"]').classList.add('ativo');
  }
  rotuloCalendario();
  aplicarFiltroMineradas();
}
const PASSO_COPYS = 60;

// "qua., 11/11/2026" (+ hora opcional "14:10") -> timestamp; sem data = 0
function tsCopy(c) {
  if (c._ts !== undefined) return c._ts;
  const m = String(c.data || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  const h = String(c.hora || '').match(/(\d{1,2}):(\d{2})/);
  c._ts = m ? new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), h ? Number(h[1]) : 0, h ? Number(h[2]) : 0).getTime() : 0;
  return c._ts;
}
function inicioDoDia(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
function rotuloDia(ts) {
  if (!ts) return 'Sem data';
  const hoje = inicioDoDia(Date.now());
  const dias = Math.round((hoje - inicioDoDia(ts)) / 86400000);
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Ontem';
  const d = new Date(ts);
  const txt = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

function aplicarFiltroMineradas() {
  renderAbasCopys();
  const termo = normTexto(document.getElementById('buscaMineradas').value);
  const modelo = document.getElementById('filtroModeloMineradas').value;
  const tipo = document.getElementById('filtroTipoMineradas').value;
  const hoje = inicioDoDia(Date.now());
  const corte = periodoCopys === 'calendario' ? calIni : periodoCopys === 'hoje' ? hoje : periodoCopys === 'tudo' ? 0 : hoje - (Number(periodoCopys) - 1) * 86400000;
  const teto = periodoCopys === 'calendario' ? (calFim || calIni) + 86400000 : Infinity;

  // junta a mesma copy repetida (mesma modelo + mesmo texto): fica a mais recente, com contador
  const porChave = new Map();
  todasMineradas.forEach((c, i) => {
    if (c._i === undefined) c._i = i;
    if (!naoEhRuim(c.mensagem)) return;
    if (somenteNovas.mineradas && !novidades.mineradas.has(idMinerada(c))) return;
    if ((modelo && c.modelo !== modelo) || (tipo && c.tipo !== tipo)) return;
    if ((corte && tsCopy(c) < corte) || tsCopy(c) >= teto) return;
    if (termo && !(normTexto(c.mensagem).includes(termo) || normTexto(c.modelo).includes(termo) || normTexto(c.tipo).includes(termo))) return;
    const chave = c.modelo + '|' + normTexto(c.mensagem);
    const atual = porChave.get(chave);
    if (!atual) porChave.set(chave, { ...c, vezes: 1 });
    else {
      atual.vezes++;
      if (tsCopy(c) > atual._ts || (tsCopy(c) === atual._ts && c._i > atual._i)) Object.assign(atual, { ...c, vezes: atual.vezes });
    }
  });
  mineradasFiltradas = [...porChave.values()];

  const porData = (x, y) => (tsCopy(y) - tsCopy(x)) || (y._i - x._i);
  if (ordemCopys === 'antigas') mineradasFiltradas.sort((x, y) => -porData(x, y));
  else if (ordemCopys === 'preco') mineradasFiltradas.sort((x, y) => ((Number(y.preco) || 0) - (Number(x.preco) || 0)) || porData(x, y));
  else mineradasFiltradas.sort(porData);

  limiteCopys = PASSO_COPYS;
  renderMineradas();
}

function renderMineradas() {
  const container = document.getElementById('listaMineradas');
  const resumo = document.getElementById('copysResumo');
  if (!mineradasFiltradas.length) {
    resumo.textContent = '';
    container.innerHTML = todasMineradas.length
      ? '<div class="empty-state"><p>Nenhuma copy encontrada com esses filtros.</p></div>'
      : (document.getElementById('btnRecarregarMineradas').disabled
        ? '<div class="grid-copys">' + '<div class="skeleton"></div>'.repeat(6) + '</div>'
        : '<div class="empty-state"><span class="empty-ico">▤</span><p>Nenhuma copy no Google Docs ainda. Elas aparecem aqui assim que a extensão enviar.</p></div>');
    return;
  }

  const total = mineradasFiltradas.length;
  const visiveis = mineradasFiltradas.slice(0, limiteCopys);
  resumo.innerHTML = `<strong>${total}</strong> ${total === 1 ? 'copy' : 'copys'}`;

  // agrupa por dia (menos quando ordena por preço)
  const grupos = [];
  if (ordemCopys === 'preco') grupos.push({ titulo: null, itens: visiveis });
  else visiveis.forEach((c) => {
    const dia = tsCopy(c) ? inicioDoDia(tsCopy(c)) : 0;
    const ult = grupos[grupos.length - 1];
    if (ult && ult.dia === dia) ult.itens.push(c);
    else grupos.push({ dia, titulo: rotuloDia(dia), itens: [c] });
  });
  const totalPorDia = {};
  if (ordemCopys !== 'preco') mineradasFiltradas.forEach((c) => { const d = tsCopy(c) ? inicioDoDia(tsCopy(c)) : 0; totalPorDia[d] = (totalPorDia[d] || 0) + 1; });

  const mostrarModelo = !document.getElementById('filtroModeloMineradas').value;
  container.innerHTML = grupos.map((g) => `<section class="copys-grupo">
      ${g.titulo ? `<h3 class="copys-dia"><span>${esc(g.titulo)}${g.dia && /^(Hoje|Ontem)$/.test(g.titulo) ? `<em>${new Date(g.dia).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</em>` : ''}</span><span class="copys-dia-qtd">${totalPorDia[g.dia]} ${totalPorDia[g.dia] === 1 ? 'copy' : 'copys'}</span></h3>` : ''}
      <div class="grid-copys copys-grid">${g.itens.map((c) => cardCopyModeloHtml(c, mostrarModelo)).join('')}</div>
    </section>`).join('')
    + (total > limiteCopys ? `<div class="copys-mais"><button type="button" class="btn btn-secondary" id="btnMaisCopys">Mostrar mais ${Math.min(PASSO_COPYS, total - limiteCopys)} <span>de ${total - limiteCopys} restantes</span></button></div>` : '');

  ligarEventosCard(container);
  ligarEventosCopyItem(container);
  const mais = document.getElementById('btnMaisCopys');
  if (mais) mais.addEventListener('click', () => { limiteCopys += PASSO_COPYS; renderMineradas(); });
}

// ═══════════════════════════════════════════════ CARTÃO DA ABA COPYS ═══

const COR_CATEGORIA = {
  'PPV': '#34d399', 'Prévias': '#60a5fa', 'Boas-vindas': '#f472b6', 'Remarketing': '#fb923c', 'Expirados': '#f87171',
  'Promoções': '#fbbf24', 'VIP': '#c084fc', 'Chamadas': '#38bdf8', 'Disparos em massa': '#a78bfa', 'Pós-venda': '#2dd4bf',
  'Reengajamento': '#e879f9', 'Testes': '#94a3b8'
};

// "qua., 11/11/2026" -> "Hoje" / "Ontem" / "11/11"
function dataCurtaCopy(valor) {
  const m = String(valor || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return formatarData(valor);
  const d = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const dias = Math.round((hoje - d) / 86400000);
  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Ontem';
  return m[3] === String(hoje.getFullYear()) ? `${m[1]}/${m[2]}` : `${m[1]}/${m[2]}/${m[3].slice(2)}`;
}
function precoCopy(v) {
  const n = Number(v);
  return n > 0 ? n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
}

function cardCopyModeloHtml(c, mostrarModelo) {
  const texto = c.mensagem || '';
  const cor = COR_CATEGORIA[c.tipo] || 'var(--accent)';
  const foto = avataresModelos[c.modelo];
  const nova = novidades.mineradas.has(idMinerada(c));
  const preco = precoCopy(c.preco);
  const longa = texto.length > 300 || (texto.match(/\n/g) || []).length > 6;
  return `<article class="copy-item ${nova ? 'is-nova' : ''}" style="--cat:${cor}">
    <header class="copy-item-top">
      ${mostrarModelo ? `<span class="copy-item-modelo"><span class="copy-item-av" style="--cor:${corAvatar(c.modelo || '')}">${esc(iniciais(c.modelo))}${foto ? `<img src="${escAttr(foto)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}</span>${esc((c.modelo || '').split(/\s+/)[0])}</span>` : ''}
      <span class="copy-item-cat">${esc(c.tipo || '')}</span>
      ${nova ? '<span class="copy-item-nova">nova</span>' : ''}
      ${preco ? `<span class="copy-item-preco">${preco}</span>` : ''}
    </header>
    <p class="copy-item-texto ${longa ? 'is-longa' : ''}" title="Clique pra copiar">${esc(texto)}</p>
    ${longa ? '<button type="button" class="copy-item-mais">ver tudo</button>' : ''}
    <footer class="copy-item-bottom">
      <span class="copy-item-data">${esc(c.hora || dataCurtaCopy(c.data))}${c.vezes > 1 ? `<span class="copy-item-vezes" title="Mandou essa mesma copy ${c.vezes} vezes">enviada ${c.vezes}×</span>` : ''}</span>
      <div class="copy-item-acoes">
        ${botaoFavHtml(texto, 'minerada', c.tipo)}
        <div class="ia-wrap" title="Reescrever com IA">
          <button class="icon-btn btn-reescrever" data-texto="${escAttr(texto)}">✨</button>
          <select class="select-estilo-ia" data-texto="${escAttr(texto)}">
            <option value="">Estilo…</option>
            <option value="romantica">Romântica</option>
            <option value="safada">Safada</option>
            <option value="ego">Quebra de Ego</option>
            <option value="controle">Controle</option>
            <option value="curta">Mais curta</option>
          </select>
        </div>
        <button type="button" class="copy-item-copiar" data-texto="${escAttr(texto)}"><span aria-hidden="true">⧉</span> Copiar</button>
      </div>
    </footer>
  </article>`;
}

function ligarEventosCopyItem(container) {
  const copiar = (texto, botao) => copiarTexto(texto).then(() => {
    toast('Copy copiada!');
    if (!botao) return;
    botao.classList.add('ok'); botao.innerHTML = '✓ Copiada';
    setTimeout(() => { botao.classList.remove('ok'); botao.innerHTML = '<span aria-hidden="true">⧉</span> Copiar'; }, 1400);
  });
  container.querySelectorAll('.copy-item-copiar').forEach((btn) => btn.addEventListener('click', () => copiar(btn.dataset.texto, btn)));
  container.querySelectorAll('.copy-item-texto').forEach((p) => p.addEventListener('click', () => {
    if (window.getSelection && String(window.getSelection()).length) return; // deixa selecionar trecho
    const card = p.closest('.copy-item');
    copiar(card.querySelector('.copy-item-copiar').dataset.texto, card.querySelector('.copy-item-copiar'));
  }));
  container.querySelectorAll('.copy-item-mais').forEach((btn) => btn.addEventListener('click', () => {
    const p = btn.previousElementSibling;
    const aberta = p.classList.toggle('is-aberta');
    btn.textContent = aberta ? 'mostrar menos' : 'ver tudo';
  }));
  container.querySelectorAll('.copy-item-av img').forEach((img) => { img.onerror = () => img.remove(); });
}

// ═══════════════════════════════════════════════ CARD DE COPY (REUTILIZÁVEL) ═══

function cardCopyHtml({ texto, tag, modelo, categoria, icone, data, preco, comIA, origem, origemFav, custom, nova }) {
  const cor = COR_TIPO[tag] || 'var(--accent)';
  const idFeedback = hashTexto(texto);
  const avaliacao = feedbackCopy[idFeedback];
  return `<div class="copy-card ${nova ? 'copy-card-nova' : ''}" data-origem="${origem}">
    <div class="copy-card-header">
      ${nova ? '<span class="tag-nova">Nova</span>' : ''}
      ${modelo ? `<span class="copy-card-modelo">${esc(modelo)}</span>` : `<span class="copy-card-cat">${icone || ''} ${esc(categoria || '')}</span>`}
      ${tag ? `<span class="copy-card-tag" style="background:${cor}22;color:${cor};border-color:${cor}44">${esc(tag)}</span>` : ''}
    </div>
    <div class="copy-card-texto">${esc(texto)}</div>
    <div class="copy-card-footer">
      <span class="copy-card-meta">${preco ? `<b>${esc(preco)}</b> · ` : ''}${data ? esc(data) : ''}</span>
      <div class="copy-card-actions">
        ${custom ? `<button class="icon-btn btn-del-custom" title="Apagar" data-texto="${escAttr(texto)}">🗑</button>` : ''}
        ${comIA ? `<button class="icon-btn btn-avaliar ${avaliacao === 'boa' ? 'avaliacao-boa' : ''}" title="Marcar como boa (treina a IA)" data-texto="${escAttr(texto)}" data-avaliacao="boa">👍</button>
        <button class="icon-btn btn-avaliar ${avaliacao === 'ruim' ? 'avaliacao-ruim' : ''}" title="Marcar como ruim" data-texto="${escAttr(texto)}" data-avaliacao="ruim">👎</button>` : ''}
        ${botaoFavHtml(texto, origemFav || origem, categoria || tag)}
        ${comIA ? `<div class="ia-wrap" title="Reescrever com IA">
          <button class="icon-btn btn-reescrever" data-texto="${escAttr(texto)}">✨</button>
          <select class="select-estilo-ia" data-texto="${escAttr(texto)}">
            <option value="">Estilo…</option>
            <option value="romantica">Romântica</option>
            <option value="safada">Safada</option>
            <option value="ego">Quebra de Ego</option>
            <option value="controle">Controle</option>
            <option value="curta">Mais curta</option>
          </select>
        </div>` : ''}
        <button class="icon-btn btn-copiar" title="Copiar" data-texto="${escAttr(texto)}">📋</button>
      </div>
    </div>
  </div>`;
}

function ligarEventosCard(container) {
  container.querySelectorAll('.btn-copiar').forEach((btn) => btn.addEventListener('click', () => {
    copiarTexto(btn.dataset.texto).then(() => { toast('Copy copiada!'); btn.textContent = '✅'; setTimeout(() => (btn.textContent = '📋'), 1400); });
  }));
  container.querySelectorAll('.btn-avaliar').forEach((btn) => btn.addEventListener('click', () => {
    avaliarCopy(btn.dataset.texto, btn.dataset.avaliacao);
    if (btn.dataset.avaliacao === 'ruim') {
      const card = btn.closest('.copy-card');
      if (card) { card.style.transition = 'opacity 0.3s ease'; card.style.opacity = '0'; setTimeout(() => card.remove(), 300); }
    }
  }));
  container.querySelectorAll('.btn-reescrever').forEach((btn) => btn.addEventListener('click', () => reescreverCopy(btn.dataset.texto, 'safada', btn)));
  container.querySelectorAll('.select-estilo-ia').forEach((sel) => sel.addEventListener('change', () => {
    if (sel.value) { const btn = sel.closest('.ia-wrap').querySelector('.btn-reescrever'); reescreverCopy(sel.dataset.texto, sel.value, btn); sel.value = ''; }
  }));
}

// ═══════════════════════════════════════════════ REESCREVER COPY (IA, usado nos cards) ═══

async function reescreverCopy(texto, estilo, btnEl) {
  const cfg = getConfig();
  if (!cfg.openrouterKey) { toast('Configure sua API Key do OpenRouter nas Configurações.'); document.getElementById('modalBackdrop').classList.add('open'); return; }

  const original = btnEl.textContent;
  btnEl.disabled = true;
  btnEl.textContent = '…';

  try {
    const resultado = await chamarOpenRouter([
      { role: 'system', content: montarPromptBase() },
      { role: 'user', content: (ESTILOS_REESCRITA[estilo] || ESTILOS_REESCRITA.safada) + '\n\nCopy original:\n' + texto }
    ], { maxTokens: tokensParaComprimento(1) });
    mostrarResultadoIA(btnEl, texto, resultado.trim());
  } catch (err) {
    toast('Erro IA: ' + err.message);
  } finally {
    btnEl.disabled = false;
    btnEl.textContent = original;
  }
}

function mostrarResultadoIA(btnEl, original, resultado) {
  const card = btnEl.closest('.copy-card, .copy-item');
  const antigo = card.querySelector('.ia-resultado');
  if (antigo) antigo.remove();

  const div = document.createElement('div');
  div.className = 'ia-resultado';
  div.innerHTML = `<div class="ia-resultado-header">✨ Reescrita pela IA</div>
    <div class="ia-resultado-texto">${esc(resultado)}</div>
    <div class="ia-resultado-acoes">
      <button class="btn btn-sm btn-primary btn-copiar-ia">Copiar</button>
      <button class="btn btn-sm btn-ghost btn-ia-fechar">Fechar</button>
    </div>`;
  card.appendChild(div);
  div.querySelector('.btn-copiar-ia').addEventListener('click', () => copiarTexto(resultado).then(() => toast('Copy copiada!')));
  div.querySelector('.btn-ia-fechar').addEventListener('click', () => div.remove());
}

// ═══════════════════════════════════════════════ OPENROUTER ═══

// Parte editável do prompt (aba Treinar IA). O resto (persona, configurações, regras aprendidas) é montado em volta.
const PROMPT_BASE_PADRAO = 'Você é uma chatter profissional que escreve copys de disparo e mensagens pra atrair, engajar e converter leads em compradores de conteúdo exclusivo.\n\n'
  + 'REGRAS DE ESTILO:\n'
  + '- Escreva como pessoa real mandando mensagem, nunca como robô/marketing.\n'
  + '- Linguagem informal brasileira.\n'
  + '- Nunca marcar encontro presencial, nunca pedir pagamento direto (use sempre lógica de "mimo"), nunca dar dados pessoais reais.\n'
  + '- Proibido usar: "imperdível", "última chance", "não perca", "primo", superlativos exagerados.\n'
  + '- Proibido incluir rótulos, títulos, aspas ou comentários antes/depois da copy — responda só com a mensagem pura.\n'
  + '- Toda copy deve terminar gerando curiosidade.';

let promptBaseEquipe = null; // { texto, atualizadoPor, timestamp } vindo do Firestore; null = usa o padrão

function promptBaseAtual() {
  return (promptBaseEquipe && promptBaseEquipe.texto && promptBaseEquipe.texto.trim()) || PROMPT_BASE_PADRAO;
}

function montarPromptBase() {
  const cfg = getConfig();
  const persona = (cfg.persona || '').trim();
  const arquetipo = TIPO_PERSONA_DESC[cfg.personaTipo] || '';
  const comprimento = COMPRIMENTO_DESC[cfg.comprimento] || COMPRIMENTO_DESC.medio;
  const emoji = EMOJI_DESC[cfg.emoji] || EMOJI_DESC['2'];
  const tom = TOM_DESC[cfg.tom] || TOM_DESC.natural;
  const abrev = ABREV_DESC[cfg.abreviacoes] || ABREV_DESC.sim;

  let bloco = promptBaseAtual() + '\n\n';

  if (persona || arquetipo) {
    bloco += 'PERSONA:\n';
    if (persona) bloco += '- ' + persona + '\n';
    if (arquetipo) bloco += '- Arquétipo: ' + arquetipo + '\n';
    bloco += '\n';
  }

  bloco += 'CONFIGURAÇÃO DESTA COPY (obrigatório):\n'
    + '- ' + comprimento + '\n'
    + '- ' + tom + '\n'
    + '- ' + abrev + '\n'
    + '- ' + emoji + '\n'
    + '- A persona é sempre uma mulher adulta (18+). Nunca sugira que ela ou o lead seja menor de idade.';

  if (regrasIA.length) {
    bloco += '\n\nREGRAS APRENDIDAS DA EQUIPE (siga à risca, têm prioridade sobre o estilo genérico acima):\n'
      + regrasIA.slice(0, 15).map((r) => '- ' + r.texto).join('\n');
  }

  return bloco;
}

// ═══════════════════════════════════════════════ PROMPT BASE (Treinar IA) ═══
// Fica em config/prompt_base; se as regras do Firestore não liberarem "config", usa metricas/prompt_base.

let refPromptBase = null;
let unsubPromptBase = null;

function iniciarFeedPromptBase(usarReserva) {
  if (unsubPromptBase) unsubPromptBase();
  refPromptBase = usarReserva ? db.collection('metricas').doc('prompt_base') : db.collection('config').doc('prompt_base');
  unsubPromptBase = refPromptBase.onSnapshot((doc) => {
    promptBaseEquipe = doc.exists ? doc.data() : null;
  }, (err) => {
    console.warn('[prompt_base]', err.message);
    if (!usarReserva) iniciarFeedPromptBase(true);
  });
}





async function chamarOpenRouter(mensagens, opts) {
  const cfg = getConfig();
  if (!cfg.openrouterKey) throw new Error('Configure sua API Key do OpenRouter nas Configurações.');
  const modelo = opts?.modelo || cfg.openrouterModel || CONFIG_PADRAO.openrouterModel;

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + cfg.openrouterKey,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.href,
      'X-Title': 'Synora Copys'
    },
    body: JSON.stringify({
      model: modelo,
      messages: mensagens,
      max_tokens: opts?.maxTokens || 400,
      temperature: opts?.temperature ?? 0.9
    })
  });
  if (!resp.ok) { const err = await resp.json().catch(() => ({})); throw new Error(err.error?.message || 'Erro ' + resp.status + ' no OpenRouter'); }
  const data = await resp.json();
  let texto = data.choices?.[0]?.message?.content || '';
  if (opts?.cru) return texto;
  texto = texto.replace(/^(ABERTURA\s+(ROMÂNTICA|SAFADA|DE CONTROLE)|QUEBRA DE EGO|Bom dia|Conteúdo exclusivo)\s*[—:\-]+\s*/gim, '');
  // Tira rótulo tipo "Copy:" e aspas em volta da mensagem inteira, que alguns modelos insistem em colocar
  texto = texto.trim().replace(/^(copy|mensagem|resposta)\s*\d*\s*:\s*/i, '');
  if (/^["“][\s\S]*["”]$/.test(texto) && !/["“”]/.test(texto.slice(1, -1))) texto = texto.slice(1, -1);
  return texto;
}

// ═══════════════════════════════════════════════ GERADOR DE COPYS ═══
// Sorteia copys reais da modelo e monta o texto no formato "uma mensagem por bloco,
// separadas por linha em branco" pra colar no campo de Mensagens do disparo.

const DIAS_SEM_REPETIR = 7;
// Copys que sugerem menor de idade não entram no sorteio (continuam visíveis na aba Copys)
const TEMAS_PROIBIDOS = /\b(escola|escolar|colegial|colegio|ensino medio|aluna|aluno|alunas|alunos|novinha|novinhas|novinho|ninfeta|lolita|menor de idade|menores|virgindade|virgem|sala de aula|uniforme|primeira vez|1[0-7] ?anos|teen|adolescente|crianca)\b/;
function temaProibido(texto) { return TEMAS_PROIBIDOS.test(normTexto(texto)); }

let grModelo = '';
let grCatsSel = null;     // modo "misturar": Set de categorias marcadas (null = todas)
let grItens = [];         // [{texto, categoria, preco, editada}]
let grModo = 'misturar';  // 'misturar' | 'quantidade'
let grQtdCat = {};        // modo "quantidade": categoria -> quantas
let grVista = 'lista';    // 'lista' | 'texto'
let grEditando = -1;
let grAviso = '';

function copysDaModelo(modelo) {
  const mapa = new Map();
  todasMineradas.forEach((c) => {
    if (c.modelo !== modelo || !c.mensagem || !naoEhRuim(c.mensagem) || temaProibido(c.mensagem)) return;
    const k = normTexto(c.mensagem);
    if (!mapa.has(k)) mapa.set(k, { texto: c.mensagem, categoria: c.tipo || 'Outras', preco: c.preco });
  });
  return [...mapa.values()];
}

function copysPorModeloContagem() {
  const contagem = {}; const vistos = new Set();
  todasMineradas.forEach((c) => { const k = c.modelo + '|' + normTexto(c.mensagem); if (vistos.has(k)) return; vistos.add(k); contagem[c.modelo] = (contagem[c.modelo] || 0) + 1; });
  return Object.entries(contagem).sort((a, b) => b[1] - a[1]);
}

// Histórico do que já foi copiado no gerador (por modelo, neste navegador)
function chaveHistGerador(modelo) { return 'gerador_sorteadas__' + normTexto(modelo); }
function lerHistGerador(modelo) {
  try {
    const h = JSON.parse(localStorage.getItem(chaveHistGerador(modelo))) || {};
    const limite = Date.now() - DIAS_SEM_REPETIR * 86400000;
    Object.keys(h).forEach((k) => { if (h[k] < limite) delete h[k]; });
    return h;
  } catch (e) { return {}; }
}
function gravarHistGerador(modelo, textos) {
  const h = lerHistGerador(modelo);
  textos.forEach((t) => { h[normTexto(t)] = Date.now(); });
  try { localStorage.setItem(chaveHistGerador(modelo), JSON.stringify(h)); } catch (e) { /* sem espaço: ignora */ }
}

// Preferências do gerador (quantidade, modo, quantas por categoria de cada modelo)
function lerPrefsGerador() { try { return JSON.parse(localStorage.getItem('gerador_prefs')) || {}; } catch (e) { return {}; } }
function salvarPrefsGerador() {
  const p = lerPrefsGerador();
  p.qtd = qtdGerador(); p.modo = grModo; p.semRepetir = document.getElementById('grSemRepetir').checked;
  p.porCat = p.porCat || {};
  if (grModelo) p.porCat[normTexto(grModelo)] = grQtdCat;
  try { localStorage.setItem('gerador_prefs', JSON.stringify(p)); } catch (e) { /* ignora */ }
}
function qtdGerador() { return Math.max(1, Math.min(50, Number(document.getElementById('grQtd').value) || 10)); }

function embaralhar(lista) {
  for (let i = lista.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lista[i], lista[j]] = [lista[j], lista[i]]; }
  return lista;
}
// Alterna as listas (PPV, Prévias, PPV...) pra não ficar tudo da mesma categoria em sequência
function intercalar(listas) {
  const ls = listas.map((l) => l.slice()); const res = [];
  while (ls.some((l) => l.length)) ls.forEach((l) => { if (l.length) res.push(l.shift()); });
  return res;
}

// Uma copy vira um bloco só: linhas em branco dentro dela quebrariam o campo do disparo
function blocoCopy(texto) { return String(texto).replace(/\r/g, '').replace(/\n[ \t]*(\n[ \t]*)+/g, '\n').trim(); }

function poolGerador(evitar) {
  const semRepetir = document.getElementById('grSemRepetir').checked;
  const hist = semRepetir ? lerHistGerador(grModelo) : {};
  const fora = new Set((evitar || []).map(normTexto));
  const todas = copysDaModelo(grModelo).filter((c) => (grModo === 'quantidade' || !grCatsSel || grCatsSel.has(c.categoria)) && !fora.has(normTexto(c.texto)));
  return { novas: todas.filter((c) => !hist[normTexto(c.texto)]), usadas: todas.filter((c) => hist[normTexto(c.texto)]) };
}

function categoriasDaModelo() {
  const porCat = {};
  copysDaModelo(grModelo).forEach((c) => { porCat[c.categoria] = (porCat[c.categoria] || 0) + 1; });
  const ordem = CATEGORIAS_COPYS.filter((c) => porCat[c]).concat(Object.keys(porCat).filter((c) => !CATEGORIAS_COPYS.includes(c)));
  return { porCat, ordem };
}

function sortearGerador() {
  const { novas, usadas } = poolGerador();
  const agrupar = (lista) => { const m = {}; embaralhar(lista.slice()).forEach((c) => { (m[c.categoria] = m[c.categoria] || []).push(c); }); return m; };
  const nv = agrupar(novas), us = agrupar(usadas);
  let res = [], repetidas = 0, faltaram = 0;
  if (grModo === 'quantidade') {
    const listas = [];
    Object.entries(grQtdCat).forEach(([cat, n]) => {
      if (!n) return;
      const a = (nv[cat] || []).slice(0, n);
      const b = (us[cat] || []).slice(0, n - a.length);
      repetidas += b.length; faltaram += n - a.length - b.length;
      listas.push(a.concat(b));
    });
    res = intercalar(embaralhar(listas));
  } else {
    const qtd = qtdGerador();
    res = intercalar(embaralhar(Object.keys(nv)).map((c) => nv[c])).slice(0, qtd);
    const extra = embaralhar(usadas.slice()).slice(0, qtd - res.length);
    repetidas = extra.length; faltaram = qtd - res.length - extra.length;
    res = res.concat(extra);
  }
  grItens = res.map((c) => ({ ...c }));
  grEditando = -1;
  const avisos = [];
  if (repetidas) avisos.push(`${repetidas} ${repetidas === 1 ? 'copy já tinha saído' : 'copys já tinham saído'} nos últimos ${DIAS_SEM_REPETIR} dias (não tinha nova suficiente).`);
  if (faltaram) avisos.push(`Faltaram ${faltaram}: ela não tem tantas copys ${grModo === 'quantidade' ? 'nessas categorias' : 'nas categorias marcadas'}.`);
  grAviso = avisos.join(' ');
  salvarPrefsGerador();
  renderGeradorSaida();
}

function abrirGerador() {
  const contagem = {};
  copysPorModeloContagem().forEach(([m, n]) => { contagem[m] = n; });
  const modelos = Object.keys(contagem);
  const sel = document.getElementById('grModelo');
  if (!modelos.length) { sel.innerHTML = '<option>Carregando…</option>'; document.getElementById('grCats').innerHTML = ''; renderGeradorSaida(); return; }
  const daBarra = document.getElementById('filtroModeloMineradas').value;
  if (!grModelo || !contagem[grModelo]) { grModelo = (daBarra && contagem[daBarra]) ? daBarra : modelos[0]; trocouModeloGerador(); }
  sel.innerHTML = modelos.map((m) => `<option value="${escAttr(m)}" ${m === grModelo ? 'selected' : ''}>${esc(m)} · ${contagem[m]} copys</option>`).join('');
  const foto = avataresModelos[grModelo];
  document.getElementById('grAvatar').innerHTML = `<span class="gr-av" style="--cor:${corAvatar(grModelo)}">${esc(iniciais(grModelo))}${foto ? `<img src="${escAttr(foto)}" alt="" referrerpolicy="no-referrer">` : ''}</span>`;
  document.querySelectorAll('#grAvatar img').forEach((img) => { img.onerror = () => img.remove(); });
  renderGeradorCats();
  const hist = Object.keys(lerHistGerador(grModelo)).length;
  document.getElementById('grHistInfo').textContent = hist ? `${hist} já ${hist === 1 ? 'saiu' : 'saíram'} nos últimos ${DIAS_SEM_REPETIR} dias` : `Nenhuma copy dela saiu nos últimos ${DIAS_SEM_REPETIR} dias`;
  document.getElementById('grLimparHist').hidden = !hist;
  renderGeradorSaida();
}

// Ao trocar de modelo: limpa o sorteio e carrega as quantidades por categoria salvas pra ela
function trocouModeloGerador() {
  grCatsSel = null; grItens = []; grAviso = ''; grEditando = -1;
  const salvo = (lerPrefsGerador().porCat || {})[normTexto(grModelo)];
  const { porCat, ordem } = categoriasDaModelo();
  grQtdCat = {};
  ordem.forEach((c) => { grQtdCat[c] = salvo && salvo[c] !== undefined ? Math.min(salvo[c], porCat[c]) : (salvo ? 0 : 1); });
}

function renderGeradorCats() {
  document.querySelectorAll('#grModo button').forEach((b) => b.classList.toggle('ativo', b.dataset.modo === grModo));
  const { porCat, ordem } = categoriasDaModelo();
  const box = document.getElementById('grCats');
  document.getElementById('grQtdLinha').hidden = grModo === 'quantidade';
  document.getElementById('grTodas').hidden = grModo === 'quantidade';
  if (!ordem.length) { box.innerHTML = '<span class="gr-vazio-txt">Essa modelo ainda não tem copys.</span>'; return; }
  if (grModo === 'quantidade') {
    const total = ordem.reduce((t, c) => t + (grQtdCat[c] || 0), 0);
    box.className = 'gr-catsq';
    box.innerHTML = ordem.map((c) => {
      const n = grQtdCat[c] || 0;
      return `<div class="gr-catq ${n ? 'on' : ''}" data-cat="${escAttr(c)}" style="--cat:${COR_CATEGORIA[c] || 'var(--accent)'}">
        <span class="gr-catq-nome">${esc(c)}<small>${porCat[c]} ${porCat[c] === 1 ? 'copy' : 'copys'}</small></span>
        <span class="gr-step"><button type="button" data-d="-1" aria-label="Menos ${escAttr(c)}" ${n ? '' : 'disabled'}>−</button><b>${n}</b><button type="button" data-d="1" aria-label="Mais ${escAttr(c)}" ${n >= porCat[c] ? 'disabled' : ''}>+</button></span>
      </div>`;
    }).join('') + `<p class="gr-total">Total: <strong>${total}</strong> ${total === 1 ? 'copy' : 'copys'}</p>`;
  } else {
    box.className = 'gr-cats';
    box.innerHTML = ordem.map((c) => {
      const on = !grCatsSel || grCatsSel.has(c);
      return `<button type="button" class="gr-cat ${on ? 'on' : ''}" data-cat="${escAttr(c)}" aria-pressed="${on}" style="--cat:${COR_CATEGORIA[c] || 'var(--accent)'}">${esc(c)} <span>${porCat[c]}</span></button>`;
    }).join('');
  }
}

function textoGerador() { return grItens.map((c) => blocoCopy(c.texto)).join('\n\n'); }

function renderGeradorSaida() {
  const box = document.getElementById('grSaida');
  if (!grItens.length) {
    box.innerHTML = `<div class="gr-vazio">
      <span class="gr-vazio-ico" aria-hidden="true">🎲</span>
      <strong>${grModelo ? `Pronto pra sortear as copys de ${esc(grModelo.split(/\s+/)[0])}` : 'Carregando as modelos…'}</strong>
      <p>Escolha as categorias e clique em <b>Sortear copys</b>. Elas vêm prontas pro campo <b>✏️ Mensagens</b>: uma por bloco, com linha em branco entre elas.</p>
    </div>`;
    return;
  }
  const n = grItens.length;
  const txt = textoGerador();
  box.innerHTML = `<div class="gr-res-head">
      <div class="gr-res-titulo"><strong>${n} ${n === 1 ? 'copy' : 'copys'}</strong><span>de <b>${esc(grModelo)}</b></span></div>
      <div class="segmentado gr-vista" role="group" aria-label="Ver como">
        <button type="button" data-vista="lista" class="${grVista === 'lista' ? 'ativo' : ''}">Lista</button>
        <button type="button" data-vista="texto" class="${grVista === 'texto' ? 'ativo' : ''}">Texto final</button>
      </div>
    </div>
    ${grAviso ? `<p class="gr-aviso">${esc(grAviso)}</p>` : ''}
    ${grVista === 'texto'
      ? `<pre class="gr-preview">${esc(txt)}</pre><p class="gr-preview-info">${n} blocos · ${txt.length} caracteres</p>`
      : `<ol class="gr-lista">${grItens.map((c, i) => `<li class="gr-item ${grEditando === i ? 'editando' : ''}" data-i="${i}" style="--cat:${COR_CATEGORIA[c.categoria] || 'var(--accent)'}">
        <div class="gr-ordem">
          <button type="button" data-acao="subir" aria-label="Subir" ${i ? '' : 'disabled'}>▴</button>
          <span class="gr-num">${i + 1}</span>
          <button type="button" data-acao="descer" aria-label="Descer" ${i < n - 1 ? '' : 'disabled'}>▾</button>
        </div>
        <div class="gr-corpo">
          <div class="gr-meta"><span class="gr-tag">${esc(c.categoria)}</span>${precoCopy(c.preco) ? `<span class="gr-preco">${precoCopy(c.preco)}</span>` : ''}${c.editada ? '<span class="gr-editada">editada</span>' : ''}</div>
          <p class="gr-texto" ${grEditando === i ? 'contenteditable="plaintext-only" spellcheck="false"' : ''}>${esc(blocoCopy(c.texto))}</p>
        </div>
        <div class="gr-botoes">
          <button type="button" class="gr-ico" data-acao="copiar" title="Copiar só essa" aria-label="Copiar só essa">⧉</button>
          <button type="button" class="gr-ico" data-acao="editar" title="${grEditando === i ? 'Salvar' : 'Editar'}" aria-label="${grEditando === i ? 'Salvar' : 'Editar'}">${grEditando === i ? '✓' : '✎'}</button>
          <button type="button" class="gr-ico" data-acao="trocar" title="Trocar por outra" aria-label="Trocar por outra">🔀</button>
          <button type="button" class="gr-ico" data-acao="remover" title="Tirar essa" aria-label="Tirar essa">✕</button>
        </div>
      </li>`).join('')}</ol>`}
    <div class="gr-res-acoes">
      <button type="button" class="btn btn-ghost" data-acao="resortear">🔀 Sortear de novo</button>
      <button type="button" class="btn btn-primary gr-copiar-tudo" data-acao="copiar-tudo">⧉ Copiar tudo</button>
    </div>`;
  if (grEditando >= 0) {
    const p = box.querySelector('.gr-item.editando .gr-texto');
    if (p) { p.focus(); const r = document.createRange(); r.selectNodeContents(p); r.collapse(false); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
  }
}

function salvarEdicaoGerador() {
  if (grEditando < 0) return;
  const p = document.querySelector('#grSaida .gr-item.editando .gr-texto');
  const item = grItens[grEditando];
  if (p && item) {
    const novo = p.innerText.trim();
    if (novo && novo !== blocoCopy(item.texto)) { item.texto = novo; item.editada = true; }
  }
  grEditando = -1;
}

function configurarGerador() {
  const prefs = lerPrefsGerador();
  if (prefs.qtd) document.getElementById('grQtd').value = prefs.qtd;
  if (prefs.modo) grModo = prefs.modo;
  if (prefs.semRepetir === false) document.getElementById('grSemRepetir').checked = false;

  document.getElementById('grModelo').addEventListener('change', (e) => { grModelo = e.target.value; trocouModeloGerador(); abrirGerador(); });
  document.getElementById('grModo').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-modo]'); if (!btn) return;
    grModo = btn.dataset.modo; salvarPrefsGerador(); renderGeradorCats();
  });
  document.getElementById('grCats').addEventListener('click', (e) => {
    const step = e.target.closest('[data-d]');
    if (step) {
      const c = step.closest('.gr-catq').dataset.cat;
      const max = categoriasDaModelo().porCat[c] || 0;
      grQtdCat[c] = Math.max(0, Math.min(max, (grQtdCat[c] || 0) + Number(step.dataset.d)));
      salvarPrefsGerador(); renderGeradorCats(); return;
    }
    const btn = e.target.closest('.gr-cat'); if (!btn) return;
    const todas = [...document.querySelectorAll('#grCats .gr-cat')].map((b) => b.dataset.cat);
    if (!grCatsSel) grCatsSel = new Set(todas);
    const c = btn.dataset.cat;
    if (grCatsSel.has(c)) { if (grCatsSel.size === 1) return toast('Deixe pelo menos uma categoria.'); grCatsSel.delete(c); } else grCatsSel.add(c);
    if (grCatsSel.size === todas.length) grCatsSel = null;
    renderGeradorCats();
  });
  document.getElementById('grTodas').addEventListener('click', () => { grCatsSel = null; renderGeradorCats(); });
  const qtd = document.getElementById('grQtd');
  const mudarQtd = (v) => { qtd.value = Math.max(1, Math.min(50, v)); marcarPreset(); salvarPrefsGerador(); };
  const marcarPreset = () => document.querySelectorAll('#grPresets button').forEach((b) => b.classList.toggle('ativo', Number(b.dataset.q) === qtdGerador()));
  document.getElementById('grMenos').addEventListener('click', () => mudarQtd(qtdGerador() - 1));
  document.getElementById('grMais').addEventListener('click', () => mudarQtd(qtdGerador() + 1));
  document.getElementById('grPresets').addEventListener('click', (e) => { const b = e.target.closest('[data-q]'); if (b) mudarQtd(Number(b.dataset.q)); });
  qtd.addEventListener('change', () => mudarQtd(qtdGerador()));
  marcarPreset();
  document.getElementById('grSemRepetir').addEventListener('change', salvarPrefsGerador);

  document.getElementById('grSortear').addEventListener('click', () => {
    if (!copysDaModelo(grModelo).length) return toast('Essa modelo ainda não tem copys.');
    if (grModo === 'quantidade' && !Object.values(grQtdCat).some(Boolean)) return toast('Coloque pelo menos 1 copy em alguma categoria.');
    sortearGerador();
    if (window.innerWidth < 900) document.getElementById('grSaida').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('grLimparHist').addEventListener('click', () => {
    localStorage.removeItem(chaveHistGerador(grModelo));
    abrirGerador();
    toast('Pronto, todas as copys dela podem sair de novo.');
  });

  const saida = document.getElementById('grSaida');
  saida.addEventListener('focusout', (e) => {
    if (!e.target.matches('.gr-texto[contenteditable]')) return;
    if (e.relatedTarget && e.relatedTarget.closest('.gr-item.editando')) return; // clicou no ✓ da mesma copy
    salvarEdicaoGerador(); renderGeradorSaida();
  });
  saida.addEventListener('keydown', (e) => {
    if (e.target.matches('.gr-texto[contenteditable]') && (e.key === 'Escape' || (e.key === 'Enter' && (e.ctrlKey || e.metaKey)))) { e.preventDefault(); e.target.blur(); }
  });
  saida.addEventListener('click', (e) => {
    const vista = e.target.closest('[data-vista]');
    if (vista) { salvarEdicaoGerador(); grVista = vista.dataset.vista; renderGeradorSaida(); return; }
    const btn = e.target.closest('[data-acao]'); if (!btn) return;
    const acao = btn.dataset.acao;
    if (acao === 'resortear') { sortearGerador(); return; }
    if (acao === 'copiar-tudo') {
      salvarEdicaoGerador();
      copiarTexto(textoGerador()).then(() => {
        gravarHistGerador(grModelo, grItens.map((c) => c.texto));
        registrarAtividade('Gerou copys pro disparo', `${grModelo} · ${grItens.length} copys`);
        toast(`${grItens.length} copys copiadas! Cole no campo de Mensagens.`);
        const b = document.querySelector('#grSaida .gr-copiar-tudo');
        if (b) { b.classList.add('ok'); b.textContent = '✓ Copiado'; setTimeout(() => abrirGerador(), 1400); }
      });
      return;
    }
    const li = btn.closest('.gr-item'); if (!li) return;
    const i = Number(li.dataset.i);
    if (acao === 'editar') {
      if (grEditando === i) { salvarEdicaoGerador(); } else { salvarEdicaoGerador(); grEditando = i; }
      renderGeradorSaida(); return;
    }
    salvarEdicaoGerador();
    if (acao === 'copiar') { copiarTexto(blocoCopy(grItens[i].texto)).then(() => toast('Copy copiada!')); }
    if (acao === 'remover') grItens.splice(i, 1);
    if (acao === 'subir' && i > 0) [grItens[i - 1], grItens[i]] = [grItens[i], grItens[i - 1]];
    if (acao === 'descer' && i < grItens.length - 1) [grItens[i + 1], grItens[i]] = [grItens[i], grItens[i + 1]];
    if (acao === 'trocar') {
      const atual = grItens[i];
      const { novas, usadas } = poolGerador(grItens.map((c) => c.texto));
      const mesmaCat = (l) => l.filter((c) => c.categoria === atual.categoria);
      const op = [mesmaCat(novas), novas, mesmaCat(usadas), usadas].find((l) => l.length);
      if (!op) { toast('Não tem outra copy pra trocar.'); return; }
      grItens[i] = { ...op[Math.floor(Math.random() * op.length)] };
    }
    renderGeradorSaida();
  });
}

// ═══════════════════════════════════════════════ EXTRAIR ═══
// Todas as copys (filtradas) no mesmo formato do Gerador: uma por bloco, linha em branco entre elas.

let exModelo = '';          // '' = todas as modelos
let exCatsSel = null;       // Set de categorias marcadas (null = todas)
let exPeriodo = 'todas';    // 'todas' | '30' | '7' | 'hoje'
let exOrdem = 'recentes';   // 'recentes' | 'categoria' | 'embaralhar'
let exPartes = 0;           // 0 = tudo junto; senão N copys por parte
let exCache = null;         // lista atual (pra o "embaralhar" não mudar a cada clique em copiar)

function copysExtrair() {
  const mapa = new Map(); let escondidas = 0;
  todasMineradas.forEach((c) => {
    if (exModelo && c.modelo !== exModelo) return;
    if (!c.mensagem || !naoEhRuim(c.mensagem)) return;
    const k = (exModelo ? '' : c.modelo + '|') + normTexto(c.mensagem);
    if (temaProibido(c.mensagem)) { if (!mapa.has(k)) { mapa.set(k, null); escondidas++; } return; }
    const ts = tsCopy(c);
    const atual = mapa.get(k);
    if (atual === undefined) mapa.set(k, { texto: c.mensagem, categoria: c.tipo || 'Outras', modelo: c.modelo, ts });
    else if (atual && ts > atual.ts) atual.ts = ts;
  });
  return { lista: [...mapa.values()].filter(Boolean), escondidas };
}

function filtrarExtrair(lista) {
  const agora = Date.now();
  const limite = exPeriodo === 'hoje' ? inicioDoDia(agora) : exPeriodo === 'todas' ? 0 : agora - Number(exPeriodo) * 86400000;
  return lista.filter((c) => (!exCatsSel || exCatsSel.has(c.categoria)) && (!limite || c.ts >= limite));
}

function ordenarExtrair(lista) {
  if (exOrdem === 'embaralhar') return embaralhar(lista.slice());
  const porData = lista.slice().sort((a, b) => b.ts - a.ts);
  if (exOrdem === 'categoria') {
    const ordem = CATEGORIAS_COPYS.concat([...new Set(porData.map((c) => c.categoria))].filter((c) => !CATEGORIAS_COPYS.includes(c)));
    return porData.sort((a, b) => ordem.indexOf(a.categoria) - ordem.indexOf(b.categoria) || b.ts - a.ts);
  }
  return porData;
}

function partesExtrair(lista) {
  if (!exPartes || lista.length <= exPartes) return [lista];
  const partes = [];
  for (let i = 0; i < lista.length; i += exPartes) partes.push(lista.slice(i, i + exPartes));
  return partes;
}
function textoBlocos(lista) { return lista.map((c) => blocoCopy(c.texto)).join('\n\n'); }

function abrirExtrair() {
  const sel = document.getElementById('exModelo');
  const contagem = copysPorModeloContagem();
  if (!contagem.length) { sel.innerHTML = '<option>Carregando…</option>'; document.getElementById('exCats').innerHTML = ''; renderExtrairSaida(); return; }
  if (exModelo && !contagem.some(([m]) => m === exModelo)) exModelo = '';
  sel.innerHTML = `<option value="">Todas as modelos · ${contagem.reduce((t, [, n]) => t + n, 0)} copys</option>`
    + contagem.map(([m, n]) => `<option value="${escAttr(m)}" ${m === exModelo ? 'selected' : ''}>${esc(m)} · ${n} copys</option>`).join('');
  exCache = null;
  renderExtrairFiltros();
  renderExtrairSaida();
}

function renderExtrairFiltros() {
  const { lista } = copysExtrair();
  const porCat = {};
  lista.forEach((c) => { porCat[c.categoria] = (porCat[c.categoria] || 0) + 1; });
  const ordem = CATEGORIAS_COPYS.filter((c) => porCat[c]).concat(Object.keys(porCat).filter((c) => !CATEGORIAS_COPYS.includes(c)));
  if (exCatsSel) exCatsSel = new Set([...exCatsSel].filter((c) => porCat[c]));
  document.getElementById('exCats').innerHTML = ordem.length ? ordem.map((c) => {
    const on = !exCatsSel || exCatsSel.has(c);
    return `<button type="button" class="gr-cat ${on ? 'on' : ''}" data-cat="${escAttr(c)}" aria-pressed="${on}" style="--cat:${COR_CATEGORIA[c] || 'var(--accent)'}">${esc(c)} <span>${porCat[c]}</span></button>`;
  }).join('') : '<span class="gr-vazio-txt">Nenhuma copy ainda.</span>';
  document.querySelectorAll('#exPeriodo button').forEach((b) => b.classList.toggle('ativo', b.dataset.v === exPeriodo));
  document.querySelectorAll('#exOrdem button').forEach((b) => b.classList.toggle('ativo', b.dataset.v === exOrdem));
  document.getElementById('exPartes').value = String(exPartes);
}

function renderExtrairSaida() {
  const box = document.getElementById('exSaida');
  if (!todasMineradas.length) { box.innerHTML = '<div class="gr-vazio"><span class="gr-vazio-ico" aria-hidden="true">⇩</span><strong>Carregando as copys…</strong></div>'; return; }
  const { lista, escondidas } = copysExtrair();
  if (!exCache) exCache = ordenarExtrair(filtrarExtrair(lista));
  const itens = exCache;
  const quem = exModelo ? `<b>${esc(exModelo)}</b>` : 'todas as modelos';
  if (!itens.length) {
    box.innerHTML = `<div class="gr-vazio"><span class="gr-vazio-ico" aria-hidden="true">⇩</span><strong>Nenhuma copy com esses filtros</strong><p>Tente outro período ou marque mais categorias.</p></div>`;
    return;
  }
  const tudo = textoBlocos(itens);
  const partes = partesExtrair(itens);
  let ini = 0;
  box.innerHTML = `<div class="gr-res-head">
      <div class="gr-res-titulo"><strong>${itens.length} ${itens.length === 1 ? 'copy' : 'copys'}</strong><span>de ${quem} · ${tudo.length.toLocaleString('pt-BR')} caracteres</span></div>
    </div>
    ${escondidas ? `<p class="ex-nota">${escondidas} ${escondidas === 1 ? 'copy ficou' : 'copys ficaram'} de fora por tema proibido (continuam na aba Copys).</p>` : ''}
    ${partes.map((p, i) => {
      const txt = textoBlocos(p); const de = ini + 1; ini += p.length;
      return `<div class="ex-parte">
        ${partes.length > 1 ? `<div class="ex-parte-head"><strong>Parte ${i + 1}</strong><span>copys ${de}–${ini} · ${p.length} blocos</span>
          <button type="button" class="btn btn-ghost ex-copiar-parte" data-parte="${i}">⧉ Copiar parte ${i + 1}</button></div>` : ''}
        <pre class="gr-preview ex-preview">${esc(txt)}</pre>
      </div>`;
    }).join('')}
    <div class="gr-res-acoes">
      ${exOrdem === 'embaralhar' ? '<button type="button" class="btn btn-ghost" data-acao="reembaralhar">🔀 Embaralhar de novo</button>' : ''}
      <button type="button" class="btn btn-ghost" data-acao="baixar">⇩ Baixar .txt</button>
      <button type="button" class="btn btn-primary gr-copiar-tudo" data-acao="copiar-tudo">⧉ Copiar tudo (${itens.length})</button>
    </div>`;
}

function configurarExtrair() {
  const refazer = () => { exCache = null; renderExtrairFiltros(); renderExtrairSaida(); };
  document.getElementById('exModelo').addEventListener('change', (e) => { exModelo = e.target.value; exCatsSel = null; refazer(); });
  document.getElementById('exCats').addEventListener('click', (e) => {
    const b = e.target.closest('.gr-cat'); if (!b) return;
    const todas = [...document.querySelectorAll('#exCats .gr-cat')].map((x) => x.dataset.cat);
    if (!exCatsSel) exCatsSel = new Set(todas);
    if (exCatsSel.has(b.dataset.cat)) exCatsSel.delete(b.dataset.cat); else exCatsSel.add(b.dataset.cat);
    if (exCatsSel.size === todas.length) exCatsSel = null;
    refazer();
  });
  document.getElementById('exTodas').addEventListener('click', () => {
    const todas = [...document.querySelectorAll('#exCats .gr-cat')].map((x) => x.dataset.cat);
    exCatsSel = exCatsSel ? null : new Set();
    if (exCatsSel && !todas.length) exCatsSel = null;
    refazer();
  });
  document.getElementById('exPeriodo').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; exPeriodo = b.dataset.v; refazer(); });
  document.getElementById('exOrdem').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; exOrdem = b.dataset.v; refazer(); });
  document.getElementById('exPartes').addEventListener('change', (e) => { exPartes = Number(e.target.value) || 0; renderExtrairSaida(); });
  document.getElementById('exSaida').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b || !exCache) return;
    const quem = exModelo || 'todas as modelos';
    if (b.dataset.parte !== undefined) {
      const p = partesExtrair(exCache)[Number(b.dataset.parte)];
      copiarTexto(textoBlocos(p)); toast(`Parte ${Number(b.dataset.parte) + 1} copiada (${p.length} copys)`);
      b.classList.add('ex-feito'); b.textContent = `✓ Parte ${Number(b.dataset.parte) + 1} copiada`;
    } else if (b.dataset.acao === 'copiar-tudo') {
      copiarTexto(textoBlocos(exCache)); toast(`${exCache.length} copys copiadas`);
      registrarAtividade('Extraiu copys', `${quem} · ${exCache.length} copys`);
    } else if (b.dataset.acao === 'baixar') {
      const blob = new Blob([textoBlocos(exCache)], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `copys-${normTexto(quem).replace(/\s+/g, '-') || 'todas'}-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      registrarAtividade('Baixou copys', `${quem} · ${exCache.length} copys`);
    } else if (b.dataset.acao === 'reembaralhar') { exCache = null; renderExtrairSaida(); }
  });
}

// ═══════════════════════════════════════════════ DASHBOARD ═══

function renderDashboard() {
  const totalMineradas = todasMineradas.length;
  const totalFavoritas = favoritos.length;
  const modelos = new Set(todasMineradas.map((c) => c.modelo)).size;

  document.getElementById('kpiMineradas').textContent = totalMineradas;
  document.getElementById('kpiFavoritas').textContent = totalFavoritas;
  document.getElementById('kpiModelos').textContent = modelos;

  // Bar chart por tipo
  const porTipo = {};
  todasMineradas.forEach((c) => { if (c.tipo) porTipo[c.tipo] = (porTipo[c.tipo] || 0) + 1; });
  const tipos = Object.entries(porTipo).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxTipo = tipos.length ? tipos[0][1] : 1;
  const chartEl = document.getElementById('chartTipos');
  chartEl.innerHTML = tipos.length ? tipos.map(([tipo, count]) => `
    <div class="bar-row">
      <span class="bar-row-label">${esc(tipo)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round((count / maxTipo) * 100)}%;background:${COR_TIPO[tipo] || 'var(--accent)'}"></div></div>
      <span class="bar-row-count">${count}</span>
    </div>`).join('') : '<p class="empty-hint">Carregue as copys mineradas para ver o gráfico.</p>';

  // Top modelos
  const porModelo = {};
  todasMineradas.forEach((c) => { if (c.modelo) porModelo[c.modelo] = (porModelo[c.modelo] || 0) + 1; });
  const topModelos = Object.entries(porModelo).sort((a, b) => b[1] - a[1]).slice(0, 8);
  document.getElementById('topModelos').innerHTML = topModelos.length ? topModelos.map(([nome, count], i) => `
    <div class="rank-item"><span class="rank-pos">${i + 1}</span><span class="rank-name">${esc(nome)}</span><span class="rank-count">${count}</span></div>`).join('')
    : '<p class="empty-hint">Nenhum dado ainda.</p>';

  // Mais copiadas
  const topCopiadas = Object.entries(copyCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  document.getElementById('maisCopiadas').innerHTML = topCopiadas.length ? topCopiadas.map(([texto, count], i) => `
    <div class="rank-item"><span class="rank-pos">${i + 1}</span><span class="rank-name" title="${escAttr(texto)}">${esc(texto)}</span><span class="rank-count">${count}×</span></div>`).join('')
    : '<p class="empty-hint">Copie alguma copy pra aparecer aqui.</p>';

  // Atividade recente
  const recentes = [...todasMineradas].filter((c) => c.data).sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 8);
  document.getElementById('atividadeRecente').innerHTML = recentes.length ? recentes.map((c) => `
    <div class="activity-item"><span class="activity-dot"></span>
      <div><div class="activity-text"><b>${esc(c.modelo || '—')}</b> · ${esc(c.tipo || 'Outro')}</div><div class="activity-meta">${esc(formatarData(c.data))}</div></div>
    </div>`).join('') : '<p class="empty-hint">Nenhuma atividade recente.</p>';

  // Métricas de IA (compartilhadas via Firestore)
  const geradas = metricasGlobais.copysGeradas || 0;
  const copiadas = metricasGlobais.copysCopiadas || 0;
  document.getElementById('kpiCopysGeradas').textContent = geradas;
  document.getElementById('kpiCopysCopiadas').textContent = copiadas;
  document.getElementById('kpiTaxaUso').textContent = geradas ? Math.round((copiadas / geradas) * 100) + '%' : '0%';
  const porHora = metricasGlobais.porHora || {};
  const horas = Object.entries(porHora).sort((a, b) => b[1] - a[1]);
  document.getElementById('kpiMelhorHorario').textContent = horas.length ? horas[0][0] + 'h' : '—';

  const totalBoa = Object.values(feedbackCopy).filter((v) => v === 'boa').length;
  const totalRuim = Object.values(feedbackCopy).filter((v) => v === 'ruim').length;
  const totalFeedback = totalBoa + totalRuim;
  const pctBoa = totalFeedback ? Math.round((totalBoa / totalFeedback) * 100) : 0;
  document.getElementById('feedbackPctBoa').textContent = pctBoa + '%';
  document.getElementById('feedbackPctRuim').textContent = (totalFeedback ? 100 - pctBoa : 0) + '%';
  document.getElementById('feedbackBarBoa').style.width = pctBoa + '%';
  document.getElementById('feedbackBarBoa').parentElement.classList.toggle('vazia', !totalFeedback);
}

// ═══════════════════════════════════════════════ INIT ═══

document.addEventListener('DOMContentLoaded', () => {
  configurarLogin();
  configurarCriarAtendente();
  configurarNav();
  configurarConfigModal();
  configurarMineradas();
  configurarGerador();
  configurarExtrair();
  configurarFavoritos();
  configurarNovidades();

  renderDashboard();

  carregarMineradasDoCache();
  carregarMineradas();

  abrirTabDaHash();
  window.addEventListener('hashchange', abrirTabDaHash);
});
