// detalhes.js
const API = 'http://localhost:3000/artistas';
const u = new URLSearchParams(location.search);
const id = u.get('id');

/*Objetivo: Converter o código da categoria salvo no banco (ex.: perifericos, hardware)
em um rótulo legível para mostrar na tela (ex.: “Periféricos”, “Hardware”).
*/
function categoriaLabel(valor) {
  const map = { nome: 'Nome', genero: 'Gênero Musical', data: 'Data de Nascimento', pais: 'País' };
  return map[valor] ?? valor ?? '';
}

/*Objetivo: Consultar os detalhes de um produto pelo seu ID
*/
async function consultarDetalhesProduto() {
  if (!id) {
    showToast('ID inválido.', 'danger');
    return;
  }
  try {
    //Acionar o serviço REST consultar produto por ID
    const resp = await fetch(`${API}/${id}`);
    if (!resp.ok) {
      showToast('Artista não encontrado.', 'danger');
      return;
    }
    const p = await resp.json();
    document.getElementById('p-id').textContent = p.id;
    document.getElementById('p-nome').textContent = p.nome ?? '';
    document.getElementById('p-genero').textContent = p.genero ?? '';
    // document.getElementById('p-pais').textContent = categoriaLabel(p.categoria);
    document.getElementById('p-pais').textContent = p.pais ?? '';
    // document.getElementById('p-quantidade').textContent = p.quantidade ?? 0;
    document.getElementById('p-data').textContent = p.data ?? '';
    // document.getElementById('p-status').textContent = (p.status === 'ativo' ? 'Ativo' : 'Inativo');
    // document.getElementById('p-descricao').textContent = p.descricao ?? '';
    document.getElementById('btnEditar').href = `incluirAlterar.html?id=${p.id}`;
  } catch (e) {
    console.error(e);
    showToast('Erro ao consultar os detalhes do produto selecionado.', 'danger');
  }
}

document.addEventListener('DOMContentLoaded', consultarDetalhesProduto);
