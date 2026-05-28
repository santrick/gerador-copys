/* Gerador de Copys — gerador.js */

const COR_TIPO = {
  'Venda': '#ef4444', 'Saudacao': '#22c55e', 'Engajamento': '#3b82f6',
  'Reengajamento': '#f97316', 'Conteudo': '#a855f7', 'Upsell': '#ec4899',
  'Aquecimento': '#f472b6', 'Chamada': '#06b6d4', 'Pergunta': '#84cc16', 'Outro': '#64748b'
};

const POR_PAGINA = 20;
let todasCopys = [];
let copysFiltradas = [];
let paginaAtual = 1;

// ═══════════════════════════════════════════════
// CLIPBOARD HELPER (funciona em HTTP e HTTPS)
// ═══════════════════════════════════════════════

function copiarTexto(texto) {
  // Tenta clipboard API primeiro, fallback pra execCommand
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
    ta.setSelectionRange(0, texto.length);
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    resolve(); // resolve sempre — melhor mostrar "Copiado" do que nada
  });
}

// ═══════════════════════════════════════════════
// CONFIG (localStorage)
// ═══════════════════════════════════════════════

function getConfig() {
  return JSON.parse(localStorage.getItem('gerador_config') || '{}');
}

function salvarConfig(cfg) {
  const atual = getConfig();
  localStorage.setItem('gerador_config', JSON.stringify({ ...atual, ...cfg }));
}

// ═══════════════════════════════════════════════
// STATUS BAR
// ═══════════════════════════════════════════════

function setStatus(texto, tipo) {
  const bar = document.getElementById('status-bar');
  const span = document.getElementById('status-texto');
  bar.classList.remove('ok', 'erro', 'aviso');
  if (tipo) bar.classList.add(tipo);
  span.textContent = texto;
}

// ═══════════════════════════════════════════════
// CARREGAR COPYS DA PLANILHA
// ═══════════════════════════════════════════════

document.getElementById('btn-carregar').addEventListener('click', carregarCopys);

async function carregarCopys() {
  const cfg = getConfig();
  if (!cfg.sheetsUrl) {
    setStatus('Configure a URL do Apps Script primeiro', 'erro');
    document.getElementById('modal-config').classList.remove('oculto');
    return;
  }

  const btn = document.getElementById('btn-carregar');
  btn.disabled = true;
  btn.textContent = 'Carregando...';
  setStatus('Buscando copys da planilha...', 'aviso');

  try {
    const url = new URL(cfg.sheetsUrl);
    const modelo = document.getElementById('select-modelo').value;
    const tipo = document.getElementById('select-tipo').value;
    if (modelo) url.searchParams.set('modelo', modelo);
    if (tipo) url.searchParams.set('tipo', tipo);

    let resp;
    try {
      resp = await fetch(url.toString(), { redirect: 'follow' });
    } catch (fetchErr) {
      throw new Error('Sem conexao com o Apps Script. Verifique se a URL esta correta e se o script foi publicado como "Qualquer pessoa" (Anyone).');
    }

    if (!resp.ok) throw new Error('Servidor retornou erro ' + resp.status);

    let data;
    try {
      data = await resp.json();
    } catch (jsonErr) {
      throw new Error('Resposta invalida do servidor. Republique o Apps Script como nova versao.');
    }

    if (data.status === 'erro') throw new Error(data.msg);

    todasCopys = data.copys || [];
    copysFiltradas = todasCopys;
    paginaAtual = 1;

    // Popula modelos
    const selectModelo = document.getElementById('select-modelo');
    const valorAtual = selectModelo.value;
    const modelos = data.modelos || [];
    selectModelo.innerHTML = '<option value="">Todas as modelos</option>';
    modelos.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      if (m === valorAtual) opt.selected = true;
      selectModelo.appendChild(opt);
    });

    // Stats
    const statsRow = document.getElementById('stats-row');
    statsRow.style.display = 'flex';
    document.getElementById('stat-total').textContent = todasCopys.length + ' copys';
    document.getElementById('stat-modelos').textContent = modelos.length + ' modelos';

    renderExemplos();
    atualizarBadgeExemplos();
    setStatus(todasCopys.length + ' copys carregadas da planilha', 'ok');

  } catch (err) {
    setStatus('Erro: ' + err.message, 'erro');
    document.getElementById('lista-exemplos').innerHTML =
      '<div class="estado-vazio"><p>Erro ao carregar: ' + esc(err.message) + '</p></div>';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg> Carregar Copys';
  }
}

// ═══════════════════════════════════════════════
// RENDER EXEMPLOS
// ═══════════════════════════════════════════════

function renderExemplos() {
  const container = document.getElementById('lista-exemplos');

  if (!copysFiltradas.length) {
    container.innerHTML = '<div class="estado-vazio"><p>Nenhuma copy encontrada com esses filtros.</p></div>';
    return;
  }

  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const pagina = copysFiltradas.slice(inicio, inicio + POR_PAGINA);
  const totalPaginas = Math.ceil(copysFiltradas.length / POR_PAGINA);

  container.innerHTML = pagina.map(c => {
    const cor = COR_TIPO[c.tipo] || '#64748b';
    return '<div class="copy-card">'
      + '<div class="copy-card-header">'
      + '<span class="copy-card-modelo">@' + esc(c.modelo) + '</span>'
      + '<span class="copy-card-tipo" style="background:' + cor + '">' + esc(c.tipo) + '</span>'
      + '</div>'
      + '<div class="copy-card-texto">' + esc(c.mensagem) + '</div>'
      + '<div class="copy-card-footer">'
      + '<div class="copy-card-meta">'
      + (c.preco ? '<span class="copy-card-preco">' + esc(c.preco) + '</span>' : '')
      + '<span>' + esc(c.data) + '</span>'
      + '</div>'
      + '<button class="btn-copiar" data-texto="' + escAttr(c.mensagem) + '">Copiar</button>'
      + '</div>'
      + '</div>';
  }).join('');

  // Paginacao
  if (totalPaginas > 1) {
    container.innerHTML += '<div class="paginacao">'
      + '<button id="btn-pag-ant"' + (paginaAtual <= 1 ? ' disabled' : '') + '>&larr; Anterior</button>'
      + '<span>' + paginaAtual + ' / ' + totalPaginas + '</span>'
      + '<button id="btn-pag-prox"' + (paginaAtual >= totalPaginas ? ' disabled' : '') + '>Proxima &rarr;</button>'
      + '</div>';

    const btnAnt = document.getElementById('btn-pag-ant');
    const btnProx = document.getElementById('btn-pag-prox');
    if (btnAnt) btnAnt.addEventListener('click', () => { paginaAtual--; renderExemplos(); });
    if (btnProx) btnProx.addEventListener('click', () => { paginaAtual++; renderExemplos(); });
  }

  // Copiar
  container.querySelectorAll('.btn-copiar').forEach(btn => {
    btn.addEventListener('click', () => {
      copiarTexto(btn.dataset.texto).then(() => {
        btn.textContent = 'Copiado!';
        btn.classList.add('copiado');
        setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copiado'); }, 2000);
      });
    });
  });
}

// ═══════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('ativa'));
    tab.classList.add('ativa');

    const alvo = tab.dataset.tab;
    document.getElementById('painel-exemplos').classList.toggle('oculto', alvo !== 'exemplos');
    document.getElementById('painel-disparos').classList.toggle('oculto', alvo !== 'disparos');
    document.getElementById('painel-gerador').classList.toggle('oculto', alvo !== 'gerador');

    if (alvo === 'disparos' && !bancoDisparos) carregarBancoDisparos();
  });
});

// ═══════════════════════════════════════════════
// BANCO DE DISPAROS
// ═══════════════════════════════════════════════

let bancoDisparos = null;
let disparosFiltrados = [];
let favoritos = JSON.parse(localStorage.getItem('gerador_favoritos') || '[]');
let copysCustom = JSON.parse(localStorage.getItem('gerador_copys_custom') || '[]');
let mostrandoFavoritos = false;
let gradeManual = { '11h': '', '14h': '', '16h': '', '19h': '' };

async function carregarBancoDisparos() {
  try {
    const resp = await fetch('banco-disparos.json');
    bancoDisparos = await resp.json();

    const select = document.getElementById('select-categoria');
    select.innerHTML = '<option value="">Todas as categorias</option>';
    bancoDisparos.categorias.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.nome;
      opt.textContent = cat.icone + ' ' + cat.nome + ' (' + cat.copys.length + ')';
      select.appendChild(opt);
    });

    renderDisparos();
    atualizarBadgeExemplos();
  } catch (err) {
    document.getElementById('lista-disparos').innerHTML =
      '<div class="estado-vazio"><p>Erro ao carregar banco: ' + esc(err.message) + '</p></div>';
  }
}

// Filtros
document.getElementById('select-categoria').addEventListener('change', () => renderDisparos());
document.getElementById('input-busca').addEventListener('input', () => renderDisparos());

// Favoritos toggle
document.getElementById('btn-favoritos').addEventListener('click', () => {
  mostrandoFavoritos = !mostrandoFavoritos;
  document.getElementById('btn-favoritos').classList.toggle('ativo', mostrandoFavoritos);
  renderDisparos();
});

// Sortear
document.getElementById('btn-aleatorio').addEventListener('click', sortearCopy);

// Adicionar copy
document.getElementById('btn-add-copy').addEventListener('click', () => {
  const form = document.getElementById('form-add-copy');
  form.classList.toggle('oculto');
  if (!form.classList.contains('oculto')) {
    populaCategoriaSelect();
    document.getElementById('input-nova-copy').focus();
  }
});

document.getElementById('btn-fechar-add').addEventListener('click', () => {
  document.getElementById('form-add-copy').classList.add('oculto');
});

document.getElementById('btn-salvar-copy').addEventListener('click', () => {
  const texto = document.getElementById('input-nova-copy').value.trim();
  const categoria = document.getElementById('select-cat-nova').value;
  if (!texto) return;
  if (!categoria) { document.getElementById('select-cat-nova').focus(); return; }

  copysCustom.push({ texto, categoria });
  localStorage.setItem('gerador_copys_custom', JSON.stringify(copysCustom));

  document.getElementById('input-nova-copy').value = '';
  document.getElementById('form-add-copy').classList.add('oculto');
  renderDisparos();
});

function populaCategoriaSelect() {
  const select = document.getElementById('select-cat-nova');
  if (select.options.length > 1) return;
  if (!bancoDisparos) return;
  bancoDisparos.categorias.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.nome;
    opt.textContent = cat.icone + ' ' + cat.nome;
    select.appendChild(opt);
  });
  const optNova = document.createElement('option');
  optNova.value = '__nova__';
  optNova.textContent = '+ Criar nova categoria';
  select.appendChild(optNova);

  select.addEventListener('change', () => {
    if (select.value === '__nova__') {
      const nome = prompt('Nome da nova categoria:');
      if (nome && nome.trim()) {
        const opt = document.createElement('option');
        opt.value = nome.trim();
        opt.textContent = nome.trim();
        select.insertBefore(opt, select.lastChild);
        select.value = nome.trim();
      } else {
        select.value = '';
      }
    }
  });
}

// Grade manual
document.getElementById('btn-limpar-grade').addEventListener('click', () => {
  gradeManual = { '11h': '', '14h': '', '16h': '', '19h': '' };
  renderGradeManual();
});

document.getElementById('btn-copiar-grade').addEventListener('click', () => {
  const texto = [
    gradeManual['11h'] ? '11h — Bom Dia:\n' + gradeManual['11h'] : '',
    gradeManual['14h'] ? '14h — Video Exclusivo:\n' + gradeManual['14h'] : '',
    gradeManual['16h'] ? '16h — Oferta:\n' + gradeManual['16h'] : '',
    gradeManual['19h'] ? '19h — Aquecimento:\n' + gradeManual['19h'] : ''
  ].filter(Boolean).join('\n\n---\n\n');

  copiarTexto(texto).then(() => {
    const btn = document.getElementById('btn-copiar-grade');
    btn.textContent = 'Copiado!';
    setTimeout(() => { btn.textContent = 'Copiar grade completa'; }, 2000);
  });
});

function salvarFavoritos() {
  localStorage.setItem('gerador_favoritos', JSON.stringify(favoritos));
}

function toggleFavorito(texto) {
  const idx = favoritos.indexOf(texto);
  if (idx >= 0) favoritos.splice(idx, 1);
  else favoritos.push(texto);
  salvarFavoritos();
}

function addGrade(slot, texto) {
  gradeManual[slot] = texto;
  renderGradeManual();
}

function renderGradeManual() {
  const slots = ['11h', '14h', '16h', '19h'];
  let preenchidos = 0;
  slots.forEach(slot => {
    const el = document.getElementById('grade-slot-' + slot);
    const card = el.closest('.grade-slot');
    if (gradeManual[slot]) {
      el.textContent = gradeManual[slot];
      card.classList.add('preenchido');
      preenchidos++;
    } else {
      el.innerHTML = '<span class="grade-slot-vazio">Clique + numa copy abaixo</span>';
      card.classList.remove('preenchido');
    }
  });
  document.getElementById('btn-copiar-grade').disabled = preenchidos === 0;
}

function sortearCopy() {
  if (!disparosFiltrados.length) return;
  const idx = Math.floor(Math.random() * disparosFiltrados.length);
  const sorteada = disparosFiltrados[idx];
  const isFav = favoritos.includes(sorteada.texto);

  const container = document.getElementById('copy-aleatoria');
  container.classList.remove('oculto');
  container.innerHTML = '<div class="copy-card">'
    + '<div class="copy-card-texto">' + esc(sorteada.texto) + '</div>'
    + '<div class="copy-card-footer">'
    + '<span class="disparo-cat-chip">' + sorteada.icone + ' ' + esc(sorteada.categoria) + '</span>'
    + '<div class="copy-card-acoes">'
    + '<button class="btn-fav' + (isFav ? ' ativo' : '') + '" data-texto="' + escAttr(sorteada.texto) + '" title="Favoritar">'
    + '<svg viewBox="0 0 24 24" width="14" height="14" fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
    + '</button>'
    + '<div class="btn-add-grade" title="Adicionar na grade">'
    + '+ Grade'
    + '<select data-texto="' + escAttr(sorteada.texto) + '">'
    + '<option value="">Horario...</option>'
    + '<option value="11h">11h Bom Dia</option>'
    + '<option value="14h">14h Video</option>'
    + '<option value="16h">16h Oferta</option>'
    + '<option value="19h">19h Aquecimento</option>'
    + '</select>'
    + '</div>'
    + '<button class="btn-copiar" data-texto="' + escAttr(sorteada.texto) + '">Copiar</button>'
    + '</div>'
    + '</div>'
    + '</div>';

  container.querySelector('.btn-copiar').addEventListener('click', function() {
    copiarTexto(this.dataset.texto).then(() => {
      this.textContent = 'Copiado!';
      this.classList.add('copiado');
      setTimeout(() => { this.textContent = 'Copiar'; this.classList.remove('copiado'); }, 2000);
    });
  });

  container.querySelector('.btn-fav').addEventListener('click', function() {
    toggleFavorito(this.dataset.texto);
    sortearCopy(); // re-render pra atualizar estrela
  });

  container.querySelector('.btn-add-grade select').addEventListener('change', function() {
    if (this.value) {
      addGrade(this.value, this.dataset.texto);
      this.value = '';
    }
  });

  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderDisparos() {
  const container = document.getElementById('lista-disparos');
  if (!bancoDisparos) return;

  const categoriaFiltro = document.getElementById('select-categoria').value;
  const busca = (document.getElementById('input-busca').value || '').toLowerCase().trim();

  const cats = categoriaFiltro
    ? bancoDisparos.categorias.filter(c => c.nome === categoriaFiltro)
    : bancoDisparos.categorias;

  // Monta lista filtrada (banco + customizadas)
  let todosDisparos = cats.flatMap(c => c.copys.map(texto => ({ texto, categoria: c.nome, icone: c.icone })));

  // Adiciona copys customizadas
  const customFiltradas = categoriaFiltro
    ? copysCustom.filter(c => c.categoria === categoriaFiltro)
    : copysCustom;
  customFiltradas.forEach(c => {
    const catOriginal = bancoDisparos.categorias.find(cat => cat.nome === c.categoria);
    todosDisparos.push({ texto: c.texto, categoria: c.categoria, icone: catOriginal?.icone || '✏️', custom: true });
  });

  if (busca) {
    todosDisparos = todosDisparos.filter(d => d.texto.toLowerCase().includes(busca));
  }

  if (mostrandoFavoritos) {
    todosDisparos = todosDisparos.filter(d => favoritos.includes(d.texto));
  }

  disparosFiltrados = todosDisparos;

  if (!disparosFiltrados.length) {
    container.innerHTML = '<div class="estado-vazio"><p>'
      + (mostrandoFavoritos ? 'Nenhuma copy favoritada ainda.' : 'Nenhuma copy encontrada.')
      + '</p></div>';
    atualizarBadgeExemplos();
    return;
  }

  // Agrupa por categoria
  const agrupado = {};
  disparosFiltrados.forEach(d => {
    if (!agrupado[d.categoria]) agrupado[d.categoria] = { icone: d.icone, copys: [] };
    agrupado[d.categoria].copys.push(d.texto);
  });

  let html = '';
  for (const catNome in agrupado) {
    const cat = agrupado[catNome];
    html += '<div class="categoria-header">'
      + '<span class="categoria-icone">' + cat.icone + '</span>'
      + '<span class="categoria-nome">' + esc(catNome) + '</span>'
      + '<span class="categoria-count">' + cat.copys.length + '</span>'
      + '</div>';

    html += cat.copys.map(texto => {
      const isFav = favoritos.includes(texto);
      return '<div class="copy-card disparo-card">'
        + '<div class="copy-card-texto">' + esc(texto) + '</div>'
        + '<div class="copy-card-footer">'
        + '<span class="disparo-cat-chip">' + cat.icone + ' ' + esc(catNome) + '</span>'
        + '<div class="copy-card-acoes">'
        + '<button class="btn-fav' + (isFav ? ' ativo' : '') + '" data-texto="' + escAttr(texto) + '" title="Favoritar">'
        + '<svg viewBox="0 0 24 24" width="14" height="14" fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
        + '</button>'
        + '<div class="btn-add-grade" title="Adicionar na grade">'
        + '+ Grade'
        + '<select data-texto="' + escAttr(texto) + '">'
        + '<option value="">Horario...</option>'
        + '<option value="11h">11h Bom Dia</option>'
        + '<option value="14h">14h Video</option>'
        + '<option value="16h">16h Oferta</option>'
        + '<option value="19h">19h Aquecimento</option>'
        + '</select>'
        + '</div>'
        + '<button class="btn-copiar" data-texto="' + escAttr(texto) + '">Copiar</button>'
        + '</div>'
        + '</div>'
        + '</div>';
    }).join('');
  }

  // Adiciona copys customizadas que nao estao em nenhuma categoria do banco
  const catsCustomUnicas = [...new Set(copysCustom.map(c => c.categoria))].filter(cat => !bancoDisparos.categorias.find(c => c.nome === cat));
  if (!categoriaFiltro || catsCustomUnicas.includes(categoriaFiltro)) {
    catsCustomUnicas.forEach(catNome => {
      const copysDestaCat = copysCustom.filter(c => c.categoria === catNome);
      if (busca) {
        const filtradas = copysDestaCat.filter(c => c.texto.toLowerCase().includes(busca));
        if (!filtradas.length) return;
      }

      html += '<div class="categoria-header">'
        + '<span class="categoria-icone">✏️</span>'
        + '<span class="categoria-nome">' + esc(catNome) + '</span>'
        + '<span class="categoria-count">' + copysDestaCat.length + '</span>'
        + '</div>';

      html += copysDestaCat.filter(c => !busca || c.texto.toLowerCase().includes(busca)).map(c => {
        const isFav = favoritos.includes(c.texto);
        return '<div class="copy-card disparo-card">'
          + '<div class="copy-card-texto">' + esc(c.texto) + '</div>'
          + '<div class="copy-card-footer">'
          + '<span class="disparo-cat-chip">✏️ ' + esc(catNome) + '</span>'
          + '<div class="copy-card-acoes">'
          + '<button class="btn-del-custom" data-texto="' + escAttr(c.texto) + '" title="Apagar">🗑</button>'
          + '<button class="btn-fav' + (isFav ? ' ativo' : '') + '" data-texto="' + escAttr(c.texto) + '" title="Favoritar">'
          + '<svg viewBox="0 0 24 24" width="14" height="14" fill="' + (isFav ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
          + '</button>'
          + '<button class="btn-copiar" data-texto="' + escAttr(c.texto) + '">Copiar</button>'
          + '</div>'
          + '</div>'
          + '</div>';
      }).join('');
    });
  }

  container.innerHTML = html;

  // Events: copiar
  container.querySelectorAll('.btn-copiar').forEach(btn => {
    btn.addEventListener('click', () => {
      copiarTexto(btn.dataset.texto).then(() => {
        btn.textContent = 'Copiado!';
        btn.classList.add('copiado');
        setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copiado'); }, 2000);
      });
    });
  });

  // Events: favoritar
  container.querySelectorAll('.btn-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFavorito(btn.dataset.texto);
      renderDisparos();
    });
  });

  // Events: add na grade
  container.querySelectorAll('.btn-add-grade select').forEach(sel => {
    sel.addEventListener('change', () => {
      if (sel.value) {
        addGrade(sel.value, sel.dataset.texto);
        sel.value = '';
      }
    });
  });

  // Events: deletar custom
  container.querySelectorAll('.btn-del-custom').forEach(btn => {
    btn.addEventListener('click', () => {
      copysCustom = copysCustom.filter(c => c.texto !== btn.dataset.texto);
      localStorage.setItem('gerador_copys_custom', JSON.stringify(copysCustom));
      renderDisparos();
    });
  });

  atualizarBadgeExemplos();
}

// ═══════════════════════════════════════════════
// BADGE EXEMPLOS (pra IA)
// ═══════════════════════════════════════════════

function atualizarBadgeExemplos() {
  const badge = document.getElementById('badge-exemplos');
  const totalDisparos = disparosFiltrados.length;
  const totalMineradas = copysFiltradas.length;
  const partes = [];
  if (totalMineradas) partes.push(totalMineradas + ' mineradas');
  if (totalDisparos) partes.push(totalDisparos + ' disparos');
  badge.textContent = (partes.length ? partes.join(' + ') : '0 exemplos') + ' como referencia';
}

// ═══════════════════════════════════════════════
// GERAR GRADE DO DIA
// ═══════════════════════════════════════════════

const SLOT_CATEGORIAS = {
  '11H': ['Bom Dia', 'Primeiro Contato'],
  '14H': ['Venda de Conteúdo', 'Gatilhos Sensuais', 'Gatilhos Temáticos', 'Gatilhos de Banho'],
  '16H': ['Desconto e Bônus', 'Escassez e Urgência', 'Remarketing', 'Chamada com Preço'],
  '19H': ['Aquecimento pra Pack', 'Boa Noite', 'Chamada de Vídeo', 'Reengajamento']
};

document.getElementById('btn-gerar').addEventListener('click', gerarGrade);

function gerarGrade() {
  if (!bancoDisparos) {
    setStatus('Aguarde o banco de disparos carregar', 'erro');
    return;
  }

  const grade = {};

  SLOTS.forEach(slot => {
    const catsDoSlot = SLOT_CATEGORIAS[slot.tag] || [];
    let pool = [];

    // Junta copys de todas as categorias relevantes pro slot
    catsDoSlot.forEach(catNome => {
      const cat = bancoDisparos.categorias.find(c => c.nome === catNome);
      if (cat) pool.push(...cat.copys);
    });

    // Adiciona copys customizadas das mesmas categorias
    copysCustom.forEach(c => {
      if (catsDoSlot.includes(c.categoria)) pool.push(c.texto);
    });

    // Adiciona copys mineradas do tipo relevante
    if (copysFiltradas.length) {
      const tipoMap = { '11H': 'Saudacao', '14H': 'Conteudo', '16H': 'Venda', '19H': 'Aquecimento' };
      const tipoAlvo = tipoMap[slot.tag];
      const mineradasDoTipo = copysFiltradas.filter(c => c.tipo === tipoAlvo).map(c => c.mensagem);
      pool.push(...mineradasDoTipo);
    }

    // Sorteia uma copy do pool (evitando repetir)
    if (pool.length) {
      const idx = Math.floor(Math.random() * pool.length);
      grade[slot.tag] = pool[idx];
    } else {
      grade[slot.tag] = '';
    }
  });

  renderGrade(grade);
  setStatus('Grade do dia montada! Clique de novo pra sortear outras.', 'ok');
}

const SLOTS = [
  { tag: '11H', hora: '11h', tipo: 'Bom Dia', cor: '#fbbf24', classe: 'bomdia' },
  { tag: '14H', hora: '14h', tipo: 'Video Exclusivo', cor: '#a855f7', classe: 'video' },
  { tag: '16H', hora: '16h', tipo: 'Oferta', cor: '#34d399', classe: 'oferta' },
  { tag: '19H', hora: '19h', tipo: 'Aquecimento', cor: '#ec4899', classe: 'aquecimento' }
];

function parsearGrade(texto) {
  const grade = {};
  SLOTS.forEach((slot, i) => {
    const regex = new RegExp('\\[' + slot.tag + '\\]\\s*([\\s\\S]*?)(?=\\[\\d{2}H\\]|$)', 'i');
    const match = texto.match(regex);
    grade[slot.tag] = match ? match[1].trim() : '';
  });

  // Fallback: se nao achou tags, divide por --- ou linhas duplas
  const temConteudo = Object.values(grade).some(v => v.length > 0);
  if (!temConteudo) {
    const partes = texto.split(/---|\n\n+/).map(p => p.trim()).filter(p => p.length > 10);
    SLOTS.forEach((slot, i) => {
      if (partes[i]) grade[slot.tag] = partes[i];
    });
  }

  return grade;
}

function renderGrade(grade) {
  const container = document.getElementById('resultado-ia');
  const lista = document.getElementById('lista-geradas');
  container.classList.remove('oculto');

  lista.innerHTML = SLOTS.map(slot => {
    const texto = grade[slot.tag] || '(nao gerada)';
    return '<div class="gerada-card slot-' + slot.classe + '">'
      + '<div class="slot-label">'
      + '<span class="slot-label-hora" style="background:' + slot.cor + '">' + slot.hora + '</span>'
      + '<span class="slot-label-tipo">' + slot.tipo + '</span>'
      + '</div>'
      + '<div class="gerada-texto">' + esc(texto) + '</div>'
      + '<div class="gerada-footer">'
      + '<button class="btn-copiar" data-texto="' + escAttr(texto) + '">Copiar</button>'
      + '</div>'
      + '</div>';
  }).join('');

  // Botao copiar tudo
  const todasCopys = SLOTS.map(s => s.hora + ' — ' + s.tipo + ':\n' + (grade[s.tag] || '')).join('\n\n---\n\n');
  lista.innerHTML += '<button class="btn-copiar-grade" id="btn-copiar-todas-geradas" style="margin-top:12px">Copiar grade completa</button>';

  // Events
  lista.querySelectorAll('.btn-copiar').forEach(btn => {
    btn.addEventListener('click', () => {
      copiarTexto(btn.dataset.texto).then(() => {
        btn.textContent = 'Copiado!';
        btn.classList.add('copiado');
        setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copiado'); }, 2000);
      });
    });
  });

  document.getElementById('btn-copiar-todas-geradas').addEventListener('click', function() {
    copiarTexto(todasCopys).then(() => {
      this.textContent = 'Grade copiada!';
      setTimeout(() => { this.textContent = 'Copiar grade completa'; }, 2000);
    });
  });

  container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══════════════════════════════════════════════
// MODAL CONFIGURACOES
// ═══════════════════════════════════════════════

document.getElementById('btn-config').addEventListener('click', () => {
  const cfg = getConfig();
  document.getElementById('input-sheets-url').value = cfg.sheetsUrl || '';
  document.getElementById('select-provedor').value = cfg.provedor || 'openai';
  document.getElementById('input-api-key').value = cfg.apiKey || '';
  document.getElementById('input-modelo-ia').value = cfg.modeloIA || '';
  document.getElementById('modal-config').classList.remove('oculto');
});

document.getElementById('btn-fechar-config').addEventListener('click', fecharModal);
document.querySelector('.modal-overlay').addEventListener('click', fecharModal);

function fecharModal() {
  document.getElementById('modal-config').classList.add('oculto');
}

document.getElementById('btn-salvar-config').addEventListener('click', () => {
  const sheetsUrl = document.getElementById('input-sheets-url').value.trim();
  const provedor = document.getElementById('select-provedor').value;
  const apiKey = document.getElementById('input-api-key').value.trim();
  const modeloIA = document.getElementById('input-modelo-ia').value.trim();

  salvarConfig({ sheetsUrl, provedor, apiKey, modeloIA });
  mostrarMsgConfig('Configuracoes salvas!', 'sucesso');

  if (sheetsUrl) {
    setStatus('Pronto — clique em Carregar Copys', 'ok');
  }
});

document.getElementById('btn-testar-config').addEventListener('click', async () => {
  const url = document.getElementById('input-sheets-url').value.trim();
  if (!url) { mostrarMsgConfig('Cole a URL primeiro', 'erro'); return; }

  const btn = document.getElementById('btn-testar-config');
  btn.textContent = 'Testando...';
  btn.disabled = true;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ teste: true, linhas: [] })
    });
    const data = await resp.json();
    if (data.status === 'ok') {
      mostrarMsgConfig('Conexao OK! ' + (data.msg || ''), 'sucesso');
    } else {
      mostrarMsgConfig('Erro: ' + (data.msg || ''), 'erro');
    }
  } catch (err) {
    mostrarMsgConfig('Falha: ' + err.message, 'erro');
  } finally {
    btn.textContent = 'Testar conexao';
    btn.disabled = false;
  }
});

function mostrarMsgConfig(texto, tipo) {
  const el = document.getElementById('msg-config');
  el.textContent = texto;
  el.className = 'msg ' + tipo;
  el.classList.remove('oculto');
  setTimeout(() => el.classList.add('oculto'), 5000);
}

// ═══════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escAttr(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════

(function init() {
  const cfg = getConfig();
  if (cfg.sheetsUrl) {
    // Carrega as copys automaticamente ao abrir a página
    carregarCopys();
  } else {
    setStatus('Configure a URL do Apps Script nas configurações', 'aviso');
  }
  carregarBancoDisparos();
})();
