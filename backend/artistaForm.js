// Artista-api.js
const API = 'http://localhost:3000/artistas';

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
    // preco: get('preco'),                // mantém string mascarada
    // quantidade: isNaN(q) ? 0 : q,
    data: get('data'),
    // descricao: get('descricao'),
    // status: getRadio('status')
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
    // document.getElementById('preco').value = a.preco ?? '';
    // document.getElementById('quantidade').value = a.quantidade ?? 0;
    document.getElementById('data').value = a.data_nascimento ?? '';
    // document.getElementById('descricao').value = a.descricao ?? '';
    // if (a.status === 'ativo') document.getElementById('statusAtivo').checked = true;
    // if (a.status === 'inativo') document.getElementById('statusInativo').checked = true;
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
