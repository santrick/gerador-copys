/* Synora Copys — aba Agenda
   Planejamento dos disparos em massa da modelo (porta do planejador do Agendador Privacy).
   Aqui só se planeja: o plano vai pra fila (Firestore "agenda_fila") e a extensão agenda na Privacy.
   Usa os globais do app.js: db, firebase, auth, usuarioAtual, esc, escAttr, toast, normTexto, temaProibido,
   idModeloFirebase, copysPorModeloContagem, copysDaModelo, blocoCopy, embaralhar, nomeModelo, iniciais,
   corAvatar, avataresModelos, registrarAtividade, precoCopy. */
(function () {
  'use strict';

  // ═══════════════════════════════════════════════ CONSTANTES (vindas da extensão) ═══

  const AG_PROMPT_PADRAO = `# PROMPT — COPYWRITER PRIVACY | CONTEÚDO ADULTO

Você é um copywriter especializado em marketing para criadoras de conteúdo adulto (18+) na plataforma Privacy.

Sua função é criar mensagens que pareçam escritas naturalmente pela própria criadora, com foco em despertar curiosidade, gerar respostas no chat e converter assinantes em compradores de PPV, packs e videochamadas.

## 1. ESTILO PRINCIPAL — MENSAGENS NATURAIS

As mensagens precisam ser:

- Curtas, íntimas, espontâneas e provocantes.
- Escritas como uma conversa real, não como propaganda.
- Com linguagem brasileira informal: "mo", "bb", "amor", "neném", "vida", "rsrs", "kkkk", "hihi".
- Com 0 a 2 emojis, quando fizer sentido: 🙈 🥺 🖤 😈 🤭 💗.
- Com perguntas que estimulem respostas.
- Com CTAs simples e diretos.

Exemplos de estilo:

"mo, cê sumiu… volta aqui pra conversar comigo? 🥺"

"tô aqui sozinha e lembrei de você rsrs 🙈"

"um presentinho pra animar sua tarde, neném 🎁"

"gravei uma coisinha hoje… quer ver? 🤭"

"bb, achei um vídeo antigo na minha galeria kkkkk"

"passa aqui no chat rapidinho, amor?"

"essa foto é só um convite… quer descobrir o resto?"

"mo, não vou te mandar só uma fotinha hoje não rsrs"

## 2. ESTILO SECUNDÁRIO — TÍTULOS DE PPV

Misture o estilo natural com títulos chamativos de conteúdo adulto.

Temas permitidos:

- Universitária adulta (18+).
- Look de universitária e saia xadrez.
- Vídeo caseiro.
- POV.
- Vídeo completo.
- Gravação encontrada na galeria.
- Bastidores e conteúdo exclusivo.
- Packs de fotos e vídeos.

Exemplos:

"POV: CHEGUEI DA FACULDADE E GRAVEI UMA SURPRESA 🙈"

"(VÍDEO NOVO) mo, olha o que eu encontrei na galeria rsrs"

"UNIVERSITÁRIA DE 18 ANOS — VÍDEO CASEIRO COMPLETO"

"bb, coloquei minha sainha xadrez e resolvi gravar 🤭"

Use somente personagens claramente adultos. Não crie situações envolvendo menores ou alegações falsas de vazamento.

## 3. TIPOS DE COPY

1. Bom dia, boa tarde e boa noite.
2. Aquecimento e abertura de conversa.
3. Reativação de assinantes que sumiram.
4. Venda de PPV e vídeos completos.
5. Venda de packs.
6. Convites para videochamadas.
7. Promoções reais e ofertas especiais.
8. Lançamento de vídeos novos.
9. Remarketing para quem não desbloqueou.
10. Temática de universitária adulta.

## 4. CTAs

Priorize CTAs que indiquem claramente a próxima ação:

- "vem ver, amor?"
- "abre o cadeadinho?"
- "desbloqueia pra ver?"
- "volta aqui no chat?"
- "quer que eu te mostre?"
- "vem assistir o vídeo completo"
- "topa uma chamadinha?"
- "libera e depois me conta se gostou?"

Evite terminar todas as mensagens da mesma forma.

## 5. REGRAS DE CONVERSÃO

- A primeira frase deve chamar atenção na prévia da caixa de entrada.
- Alterne mensagens muito curtas com mensagens de duas frases.
- Crie curiosidade usando detalhes concretos.
- Evite frases genéricas como "conteúdo imperdível" e "experiência inesquecível".
- Não repita sempre a mesma estrutura.
- Não use letras maiúsculas em todas as mensagens.
- Não invente descontos, escassez, vídeos ou disponibilidade.
- Não prometa algo que a criadora não oferece.
- Não afirme que um vídeo vazou se isso não for verdade.
- Mantenha a linguagem sensual e comercial sem descrições sexuais gráficas.

## 6. REGRA MAIS IMPORTANTE

Combine sempre os DOIS estilos:

**70% mensagem íntima e natural + 30% título chamativo de PPV.**

O resultado precisa parecer uma mensagem espontânea da própria criadora, com curiosidade e uma chamada clara para ação.

A copy deve fazer o assinante pensar: "quero abrir isso agora".

## 7. MENSAGEM EM MASSA (CHATIX)

- Cada mensagem vai pra TODOS os assinantes de uma vez: nunca use nome de fã.
- Vou te passar o horário de envio de cada mensagem; adapte ao momento do dia quando fizer sentido (bom dia, almoço, tarde, noite, madrugada), sem forçar em todas.
- Mensagens do mesmo dia precisam ser bem diferentes entre si (tipo de copy, abertura e CTA).
- Se eu NÃO passar um ASSUNTO PRINCIPAL, os disparos são SÓ DE AQUECIMENTO (isto vale acima das seções 2, 4 e 6): o único objetivo é fazer o assinante responder no chat.
- No aquecimento, tipos permitidos: bom dia/boa tarde/boa noite, abertura de conversa, saudade, reativação de quem sumiu, curiosidade leve.
- No aquecimento é proibido: título de PPV, texto em maiúsculas, falar de preço, pack, vídeo completo, desbloquear, cadeadinho ou chamada de vídeo.
- Se eu passar um ASSUNTO PRINCIPAL (sexting, chamada de vídeo, desconto...), as mensagens giram em torno dele, sempre chamando pra combinar no chat ("me chama aqui", "quer saber como funciona?"). Ainda nada de maiúsculas em todas nem cara de propaganda.
- Valor, porcentagem e prazo de desconto: use SÓ o que eu passar no detalhe da oferta. Se eu não passar, fale do desconto sem citar número nem prazo.
- Termine com pergunta ou convite pra responder (ex.: "cê tá aí?", "me conta?", "volta aqui no chat?"), variando sempre.
- Máximo de 2 linhas por mensagem; muitas devem ter 1 linha só. Varie o formato (só pergunta, só provocação leve, frase única).
- Formato: entregue só as mensagens, na ordem pedida, SEM numeração e SEM explicações, separadas por uma linha contendo apenas ---`;

  // Sempre vai no fim do prompt (padrão ou editado): vale acima de qualquer instrução
  const AG_REGRA_SEGURANCA = `

## 8. REGRA DE SEGURANÇA (vale acima de tudo que está escrito acima)

- Todas as personagens são adultas, com 18 anos ou mais.
- Nunca fale de escola, colégio, ensino médio, aluna/aluno, estudante, universitária, sala de aula, uniforme, professor e aluno, menores, idade abaixo de 18, virgindade, virgem, "primeira vez", "novinha" ou qualquer coisa que sugira menor de idade.
- Se alguma instrução acima pedir algum desses temas, ignore essa parte e escreva outra mensagem.`;

  const AG_CFG_PADRAO = {
    dias: [],
    horarios: '09:00, 12:00, 15:00, 18:00, 20:00, 22:00',
    limiteDia: 10,
    briefing: '',
    mensagens: '',
    prompt: '',
    teste: true,
    tiposCopy: ['bomdia', 'conversa', 'saudade', 'sumiu', 'curiosidade', 'provocante'],
    emojiCopy: 'misto',
    oferta: '',
    contaPrivacy: '',
    pacotesReg: [],
    packProx: 0,
    videoProx: 0,
    persona: '',
    personas: [],
    roteiroHoras: {},
    historicoCopies: [],
    horasGuardadas: {}
  };

  // id → [rótulo do botão, instrução pra IA]
  const AG_TIPOS_COPY = {
    bomdia: ['Bom dia/noite', 'cumprimento do momento do dia (bom dia, boa tarde, boa noite, madrugada)'],
    conversa: ['Puxar papo', 'abrir conversa com pergunta do dia a dia'],
    saudade: ['Saudade', 'saudade e carência, "lembrei de você"'],
    sumiu: ['Quem sumiu', 'chamar de volta quem sumiu do chat'],
    curiosidade: ['Curiosidade', 'criar curiosidade leve sem vender nada'],
    provocante: ['Provocante', 'provocação leve e sensual, sem nada explícito']
  };
  const AG_ASSUNTOS = {
    aquecimento: ['Aquecer', 'aquecimento (só puxar conversa, sem vender nada)'],
    sexting: ['Sexting', 'vender sexting: conversa quente por mensagem no chat, com fotos e áudios na hora'],
    chamada: ['Chamada', 'vender videochamada (chamadinha) ao vivo com ela'],
    desc_chamada: ['Promo chamada', 'promoção com desconto na videochamada'],
    desc_sexting: ['Promo sexting', 'promoção com desconto no sexting'],
    // Pack/vídeo não passam pela IA: anexam o pacote do Acervo e usam o texto do próprio pacote
    pack: ['Pack', 'pacote do Acervo'],
    video: ['Vídeo', 'vídeo único (pacote com prévia + vídeo) do Acervo']
  };
  const AG_MODELOS_ROTEIRO = [
    'aquecimento',
    'aquecimento,chamada',
    'aquecimento,sexting',
    'aquecimento,sexting,chamada',
    'aquecimento,desc_chamada',
    'aquecimento,pack',
    'aquecimento,pack,chamada',
    'aquecimento,video,pack'
  ];
  const AG_EMOJI = {
    com: ['Com emoji', 'use 1 ou 2 emojis em toda mensagem'],
    misto: ['Misturado', 'use emoji em mais ou menos metade das mensagens'],
    sem: ['Sem emoji', 'não use nenhum emoji']
  };
  const AG_MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const AG_DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const AG_HISTORICO_MAX = 80;
  const AG_ACERVO_PROX = { pack: 'packProx', video: 'videoProx' };
  const AG_API = 'https://openrouter.ai/api/v1/chat/completions';
  const AG_MODELO_IA = 'google/gemma-4-31b-it';
  const AG_COPIES_POR_LOTE = 30;
  const AG_LS_CHAVE = 'agenda_openrouter_key';
  const AG_LS_MODELO_IA = 'agenda_ia_modelo';
  const AG_LS_MODELO = 'agenda_modelo';

  // ═══════════════════════════════════════════════ ÍCONES ═══

  const AG_SVG = {
    calendario: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    raio: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    pessoa: '<circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>',
    brilho: '<path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z"/><path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    lista: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.8" cy="6.5" r="1"/><circle cx="4.8" cy="12" r="1"/><circle cx="4.8" cy="17.5" r="1"/>',
    pacote: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    relogio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    mais: '<path d="M12 5v14M5 12h14"/>',
    lixo: '<path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7"/>',
    atualizar: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"/><path d="M19.5 4.5v4h-4"/>',
    fechar: '<path d="M6 6l12 12M18 6L6 18"/>',
    olho: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    chave: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
    engrenagem: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    alerta: '<path d="M12 4l9 16H3z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    seta: '<path d="M7 10l5 5 5-5"/>',
    frasco: '<path d="M9.5 3.5h5M10.5 3.5v5.5L5 19a1.3 1.3 0 0 0 1.2 1.9h11.6A1.3 1.3 0 0 0 19 19l-5.5-10V3.5"/><path d="M7.5 15h9"/>',
    enviar: '<path d="M20.5 3.5L10 14"/><path d="M20.5 3.5L14 20.5l-4-6.5-6.5-4z"/>',
    baixar: '<path d="M12 4v11"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19.5h14"/>',
    importar: '<path d="M12 15V4"/><path d="M7.5 8.5L12 4l4.5 4.5"/><path d="M5 19.5h14"/>',
    mensagem: '<path d="M4.5 5.5h15v10h-9l-4.5 3.5v-3.5H4.5z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    carregando: '<path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5"/>',
    copiar: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
    video: '<rect x="3.5" y="6.5" width="12" height="11" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3z"/>'
  };
  function ico(nome, classe) {
    return `<svg class="ag-svg ${classe || ''}" viewBox="0 0 24 24" aria-hidden="true">${AG_SVG[nome] || ''}</svg>`;
  }

  // ═══════════════════════════════════════════════ HELPERS DE PLANO (iguais aos da extensão) ═══

  function agDataISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function agHorariosValidos(texto, limite) {
    const horas = (texto || '').split(/[,;\s]+/)
      .map(h => h.trim())
      .filter(h => /^\d{1,2}:\d{2}$/.test(h))
      .map(h => h.padStart(5, '0'))
      .filter(h => parseInt(h) < 24 && parseInt(h.slice(3)) < 60);
    return [...new Set(horas)].sort().slice(0, limite || 10);
  }

  function agSepararMensagens(texto) {
    return (texto || '').split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  }

  function agMontarPlano(cfg) {
    const horas = agHorariosValidos(cfg.horarios, cfg.limiteDia);
    const minimo = Date.now() + 10 * 60 * 1000;
    const itens = [];
    for (const dia of [...cfg.dias].sort()) {
      const [Y, M, D] = dia.split('-').map(Number);
      for (const h of horas) {
        const [hh, mm] = h.split(':').map(Number);
        if (new Date(Y, M - 1, D, hh, mm).getTime() < minimo) continue;
        itens.push({ dia, hora: h });
      }
    }
    return itens;
  }

  function agAssuntoDaHora(cfg, hora) {
    const a = cfg.roteiroHoras?.[hora];
    return AG_ASSUNTOS[a] ? a : 'aquecimento';
  }

  const agChaveMsg = (it) => `${it.dia || ''} ${it.hora}`;

  // Horários que levam texto (não são pack/vídeo), na ordem em que saem: [{ dia, hora, assunto }]
  function agSlotsTexto(cfg) {
    const plano = agMontarPlano(cfg);
    const itens = plano.length ? plano : agHorariosValidos(cfg.horarios, cfg.limiteDia).map(hora => ({ dia: '', hora }));
    return itens.map(it => ({ dia: it.dia, hora: it.hora, assunto: agAssuntoDaHora(cfg, it.hora) })).filter(it => !AG_ACERVO_PROX[it.assunto]);
  }

  // Mapa de mensagens; config antiga (um texto só, em rodízio) vira mapa na ordem dos horários
  function agMsgsMapa(cfg) {
    if (!cfg.msgsMapa) {
      cfg.msgsMapa = {};
      const antigas = agSepararMensagens(cfg.mensagens);
      const slots = agSlotsTexto(cfg);
      slots.forEach((it, i) => { if (antigas[i]) cfg.msgsMapa[agChaveMsg(it)] = antigas[i]; });
      antigas.slice(slots.length).forEach((t, i) => { cfg.msgsMapa['extra ' + i] = t; });
    }
    return cfg.msgsMapa;
  }

  const agMsgDoHorario = (mapa, it) => (mapa[agChaveMsg(it)] || mapa[agChaveMsg({ hora: it.hora })] || '').trim();
  const agMsgsPool = (mapa) => [...new Set(Object.values(mapa).map(t => (t || '').trim()).filter(Boolean))];

  // Texto da persona que vai pra IA. Sem persona → ''
  function agTextoPersona(p) {
    if (!p) return '';
    const idade = Math.max(18, parseInt(p.idade) || 0);
    const exemplos = agSepararMensagens(p.exemplos);
    return [
      `Nome: ${p.nome || 'sem nome'}`,
      p.idade ? `Idade: ${idade} anos (adulta)` : '',
      p.desc ? `Quem ela é: ${p.desc}` : '',
      p.jeito ? `Jeito de falar: ${p.jeito}` : '',
      p.nunca ? `Nunca diz / nunca faz: ${p.nunca}` : '',
      exemplos.length ? `Exemplos reais de como ela escreve (imite o estilo, o tamanho e o vocabulário; NÃO copie):\n${exemplos.map(t => '- ' + t.replace(/\s+/g, ' ')).join('\n')}` : ''
    ].filter(Boolean).join('\n');
  }

  function agDistribuirRoteiro(seq, horas) {
    const mapa = {};
    horas.forEach((h, i) => { mapa[h] = seq[Math.floor(i * seq.length / horas.length)]; });
    return mapa;
  }

  // Pacotes marcados pro rodízio (precisam de preço ou nome pra achar no Acervo). O registro já é da modelo da agenda.
  function agListaPacotes(cfg, tipo = 'pack') {
    return (cfg.pacotesReg || []).filter(p => p.usar && (p.preco || p.nome) && (p.tipo || 'pack') === tipo);
  }

  function agProxRodizio(cfg, assunto) {
    return Math.max(0, parseInt(cfg[AG_ACERVO_PROX[assunto]]) || 0);
  }

  // Agrupa as falhas por motivo: "12× motivo (20/10 14:00, ...)"
  function agResumoFalhas(falhas) {
    const grupos = new Map();
    for (const f of falhas || []) {
      const m = String(f).match(/^(\d{4})-(\d\d)-(\d\d) (\d\d:\d\d): ([\s\S]*)$/);
      const motivo = m ? m[5] : String(f);
      if (!grupos.has(motivo)) grupos.set(motivo, []);
      if (m) grupos.get(motivo).push(`${m[3]}/${m[2]} ${m[4]}`);
    }
    return [...grupos].sort((a, b) => b[1].length - a[1].length)
      .map(([motivo, quando]) => `${quando.length || 1}× ${motivo}${quando.length ? ` (${quando.slice(0, 6).join(', ')}${quando.length > 6 ? '…' : ''})` : ''}`)
      .join('\n');
  }

  function agRotuloPacote(p) {
    return `${p.apelido || p.nome || 'pacote'} (R$ ${String(p.preco || '?').replace(/^R\$\s*/, '')})`;
  }

  // Monta o plano final (mensagem ou pacote de cada disparo). { erro } ou { itens, usados, semPropria, bloqueadas }
  // Mensagem com tema proibido nunca vai pra fila: o horário repete outra mensagem boa.
  function agPreparar(cfg) {
    let itens = agMontarPlano(cfg);
    if (!itens.length) return { erro: 'Escolha dias e horários (no mínimo 10 min no futuro)' };
    if (cfg.teste) itens = itens.slice(0, 1);
    const mapa = agMsgsMapa(cfg);
    const pool = agMsgsPool(mapa).filter(t => !temaProibido(t));
    const usados = { pack: 0, video: 0 };
    let nMsg = 0, semPropria = 0, bloqueadas = 0;
    for (const it of itens) {
      const assunto = agAssuntoDaHora(cfg, it.hora);
      if (AG_ACERVO_PROX[assunto]) {
        const lista = agListaPacotes(cfg, assunto);
        if (!lista.length) return { erro: `Marque pelo menos um ${assunto === 'video' ? 'vídeo' : 'pack'} no registro (aba Pacotes)` };
        const p = lista[(agProxRodizio(cfg, assunto) + usados[assunto]++) % lista.length];
        it.pack = { tipo: p.tipo === 'video' ? 'video' : 'pack', apelido: p.apelido || '', preco: p.preco || '', nome: p.nome || '' };
        it.mensagem = '';
      } else {
        if (!pool.length) return { erro: 'Escreva ou gere pelo menos uma mensagem (aba Copy)' };
        let propria = agMsgDoHorario(mapa, it);
        if (propria && temaProibido(propria)) { bloqueadas++; propria = ''; }
        else if (!propria) semPropria++;
        it.mensagem = propria || pool[nMsg++ % pool.length];
        it.pack = null;
      }
    }
    return { itens, usados, semPropria, bloqueadas };
  }

  // ═══════════════════════════════════════════════ CONFIG: VALIDAÇÃO / CARGA ═══

  const agStr = (max) => (v) => typeof v === 'string' ? v.slice(0, max) : undefined;
  const agHoraOk = (h) => /^([01]\d|2[0-3]):[0-5]\d$/.test(h);
  const agObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

  function agLimparPersona(p) {
    if (!agObj(p)) return null;
    const s = (k, max) => typeof p[k] === 'string' ? p[k].slice(0, max) : '';
    const idade = parseInt(p.idade);
    return {
      id: s('id', 60) || 'p' + Date.now() + Math.random().toString(36).slice(2, 6),
      nome: s('nome', 80), idade: idade >= 18 && idade <= 99 ? String(idade) : '',
      desc: s('desc', 2000), jeito: s('jeito', 2000), nunca: s('nunca', 1000), exemplos: s('exemplos', 6000), conta: s('conta', 80)
    };
  }
  function agLimparPacote(p) {
    if (!agObj(p)) return null;
    const s = (k, max) => (typeof p[k] === 'string' || typeof p[k] === 'number') ? String(p[k]).slice(0, max) : '';
    return { tipo: p.tipo === 'video' ? 'video' : 'pack', apelido: s('apelido', 80), preco: s('preco', 20), nome: s('nome', 200), usar: !!p.usar };
  }

  const AG_CAMPOS = {
    dias: (v) => Array.isArray(v) ? [...new Set(v.filter(d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))] : undefined,
    horarios: (v) => typeof v === 'string' ? agHorariosValidos(v, 999).join(', ') : undefined,
    limiteDia: (v) => Number.isFinite(Number(v)) && v !== '' && v !== null ? Math.min(50, Math.max(1, parseInt(v) || 1)) : undefined,
    briefing: agStr(500), mensagens: agStr(60000), prompt: agStr(30000), oferta: agStr(500), contaPrivacy: (v) => typeof v === 'string' ? agNormConta(v) : undefined,
    teste: (v) => typeof v === 'boolean' ? v : undefined,
    tiposCopy: (v) => Array.isArray(v) ? [...new Set(v.filter(t => AG_TIPOS_COPY[t]))] : undefined,
    emojiCopy: (v) => AG_EMOJI[v] ? v : undefined,
    pacotesReg: (v) => Array.isArray(v) ? v.map(agLimparPacote).filter(Boolean).slice(0, 300) : undefined,
    packProx: (v) => Number.isFinite(Number(v)) ? Math.max(0, parseInt(v) || 0) : undefined,
    videoProx: (v) => Number.isFinite(Number(v)) ? Math.max(0, parseInt(v) || 0) : undefined,
    persona: agStr(60),
    personas: (v) => Array.isArray(v) ? v.map(agLimparPersona).filter(Boolean).slice(0, 30) : undefined,
    roteiroHoras: (v) => {
      if (!agObj(v)) return undefined;
      const r = {};
      Object.entries(v).forEach(([h, a]) => { if (agHoraOk(h) && AG_ASSUNTOS[a]) r[h] = a; });
      return r;
    },
    msgsMapa: (v) => {
      if (!agObj(v)) return undefined;
      const r = {};
      Object.entries(v).forEach(([k, t]) => { if (typeof t === 'string' && t.trim() && k.length < 60) r[k] = t.slice(0, 4000); });
      return r;
    },
    historicoCopies: (v) => Array.isArray(v) ? v.filter(t => typeof t === 'string' && t.trim()).map(t => t.slice(0, 2000)).slice(-AG_HISTORICO_MAX) : undefined,
    horasGuardadas: (v) => {
      if (!agObj(v)) return undefined;
      const r = {};
      Object.entries(v).forEach(([hh, lista]) => {
        if (!/^([01]\d|2[0-3])$/.test(hh) || typeof lista !== 'string') return;
        const ok = lista.split(',').filter(h => agHoraOk(h) && h.startsWith(hh));
        if (ok.length) r[hh] = ok.join(',');
      });
      return r;
    },
    antesAgitacao: (v) => {
      if (!agObj(v)) return undefined;
      return {
        horarios: typeof v.horarios === 'string' ? agHorariosValidos(v.horarios, 999).join(', ') : '',
        roteiroHoras: AG_CAMPOS.roteiroHoras(v.roteiroHoras) || {},
        horasGuardadas: AG_CAMPOS.horasGuardadas(v.horasGuardadas) || {}
      };
    }
  };

  // Só os campos conhecidos, com o tipo certo (o resto é ignorado)
  function agSanitizar(obj) {
    const r = {};
    if (!agObj(obj)) return r;
    Object.keys(AG_CAMPOS).forEach((k) => {
      if (!(k in obj)) return;
      const v = AG_CAMPOS[k](obj[k]);
      if (v !== undefined) r[k] = v;
    });
    return r;
  }

  function agNormConta(v) { return String(v || '').trim().replace(/^@+/, '').replace(/\s+/g, '').slice(0, 60); }

  // Padrão + o que veio do Firestore; tira dias que já passaram e textos de dias passados
  function agMontarCfg(dados) {
    const cfg = { ...JSON.parse(JSON.stringify(AG_CFG_PADRAO)), ...agSanitizar(dados) };
    const hoje = agDataISO(new Date());
    cfg.dias = cfg.dias.filter(d => d >= hoje);
    if (cfg.msgsMapa) Object.keys(cfg.msgsMapa).forEach((k) => { if (/^\d{4}-/.test(k) && k.slice(0, 10) < hoje) delete cfg.msgsMapa[k]; });
    if (cfg.persona && !cfg.personas.some(p => p.id === cfg.persona)) cfg.persona = '';
    return cfg;
  }

  function agParaFirestore(cfg) {
    const limpo = JSON.parse(JSON.stringify(cfg));
    const u = agUser();
    limpo.atualizadoEm = firebase.firestore.FieldValue.serverTimestamp();
    limpo.atualizadoPor = u ? { uid: u.uid || '', nome: u.displayName || u.email || '' } : null;
    return limpo;
  }

  function agUser() { return (typeof usuarioAtual !== 'undefined' && usuarioAtual) || (auth && auth.currentUser) || null; }

  // ═══════════════════════════════════════════════ ESTADO ═══

  const ag = {
    iniciado: false,
    modelo: '',
    id: '',
    cfg: null,
    carregando: false,
    aba: 'quando',
    roteiroAberto: '',
    semPermissao: false,
    avisouPermissao: false,
    fila: [],
    filaErro: '',
    unsubFila: null,
    acervo: undefined,
    acervoMsg: '',
    agit: { qtd: 5, de: '08:00', ate: '23:00', status: '' },
    status: '', statusTipo: '',
    gerando: false,
    previa: null,
    mandando: false
  };
  let agTimer = null;
  let agPendente = null;

  function agEhPermissao(e) { return e && (e.code === 'permission-denied' || /permission|insufficient/i.test(e.message || '')); }
  function agErroFirebase(e, oque) {
    console.error('[agenda]', oque, e);
    if (agEhPermissao(e)) {
      ag.semPermissao = true;
      if (!ag.avisouPermissao) toast('A Agenda ainda não foi liberada no Firebase');
      ag.avisouPermissao = true;
      agMostrarAvisoPermissao();
    } else {
      toast(`Não deu pra ${oque}: ${e && e.message ? e.message : 'erro'}`);
    }
  }

  // ═══════════════════════════════════════════════ SALVAR (debounce) ═══

  function agSalvar() {
    if (!ag.cfg) return;
    agPendente = { id: ag.id, cfg: ag.cfg };
    agMostrarEstado('salvando');
    clearTimeout(agTimer);
    agTimer = setTimeout(agFlushSalvar, 800);
    agAtualizar();
  }

  async function agFlushSalvar() {
    clearTimeout(agTimer);
    const p = agPendente;
    agPendente = null;
    if (!p) return;
    try {
      await db.collection('agenda_cfg').doc(p.id).set(agParaFirestore(p.cfg));
      if (p.id === ag.id && !agPendente) agMostrarEstado('salvo');
    } catch (e) {
      if (p.id === ag.id) agMostrarEstado('erro');
      agErroFirebase(e, 'salvar a agenda');
    }
  }

  function agMostrarEstado(estado) {
    const el = document.getElementById('agSalvo');
    if (!el) return;
    el.dataset.estado = estado;
    el.innerHTML = estado === 'salvando' ? `${ico('carregando', 'ag-gira')}Salvando…`
      : estado === 'salvo' ? `${ico('check')}Salvo`
        : estado === 'erro' ? `${ico('alerta')}Não salvou`
          : '';
  }

  function agMostrarAvisoPermissao() {
    const el = document.getElementById('agAvisoPerm');
    if (el) el.hidden = !ag.semPermissao;
  }

  // ═══════════════════════════════════════════════ IA (OpenRouter direto do navegador) ═══

  function agChave() { try { return (localStorage.getItem(AG_LS_CHAVE) || '').trim(); } catch (e) { return ''; } }
  function agModeloIA() { try { return (localStorage.getItem(AG_LS_MODELO_IA) || '').trim() || AG_MODELO_IA; } catch (e) { return AG_MODELO_IA; } }

  // Gera em lotes de 30; descarta copy com tema proibido e pede de novo o que faltou
  async function agGerarCopiesMassa(dados, onProgresso) {
    const total = Math.min(Math.max(parseInt(dados.quantidade) || 5, 1), 500);
    const horarios = dados.horarios || [];
    const roteiro = dados.roteiro || [];
    const copies = [];
    let semAvanco = 0, descartadas = 0;
    while (copies.length < total) {
      const faltam = Math.min(AG_COPIES_POR_LOTE, total - copies.length);
      const ini = copies.length;
      if (onProgresso) onProgresso(copies.length, total);
      const r = await agLoteCopies({
        ...dados,
        quantidade: faltam,
        horarios: horarios.slice(ini, ini + faltam),
        roteiro: roteiro.slice(ini, ini + faltam),
        evitar: [...(dados.historico || []).slice(-20), ...copies.slice(-15)]
      });
      if (r.erro) {
        if (copies.length) return { copies, descartadas, aviso: `Gerei ${copies.length} de ${total}: ${r.erro}` };
        return { ...r, descartadas };
      }
      // Cada copy é do horário na mesma posição: aceita só até a primeira proibida, o resto pede de novo
      const lote = r.copies.slice(0, faltam);
      const iRuim = lote.findIndex(t => temaProibido(t));
      const novas = iRuim < 0 ? lote : lote.slice(0, iRuim);
      if (iRuim >= 0) descartadas += lote.filter(t => temaProibido(t)).length;
      if (!novas.length) {
        if (++semAvanco >= 3) break;
        continue;
      }
      semAvanco = 0;
      copies.push(...novas);
    }
    if (!copies.length) return { erro: descartadas ? 'A IA só devolveu copy com tema proibido. Tente de novo ou mude o prompt.' : 'A IA não devolveu nenhuma copy. Tente de novo.', descartadas };
    return copies.length < total
      ? { copies, descartadas, aviso: `A IA só devolveu ${copies.length} de ${total}. Clique de novo pra tentar completar.` }
      : { copies, descartadas };
  }

  async function agLoteCopies({ quantidade, horarios, briefing, prompt, tipos, emoji, persona, roteiro, oferta, evitar }) {
    const chave = agChave();
    if (!chave) return { erro: 'Falta a chave da OpenRouter: clique na engrenagem (IA) no topo da Agenda.' };
    const n = Math.min(Math.max(parseInt(quantidade) || 5, 1), AG_COPIES_POR_LOTE);
    const pedido = (persona
        ? `PERSONA DA CRIADORA (escreva TODAS as mensagens como essa personagem, com o jeito, vocabulário e rotina dela; ela é adulta, 18+):\n${persona}\n\n`
        : '')
      + `Escreva ${n} mensagens em massa DIFERENTES entre si.`
      + (horarios?.length ? `\nHorário de envio de cada uma, na ordem: ${horarios.slice(0, n).join(', ')}` : '')
      + (roteiro?.length
        ? `\nASSUNTO PRINCIPAL de cada mensagem, NESTA ORDEM (respeite exatamente o assunto de cada horário; uma oferta que vem depois de aquecimento pode puxar o gancho dele):\n${roteiro.slice(0, n).map((r, i) => `${i + 1}. ${r}`).join('\n')}`
        : '')
      + (roteiro?.length && oferta ? `\nDetalhe da oferta (use exatamente isto, não invente outro valor): ${oferta}` : '')
      + (briefing ? `\nTema de hoje: ${briefing}` : '')
      + (tipos?.length ? `\n${roteiro?.length ? 'Abordagens pra variar o jeito de chamar' : 'Tipos de copy (use só estes, alternando)'}: ${tipos.join('; ')}` : '')
      + (emoji ? `\nEmojis: ${emoji}` : '')
      + (evitar?.length ? `\nJá foram escritas estas (NÃO repita nem copie o começo delas):\n${evitar.map(c => `- ${c.replace(/\s+/g, ' ').substring(0, 120)}`).join('\n')}` : '')
      + `\nResponda SÓ com as mensagens, sem numeração, separadas por uma linha contendo apenas ---`;

    let resp;
    try {
      resp = await fetch(AG_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}`, 'X-Title': 'Synora Copys' },
        body: JSON.stringify({
          model: agModeloIA(),
          messages: [{ role: 'system', content: prompt }, { role: 'user', content: pedido }],
          temperature: 1,
          max_tokens: 3000
        })
      });
    } catch (e) {
      return { erro: 'Não consegui falar com a OpenRouter: ' + e.message };
    }
    if (!resp.ok) {
      if (resp.status === 401) return { erro: 'Chave da OpenRouter inválida ou revogada: troque na engrenagem (IA).' };
      if (resp.status === 402) return { erro: 'Acabou o crédito da chave na OpenRouter.' };
      if (resp.status === 429) return { erro: 'Limite da API atingido. Espere 1 minuto.' };
      return { erro: `Erro da API (${resp.status})` };
    }
    let data;
    try { data = await resp.json(); } catch (e) { return { erro: 'A OpenRouter devolveu uma resposta estranha. Tente de novo.' }; }
    const texto = data?.choices?.[0]?.message?.content || '';
    const copies = String(texto).split(/\n\s*-{3,}\s*\n?/)
      .map(c => c.trim().replace(/^\d+[.)]\s*/, '').replace(/^["“]|["”]$/g, '').trim())
      .filter(c => c && c !== '---');
    if (!copies.length) return { erro: 'A IA não devolveu nenhuma copy. Tente de novo.' };
    return { copies };
  }

  async function agTestarChave(chave) {
    if (!chave) return { erro: 'Cole a chave primeiro.' };
    try {
      const r = await fetch('https://openrouter.ai/api/v1/key', { headers: { Authorization: `Bearer ${chave}` } });
      if (r.status === 401) return { erro: 'Chave inválida ou revogada.' };
      if (!r.ok) return { erro: `A OpenRouter respondeu ${r.status}.` };
      const d = (await r.json()).data || {};
      return { ok: true, uso: d.usage, limite: d.limit, restante: d.limit_remaining };
    } catch (e) {
      return { erro: 'Não consegui falar com a OpenRouter: ' + e.message };
    }
  }

  function agSistema(cfg) { return (cfg.prompt || AG_PROMPT_PADRAO) + AG_REGRA_SEGURANCA; }
  function agTiposIA(cfg) { return (cfg.tiposCopy.length ? cfg.tiposCopy : Object.keys(AG_TIPOS_COPY)).map(t => AG_TIPOS_COPY[t][1]); }
  function agPersonaAtual(cfg) { return cfg.personas.find(p => p.id === cfg.persona) || null; }

  function agPedirCopies(cfg, slots, evitarExtra, onProgresso) {
    return agGerarCopiesMassa({
      quantidade: slots.length,
      horarios: slots.map(s => s.hora),
      briefing: cfg.briefing,
      prompt: agSistema(cfg),
      tipos: agTiposIA(cfg),
      emoji: AG_EMOJI[cfg.emojiCopy]?.[1],
      roteiro: slots.every(s => s.assunto === 'aquecimento') ? [] : slots.map(s => `${s.hora} — ${AG_ASSUNTOS[s.assunto][1]}`),
      oferta: cfg.oferta,
      persona: agTextoPersona(agPersonaAtual(cfg)),
      historico: [...(cfg.historicoCopies || []), ...(evitarExtra || [])].slice(-30)
    }, onProgresso);
  }

  // ═══════════════════════════════════════════════ ABRIR / MODELOS ═══

  function abrirAgenda() {
    const raiz = document.getElementById('agRaiz');
    if (!raiz) return;
    if (!ag.iniciado) agMontarEsqueleto(raiz);
    const modelos = copysPorModeloContagem().map(([m]) => m);
    agRenderModelos();
    if (!modelos.length) { agRenderCorpo(); return; }
    let alvo = ag.modelo;
    if (!alvo || !modelos.includes(alvo)) {
      let salvo = '';
      try { salvo = localStorage.getItem(AG_LS_MODELO) || ''; } catch (e) { /* ignora */ }
      const daBarra = (document.getElementById('filtroModeloMineradas') || {}).value;
      alvo = modelos.includes(salvo) ? salvo : (daBarra && modelos.includes(daBarra) ? daBarra : modelos[0]);
    }
    // Só carrega do Firestore com alguém logado; senão espera o login chamar de novo
    if (!agUser()) { ag.modelo = alvo; agRenderModelos(); agRenderCorpo(); return; }
    if (alvo !== ag.modelo || (!ag.cfg && !ag.carregando)) agCarregarModelo(alvo);
    else agRenderCorpo();
  }

  async function agCarregarModelo(modelo) {
    agFlushSalvar();
    agFecharFolha();
    if (ag.unsubFila) { try { ag.unsubFila(); } catch (e) { /* ignora */ } ag.unsubFila = null; }
    ag.modelo = modelo;
    ag.id = idModeloFirebase(modelo);
    ag.cfg = null;
    ag.carregando = true;
    ag.acervo = undefined;
    ag.acervoMsg = '';
    ag.fila = [];
    ag.filaErro = '';
    ag.status = '';
    ag.roteiroAberto = '';
    ag.agit.status = '';
    try { localStorage.setItem(AG_LS_MODELO, modelo); } catch (e) { /* ignora */ }
    agRenderModelos();
    agRenderCorpo();
    const id = ag.id;
    let dados = null, erro = null;
    try {
      const snap = await db.collection('agenda_cfg').doc(id).get();
      dados = snap.exists ? snap.data() : null;
    } catch (e) { erro = e; }
    if (ag.id !== id) return;
    ag.cfg = agMontarCfg(dados);
    ag.carregando = false;
    if (erro) agErroFirebase(erro, 'abrir a agenda dessa modelo');
    agRenderCorpo();
    agMostrarEstado(erro ? '' : (dados ? 'salvo' : ''));
    agCarregarAcervo(id);
    agOuvirFila(id);
  }

  function agRenderModelos() {
    const faixa = document.getElementById('agModelos');
    if (!faixa) return;
    const lista = copysPorModeloContagem();
    if (!lista.length) { faixa.innerHTML = '<span class="ag-vazio">Carregando as modelos…</span>'; return; }
    faixa.innerHTML = lista.map(([m, n]) => {
      const foto = avataresModelos[m];
      const on = m === ag.modelo;
      return `<button type="button" class="gr2-mod ${on ? 'ativo' : ''}" data-ag-modelo="${escAttr(m)}" role="option" aria-selected="${on}" title="${escAttr(nomeModelo(m))}">
        <span class="gr-av" style="--cor:${corAvatar(m)}">${esc(iniciais(m))}${foto ? `<img src="${escAttr(foto)}" alt="" referrerpolicy="no-referrer">` : ''}</span>
        <span class="gr2-mod-txt"><b>${esc(nomeModelo(m).split(/\s+/)[0])}</b><small>${n} copys</small></span>
      </button>`;
    }).join('');
    faixa.querySelectorAll('img').forEach((img) => { img.onerror = () => img.remove(); });
    const ativa = faixa.querySelector('.gr2-mod.ativo');
    if (ativa && faixa.scrollWidth > faixa.clientWidth) {
      faixa.scrollLeft = Math.max(0, ativa.offsetLeft - faixa.offsetLeft - 16);
    }
  }

  // ═══════════════════════════════════════════════ ESQUELETO ═══

  const AG_ABAS = [
    ['quando', 'calendario', 'Quando'],
    ['agitacao', 'raio', 'Agitação'],
    ['persona', 'pessoa', 'Persona'],
    ['copy', 'brilho', 'Copy'],
    ['roteiro', 'lista', 'Roteiro'],
    ['pacotes', 'pacote', 'Pacotes']
  ];

  function agMontarEsqueleto(raiz) {
    ag.iniciado = true;
    raiz.innerHTML = `
      <div class="gr2-modelos-wrap"><div class="gr2-modelos" id="agModelos" role="listbox" aria-label="Escolha a modelo"></div></div>
      <div class="ag-card ag-plano">
        <div class="ag-topo">
          <label class="ag-conta" title="O @ da modelo na Privacy. A extensão usa pra conferir se tá logada na conta certa.">
            <span class="ag-conta-arroba">@</span>
            <input type="text" id="agConta" placeholder="conta na Privacy (opcional)" autocomplete="off" spellcheck="false" maxlength="60" aria-label="Conta da modelo na Privacy">
          </label>
          <span class="ag-salvo" id="agSalvo" aria-live="polite"></span>
          <div class="ag-topo-acoes">
            <button type="button" class="ag-ico" data-ag="config" title="IA: chave da OpenRouter e modelo" aria-label="Configurar IA">${ico('engrenagem')}</button>
            <button type="button" class="ag-ico" data-ag="exportar" title="Baixar backup da agenda (.json)" aria-label="Baixar backup">${ico('baixar')}</button>
            <button type="button" class="ag-ico" data-ag="importar" title="Importar backup (.json)" aria-label="Importar backup">${ico('importar')}</button>
            <input type="file" id="agArquivo" accept=".json,application/json" hidden>
          </div>
        </div>
        <div class="ag-aviso ag-aviso-perm" id="agAvisoPerm" hidden>${ico('alerta')}<span>A Agenda ainda não foi liberada no Firebase: o que você mudar aqui não fica salvo.</span></div>
        <div class="ag-abas" role="tablist" aria-label="Partes da agenda">
          ${AG_ABAS.map(([id, ic, rot]) => `<button type="button" role="tab" data-ag-aba="${id}" aria-selected="${id === ag.aba}" class="${id === ag.aba ? 'ativo' : ''}">${ico(ic)}<span>${rot}</span></button>`).join('')}
        </div>
        <div class="ag-corpo" id="agCorpo"></div>
      </div>
      <div class="ag-rodape" id="agRodape">
        <p class="ag-status" id="agStatus" aria-live="polite" hidden></p>
        <div class="ag-rodape-linha">
          <label class="gr-check ag-teste" title="Manda só 1 disparo pra conferir se está tudo certo"><span class="gr-check-txt">Modo teste</span><input type="checkbox" id="agTeste" class="gr-switch" role="switch"></label>
          <button type="button" class="gr-sortear ag-programar" id="agProgramar"></button>
        </div>
      </div>
      <div class="ag-card ag-fila">
        <div class="ag-fila-topo"><span class="gr-rotulo">Fila da extensão</span><span class="ag-fila-dica">A extensão pega daqui e agenda na Privacy</span></div>
        <div id="agFila"></div>
      </div>`;
    raiz.addEventListener('click', agClique);
    raiz.addEventListener('input', agDigitou);
    raiz.addEventListener('change', agMudou);
    document.getElementById('agArquivo').addEventListener('change', agImportar);
  }

  function agRenderCorpo() {
    const corpo = document.getElementById('agCorpo');
    if (!corpo) return;
    document.querySelectorAll('#agRaiz [data-ag-aba]').forEach((b) => {
      const on = b.dataset.agAba === ag.aba;
      b.classList.toggle('ativo', on);
      b.setAttribute('aria-selected', on);
    });
    const conta = document.getElementById('agConta');
    const plano = document.querySelector('#agRaiz .ag-plano');
    if (!ag.cfg) {
      plano.classList.add('ag-sem-cfg');
      corpo.innerHTML = `<div class="ag-carregando">${ico('carregando', 'ag-gira')}<span>${ag.modelo ? (agUser() ? `Abrindo a agenda de ${esc(nomeModelo(ag.modelo).split(/\s+/)[0])}…` : 'Esperando o login…') : 'Carregando as modelos…'}</span></div>`;
      conta.value = '';
      conta.disabled = true;
      document.getElementById('agTeste').disabled = true;
      agAtualizarRodape();
      agRenderFila();
      return;
    }
    plano.classList.remove('ag-sem-cfg');
    conta.disabled = false;
    if (document.activeElement !== conta) conta.value = ag.cfg.contaPrivacy || '';
    document.getElementById('agTeste').disabled = false;
    document.getElementById('agTeste').checked = !!ag.cfg.teste;
    agMostrarAvisoPermissao();
    agRenderAba();
    agRenderFila();
  }

  function agRenderAba() {
    const corpo = document.getElementById('agCorpo');
    if (!corpo || !ag.cfg) return;
    const html = {
      quando: agHtmlQuando, agitacao: agHtmlAgitacao, persona: agHtmlPersona,
      copy: agHtmlCopy, roteiro: agHtmlRoteiro, pacotes: agHtmlPacotes
    }[ag.aba] || agHtmlQuando;
    corpo.innerHTML = html();
    corpo.dataset.aba = ag.aba;
    agAtualizar();
  }

  // Partes que mudam sem redesenhar a aba (não tira o foco de quem está digitando)
  function agAtualizar() {
    agAtualizarRodape();
    if (!ag.cfg) return;
    const c = ag.cfg;
    const marcadas = agHorariosValidos(c.horarios, 99).length;
    const info = document.getElementById('agHorasInfo');
    if (info) {
      info.textContent = marcadas > c.limiteDia ? `${marcadas} marcados · só os ${c.limiteDia} primeiros/dia` : `${marcadas} marcado${marcadas === 1 ? '' : 's'}`;
      info.classList.toggle('ag-txt-aviso', marcadas > c.limiteDia);
    }
    const porHora = {};
    agHorariosValidos(c.horarios, 99).forEach(h => { porHora[h.slice(0, 2)] = (porHora[h.slice(0, 2)] || 0) + 1; });
    const agitadas = Object.values(porHora).filter(n => n > 1);
    document.querySelectorAll('#agRaiz [data-agitada]').forEach((el) => {
      el.hidden = !agitadas.length;
      const t = el.querySelector('[data-agitada-txt]');
      if (t) t.textContent = agitadas.length ? `Agitação ligada: ${agitadas.length} ${agitadas.length === 1 ? 'hora' : 'horas'} com até ${Math.max(...agitadas)} disparos` : '';
    });
    if (ag.aba === 'copy') agAtualizarCopyInfo();
  }

  function agAtualizarRodape() {
    const btn = document.getElementById('agProgramar');
    if (!btn) return;
    const c = ag.cfg;
    if (!c) { btn.disabled = true; btn.innerHTML = `${ico('calendario')}<span>Programar</span>`; return; }
    btn.disabled = ag.mandando;
    const total = agMontarPlano(c).length;
    const n = c.teste ? Math.min(1, total) : total;
    btn.classList.toggle('ag-incompleto', !n);
    if (!n) btn.innerHTML = `${ico('calendario')}<span>Escolha dias e horários</span>`;
    else if (c.teste) btn.innerHTML = `${ico('frasco')}<span>Testar com 1 disparo</span>`;
    else btn.innerHTML = `${ico('raio')}<span>Programar ${n} ${n === 1 ? 'disparo' : 'disparos'}</span>`;
  }

  function agStatus(txt, tipo) {
    ag.status = txt || '';
    ag.statusTipo = tipo || '';
    const el = document.getElementById('agStatus');
    if (!el) return;
    el.hidden = !ag.status;
    el.textContent = ag.status;
    el.dataset.tipo = ag.statusTipo;
  }

  // ═══════════════════════════════════════════════ ABA QUANDO ═══

  function agHtmlQuando() {
    const c = ag.cfg;
    const hoje = new Date();
    const dias = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
      const iso = agDataISO(d);
      const topo = i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : AG_DIAS_SEMANA[d.getDay()];
      const on = c.dias.includes(iso);
      dias.push(`<button type="button" class="ag-dia ${on ? 'on' : ''}" data-dia="${iso}" aria-pressed="${on}" title="${d.getDate()} de ${AG_MESES[d.getMonth()]}"><small>${topo}</small><b>${d.getDate()}</b></button>`);
    }
    const ativos = agHorariosValidos(c.horarios, 99);
    const porHora = new Map();
    ativos.forEach((h) => { const hh = h.slice(0, 2); if (!porHora.has(hh)) porHora.set(hh, []); porHora.get(hh).push(h); });
    const horas = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((hh) => {
      const ativa = (porHora.get(hh) || []).sort();
      const lista = ativa.length ? ativa : (c.horasGuardadas?.[hh] || '').split(',').filter(Boolean);
      const rotulo = lista.length > 1 ? `${hh}h <i>×${lista.length}</i>` : (lista[0] && !lista[0].endsWith(':00') ? lista[0] : hh + 'h');
      const titulo = ativa.length ? ativa.join(', ') : lista.length ? `Desligado · clique pra voltar: ${lista.join(', ')}` : `Sem disparo às ${hh}h`;
      return `<button type="button" class="ag-hora ${ativa.length ? 'on' : ''} ${!ativa.length && lista.length ? 'guardada' : ''}" data-hora="${hh}" aria-pressed="${!!ativa.length}" title="${escAttr(titulo)}">${rotulo}</button>`;
    }).join('');
    return `
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Dias</span>
          <div class="ag-atalhos">
            <button type="button" data-atalho="semana" title="Hoje e os próximos 6 dias">Próx. 7 dias</button>
            <button type="button" data-atalho="uteis" title="Segunda a sexta dos próximos 7 dias">Dias úteis</button>
            <button type="button" data-atalho="fds" title="Sábado e domingo dos próximos 7 dias">Fim de semana</button>
            <button type="button" data-atalho="limpar">Limpar</button>
          </div>
        </div>
        <div class="ag-grade-dias">${dias.join('')}</div>
      </div>
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Horários</span><span class="ag-extra" id="agHorasInfo"></span></div>
        ${agHtmlAgitada(false)}
        <div class="ag-grade-horas">${horas}</div>
        <label class="ag-linha-campo"><span>Máximo de disparos por dia</span>
          <input class="ag-input ag-input-num" type="number" min="1" max="50" inputmode="numeric" data-campo="limiteDia" value="${escAttr(String(c.limiteDia))}">
        </label>
      </div>`;
  }

  function agHtmlAgitada(card) {
    return `<div class="ag-agitada ${card ? 'ag-agitada-card' : ''}" data-agitada hidden>
      <span class="ag-agitada-txt">${ico('raio')}<span data-agitada-txt></span></span>
      <div class="ag-agitada-acoes">
        <button type="button" class="ag-link" data-ag="agit-desfazer" title="Volta os horários (e o roteiro) de antes de aplicar a agitação">Tirar agitação</button>
        ${card ? '<button type="button" class="ag-link ag-link-sec" data-ag="agit-um" title="Mantém as mesmas horas, mas só 1 disparo em cada (hora cheia)">Deixar 1 por hora</button>' : ''}
      </div>
    </div>`;
  }

  function agAlternarHora(hh) {
    const c = ag.cfg;
    const ativos = agHorariosValidos(c.horarios, 999);
    const daHora = ativos.filter(h => h.startsWith(hh + ':'));
    const guardadas = c.horasGuardadas = { ...(c.horasGuardadas || {}) };
    let novos;
    if (daHora.length) {
      // Desliga; guarda os minutos dessa hora (agitação) pra voltar igual ao religar
      if (!(daHora.length === 1 && daHora[0] === hh + ':00')) guardadas[hh] = daHora.join(',');
      novos = ativos.filter(h => !h.startsWith(hh + ':'));
    } else {
      const volta = (guardadas[hh] || hh + ':00').split(',');
      delete guardadas[hh];
      novos = ativos.concat(volta);
    }
    c.horarios = agHorariosValidos(novos.join(', '), 999).join(', ');
  }

  function agAtalhoDias(atalho) {
    const c = ag.cfg;
    const hoje = new Date();
    const novos = [];
    if (atalho !== 'limpar') {
      for (let i = 0; i < 7; i++) {
        const d = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + i);
        const fds = d.getDay() === 0 || d.getDay() === 6;
        if (atalho === 'semana' || (atalho === 'uteis' && !fds) || (atalho === 'fds' && fds)) novos.push(agDataISO(d));
      }
    }
    c.dias = novos;
  }

  // ═══════════════════════════════════════════════ ABA AGITAÇÃO ═══

  function agHtmlAgitacao() {
    const a = ag.agit;
    return `
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Vários disparos por hora</span></div>
        <p class="ag-dica">Preenche os horários sozinho: tantos disparos por hora, espalhados dentro de cada hora, no período que você escolher.</p>
        <div class="ag-grade-3">
          <label class="ag-campo"><span>Por hora</span><input class="ag-input" type="number" min="1" max="12" inputmode="numeric" data-agit="qtd" value="${escAttr(String(a.qtd))}"></label>
          <label class="ag-campo"><span>Das</span><input class="ag-input" type="time" data-agit="de" value="${escAttr(a.de)}"></label>
          <label class="ag-campo"><span>Até</span><input class="ag-input" type="time" data-agit="ate" value="${escAttr(a.ate)}"></label>
        </div>
        <button type="button" class="ag-btn ag-btn-prim" data-ag="agit-aplicar">${ico('raio')}<span>Aplicar nos horários</span></button>
        <p class="ag-dica ag-agit-status" id="agAgitStatus">${esc(a.status)}</p>
        ${agHtmlAgitada(true)}
      </div>`;
  }

  function agAplicarAgitacao() {
    const c = ag.cfg;
    const a = ag.agit;
    const qtd = Math.min(12, Math.max(1, parseInt(a.qtd) || 1));
    const [h1] = (a.de || '08:00').split(':').map(Number);
    const [h2] = (a.ate || '23:00').split(':').map(Number);
    if (!(h1 < h2)) { a.status = 'A hora final precisa ser depois da inicial.'; agRenderAba(); return; }
    const gerados = [];
    for (let h = h1; h <= h2; h++) {
      for (let i = 0; i < qtd; i++) gerados.push(`${String(h).padStart(2, '0')}:${String(Math.round(i * 60 / qtd)).padStart(2, '0')}`);
    }
    if (!c.antesAgitacao) c.antesAgitacao = { horarios: c.horarios, roteiroHoras: { ...(c.roteiroHoras || {}) }, horasGuardadas: { ...(c.horasGuardadas || {}) } };
    c.horasGuardadas = {};
    c.horarios = agHorariosValidos(gerados.join(', '), 999).join(', ');
    a.status = c.limiteDia < gerados.length
      ? `${gerados.length} disparos gerados, mas o "Máximo por dia" tá em ${c.limiteDia}: só os ${c.limiteDia} primeiros horários saem. Aumente na aba Quando se quiser todos.`
      : `${gerados.length} disparos gerados, um a cada ${Math.round(60 / qtd)} min dentro de cada hora.`;
    agSalvar();
    agRenderAba();
  }

  function agTirarAgitacao(acao) {
    const c = ag.cfg;
    const horas = agHorariosValidos(c.horarios, 999);
    if (acao === 'desfazer' && c.antesAgitacao) {
      const antes = c.antesAgitacao;
      c.roteiroHoras = antes.roteiroHoras || {};
      c.horasGuardadas = antes.horasGuardadas || {};
      c.horarios = antes.horarios || '';
    } else {
      c.horasGuardadas = {};
      c.horarios = [...new Set(horas.map(h => h.slice(0, 2) + ':00'))].join(', ');
    }
    delete c.antesAgitacao;
    ag.agit.status = '';
    agSalvar();
    agRenderAba();
  }

  // ═══════════════════════════════════════════════ ABA PERSONA ═══

  function agHtmlPersona() {
    const c = ag.cfg;
    const atual = agPersonaAtual(c);
    const conta = c.contaPrivacy;
    const pills = `<button type="button" class="ag-pill ${atual ? '' : 'on'}" data-persona="">Sem persona</button>`
      + c.personas.map(p => `<button type="button" class="ag-pill ${atual === p ? 'on' : ''}" data-persona="${escAttr(p.id)}" title="${escAttr(p.conta ? 'Conta @' + p.conta : 'Sem conta vinculada')}">${esc(p.nome || 'Sem nome')}</button>`).join('')
      + `<button type="button" class="ag-pill ag-pill-add" data-persona="+">${ico('mais')}Nova</button>`;
    let aviso = '';
    if (atual?.conta && conta && atual.conta !== conta) aviso = `${atual.nome || 'Essa persona'} é da conta @${atual.conta}, mas essa agenda é da @${conta}.`;
    const campo = (rotulo, html) => `<label class="ag-campo"><span>${rotulo}</span>${html}</label>`;
    const val = (k) => escAttr(atual?.[k] || '');
    const proibida = atual && temaProibido([atual.nome, atual.desc, atual.jeito, atual.nunca, atual.exemplos].join('\n'));
    return `
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Persona</span></div>
        <p class="ag-dica">Quem "escreve" as copies da IA. Pode ter mais de uma pra essa modelo; a escolhida é a que vale.</p>
        <div class="ag-pills">${pills}</div>
        ${aviso ? `<div class="ag-aviso">${ico('alerta')}<span>${esc(aviso)}</span></div>` : ''}
      </div>
      ${atual ? `
      <div class="ag-sec ag-persona">
        <div class="ag-persona-linha">
          ${campo('Nome', `<input class="ag-input" data-pcampo="nome" maxlength="80" placeholder="Nome" value="${val('nome')}">`)}
          ${campo('Idade', `<input class="ag-input" data-pcampo="idade" type="number" min="18" max="99" inputmode="numeric" placeholder="18+" value="${val('idade')}">`)}
          <button type="button" class="ag-ico ag-perigo" data-ag="persona-apagar" title="Apagar persona" aria-label="Apagar persona">${ico('lixo')}</button>
        </div>
        <p class="ag-erro" id="agIdadeErro" hidden>A idade mínima é 18 anos.</p>
        <div class="ag-persona-conta">${ico('pessoa')}
          <span>${atual.conta ? `Conta vinculada: <b>@${esc(atual.conta)}</b>` : 'Sem conta vinculada'}</span>
          <span class="ag-persona-conta-acoes">
            ${conta && atual.conta !== conta ? `<button type="button" class="ag-link" data-ag="persona-vincular">${atual.conta ? 'Trocar pra' : 'Vincular a'} @${esc(conta)}</button>` : ''}
            ${atual.conta ? `<button type="button" class="ag-link ag-link-sec" data-ag="persona-soltar">Desvincular</button>` : ''}
            ${!conta && !atual.conta ? '<span class="ag-dica-mini">Preencha o @ da conta no topo pra vincular</span>' : ''}
          </span>
        </div>
        <div class="ag-aviso" id="agPersonaProibida" ${proibida ? '' : 'hidden'}>${ico('alerta')}<span>Tem tema proibido nessa persona (escola, aluna, novinha…). Tire, senão as copies podem ser descartadas.</span></div>
        ${campo('Quem ela é <em>profissão, rotina, personalidade</em>', `<textarea class="ag-input ag-txt ag-txt-curto" data-pcampo="desc" maxlength="2000" placeholder="ex. personal trainer, mora sozinha, tímida mas curiosa...">${esc(atual.desc || '')}</textarea>`)}
        ${campo('Jeito de falar <em>gírias, tom, como chama o assinante</em>', `<textarea class="ag-input ag-txt ag-txt-curto" data-pcampo="jeito" maxlength="2000" placeholder="ex. escreve tudo minúsculo, fala &quot;mozão&quot;, usa &quot;kkkk&quot;...">${esc(atual.jeito || '')}</textarea>`)}
        ${campo('Nunca diz / nunca faz', `<input class="ag-input" data-pcampo="nunca" maxlength="1000" placeholder="ex. não usa &quot;amor&quot;, não fala de dinheiro direto" value="${val('nunca')}">`)}
        ${campo('Exemplos de como ela escreve <em>um por bloco, linha em branco entre eles</em>', `<textarea class="ag-input ag-txt ag-txt-persona" data-pcampo="exemplos" maxlength="6000" placeholder="Cole 3 ou 4 mensagens reais dela. A IA imita o estilo (não copia).">${esc(atual.exemplos || '')}</textarea>`)}
        <button type="button" class="ag-btn" data-ag="persona-testar">${ico('brilho')}<span>Testar persona (3 mensagens)</span></button>
        <div id="agPersonaTeste"></div>
      </div>` : '<div class="ag-sec"><p class="ag-vazio">Sem persona: a IA escreve no estilo geral.</p></div>'}`;
  }

  async function agTestarPersona(btn) {
    const c = ag.cfg;
    const atual = agPersonaAtual(c);
    const box = document.getElementById('agPersonaTeste');
    if (!atual || !box) return;
    const id = ag.id;
    btn.disabled = true;
    btn.innerHTML = `${ico('carregando', 'ag-gira')}<span>Gerando amostra…</span>`;
    let html;
    try {
      const r = await agGerarCopiesMassa({
        quantidade: 3, horarios: ['10:00', '15:00', '21:00'], briefing: c.briefing, prompt: agSistema(c),
        tipos: agTiposIA(c), emoji: AG_EMOJI[c.emojiCopy]?.[1], persona: agTextoPersona(atual)
      });
      html = r.erro
        ? `<div class="ag-aviso">${ico('alerta')}<span>${esc(r.erro)}</span></div>`
        : `<p class="gr-rotulo ag-amostra-rot">Amostra (não é salva)</p>${r.copies.map(t => `<div class="ag-amostra">${esc(t)}</div>`).join('')}`
          + (r.descartadas ? `<p class="ag-dica">${r.descartadas} descartada${r.descartadas === 1 ? '' : 's'} por tema proibido.</p>` : '');
    } catch (e) {
      html = `<div class="ag-aviso">${ico('alerta')}<span>${esc(e.message)}</span></div>`;
    }
    if (ag.id !== id) return;
    const b2 = document.getElementById('agPersonaTeste');
    if (b2) b2.innerHTML = html;
    if (btn.isConnected) { btn.disabled = false; btn.innerHTML = `${ico('brilho')}<span>Testar de novo</span>`; }
  }

  // ═══════════════════════════════════════════════ ABA COPY ═══

  function agFmtDia(iso, longo) {
    if (!iso) return 'Sem dia escolhido (marque na aba Quando)';
    const [Y, M, D] = iso.split('-').map(Number);
    return new Date(Y, M - 1, D).toLocaleDateString('pt-BR', longo ? { weekday: 'long', day: '2-digit', month: '2-digit' } : { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');
  }

  function agHtmlCopy() {
    const c = ag.cfg;
    const prompt = c.prompt || AG_PROMPT_PADRAO;
    return `
      ${agChave() ? '' : `<div class="ag-aviso">${ico('chave')}<span>Falta a chave da OpenRouter pra IA funcionar.</span><button type="button" class="ag-link" data-ag="config">Configurar</button></div>`}
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Copy com IA</span></div>
        <div class="ag-sub">Jeito de chamar <em>só nos horários de Aquecer</em></div>
        <div class="ag-pills">${Object.entries(AG_TIPOS_COPY).map(([id, [rot]]) => `<button type="button" class="ag-pill ${c.tiposCopy.includes(id) ? 'on' : ''}" data-tipo="${id}" aria-pressed="${c.tiposCopy.includes(id)}">${rot}</button>`).join('')}</div>
        <div class="ag-sub">Emojis</div>
        <div class="segmentado ag-seg">${Object.entries(AG_EMOJI).map(([id, [rot]]) => `<button type="button" class="${c.emojiCopy === id ? 'ativo' : ''}" data-emoji="${id}">${rot}</button>`).join('')}</div>
        <label class="ag-campo"><span>Tema (opcional)</span><input class="ag-input" data-campo="briefing" maxlength="500" placeholder="ex. foto nova de lingerie, promo no PPV..." value="${escAttr(c.briefing)}"></label>
        <div class="ag-gerar-linha">
          <button type="button" class="ag-btn ag-btn-prim" id="agGerar" data-ag="gerar"></button>
          <button type="button" class="ag-btn" id="agReais" data-ag="reais" title="Preenche os horários vazios com copys de verdade dessa modelo, que ainda não saíram">${ico('copiar')}<span>Usar copys reais do Synora</span></button>
        </div>
        <button type="button" class="ag-link ag-link-centro" id="agRefazer" data-ag="refazer" hidden>Refazer todas</button>
        <p class="ag-dica" id="agHist"></p>
        <details class="ag-detalhes">
          <summary>Prompt da IA <span class="ag-extra" id="agPromptEstado"></span></summary>
          <textarea class="ag-input ag-txt ag-txt-prompt" data-campo="prompt" spellcheck="false">${esc(prompt)}</textarea>
          <div class="ag-detalhes-acoes"><span class="ag-dica-mini">A regra de segurança (só adultas 18+) sempre vai junto, mesmo editando.</span><button type="button" class="ag-link" data-ag="prompt-restaurar">${ico('atualizar')}Restaurar padrão</button></div>
        </details>
      </div>
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Mensagens</span><span class="ag-extra" id="agMsgsInfo"></span></div>
        <p class="ag-dica">Uma mensagem por horário, na ordem em que saem. O botão de girar gera de novo só aquela. Horário vazio repete uma das outras.</p>
        <div class="ag-msgs" id="agMsgs">${agHtmlMensagens()}</div>
        <details class="ag-detalhes" id="agColarBox">
          <summary>Colar várias de uma vez</summary>
          <textarea class="ag-input ag-txt ag-txt-msgs" id="agColar" placeholder="Uma por bloco, separadas por linha em branco. Preenche os horários na ordem, do primeiro ao último."></textarea>
          <div class="ag-detalhes-acoes"><span></span><button type="button" class="ag-btn" data-ag="colar">Preencher horários</button></div>
        </details>
      </div>`;
  }

  function agHtmlMensagens() {
    const c = ag.cfg;
    const slots = agSlotsTexto(c);
    const mapa = agMsgsMapa(c);
    if (!slots.length) {
      return agHorariosValidos(c.horarios, c.limiteDia).length
        ? '<p class="ag-vazio">Todos os horários são de pack/vídeo: o texto vai o do próprio pacote.</p>'
        : '<p class="ag-vazio">Marque dias e horários na aba Quando.</p>';
    }
    let diaAtual = null;
    return slots.map((s) => {
      const cab = s.dia !== diaAtual ? `<div class="ag-msg-dia">${esc(agFmtDia(s.dia))}</div>` : '';
      diaAtual = s.dia;
      const texto = agMsgDoHorario(mapa, s);
      const ruim = !!texto && temaProibido(texto);
      return cab + `<div class="ag-msg ${ruim ? 'proibida' : ''}" data-assunto="${s.assunto}" data-chave="${escAttr(agChaveMsg(s))}">
        <div class="ag-msg-meta"><b>${s.hora}</b><span class="ag-tag"><i></i>${esc(AG_ASSUNTOS[s.assunto][0])}</span>
          <span class="ag-badge-proibida">${ico('alerta')}Tema proibido · fica fora da fila</span>
          <button type="button" class="ag-ico ag-ico-p" data-ag="refazer-um" title="Gerar de novo só esta" aria-label="Gerar de novo só esta">${ico('atualizar')}</button></div>
        <textarea class="ag-input ag-txt ag-msg-txt" rows="2" data-msg placeholder="Vazio: vai repetir uma das outras">${esc(texto)}</textarea>
      </div>`;
    }).join('');
  }

  function agRenderMensagens() {
    const box = document.getElementById('agMsgs');
    if (box) box.innerHTML = agHtmlMensagens();
    agAtualizar();
  }

  function agAtualizarCopyInfo() {
    const c = ag.cfg;
    if (!c) return;
    const slots = agSlotsTexto(c);
    const mapa = agMsgsMapa(c);
    const comTexto = slots.filter(s => agMsgDoHorario(mapa, s)).length;
    const vazios = slots.length - comTexto;
    const proibidas = slots.filter(s => { const t = agMsgDoHorario(mapa, s); return t && temaProibido(t); }).length;
    const info = document.getElementById('agMsgsInfo');
    if (info) {
      info.textContent = slots.length ? `${comTexto} de ${slots.length} com texto${proibidas ? ` · ${proibidas} com tema proibido` : ''}` : '';
      info.classList.toggle('ag-txt-aviso', (!!vazios && comTexto > 0) || !!proibidas);
    }
    const btn = document.getElementById('agGerar');
    if (btn && !ag.gerando) {
      btn.disabled = false;
      if (!slots.length) btn.innerHTML = `${ico('brilho')}<span>Gerar copies</span>`;
      else if (!comTexto) btn.innerHTML = `${ico('brilho')}<span>Gerar ${slots.length} ${slots.length === 1 ? 'copy' : 'copies'}</span>`;
      else if (vazios) btn.innerHTML = `${ico('brilho')}<span>Gerar ${vazios === 1 ? 'o horário vazio' : `os ${vazios} vazios`}</span>`;
      else btn.innerHTML = `${ico('atualizar')}<span>Refazer todas (${slots.length})</span>`;
    }
    const reais = document.getElementById('agReais');
    if (reais) reais.disabled = ag.gerando || !vazios;
    const refazer = document.getElementById('agRefazer');
    if (refazer) refazer.hidden = !(comTexto && vazios) || ag.gerando;
    const hist = (c.historicoCopies || []).length;
    const h = document.getElementById('agHist');
    if (h) h.innerHTML = hist ? `A IA evita repetir as últimas ${hist} copies que já foram pra fila. <button type="button" class="ag-link" data-ag="hist-limpar">Limpar</button>` : '';
    const pe = document.getElementById('agPromptEstado');
    if (pe) pe.textContent = c.prompt ? '· editado' : '· padrão';
  }

  async function agGerar(todas) {
    const c = ag.cfg;
    if (!c || ag.gerando) return;
    const slots = agSlotsTexto(c);
    if (!slots.length) {
      return agStatus(agHorariosValidos(c.horarios, c.limiteDia).length
        ? 'Todos os horários são de pack: o texto vai o do próprio pacote, não precisa gerar.'
        : 'Marque dias e horários na aba Quando.', 'aviso');
    }
    const mapa = agMsgsMapa(c);
    const nCom = slots.filter(s => agMsgDoHorario(mapa, s)).length;
    if (todas === undefined) todas = !nCom || nCom === slots.length;
    if (todas && nCom && !confirm(`Refazer as ${slots.length} mensagens?\nAs ${nCom} que você já tem (inclusive as que editou) vão ser substituídas.`)) return;
    const alvo = todas ? slots : slots.filter(s => !agMsgDoHorario(mapa, s));
    const id = ag.id;
    ag.gerando = true;
    const rotular = (t) => { const b = document.getElementById('agGerar'); if (b) { b.disabled = true; b.innerHTML = `${ico('carregando', 'ag-gira')}<span>${esc(t)}</span>`; } };
    rotular(`Gerando ${alvo.length} copies…`);
    agAtualizarCopyInfo();
    agStatus('');
    try {
      const r = await agPedirCopies(c, alvo, todas ? [] : agMsgsPool(mapa), (feitas, total) => { if (ag.id === id && feitas) rotular(`Gerando copies… ${feitas} de ${total}`); });
      if (ag.id !== id || ag.cfg !== c) return;
      if (r.erro) agStatus(r.erro, 'erro');
      else {
        if (todas) {
          const hoje = agDataISO(new Date());
          for (const k of Object.keys(mapa)) if (k.startsWith('extra') || (/^\d{4}-/.test(k) && k.slice(0, 10) < hoje)) delete mapa[k];
        }
        r.copies.forEach((t, i) => { if (alvo[i]) mapa[agChaveMsg(alvo[i])] = t; });
        c.mensagens = '';
        const desc = r.descartadas ? ` · ${r.descartadas} descartada${r.descartadas === 1 ? '' : 's'} por tema proibido` : '';
        agStatus((r.aviso || `${r.copies.length} copies geradas: revise e clique em Programar`) + desc, r.aviso ? 'aviso' : 'ok');
        agSalvar();
      }
    } catch (e) {
      if (ag.id === id) agStatus(e.message, 'erro');
    } finally {
      if (ag.id === id) {
        ag.gerando = false;
        if (ag.aba === 'copy') agRenderMensagens();
        else agAtualizar();
      }
    }
  }

  async function agRefazerUm(btn) {
    const box = btn.closest('[data-chave]');
    const c = ag.cfg;
    const slot = agSlotsTexto(c).find(s => agChaveMsg(s) === box.dataset.chave);
    if (!slot) return;
    const id = ag.id;
    btn.disabled = true;
    btn.innerHTML = ico('carregando', 'ag-gira');
    try {
      const r = await agPedirCopies(c, [slot], agMsgsPool(agMsgsMapa(c)));
      if (ag.id !== id || ag.cfg !== c) return;
      if (r.erro) agStatus(r.erro, 'erro');
      else if (r.copies?.[0]) {
        agMsgsMapa(c)[box.dataset.chave] = r.copies[0];
        const ta = box.querySelector('textarea');
        if (ta) ta.value = r.copies[0];
        box.classList.toggle('proibida', temaProibido(r.copies[0]));
        agSalvar();
      }
    } catch (e) {
      agStatus(e.message, 'erro');
    }
    if (btn.isConnected) { btn.disabled = false; btn.innerHTML = ico('atualizar'); }
  }

  function agColar() {
    const c = ag.cfg;
    const ta = document.getElementById('agColar');
    const textos = agSepararMensagens(ta.value);
    if (!textos.length) return;
    const slots = agSlotsTexto(c);
    if (!slots.length) return agStatus('Marque dias e horários na aba Quando.', 'aviso');
    const mapa = agMsgsMapa(c);
    slots.forEach((s, i) => { if (textos[i]) mapa[agChaveMsg(s)] = textos[i]; });
    textos.slice(slots.length).forEach((t, i) => { mapa[`extra ${Date.now()}-${i}`] = t; });
    const proib = textos.filter(t => temaProibido(t)).length;
    ta.value = '';
    agSalvar();
    agRenderAba();
    agStatus(`${Math.min(textos.length, slots.length)} horários preenchidos`
      + (textos.length > slots.length ? ` · ${textos.length - slots.length} sobraram e entram no rodízio` : '')
      + (proib ? ` · ${proib} com tema proibido (não vão pra fila)` : ''), proib ? 'aviso' : 'ok');
  }

  // Melhoria do site: preenche os horários vazios com copys reais da modelo (que ainda não saíram)
  function agUsarReais() {
    const c = ag.cfg;
    const slots = agSlotsTexto(c);
    if (!slots.length) return agStatus('Marque dias e horários na aba Quando.', 'aviso');
    const mapa = agMsgsMapa(c);
    const vazios = slots.filter(s => !agMsgDoHorario(mapa, s));
    if (!vazios.length) return agStatus('Todos os horários já têm texto. Apague algum pra preencher com copy real.', 'aviso');
    const fora = new Set([...(c.historicoCopies || []), ...agMsgsPool(mapa)].map(t => normTexto(blocoCopy(t))));
    const vistos = new Set();
    const reais = embaralhar(copysDaModelo(ag.modelo)
      .map(x => ({ t: blocoCopy(x.texto || ''), preco: precoCopy(x.preco) }))
      .filter(x => {
        const k = normTexto(x.t);
        if (!x.t || fora.has(k) || vistos.has(k) || temaProibido(x.t)) return false;
        vistos.add(k);
        return true;
      }));
    const semPreco = reais.filter(x => !x.preco);
    const comPreco = reais.filter(x => x.preco);
    let n = 0;
    for (const s of vazios) {
      // Aquecer prefere copy sem preço (não é venda); o resto prefere as de venda
      const ordem = s.assunto === 'aquecimento' ? [semPreco, comPreco] : [comPreco, semPreco];
      const lista = ordem.find(l => l.length);
      if (!lista) break;
      mapa[agChaveMsg(s)] = lista.shift().t;
      n++;
    }
    if (!n) return agStatus('Não sobrou copy real dessa modelo que ainda não saiu. Gere com a IA.', 'aviso');
    agSalvar();
    agRenderMensagens();
    agStatus(`${n} ${n === 1 ? 'horário preenchido' : 'horários preenchidos'} com copys reais${n < vazios.length ? ` · faltaram ${vazios.length - n} (não tem mais copy nova dela)` : ''}`, n < vazios.length ? 'aviso' : 'ok');
  }

  // ═══════════════════════════════════════════════ ABA ROTEIRO ═══

  const agHoraCurta = (h) => h.endsWith(':00') ? h.slice(0, 2) + 'h' : h;
  const agRotuloSeq = (seq) => seq.split(',').map(a => AG_ASSUNTOS[a][0]).join(' → ');

  function agHtmlRoteiro() {
    const c = ag.cfg;
    const horasDia = agHorariosValidos(c.horarios, c.limiteDia);
    const assuntos = horasDia.map(h => agAssuntoDaHora(c, h));
    const semPacote = (a) => !!AG_ACERVO_PROX[a] && !agListaPacotes(c, a).length;
    const ativo = horasDia.length ? AG_MODELOS_ROTEIRO.find((seq) => {
      const dist = agDistribuirRoteiro(seq.split(','), horasDia);
      return horasDia.every((h, i) => dist[h] === assuntos[i]);
    }) : null;
    const contagem = [...new Set(assuntos)].map(a => [a, assuntos.filter(x => x === a).length]);
    const usamOferta = Object.keys(AG_ASSUNTOS).filter(a => a !== 'aquecimento' && !AG_ACERVO_PROX[a] && assuntos.includes(a));
    return `
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Roteiro do dia</span>
          ${assuntos.some(a => a !== 'aquecimento') ? `<button type="button" class="ag-link" data-ag="roteiro-limpar" title="Volta todos os horários pra Aquecer">${ico('atualizar')}Limpar</button>` : ''}
        </div>
        <div class="ag-sub">Modelos prontos ${horasDia.length && !ativo ? '<em>personalizado</em>' : ''}</div>
        <div class="ag-pills">${AG_MODELOS_ROTEIRO.map(seq => `<button type="button" class="ag-pill ag-pill-seq ${ativo === seq ? 'on' : ''}" data-roteiro="${seq}">${seq.split(',').map(a => `<i class="ag-ponto" data-assunto="${a}"></i>`).join('')}<span>${seq === 'aquecimento' ? 'Só aquecer' : esc(agRotuloSeq(seq))}</span></button>`).join('')}</div>
        ${horasDia.length ? `
          <div class="ag-faixa">${horasDia.map((h, i) => `<span data-assunto="${assuntos[i]}" title="${escAttr(agHoraCurta(h) + ' · ' + AG_ASSUNTOS[assuntos[i]][0])}"></span>`).join('')}</div>
          <div class="ag-contagem">${contagem.map(([a, n]) => `<span data-assunto="${a}"><i class="ag-ponto"></i>${n} ${esc(AG_ASSUNTOS[a][0])}</span>`).join('')}</div>` : ''}
        <div class="ag-roteiro">${horasDia.length ? horasDia.map((h, i) => {
          const atual = assuntos[i];
          const aberta = h === ag.roteiroAberto;
          const falta = semPacote(atual);
          return `<div class="ag-rot-linha ${aberta ? 'aberta' : ''}" data-assunto="${atual}">
            <span class="ag-rot-hora">${agHoraCurta(h)}</span>
            <button type="button" class="ag-rot-chip ${falta ? 'falta' : ''}" data-rot-abrir="${h}" aria-expanded="${aberta}" ${falta ? 'title="Nenhum pacote marcado no registro (aba Pacotes)"' : ''}>
              <i class="ag-ponto"></i><span>${esc(AG_ASSUNTOS[atual][0])}</span>${falta ? ico('alerta') : ''}${ico('seta', 'ag-rot-seta')}
            </button>
            ${aberta ? `<div class="ag-rot-opcoes">${Object.entries(AG_ASSUNTOS).map(([id, [rot]]) => `<button type="button" class="ag-rot-op ${id === atual ? 'on' : ''}" data-assunto="${id}" data-rot-h="${h}" data-rot-a="${id}"><i class="ag-ponto"></i>${esc(rot)}</button>`).join('')}</div>` : ''}
          </div>`;
        }).join('') : '<p class="ag-vazio">Marque os horários na aba Quando.</p>'}</div>
        <label class="ag-campo" ${usamOferta.length ? '' : 'hidden'}><span>Detalhe da oferta <em>usado em ${esc(usamOferta.map(a => AG_ASSUNTOS[a][0]).join(', '))}</em></span>
          <input class="ag-input" data-campo="oferta" maxlength="500" placeholder="ex. chamada 10min R$50, 30% off até domingo" value="${escAttr(c.oferta)}">
        </label>
      </div>`;
  }

  // ═══════════════════════════════════════════════ ABA PACOTES ═══

  function agHtmlPacotes() {
    const c = ag.cfg;
    const nome = esc(nomeModelo(ag.modelo).split(/\s+/)[0]);
    const linhas = c.pacotesReg.map((p, i) => `
      <div class="ag-pacote ${p.usar ? '' : 'desligado'}" data-pi="${i}">
        <label class="ag-pacote-usar" title="Entra no rodízio"><input type="checkbox" class="ag-check" data-pc="usar" ${p.usar ? 'checked' : ''} aria-label="Entra no rodízio"></label>
        <button type="button" class="ag-tipo" data-ag="pacote-tipo" title="${p.tipo === 'video' ? 'Vídeo único' : 'Pack'} (clique pra trocar)" aria-label="Trocar tipo">${ico(p.tipo === 'video' ? 'video' : 'pacote')}<span>${p.tipo === 'video' ? 'Vídeo' : 'Pack'}</span></button>
        <div class="ag-pacote-campos">
          <input class="ag-input" data-pc="apelido" maxlength="80" placeholder="Apelido (como aparece na copy)" value="${escAttr(p.apelido)}" aria-label="Apelido">
          <div class="ag-pacote-sub">
            <input class="ag-input" data-pc="preco" maxlength="20" placeholder="R$ 39,99" value="${escAttr(p.preco)}" aria-label="Preço">
            <input class="ag-input" data-pc="nome" maxlength="200" placeholder="Nome no Acervo" value="${escAttr(p.nome)}" title="${escAttr('Nome no Acervo: ' + p.nome)}" aria-label="Nome no Acervo">
          </div>
        </div>
        <button type="button" class="ag-ico ag-perigo" data-ag="pacote-apagar" title="Apagar pacote" aria-label="Apagar pacote">${ico('lixo')}</button>
      </div>`).join('');
    const horasDia = agHorariosValidos(c.horarios, c.limiteDia);
    const assuntos = horasDia.map(h => agAssuntoDaHora(c, h));
    const prox = Object.keys(AG_ACERVO_PROX).filter(a => assuntos.includes(a)).map((a) => {
      const lista = agListaPacotes(c, a);
      return `<div class="ag-prox" data-assunto="${a}"><i class="ag-ponto"></i><span>${lista.length
        ? `${esc(lista.map(agRotuloPacote).join(' → '))} · próximo: <b>${esc(agRotuloPacote(lista[agProxRodizio(c, a) % lista.length]))}</b>`
        : `Marque pelo menos um ${a === 'video' ? 'vídeo' : 'pack'} no registro`}</span></div>`;
    }).join('');
    const ac = ag.acervo;
    const itensAc = agItensAcervo();
    let acervo;
    if (ac === undefined) acervo = `<div class="ag-acervo off">${ico('carregando', 'ag-gira')}<span>Olhando o Acervo…</span></div>`;
    else if (!ac || !itensAc.length) acervo = `<div class="ag-acervo off">${ico('pacote')}<span>${ag.acervoMsg ? esc(ag.acervoMsg) : 'Abra a Privacy dessa modelo com o Agendador pra puxar os pacotes do Acervo'}</span></div>`;
    else {
      const em = agDataTs(ac.em);
      acervo = `<div class="ag-acervo">${ico('pacote')}<span>${itensAc.length} ${itensAc.length === 1 ? 'pacote' : 'pacotes'} no Acervo${em ? ` · lido ${esc(em)}` : ''}</span><button type="button" class="ag-btn" data-ag="acervo">${ico('atualizar')}<span>Atualizar do Acervo</span></button></div>`;
    }
    return `
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Registro de pacotes de ${nome}</span></div>
        <p class="ag-dica">Marque os que entram no rodízio. O nome tem que ser igual ao do Acervo › Pacotes.</p>
        <div class="ag-pacotes">${linhas || `<p class="ag-vazio">Nenhum pacote de ${nome} ainda. Use os botões abaixo.</p>`}</div>
        <div class="ag-pills">
          <button type="button" class="ag-pill ag-pill-add" data-ag="pacote-novo" data-tipo-novo="pack">${ico('mais')}Pack</button>
          <button type="button" class="ag-pill ag-pill-add" data-ag="pacote-novo" data-tipo-novo="video">${ico('mais')}Vídeo</button>
        </div>
        ${prox ? `<div class="ag-proxs">${prox}</div>` : '<p class="ag-dica-mini">Nenhum horário de Pack ou Vídeo no roteiro.</p>'}
      </div>
      <div class="ag-sec">
        <div class="ag-sec-head"><span class="gr-rotulo">Acervo da Privacy</span></div>
        ${acervo}
        <p class="ag-dica" id="agAcervoStatus"></p>
      </div>`;
  }

  function agItensAcervo() {
    const ac = ag.acervo;
    if (!ac || !Array.isArray(ac.itens)) return [];
    return ac.itens
      .filter(x => agObj(x) && typeof x.nome === 'string' && x.nome.trim())
      .map(x => ({ nome: x.nome.trim().slice(0, 200), preco: (typeof x.preco === 'string' || typeof x.preco === 'number') ? String(x.preco).slice(0, 20) : '' }));
  }

  async function agCarregarAcervo(id) {
    let dados = null;
    try {
      const s = await db.collection('agenda_acervo').doc(id).get();
      dados = s.exists ? s.data() : null;
      if (ag.id === id) ag.acervoMsg = '';
    } catch (e) {
      if (ag.id === id) ag.acervoMsg = agEhPermissao(e) ? 'O Acervo ainda não foi liberado no Firebase.' : 'Não deu pra ler o Acervo agora.';
      console.error('[agenda acervo]', e);
    }
    if (ag.id !== id) return;
    const mudou = ag.acervo === undefined || JSON.stringify(dados) !== JSON.stringify(ag.acervo);
    ag.acervo = dados;
    if (mudou && ag.aba === 'pacotes' && ag.cfg) agRenderAba();
  }

  function agSyncAcervo() {
    const c = ag.cfg;
    const lidos = agItensAcervo();
    let novos = 0, atualizados = 0;
    for (const { nome, preco } of lidos) {
      const existente = c.pacotesReg.find(p => (p.nome || '').trim().toLowerCase() === nome.toLowerCase());
      if (existente) {
        if (preco && existente.preco !== preco) { existente.preco = preco; atualizados++; }
      } else {
        c.pacotesReg.push({ tipo: 'pack', apelido: nome.slice(0, 30), preco, nome, usar: false });
        novos++;
      }
    }
    agSalvar();
    agRenderAba();
    const st = document.getElementById('agAcervoStatus');
    if (st) st.textContent = novos || atualizados
      ? `${novos} novo(s) adicionado(s) (desmarcados: revise e marque os que quer no rodízio), ${atualizados} preço(s) atualizado(s).`
      : 'Já estava tudo igual ao Acervo.';
  }

  // ═══════════════════════════════════════════════ PRÉVIA + FILA ═══

  function agAbrirFolha(html, classe) {
    agFecharFolha();
    const fundo = document.createElement('div');
    fundo.className = 'ag-folha-fundo';
    fundo.id = 'agFolha';
    fundo.innerHTML = `<div class="ag-folha ${classe || ''}" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(fundo);
    document.body.classList.add('ag-folha-aberta');
    fundo.addEventListener('click', agCliqueFolha);
    fundo.addEventListener('mousedown', (e) => { fundo.dataset.fora = e.target === fundo ? '1' : ''; });
    const foco = fundo.querySelector('[data-foco]') || fundo.querySelector('button');
    if (foco) foco.focus();
    return fundo;
  }
  function agFecharFolha() {
    const f = document.getElementById('agFolha');
    if (f) f.remove();
    document.body.classList.remove('ag-folha-aberta');
    ag.previa = null;
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.getElementById('agFolha')) agFecharFolha(); });

  function agAbrirPrevia() {
    const c = ag.cfg;
    if (!c) return;
    const prep = agPreparar(c);
    if (prep.erro) {
      agStatus(prep.erro, 'aviso');
      return;
    }
    agStatus('');
    const porDia = new Map();
    prep.itens.forEach(it => { if (!porDia.has(it.dia)) porDia.set(it.dia, []); porDia.get(it.dia).push(it); });
    const n = prep.itens.length;
    const nTexto = prep.itens.filter(it => !it.pack).length;
    const pers = agPersonaAtual(c);
    const avisos = [];
    if (c.teste) avisos.push('Modo teste: só o primeiro disparo vai pra fila.');
    if (!c.contaPrivacy) avisos.push('Sem o @ da conta no topo: a extensão não vai conseguir conferir se tá logada na modelo certa.');
    if (pers?.conta && c.contaPrivacy && pers.conta !== c.contaPrivacy) avisos.push(`A persona ${pers.nome} é da conta @${pers.conta}, mas essa agenda é da @${c.contaPrivacy}.`);
    if (prep.bloqueadas) avisos.push(`${prep.bloqueadas} ${prep.bloqueadas === 1 ? 'mensagem tem' : 'mensagens têm'} tema proibido e ficaram de fora: o horário repete outra mensagem.`);
    if (prep.semPropria) avisos.push(`${prep.semPropria} de ${nTexto} horários não têm mensagem própria: vão repetir outras em rodízio.`);
    const html = `
      <div class="ag-folha-topo">
        <div>
          <div class="ag-folha-titulo">${ico('olho')}Prévia da programação</div>
          <div class="ag-folha-sub">${n} ${n === 1 ? 'disparo' : 'disparos'} em ${porDia.size} ${porDia.size === 1 ? 'dia' : 'dias'} · ${esc(nomeModelo(ag.modelo))}${c.contaPrivacy ? ` (@${esc(c.contaPrivacy)})` : ''} · ${esc(pers?.nome || 'sem persona')}</div>
        </div>
        <button type="button" class="ag-ico" data-folha="fechar" title="Voltar" aria-label="Fechar">${ico('fechar')}</button>
      </div>
      <div class="ag-folha-corpo">
        ${avisos.map(a => `<div class="ag-aviso">${ico('alerta')}<span>${esc(a)}</span></div>`).join('')}
        ${[...porDia].map(([dia, itens]) => `
          <div class="ag-previa-dia">${esc(agFmtDia(dia, true))}</div>
          ${itens.map((it) => {
            const a = agAssuntoDaHora(c, it.hora);
            return `<div class="ag-previa-item" data-assunto="${a}">
              <div class="ag-previa-meta"><b>${it.hora}</b><span class="ag-tag"><i></i>${esc(AG_ASSUNTOS[a][0])}</span></div>
              <div class="ag-previa-texto">${it.pack
                ? `${ico(it.pack.tipo === 'video' ? 'video' : 'pacote')}${esc(agRotuloPacote(it.pack))} <span class="ag-previa-nota">· texto do próprio pacote</span>`
                : esc(it.mensagem)}</div>
            </div>`;
          }).join('')}`).join('')}
      </div>
      <div class="ag-folha-rodape">
        <button type="button" class="ag-btn" data-folha="fechar">Voltar e ajustar</button>
        <button type="button" class="gr-sortear ag-btn-fila" data-folha="mandar" data-foco>${ico(c.teste ? 'frasco' : 'enviar')}<span>${c.teste ? 'Mandar teste pra fila' : 'Mandar pra fila'}</span></button>
      </div>`;
    agAbrirFolha(html, 'ag-folha-previa');
    ag.previa = { prep, id: ag.id, cfg: c };
  }

  async function agMandarFila(btn) {
    const pv = ag.previa;
    if (!pv || ag.mandando) return;
    if (pv.id !== ag.id || pv.cfg !== ag.cfg) { agFecharFolha(); return; }
    const u = agUser();
    if (!u) { toast('Entre de novo pra mandar pra fila'); return; }
    const c = pv.cfg;
    const { prep } = pv;
    const itens = prep.itens.map(it => ({
      dia: it.dia,
      hora: it.hora,
      mensagem: it.mensagem || '',
      pack: it.pack ? { tipo: it.pack.tipo, apelido: it.pack.apelido, preco: it.pack.preco, nome: it.pack.nome } : null
    }));
    const doc = {
      modelo: ag.modelo,
      modeloId: ag.id,
      contaPrivacy: c.contaPrivacy || '',
      itens,
      teste: !!c.teste,
      limiteDia: c.limiteDia,
      total: itens.length,
      status: 'pendente',
      ok: 0,
      falhas: [],
      criadoEm: firebase.firestore.FieldValue.serverTimestamp(),
      criadoPor: { uid: u.uid || '', nome: u.displayName || u.email || '' }
    };
    ag.mandando = true;
    btn.disabled = true;
    btn.innerHTML = `${ico('carregando', 'ag-gira')}<span>Mandando…</span>`;
    const modelo = ag.modelo;
    try {
      await db.collection('agenda_fila').add(doc);
    } catch (e) {
      ag.mandando = false;
      if (btn.isConnected) { btn.disabled = false; btn.innerHTML = `${ico('enviar')}<span>Tentar de novo</span>`; }
      agErroFirebase(e, 'mandar pra fila');
      agAtualizarRodape();
      return;
    }
    ag.mandando = false;
    // Só depois de gravar: rodízio de pacotes + histórico (modo teste não mexe, igual à extensão)
    if (!c.teste) {
      for (const assunto of Object.keys(AG_ACERVO_PROX)) {
        const n = agListaPacotes(c, assunto).length;
        if (n && prep.usados[assunto]) c[AG_ACERVO_PROX[assunto]] = (agProxRodizio(c, assunto) + prep.usados[assunto]) % n;
      }
      c.historicoCopies = [...new Set([...(c.historicoCopies || []), ...itens.map(it => it.mensagem).filter(Boolean)])].slice(-AG_HISTORICO_MAX);
    }
    if (ag.cfg === c) { agSalvar(); agFlushSalvar(); }
    registrarAtividade('Mandou disparos pra fila', `${modelo} · ${itens.length} disparos`);
    agFecharFolha();
    toast(c.teste ? 'Teste mandado pra fila' : `${itens.length} ${itens.length === 1 ? 'disparo mandado' : 'disparos mandados'} pra fila`);
    agStatus(`Na fila: a extensão agenda quando abrir a Privacy${c.contaPrivacy ? ` da @${c.contaPrivacy}` : ' dessa modelo'}.`, 'ok');
    if (ag.aba === 'copy' || ag.aba === 'pacotes') agRenderAba();
    agAtualizarRodape();
  }

  function agOuvirFila(id) {
    if (ag.unsubFila) { try { ag.unsubFila(); } catch (e) { /* ignora */ } ag.unsubFila = null; }
    ag.fila = [];
    ag.filaErro = '';
    ag.filaCarregada = false;
    agRenderFila();
    const tempo = (d) => {
      const t = d.criadoEm;
      if (t && typeof t.toMillis === 'function') return t.toMillis();
      if (t && t.seconds) return t.seconds * 1000;
      return Date.now();
    };
    try {
      ag.unsubFila = db.collection('agenda_fila').where('modeloId', '==', id).onSnapshot((snap) => {
        if (ag.id !== id) return;
        ag.fila = snap.docs.map(d => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }))
          .sort((a, b) => tempo(b) - tempo(a)).slice(0, 20);
        ag.filaErro = '';
        ag.filaCarregada = true;
        agRenderFila();
      }, (e) => {
        if (ag.id !== id) return;
        console.error('[agenda fila]', e);
        ag.filaErro = agEhPermissao(e) ? 'A fila ainda não foi liberada no Firebase.' : 'Não deu pra ler a fila agora.';
        ag.filaCarregada = true;
        agRenderFila();
      });
    } catch (e) {
      ag.filaErro = 'Não deu pra ler a fila agora.';
      ag.filaCarregada = true;
      agRenderFila();
    }
  }

  function agDataTs(t) {
    let ms = null;
    if (t && typeof t.toMillis === 'function') ms = t.toMillis();
    else if (t && t.seconds) ms = t.seconds * 1000;
    else if (typeof t === 'number') ms = t;
    else if (typeof t === 'string' && !isNaN(Date.parse(t))) ms = Date.parse(t);
    if (!ms) return '';
    const d = new Date(ms);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  const AG_STATUS_FILA = {
    pendente: ['pendente', 'Pendente'],
    agendando: ['agendando', 'Agendando'],
    concluido: ['concluido', 'Concluído'],
    'concluído': ['concluido', 'Concluído'],
    ok: ['concluido', 'Concluído'],
    erro: ['erro', 'Com erro'],
    falhou: ['erro', 'Com erro']
  };

  function agRenderFila() {
    const box = document.getElementById('agFila');
    if (!box) return;
    if (!ag.cfg && !ag.filaCarregada) { box.innerHTML = '<p class="ag-vazio">…</p>'; return; }
    if (ag.filaErro) { box.innerHTML = `<div class="ag-aviso">${ico('alerta')}<span>${esc(ag.filaErro)}</span></div>`; return; }
    if (!ag.filaCarregada) { box.innerHTML = `<p class="ag-vazio">${ico('carregando', 'ag-gira')} Carregando a fila…</p>`; return; }
    if (!ag.fila.length) { box.innerHTML = '<p class="ag-vazio">Nada na fila dessa modelo ainda. Programe acima e mande pra fila.</p>'; return; }
    box.innerHTML = ag.fila.map((d) => {
      const [st, rot] = AG_STATUS_FILA[String(d.status || '').toLowerCase()] || ['pendente', String(d.status || 'Pendente')];
      const itens = Array.isArray(d.itens) ? d.itens : [];
      const diasF = [...new Set(itens.map(it => it && it.dia).filter(Boolean))].sort();
      const periodo = diasF.length ? (diasF.length === 1 ? agFmtCurto(diasF[0]) : `${agFmtCurto(diasF[0])} → ${agFmtCurto(diasF[diasF.length - 1])}`) : '';
      const total = Number(d.total) || itens.length;
      const falhas = Array.isArray(d.falhas) ? d.falhas.filter(f => typeof f === 'string') : [];
      return `<div class="ag-fila-item" data-fila="${escAttr(d.id)}">
        <div class="ag-fila-linha">
          <span class="ag-chip" data-st="${st}">${esc(rot)}</span>
          <span class="ag-fila-info"><b>${total} ${total === 1 ? 'disparo' : 'disparos'}</b>${periodo ? ` · ${esc(periodo)}` : ''}${d.teste ? ' · teste' : ''}</span>
          ${st === 'pendente' ? `<button type="button" class="ag-link ag-perigo-txt" data-ag="fila-cancelar">Cancelar</button>` : ''}
        </div>
        <div class="ag-fila-meta">${esc(agDataTs(d.criadoEm))}${d.criadoPor?.nome ? ` · ${esc(d.criadoPor.nome)}` : ''}${st !== 'pendente' ? ` · ${Number(d.ok) || 0} de ${total} ok` : ''}${falhas.length ? ` · ${falhas.length} com problema` : ''}</div>
        ${falhas.length ? `<pre class="ag-fila-falhas">${esc(agResumoFalhas(falhas))}</pre>` : ''}
      </div>`;
    }).join('');
  }
  function agFmtCurto(iso) { const p = String(iso).split('-'); return p.length === 3 ? `${p[2]}/${p[1]}` : String(iso); }

  async function agCancelarFila(id) {
    const d = ag.fila.find(x => x.id === id);
    if (!d) return;
    if (!confirm(`Cancelar esses ${Number(d.total) || 0} disparos? Eles saem da fila e a extensão não agenda mais.`)) return;
    try {
      await db.collection('agenda_fila').doc(id).delete();
      toast('Tirado da fila');
      registrarAtividade('Cancelou disparos da fila', `${ag.modelo} · ${Number(d.total) || 0} disparos`);
    } catch (e) {
      agErroFirebase(e, 'cancelar');
    }
  }

  // ═══════════════════════════════════════════════ CONFIG DA IA ═══

  function agAbrirConfig() {
    const chave = agChave();
    let modelo = '';
    try { modelo = localStorage.getItem(AG_LS_MODELO_IA) || ''; } catch (e) { /* ignora */ }
    const html = `
      <div class="ag-folha-topo">
        <div>
          <div class="ag-folha-titulo">${ico('engrenagem')}IA da Agenda</div>
          <div class="ag-folha-sub">Fica salvo só neste navegador (não vai pro Firebase nem pro backup)</div>
        </div>
        <button type="button" class="ag-ico" data-folha="fechar" title="Fechar" aria-label="Fechar">${ico('fechar')}</button>
      </div>
      <div class="ag-folha-corpo">
        <label class="ag-campo"><span>Chave da OpenRouter <em>crie em openrouter.ai → Keys</em></span>
          <span class="ag-linha-input">
            <input class="ag-input" id="agCfgChave" type="password" autocomplete="off" spellcheck="false" placeholder="sk-or-v1-..." value="${escAttr(chave)}" data-foco>
            <button type="button" class="ag-ico" data-folha="ver" title="Mostrar / esconder" aria-label="Mostrar ou esconder a chave">${ico('olho')}</button>
          </span>
        </label>
        <p class="ag-dica">Não mande pra ninguém: quem tiver a chave gasta seus créditos.</p>
        <label class="ag-campo"><span>Modelo da IA <em>id na OpenRouter</em></span>
          <input class="ag-input" id="agCfgModelo" spellcheck="false" placeholder="${escAttr(AG_MODELO_IA)}" value="${escAttr(modelo)}">
        </label>
        <p class="ag-dica" id="agCfgStatus" aria-live="polite"></p>
      </div>
      <div class="ag-folha-rodape">
        <button type="button" class="ag-btn" data-folha="testar">Testar chave</button>
        <button type="button" class="gr-sortear ag-btn-fila" data-folha="salvar-ia">${ico('chave')}<span>Salvar</span></button>
      </div>`;
    agAbrirFolha(html, 'ag-folha-config');
  }

  async function agTestarChaveUI() {
    const st = document.getElementById('agCfgStatus');
    const chave = (document.getElementById('agCfgChave').value || '').trim();
    st.dataset.tipo = '';
    st.textContent = 'Testando…';
    const r = await agTestarChave(chave);
    const usd = (v) => v == null ? '—' : 'US$ ' + Number(v).toFixed(2);
    if (!st.isConnected) return;
    st.dataset.tipo = r.erro ? 'erro' : 'ok';
    st.textContent = r.erro ? r.erro
      : `Chave funcionando · uso ${usd(r.uso)}${r.limite != null ? ` · limite ${usd(r.limite)} · resta ${usd(r.restante)}` : ' · sem limite de crédito na chave'}`;
  }

  async function agCliqueFolha(e) {
    const fundo = e.currentTarget;
    if (e.target === fundo && fundo.dataset.fora === '1') { agFecharFolha(); return; }
    const b = e.target.closest('[data-folha]');
    if (!b) return;
    const acao = b.dataset.folha;
    if (acao === 'fechar') agFecharFolha();
    else if (acao === 'mandar') agMandarFila(b);
    else if (acao === 'ver') { const i = document.getElementById('agCfgChave'); i.type = i.type === 'password' ? 'text' : 'password'; }
    else if (acao === 'testar') agTestarChaveUI();
    else if (acao === 'salvar-ia') {
      const chave = (document.getElementById('agCfgChave').value || '').trim();
      const mod = (document.getElementById('agCfgModelo').value || '').trim();
      try {
        if (chave) localStorage.setItem(AG_LS_CHAVE, chave); else localStorage.removeItem(AG_LS_CHAVE);
        if (mod) localStorage.setItem(AG_LS_MODELO_IA, mod); else localStorage.removeItem(AG_LS_MODELO_IA);
      } catch (err) { toast('Não deu pra salvar neste navegador'); return; }
      if (ag.aba === 'copy' && ag.cfg) agRenderAba();
      if (chave) agTestarChaveUI();
      else { const st = document.getElementById('agCfgStatus'); st.textContent = 'Salvo (sem chave a IA não funciona).'; }
      toast('IA salva neste navegador');
    }
  }

  // ═══════════════════════════════════════════════ BACKUP ═══

  function agExportar() {
    if (!ag.cfg) return;
    const dados = { app: 'agendador-privacy', versao: 2, origem: 'synora-copys', modelo: ag.modelo, exportadoEm: new Date().toISOString(), cfg: JSON.parse(JSON.stringify(ag.cfg)) };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' }));
    a.download = `agenda-${normTexto(ag.modelo).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'modelo'}-${agDataISO(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  async function agImportar(e) {
    const input = e.target;
    const arquivo = input.files && input.files[0];
    input.value = '';
    if (!arquivo || !ag.cfg) return;
    if (arquivo.size > 2 * 1024 * 1024) { toast('Arquivo grande demais pra ser um backup da agenda'); return; }
    let dados;
    try { dados = JSON.parse(await arquivo.text()); } catch (err) { toast('Esse arquivo não é um JSON válido'); return; }
    const bruto = dados && dados.app === 'agendador-privacy' && agObj(dados.cfg) ? dados.cfg : dados;
    const conhecidas = ['horarios', 'pacotesReg', 'modelos', 'personas', 'mensagens', 'msgsMapa', 'roteiroHoras'];
    if (!agObj(bruto) || !conhecidas.some(k => k in bruto)) { toast('Esse arquivo não parece um backup do Agendador'); return; }
    const novo = agSanitizar(bruto);
    // Backup da extensão: o registro de pacotes era de várias modelos. Pega só os dessa modelo (pelo nome).
    let avisoPacotes = '';
    if (Array.isArray(bruto.modelos) && Array.isArray(bruto.pacotesReg) && bruto.modelos.length) {
      const primeiro = normTexto(nomeModelo(ag.modelo).split(/\s+/)[0]);
      const daqui = bruto.modelos.find(m => agObj(m) && (normTexto(m.nome) === normTexto(ag.modelo) || normTexto(String(m.nome || '').split(/\s+/)[0]) === primeiro));
      if (daqui) {
        novo.pacotesReg = bruto.pacotesReg.filter(p => agObj(p) && (p.modelo || p.persona) === daqui.id).map(agLimparPacote).filter(Boolean);
        avisoPacotes = `Peguei só os pacotes de "${daqui.nome}".`;
      } else if (bruto.modelos.length > 1) {
        novo.pacotesReg = (novo.pacotesReg || []).map(p => ({ ...p, usar: false }));
        avisoPacotes = 'Não achei essa modelo no arquivo: os pacotes vieram todos desmarcados, revise.';
      }
      if (agObj(bruto.proxModelo) && daqui && agObj(bruto.proxModelo[daqui.id])) {
        const px = bruto.proxModelo[daqui.id];
        if (Number.isFinite(Number(px.pack))) novo.packProx = Math.max(0, parseInt(px.pack) || 0);
        if (Number.isFinite(Number(px.video))) novo.videoProx = Math.max(0, parseInt(px.video) || 0);
      }
    }
    const nPac = (novo.pacotesReg || []).length;
    const nPers = (novo.personas || []).length;
    if (!confirm(`Importar na agenda de ${nomeModelo(ag.modelo)}?\n\n${nPers} persona(s) e ${nPac} pacote(s) no arquivo.\nO que vier no arquivo substitui o que tem agora.`)) return;
    ag.cfg = agMontarCfg({ ...JSON.parse(JSON.stringify(ag.cfg)), ...novo });
    agSalvar();
    agRenderCorpo();
    toast('Backup importado' + (avisoPacotes ? '. ' + avisoPacotes : ''));
  }

  // ═══════════════════════════════════════════════ EVENTOS ═══

  function agClique(e) {
    const t = e.target;
    const mod = t.closest('[data-ag-modelo]');
    if (mod) { if (mod.dataset.agModelo !== ag.modelo || !ag.cfg) agCarregarModelo(mod.dataset.agModelo); return; }
    const aba = t.closest('[data-ag-aba]');
    if (aba) {
      ag.aba = aba.dataset.agAba; ag.roteiroAberto = ''; agRenderCorpo();
      // A extensão pode ter lido o Acervo depois que a agenda abriu: olha de novo
      if (ag.aba === 'pacotes' && ag.cfg) agCarregarAcervo(ag.id);
      return;
    }
    if (t.closest('#agProgramar')) { agAbrirPrevia(); return; }
    const c = ag.cfg;
    const acaoEl = t.closest('[data-ag]');
    const acao = acaoEl && acaoEl.dataset.ag;
    if (acao === 'config') { agAbrirConfig(); return; }
    if (!c) return;
    if (acao === 'exportar') return agExportar();
    if (acao === 'importar') return document.getElementById('agArquivo').click();

    // Quando
    const dia = t.closest('[data-dia]');
    if (dia) {
      const iso = dia.dataset.dia;
      c.dias = c.dias.includes(iso) ? c.dias.filter(d => d !== iso) : c.dias.concat(iso).sort();
      agSalvar(); agRenderAba(); return;
    }
    const atalho = t.closest('[data-atalho]');
    if (atalho) { agAtalhoDias(atalho.dataset.atalho); agSalvar(); agRenderAba(); return; }
    const hora = t.closest('[data-hora]');
    if (hora) { agAlternarHora(hora.dataset.hora); agSalvar(); agRenderAba(); return; }

    // Agitação
    if (acao === 'agit-aplicar') return agAplicarAgitacao();
    if (acao === 'agit-desfazer') return agTirarAgitacao('desfazer');
    if (acao === 'agit-um') return agTirarAgitacao('um');

    // Persona
    const pers = t.closest('[data-persona]');
    if (pers) {
      const id = pers.dataset.persona;
      if (id === '+') {
        const conta = c.contaPrivacy && !c.personas.some(p => p.conta === c.contaPrivacy) ? c.contaPrivacy : '';
        const nova = { id: 'p' + Date.now(), nome: 'Nova persona', idade: '', desc: '', jeito: '', nunca: '', exemplos: '', conta };
        c.personas.push(nova);
        c.persona = nova.id;
      } else c.persona = id;
      agSalvar(); agRenderAba();
      if (id === '+') { const n = document.querySelector('#agCorpo [data-pcampo="nome"]'); if (n) n.select(); }
      return;
    }
    if (acao === 'persona-apagar') {
      const atual = agPersonaAtual(c);
      if (!atual || !confirm(`Apagar a persona "${atual.nome || 'sem nome'}"?`)) return;
      c.personas = c.personas.filter(p => p !== atual);
      c.persona = '';
      agSalvar(); agRenderAba(); return;
    }
    if (acao === 'persona-vincular' || acao === 'persona-soltar') {
      const atual = agPersonaAtual(c);
      if (!atual) return;
      if (acao === 'persona-vincular') { c.personas.forEach(p => { if (p.conta === c.contaPrivacy) p.conta = ''; }); atual.conta = c.contaPrivacy; }
      else atual.conta = '';
      agSalvar(); agRenderAba(); return;
    }
    if (acao === 'persona-testar') return agTestarPersona(acaoEl);

    // Copy
    const tipo = t.closest('[data-tipo]');
    if (tipo) {
      const id = tipo.dataset.tipo;
      c.tiposCopy = c.tiposCopy.includes(id) ? c.tiposCopy.filter(x => x !== id) : c.tiposCopy.concat(id);
      const on = c.tiposCopy.includes(id);
      tipo.classList.toggle('on', on); tipo.setAttribute('aria-pressed', on);
      agSalvar(); return;
    }
    const emo = t.closest('[data-emoji]');
    if (emo) {
      c.emojiCopy = emo.dataset.emoji;
      emo.parentElement.querySelectorAll('[data-emoji]').forEach(b => b.classList.toggle('ativo', b === emo));
      agSalvar(); return;
    }
    if (acao === 'gerar') return agGerar();
    if (acao === 'refazer') return agGerar(true);
    if (acao === 'reais') return agUsarReais();
    if (acao === 'refazer-um') return agRefazerUm(acaoEl);
    if (acao === 'colar') return agColar();
    if (acao === 'prompt-restaurar') {
      const ta = document.querySelector('#agCorpo [data-campo="prompt"]');
      if (c.prompt && !confirm('Voltar pro prompt padrão? O prompt que você editou vai ser perdido.')) return;
      c.prompt = '';
      if (ta) ta.value = AG_PROMPT_PADRAO;
      agSalvar(); return;
    }
    if (acao === 'hist-limpar') {
      if (!confirm('Limpar o histórico? A IA vai poder repetir copies que já saíram.')) return;
      c.historicoCopies = [];
      agSalvar(); return;
    }

    // Roteiro
    const rotModelo = t.closest('[data-roteiro]');
    if (rotModelo) {
      c.roteiroHoras = agDistribuirRoteiro(rotModelo.dataset.roteiro.split(','), agHorariosValidos(c.horarios, c.limiteDia));
      ag.roteiroAberto = '';
      agSalvar(); agRenderAba(); return;
    }
    if (acao === 'roteiro-limpar') { c.roteiroHoras = {}; ag.roteiroAberto = ''; agSalvar(); agRenderAba(); return; }
    const op = t.closest('[data-rot-a]');
    if (op) {
      c.roteiroHoras = { ...(c.roteiroHoras || {}), [op.dataset.rotH]: op.dataset.rotA };
      ag.roteiroAberto = '';
      agSalvar(); agRenderAba(); return;
    }
    const chip = t.closest('[data-rot-abrir]');
    if (chip) { ag.roteiroAberto = ag.roteiroAberto === chip.dataset.rotAbrir ? '' : chip.dataset.rotAbrir; agRenderAba(); return; }

    // Pacotes
    if (acao === 'pacote-novo') {
      c.pacotesReg.push({ tipo: acaoEl.dataset.tipoNovo === 'video' ? 'video' : 'pack', apelido: '', preco: '', nome: '', usar: true });
      agSalvar(); agRenderAba();
      const ultimos = document.querySelectorAll('#agCorpo [data-pc="apelido"]');
      if (ultimos.length) ultimos[ultimos.length - 1].focus();
      return;
    }
    const linhaPac = t.closest('[data-pi]');
    if (linhaPac && (acao === 'pacote-tipo' || acao === 'pacote-apagar')) {
      const p = c.pacotesReg[Number(linhaPac.dataset.pi)];
      if (!p) return;
      if (acao === 'pacote-tipo') p.tipo = p.tipo === 'video' ? 'pack' : 'video';
      else {
        if (!confirm(`Apagar o pacote "${p.apelido || p.nome || p.preco || 'sem nome'}"?`)) return;
        c.pacotesReg = c.pacotesReg.filter(x => x !== p);
      }
      agSalvar(); agRenderAba(); return;
    }
    if (acao === 'acervo') return agSyncAcervo();

    // Fila
    if (acao === 'fila-cancelar') { const item = t.closest('[data-fila]'); if (item) agCancelarFila(item.dataset.fila); }
  }

  function agDigitou(e) {
    const t = e.target;
    const c = ag.cfg;
    if (!c) return;
    if (t.id === 'agConta') { c.contaPrivacy = agNormConta(t.value); agSalvar(); return; }
    const campo = t.dataset.campo;
    if (campo === 'limiteDia') {
      if (t.value === '') return;
      c.limiteDia = Math.min(50, Math.max(1, parseInt(t.value) || 1));
      agSalvar(); return;
    }
    if (campo === 'briefing' || campo === 'oferta') { c[campo] = t.value; agSalvar(); return; }
    if (campo === 'prompt') { c.prompt = t.value.trim() === AG_PROMPT_PADRAO.trim() ? '' : t.value; agSalvar(); return; }
    const ag2 = t.dataset.agit;
    if (ag2) { ag.agit[ag2] = t.value; return; }
    const pc = t.dataset.pcampo;
    if (pc) {
      const atual = agPersonaAtual(c);
      if (!atual) return;
      if (pc === 'idade') {
        const v = parseInt(t.value);
        const invalida = t.value !== '' && !(v >= 18 && v <= 99);
        const erro = document.getElementById('agIdadeErro');
        if (erro) erro.hidden = !invalida;
        t.classList.toggle('invalido', invalida);
        if (invalida) return; // não salva idade abaixo de 18
        atual.idade = t.value ? String(v) : '';
      } else {
        atual[pc] = t.value;
      }
      if (pc === 'nome') { const pill = document.querySelector(`#agCorpo [data-persona="${CSS.escape(atual.id)}"]`); if (pill) pill.textContent = atual.nome || 'Sem nome'; }
      const aviso = document.getElementById('agPersonaProibida');
      if (aviso) aviso.hidden = !temaProibido([atual.nome, atual.desc, atual.jeito, atual.nunca, atual.exemplos].join('\n'));
      agSalvar(); return;
    }
    if (t.hasAttribute('data-msg')) {
      const box = t.closest('[data-chave]');
      const mapa = agMsgsMapa(c);
      if (t.value.trim()) mapa[box.dataset.chave] = t.value; else delete mapa[box.dataset.chave];
      box.classList.toggle('proibida', !!t.value.trim() && temaProibido(t.value));
      agSalvar(); return;
    }
    const pcp = t.dataset.pc;
    if (pcp && pcp !== 'usar') {
      const linha = t.closest('[data-pi]');
      const p = c.pacotesReg[Number(linha.dataset.pi)];
      if (!p) return;
      p[pcp] = t.value.trim();
      agSalvar();
    }
  }

  function agMudou(e) {
    const t = e.target;
    const c = ag.cfg;
    if (!c) return;
    if (t.id === 'agTeste') { c.teste = t.checked; agSalvar(); return; }
    if (t.dataset.pc === 'usar') {
      const linha = t.closest('[data-pi]');
      const p = c.pacotesReg[Number(linha.dataset.pi)];
      if (!p) return;
      p.usar = t.checked;
      linha.classList.toggle('desligado', !t.checked);
      agSalvar(); return;
    }
    if (t.dataset.campo === 'limiteDia') { t.value = String(c.limiteDia); agRenderAba(); }
  }

  // ═══════════════════════════════════════════════ INICIALIZAÇÃO ═══

  window.addEventListener('beforeunload', () => { if (agPendente) agFlushSalvar(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && agPendente) agFlushSalvar(); });
  if (typeof auth !== 'undefined' && auth && auth.onAuthStateChanged) {
    auth.onAuthStateChanged((u) => {
      if (!u) {
        if (ag.unsubFila) { try { ag.unsubFila(); } catch (e) { /* ignora */ } ag.unsubFila = null; }
        ag.cfg = null; ag.modelo = ''; ag.id = '';
        return;
      }
      setTimeout(() => { if (typeof abaAtual !== 'undefined' && abaAtual === 'agenda') abrirAgenda(); }, 0);
    });
  }

  window.abrirAgenda = abrirAgenda;
  // Pra testes no console
  window.AgendaSynora = { estado: ag, preparar: agPreparar, montarPlano: agMontarPlano, sanitizar: agSanitizar, montarCfg: agMontarCfg, prompt: () => AG_PROMPT_PADRAO + AG_REGRA_SEGURANCA };
})();
