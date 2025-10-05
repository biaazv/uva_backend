// index.js
const API = 'http://localhost:3000/artistas';

/*Objetivo: Converter o código da categoria salvo no banco (ex.: perifericos, hardware)
em um rótulo legível para mostrar na tela (ex.: “Periféricos”, “Hardware”).
*/
function categoriaLabel(valor) {
  const map = { nome: 'Nome', hardware: 'Hardware', acessorios: 'Acessórios', outros: 'Outros' };
  return map[valor] ?? valor ?? '';
}

function converterParaVisualizacao(data_bd) {
    if (!data_bd) return '';
    
    // 1. Remove a parte do tempo ('T00:00:00.000Z'), deixando apenas a data (AAAA-MM-DD)
    const dataPart = data_bd.split('T')[0];
    
    // 2. Divide a string AAAA-MM-DD em partes
    const [ano, mes, dia] = dataPart.split('-');
    
    // 3. Retorna no formato DD/MM/AAAA
    return `${dia}/${mes}/${ano}`; 
}

/*Objetivo: Carrega na tabela todos os produtos encontrados.
  Se não houver produtos, exibir mensagem
*/
async function carregarArtistas() {
  const tbody = document.querySelector('#gridArtistas tbody');
  const listaVazia = document.getElementById('listaVazia');
  tbody.innerHTML = '';
  try {
    
    // Chama o Serviço REST Listar Produtos    
    const resp = await fetch(API);
    
    // recuperar o json do response e jogá-lo em uma lista de objetos (Produto) em JavaScript
    const listaArtistas = await resp.json();

    if (!listaArtistas || listaArtistas.length === 0) {
      listaVazia.classList.remove('d-none');
      return;
    }
    listaVazia.classList.add('d-none');

    listaArtistas.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${p.id}</td>
        <td>${p.nome ?? ''}</td>
        <td>${p.genero ?? 0}</td>
        <td>${converterParaVisualizacao(p.data_nascimento) ?? 0}</td>
        <td>${p.pais ?? 0}</td>
        <td class="text-end">
          <a class="btn btn-sm btn-outline-secondary me-1" title="Consultar detalhes" href="detalhes.html?id=${p.id}">
            <i class="bi bi-search"></i>
          </a>
          <a class="btn btn-sm btn-outline-primary me-1" title="Editar" href="incluirAlterarArtista.html?id=${p.id}">
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
        console.log(`deletar`)
        try {
            // const resp = await fetch(`${API}/${id}`);
            const resp = await fetch(`${API}/${id}`, {
                method: 'DELETE' // Indica que é uma requisição DELETE
            });

            if (resp.ok) { // Verifica se a requisição foi bem-sucedida (status 200-299)
                showToast('Artista excluído com sucesso.', 'success');
                // Recarrega a lista para atualizar a tabela
                carregarArtistas(); 
            } else if (resp.status === 404) {
                showToast('Artista não encontrado.', 'warning');
            } else {
                // Tenta ler a mensagem de erro do servidor
                const errorData = await resp.json().catch(() => ({}));
                const errorMessage = errorData.error || 'Erro ao excluir artista.';
                showToast(errorMessage, 'danger');
            }

        } catch (e) {
            console.error(e);
            showToast('Erro de comunicação com o servidor.', 'danger');
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

document.addEventListener('DOMContentLoaded', carregarArtistas);
