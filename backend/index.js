// index.js
const API = 'http://localhost:3000/produtos';

/*Objetivo: Converter o código da categoria salvo no banco (ex.: perifericos, hardware)
em um rótulo legível para mostrar na tela (ex.: “Periféricos”, “Hardware”).
*/
function categoriaLabel(valor) {
  const map = { perifericos: 'Periféricos', hardware: 'Hardware', acessorios: 'Acessórios', outros: 'Outros' };
  return map[valor] ?? valor ?? '';
}

/*Objetivo: Carrega na tabela todos os produtos encontrados.
  Se não houver produtos, exibir mensagem
*/
async function carregarProdutos() {
  const tbody = document.querySelector('#gridProdutos tbody');
  const listaVazia = document.getElementById('listaVazia');
  tbody.innerHTML = '';
  try {
    
    // Chama o Serviço REST Listar Produtos    
    const resp = await fetch(API);
    
    // recuperar o json do response e jogá-lo em uma lista de objetos (Produto) em JavaScript
    const listaProdutos = await resp.json();

    if (!listaProdutos || listaProdutos.length === 0) {
      listaVazia.classList.remove('d-none');
      return;
    }
    listaVazia.classList.add('d-none');

    listaProdutos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nome ?? ''}</td>
        <td>${categoriaLabel(p.categoria)}</td>
        <td>${p.quantidade ?? 0}</td>
        <td class="text-end">
          <a class="btn btn-sm btn-outline-secondary me-1" title="Consultar detalhes" href="detalhes.html?id=${p.id}">
            <i class="bi bi-search"></i>
          </a>
          <a class="btn btn-sm btn-outline-primary me-1" title="Editar" href="incluirAlterar.html?id=${p.id}">
            <i class="bi bi-pencil-square"></i>
          </a>
          <button class="btn btn-sm btn-outline-danger" title="Excluir" data-id="${p.id}">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // delegação para botões de excluir
    tbody.addEventListener('click', async (ev) => {
      const btn = ev.target.closest('button[data-id]');
      if (!btn) return;
      const id = btn.getAttribute('data-id');

      if (confirm('Deseja realmente excluir este produto?')) {
        try {
          const r = await fetch(`${API}/${id}`, { method: 'DELETE' });
          if (!r.ok) throw new Error();
          showToast('Produto excluído com sucesso.', 'success');
          carregarProdutos();
        } catch {
          showToast('Falha ao excluir produto.', 'danger');
        }
      }
    });

  } catch (e) {
    console.error(e);
    listaVazia.classList.remove('d-none');
    listaVazia.textContent = 'Erro ao carregar produtos.';
    showToast('Erro ao carregar produtos.', 'danger');
  }
}

document.addEventListener('DOMContentLoaded', carregarProdutos);
