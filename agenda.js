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
    lapis: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
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
    gaveta: null,
    agitAberto: false,
    vistaMsg: 'lista',
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

  async function agLoteCopies({ quantidade, horarios, briefing, prompt, tipos, emoji, persona, roteiro, oferta, evitar, exemplos }) {
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
      + (exemplos?.length ? `\nExemplos reais dessa modelo: imite o jeito de escrever, NÃO copie:\n${exemplos.filter(t => !temaProibido(t)).slice(0, 12).map(t => `- ${t.replace(/\s+/g, ' ').substring(0, 300)}`).join('\n')}` : '')
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

  function agPedirCopies(cfg, slots, evitarExtra, onProgresso, exemplos) {
    return agGerarCopiesMassa({
      exemplos: exemplos || [],
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

  function agAvatarModelo(m) {
    const foto = avataresModelos[m];
    return `<span class="gr-av ag-av" style="--cor:${corAvatar(m)}">${esc(iniciais(m))}${foto ? `<img src="${escAttr(foto)}" alt="" referrerpolicy="no-referrer">` : ''}</span>`;
  }

  // "Agenda de [modelo ▾]": botão com a modelo escolhida + lista pra trocar
  function agRenderModelos() {
    const lista = document.getElementById('agModelos');
    const btn = document.getElementById('agModeloBtn');
    if (!lista || !btn) return;
    const modelos = copysPorModeloContagem();
    btn.innerHTML = ag.modelo
      ? `${agAvatarModelo(ag.modelo)}<span class="ag-modelo-nome">${esc(nomeModelo(ag.modelo))}</span><span class="ag-modelo-seta" aria-hidden="true">▾</span>`
      : `<span class="ag-modelo-nome">${modelos.length ? 'Escolher modelo' : 'Carregando…'}</span><span class="ag-modelo-seta" aria-hidden="true">▾</span>`;
    btn.disabled = !modelos.length;
    lista.innerHTML = modelos.map(([m, n]) => {
      const on = m === ag.modelo;
      return `<button type="button" class="ag-modelo-op ${on ? 'on' : ''}" data-ag-modelo="${escAttr(m)}" role="option" aria-selected="${on}">
        ${agAvatarModelo(m)}<span class="ag-modelo-op-txt"><b>${esc(nomeModelo(m))}</b><small>${n} copys</small></span>${on ? '<span class="ag-modelo-op-on">atual</span>' : ''}
      </button>`;
    }).join('');
    document.querySelectorAll('#agModeloBtn img, #agModelos img').forEach((img) => { img.onerror = () => img.remove(); });
  }

  function agListaModelos(abrir) {
    const lista = document.getElementById('agModelos');
    const btn = document.getElementById('agModeloBtn');
    if (!lista || !btn) return;
    const vai = abrir === undefined ? lista.hidden : abrir;
    lista.hidden = !vai;
    btn.setAttribute('aria-expanded', String(vai));
    if (vai) { const atual = lista.querySelector('.on') || lista.querySelector('button'); if (atual) atual.focus(); }
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ag-sel-modelo')) { const l = document.getElementById('agModelos'); if (l && !l.hidden) agListaModelos(false); }
  });
  document.addEventListener('keydown', (e) => {
    const l = document.getElementById('agModelos');
    if (e.key === 'Escape' && l && !l.hidden) { agListaModelos(false); document.getElementById('agModeloBtn').focus(); }
  });

  // ═══════════════════════════════════════════════ ABAS ═══

  const AG_ABAS = [['quando', '1 · Quando', 'Quando'], ['mensagens', '2 · Mensagens', 'Mensagens'], ['programar', '3 · Programar', 'Programar'], ['fila', 'Fila', 'Fila']];
  function agAbaInicial() {
    try { const v = sessionStorage.getItem('agenda_aba'); if (AG_ABAS.some(([id]) => id === v)) return v; } catch (e) { /* ignora */ }
    return 'quando';
  }
  function agMostrarAba(id, rolar) {
    if (!AG_ABAS.some(([x]) => x === id)) id = 'quando';
    ag.aba = id;
    try { sessionStorage.setItem('agenda_aba', id); } catch (e) { /* ignora */ }
    document.querySelectorAll('#agRaiz [data-ag-aba]').forEach((b) => {
      const on = b.dataset.agAba === id;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
    });
    document.querySelectorAll('#agRaiz [data-painel]').forEach((p) => { p.hidden = p.dataset.painel !== id; });
    if (rolar) {
      const raiz = document.getElementById('agRaiz');
      const topo = raiz.getBoundingClientRect().top;
      if (topo < 0) window.scrollTo({ top: Math.max(0, window.scrollY + topo - 90) });
    }
    if (id === 'mensagens' && !agAutoAlturaNativa) document.querySelectorAll('#agTimeline textarea[data-msg]').forEach(agAutoAltura);
  }
  function agContarFila() {
    const n = (ag.fila || []).filter(d => String(d.status || 'pendente').toLowerCase() === 'pendente').length;
    const el = document.getElementById('agFilaQtd');
    if (el) { el.textContent = n ? `(${n})` : ''; el.hidden = !n; }
  }

  // ═══════════════════════════════════════════════ ESQUELETO ═══
  // Uma coluna só, em três passos sempre abertos: 1) Quando vai sair  2) O que vai falar  3) Programar.
  // Os ajustes menos usados (persona, roteiro, estilo, prompt, pacotes, configurações) abrem numa gaveta.

  const AG_INICIAIS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  function agPrimeiroNome(m) { return nomeModelo(m || '').split(/\s+/)[0] || ''; }

  function agMontarEsqueleto(raiz) {
    ag.iniciado = true;
    raiz.innerHTML = `
      <div class="ag-topo">
        <div class="ag-topo-linha">
          <span class="ag-de">Agenda de</span>
          <div class="ag-sel-modelo">
            <button type="button" class="ag-modelo-btn" id="agModeloBtn" aria-haspopup="listbox" aria-expanded="false" aria-controls="agModelos"></button>
            <div class="ag-modelo-lista" id="agModelos" role="listbox" aria-label="Escolha a modelo" hidden></div>
          </div>
          <span class="ag-salvo" id="agSalvo" aria-live="polite"></span>
        </div>
        <p class="ag-ajuda">Cada modelo tem a própria agenda.</p>
      </div>
      <nav class="ag-abas" id="agAbas" role="tablist" aria-label="Partes da agenda">
        ${AG_ABAS.map(([id, longo, curto]) => `<button type="button" role="tab" data-ag-aba="${id}"><span class="ag-aba-longo">${longo}</span><span class="ag-aba-curto">${curto}</span>${id === 'fila' ? ' <span class="ag-fila-qtd" id="agFilaQtd" hidden></span>' : ''}</button>`).join('')}
      </nav>
      <div class="ag-aviso ag-aviso-perm" id="agAvisoPerm" hidden>${ico('alerta')}<span>A Agenda ainda não foi liberada no Firebase: o que você mudar aqui não fica salvo.</span></div>

      <section class="ag-passo" id="agPasso1" data-painel="quando" role="tabpanel" aria-labelledby="agP1">
        <header class="ag-passo-cab"><span class="ag-num">1</span><div><h2 id="agP1">Quando vai sair</h2><p>Escolha os dias e os horários dos disparos.</p></div></header>
        <div id="agQuando"></div>
        <div class="ag-proximo"><button type="button" class="ag-btn" data-ag="aba" data-aba="mensagens">Próximo: Mensagens →</button></div>
      </section>

      <section class="ag-passo" id="agPasso2" data-painel="mensagens" role="tabpanel" aria-labelledby="agP2" hidden>
        <header class="ag-passo-cab"><span class="ag-num">2</span><div><h2 id="agP2">O que vai falar</h2><p>Uma mensagem pra cada horário. Gere com a IA, use copys reais dela ou escreva você mesmo.</p></div></header>
        <div class="segmentado ag-vista" id="agVista" role="group" aria-label="Ver as mensagens como">
          <button type="button" data-ag-vista="lista" class="ativo" aria-pressed="true">Lista</button>
          <button type="button" data-ag-vista="chat" aria-pressed="false">Chat</button>
        </div>
        <div class="ag-msg-grid" id="agMsgGrid">
        <div class="ag-msg-lista">
        <div class="ag-barra">
          <button type="button" class="ag-btn ag-btn-prim" id="agGerar" data-ag="gerar"></button>
          <button type="button" class="ag-btn" id="agMisturar" data-ag="misturar" title="Metade dos horários vazios com copys reais dela e o resto gerado pela IA, imitando o jeito dela">${ico('brilho')}<span>Misturar IA + reais</span></button>
          <button type="button" class="ag-btn" id="agReais" data-ag="reais" title="Preenche os horários vazios com copys de verdade dessa modelo, que ainda não saíram">${ico('copiar')}<span>Usar copys reais</span></button>
          <button type="button" class="ag-btn" data-ag="gaveta" data-gaveta="colar">${ico('mensagem')}<span>Colar várias</span></button>
        </div>
        <p class="ag-status" id="agStatus" aria-live="polite" hidden></p>
        <p class="ag-linha-info"><button type="button" class="ag-link" id="agRefazer" data-ag="refazer" hidden>Refazer todas com a IA</button><span id="agHist"></span></p>
        <div class="ag-ajustes-bloco">
          <span class="ag-ajustes-rot">Ajustes</span>
          <div class="ag-ajustes" id="agAjustes"></div>
        </div>
        <div class="ag-tl-info"><span class="ag-rot-dia">Mensagens por horário</span><span id="agMsgsInfo"></span></div>
        <div id="agTimeline"></div>
        <div class="ag-proximo"><button type="button" class="ag-btn" data-ag="aba" data-aba="programar">Próximo: Programar →</button></div>
        </div>
        <aside class="ag-msg-chat" aria-label="Como a assinante vê no chat">
          <p class="ag-chat-dica">Assim fica no chat da Privacy. Clique numa mensagem pra editar.</p>
          <div class="gr-chat ag-chat" id="agChat"></div>
        </aside>
        </div>
      </section>

      <section class="ag-passo" id="agPasso3" data-painel="programar" role="tabpanel" aria-labelledby="agP3" hidden>
        <header class="ag-passo-cab"><span class="ag-num">3</span><div><h2 id="agP3">Programar</h2><p>Confira e clique em Agendar. Com a Privacy dessa modelo aberta no Chrome (com o Agendador), ele começa sozinho em até 15 segundos.</p></div></header>
        <p class="ag-frase" id="agResumoFrase"></p>
        <ul class="ag-avisos" id="agAvisos"></ul>
        <label class="ag-campo ag-conta-campo"><span>Conta da modelo na Privacy <em>opcional · a extensão confere se tá logada na conta certa</em></span>
          <span class="ag-conta"><span class="ag-conta-arroba">@</span><input type="text" id="agConta" placeholder="usuario" autocomplete="off" spellcheck="false" maxlength="60"></span>
        </label>
        <label class="ag-teste-linha">
          <input type="checkbox" id="agTeste" class="gr-switch" role="switch">
          <span><b>Modo teste</b><small>Manda só o primeiro disparo, pra conferir se está tudo certo antes de programar tudo.</small></span>
        </label>
        <p class="ag-status" id="agStatusProg" aria-live="polite" hidden></p>
        <button type="button" class="ag-btn ag-btn-prim ag-programar" id="agProgramar"></button>
        <p class="ag-dica-mini">Depois de mandar, acompanhe na aba <button type="button" class="ag-link" data-ag="aba" data-aba="fila">Fila</button>.</p>
      </section>

      <section class="ag-passo" id="agPassoFila" data-painel="fila" role="tabpanel" aria-labelledby="agPF" hidden>
        <header class="ag-passo-cab"><div><h2 id="agPF">Fila</h2><p>O que já foi mandado. A extensão pega daqui e agenda na Privacy.</p></div></header>
        <div id="agFila"></div>
      </section>
      <input type="file" id="agArquivo" accept=".json,application/json" hidden>`;
    agMostrarAba(agAbaInicial());
    raiz.addEventListener('click', agClique);
    raiz.addEventListener('input', agDigitou);
    raiz.addEventListener('change', agMudou);
    document.getElementById('agArquivo').addEventListener('change', agImportar);
  }

  function agRenderCorpo() {
    const quando = document.getElementById('agQuando');
    if (!quando) return;
    agRenderModelos();
    const conta = document.getElementById('agConta');
    const teste = document.getElementById('agTeste');
    if (!ag.cfg) {
      const msg = ag.modelo ? (agUser() ? `Abrindo a agenda de ${esc(agPrimeiroNome(ag.modelo))}…` : 'Esperando o login…') : 'Carregando as modelos…';
      quando.innerHTML = `<div class="ag-carregando">${ico('carregando', 'ag-gira')}<span>${msg}</span></div>`;
      ['agTimeline', 'agAjustes', 'agAvisos'].forEach((id) => { document.getElementById(id).innerHTML = ''; });
      ['agResumoFrase', 'agMsgsInfo', 'agHist'].forEach((id) => { document.getElementById(id).textContent = ''; });
      ['agGerar', 'agReais'].forEach((id) => { document.getElementById(id).disabled = true; });
      document.getElementById('agGerar').innerHTML = `${ico('brilho')}<span>Gerar com IA</span>`;
      document.getElementById('agRefazer').hidden = true;
      conta.value = '';
      conta.disabled = true;
      teste.disabled = true;
      agAtualizarRodape();
      agRenderFila();
      return;
    }
    conta.disabled = false;
    if (document.activeElement !== conta) conta.value = ag.cfg.contaPrivacy || '';
    teste.disabled = false;
    teste.checked = !!ag.cfg.teste;
    agMostrarAvisoPermissao();
    agRenderTudo();
    agRenderFila();
  }

  function agRenderTudo() {
    if (!ag.cfg) return;
    agRenderQuando();
    agRenderTimeline();
    agRenderGaveta();
    agAtualizar();
  }

  // Partes que mudam sem redesenhar (não tira o foco de quem está digitando)
  function agAtualizar() {
    agAtualizarRodape();
    if (!ag.cfg) return;
    agChatDepois();
    const c = ag.cfg;
    const marcadas = agHorariosValidos(c.horarios, 99).length;
    const info = document.getElementById('agHorasInfo');
    if (info) {
      info.textContent = marcadas > c.limiteDia ? `${marcadas} marcados · só os ${c.limiteDia} primeiros saem por dia` : `${marcadas} marcado${marcadas === 1 ? '' : 's'}`;
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
    agRenderAjustes();
    agAtualizarCopyInfo();
    agAtualizarResumo();
  }

  function agAtualizarRodape() {
    const btn = document.getElementById('agProgramar');
    if (!btn) return;
    const c = ag.cfg;
    if (!c) { btn.disabled = true; btn.innerHTML = `${ico('raio')}<span>Programar disparos</span>`; return; }
    btn.disabled = ag.mandando;
    const total = agMontarPlano(c).length;
    const n = c.teste ? Math.min(1, total) : total;
    btn.classList.toggle('ag-incompleto', !n);
    if (!n) btn.innerHTML = `${ico('calendario')}<span>Programar disparos · escolha dias e horários no passo 1</span>`;
    else if (c.teste) btn.innerHTML = `${ico('frasco')}<span>Programar disparos · teste com 1</span>`;
    else btn.innerHTML = `${ico('raio')}<span>Programar ${n} ${n === 1 ? 'disparo' : 'disparos'}</span>`;
  }

  function agStatus(txt, tipo, onde) {
    const el = document.getElementById(onde === 'prog' ? 'agStatusProg' : 'agStatus');
    ag.status = txt || '';
    ag.statusTipo = tipo || '';
    if (!el) return;
    el.hidden = !ag.status;
    el.textContent = ag.status;
    el.dataset.tipo = ag.statusTipo;
  }

  // ═══════════════════════════════════════════════ PASSO 3: RESUMO EM TEXTO ═══

  function agContagemCopys(c) {
    const slots = agSlotsTexto(c);
    const mapa = agMsgsMapa(c);
    let com = 0, proibidas = 0;
    slots.forEach((s) => { const t = agMsgDoHorario(mapa, s); if (t) { com++; if (temaProibido(t)) proibidas++; } });
    return { slots, mapa, com, vazios: slots.length - com, proibidas };
  }

  function agDiaCurto(iso) {
    const [Y, M, D] = iso.split('-').map(Number);
    const d = new Date(Y, M - 1, D);
    return `${AG_DIAS_SEMANA[d.getDay()]} ${String(D).padStart(2, '0')}/${String(M).padStart(2, '0')}`;
  }

  function agAtualizarResumo() {
    const frase = document.getElementById('agResumoFrase');
    const lista = document.getElementById('agAvisos');
    if (!frase || !ag.cfg) return;
    const c = ag.cfg;
    const plano = agMontarPlano(c);
    const { slots, com, vazios, proibidas } = agContagemCopys(c);
    const itens = agItensTimeline(c);
    const nPacks = plano.length ? itens.filter(s => AG_ACERVO_PROX[s.assunto]).length : 0;
    if (!plano.length) frase.innerHTML = 'Nada pra programar ainda: escolha os dias e horários no <button type="button" class="ag-link" data-ag="ir" data-ir="quando">passo 1</button>.';
    else {
      const dias = [...new Set(plano.map(i => i.dia))].sort();
      const periodo = dias.length === 1 ? `em ${agDiaCurto(dias[0])}` : `de ${agDiaCurto(dias[0])} a ${agDiaCurto(dias[dias.length - 1])}`;
      frase.innerHTML = `<b>${plano.length} ${plano.length === 1 ? 'disparo' : 'disparos'}</b> ${esc(periodo)}`
        + (slots.length ? ` · ${com} de ${slots.length} copys prontas` : '')
        + (nPacks ? ` · ${nPacks} ${nPacks === 1 ? 'pacote' : 'pacotes'}` : '');
    }
    const avisos = [];
    if (c.teste && plano.length) avisos.push(['info', 'Modo teste ligado: só o primeiro disparo vai pra fila.']);
    if (proibidas) avisos.push(['ruim', `${proibidas} ${proibidas === 1 ? 'mensagem tem' : 'mensagens têm'} tema proibido e não vão pra fila (o horário repete outra mensagem).`]);
    if (plano.length && slots.length && !com) avisos.push(['ruim', 'Nenhuma mensagem escrita ainda: preencha no passo 2.']);
    else if (plano.length && vazios) avisos.push(['aviso', `${vazios} ${vazios === 1 ? 'horário está' : 'horários estão'} sem mensagem própria: vão repetir outras em rodízio.`]);
    const faltaPack = plano.length && itens.some(s => AG_ACERVO_PROX[s.assunto] && !s.pack);
    if (faltaPack) avisos.push(['ruim', 'Tem horário de pack/vídeo sem pacote marcado no rodízio (Ajustes › Pacotes).']);
    const pers = agPersonaAtual(c);
    if (pers?.conta && c.contaPrivacy && pers.conta !== c.contaPrivacy) avisos.push(['aviso', `A persona ${pers.nome} é da conta @${pers.conta}, mas a conta abaixo é @${c.contaPrivacy}.`]);
    if (plano.length && !c.contaPrivacy) avisos.push(['info', 'Sem o @ da conta: a extensão não vai conferir se tá logada na modelo certa.']);
    lista.innerHTML = avisos.map(([t, txt]) => `<li data-tipo="${t}">${ico(t === 'info' ? 'olho' : 'alerta')}<span>${esc(txt)}</span></li>`).join('');
    lista.hidden = !avisos.length;
  }

  // ═══════════════════════════════════════════════ PASSO 2: BARRA, AJUSTES E MENSAGENS ═══

  function agAtualizarCopyInfo() {
    const c = ag.cfg;
    if (!c) return;
    const { slots, com, vazios, proibidas } = agContagemCopys(c);
    const info = document.getElementById('agMsgsInfo');
    if (info) {
      info.textContent = slots.length ? `${com} de ${slots.length} com texto${proibidas ? ` · ${proibidas} com tema proibido` : ''}` : '';
      info.classList.toggle('ag-txt-aviso', (!!vazios && com > 0) || !!proibidas);
    }
    const btn = document.getElementById('agGerar');
    if (btn && !ag.gerando) {
      btn.disabled = false;
      if (!slots.length) btn.innerHTML = `${ico('brilho')}<span>Gerar com IA</span>`;
      else if (!com) btn.innerHTML = `${ico('brilho')}<span>Gerar ${slots.length} com IA</span>`;
      else if (vazios) btn.innerHTML = `${ico('brilho')}<span>Gerar ${vazios === 1 ? 'o vazio' : `os ${vazios} vazios`} com IA</span>`;
      else btn.innerHTML = `${ico('atualizar')}<span>Refazer todas com IA</span>`;
    }
    const reais = document.getElementById('agReais');
    if (reais) reais.disabled = ag.gerando || !vazios;
    const mist = document.getElementById('agMisturar');
    if (mist && !ag.gerando) { mist.disabled = !vazios; mist.innerHTML = `${ico('brilho')}<span>Misturar IA + reais</span>`; }
    const refazer = document.getElementById('agRefazer');
    if (refazer) refazer.hidden = !(com && vazios) || ag.gerando;
    const hist = (c.historicoCopies || []).length;
    const h = document.getElementById('agHist');
    if (h) h.innerHTML = hist ? `A IA evita repetir as últimas ${hist} copys que já foram pra fila. <button type="button" class="ag-link" data-ag="hist-limpar">Limpar histórico</button>` : '';
    const pe = document.getElementById('agPromptEstado');
    if (pe) pe.textContent = c.prompt ? 'Prompt editado' : 'Prompt padrão';
  }

  function agRotuloSeq(seq) { return seq === 'aquecimento' ? 'Só aquecer' : seq.split(',').map(a => AG_ASSUNTOS[a][0]).join(' → '); }

  function agModeloRoteiroAtivo(c) {
    const horasDia = agHorariosValidos(c.horarios, c.limiteDia);
    if (!horasDia.length) return null;
    const assuntos = horasDia.map(h => agAssuntoDaHora(c, h));
    return AG_MODELOS_ROTEIRO.find((seq) => {
      const dist = agDistribuirRoteiro(seq.split(','), horasDia);
      return horasDia.every((h, i) => dist[h] === assuntos[i]);
    }) || 'personalizado';
  }

  function agRenderAjustes() {
    const box = document.getElementById('agAjustes');
    if (!box || !ag.cfg) return;
    const c = ag.cfg;
    const pers = agPersonaAtual(c);
    const rot = agModeloRoteiroAtivo(c);
    const b = (id, rotulo, valor) => `<button type="button" class="ag-ajuste" data-ag="gaveta" data-gaveta="${id}"><span>${rotulo}</span>${valor ? `<b>${esc(valor)}</b>` : ''}</button>`;
    box.innerHTML = [
      b('persona', 'Persona:', pers ? (pers.nome || 'Sem nome') : 'nenhuma'),
      b('roteiro', 'Roteiro:', !rot ? '—' : rot === 'personalizado' ? 'personalizado' : agRotuloSeq(rot)),
      b('estilo', 'Estilo da IA', ''),
      b('prompt', 'Prompt', c.prompt ? '(editado)' : ''),
      b('pacotes', 'Pacotes', `(${c.pacotesReg.length})`),
      b('config', 'Chave da IA e backup', '')
    ].join('');
  }

  function agFmtDia(iso, longo) {
    if (!iso) return 'Sem dia escolhido';
    const [Y, M, D] = iso.split('-').map(Number);
    return new Date(Y, M - 1, D).toLocaleDateString('pt-BR', longo ? { weekday: 'long', day: '2-digit', month: '2-digit' } : { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');
  }

  // Todos os disparos (texto e pacote), com o pacote que o rodízio vai usar em cada um
  function agItensTimeline(c) {
    const plano = agMontarPlano(c);
    const itens = plano.length ? plano : agHorariosValidos(c.horarios, c.limiteDia).map(hora => ({ dia: '', hora }));
    const usados = { pack: 0, video: 0 };
    return itens.map((it) => {
      const assunto = agAssuntoDaHora(c, it.hora);
      let pack = null;
      if (AG_ACERVO_PROX[assunto]) {
        const lista = agListaPacotes(c, assunto);
        if (lista.length) pack = lista[(agProxRodizio(c, assunto) + usados[assunto]++) % lista.length];
      }
      return { dia: it.dia, hora: it.hora, assunto, pack };
    });
  }

  const agAutoAlturaNativa = typeof CSS !== 'undefined' && CSS.supports && CSS.supports('field-sizing', 'content');
  function agAutoAltura(ta) {
    if (agAutoAlturaNativa || !ta.offsetParent) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight + 2, 320) + 'px';
  }

  function agHtmlSlot(c, s, mapa) {
    const opcoes = Object.entries(AG_ASSUNTOS).map(([id, [rot]]) => `<option value="${id}" ${id === s.assunto ? 'selected' : ''}>${esc(rot)}</option>`).join('');
    const seletor = `<select class="ag-input ag-assunto-sel" data-assunto-hora="${s.hora}" aria-label="Assunto das ${s.hora} (vale pra esse horário em todos os dias)" title="Assunto das ${s.hora}: vale pra esse horário em todos os dias">${opcoes}</select>`;
    const hora = `<span class="ag-slot-hora">${s.hora}</span>`;
    if (AG_ACERVO_PROX[s.assunto]) {
      const tipo = s.assunto === 'video' ? 'vídeo' : 'pack';
      const card = s.pack
        ? `<div class="ag-pack">${ico(s.assunto === 'video' ? 'video' : 'pacote')}<span class="ag-pack-txt"><b>${esc(s.pack.apelido || s.pack.nome || 'pacote')}</b> <small>${esc(s.pack.preco ? 'R$ ' + String(s.pack.preco).replace(/^R\$\s*/, '') : 'sem preço')}${s.pack.nome ? ' · ' + esc(s.pack.nome) : ''} · vai com o texto do próprio pacote</small></span></div>`
        : `<div class="ag-pack falta">${ico('alerta')}<span class="ag-pack-txt"><b>Nenhum ${tipo} marcado no rodízio.</b> <button type="button" class="ag-link" data-ag="gaveta" data-gaveta="pacotes">Abrir Pacotes</button></span></div>`;
      return `<div class="ag-slot ag-slot-pack" data-assunto="${s.assunto}" data-idx="${s.idx}">${hora}${seletor}<div class="ag-slot-conteudo">${card}</div></div>`;
    }
    const texto = agMsgDoHorario(mapa, s);
    const ruim = !!texto && temaProibido(texto);
    return `<div class="ag-slot ag-slot-txt ${ruim ? 'proibida' : ''}" data-assunto="${s.assunto}" data-idx="${s.idx}" data-chave="${escAttr(agChaveMsg(s))}">
      ${hora}${seletor}
      <div class="ag-slot-conteudo">
        <textarea class="ag-input ag-txt ag-slot-msg" rows="1" data-msg placeholder="Vazio: repete uma das outras mensagens" aria-label="Mensagem das ${s.hora}">${esc(texto)}</textarea>
        <span class="ag-badge-proibida">${ico('alerta')}Tema proibido: essa mensagem não vai pra fila.</span>
      </div>
      <span class="ag-slot-acoes">
        <button type="button" class="ag-btn ag-btn-p" data-ag="escolher" title="Escolher uma copy real dela pras ${s.hora}">${ico('lista')}<span>Escolher</span></button>
        <button type="button" class="ag-btn ag-btn-p ag-slot-refazer" data-ag="refazer-um" title="Gerar de novo só a das ${s.hora}">${ico('atualizar')}<span>Refazer</span></button>
      </span>
    </div>`;
  }

  function agRenderTimeline() {
    const box = document.getElementById('agTimeline');
    if (!box || !ag.cfg) return;
    const c = ag.cfg;
    const horas = agHorariosValidos(c.horarios, c.limiteDia);
    if (!horas.length) {
      box.innerHTML = `<div class="ag-tl-vazio"><b>Nenhum horário escolhido ainda.</b><p>Marque os dias e horários no passo 1 e as mensagens aparecem aqui.</p><button type="button" class="ag-btn" data-ag="ir" data-ir="quando">Ir pro passo 1</button></div>`;
      return;
    }
    const itens = agItensTimeline(c);
    itens.forEach((s, i) => { s.idx = i; });
    const semDias = !agMontarPlano(c).length;
    const mapa = agMsgsMapa(c);
    const grupos = new Map();
    itens.forEach((s) => { if (!grupos.has(s.dia)) grupos.set(s.dia, []); grupos.get(s.dia).push(s); });
    box.innerHTML = (semDias
      ? `<p class="ag-nota">${c.dias.length ? 'Os dias marcados já passaram (o disparo precisa ser pelo menos 10 min no futuro).' : 'Nenhum dia marcado.'} Essas mensagens valem pros horários em qualquer dia. <button type="button" class="ag-link" data-ag="ir" data-ir="quando">Marcar dias</button></p>`
      : '')
      + [...grupos].map(([dia, lista]) => `
        <div class="ag-tl-dia">
          <h3 class="ag-tl-dia-cab">${esc(semDias ? 'Qualquer dia' : agFmtDia(dia, true).replace(/^./, (x) => x.toUpperCase()))} <span>· ${lista.length} ${lista.length === 1 ? 'disparo' : 'disparos'}</span></h3>
          <div class="ag-tl-lista">${lista.map(s => agHtmlSlot(c, s, mapa)).join('')}</div>
        </div>`).join('');
    if (!agAutoAlturaNativa) box.querySelectorAll('textarea[data-msg]').forEach(agAutoAltura);
    agChatDepois();
  }

  // ═══════════════════════════════════════════════ CHAT (prévia igual à da Privacy) ═══

  let agChatTimer = null;
  function agChatDepois() { clearTimeout(agChatTimer); agChatTimer = setTimeout(agRenderChat, 200); }

  function agAvatarChat() {
    const m = ag.modelo;
    const foto = avataresModelos[m];
    return `<span class="gr-av" style="--cor:${corAvatar(m || '?')}">${esc(iniciais(m))}${foto ? `<img src="${escAttr(foto)}" alt="" referrerpolicy="no-referrer">` : ''}</span>`;
  }

  function agDiaChat(iso) {
    if (!iso) return 'Qualquer dia';
    const hoje = agDataISO(new Date());
    const amanha = new Date(); amanha.setDate(amanha.getDate() + 1);
    if (iso === hoje) return 'Hoje';
    if (iso === agDataISO(amanha)) return 'Amanhã';
    return agFmtDia(iso, false);
  }

  function agPrecoTxt(preco) { return preco ? 'R$ ' + String(preco).replace(/^R\$\s*/, '') : ''; }

  function agRenderChat() {
    const box = document.getElementById('agChat');
    if (!box) return;
    const c = ag.cfg;
    if (!c || !ag.modelo) { box.innerHTML = ''; return; }
    const corpoAntes = box.querySelector('.gr-chat-corpo');
    const rolagem = corpoAntes ? corpoAntes.scrollTop : 0;
    const horas = agHorariosValidos(c.horarios, c.limiteDia);
    const itens = horas.length ? agItensTimeline(c) : [];
    itens.forEach((s, i) => { s.idx = i; });
    const mapa = agMsgsMapa(c);
    const av = agAvatarChat();
    const grupos = new Map();
    itens.forEach((s) => { if (!grupos.has(s.dia)) grupos.set(s.dia, []); grupos.get(s.dia).push(s); });
    const balao = (s) => {
      const tag = `<span class="gr-tag">${esc(AG_ASSUNTOS[s.assunto][0])}</span>`;
      const titulo = `title="Editar a das ${s.hora}"`;
      if (AG_ACERVO_PROX[s.assunto]) {
        if (!s.pack) {
          return `<li class="gr-item ag-chat-item ag-chat-vazio" data-assunto="${s.assunto}" data-chat-idx="${s.idx}" ${titulo}>
            <div class="gr-msg">${av}<div class="gr-bolha"><p class="gr-texto">${s.assunto === 'video' ? 'Vídeo' : 'Pack'} sem pacote no rodízio</p></div></div>
            <span class="gr-msg-hora">${s.hora} · ${tag}</span></li>`;
        }
        const preco = agPrecoTxt(s.pack.preco);
        return `<li class="gr-item ag-chat-item is-ppv" data-assunto="${s.assunto}" data-chat-idx="${s.idx}" ${titulo}>
          <div class="gr-msg">${av}<div class="gr-bolha">
            <div class="gr-ppv-midia" aria-hidden="true">
              <span class="gr-ppv-seta esq"><svg viewBox="0 0 24 24"><path d="M14 7l-5 5 5 5"/></svg></span>
              <span class="gr-ppv-seta dir"><svg viewBox="0 0 24 24"><path d="M10 7l5 5-5 5"/></svg></span>
              <span class="gr-ppv-cadeado"><svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>${esc(s.pack.apelido || s.pack.nome || (s.assunto === 'video' ? 'Vídeo' : 'Pack'))}</span>
            </div>
          </div></div>
          <span class="gr-msg-hora">${s.hora} · ${tag}${preco ? ` <span class="gr-ppv-pago">· <b>${esc(preco)}</b> ainda não pago</span>` : ''}</span>
          ${preco ? `<div class="gr-ppv-acao">${av}<span class="gr-ppv-btn">Desbloquear por ${esc(preco)}</span></div>` : ''}
        </li>`;
      }
      const texto = agMsgDoHorario(mapa, s);
      if (!texto) {
        return `<li class="gr-item ag-chat-item ag-chat-vazio" data-assunto="${s.assunto}" data-chat-idx="${s.idx}" ${titulo}>
          <div class="gr-msg">${av}<div class="gr-bolha"><p class="gr-texto">sem mensagem (repete outra)</p></div></div>
          <span class="gr-msg-hora">${s.hora} · ${tag}</span></li>`;
      }
      const ruim = temaProibido(texto);
      return `<li class="gr-item ag-chat-item ${ruim ? 'ag-chat-ruim' : ''}" data-assunto="${s.assunto}" data-chat-idx="${s.idx}" ${titulo}>
        <div class="gr-msg">${av}<div class="gr-bolha"><p class="gr-texto">${esc(texto)}</p></div></div>
        <span class="gr-msg-hora">${s.hora} · ${tag}${ruim ? ' · <b class="ag-chat-ruim-txt">tema proibido, não vai</b>' : ''}</span></li>`;
    };
    box.innerHTML = `<div class="gr-chat-topo">
        <svg class="gr-chat-voltar" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>
        ${av}
        <span class="gr-chat-quem"><b>${esc(nomeModelo(ag.modelo))}<svg class="gr-chat-verif" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.2 12.3l2.6 2.6 5-5.4"/></svg></b><small>Visto por último ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</small></span>
        <span class="gr-chat-icones" aria-hidden="true">
          <span class="gr-chat-galeria"><svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 4 3.5 3-2.5 4.5 4"/></svg>Galeria</span>
          <svg viewBox="0 0 24 24" class="cheio"><circle cx="12" cy="5.5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="18.5" r="1.7"/></svg>
        </span>
      </div>
      <div class="gr-chat-corpo">${itens.length
        ? [...grupos].map(([dia, lista]) => `<div class="gr-chat-dia"><span>${esc(agDiaChat(dia))}</span></div><ol class="gr-lista gr-chat-lista">${lista.map(balao).join('')}</ol>`).join('')
        : '<p class="ag-chat-sem">Escolha os dias e horários no passo 1 pra ver as mensagens aqui.</p>'}</div>`;
    box.querySelectorAll('img').forEach((img) => { img.onerror = () => img.remove(); });
    const corpo = box.querySelector('.gr-chat-corpo');
    if (corpo) corpo.scrollTop = rolagem;
  }

  // Lista | Chat (abaixo de 1100px uma de cada vez)
  function agMostrarVista(v) {
    ag.vistaMsg = v === 'chat' ? 'chat' : 'lista';
    const grid = document.getElementById('agMsgGrid');
    if (grid) grid.dataset.vista = ag.vistaMsg;
    document.querySelectorAll('#agVista [data-ag-vista]').forEach((b) => {
      const on = b.dataset.agVista === ag.vistaMsg;
      b.classList.toggle('ativo', on);
      b.setAttribute('aria-pressed', String(on));
    });
    if (ag.vistaMsg === 'chat') agRenderChat();
  }

  // Clique num balão: vai pra linha dele na lista, foca e destaca
  function agIrProSlot(idx) {
    const linha = document.querySelector(`#agTimeline .ag-slot[data-idx="${idx}"]`);
    if (!linha) return;
    if (ag.vistaMsg === 'chat' && !window.matchMedia('(min-width: 1100px)').matches) agMostrarVista('lista');
    const suave = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    linha.scrollIntoView({ block: 'center', behavior: suave });
    const campo = linha.querySelector('textarea') || linha.querySelector('select');
    if (campo) campo.focus({ preventScroll: true });
    linha.classList.remove('ag-realce');
    void linha.offsetWidth;
    linha.classList.add('ag-realce');
    setTimeout(() => linha.classList.remove('ag-realce'), 1600);
  }

  function agIr(onde) {
    if (onde === 'quando') agMostrarAba('quando', true);
    else agAbrirGaveta(onde);
  }


  // ═══════════════════════════════════════════════ PASSO 1: QUANDO (+ agitação) ═══

  function agRenderQuando() {
    const box = document.getElementById('agQuando');
    if (box && ag.cfg) box.innerHTML = agHtmlQuando();
  }

  function agHtmlQuando() {
    const c = ag.cfg;
    const hoje = new Date();
    const h0 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const fim = new Date(h0.getFullYear(), h0.getMonth(), h0.getDate() + 13);
    const ini = new Date(h0.getFullYear(), h0.getMonth(), h0.getDate() - h0.getDay());
    const ultimo = new Date(fim.getFullYear(), fim.getMonth(), fim.getDate() + (6 - fim.getDay()));
    const cels = [];
    for (let d = new Date(ini); d <= ultimo; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
      const iso = agDataISO(d);
      if (d < h0 || d > fim) { cels.push(`<span class="ag-cal-dia fora" aria-hidden="true">${d.getDate()}</span>`); continue; }
      const on = c.dias.includes(iso);
      const ehHoje = d.getTime() === h0.getTime();
      cels.push(`<button type="button" class="ag-cal-dia ${on ? 'on' : ''} ${ehHoje ? 'hoje' : ''}" data-dia="${iso}" aria-pressed="${on}" title="${AG_DIAS_SEMANA[d.getDay()]} ${d.getDate()} de ${AG_MESES[d.getMonth()]}"><b>${d.getDate()}</b>${ehHoje ? '<small>hoje</small>' : ''}</button>`);
    }
    const meses = [...new Set([AG_MESES[h0.getMonth()], AG_MESES[fim.getMonth()]])].join(' / ');
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
    const a = ag.agit;
    return `
      <div class="ag-bloco">
        <div class="ag-bloco-cab"><h3>Dias <span class="ag-extra">${esc(meses)} · ${c.dias.length} ${c.dias.length === 1 ? 'marcado' : 'marcados'}</span></h3></div>
        <div class="ag-atalhos">
          <button type="button" class="ag-btn ag-btn-p" data-atalho="semana" title="Hoje e os próximos 6 dias">Próximos 7 dias</button>
          <button type="button" class="ag-btn ag-btn-p" data-atalho="uteis" title="Segunda a sexta dos próximos 7 dias">Dias úteis</button>
          <button type="button" class="ag-btn ag-btn-p" data-atalho="fds" title="Sábado e domingo dos próximos 7 dias">Fim de semana</button>
          <button type="button" class="ag-btn ag-btn-p" data-atalho="limpar">Limpar dias</button>
        </div>
        <div class="ag-cal">${AG_INICIAIS_SEMANA.map(l => `<span class="ag-cal-sem" aria-hidden="true">${l}</span>`).join('')}${cels.join('')}</div>
      </div>
      <div class="ag-bloco">
        <div class="ag-bloco-cab"><h3>Horários <span class="ag-extra" id="agHorasInfo"></span></h3></div>
        ${agHtmlAgitada(false)}
        <div class="ag-grade-horas">${horas}</div>
        <div class="ag-quando-pe">
          <label class="ag-limite"><span>Máximo por dia</span>
            <input class="ag-input ag-input-num" type="number" min="1" max="50" inputmode="numeric" data-campo="limiteDia" value="${escAttr(String(c.limiteDia))}">
          </label>
          <button type="button" class="ag-link" data-ag="agit-toggle" aria-expanded="${!!ag.agitAberto}">${ag.agitAberto ? 'Fechar' : 'Mais de um disparo por hora'}</button>
        </div>
        ${ag.agitAberto ? `
        <div class="ag-agit">
          <p class="ag-dica">Preenche os horários sozinho: tantos disparos por hora, espalhados dentro de cada hora, no período que você escolher.</p>
          <div class="ag-grade-3">
            <label class="ag-campo"><span>Por hora</span><input class="ag-input" type="number" min="1" max="12" inputmode="numeric" data-agit="qtd" value="${escAttr(String(a.qtd))}"></label>
            <label class="ag-campo"><span>Das</span><input class="ag-input" type="time" data-agit="de" value="${escAttr(a.de)}"></label>
            <label class="ag-campo"><span>Até</span><input class="ag-input" type="time" data-agit="ate" value="${escAttr(a.ate)}"></label>
          </div>
          <div class="ag-agit-acoes"><button type="button" class="ag-btn" data-ag="agit-aplicar">${ico('raio')}<span>Aplicar nos horários</span></button></div>
          <p class="ag-dica ag-agit-status" id="agAgitStatus">${esc(a.status)}</p>
          ${agHtmlAgitada(true)}
        </div>` : ''}
      </div>`;
  }

  function agHtmlAgitada(card) {
    return `<div class="ag-agitada ${card ? 'ag-agitada-card' : ''}" data-agitada hidden>
      <span class="ag-agitada-txt" data-agitada-txt></span>
      <span class="ag-agitada-acoes">
        <button type="button" class="ag-link" data-ag="agit-desfazer" title="Volta os horários (e o roteiro) de antes de aplicar a agitação">Tirar agitação</button>
        ${card ? '<button type="button" class="ag-link" data-ag="agit-um" title="Mantém as mesmas horas, mas só 1 disparo em cada (hora cheia)">Deixar 1 por hora</button>' : ''}
      </span>
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

  function agAplicarAgitacao() {
    const c = ag.cfg;
    const a = ag.agit;
    const qtd = Math.min(12, Math.max(1, parseInt(a.qtd) || 1));
    const [h1] = (a.de || '08:00').split(':').map(Number);
    const [h2] = (a.ate || '23:00').split(':').map(Number);
    if (!(h1 < h2)) { a.status = 'A hora final precisa ser depois da inicial.'; agRenderQuando(); agAtualizar(); return; }
    const gerados = [];
    for (let h = h1; h <= h2; h++) {
      for (let i = 0; i < qtd; i++) gerados.push(`${String(h).padStart(2, '0')}:${String(Math.round(i * 60 / qtd)).padStart(2, '0')}`);
    }
    if (!c.antesAgitacao) c.antesAgitacao = { horarios: c.horarios, roteiroHoras: { ...(c.roteiroHoras || {}) }, horasGuardadas: { ...(c.horasGuardadas || {}) } };
    c.horasGuardadas = {};
    c.horarios = agHorariosValidos(gerados.join(', '), 999).join(', ');
    a.status = c.limiteDia < gerados.length
      ? `${gerados.length} disparos gerados, mas o "Máximo por dia" tá em ${c.limiteDia}: só os ${c.limiteDia} primeiros horários saem. Aumente ali em cima se quiser todos.`
      : `${gerados.length} disparos gerados, um a cada ${Math.round(60 / qtd)} min dentro de cada hora.`;
    agSalvar();
    agRenderTudo();
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
    agRenderTudo();
  }

  // ═══════════════════════════════════════════════ GAVETAS (ajustes) ═══

  const AG_GAVETAS = {
    persona: ['pessoa', 'Persona', 'Quem "escreve" as copys da IA. Pode ter mais de uma; a escolhida é a que vale. Salva sozinho.'],
    roteiro: ['lista', 'Roteiro do dia', 'O assunto de cada horário. Escolha um pronto ou troque horário por horário na lista de mensagens.'],
    estilo: ['brilho', 'Estilo da IA', 'Como a IA escreve as mensagens. Salva sozinho.'],
    prompt: ['mensagem', 'Prompt da IA', 'Cole aqui as instruções do seu GPT. Salva sozinho.'],
    pacotes: ['pacote', 'Pacotes', 'Packs e vídeos que vão nos horários de Pack e Vídeo, em rodízio.'],
    config: ['engrenagem', 'Configurações', 'Chave da IA (fica só neste navegador) e backup da agenda.'],
    colar: ['mensagem', 'Colar várias mensagens', 'Uma por bloco, com linha em branco entre elas. Preenche os horários na ordem.'],
    escolher: ['lista', 'Escolher copy', 'Copys reais dessa modelo. Clique numa pra colocar no horário.']
  };
  // Gavetas com campos que a pessoa digita e não podem ser redesenhadas por baixo
  const AG_GAVETAS_FIXAS = ['config', 'prompt', 'colar', 'escolher'];

  function agAbrirGaveta(nome) {
    if (!AG_GAVETAS[nome]) return;
    if (nome !== 'config' && !ag.cfg) return;
    agAbrirFolha(agHtmlGaveta(nome), 'ag-folha-lado' + (nome === 'prompt' ? ' ag-folha-larga' : ''));
    ag.gaveta = nome;
    if (nome === 'pacotes') agCarregarAcervo(ag.id);
    agAtualizarCopyInfo();
  }
  function agAbrirConfig() { agAbrirGaveta('config'); }

  function agRenderGaveta() {
    const folha = document.querySelector('#agFolha .ag-folha');
    if (!folha || !ag.gaveta || AG_GAVETAS_FIXAS.includes(ag.gaveta)) return;
    const corpo = folha.querySelector('.ag-folha-corpo');
    const rolagem = corpo ? corpo.scrollTop : 0;
    folha.innerHTML = agHtmlGaveta(ag.gaveta);
    const novo = folha.querySelector('.ag-folha-corpo');
    if (novo) novo.scrollTop = rolagem;
  }

  function agHtmlGaveta(nome) {
    const [icone, titulo, sub] = AG_GAVETAS[nome];
    const corpo = { persona: agHtmlPersona, roteiro: agHtmlRoteiro, estilo: agHtmlEstilo, prompt: agHtmlPrompt, pacotes: agHtmlPacotes, config: agHtmlConfig, colar: agHtmlColar, escolher: agHtmlEscolher }[nome]();
    const rodape = {
      persona: (agPersonaAtual(ag.cfg) ? `<button type="button" class="ag-btn ag-btn-perigo" data-ag="persona-apagar">${ico('lixo')}<span>Apagar persona</span></button>` : '') + `<button type="button" class="ag-btn ag-btn-prim ag-btn-grande" data-folha="fechar">Pronto</button>`,
      prompt: `<button type="button" class="ag-btn" data-ag="prompt-restaurar">${ico('atualizar')}<span>Restaurar padrão</span></button><button type="button" class="ag-btn ag-btn-prim ag-btn-grande" data-folha="fechar">Pronto</button>`,
      config: `<button type="button" class="ag-btn" data-folha="testar">Testar chave</button><button type="button" class="ag-btn ag-btn-prim ag-btn-grande" data-folha="salvar-ia">Salvar chave</button>`,
      colar: `<button type="button" class="ag-btn" data-folha="fechar">Cancelar</button><button type="button" class="ag-btn ag-btn-prim ag-btn-grande" data-ag="colar">Preencher horários</button>`,
      escolher: `<button type="button" class="ag-btn ag-btn-grande" data-folha="fechar">Cancelar</button>`
    }[nome] || `<button type="button" class="ag-btn ag-btn-prim ag-btn-grande" data-folha="fechar">Pronto</button>`;
    return `
      <div class="ag-folha-topo">
        <div>
          <div class="ag-folha-titulo">${ico(icone)}${esc(titulo)}</div>
          <div class="ag-folha-sub">${nome === 'prompt' ? '<span id="agPromptEstado"></span> · ' : ''}${nome === 'escolher' && ag.escolher ? `Pras <b>${esc(ag.escolher.hora)}</b> (${esc(AG_ASSUNTOS[ag.escolher.assunto][0])}). ` : ''}${esc(sub)}</div>
        </div>
        <button type="button" class="ag-btn ag-btn-p" data-folha="fechar">Fechar</button>
      </div>
      <div class="ag-folha-corpo ${nome === 'prompt' ? 'ag-prompt-corpo' : ''}" data-gaveta-corpo="${nome}">${corpo}</div>
      <div class="ag-folha-rodape">${rodape}</div>`;
  }

  function agHtmlColar() {
    return `<textarea class="ag-input ag-txt ag-txt-msgs" id="agColar" data-foco placeholder="mo, sumiu? volta aqui no chat

bom dia, vida! já acordou?"></textarea>
      <p class="ag-dica">O que sobrar além dos horários entra no rodízio.</p>`;
  }

  function agHtmlConfig() {
    const chave = agChave();
    let modelo = '';
    try { modelo = localStorage.getItem(AG_LS_MODELO_IA) || ''; } catch (e) { /* ignora */ }
    return `
      <h3 class="ag-gav-tit">Chave da IA</h3>
      <label class="ag-campo"><span>Chave da OpenRouter <em>crie em openrouter.ai → Keys</em></span>
        <span class="ag-linha-input">
          <input class="ag-input" id="agCfgChave" type="password" autocomplete="off" spellcheck="false" placeholder="sk-or-v1-..." value="${escAttr(chave)}" data-foco>
          <button type="button" class="ag-btn ag-btn-p" data-folha="ver">Mostrar</button>
        </span>
      </label>
      <p class="ag-dica">Fica salva só neste navegador (não vai pro Firebase nem pro backup). Não mande pra ninguém: quem tiver a chave gasta seus créditos.</p>
      <label class="ag-campo"><span>Modelo da IA <em>id na OpenRouter</em></span>
        <input class="ag-input" id="agCfgModelo" spellcheck="false" placeholder="${escAttr(AG_MODELO_IA)}" value="${escAttr(modelo)}">
      </label>
      <p class="ag-dica" id="agCfgStatus" aria-live="polite"></p>
      ${ag.cfg ? `
      <h3 class="ag-gav-tit">Backup da agenda de ${esc(agPrimeiroNome(ag.modelo))}</h3>
      <p class="ag-dica">Baixa ou importa a configuração (dias, horários, personas, pacotes, mensagens) num arquivo .json.</p>
      <div class="ag-linha-botoes">
        <button type="button" class="ag-btn" data-ag="exportar">${ico('baixar')}<span>Exportar configuração</span></button>
        <button type="button" class="ag-btn" data-ag="importar">${ico('importar')}<span>Importar configuração</span></button>
      </div>` : ''}`;
  }

  // ── Persona ──
  function agHtmlPersona() {
    const c = ag.cfg;
    const atual = agPersonaAtual(c);
    const pills = `<button type="button" class="ag-pill ${atual ? '' : 'on'}" data-persona="">Sem persona</button>`
      + c.personas.map(p => `<button type="button" class="ag-pill ${atual === p ? 'on' : ''}" data-persona="${escAttr(p.id)}" title="${escAttr(p.conta ? 'Conta @' + p.conta : 'Sem conta vinculada')}">${esc(p.nome || 'Sem nome')}</button>`).join('')
      + `<button type="button" class="ag-pill ag-pill-add" data-persona="+">${ico('mais')}Nova persona</button>`;
    if (!atual) return `<div class="ag-pills">${pills}</div><p class="ag-dica">Sem persona: a IA escreve no estilo geral. Crie uma pra ela escrever com o jeito da modelo.</p>`;
    const conta = c.contaPrivacy;
    const campo = (rotulo, html) => `<label class="ag-campo"><span>${rotulo}</span>${html}</label>`;
    const val = (k) => escAttr(atual[k] || '');
    const proibida = temaProibido([atual.nome, atual.desc, atual.jeito, atual.nunca, atual.exemplos].join('\n'));
    const aviso = atual.conta && conta && atual.conta !== conta ? `${atual.nome || 'Essa persona'} é da conta @${atual.conta}, mas essa agenda é da @${conta}.` : '';
    return `
      <div class="ag-pills">${pills}</div>
      ${aviso ? `<div class="ag-aviso">${ico('alerta')}<span>${esc(aviso)}</span></div>` : ''}
      <div class="ag-persona-linha">
        ${campo('Nome', `<input class="ag-input" data-pcampo="nome" maxlength="80" placeholder="Nome" value="${val('nome')}">`)}
        ${campo('Idade', `<input class="ag-input" data-pcampo="idade" type="number" min="18" max="99" inputmode="numeric" placeholder="18+" value="${val('idade')}">`)}
      </div>
      <p class="ag-erro" id="agIdadeErro" hidden>A idade mínima é 18 anos.</p>
      <div class="ag-persona-conta">
        <span>${atual.conta ? `Conta vinculada: <b>@${esc(atual.conta)}</b>` : 'Sem conta vinculada.'}</span>
        ${conta && atual.conta !== conta ? `<button type="button" class="ag-link" data-ag="persona-vincular">${atual.conta ? 'Trocar pra' : 'Vincular a'} @${esc(conta)}</button>` : ''}
        ${atual.conta ? `<button type="button" class="ag-link" data-ag="persona-soltar">Desvincular</button>` : ''}
        ${!conta && !atual.conta ? '<span class="ag-dica-mini">Preencha o @ da conta no passo 3 pra vincular.</span>' : ''}
      </div>
      <div class="ag-aviso" id="agPersonaProibida" ${proibida ? '' : 'hidden'}>${ico('alerta')}<span>Tem tema proibido nessa persona (escola, aluna, novinha…). Tire, senão as copys podem ser descartadas.</span></div>
      ${campo('Quem ela é <em>profissão, rotina, personalidade</em>', `<textarea class="ag-input ag-txt" data-pcampo="desc" maxlength="2000" placeholder="ex. personal trainer, mora sozinha, tímida mas curiosa...">${esc(atual.desc || '')}</textarea>`)}
      ${campo('Jeito de falar <em>gírias, tom, como chama o assinante</em>', `<textarea class="ag-input ag-txt" data-pcampo="jeito" maxlength="2000" placeholder="ex. escreve tudo minúsculo, fala &quot;mozão&quot;, usa &quot;kkkk&quot;...">${esc(atual.jeito || '')}</textarea>`)}
      ${campo('Nunca diz / nunca faz', `<input class="ag-input" data-pcampo="nunca" maxlength="1000" placeholder="ex. não usa &quot;amor&quot;, não fala de dinheiro direto" value="${val('nunca')}">`)}
      ${campo('Exemplos de como ela escreve <em>um por bloco, linha em branco entre eles</em>', `<textarea class="ag-input ag-txt ag-txt-persona" data-pcampo="exemplos" maxlength="6000" placeholder="Cole 3 ou 4 mensagens reais dela. A IA imita o estilo (não copia).">${esc(atual.exemplos || '')}</textarea>`)}
      <div><button type="button" class="ag-btn" data-ag="persona-testar">${ico('brilho')}<span>Testar persona (3 mensagens)</span></button></div>
      <div id="agPersonaTeste"></div>`;
  }

  async function agTestarPersona(btn) {
    const c = ag.cfg;
    const atual = agPersonaAtual(c);
    if (!atual || !document.getElementById('agPersonaTeste')) return;
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
        : `<p class="ag-dica">Amostra (não é salva):</p>${r.copies.map(t => `<div class="ag-amostra">${esc(t)}</div>`).join('')}`
          + (r.descartadas ? `<p class="ag-dica">${r.descartadas} descartada${r.descartadas === 1 ? '' : 's'} por tema proibido.</p>` : '');
    } catch (e) {
      html = `<div class="ag-aviso">${ico('alerta')}<span>${esc(e.message)}</span></div>`;
    }
    if (ag.id !== id) return;
    const box = document.getElementById('agPersonaTeste');
    if (box) box.innerHTML = html;
    if (btn.isConnected) { btn.disabled = false; btn.innerHTML = `${ico('brilho')}<span>Testar de novo</span>`; }
  }

  // ── Roteiro ──
  function agHtmlRoteiro() {
    const c = ag.cfg;
    const horasDia = agHorariosValidos(c.horarios, c.limiteDia);
    const assuntos = horasDia.map(h => agAssuntoDaHora(c, h));
    const ativo = agModeloRoteiroAtivo(c);
    const contagem = [...new Set(assuntos)].map(a => [a, assuntos.filter(x => x === a).length]);
    const usamOferta = Object.keys(AG_ASSUNTOS).filter(a => a !== 'aquecimento' && !AG_ACERVO_PROX[a] && assuntos.includes(a));
    return `
      ${horasDia.length ? `<p class="ag-dica">Hoje: ${contagem.map(([a, n]) => `${n} ${esc(AG_ASSUNTOS[a][0])}`).join(', ')}${ativo === 'personalizado' ? ' (personalizado)' : ''}.
        ${assuntos.some(a => a !== 'aquecimento') ? `<button type="button" class="ag-link" data-ag="roteiro-limpar">Voltar tudo pra Aquecer</button>` : ''}</p>` : '<p class="ag-dica">Marque os horários no passo 1 primeiro.</p>'}
      <div class="ag-lista-op" role="list">${AG_MODELOS_ROTEIRO.map(seq => `
        <button type="button" class="ag-op ${ativo === seq ? 'on' : ''}" data-roteiro="${seq}" aria-pressed="${ativo === seq}" ${horasDia.length ? '' : 'disabled'}>
          <span class="ag-op-txt">${esc(agRotuloSeq(seq))}</span>${ativo === seq ? `<span class="ag-op-check">${ico('check')}em uso</span>` : ''}
        </button>`).join('')}</div>
      <label class="ag-campo" ${usamOferta.length ? '' : 'hidden'}><span>Detalhe da oferta <em>usado em ${esc(usamOferta.map(a => AG_ASSUNTOS[a][0]).join(', '))}</em></span>
        <input class="ag-input" data-campo="oferta" maxlength="500" placeholder="ex. chamada 10min R$50, 30% off até domingo" value="${escAttr(c.oferta)}">
      </label>`;
  }

  // ── Estilo da IA ──
  function agHtmlEstilo() {
    const c = ag.cfg;
    return `
      ${agChave() ? '' : `<div class="ag-aviso">${ico('chave')}<span>Falta a chave da OpenRouter pra IA funcionar.</span><button type="button" class="ag-link" data-ag="gaveta" data-gaveta="config">Colocar a chave</button></div>`}
      <div class="ag-campo"><span>Jeito de chamar <em>só nos horários de Aquecer</em></span>
        <div class="ag-pills">${Object.entries(AG_TIPOS_COPY).map(([id, [rot]]) => `<button type="button" class="ag-pill ${c.tiposCopy.includes(id) ? 'on' : ''}" data-tipo="${id}" aria-pressed="${c.tiposCopy.includes(id)}">${rot}</button>`).join('')}</div>
      </div>
      <div class="ag-campo"><span>Emojis</span>
        <div class="ag-pills">${Object.entries(AG_EMOJI).map(([id, [rot]]) => `<button type="button" class="ag-pill ${c.emojiCopy === id ? 'on' : ''}" data-emoji="${id}" aria-pressed="${c.emojiCopy === id}">${rot}</button>`).join('')}</div>
      </div>
      <label class="ag-campo"><span>Tema <em>opcional</em></span><input class="ag-input" data-campo="briefing" maxlength="500" placeholder="ex. foto nova de lingerie, promo no PPV..." value="${escAttr(c.briefing)}"></label>`;
  }

  // ── Prompt ──
  function agHtmlPrompt() {
    const c = ag.cfg;
    return `<textarea class="ag-input ag-txt ag-txt-prompt" data-campo="prompt" spellcheck="false" aria-label="Prompt da IA" data-foco>${esc(c.prompt || AG_PROMPT_PADRAO)}</textarea>
      <p class="ag-dica-mini">A regra de segurança (só adultas, 18+) sempre vai junto, mesmo editando.</p>`;
  }

  // ── Pacotes ──
  function agHtmlPacotes() {
    const c = ag.cfg;
    const nome = esc(agPrimeiroNome(ag.modelo));
    const linhas = c.pacotesReg.map((p, i) => `
      <div class="ag-pacote ${p.usar ? '' : 'desligado'}" data-pi="${i}">
        <div class="ag-pacote-topo">
          <label class="ag-pacote-usar"><input type="checkbox" class="ag-check" data-pc="usar" ${p.usar ? 'checked' : ''}><span>No rodízio</span></label>
          <button type="button" class="ag-btn ag-btn-p" data-ag="pacote-tipo" title="Clique pra trocar">${ico(p.tipo === 'video' ? 'video' : 'pacote')}<span>${p.tipo === 'video' ? 'Vídeo' : 'Pack'}</span></button>
          <button type="button" class="ag-link ag-perigo-txt" data-ag="pacote-apagar">Apagar</button>
        </div>
        <input class="ag-input" data-pc="apelido" maxlength="80" placeholder="Apelido (como aparece na copy)" value="${escAttr(p.apelido)}" aria-label="Apelido">
        <div class="ag-pacote-sub">
          <input class="ag-input" data-pc="preco" maxlength="20" placeholder="R$ 39,99" value="${escAttr(p.preco)}" aria-label="Preço">
          <input class="ag-input" data-pc="nome" maxlength="200" placeholder="Nome no Acervo" value="${escAttr(p.nome)}" title="${escAttr('Nome no Acervo: ' + p.nome)}" aria-label="Nome no Acervo">
        </div>
      </div>`).join('');
    const horasDia = agHorariosValidos(c.horarios, c.limiteDia);
    const assuntos = horasDia.map(h => agAssuntoDaHora(c, h));
    const prox = Object.keys(AG_ACERVO_PROX).filter(a => assuntos.includes(a)).map((a) => {
      const lista = agListaPacotes(c, a);
      return `<p class="ag-prox">${lista.length
        ? `${a === 'video' ? 'Vídeos' : 'Packs'}: ${esc(lista.map(agRotuloPacote).join(' → '))} · próximo: <b>${esc(agRotuloPacote(lista[agProxRodizio(c, a) % lista.length]))}</b>`
        : `Marque pelo menos um ${a === 'video' ? 'vídeo' : 'pack'} no rodízio.`}</p>`;
    }).join('');
    const ac = ag.acervo;
    const itensAc = agItensAcervo();
    let acervo;
    if (ac === undefined) acervo = `<p class="ag-dica">Olhando o Acervo…</p>`;
    else if (!ac || !itensAc.length) acervo = `<p class="ag-dica">${ag.acervoMsg ? esc(ag.acervoMsg) : 'Abra a Privacy dessa modelo com o Agendador pra puxar os pacotes do Acervo.'}</p>`;
    else {
      const em = agDataTs(ac.em);
      acervo = `<p class="ag-dica">${itensAc.length} ${itensAc.length === 1 ? 'pacote' : 'pacotes'} no Acervo${em ? ` (lido ${esc(em)})` : ''}.</p><div><button type="button" class="ag-btn" data-ag="acervo">${ico('atualizar')}<span>Atualizar do Acervo</span></button></div>`;
    }
    return `
      <p class="ag-dica">Os packs e vídeos de ${nome}. O nome tem que ser igual ao do Acervo › Pacotes da Privacy.</p>
      <div class="ag-pacotes">${linhas || `<p class="ag-vazio">Nenhum pacote de ${nome} ainda.</p>`}</div>
      <div class="ag-linha-botoes">
        <button type="button" class="ag-btn" data-ag="pacote-novo" data-tipo-novo="pack">${ico('mais')}<span>Adicionar pack</span></button>
        <button type="button" class="ag-btn" data-ag="pacote-novo" data-tipo-novo="video">${ico('mais')}<span>Adicionar vídeo</span></button>
      </div>
      ${prox ? `<div class="ag-proxs">${prox}</div>` : '<p class="ag-dica-mini">Nenhum horário de Pack ou Vídeo no roteiro.</p>'}
      <h3 class="ag-gav-tit">Acervo da Privacy</h3>
      ${acervo}
      <p class="ag-dica" id="agAcervoStatus"></p>`;
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
    if (mudou && ag.gaveta === 'pacotes' && ag.cfg && !document.querySelector('#agFolha .ag-pacote input:focus')) agRenderGaveta();
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
    agRenderTudo();
    const st = document.getElementById('agAcervoStatus');
    if (st) st.textContent = novos || atualizados
      ? `${novos} novo(s) adicionado(s) (fora do rodízio: revise e marque os que quer), ${atualizados} preço(s) atualizado(s).`
      : 'Já estava tudo igual ao Acervo.';
  }

  // ═══════════════════════════════════════════════ GERAR / PREENCHER COPYS ═══

  async function agGerar(todas) {
    const c = ag.cfg;
    if (!c || ag.gerando) return;
    const slots = agSlotsTexto(c);
    if (!slots.length) {
      return agStatus(agHorariosValidos(c.horarios, c.limiteDia).length
        ? 'Todos os horários são de pack: o texto vai o do próprio pacote, não precisa gerar.'
        : 'Marque dias e horários em Quando.', 'aviso');
    }
    const mapa = agMsgsMapa(c);
    const nCom = slots.filter(s => agMsgDoHorario(mapa, s)).length;
    if (todas === undefined) todas = !nCom || nCom === slots.length;
    if (todas && nCom && !confirm(`Refazer as ${slots.length} mensagens?\nAs ${nCom} que você já tem (inclusive as que editou) vão ser substituídas.`)) return;
    const alvo = todas ? slots : slots.filter(s => !agMsgDoHorario(mapa, s));
    const id = ag.id;
    ag.gerando = true;
    const rotular = (t) => { const b = document.getElementById('agGerar'); if (b) { b.disabled = true; b.innerHTML = `${ico('carregando', 'ag-gira')}<span>${esc(t)}</span>`; } };
    rotular(`Gerando ${alvo.length} copys…`);
    agAtualizarCopyInfo();
    agStatus('');
    try {
      const r = await agPedirCopies(c, alvo, todas ? [] : agMsgsPool(mapa), (feitas, total) => { if (ag.id === id && feitas) rotular(`Gerando copys… ${feitas} de ${total}`); });
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
        agStatus((r.aviso || `${r.copies.length} copys geradas: revise na linha do tempo e programe`) + desc, r.aviso ? 'aviso' : 'ok');
        agSalvar();
      }
    } catch (e) {
      if (ag.id === id) agStatus(e.message, 'erro');
    } finally {
      if (ag.id === id) {
        ag.gerando = false;
        agRenderTimeline();
        agAtualizar();
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
        if (ta) { ta.value = r.copies[0]; agAutoAltura(ta); }
        box.classList.toggle('proibida', temaProibido(r.copies[0]));
        agSalvar();
      }
    } catch (e) {
      agStatus(e.message, 'erro');
    }
    if (btn.isConnected) { btn.disabled = false; btn.innerHTML = `${ico('atualizar')}<span>Refazer</span>`; }
  }

  function agColar() {
    const c = ag.cfg;
    const ta = document.getElementById('agColar');
    const textos = agSepararMensagens(ta.value);
    if (!textos.length) return;
    const slots = agSlotsTexto(c);
    if (!slots.length) return agStatus('Marque dias e horários em Quando.', 'aviso');
    const mapa = agMsgsMapa(c);
    slots.forEach((s, i) => { if (textos[i]) mapa[agChaveMsg(s)] = textos[i]; });
    textos.slice(slots.length).forEach((t, i) => { mapa[`extra ${Date.now()}-${i}`] = t; });
    const proib = textos.filter(t => temaProibido(t)).length;
    ta.value = '';
    agFecharFolha();
    agSalvar();
    agRenderTimeline();
    agAtualizar();
    agStatus(`${Math.min(textos.length, slots.length)} horários preenchidos`
      + (textos.length > slots.length ? ` · ${textos.length - slots.length} sobraram e entram no rodízio` : '')
      + (proib ? ` · ${proib} com tema proibido (não vão pra fila)` : ''), proib ? 'aviso' : 'ok');
  }

  // ═══════════════════════════════════════════════ COPYS REAIS (pelo assunto, escolher, misturar, Gerador) ═══

  // Categorias do Synora que combinam com cada assunto do roteiro (pack/vídeo não usam texto)
  const AG_CATS_ASSUNTO = {
    aquecimento: ['Reengajamento', 'Disparos em massa', 'Boas-vindas'],
    chamada: ['Chamadas', 'Promoções'],
    desc_chamada: ['Chamadas', 'Promoções'],
    sexting: ['Promoções', 'Chamadas'],
    desc_sexting: ['Promoções', 'Chamadas']
  };

  // Copys reais dessa modelo que ainda não saíram e não estão na agenda (embaralhadas)
  function agPoolReais(c, mapa) {
    const fora = new Set([...(c.historicoCopies || []), ...agMsgsPool(mapa)].map(t => normTexto(blocoCopy(t))));
    const vistos = new Set();
    return embaralhar(copysDaModelo(ag.modelo)
      .map(x => ({ t: blocoCopy(x.texto || ''), cat: x.categoria || 'Outras' }))
      .filter((x) => {
        const k = normTexto(x.t);
        if (!x.t || fora.has(k) || vistos.has(k) || temaProibido(x.t)) return false;
        vistos.add(k);
        return true;
      }));
  }

  // Tira do pool uma copy pro assunto: primeiro das categorias dele, senão qualquer uma
  function agTirarReal(pool, assunto) {
    const cats = AG_CATS_ASSUNTO[assunto] || [];
    let i = pool.findIndex(x => cats.includes(x.cat));
    if (i < 0) i = pool.length ? 0 : -1;
    return i < 0 ? null : pool.splice(i, 1)[0];
  }

  function agPreencherReais(c, mapa, slots) {
    const pool = agPoolReais(c, mapa);
    let n = 0;
    for (const s of slots) {
      const x = agTirarReal(pool, s.assunto);
      if (!x) break;
      mapa[agChaveMsg(s)] = x.t;
      n++;
    }
    return n;
  }

  // Preenche os horários vazios com copys reais da modelo, pelo assunto de cada horário
  function agUsarReais() {
    const c = ag.cfg;
    const slots = agSlotsTexto(c);
    if (!slots.length) return agStatus('Marque dias e horários em Quando.', 'aviso');
    const mapa = agMsgsMapa(c);
    const vazios = slots.filter(s => !agMsgDoHorario(mapa, s));
    if (!vazios.length) return agStatus('Todos os horários já têm texto. Apague algum pra preencher com copy real.', 'aviso');
    const n = agPreencherReais(c, mapa, vazios);
    if (!n) return agStatus('Não sobrou copy real dessa modelo que ainda não saiu. Gere com a IA.', 'aviso');
    agSalvar();
    agRenderTimeline();
    agAtualizar();
    agStatus(`${n} ${n === 1 ? 'horário preenchido' : 'horários preenchidos'} com copys reais${n < vazios.length ? ` · faltaram ${vazios.length - n} (não tem mais copy nova dela)` : ''}`, n < vazios.length ? 'aviso' : 'ok');
  }

  // Metade dos vazios (arredondando pra cima) com copys reais, o resto pela IA com exemplos reais dela
  async function agMisturar() {
    const c = ag.cfg;
    if (!c || ag.gerando) return;
    const slots = agSlotsTexto(c);
    if (!slots.length) return agStatus('Marque dias e horários em Quando.', 'aviso');
    const mapa = agMsgsMapa(c);
    const vazios = slots.filter(s => !agMsgDoHorario(mapa, s));
    if (!vazios.length) return agStatus('Todos os horários já têm texto. Apague algum pra misturar.', 'aviso');
    const pool = agPoolReais(c, mapa);
    let nReais = 0;
    const praIA = [];
    vazios.forEach((s, i) => {
      // intercala: um real, um da IA (os pares ficam com as reais → metade arredondada pra cima)
      const x = i % 2 === 0 ? agTirarReal(pool, s.assunto) : null;
      if (x) { mapa[agChaveMsg(s)] = x.t; nReais++; } else praIA.push(s);
    });
    const exemplos = embaralhar(copysDaModelo(ag.modelo).map(x => blocoCopy(x.texto || '')).filter(t => t && !temaProibido(t))).slice(0, 12);
    if (nReais) { agSalvar(); agRenderTimeline(); }
    if (!praIA.length) { agAtualizar(); return agStatus(`${nReais} reais + 0 da IA`, 'ok'); }
    const id = ag.id;
    ag.gerando = true;
    const btn = document.getElementById('agMisturar');
    const rotular = (t) => { if (btn && btn.isConnected) { btn.disabled = true; btn.innerHTML = `${ico('carregando', 'ag-gira')}<span>${esc(t)}</span>`; } };
    rotular(`Gerando ${praIA.length} com a IA…`);
    ['agGerar', 'agReais'].forEach((x) => { const b = document.getElementById(x); if (b) b.disabled = true; });
    agStatus('');
    try {
      const r = await agPedirCopies(c, praIA, agMsgsPool(mapa), (feitas, total) => { if (ag.id === id && feitas) rotular(`Gerando… ${feitas} de ${total}`); }, exemplos);
      if (ag.id !== id || ag.cfg !== c) return;
      if (r.erro) agStatus(`${nReais} reais + 0 da IA · ${r.erro}`, 'erro');
      else {
        r.copies.forEach((t, i) => { if (praIA[i]) mapa[agChaveMsg(praIA[i])] = t; });
        const desc = r.descartadas ? ` · ${r.descartadas} descartada${r.descartadas === 1 ? '' : 's'} por tema proibido` : '';
        agStatus(`${nReais} reais + ${Math.min(r.copies.length, praIA.length)} da IA` + (r.aviso ? ` · ${r.aviso}` : '') + desc, r.aviso ? 'aviso' : 'ok');
        agSalvar();
      }
    } catch (e) {
      if (ag.id === id) agStatus(e.message, 'erro');
    } finally {
      if (ag.id === id) { ag.gerando = false; agRenderTimeline(); agAtualizar(); }
    }
  }

  // ── Escolher copy pra um horário ──
  function agAbrirEscolher(box) {
    const c = ag.cfg;
    const slot = agSlotsTexto(c).find(s => agChaveMsg(s) === box.dataset.chave);
    if (!slot) return;
    const existentes = new Set(copysDaModelo(ag.modelo).map(x => x.categoria || 'Outras'));
    const cats = (AG_CATS_ASSUNTO[slot.assunto] || []).filter(x => existentes.has(x));
    ag.escolher = { chave: agChaveMsg(slot), hora: slot.hora, assunto: slot.assunto, busca: '', cats: cats.length ? new Set(cats) : null, lista: [] };
    agAbrirGaveta('escolher');
    ag.gaveta = 'escolher';
  }

  function agCatsDaModelo() {
    const porCat = {};
    copysDaModelo(ag.modelo).forEach((x) => { const k = x.categoria || 'Outras'; porCat[k] = (porCat[k] || 0) + 1; });
    const ordem = CATEGORIAS_COPYS.filter(k => porCat[k]).concat(Object.keys(porCat).filter(k => !CATEGORIAS_COPYS.includes(k)));
    return { porCat, ordem };
  }

  function agHtmlEscolher() {
    return `<label class="ag-campo"><span>Buscar</span><input class="ag-input" type="search" data-esc-busca placeholder="Buscar no texto das copys…" autocomplete="off" value="${escAttr(ag.escolher ? ag.escolher.busca : '')}" data-foco></label>
      <div class="ag-pills ag-esc-cats" id="agEscCats">${agHtmlEscCats()}</div>
      <div class="ag-esc-lista" id="agEscLista">${agHtmlEscLista()}</div>`;
  }

  function agHtmlEscCats() {
    const e = ag.escolher;
    if (!e) return '';
    const { porCat, ordem } = agCatsDaModelo();
    return `<button type="button" class="ag-pill ${e.cats ? '' : 'on'}" data-esc-cat="" aria-pressed="${!e.cats}">Todas</button>`
      + ordem.map(k => `<button type="button" class="ag-pill ${e.cats && e.cats.has(k) ? 'on' : ''}" data-esc-cat="${escAttr(k)}" aria-pressed="${!!(e.cats && e.cats.has(k))}">${esc(k)} <small>${porCat[k]}</small></button>`).join('');
  }

  function agHtmlEscLista() {
    const e = ag.escolher;
    if (!e || !ag.cfg) return '';
    const usadas = new Set((ag.cfg.historicoCopies || []).map(t => normTexto(blocoCopy(t))));
    const busca = normTexto(e.busca);
    const vistos = new Set();
    const lista = copysDaModelo(ag.modelo).filter((x) => {
      const k = normTexto(x.texto);
      if (vistos.has(k)) return false;
      vistos.add(k);
      if (e.cats && !e.cats.has(x.categoria || 'Outras')) return false;
      return !busca || k.includes(busca);
    });
    e.lista = lista;
    if (!lista.length) return `<p class="ag-dica">Nenhuma copy com esse filtro.</p>`;
    const MAX = 150;
    return `<p class="ag-dica-mini">${lista.length} ${lista.length === 1 ? 'copy' : 'copys'}${lista.length > MAX ? ` · mostrando as ${MAX} primeiras, use a busca` : ''}</p>`
      + lista.slice(0, MAX).map((x, i) => {
        const usada = usadas.has(normTexto(blocoCopy(x.texto)));
        return `<button type="button" class="ag-esc-item" data-esc-i="${i}">
          <span class="ag-esc-meta"><span>${esc(x.categoria || 'Outras')}</span>${usada ? '<span class="ag-esc-usada">já usada</span>' : ''}</span>
          <span class="ag-esc-txt">${esc(blocoCopy(x.texto))}</span>
        </button>`;
      }).join('');
  }

  function agEscolherCopy(i) {
    const e = ag.escolher;
    const x = e && e.lista[i];
    if (!x || !ag.cfg) return;
    agMsgsMapa(ag.cfg)[e.chave] = blocoCopy(x.texto);
    agSalvar();
    agFecharFolha();
    agRenderTimeline();
    agAtualizar();
    agStatus(`Copy escolhida pras ${e.hora}.`, 'ok');
  }

  // ── Gerador → Agenda ──
  // Chamado pelo botão "Mandar pra Agenda" do Gerador: coloca as copys nos horários vazios da agenda da modelo
  async function agendaReceberCopys(modelo, textos) {
    const lista = (textos || []).map(t => blocoCopy(t || '')).filter(Boolean);
    if (!modelo || !lista.length) { toast('Não tem copy pra mandar'); return 0; }
    if (!agUser()) { toast('Entre de novo pra usar a Agenda'); return 0; }
    try { localStorage.setItem(AG_LS_MODELO, modelo); } catch (e) { /* ignora */ }
    const carga = ag.modelo === modelo && ag.cfg ? null : agCarregarModelo(modelo);
    if (typeof irParaTab === 'function') irParaTab('agenda');
    if (carga) await carga;
    if (ag.modelo !== modelo || !ag.cfg) { toast('Não deu pra abrir a agenda dessa modelo'); return 0; }
    agMostrarAba('mensagens');
    const c = ag.cfg;
    const mapa = agMsgsMapa(c);
    const slots = agSlotsTexto(c);
    let alvo = slots.filter(s => !agMsgDoHorario(mapa, s));
    if (slots.length && !alvo.length) {
      if (!confirm(`Todos os ${slots.length} horários de ${agPrimeiroNome(modelo)} já têm mensagem.\nTrocar pelas ${lista.length} copys do Gerador, na ordem dos horários?`)) {
        agStatus('As copys do Gerador não foram usadas: todos os horários já tinham mensagem.', 'aviso');
        return 0;
      }
      alvo = slots;
    }
    alvo.forEach((s, i) => { if (lista[i]) mapa[agChaveMsg(s)] = lista[i]; });
    const sobra = lista.slice(alvo.length);
    sobra.forEach((t, i) => { mapa[`extra ${Date.now()}-${i}`] = t; });
    agSalvar();
    agRenderTudo();
    const n = lista.length;
    toast(`${n} ${n === 1 ? 'copy da Gerador foi' : 'copys da Gerador foram'} pra Agenda`);
    if (!slots.length) agStatus(`Ainda não tem horário marcado: as ${n} copys ficaram guardadas e entram em rodízio quando você escolher os dias e horários.`, 'aviso');
    else if (sobra.length) agStatus(`${Math.min(n, alvo.length)} horários preenchidos · ${sobra.length} sobraram e entram no rodízio.`, 'aviso');
    else agStatus(`${n} horários preenchidos com as copys do Gerador.`, 'ok');
    return n;
  }

  // ═══════════════════════════════════════════════ PRÉVIA + FILA ═══

  function agAbrirFolha(html, classe) {
    agFecharFolha();
    const fundo = document.createElement('div');
    fundo.className = 'ag-folha-fundo' + (/ag-folha-lado/.test(classe || '') ? ' lado' : '');
    fundo.id = 'agFolha';
    fundo.innerHTML = `<div class="ag-folha ${classe || ''}" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(fundo);
    document.body.classList.add('ag-folha-aberta');
    fundo.addEventListener('click', agCliqueFolha);
    fundo.addEventListener('input', agDigitou);
    fundo.addEventListener('change', agMudou);
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
    ag.gaveta = null;
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.getElementById('agFolha')) agFecharFolha(); });

  function agAbrirPrevia() {
    const c = ag.cfg;
    if (!c) return;
    const prep = agPreparar(c);
    if (prep.erro) {
      agStatus(prep.erro, 'aviso', 'prog');
      return;
    }
    agStatus('', '', 'prog');
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
        <button type="button" class="ag-btn ag-btn-p" data-folha="fechar">Fechar</button>
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
        <button type="button" class="gr-sortear ag-btn-fila" data-folha="mandar" data-foco>${ico(c.teste ? 'frasco' : 'enviar')}<span>${c.teste ? 'Agendar teste na Privacy' : 'Agendar na Privacy'}</span></button>
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
    agMostrarAba('fila', true);
    toast((c.teste ? 'Teste mandado' : `${itens.length} ${itens.length === 1 ? 'disparo mandado' : 'disparos mandados'}`) + ' pro Agendador. Deixe a Privacy da modelo aberta: ele começa sozinho.');
    agStatus(`Na fila: a extensão agenda quando abrir a Privacy${c.contaPrivacy ? ` da @${c.contaPrivacy}` : ' dessa modelo'}.`, 'ok', 'prog');
    agRenderTudo();
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
    agContarFila();
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
    // Editor de persona e prompt ficam na folha: os outros botões seguem o fluxo normal
    if (!b) { agClique(e); return; }
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
      if (ag.cfg) agRenderTudo();
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
    if (mod) { agListaModelos(false); if (mod.dataset.agModelo !== ag.modelo || !ag.cfg) agCarregarModelo(mod.dataset.agModelo); return; }
    if (t.closest('#agModeloBtn')) { agListaModelos(); return; }
    const abaBtn = t.closest('[data-ag-aba]');
    if (abaBtn) { agMostrarAba(abaBtn.dataset.agAba); return; }
    if (t.closest('#agProgramar')) { agAbrirPrevia(); return; }
    const c = ag.cfg;
    const acaoEl = t.closest('[data-ag]');
    const acao = acaoEl && acaoEl.dataset.ag;
    if (acao === 'config') { agAbrirConfig(); return; }
    if (!c) return;
    if (acao === 'aba') { agMostrarAba(acaoEl.dataset.aba, true); return; }
    if (acao === 'gaveta') { agAbrirGaveta(acaoEl.dataset.gaveta); return; }
    if (acao === 'ir') { agIr(acaoEl.dataset.ir); return; }
    if (acao === 'exportar') return agExportar();
    if (acao === 'importar') return document.getElementById('agArquivo').click();

    // Quando
    const dia = t.closest('[data-dia]');
    if (dia) {
      const iso = dia.dataset.dia;
      c.dias = c.dias.includes(iso) ? c.dias.filter(d => d !== iso) : c.dias.concat(iso).sort();
      agSalvar(); agRenderTudo(); return;
    }
    const atalho = t.closest('[data-atalho]');
    if (atalho) { agAtalhoDias(atalho.dataset.atalho); agSalvar(); agRenderTudo(); return; }
    const hora = t.closest('[data-hora]');
    if (hora) { agAlternarHora(hora.dataset.hora); agSalvar(); agRenderTudo(); return; }
    if (acao === 'agit-toggle') { ag.agitAberto = !ag.agitAberto; agRenderQuando(); agAtualizar(); return; }
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
      agSalvar(); agRenderGaveta(); agAtualizar();
      if (id === '+') { const n = document.querySelector('#agFolha [data-pcampo="nome"]'); if (n) n.select(); }
      return;
    }
    if (acao === 'persona-apagar') {
      const atual = agPersonaAtual(c);
      if (!atual || !confirm(`Apagar a persona "${atual.nome || 'sem nome'}"?`)) return;
      c.personas = c.personas.filter(p => p !== atual);
      c.persona = '';
      agSalvar(); agRenderGaveta(); agAtualizar(); return;
    }
    if (acao === 'persona-vincular' || acao === 'persona-soltar') {
      const atual = agPersonaAtual(c);
      if (!atual) return;
      if (acao === 'persona-vincular') { c.personas.forEach(p => { if (p.conta === c.contaPrivacy) p.conta = ''; }); atual.conta = c.contaPrivacy; }
      else atual.conta = '';
      agSalvar(); agRenderGaveta(); agAtualizar(); return;
    }
    if (acao === 'persona-testar') return agTestarPersona(acaoEl);

    // Estilo da IA
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
      emo.parentElement.querySelectorAll('[data-emoji]').forEach(b => { b.classList.toggle('on', b === emo); b.setAttribute('aria-pressed', b === emo); });
      agSalvar(); return;
    }
    if (acao === 'prompt-restaurar') {
      const ta = document.querySelector('#agFolha [data-campo="prompt"]');
      if (c.prompt && !confirm('Voltar pro prompt padrão? O prompt que você editou vai ser perdido.')) return;
      c.prompt = '';
      if (ta) ta.value = AG_PROMPT_PADRAO;
      agSalvar(); agAtualizar(); return;
    }

    // Copys (resumo e linha do tempo)
    if (acao === 'gerar') return agGerar();
    if (acao === 'refazer') return agGerar(true);
    if (acao === 'reais') return agUsarReais();
    if (acao === 'misturar') return agMisturar();
    const vista = t.closest('[data-ag-vista]');
    if (vista) { agMostrarVista(vista.dataset.agVista); return; }
    const balao = t.closest('[data-chat-idx]');
    if (balao) { agIrProSlot(balao.dataset.chatIdx); return; }
    if (acao === 'escolher') { const box = acaoEl.closest('[data-chave]'); if (box) agAbrirEscolher(box); return; }
    const escCat = t.closest('[data-esc-cat]');
    if (escCat && ag.escolher) {
      const k = escCat.dataset.escCat;
      if (!k) ag.escolher.cats = null;
      else {
        const set = new Set(ag.escolher.cats || []);
        if (set.has(k)) set.delete(k); else set.add(k);
        ag.escolher.cats = set.size ? set : null;
      }
      const cats = document.getElementById('agEscCats'); if (cats) cats.innerHTML = agHtmlEscCats();
      const l = document.getElementById('agEscLista'); if (l) l.innerHTML = agHtmlEscLista();
      return;
    }
    const escItem = t.closest('[data-esc-i]');
    if (escItem) { agEscolherCopy(Number(escItem.dataset.escI)); return; }
    if (acao === 'refazer-um') return agRefazerUm(acaoEl);
    if (acao === 'colar') return agColar();
    if (acao === 'hist-limpar') {
      if (!confirm('Limpar o histórico? A IA vai poder repetir copys que já saíram.')) return;
      c.historicoCopies = [];
      agSalvar(); return;
    }

    // Roteiro
    const rotModelo = t.closest('[data-roteiro]');
    if (rotModelo) {
      c.roteiroHoras = agDistribuirRoteiro(rotModelo.dataset.roteiro.split(','), agHorariosValidos(c.horarios, c.limiteDia));
      agSalvar(); agRenderTudo(); return;
    }
    if (acao === 'roteiro-limpar') { c.roteiroHoras = {}; agSalvar(); agRenderTudo(); return; }

    // Pacotes
    if (acao === 'pacote-novo') {
      c.pacotesReg.push({ tipo: acaoEl.dataset.tipoNovo === 'video' ? 'video' : 'pack', apelido: '', preco: '', nome: '', usar: true });
      agSalvar(); agRenderTudo();
      const ultimos = document.querySelectorAll('#agFolha [data-pc="apelido"]');
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
      agSalvar(); agRenderTudo(); return;
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
    if (t.hasAttribute('data-esc-busca') && ag.escolher) {
      ag.escolher.busca = t.value;
      const l = document.getElementById('agEscLista'); if (l) l.innerHTML = agHtmlEscLista();
      return;
    }
    const campo = t.dataset.campo;
    if (campo === 'limiteDia') {
      if (t.value === '') return;
      c.limiteDia = Math.min(50, Math.max(1, parseInt(t.value) || 1));
      agSalvar(); agRenderTimeline(); return;
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
      const aviso = document.getElementById('agPersonaProibida');
      if (aviso) aviso.hidden = !temaProibido([atual.nome, atual.desc, atual.jeito, atual.nunca, atual.exemplos].join('\n'));
      agSalvar();
      return;
    }
    if (t.hasAttribute('data-msg')) {
      const box = t.closest('[data-chave]');
      const mapa = agMsgsMapa(c);
      if (t.value.trim()) mapa[box.dataset.chave] = t.value; else delete mapa[box.dataset.chave];
      box.classList.toggle('proibida', !!t.value.trim() && temaProibido(t.value));
      agAutoAltura(t);
      agSalvar(); return;
    }
    const pcp = t.dataset.pc;
    if (pcp && pcp !== 'usar') {
      const linha = t.closest('[data-pi]');
      const p = c.pacotesReg[Number(linha.dataset.pi)];
      if (!p) return;
      p[pcp] = t.value.trim();
      agSalvar(); agRenderTimeline();
    }
  }

  function agMudou(e) {
    const t = e.target;
    const c = ag.cfg;
    if (!c) return;
    if (t.id === 'agTeste') { c.teste = t.checked; agSalvar(); return; }
    if (t.id === 'agConta') { t.value = c.contaPrivacy || ''; return; }
    if (t.dataset.assuntoHora) {
      c.roteiroHoras = { ...(c.roteiroHoras || {}), [t.dataset.assuntoHora]: AG_ASSUNTOS[t.value] ? t.value : 'aquecimento' };
      agSalvar(); agRenderTudo();
      agStatus(`Assunto das ${t.dataset.assuntoHora} agora é ${AG_ASSUNTOS[t.value][0]} em todos os dias.`, 'ok');
      return;
    }
    if (t.dataset.pc === 'usar') {
      const linha = t.closest('[data-pi]');
      const p = c.pacotesReg[Number(linha.dataset.pi)];
      if (!p) return;
      p.usar = t.checked;
      linha.classList.toggle('desligado', !t.checked);
      agSalvar(); agRenderTimeline(); return;
    }
    if (t.dataset.campo === 'limiteDia') { t.value = String(c.limiteDia); agRenderTudo(); }
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
  window.agendaReceberCopys = agendaReceberCopys;
  // Pra testes no console
  window.AgendaSynora = { estado: ag, preparar: agPreparar, montarPlano: agMontarPlano, sanitizar: agSanitizar, montarCfg: agMontarCfg, prompt: () => AG_PROMPT_PADRAO + AG_REGRA_SEGURANCA };
})();
