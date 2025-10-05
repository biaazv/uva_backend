const API = 'http://localhost:3000/artistas';

//Função para converter o formato da data
function converterParaBD(data_input) {
    if (!data_input) return null;
    //Assumir que o formato de entrada da data é: DD/MM/AAAA
    const [dia, mes, ano] = data_input.split('/');
    // Retorna AAAA-MM-DD
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`; 
}

//Função para converter o formato timestamp (AAAA-MM-DDT[hh][mm][ss]) para formato de data brasileiro (DD/MM/AAAA)
function converterParaVisualizacao(data_bd) {
    if (!data_bd) return '';
    const dataPart = data_bd.split('T')[0];
    const [ano, mes, dia] = dataPart.split('-');
    return `${dia}/${mes}/${ano}`; 
}

function serializeForm(form) {
  const get = (id) => (document.getElementById(id)?.value ?? '').trim();
  const getRadio = (name) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value : '';
  };
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

  form.addEventListener('form:valido', async () => {
    const dados = serializeForm(form);
    try {
      if (id) {
        const resp = await fetch(`${API}/${id}`, {
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...dados, id: Number(id) })
        });
        
        if (!resp.ok) throw new Error('PUT failed');
        redirectWithToast('index.html', 'Artista atualizado com sucesso.', 'success');
      } else {
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
