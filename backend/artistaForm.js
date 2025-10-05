// Artista-api.js
const API = 'http://localhost:3000/artistas';

// Função para converter do formato brasileiro para o formato do banco de dados (AAAA-MM-DD)
function converterParaBD(data_input) {
    if (!data_input) return null;
    
    // Supondo que a entrada é DD/MM/AAAA
    const [dia, mes, ano] = data_input.split('/');
    
    // Retorna AAAA-MM-DD
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`; 
}

// Função para converter do formato do banco de dados (AAAA-MM-DD) para o formato brasileiro (DD/MM/AAAA)
function converterParaVisualizacao(data_bd) {
    if (!data_bd) return '';
    
    // 1. Remove a parte do tempo ('T00:00:00.000Z'), deixando apenas a data (AAAA-MM-DD)
    const dataPart = data_bd.split('T')[0];
    
    // 2. Divide a string AAAA-MM-DD em partes
    const [ano, mes, dia] = dataPart.split('-');
    
    // 3. Retorna no formato DD/MM/AAAA
    return `${dia}/${mes}/${ano}`; 
}

function serializeForm(form) {
  const get = (id) => (document.getElementById(id)?.value ?? '').trim();
  const getRadio = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  };
  // const q = parseInt(get('quantidade'), 10);
  return {
    nome: get('nome'),
    genero: get('genero'),
    pais: get('pais'),
    data_nascimento: converterParaBD(get('data_nascimento'))

  };
}

async function carregarParaEdicao(id) {
  try {
    const resp = await fetch(`${API}/${id}`);
    if (!resp.ok) throw new Error('not found');
    const a = await resp.json();

    document.getElementById('nome').value = a.nome ?? '';
    document.getElementById('genero').value = a.genero ?? '';
    document.getElementById('pais').value = a.pais ?? '';
    document.getElementById('data_nascimento').value = converterParaVisualizacao(a.data_nascimento ?? '');

  } catch (e) {
    console.error(e);
    showToast('Artista não encontrado para edição.', 'danger');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('artistaForm');
  const u = new URLSearchParams(location.search);
  const id = u.get('id');


  if (id) carregarParaEdicao(id);

  // Ouve o evento disparado pelo JS validacoesMascaras.js quando o form está válido
  /* chama assincrona - espera o retorno API usa essa e deixa um evento await
  chamada sincrona - tela travada esperando */
  form.addEventListener('form:valido', async () => {
    const dados = serializeForm(form);
    /* serializeForm transforma os dados em JSON */ 
    try {
      if (id) {
        /* ######  ALTERAR Artista ###########*/
        const resp = await fetch(`${API}/${id}`, {
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          //JSON.stringify converte o objeto Java Script em JSON
          //...dados → spread (espalha) todas as propriedades do objeto dados (nome, categoria, quantidade, etc.).
          // id: Number(id) → adiciona/sobrescreve a propriedade id, convertendo para número (útil porque id costuma vir de querystring como string, e o json-server usa número). 
          // OBS: A ordem importa: como id vem depois do spread, ele sobrescreve qualquer id que já estivesse em dados.
          // não usar o ... em JSON.stringify(dados). Não força id para número (se vier como string da URL, continua string).
          body: JSON.stringify({ ...dados, id: Number(id) })
        });
        
        if (!resp.ok) throw new Error('PUT failed');
        // redireciona com toast de sucesso
        redirectWithToast('index.html', 'Artista atualizado com sucesso.', 'success');
      } else {
        /* ######  INCLUIR Artista ###########*/
        const resp = await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
        if (!resp.ok) throw new Error('POST failed');
        redirectWithToast('index.html', 'Artista incluído com sucesso.', 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Falha ao salvar o Artista. Tente novamente.', 'danger');
    }
  });
});
