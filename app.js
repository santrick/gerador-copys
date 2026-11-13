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
    feedAdminAtivo = false;
    feedFuncionariosAtivo = false;
    favoritos = [];
    feedbackCopy = {};
    const listaFunc = document.getElementById('listaFuncionarios');
    const listaAtiv = document.getElementById('atividadeEquipe');
    if (listaFunc) listaFunc.innerHTML = '';
    if (listaAtiv) listaAtiv.innerHTML = '';
    irParaTab('mineradas', { semHash: true });
    abrirTabDaHash();

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
    carregarMineradas();
    iniciarFeedFavoritos();
    iniciarFeedFeedbackCopy();
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
    container.innerHTML = `<div class="empty-state"><span class="empty-ico">⭐</span><p>${favoritosDocs.length ? 'Nenhum favorito com esse filtro.' : 'Nenhuma copy favoritada ainda. Toque na ⭐ de qualquer copy da aba Copys pra guardar aqui.'}</p></div>`;
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

const PAGE_INFO = {
  mineradas: { title: 'Copys', subtitle: 'Copys das modelos, direto da Privacy' },
  gerador: { title: 'Gerador', subtitle: 'Sorteia copys da modelo prontas pro campo ✏️ Mensagens' },
  extrair: { title: 'Extrair', subtitle: 'Todas as copys de uma vez, no formato do disparo' },
  agenda: { title: 'Agenda', subtitle: 'Planeje os disparos em massa da modelo' },
  favoritos: { title: 'Favoritos', subtitle: 'As copys que a equipe guardou' },
  admin: { title: 'Admin', subtitle: 'Criar acessos e ver a atividade da equipe' }
};

// ═══════════════════════════════════════════════ ESTADO ═══

const COR_TIPO = {
  Venda: '#ef4444', Saudacao: '#22c55e', Engajamento: '#3b82f6', Reengajamento: '#f97316',
  Conteudo: '#a855f7', Upsell: '#ec4899', Aquecimento: '#f472b6', Chamada: '#06b6d4',
  Pergunta: '#84cc16', Outro: '#64748b'
};

let todasMineradas = [];
let mineradasFiltradas = [];
let paginaMineradas = 1;
const CATEGORIAS_COPYS = ['PPV', 'Prévias', 'Boas-vindas', 'Remarketing', 'Expirados', 'Promoções', 'VIP', 'Chamadas', 'Disparos em massa', 'Pós-venda', 'Reengajamento', 'Testes'];


let favoritos = []; // agora compartilhado via Firestore (coleção "favoritos"), veja iniciarFeedFavoritos()
let favoritosDocs = []; // mesmos favoritos com origem/categoria/quem salvou, pra aba Favoritos
let feedbackCopy = {}; // hash(texto) -> 'boa' | 'ruim', compartilhado via Firestore (coleção "feedback_copy")
let unsubFavoritos = null;
let unsubFeedbackCopy = null;
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
  const pill = document.getElementById('pillCopys');
  if (pill) pill.title = texto;
  const sidebarStatus = document.getElementById('sidebarStatus');
  sidebarStatus.classList.remove('ok', 'warn');
  if (tipo === 'ok') sidebarStatus.classList.add('ok');
  else if (tipo === 'erro' || tipo === 'aviso') sidebarStatus.classList.add('warn');
  document.getElementById('sidebarStatusTxt').textContent = texto;
}

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

let abaAtual = 'mineradas';
function irParaTab(tab, opts) {
  if (tab === 'disparo') tab = dpModo === 'todas' ? 'extrair' : 'agenda';
  if (tab === 'gerador') tab = 'agenda'; // o Gerador agora fica dentro da Agenda (Mensagens › Sortear copys)
  if (tab === 'gerador' || tab === 'extrair') dpModo = tab === 'gerador' ? 'sortear' : 'todas';
  if (!PAGE_INFO[tab]) return;
  if (tab === 'admin' && !souAdmin) tab = 'mineradas';
  if (abaAtual !== tab && novidades[abaAtual]) marcarComoVistas(abaAtual);
  abaAtual = tab;
  document.body.classList.toggle('aba-copys', tab === 'mineradas');
  document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === (dpAba(tab) ? 'tab-disparo' : `tab-${tab}`)));
  atualizarNavGlider();
  document.getElementById('pageTitle').textContent = PAGE_INFO[tab].title;
  document.getElementById('pageSubtitle').textContent = PAGE_INFO[tab].subtitle;
  fecharSidebarMobile();
  if (!opts || !opts.semHash) {
    history.replaceState(null, '', '#' + tab);
  }
  if (tab === 'favoritos') renderFavoritos();
  if (dpAba(tab)) abrirDisparo();
  if (tab === 'agenda' && typeof abrirAgenda === 'function') abrirAgenda();
  renderAbasCopys();
}

function abrirTabDaHash() {
  const tab = (location.hash || '').replace('#', '');
  if (PAGE_INFO[tab] || tab === 'disparo') irParaTab(tab, { semHash: tab !== 'disparo' });
}

function abrirSidebarMobile() { document.getElementById('sidebar').classList.add('open'); document.getElementById('scrim').classList.add('show'); }
function fecharSidebarMobile() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('scrim').classList.remove('show'); }

function configurarNav() {
  document.querySelectorAll('.nav-item').forEach((btn) => btn.addEventListener('click', () => irParaTab(btn.dataset.tab)));
  document.getElementById('menuBtn').addEventListener('click', abrirSidebarMobile);
  document.getElementById('sidebarClose').addEventListener('click', fecharSidebarMobile);
  document.getElementById('scrim').addEventListener('click', fecharSidebarMobile);
}

// ═══════════════════════════════════════════════ MINERADAS ═══

function configurarMineradas() {
  document.getElementById('btnRecarregarMineradas').addEventListener('click', () => carregarMineradas({ completo: true }));
  document.getElementById('buscaMineradas').addEventListener('input', () => { paginaMineradas = 1; aplicarFiltroMineradas(); });
  document.getElementById('filtroModeloMineradas').addEventListener('change', () => { paginaMineradas = 1; aplicarFiltroMineradas(); });
  document.getElementById('filtroTipoMineradas').addEventListener('change', () => { paginaMineradas = 1; aplicarFiltroMineradas(); });
  document.getElementById('buscaModelos').addEventListener('input', renderAbasCopys);
  configurarCalendario();
  configurarSelecao();
  document.getElementById('ordemCopys').addEventListener('change', (e) => { ordemCopys = e.target.value; aplicarFiltroMineradas(); });
  const marcarVista = () => document.querySelectorAll('#vistaCopys button').forEach((b) => { const on = b.dataset.vista === vistaCopys; b.classList.toggle('ativo', on); b.setAttribute('aria-pressed', on); });
  marcarVista();
  document.getElementById('vistaCopys').addEventListener('click', (e) => {
    const b = e.target.closest('[data-vista]'); if (!b || b.dataset.vista === vistaCopys) return;
    vistaCopys = b.dataset.vista;
    try { localStorage.setItem('copys_vista', vistaCopys); } catch (err) { /* ignora */ }
    marcarVista(); renderMineradas();
  });
  document.getElementById('periodoCopys').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-periodo]');
    if (!btn) return;
    periodoCopys = btn.dataset.periodo;
    calIni = calFim = null; rotuloCalendario();
    document.querySelectorAll('#periodoCopys button').forEach((b) => b.classList.toggle('ativo', b === btn));
    document.getElementById('popPeriodo').hidden = true;
    document.getElementById('btnCalendario').setAttribute('aria-expanded', 'false');
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
function nomeModelo(m) { return String(m || '').toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (x, a, b) => a + b.toUpperCase()); }
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
    .filter((m) => (contagem[m] || 0) > 0 || m === selModelo.value)
    .filter((m) => !termo || normTexto(m).includes(termo) || m === selModelo.value)
    .sort((x, y) => (contagem[y] || 0) - (contagem[x] || 0) || x.localeCompare(y));
  const item = (valor, nomeOrig, qtd, ativa) => {
    const nome = valor ? nomeModelo(nomeOrig) : nomeOrig;
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
  if (copysAtivo && sub) sub.textContent = selModelo.value ? `Copys de ${nomeModelo(selModelo.value)}` : PAGE_INFO.mineradas.subtitle;

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
      <div class="cp-hero-txt"><span class="cp-hero-eyebrow">Modelo</span><h2 class="cp-hero-nome">${esc(nomeModelo(modelo))}</h2></div>`;
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
    `;
  hero.querySelectorAll('img').forEach((img) => { img.onerror = () => img.remove(); });
}

// ═══ COPYS NO FIREBASE ═══
// Coleção "copys" (a extensão grava, o site lê) e "modelos" (foto de cada modelo).
// O ID da copy sai de modelo + data + hora + texto: igual na extensão e aqui,
// então reenviar o mesmo período não duplica nada.
function cyrb53(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0, ch; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}
function normId(t) { return String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[\s\p{P}\p{M}\p{C}]/gu, ''); }
function idCopyFirebase(c) { return 'c' + cyrb53([c.modelo, c.data, c.hora, c.mensagem].map(normId).join('|')).toString(36); }
function idModeloFirebase(nome) { return 'm' + cyrb53(normId(nome)).toString(36); }

const CACHE_FIREBASE = 'copys_firebase_v1';
// Lê do Firebase só o que mudou desde a última vez (o resto fica guardado no navegador)
async function lerCopysFirebase(completo) {
  let cache = completo ? null : safeParse(CACHE_FIREBASE, null);
  if (cache && (!cache.itens || Date.now() - (cache.lido || 0) > 3 * 86400000)) cache = null; // a cada 3 dias relê tudo
  const itens = cache ? cache.itens : {};
  let ultimo = cache ? cache.ultimo || 0 : 0;
  let q = db.collection('copys');
  if (ultimo) q = q.where('atualizadoEm', '>', firebase.firestore.Timestamp.fromMillis(ultimo));
  const [snap, snapModelos] = await Promise.all([q.get(), db.collection('modelos').get()]);
  snap.forEach((d) => {
    const x = d.data();
    const t = x.atualizadoEm && x.atualizadoEm.toMillis ? x.atualizadoEm.toMillis() : 0;
    if (t > ultimo) ultimo = t;
    itens[d.id] = { modelo: x.modelo || '', mensagem: x.mensagem || '', tipo: x.tipo || '', data: x.data || '', hora: x.hora || '', preco: x.preco ?? null, midia: x.midia || '' };
  });
  const avatares = {};
  snapModelos.forEach((d) => { const x = d.data(); if (x.nome && x.avatar) avatares[x.nome] = x.avatar; });
  try { localStorage.setItem(CACHE_FIREBASE, JSON.stringify({ ultimo, lido: cache ? cache.lido : Date.now(), itens })); } catch (e) { /* cota cheia: relê tudo da próxima vez */ }
  return { itens, avatares };
}

async function carregarMineradas(opcoes = {}) {
  if (!usuarioAtual) return;
  const btn = document.getElementById('btnRecarregarMineradas');
  btn.disabled = true;
  const textoOriginal = btn.textContent;
  btn.classList.add('girando');
  if (!todasMineradas.length) renderMineradas();
  setStatus(todasMineradas.length ? `${todasMineradas.length} copys (versão salva) — atualizando…` : 'Buscando copys…', 'aviso');

  try {
    // As copys vêm só do Firebase (só quem está logado lê); o Google Doc antigo não é mais lido pelo site
    const fb = await lerCopysFirebase(opcoes.completo);
    const copys = Object.values(fb.itens);
    avataresModelos = fb.avatares;
    aplicarDadosMineradas(copys, null);
    try { localStorage.setItem('gerador_mineradas_cache', JSON.stringify({ ts: Date.now(), copys: todasMineradas, modelos: null, avatares: avataresModelos })); } catch (e) { /* cota cheia: segue sem cache */ }
    const qtdNovas = novidades.mineradas.size;
    setStatus(`${todasMineradas.length} copys carregadas` + (qtdNovas ? ` · ${qtdNovas} nova${qtdNovas > 1 ? 's' : ''} desde sua última visita` : ' · nenhuma nova desde sua última visita'), 'ok');
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
  const porModelo = copysPorModeloContagem();
  const pill = document.getElementById('pillCopys');
  pill.textContent = `${porModelo.reduce((t, [, n]) => t + n, 0)} copys · ${porModelo.length} modelos`;
  pill.hidden = false;
  aplicarFiltroMineradas();
  if (document.getElementById('tab-disparo').classList.contains('active')) abrirDisparo();
  if (abaAtual === 'agenda' && typeof abrirAgenda === 'function') abrirAgenda();
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
let vistaCopys = (() => { try { return localStorage.getItem('copys_vista') === 'cartoes' ? 'cartoes' : 'lista'; } catch (e) { return 'lista'; } })();
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
  if (!calIni) {
    el.textContent = { hoje: 'Hoje', 7: 'Últimos 7 dias', 30: 'Últimos 30 dias' }[periodoCopys] || 'Tudo';
    btn.classList.toggle('ativo', periodoCopys !== 'tudo');
    return;
  }
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
  const box = document.getElementById('popPeriodo');
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
    if (calFim) setTimeout(fechar, 250);  });
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
        : '<div class="empty-state"><span class="empty-ico">▤</span><p>Nenhuma copy ainda. Elas aparecem aqui assim que a extensão enviar.</p></div>');
    return;
  }

  const total = mineradasFiltradas.length;
  container.className = 'lista-copys vista-' + vistaCopys;
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
  const reBusca = regexBusca(document.getElementById('buscaMineradas').value);
  copysNaTela = new Map(visiveis.map((c) => [chaveCopy(c), c]));
  container.innerHTML = grupos.map((g) => `<section class="copys-grupo">
      ${g.titulo ? `<h3 class="copys-dia"><span>${esc(g.titulo)}${g.dia && /^(Hoje|Ontem)$/.test(g.titulo) ? `<em>${new Date(g.dia).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</em>` : ''}</span><span class="copys-dia-qtd">${totalPorDia[g.dia]} ${totalPorDia[g.dia] === 1 ? 'copy' : 'copys'}</span></h3>` : ''}
      <div class="grid-copys copys-grid">${g.itens.map((c) => cardCopyModeloHtml(c, mostrarModelo, reBusca)).join('')}</div>
    </section>`).join('')
    + (total > limiteCopys ? `<div class="copys-mais"><button type="button" class="btn btn-secondary" id="btnMaisCopys">Mostrar mais ${Math.min(PASSO_COPYS, total - limiteCopys)} <span>de ${total - limiteCopys} restantes</span></button></div>` : '');

  ligarEventosCard(container);
  ligarEventosCopyItem(container);
  const mais = document.getElementById('btnMaisCopys');
  if (mais) mais.addEventListener('click', () => { limiteCopys += PASSO_COPYS; renderMineradas(); });
  atualizarSelBarra();
}

// ── busca destacada no texto (ignora acento e maiúscula) ──
const VARIANTES_BUSCA = { a: 'aáàâãä', e: 'eéèêë', i: 'iíìîï', o: 'oóòôõö', u: 'uúùûü', c: 'cç', n: 'nñ' };
function regexBusca(termo) {
  const t = normTexto(termo);
  if (!t) return null;
  const src = [...t].map((ch) => VARIANTES_BUSCA[ch] ? `[${VARIANTES_BUSCA[ch]}]` : /\s/.test(ch) ? '\\s+' : ch.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')).join('');
  try { return new RegExp(src, 'giu'); } catch (e) { return null; }
}
function marcarBusca(texto, re) {
  if (!re) return esc(texto);
  let out = '', ultimo = 0;
  for (const m of texto.matchAll(re)) {
    if (!m[0]) continue;
    out += esc(texto.slice(ultimo, m.index)) + '<mark>' + esc(m[0]) + '</mark>';
    ultimo = m.index + m[0].length;
  }
  return out + esc(texto.slice(ultimo));
}

// ── seleção de várias copys pra colar no ✏️ Mensagens do disparo ──
const selCopys = new Map();      // chave -> { texto, modelo } (na ordem em que foram marcadas)
let copysNaTela = new Map();
function chaveCopy(c) { return c.modelo + '|' + normTexto(c.mensagem); }
function podeSelecionar(c) { return !temaProibido(c.mensagem || ''); }

function marcarCardSel(card, on) {
  card.classList.toggle('is-sel', on);
  const b = card.querySelector('.copy-item-sel');
  if (b) b.setAttribute('aria-checked', on);
}
function alternarSelecao(card) {
  const k = card.dataset.chave;
  const c = copysNaTela.get(k);
  if (!c || !podeSelecionar(c)) return;
  if (selCopys.has(k)) selCopys.delete(k);
  else selCopys.set(k, { texto: c.mensagem, modelo: c.modelo });
  marcarCardSel(card, selCopys.has(k));
  atualizarSelBarra();
}
function atualizarSelBarra() {
  const barra = document.getElementById('selBarra');
  if (!barra) return;
  const n = selCopys.size;
  document.body.classList.toggle('com-selecao', n > 0);
  barra.hidden = n === 0;
  if (!n) return;
  document.getElementById('selQtd').textContent = n;
  document.getElementById('selRotulo').textContent = n === 1 ? 'selecionada' : 'selecionadas';
  const faltam = mineradasFiltradas.filter((c) => podeSelecionar(c) && !selCopys.has(chaveCopy(c))).length;
  const todas = document.getElementById('selTodas');
  todas.hidden = !faltam;
  todas.innerHTML = `+ Marcar as outras ${faltam}<span class="sel-extra"> do filtro</span>`;
}
function configurarSelecao() {
  document.getElementById('selLimpar').addEventListener('click', () => {
    selCopys.clear();
    document.querySelectorAll('#listaMineradas .copy-item.is-sel').forEach((c) => marcarCardSel(c, false));
    atualizarSelBarra();
  });
  document.getElementById('selTodas').addEventListener('click', () => {
    mineradasFiltradas.forEach((c) => { const k = chaveCopy(c); if (podeSelecionar(c) && !selCopys.has(k)) selCopys.set(k, { texto: c.mensagem, modelo: c.modelo }); });
    document.querySelectorAll('#listaMineradas .copy-item[data-chave]').forEach((c) => marcarCardSel(c, selCopys.has(c.dataset.chave)));
    atualizarSelBarra();
  });
  document.getElementById('selCopiar').addEventListener('click', (e) => {
    const lista = [...selCopys.values()];
    if (!lista.length) return;
    const btn = e.currentTarget;
    copiarTexto(lista.map((x) => blocoCopy(x.texto)).join('\n\n')).then(() => {
      toast(`${lista.length} ${lista.length === 1 ? 'copy copiada' : 'copys copiadas'} no formato do disparo`);
      const modelos = [...new Set(lista.map((x) => nomeModelo(x.modelo)))];
      registrarAtividade('Copiou selecionadas', `${modelos.length > 2 ? modelos.length + ' modelos' : modelos.join(', ')} · ${lista.length} copys`);
      btn.classList.add('ok'); btn.innerHTML = '✓ Copiadas';
      setTimeout(() => { btn.classList.remove('ok'); btn.innerHTML = '<span aria-hidden="true">⧉</span> Copiar pro disparo'; }, 1600);
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selCopys.size && document.getElementById('popPeriodo').hidden && document.getElementById('tab-mineradas').classList.contains('active')) document.getElementById('selLimpar').click();
  });
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

function cardCopyModeloHtml(c, mostrarModelo, reBusca) {
  const texto = c.mensagem || '';
  const cor = COR_CATEGORIA[c.tipo] || 'var(--accent)';
  const foto = avataresModelos[c.modelo];
  const nova = novidades.mineradas.has(idMinerada(c));
  const preco = precoCopy(c.preco);
  const linhas = (texto.match(/\n/g) || []).length;
  const longa = vistaCopys === 'lista' ? (texto.length > 230 || linhas > 3) : (texto.length > 300 || linhas > 6);
  const aberta = longa && reBusca && texto.search(reBusca) > 160;
  if (reBusca) reBusca.lastIndex = 0;
  const chave = chaveCopy(c);
  const fora = !podeSelecionar(c);
  const sel = !fora && selCopys.has(chave);
  return `<article class="copy-item ${nova ? 'is-nova' : ''} ${sel ? 'is-sel' : ''}" style="--cat:${cor}" data-chave="${escAttr(chave)}">
    <header class="copy-item-top">
      ${fora
        ? '<span class="copy-item-sel is-off" title="Essa copy não entra na seleção" aria-hidden="true"></span>'
        : `<button type="button" class="copy-item-sel" role="checkbox" aria-checked="${sel}" aria-label="Selecionar pro disparo" title="Selecionar pro disparo"></button>`}
      ${mostrarModelo ? `<span class="copy-item-modelo"><span class="copy-item-av" style="--cor:${corAvatar(c.modelo || '')}">${esc(iniciais(c.modelo))}${foto ? `<img src="${escAttr(foto)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}</span>${esc(nomeModelo(c.modelo).split(/\s+/)[0])}</span>` : ''}
      <span class="copy-item-cat">${esc(c.tipo || '')}</span>
      ${nova ? '<span class="copy-item-nova">nova</span>' : ''}
      ${fora ? '<span class="copy-item-fora" title="Tema que pode parecer de menor de idade (escola, novinha, virgem…). O Gerador, o Extrair e a seleção não usam essa copy.">fora do gerador</span>' : ''}
      ${preco ? `<span class="copy-item-preco">${preco}</span>` : ''}
    </header>
    <p class="copy-item-texto ${longa ? 'is-longa' : ''} ${aberta ? 'is-aberta' : ''}" title="Clique pra copiar">${marcarBusca(texto, reBusca)}</p>
    ${longa ? `<button type="button" class="copy-item-mais">${aberta ? 'mostrar menos' : 'ver tudo'}</button>` : ''}
    <footer class="copy-item-bottom">
      <span class="copy-item-data">${esc(c.hora || dataCurtaCopy(c.data))}${c.vezes > 1 ? `<span class="copy-item-vezes" title="Mandou essa mesma copy ${c.vezes} vezes">enviada ${c.vezes}×</span>` : ''}</span>
      <div class="copy-item-acoes">
        ${botaoFavHtml(texto, 'minerada', c.tipo)}
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
  container.querySelectorAll('.copy-item-sel:not(.is-off)').forEach((b) => b.addEventListener('click', () => alternarSelecao(b.closest('.copy-item'))));
  container.querySelectorAll('.copy-item-texto').forEach((p) => p.addEventListener('click', () => {
    if (window.getSelection && String(window.getSelection()).length) return; // deixa selecionar trecho
    const card = p.closest('.copy-item');
    // selecionando várias: clicar no texto marca/desmarca em vez de copiar
    if (selCopys.size && card.querySelector('.copy-item-sel:not(.is-off)')) return alternarSelecao(card);
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
        ${botaoFavHtml(texto, origemFav || origem, categoria || tag)}
        <button class="icon-btn btn-copiar" title="Copiar" data-texto="${escAttr(texto)}">📋</button>
      </div>
    </div>
  </div>`;
}

function ligarEventosCard(container) {
  container.querySelectorAll('.btn-copiar').forEach((btn) => btn.addEventListener('click', () => {
    copiarTexto(btn.dataset.texto).then(() => { toast('Copy copiada!'); btn.textContent = '✅'; setTimeout(() => (btn.textContent = '📋'), 1400); });
  }));
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
    if (!mapa.has(k)) mapa.set(k, { texto: c.mensagem, categoria: c.tipo || 'Outras', preco: c.preco, midia: c.midia || '' });
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
  sel.innerHTML = modelos.map((m) => `<option value="${escAttr(m)}" ${m === grModelo ? 'selected' : ''}>${esc(nomeModelo(m))} · ${contagem[m]} copys</option>`).join('');
  const faixa = document.getElementById('grModelos');
  faixa.innerHTML = modelos.map((m) => {
    const foto = avataresModelos[m];
    const on = m === grModelo;
    return `<button type="button" class="gr2-mod ${on ? 'ativo' : ''}" data-m="${escAttr(m)}" role="option" aria-selected="${on}" title="${escAttr(nomeModelo(m))}">
      <span class="gr-av" style="--cor:${corAvatar(m)}">${esc(iniciais(m))}${foto ? `<img src="${escAttr(foto)}" alt="" referrerpolicy="no-referrer">` : ''}</span>
      <span class="gr2-mod-txt"><b>${esc(nomeModelo(m).split(/\s+/)[0])}</b><small>${contagem[m]} copys</small></span>
    </button>`;
  }).join('');
  faixa.querySelectorAll('img').forEach((img) => { img.onerror = () => img.remove(); });
  const ativa = faixa.querySelector('.gr2-mod.ativo');
  if (ativa && faixa.scrollWidth > faixa.clientWidth) ativa.scrollIntoView({ block: 'nearest', inline: 'nearest' });
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

const GR_ICO = {
  copiar: '<svg viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/></svg>',
  editar: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>',
  salvar: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  trocar: '<svg viewBox="0 0 24 24"><path d="M4 7h11l-3-3M20 17H9l3 3"/></svg>',
  remover: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  subir: '<svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5"/></svg>',
  descer: '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"/></svg>',
  agenda: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  dado: '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.3"/><circle cx="15.5" cy="15.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/></svg>'
};
function avatarChatGerador() {
  const foto = avataresModelos[grModelo];
  return `<span class="gr-av" style="--cor:${corAvatar(grModelo)}">${esc(iniciais(grModelo))}${foto ? `<img src="${escAttr(foto)}" alt="" referrerpolicy="no-referrer">` : ''}</span>`;
}

function renderGeradorSaida() {
  const box = document.getElementById('grSaida');
  if (!grItens.length) {
    const nome = grModelo ? esc(nomeModelo(grModelo).split(/\s+/)[0]) : '';
    box.innerHTML = `<div class="gr-vazio">
      <div class="gr-vazio-ilustra" aria-hidden="true">
        <span style="--w:70%"></span><span style="--w:86%"></span><span style="--w:52%"></span>
      </div>
      <strong>${grModelo ? `Sorteie as copys de ${nome}` : 'Carregando as modelos…'}</strong>
      <p>Escolha as categorias e a quantidade e clique em <b>Sortear copys</b>. Elas saem prontas pro campo <b>Mensagens</b> do disparo: uma por bloco, com linha em branco entre elas.</p>
    </div>`;
    return;
  }
  const n = grItens.length;
  const txt = textoGerador();
  box.innerHTML = `<div class="gr-topo">
      <div class="gr-topo-titulo">
        <strong>${n} ${n === 1 ? 'copy sorteada' : 'copys sorteadas'}</strong>
        <span>${esc(nomeModelo(grModelo))} · ${txt.length.toLocaleString('pt-BR')} caracteres</span>
      </div>
      <div class="segmentado gr-vista" role="group" aria-label="Ver como">
        <button type="button" data-vista="lista" class="${grVista === 'lista' ? 'ativo' : ''}">Chat</button>
        <button type="button" data-vista="texto" class="${grVista === 'texto' ? 'ativo' : ''}">Texto final</button>
      </div>
      <div class="gr-topo-acoes">
        <button type="button" class="gr-btn2" data-acao="resortear">${GR_ICO.trocar}<span>Sortear de novo</span></button>
        <button type="button" class="gr-btn2 gr-agenda" data-acao="mandar-agenda" title="Coloca essas copys nos horários vazios da Agenda dessa modelo">${GR_ICO.agenda}<span>Mandar pra Agenda</span></button>
        <button type="button" class="gr-btn1 gr-copiar-tudo" data-acao="copiar-tudo">${GR_ICO.copiar}<span>Copiar tudo</span></button>
      </div>
    </div>
    ${grAviso ? `<p class="gr-aviso">${esc(grAviso)}</p>` : ''}
    ${grVista === 'texto'
      ? `<pre class="gr-preview">${esc(txt)}</pre>`
      : `<div class="gr-chat">
        <div class="gr-chat-topo">
          <svg class="gr-chat-voltar" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
          ${avatarChatGerador()}
          <span class="gr-chat-quem"><b>${esc(nomeModelo(grModelo))}<svg class="gr-chat-verif" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.2 12.3l2.6 2.6 5-5.4"/></svg></b><small>Visto por último ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small></span>
          <span class="gr-chat-icones" aria-hidden="true">
            <svg viewBox="0 0 24 24" class="cheio"><path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/></svg>
            <span class="gr-chat-galeria"><svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4.5 4"/></svg>Galeria</span>
            <svg viewBox="0 0 24 24" class="cheio"><circle cx="12" cy="5.5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="18.5" r="1.7"/></svg>
          </span>
        </div>
        <div class="gr-chat-corpo">
          <div class="gr-chat-dia"><span>Hoje</span></div>
          <ol class="gr-lista gr-chat-lista">${grItens.map((c, i) => {
            const preco = precoCopy(c.preco);
            const qtdMidia = (String(c.midia || '').match(/\d+/g) || []).reduce((t, x) => t + Number(x), 0);
            return `<li class="gr-item ${preco ? 'is-ppv' : ''} ${grEditando === i ? 'editando' : ''}" data-i="${i}" style="--cat:${COR_CATEGORIA[c.categoria] || 'var(--accent)'}">
            <div class="gr-msg">
              ${avatarChatGerador()}
              <div class="gr-bolha">
                ${preco ? `<div class="gr-ppv-midia" aria-hidden="true">
                  <span class="gr-ppv-seta esq"><svg viewBox="0 0 24 24"><path d="M14 7l-5 5 5 5"/></svg></span>
                  <span class="gr-ppv-seta dir"><svg viewBox="0 0 24 24"><path d="M10 7l5 5-5 5"/></svg></span>
                  ${qtdMidia ? `<span class="gr-ppv-qtd">${qtdMidia}<i></i></span>` : ''}
                  <span class="gr-ppv-cadeado"><svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>${esc(c.midia || 'Mídia do PPV')}</span>
                </div>` : ''}
                <p class="gr-texto" ${grEditando === i ? 'contenteditable="plaintext-only" spellcheck="false"' : ''}>${esc(blocoCopy(c.texto))}</p>
              </div>
              <button type="button" class="gr-kebab" data-acao="menu" aria-label="Opções dessa copy" title="Opções"><svg viewBox="0 0 24 24"><circle cx="12" cy="5.5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="18.5" r="1.7"/></svg></button>
              <div class="gr-botoes">
                <button type="button" class="gr-ico" data-acao="subir" title="Subir" aria-label="Subir" ${i ? '' : 'disabled'}>${GR_ICO.subir}</button>
                <button type="button" class="gr-ico" data-acao="descer" title="Descer" aria-label="Descer" ${i < n - 1 ? '' : 'disabled'}>${GR_ICO.descer}</button>
                <button type="button" class="gr-ico" data-acao="copiar" title="Copiar só essa" aria-label="Copiar só essa">${GR_ICO.copiar}</button>
                <button type="button" class="gr-ico" data-acao="editar" title="${grEditando === i ? 'Salvar' : 'Editar'}" aria-label="${grEditando === i ? 'Salvar' : 'Editar'}">${grEditando === i ? GR_ICO.salvar : GR_ICO.editar}</button>
                <button type="button" class="gr-ico" data-acao="trocar" title="Trocar por outra" aria-label="Trocar por outra">${GR_ICO.trocar}</button>
                <button type="button" class="gr-ico gr-ico-x" data-acao="remover" title="Tirar essa" aria-label="Tirar essa">${GR_ICO.remover}</button>
              </div>
            </div>
            <span class="gr-msg-hora"><span class="gr-tag">${esc(c.categoria)}</span>${c.editada ? ' · editada' : ''} · ${i + 1}/${n}${preco ? ` <span class="gr-ppv-pago">· <b>${preco}</b> ainda não pago</span>` : ''}</span>
            ${preco ? `<div class="gr-ppv-acao">${avatarChatGerador()}<span class="gr-ppv-btn">Desbloquear por ${preco}</span></div>` : ''}
          </li>`;
          }).join('')}</ol>
        </div>
      </div>`}`;
  box.querySelectorAll('.gr-chat img').forEach((img) => { img.onerror = () => img.remove(); });
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
  document.getElementById('grModelos').addEventListener('click', (e) => {
    const b = e.target.closest('[data-m]'); if (!b || b.dataset.m === grModelo) return;
    grModelo = b.dataset.m; trocouModeloGerador(); abrirGerador();
  });
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
    const btn = e.target.closest('[data-acao]');
    if (!btn) { saida.querySelectorAll('.gr-item.menu-aberto').forEach((x) => x.classList.remove('menu-aberto')); return; }
    const acao = btn.dataset.acao;
    if (acao === 'menu') {
      const li = btn.closest('.gr-item');
      const abrir = !li.classList.contains('menu-aberto');
      saida.querySelectorAll('.gr-item.menu-aberto').forEach((x) => x.classList.remove('menu-aberto'));
      li.classList.toggle('menu-aberto', abrir);
      return;
    }
    if (acao === 'resortear') { sortearGerador(); return; }
    if (acao === 'mandar-agenda') {
      // Vai pra Agenda sem marcar no histórico do Gerador (isso só acontece no "Copiar tudo")
      salvarEdicaoGerador();
      if (typeof window.agendaReceberCopys === 'function') window.agendaReceberCopys(grModelo, grItens.map((c) => c.texto));
      return;
    }
    if (acao === 'copiar-tudo') {
      salvarEdicaoGerador();
      copiarTexto(textoGerador()).then(() => {
        gravarHistGerador(grModelo, grItens.map((c) => c.texto));
        registrarAtividade('Gerou copys pro disparo', `${grModelo} · ${grItens.length} copys`);
        toast(`${grItens.length} copys copiadas! Cole no campo de Mensagens.`);
        const b = document.querySelector('#grSaida .gr-copiar-tudo');
        if (b) { b.classList.add('ok'); b.innerHTML = GR_ICO.salvar + '<span>Copiado</span>'; setTimeout(() => abrirGerador(), 1400); }
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
    + contagem.map(([m, n]) => `<option value="${escAttr(m)}" ${m === exModelo ? 'selected' : ''}>${esc(nomeModelo(m))} · ${n} copys</option>`).join('');
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
  const quem = exModelo ? `<b>${esc(nomeModelo(exModelo))}</b>` : 'todas as modelos';
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

// ═══════════════════════════════════════════════ DISPARO (Sortear / Todas) ═══

let dpModo = (() => { try { return localStorage.getItem('disparo_modo') === 'todas' ? 'todas' : 'sortear'; } catch (e) { return 'sortear'; } })();
function dpAba(tab) { return tab === 'gerador' || tab === 'extrair'; }
function abrirDisparo() {
  document.querySelectorAll('#dpModo button').forEach((b) => { const on = b.dataset.modo === dpModo; b.classList.toggle('ativo', on); b.setAttribute('aria-pressed', on); });
  document.getElementById('dpSortear').hidden = dpModo !== 'sortear';
  document.getElementById('dpTodas').hidden = dpModo !== 'todas';
  if (dpModo === 'sortear') abrirGerador(); else abrirExtrair();
}
function configurarDisparo() {
  document.getElementById('dpModo').addEventListener('click', (e) => {
    const b = e.target.closest('[data-modo]'); if (!b) return;
    irParaTab(b.dataset.modo === 'todas' ? 'extrair' : 'gerador');
  });
}

// ═══════════════════════════════════════════════ INIT ═══

document.addEventListener('DOMContentLoaded', () => {
  configurarLogin();
  configurarCriarAtendente();
  configurarNav();
  configurarMineradas();
  configurarGerador();
  configurarExtrair();
  configurarDisparo();
  configurarFavoritos();
  configurarNovidades();

  carregarMineradasDoCache();

  abrirTabDaHash();
  window.addEventListener('hashchange', abrirTabDaHash);
});


// ═══════════════════════════════════════════════ VERSÃO NOVA DO SITE ═══
// De tempos em tempos confere se o site publicado mudou (os ?v= do index.html) e oferece atualizar,
// pra ninguém precisar de Ctrl + Shift + R.
(function vigiarVersaoNova() {
  const assinatura = (html) => (String(html).match(/(?:app|agenda|styles)\.(?:js|css)\?v=\d+/g) || []).sort().join('|');
  // o que esta página carregou (lido na hora: quando o app.js roda, o agenda.js ainda nem apareceu no HTML)
  const carregado = () => assinatura([...document.querySelectorAll('script[src], link[href]')].map(e => e.getAttribute('src') || e.getAttribute('href')).join(' '));
  let avisado = false;
  const conferir = async () => {
    if (avisado || document.hidden) return;
    const atual = carregado();
    if (!atual) return;
    try {
      const r = await fetch('index.html?_=' + Date.now(), { cache: 'no-store' });
      if (!r.ok) return;
      const nova = assinatura(await r.text());
      if (!nova || nova === atual) return;
      avisado = true;
      const barra = document.createElement('div');
      barra.className = 'versao-nova';
      barra.setAttribute('role', 'status');
      barra.innerHTML = '<span>Saiu uma versão nova do site.</span><button type="button">Atualizar agora</button>';
      barra.querySelector('button').addEventListener('click', () => location.reload());
      document.body.appendChild(barra);
    } catch (e) { /* sem internet: tenta de novo depois */ }
  };
  window.conferirVersaoNova = conferir;
  setInterval(conferir, 3 * 60 * 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) conferir(); });
})();
