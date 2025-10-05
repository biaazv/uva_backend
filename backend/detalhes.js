// detalhes.js
const API = 'http://localhost:3000/artistas';
const u = new URLSearchParams(location.search);
const id = u.get('id');

function categoriaLabel(valor) {
  const map = { nome: 'Nome', genero: 'Gênero Musical', data: 'Data de Nascimento', pais: 'País' };
  return map[valor] ?? valor ?? '';
}

async function consultarDetalhesProduto() {
  if (!id) {
    showToast('ID inválido.', 'danger');
    return;
  }
  try {
    const resp = await fetch(`${API}/${id}`);
    if (!resp.ok) {
      showToast('Artista não encontrado.', 'danger');
      return;
    }
    const p = await resp.json();
    document.getElementById('p-id').textContent = p.id;
    document.getElementById('p-nome').textContent = p.nome ?? '';
    document.getElementById('p-genero').textContent = p.genero ?? '';
    document.getElementById('p-pais').textContent = p.pais ?? '';
    document.getElementById('p-data').textContent = p.data ?? '';
    document.getElementById('btnEditar').href = `incluirAlterar.html?id=${p.id}`;
  } catch (e) {
    console.error(e);
    showToast('Erro ao consultar os detalhes do produto selecionado.', 'danger');
  }
}

document.addEventListener('DOMContentLoaded', consultarDetalhesProduto);
