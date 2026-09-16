/* Synora Copys — app.js
   Site estático (GitHub Pages). Sem dependência de extensão — config e dados ficam em localStorage. */

// ═══════════════════════════════════════════════ NOTIFICAÇÕES (navegador) ═══
// Só funcionam com essa aba aberta (pode estar minimizada/em 2º plano).
// Sem servidor: cada dispositivo agenda e dispara localmente, checando o horário de Brasília.

const ICON_URL = location.origin + location.pathname.replace(/[^/]*$/, '') + 'icon.png';

const LEMBRETES_HORARIO = {
  '11:00': { titulo: '11h - Bom Dia', msg: 'Hora de mandar a copy de Bom Dia pros fãs' },
  '14:00': { titulo: '14h - Vídeo Exclusivo', msg: 'Hora de disparar a copy de Vídeo Exclusivo' },
  '16:00': { titulo: '16h - Oferta', msg: 'Hora de mandar a Oferta do dia' },
  '19:00': { titulo: '19h - Aquecimento', msg: 'Hora do Aquecimento pra Pack' },
  '12:00': { titulo: 'Programe a grade de amanhã', msg: 'Já pensou na grade de amanhã? Começa a programar agora, vida' },
  '15:00': { titulo: 'Programe a grade de amanhã', msg: 'Lembrete: prepara os disparos de amanhã com calma' },
  '17:00': { titulo: 'Programe a grade de amanhã', msg: 'Faltam poucas horas do dia — deixa a grade de amanhã pronta' },
  '20:00': { titulo: 'Programe a grade de amanhã', msg: 'Hora de fechar a grade do dia seguinte' },
  '23:00': { titulo: 'Última call: grade de amanhã', msg: 'É hora de vender! Garante que amanhã já tá tudo programado' }
};

function horaAgoraBRT() {
  return new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
}
function diaAgoraBRT() {
  return new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function dispararNotificacao(titulo, msg) {
  if (Notification.permission !== 'granted') return;
  const n = new Notification(titulo, { body: msg, icon: ICON_URL, badge: ICON_URL, tag: titulo });
  n.onclick = () => { window.focus(); location.hash = '#grade'; n.close(); };
}

function checarLembretes() {
  const hora = horaAgoraBRT();
  const item = LEMBRETES_HORARIO[hora];
  if (!item) return;
  const chave = 'synora_lembrete_' + hora + '_' + diaAgoraBRT();
  if (localStorage.getItem(chave)) return;
  localStorage.setItem(chave, '1');
  dispararNotificacao(item.titulo, item.msg);
}

function atualizarStatusNotif() {
  const el = document.getElementById('notifStatus');
  if (!('Notification' in window)) { el.textContent = 'Seu navegador não suporta notificações.'; el.className = 'notif-status erro'; return; }
  if (Notification.permission === 'granted') { el.textContent = '✓ Notificações ativas nesse navegador.'; el.className = 'notif-status ok'; }
  else if (Notification.permission === 'denied') { el.textContent = 'Notificações bloqueadas — ative nas configurações do navegador.'; el.className = 'notif-status erro'; }
  else { el.textContent = 'Notificações ainda não ativadas.'; el.className = 'notif-status'; }
}

function configurarNotificacoes() {
  atualizarStatusNotif();

  document.getElementById('btnAtivarNotif').addEventListener('click', async () => {
    if (!('Notification' in window)) { toast('Seu navegador não suporta notificações.'); return; }
    const perm = await Notification.requestPermission();
    atualizarStatusNotif();
    if (perm === 'granted') toast('Notificações ativadas! Mantenha essa aba aberta.');
    else toast('Permissão não concedida.');
  });

  document.getElementById('btnTestarNotif').addEventListener('click', () => {
    if (Notification.permission !== 'granted') { toast('Ative as notificações primeiro.'); return; }
    dispararNotificacao('Teste - Synora Copys', 'Notificação de teste! Se você recebeu isso, está funcionando 🔔');
    toast('Notificação de teste disparada.');
  });

  checarLembretes();
  setInterval(checarLembretes, 20000);
}

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

  document.getElementById('btnLogin').addEventListener('click', fazerLogin);
  document.getElementById('loginSenha').addEventListener('keydown', (e) => { if (e.key === 'Enter') fazerLogin(); });
  document.getElementById('loginEmail').addEventListener('keydown', (e) => { if (e.key === 'Enter') fazerLogin(); });

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
    feedAdminAtivo = false;
    feedFuncionariosAtivo = false;
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
    if (souAdmin) { iniciarFeedAdmin(); iniciarFeedFuncionarios(); }
  });
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
function iniciarFeedFuncionarios() {
  if (feedFuncionariosAtivo) return;
  feedFuncionariosAtivo = true;
  unsubFuncionarios = db.collection('funcionarios').orderBy('nome')
    .onSnapshot((snap) => {
      const container = document.getElementById('listaFuncionarios');
      if (!container) return;
      if (snap.empty) { container.innerHTML = '<p class="empty-hint">Nenhum funcionário ainda.</p>'; return; }
      container.innerHTML = snap.docs.map((doc) => {
        const d = doc.data();
        const uid = doc.id;
        const acesso = d.ultimoAcesso ? d.ultimoAcesso.toDate().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '—';
        const cargo = d.cargo || 'Funcionário';
        const ativo = d.ativo !== false;
        const ehVoceMesmo = usuarioAtual && uid === usuarioAtual.uid;
        return `<div class="funcionario-item ${ativo ? '' : 'funcionario-inativo'}">
          <div class="funcionario-avatar" style="background:${corAvatar(d.nome || d.email || uid)}">${esc(iniciais(d.nome))}</div>
          <div class="funcionario-info">
            <div class="funcionario-nome">${esc(d.nome || '—')} <span class="funcionario-cargo-badge">${esc(cargo)}</span>${ativo ? '' : ' <span class="funcionario-cargo-badge funcionario-badge-inativo">Desativado</span>'}</div>
            <div class="funcionario-email">${esc(d.email || '')}</div>
          </div>
          <select class="funcionario-cargo-select" data-uid="${escAttr(uid)}">
            <option value="Funcionário" ${cargo === 'Funcionário' ? 'selected' : ''}>Funcionário</option>
            <option value="Sênior" ${cargo === 'Sênior' ? 'selected' : ''}>Sênior</option>
            <option value="Administrador" ${cargo === 'Administrador' ? 'selected' : ''}>Administrador</option>
          </select>
          ${ehVoceMesmo ? '' : `<button class="btn btn-sm ${ativo ? 'btn-secondary' : 'btn-primary'} funcionario-toggle-ativo" data-uid="${escAttr(uid)}" data-ativo="${ativo}">${ativo ? 'Desativar' : 'Ativar'}</button>`}
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
    }, (err) => console.error('[feed funcionarios]', err));
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
  sheetsUrl: 'https://script.google.com/macros/s/AKfycbwzUh0-1uu7L88v84v5-2JyH7MbRA6sfMBAGbbLs-HUTulUeYiiu1_bm1_XloI0rQ-g6g/exec',
  openrouterKey: '',
  openrouterModel: 'google/gemini-2.0-flash-001',
  persona: 'Letícia Vargas, 18 anos, universitária, vocabulário: "vida", "corre lá", "prévia", "amor", "bb"',
  personaTipo: 'universitaria',
  comprimento: 'medio',
  emoji: '2',
  personaAtivaId: 'default'
};

// ═══════════════════════════════════════════════ PERSONAS SALVAS (presets) ═══

function uid() { return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

const PERSONAS_SEED = [
  { id: 'default', nome: 'Letícia Vargas', texto: 'Letícia Vargas, 18 anos, universitária, vocabulário: "vida", "corre lá", "prévia", "amor", "bb"', tipo: 'universitaria', comprimento: 'medio', emoji: '2' },
  { id: 'coroa', nome: 'Coroa Confiante', texto: '35 anos, divorciada, segura de si, ensina o lead sem rodeios, vocabulário: "gatinho", "deixa comigo", "vem cá"', tipo: 'coroa', comprimento: 'medio', emoji: '1' },
  { id: 'timida', nome: 'Timidinha Descobrindo', texto: '19 anos, primeira vez fazendo esse tipo de conteúdo, insegura mas curiosa, vocabulário: "nossa", "sério?", "não acredito que tô fazendo isso"', tipo: 'timida', comprimento: 'medio', emoji: '2' },
  { id: 'executiva', nome: 'Executiva Estressada', texto: '27 anos, trabalha o dia todo, usa a conversa à noite pra relaxar, vocabulário: "que dia cansativo", "preciso descontar", "me ajuda a relaxar"', tipo: 'executiva', comprimento: 'medio', emoji: '1' },
  { id: 'professora', nome: 'Professora Tutora', texto: '26 anos, dá aula, tom de comando com verniz educacional, vocabulário: "presta atenção", "vou te ensinar", "boa resposta"', tipo: 'professora', comprimento: 'medio', emoji: '1' },
  { id: 'proibida', nome: 'Proibida', texto: '24 anos, tá online escondida do namorado, sensação de risco, vocabulário: "psiu", "não conta pra ninguém", "só um pouquinho"', tipo: 'proibida', comprimento: 'curto', emoji: '1' },
  { id: 'popstar', nome: 'Popstar Local', texto: '23 anos, vida badalada, sensação de exclusividade e status, vocabulário: "poucos têm acesso", "você é sortudo", "olha só quem eu escolhi"', tipo: 'popstar', comprimento: 'medio', emoji: '2' },
  { id: 'interiorana', nome: 'Interiorana Simples', texto: '21 anos, jeito caseiro do interior, contraste inocência x safadeza, vocabulário: "uai", "nossa senhora", "vixe"', tipo: 'interiorana', comprimento: 'medio', emoji: '2' },
  { id: 'sortuda', nome: 'Sortuda Eufórica', texto: '22 anos, acabou de ganhar algo bom, tá generosa e empolgada, vocabulário: "tô numa vibe boa", "quero comemorar com você", "deixa eu te mimar também"', tipo: 'sortuda', comprimento: 'medio', emoji: '2' }
];

function getPersonas() {
  let lista = safeParse('gerador_personas', null);
  if (!lista || !lista.length) {
    lista = PERSONAS_SEED.map((p) => ({ ...p }));
    localStorage.setItem('gerador_personas', JSON.stringify(lista));
  }
  return lista;
}
function salvarPersonasList(lista) { localStorage.setItem('gerador_personas', JSON.stringify(lista)); }

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

function getConfig() {
  try { return { ...CONFIG_PADRAO, ...JSON.parse(localStorage.getItem('gerador_config') || '{}') }; }
  catch (e) { return { ...CONFIG_PADRAO }; }
}
function salvarConfig(cfg) {
  localStorage.setItem('gerador_config', JSON.stringify({ ...getConfig(), ...cfg }));
}

const PAGE_INFO = {
  dashboard: { title: 'Dashboard', subtitle: 'Visão geral do seu banco de copys' },
  mineradas: { title: 'Mineradas', subtitle: 'Copys reais coletadas da planilha' },
  disparos: { title: 'Disparos', subtitle: 'Banco de copys prontas + grade manual do dia' },
  grade: { title: 'Grade do Dia', subtitle: 'Sorteie ou gere com IA os 4 horários do dia' },
  admin: { title: 'Admin', subtitle: 'Criar acessos e ver a atividade da equipe' }
};

// ═══════════════════════════════════════════════ ESTADO ═══

const COR_TIPO = {
  Venda: '#ef4444', Saudacao: '#22c55e', Engajamento: '#3b82f6', Reengajamento: '#f97316',
  Conteudo: '#a855f7', Upsell: '#ec4899', Aquecimento: '#f472b6', Chamada: '#06b6d4',
  Pergunta: '#84cc16', Outro: '#64748b'
};

const SLOTS = [
  { tag: '11H', key: '11h', hora: '11h', tipo: 'Bom Dia', cor: '#fbbf24' },
  { tag: '14H', key: '14h', hora: '14h', tipo: 'Vídeo Exclusivo', cor: '#a855f7' },
  { tag: '16H', key: '16h', hora: '16h', tipo: 'Oferta', cor: '#34d399' },
  { tag: '19H', key: '19h', hora: '19h', tipo: 'Aquecimento', cor: '#ec4899' }
];
const SLOT_CATEGORIAS = {
  '11H': ['Bom Dia', 'Primeiro Contato'],
  '14H': ['Venda de Conteúdo', 'Gatilhos Sensuais', 'Gatilhos Temáticos', 'Gatilhos de Banho'],
  '16H': ['Desconto e Bônus', 'Escassez e Urgência', 'Remarketing', 'Chamada com Preço'],
  '19H': ['Aquecimento pra Pack', 'Boa Noite', 'Chamada de Vídeo', 'Reengajamento']
};
const TIPO_MAP_SLOT = { '11H': 'Saudacao', '14H': 'Conteudo', '16H': 'Venda', '19H': 'Aquecimento' };

const POR_PAGINA = 24;
let todasMineradas = [];
let mineradasFiltradas = [];
let paginaMineradas = 1;

let bancoDisparos = null;
let disparosFiltrados = [];
let mostrandoFavoritos = false;

let favoritos = safeParse('gerador_favoritos', []);
let copysCustom = safeParse('gerador_copys_custom', []);
let copyCounts = safeParse('gerador_copy_counts', {});
let gradeManual = safeParse('gerador_grade_manual', { '11h': '', '14h': '', '16h': '', '19h': '' });
let gradeGerada = null;

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

function irParaTab(tab, opts) {
  if (!PAGE_INFO[tab]) return;
  if (tab === 'admin' && !souAdmin) tab = 'dashboard';
  document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.id === `tab-${tab}`));
  document.getElementById('pageTitle').textContent = PAGE_INFO[tab].title;
  document.getElementById('pageSubtitle').textContent = PAGE_INFO[tab].subtitle;
  fecharSidebarMobile();
  if (!opts || !opts.semHash) {
    history.replaceState(null, '', '#' + tab);
  }
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'disparos' && !bancoDisparos) carregarBancoDisparos();
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
  document.getElementById('filtroModeloMineradas').addEventListener('change', carregarMineradas);
  document.getElementById('filtroTipoMineradas').addEventListener('change', carregarMineradas);
}

async function carregarMineradas() {
  const cfg = getConfig();
  if (!cfg.sheetsUrl) {
    setStatus('Configure a URL do Apps Script primeiro', 'erro');
    document.getElementById('modalBackdrop').classList.add('open');
    return;
  }
  const btn = document.getElementById('btnRecarregarMineradas');
  btn.disabled = true;
  const textoOriginal = btn.textContent;
  btn.textContent = 'Carregando…';
  setStatus('Buscando copys da planilha…', 'aviso');

  try {
    const url = new URL(cfg.sheetsUrl);
    const modelo = document.getElementById('filtroModeloMineradas').value;
    const tipo = document.getElementById('filtroTipoMineradas').value;
    if (modelo) url.searchParams.set('modelo', modelo);
    if (tipo) url.searchParams.set('tipo', tipo);

    const resp = await fetch(url.toString(), { redirect: 'follow' });
    if (!resp.ok) throw new Error('Servidor retornou erro ' + resp.status);
    const data = await resp.json();
    if (data.status === 'erro') throw new Error(data.msg || data.mensagem);

    todasMineradas = data.copys || [];
    paginaMineradas = 1;

    const selectModelo = document.getElementById('filtroModeloMineradas');
    const valorAtual = selectModelo.value;
    const modelos = data.modelos || [...new Set(todasMineradas.map((c) => c.modelo))].sort();
    selectModelo.innerHTML = '<option value="">Todas as modelos</option>';
    modelos.forEach((m) => {
      const opt = document.createElement('option');
      opt.value = m; opt.textContent = m;
      if (m === valorAtual) opt.selected = true;
      selectModelo.appendChild(opt);
    });

    document.getElementById('pillCopys').textContent = `${todasMineradas.length} copys · ${modelos.length} modelos`;
    setStatus(`${todasMineradas.length} copys carregadas da planilha`, 'ok');
    aplicarFiltroMineradas();
    renderDashboard();
  } catch (err) {
    setStatus('Erro: ' + err.message, 'erro');
    document.getElementById('listaMineradas').innerHTML = `<div class="empty-state"><p>Erro ao carregar: ${esc(err.message)}</p></div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = textoOriginal;
  }
}

function aplicarFiltroMineradas() {
  const termo = (document.getElementById('buscaMineradas').value || '').toLowerCase().trim();
  mineradasFiltradas = !termo ? todasMineradas : todasMineradas.filter((c) =>
    (c.mensagem && c.mensagem.toLowerCase().includes(termo)) ||
    (c.modelo && c.modelo.toLowerCase().includes(termo)) ||
    (c.tipo && c.tipo.toLowerCase().includes(termo))
  );
  renderMineradas();
}

function renderMineradas() {
  const container = document.getElementById('listaMineradas');
  if (!mineradasFiltradas.length) {
    container.innerHTML = todasMineradas.length
      ? '<div class="empty-state"><p>Nenhuma copy encontrada com esses filtros.</p></div>'
      : '<div class="empty-state"><span class="empty-ico">▤</span><p>Clique em <strong>“Carregar Copys”</strong> pra trazer os exemplos da planilha.</p></div>';
    return;
  }

  const inicio = (paginaMineradas - 1) * POR_PAGINA;
  const pagina = mineradasFiltradas.slice(inicio, inicio + POR_PAGINA);
  const totalPaginas = Math.ceil(mineradasFiltradas.length / POR_PAGINA);

  container.innerHTML = pagina.map((c) => cardCopyHtml({
    texto: c.mensagem, tag: c.tipo, modelo: c.modelo, data: formatarData(c.data), preco: c.preco, comIA: true, origem: 'minerada'
  })).join('');

  ligarEventosCard(container);

  if (totalPaginas > 1) {
    const pagDiv = document.createElement('div');
    pagDiv.className = 'pagination';
    pagDiv.innerHTML = `<button id="pagAnt" ${paginaMineradas <= 1 ? 'disabled' : ''}>← Anterior</button><span>${paginaMineradas} / ${totalPaginas}</span><button id="pagProx" ${paginaMineradas >= totalPaginas ? 'disabled' : ''}>Próxima →</button>`;
    container.appendChild(pagDiv);
    const ant = document.getElementById('pagAnt'); const prox = document.getElementById('pagProx');
    if (ant) ant.addEventListener('click', () => { paginaMineradas--; renderMineradas(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    if (prox) prox.addEventListener('click', () => { paginaMineradas++; renderMineradas(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
}

// ═══════════════════════════════════════════════ CARD DE COPY (REUTILIZÁVEL) ═══

function cardCopyHtml({ texto, tag, modelo, categoria, icone, data, preco, comIA, origem, favorito, custom }) {
  const cor = COR_TIPO[tag] || 'var(--accent)';
  return `<div class="copy-card" data-origem="${origem}">
    <div class="copy-card-header">
      ${modelo ? `<span class="copy-card-modelo">${esc(modelo)}</span>` : `<span class="copy-card-cat">${icone || ''} ${esc(categoria || '')}</span>`}
      ${tag ? `<span class="copy-card-tag" style="background:${cor}22;color:${cor};border-color:${cor}44">${esc(tag)}</span>` : ''}
    </div>
    <div class="copy-card-texto">${esc(texto)}</div>
    <div class="copy-card-footer">
      <span class="copy-card-meta">${preco ? `<b>${esc(preco)}</b> · ` : ''}${data ? esc(data) : ''}</span>
      <div class="copy-card-actions">
        ${custom ? `<button class="icon-btn btn-del-custom" title="Apagar" data-texto="${escAttr(texto)}">🗑</button>` : ''}
        ${origem === 'disparo' ? `<button class="icon-btn btn-favoritar ${favorito ? 'favorito-ativo' : ''}" title="Favoritar" data-texto="${escAttr(texto)}">⭐</button>` : ''}
        ${origem !== 'gerada' ? `<div class="grade-add-wrap" title="Adicionar na grade">
          <span class="icon-btn">➕</span>
          <select class="select-add-grade" data-texto="${escAttr(texto)}">
            <option value="">Horário…</option>
            <option value="11h">11h Bom Dia</option>
            <option value="14h">14h Vídeo</option>
            <option value="16h">16h Oferta</option>
            <option value="19h">19h Aquecimento</option>
          </select>
        </div>` : ''}
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
  container.querySelectorAll('.btn-favoritar').forEach((btn) => btn.addEventListener('click', () => {
    toggleFavorito(btn.dataset.texto);
    renderDisparos();
  }));
  container.querySelectorAll('.btn-del-custom').forEach((btn) => btn.addEventListener('click', () => {
    copysCustom = copysCustom.filter((c) => c.texto !== btn.dataset.texto);
    localStorage.setItem('gerador_copys_custom', JSON.stringify(copysCustom));
    renderDisparos();
  }));
  container.querySelectorAll('.select-add-grade').forEach((sel) => sel.addEventListener('change', () => {
    if (sel.value) { setGradeManualSlot(sel.value, sel.dataset.texto); sel.value = ''; toast(`Adicionado no horário ${sel.value || ''}`.trim()); }
  }));
  container.querySelectorAll('.btn-reescrever').forEach((btn) => btn.addEventListener('click', () => reescreverCopy(btn.dataset.texto, 'safada', btn)));
  container.querySelectorAll('.select-estilo-ia').forEach((sel) => sel.addEventListener('change', () => {
    if (sel.value) { const btn = sel.closest('.ia-wrap').querySelector('.btn-reescrever'); reescreverCopy(sel.dataset.texto, sel.value, btn); sel.value = ''; }
  }));
}

function toggleFavorito(texto) {
  const idx = favoritos.indexOf(texto);
  const favoritou = idx < 0;
  if (idx >= 0) favoritos.splice(idx, 1); else favoritos.push(texto);
  localStorage.setItem('gerador_favoritos', JSON.stringify(favoritos));
  registrarAtividade(favoritou ? 'Favoritou uma copy' : 'Desfavoritou uma copy', texto.slice(0, 80));
}

// ═══════════════════════════════════════════════ DISPAROS ═══

async function carregarBancoDisparos() {
  try {
    const resp = await fetch('banco-disparos.json');
    bancoDisparos = await resp.json();
    const select = document.getElementById('filtroCategoriaDisparos');
    select.innerHTML = '<option value="">Todas as categorias</option>';
    bancoDisparos.categorias.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat.nome;
      opt.textContent = `${cat.icone} ${cat.nome} (${cat.copys.length})`;
      select.appendChild(opt);
    });
    renderGradeManual();
    renderDisparos();
    renderDashboard();
  } catch (err) {
    document.getElementById('listaDisparos').innerHTML = `<div class="empty-state"><p>Erro ao carregar banco: ${esc(err.message)}</p></div>`;
  }
}

function configurarDisparos() {
  document.getElementById('buscaDisparos').addEventListener('input', renderDisparos);
  document.getElementById('filtroCategoriaDisparos').addEventListener('change', renderDisparos);
  document.getElementById('btnMostrarFavoritas').addEventListener('click', (e) => {
    mostrandoFavoritos = !mostrandoFavoritos;
    e.currentTarget.classList.toggle('btn-primary', mostrandoFavoritos);
    renderDisparos();
  });
  document.getElementById('btnSortearAleatorio').addEventListener('click', sortearCopyAleatoria);

  document.getElementById('btnAddCopy').addEventListener('click', () => {
    const form = document.getElementById('formAddCopy');
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) {
      populaCategoriaSelect();
      document.getElementById('novaCopyTexto').focus();
    }
  });
  document.getElementById('btnFecharAdd').addEventListener('click', () => document.getElementById('formAddCopy').classList.add('hidden'));
  document.getElementById('btnAdicionarCopy').addEventListener('click', () => {
    const texto = document.getElementById('novaCopyTexto').value.trim();
    const categoria = document.getElementById('novaCopyCategoria').value;
    if (!texto) { toast('Escreva o texto da copy.'); return; }
    if (!categoria) { toast('Escolha uma categoria.'); return; }
    copysCustom.push({ texto, categoria });
    localStorage.setItem('gerador_copys_custom', JSON.stringify(copysCustom));
    document.getElementById('novaCopyTexto').value = '';
    document.getElementById('formAddCopy').classList.add('hidden');
    toast('Copy adicionada ao banco.');
    registrarAtividade('Adicionou copy customizada', `${categoria}: ${texto.slice(0, 60)}`);
    renderDisparos();
    renderDashboard();
  });

  document.getElementById('btnLimparGradeManual').addEventListener('click', () => {
    gradeManual = { '11h': '', '14h': '', '16h': '', '19h': '' };
    localStorage.setItem('gerador_grade_manual', JSON.stringify(gradeManual));
    renderGradeManual();
  });
  document.getElementById('btnCopiarGradeManual').addEventListener('click', () => {
    const nomes = { '11h': 'Bom Dia', '14h': 'Vídeo Exclusivo', '16h': 'Oferta', '19h': 'Aquecimento' };
    const texto = Object.keys(gradeManual).filter((k) => gradeManual[k])
      .map((k) => `${k} — ${nomes[k]}:\n${gradeManual[k]}`).join('\n\n---\n\n');
    if (!texto) return;
    copiarTexto(texto).then(() => toast('Grade completa copiada!'));
  });
}

function populaCategoriaSelect() {
  const select = document.getElementById('novaCopyCategoria');
  if (select.options.length > 1 || !bancoDisparos) return;
  bancoDisparos.categorias.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat.nome; opt.textContent = `${cat.icone} ${cat.nome}`;
    select.appendChild(opt);
  });
  const optNova = document.createElement('option');
  optNova.value = '__nova__'; optNova.textContent = '+ Criar nova categoria';
  select.appendChild(optNova);
  select.addEventListener('change', () => {
    if (select.value === '__nova__') {
      const nome = prompt('Nome da nova categoria:');
      if (nome && nome.trim()) {
        const opt = document.createElement('option');
        opt.value = nome.trim(); opt.textContent = nome.trim();
        select.insertBefore(opt, select.lastChild);
        select.value = nome.trim();
      } else select.value = '';
    }
  });
}

function todasCopysDoBanco() {
  const lista = [];
  if (bancoDisparos) {
    bancoDisparos.categorias.forEach((cat) => cat.copys.forEach((texto) => lista.push({ texto, categoria: cat.nome, icone: cat.icone })));
  }
  copysCustom.forEach((c) => {
    const catOriginal = bancoDisparos?.categorias.find((cat) => cat.nome === c.categoria);
    lista.push({ texto: c.texto, categoria: c.categoria, icone: catOriginal?.icone || '✏️', custom: true });
  });
  return lista;
}

function renderDisparos() {
  const container = document.getElementById('listaDisparos');
  if (!bancoDisparos) return;

  const categoriaFiltro = document.getElementById('filtroCategoriaDisparos').value;
  const termo = (document.getElementById('buscaDisparos').value || '').toLowerCase().trim();

  let lista = todasCopysDoBanco();
  if (categoriaFiltro) lista = lista.filter((d) => d.categoria === categoriaFiltro);
  if (termo) lista = lista.filter((d) => d.texto.toLowerCase().includes(termo));
  if (mostrandoFavoritos) lista = lista.filter((d) => favoritos.includes(d.texto));

  disparosFiltrados = lista;

  if (!lista.length) {
    container.innerHTML = `<div class="empty-state"><p>${mostrandoFavoritos ? 'Nenhuma copy favoritada ainda.' : 'Nenhuma copy encontrada.'}</p></div>`;
    return;
  }

  const agrupado = {};
  lista.forEach((d) => {
    if (!agrupado[d.categoria]) agrupado[d.categoria] = { icone: d.icone, itens: [] };
    agrupado[d.categoria].itens.push(d);
  });

  let html = '';
  Object.keys(agrupado).forEach((catNome) => {
    const grupo = agrupado[catNome];
    html += `<div class="categoria-header"><span>${grupo.icone}</span> ${esc(catNome)} <span class="categoria-count">${grupo.itens.length}</span></div>`;
    html += `<div class="grid-copys">${grupo.itens.map((d) => cardCopyHtml({
      texto: d.texto, categoria: d.categoria, icone: d.icone, comIA: true, origem: 'disparo',
      favorito: favoritos.includes(d.texto), custom: d.custom
    })).join('')}</div>`;
  });

  container.innerHTML = html;
  ligarEventosCard(container);
}

function sortearCopyAleatoria() {
  if (!disparosFiltrados.length) { toast('Nenhuma copy disponível com esse filtro.'); return; }
  const sorteada = disparosFiltrados[Math.floor(Math.random() * disparosFiltrados.length)];
  const container = document.getElementById('copyAleatoria');
  container.innerHTML = `<div class="panel" style="margin-bottom:14px;"><div class="panel-head"><h2>🎲 Copy sorteada</h2></div>${cardCopyHtml({
    texto: sorteada.texto, categoria: sorteada.categoria, icone: sorteada.icone, comIA: true, origem: 'disparo', favorito: favoritos.includes(sorteada.texto)
  })}</div>`;
  ligarEventosCard(container);
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ═══════════════════════════════════════════════ GRADE MANUAL (aba Disparos) ═══

function setGradeManualSlot(slot, texto) {
  gradeManual[slot] = texto;
  localStorage.setItem('gerador_grade_manual', JSON.stringify(gradeManual));
  renderGradeManual();
}

function renderGradeManual() {
  const container = document.getElementById('gradeManualSlots');
  const nomes = { '11h': 'Bom Dia', '14h': 'Vídeo Exclusivo', '16h': 'Oferta', '19h': 'Aquecimento' };
  const cores = { '11h': '#fbbf24', '14h': '#a855f7', '16h': '#34d399', '19h': '#ec4899' };
  let preenchidos = 0;
  container.innerHTML = Object.keys(nomes).map((slot) => {
    const texto = gradeManual[slot];
    if (texto) preenchidos++;
    return `<div class="grade-slot ${texto ? 'preenchido' : ''}">
      <div class="grade-slot-header"><span class="grade-slot-hora" style="color:${cores[slot]}">${slot}</span><span class="grade-slot-nome">${nomes[slot]}</span></div>
      <div class="grade-slot-texto ${texto ? '' : 'grade-slot-empty'}">${texto ? esc(texto) : 'Clique em ➕ numa copy abaixo'}</div>
    </div>`;
  }).join('');
  document.getElementById('btnCopiarGradeManual').disabled = preenchidos === 0;
}

// ═══════════════════════════════════════════════ GRADE DO DIA (sortear / IA) ═══

function popularSelectPersonas(selecionarId) {
  const select = document.getElementById('personaSelect');
  const lista = getPersonas();
  select.innerHTML = lista.map((p) => `<option value="${escAttr(p.id)}">${esc(p.nome)}</option>`).join('');
  if (selecionarId && lista.some((p) => p.id === selecionarId)) select.value = selecionarId;
  return lista;
}

function carregarPersonaNosCampos(persona) {
  document.getElementById('personaTexto').value = persona.texto || '';
  document.getElementById('personaTipo').value = persona.tipo || 'universitaria';
  document.querySelectorAll('#comprimentoRow .estilo-btn').forEach((btn) => {
    btn.classList.toggle('ativo', btn.dataset.comprimento === (persona.comprimento || 'medio'));
  });
  document.querySelectorAll('#emojiRow .estilo-btn').forEach((btn) => {
    btn.classList.toggle('ativo', btn.dataset.emoji === (persona.emoji || '2'));
  });
}

function configurarPersona() {
  const cfg = getConfig();
  let lista = popularSelectPersonas(cfg.personaAtivaId);
  let ativa = lista.find((p) => p.id === cfg.personaAtivaId) || lista[0];
  document.getElementById('personaSelect').value = ativa.id;
  carregarPersonaNosCampos(ativa);
  salvarConfig({ persona: ativa.texto, personaTipo: ativa.tipo, comprimento: ativa.comprimento, emoji: ativa.emoji || '2', personaAtivaId: ativa.id });

  const inputPersona = document.getElementById('personaTexto');
  const selectTipo = document.getElementById('personaTipo');
  const selectPersona = document.getElementById('personaSelect');

  let debounce;
  inputPersona.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => salvarConfig({ persona: inputPersona.value.trim() }), 400);
  });
  selectTipo.addEventListener('change', () => salvarConfig({ personaTipo: selectTipo.value }));
  document.querySelectorAll('#comprimentoRow .estilo-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#comprimentoRow .estilo-btn').forEach((b) => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      salvarConfig({ comprimento: btn.dataset.comprimento });
    });
  });
  document.querySelectorAll('#emojiRow .estilo-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#emojiRow .estilo-btn').forEach((b) => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      salvarConfig({ emoji: btn.dataset.emoji });
    });
  });

  selectPersona.addEventListener('change', () => {
    const lista2 = getPersonas();
    const p = lista2.find((x) => x.id === selectPersona.value);
    if (!p) return;
    carregarPersonaNosCampos(p);
    salvarConfig({ persona: p.texto, personaTipo: p.tipo, comprimento: p.comprimento, emoji: p.emoji || '2', personaAtivaId: p.id });
    toast(`Persona "${p.nome}" carregada.`);
  });

  document.getElementById('btnNovaPersona').addEventListener('click', () => {
    const nome = prompt('Nome da nova persona:');
    if (!nome || !nome.trim()) return;
    const nova = { id: uid(), nome: nome.trim(), texto: '', tipo: 'universitaria', comprimento: 'medio', emoji: '2' };
    const lista3 = getPersonas();
    lista3.push(nova);
    salvarPersonasList(lista3);
    popularSelectPersonas(nova.id);
    carregarPersonaNosCampos(nova);
    salvarConfig({ persona: nova.texto, personaTipo: nova.tipo, comprimento: nova.comprimento, emoji: nova.emoji, personaAtivaId: nova.id });
    toast(`Persona "${nova.nome}" criada. Preencha e clique em 💾 pra salvar.`);
    inputPersona.focus();
  });

  document.getElementById('btnSalvarPersona').addEventListener('click', () => {
    const lista4 = getPersonas();
    const idAtiva = getConfig().personaAtivaId;
    const p = lista4.find((x) => x.id === idAtiva);
    if (!p) return;
    p.texto = inputPersona.value.trim();
    p.tipo = selectTipo.value;
    p.comprimento = getConfig().comprimento;
    p.emoji = getConfig().emoji;
    salvarPersonasList(lista4);
    toast(`Persona "${p.nome}" atualizada.`);
  });

  document.getElementById('btnApagarPersona').addEventListener('click', () => {
    let lista5 = getPersonas();
    if (lista5.length <= 1) { toast('Precisa deixar pelo menos uma persona.'); return; }
    const idAtiva = getConfig().personaAtivaId;
    const p = lista5.find((x) => x.id === idAtiva);
    if (!p) return;
    if (!confirm(`Apagar a persona "${p.nome}"?`)) return;
    lista5 = lista5.filter((x) => x.id !== idAtiva);
    salvarPersonasList(lista5);
    const proxima = lista5[0];
    popularSelectPersonas(proxima.id);
    carregarPersonaNosCampos(proxima);
    salvarConfig({ persona: proxima.texto, personaTipo: proxima.tipo, comprimento: proxima.comprimento, emoji: proxima.emoji || '2', personaAtivaId: proxima.id });
    toast('Persona apagada.');
  });
}

function configurarGrade() {
  document.getElementById('btnSortearGrade').addEventListener('click', sortearGradeDia);
  document.getElementById('btnGerarGradeIA').addEventListener('click', gerarGradeIA);
  document.getElementById('btnCopiarGradeGerada').addEventListener('click', () => {
    if (!gradeGerada) return;
    const texto = SLOTS.map((s) => `${s.hora} — ${s.tipo}:\n${gradeGerada[s.tag] || ''}`).join('\n\n---\n\n');
    copiarTexto(texto).then(() => toast('Grade completa copiada!'));
  });

  document.querySelectorAll('#estilosReescrita .estilo-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('#estilosReescrita .estilo-btn').forEach((b) => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      const textoOriginal = document.getElementById('textoReescrever').value.trim();
      if (!textoOriginal) { toast('Cole ou escreva uma copy primeiro.'); return; }
      const resultadoDiv = document.getElementById('resultadoReescrita');
      resultadoDiv.classList.remove('hidden');
      resultadoDiv.textContent = 'Gerando…';
      try {
        const resultado = await chamarOpenRouter([
          { role: 'system', content: montarPromptBase() },
          { role: 'user', content: (ESTILOS_REESCRITA[btn.dataset.estilo] || '') + '\n\nCopy original:\n' + textoOriginal }
        ], { maxTokens: tokensParaComprimento(1) });
        resultadoDiv.textContent = resultado.trim();
      } catch (err) {
        resultadoDiv.textContent = 'Erro: ' + err.message;
      }
    });
  });
}

function sortearGradeDia() {
  if (!bancoDisparos) { toast('Aguarde o banco de disparos carregar.'); return; }
  const grade = {};
  SLOTS.forEach((slot) => {
    let pool = [];
    (SLOT_CATEGORIAS[slot.tag] || []).forEach((catNome) => {
      const cat = bancoDisparos.categorias.find((c) => c.nome === catNome);
      if (cat) pool.push(...cat.copys);
    });
    copysCustom.forEach((c) => { if ((SLOT_CATEGORIAS[slot.tag] || []).includes(c.categoria)) pool.push(c.texto); });
    if (mineradasFiltradas.length) {
      const tipoAlvo = TIPO_MAP_SLOT[slot.tag];
      pool.push(...mineradasFiltradas.filter((c) => c.tipo === tipoAlvo).map((c) => c.mensagem));
    }
    grade[slot.tag] = pool.length ? pool[Math.floor(Math.random() * pool.length)] : '';
  });
  gradeGerada = grade;
  renderGradeGerada(grade);
  setStatus('Grade do dia montada! Clique de novo pra sortear outras.', 'ok');
  registrarAtividade('Sorteou a grade do dia', '');
}

function renderGradeGerada(grade) {
  const container = document.getElementById('gradeContainer');
  container.innerHTML = SLOTS.map((slot) => {
    const texto = grade[slot.tag];
    return `<div class="grade-slot ${texto ? 'preenchido' : ''}">
      <div class="grade-slot-header"><span class="grade-slot-hora" style="color:${slot.cor}">${slot.hora}</span><span class="grade-slot-nome">${slot.tipo}</span></div>
      <div class="grade-slot-texto ${texto ? '' : 'grade-slot-empty'}">${texto ? esc(texto) : '(sem copy disponível)'}</div>
      ${texto ? `<button class="btn-shimmer btn-copiar-slot" data-texto="${escAttr(texto)}" style="margin-top:10px; width:100%;"><span class="btn-shimmer-icon"></span><span class="btn-shimmer-text">📋 Copiar</span></button>` : ''}
    </div>`;
  }).join('');
  container.querySelectorAll('.btn-copiar-slot').forEach((btn) => btn.addEventListener('click', () => copiarTexto(btn.dataset.texto).then(() => toast('Copy copiada!'))));
  document.getElementById('btnCopiarGradeGerada').classList.toggle('hidden', !Object.values(grade).some(Boolean));
}

async function gerarGradeIA() {
  const cfg = getConfig();
  if (!cfg.openrouterKey) {
    toast('Configure sua API Key do OpenRouter nas Configurações.');
    document.getElementById('modalBackdrop').classList.add('open');
    return;
  }
  const btn = document.getElementById('btnGerarGradeIA');
  const btnTextEl = btn.querySelector('.btn-premium-text') || btn;
  btn.disabled = true;
  const original = btnTextEl.textContent;
  btnTextEl.textContent = '✨ Gerando…';

  let exemplos = '';
  if (bancoDisparos) bancoDisparos.categorias.forEach((cat) => { exemplos += cat.nome + ':\n' + cat.copys.slice(0, 3).join('\n') + '\n\n'; });

  try {
    const resultado = await chamarOpenRouter([
      { role: 'system', content: montarPromptBase() },
      {
        role: 'user',
        content: 'Crie 4 copys originais, uma pra cada horário, cada uma com um tipo de abertura diferente.\n\n'
          + 'Responda EXATAMENTE nesse formato, só a copy pura depois de cada tag, sem rótulos:\n\n'
          + '[11H] (copy de bom dia, carinhosa, cria curiosidade)\n[14H] (copy vendendo conteúdo, provocante, exclusivo)\n[16H] (copy pedindo mimo, desafia o lead)\n[19H] (copy de aquecimento noturno)\n\n'
          + 'Exemplos reais de referência (não copie, crie novas):\n' + exemplos.slice(0, 1500)
      }
    ], { temperature: 0.9, maxTokens: tokensParaComprimento(4) });
    const grade = parsearGrade(resultado);
    gradeGerada = grade;
    renderGradeGerada(grade);
    setStatus('Grade gerada pela IA! Clique de novo pra gerar outra.', 'ok');
    registrarAtividade('Gerou a grade do dia com IA', '');
  } catch (err) {
    toast('Erro IA: ' + err.message);
  } finally {
    btn.disabled = false;
    btnTextEl.textContent = original;
  }
}

function parsearGrade(texto) {
  const grade = {};
  SLOTS.forEach((slot) => {
    const regex = new RegExp('\\[' + slot.tag + '\\]\\s*([\\s\\S]*?)(?=\\[\\d{2}H\\]|$)', 'i');
    const match = texto.match(regex);
    grade[slot.tag] = match ? match[1].trim() : '';
  });
  if (!Object.values(grade).some((v) => v.length)) {
    const partes = texto.split(/---|\n\n+/).map((p) => p.trim()).filter((p) => p.length > 10);
    SLOTS.forEach((slot, i) => { if (partes[i]) grade[slot.tag] = partes[i]; });
  }
  return grade;
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
  const card = btnEl.closest('.copy-card');
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

function montarPromptBase() {
  const cfg = getConfig();
  const persona = (cfg.persona || '').trim();
  const arquetipo = TIPO_PERSONA_DESC[cfg.personaTipo] || '';
  const comprimento = COMPRIMENTO_DESC[cfg.comprimento] || COMPRIMENTO_DESC.medio;
  const emoji = EMOJI_DESC[cfg.emoji] || EMOJI_DESC['2'];

  let bloco = 'Você é uma chatter profissional que escreve copys de disparo e mensagens pra atrair, engajar e converter leads em compradores de conteúdo exclusivo.\n\n';

  if (persona || arquetipo) {
    bloco += 'PERSONA:\n';
    if (persona) bloco += '- ' + persona + '\n';
    if (arquetipo) bloco += '- Arquétipo: ' + arquetipo + '\n';
    bloco += '\n';
  }

  bloco += 'REGRAS OBRIGATÓRIAS:\n'
    + '- ' + comprimento + '\n'
    + '- Escreva como pessoa real mandando mensagem, nunca como robô/marketing.\n'
    + '- Linguagem informal brasileira. ' + emoji + '\n'
    + '- Nunca marcar encontro presencial, nunca pedir pagamento direto (use sempre lógica de "mimo"), nunca dar dados pessoais reais.\n'
    + '- Proibido usar: "imperdível", "última chance", "não perca", "primo", superlativos exagerados.\n'
    + '- Proibido incluir rótulos, títulos, aspas ou comentários antes/depois da copy — responda só com a mensagem pura.\n'
    + '- Toda copy deve terminar gerando curiosidade.';

  return bloco;
}

async function chamarOpenRouter(mensagens, opts) {
  const cfg = getConfig();
  if (!cfg.openrouterKey) throw new Error('Configure sua API Key do OpenRouter nas Configurações.');
  const modelo = cfg.openrouterModel || CONFIG_PADRAO.openrouterModel;

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
  texto = texto.replace(/^(ABERTURA\s+(ROMÂNTICA|SAFADA|DE CONTROLE)|QUEBRA DE EGO|Bom dia|Conteúdo exclusivo)\s*[—:\-]+\s*/gim, '');
  return texto;
}

// ═══════════════════════════════════════════════ DASHBOARD ═══

function renderDashboard() {
  const totalMineradas = todasMineradas.length;
  const totalDisparos = todasCopysDoBanco().length;
  const totalFavoritas = favoritos.length;
  const modelos = new Set(todasMineradas.map((c) => c.modelo)).size;

  document.getElementById('kpiMineradas').textContent = totalMineradas;
  document.getElementById('kpiDisparos').textContent = totalDisparos;
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
}

// ═══════════════════════════════════════════════ INIT ═══

document.addEventListener('DOMContentLoaded', () => {
  configurarLogin();
  configurarCriarAtendente();
  configurarNav();
  configurarConfigModal();
  configurarMineradas();
  configurarDisparos();
  configurarGrade();
  configurarPersona();
  configurarNotificacoes();

  renderGradeManual();
  renderDashboard();
  carregarBancoDisparos();

  const cfg = getConfig();
  if (cfg.sheetsUrl) carregarMineradas();
  else setStatus('Configure a URL do Apps Script nas Configurações', 'aviso');

  abrirTabDaHash();
  window.addEventListener('hashchange', abrirTabDaHash);
});
