// index.js
const API = 'http://localhost:3000/artistas';

/*Objetivo: Converter o código da categoria salvo no banco (ex.: perifericos, hardware)
em um rótulo legível para mostrar na tela (ex.: “Periféricos”, “Hardware”).
*/
function categoriaLabel(valor) {
  const map = { nome: 'Nome', genero: 'Gênero', data_nascimento: 'Data de Nascimento', pais: 'País' };
  return map[valor] ?? valor ?? '';
}

//Formatar a data retornada do DB para DD/MM/AAAA
function converterParaVisualizacao(data_bd) {
  if (!data_bd) return '';
  const dataPart = data_bd.split('T')[0];
  const [ano, mes, dia] = dataPart.split('-');
  return `${dia}/${mes}/${ano}`; 
}

async function carregarArtistas() {
  const tbody = document.querySelector('#gridArtistas tbody');
  const listaVazia = document.getElementById('listaVazia');
  tbody.innerHTML = '';
  try {
    const resp = await fetch(API);
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
            const resp = await fetch(`${API}/${id}`, {
                method: 'DELETE' 
            });

            if (resp.ok) { 
                showToast('Artista excluído com sucesso.', 'success');
                carregarArtistas(); 
            } else if (resp.status === 404) {
                showToast('Artista não encontrado.', 'warning');
            } else {
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
