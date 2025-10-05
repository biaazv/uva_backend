// Função para exibir erro embaixo do campo
function setarErro(campoAvaliado, caixaDeErroCampo, mensagem) {
  // Se o elemento for um input ou select, adiciona a classe 'is-invalid' do Bootstrap
  if (campoAvaliado instanceof HTMLElement && (campoAvaliado.classList.contains('form-control') || campoAvaliado.classList.contains('form-select'))) {
    campoAvaliado.classList.add('is-invalid');
  }
  
  // Mostra a mensagem de erro no span
  caixaDeErroCampo.textContent = mensagem;
  caixaDeErroCampo.classList.remove('d-none');
  caixaDeErroCampo.classList.add('d-block');
}

// Função para limpar o erro (quando o campo for corrigido)
function limparErro(campoAvaliado, caixaDeErroCampo) {
  if (campoAvaliado instanceof HTMLElement && (campoAvaliado.classList.contains('form-control') || campoAvaliado.classList.contains('form-select'))) {
    campoAvaliado.classList.remove('is-invalid');
  }
  caixaDeErroCampo.textContent = '';
  caixaDeErroCampo.classList.add('d-none');
  caixaDeErroCampo.classList.remove('d-block');
}

// Função utilitária para verificar se o valor está vazio
function campoVazio(value) {
  return !value || String(value).trim() === '';
}


// =================== Funções de Máscara ===================

function mascaraData(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})\d+?$/, '$1');
}

// ==========================================================

// Função principal de validação do formulário
function validarFormularioHtml(e) {
  e.preventDefault();

  const form = document.getElementById('artistaForm');
  const nome = document.getElementById('nome');
  const errNome = document.getElementById('err-nome');

  const genero = document.getElementById('genero');
  const errGenero = document.getElementById('err-genero');

  const data = document.getElementById('data');
  const errData = document.getElementById('err-data');

  const pais = document.getElementById('pais');
  const errPais = document.getElementById('err-pais');

  const termos = document.getElementById('termos');
  const errTermos = document.getElementById('err-termos');

  let temErro = false;

  // ======== VALIDAÇÕES ========

  if (campoVazio(nome.value)) {
    setarErro(nome, errNome, 'Informe o nome do artista.');
    temErro = true;
  } else {
    limparErro(nome, errNome);
  }


  
  if (campoVazio(genero.value)) {
    setarErro(genero, errGenero, 'Informe o gênero.');
    temErro = true;
  } else {
    limparErro(genero, errGenero);
  }

  // Data: valida o formato e a data
  const dataPreenchida = data_nascimento.value;
  const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regexData.test(dataPreenchida)) {
    setarErro(data, errData, 'A data deve estar no formato DD/MM/AAAA.');
    temErro = true;
  } else {
    const [dia, mes, ano] = dataPreenchida.split('/').map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    const dataCorrente = new Date();
    dataCorrente.setHours(0, 0, 0, 0);

    if (dataObj.getFullYear() !== ano || dataObj.getMonth() + 1 !== mes || dataObj.getDate() !== dia) {
      setarErro(data, errData, 'Data inválida.');
      temErro = true;
    } else if (dataObj > dataCorrente) {
      setarErro(data, errData, 'A data não pode ser futura.');
      temErro = true;
    } else {
      limparErro(data, errData);
    }
  }

    if (campoVazio(pais.value)) {
    setarErro(pais, errPais, 'Informe o país do artista.');
    temErro = true;
  } else {
    limparErro(pais, errPais);
  }

  if (!termos.checked) {
    setarErro(termos, errTermos, 'É necessário confirmar as informações.');
    temErro = true;
  } else {
    limparErro(termos, errTermos);
  }

  if (!temErro) {
    const evt = new CustomEvent('form:valido', { detail: { form } });
    form.dispatchEvent(evt);
    /*################################################################################################ */

    form.reset();
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('[id^="err-"]').forEach(span => { 
      span.textContent = ''; 
      span.classList.add('d-none'); 
      span.classList.remove('d-block'); 
    });
  }
}

function incluirValidacaoOnBlur() {
  const regrasDoOnBlur = {
    nome: valor => !campoVazio(valor),
    cnpj: valor => valor.length === 18,    
    categoria: valor => !campoVazio(valor),
    preco: valor => { const preco_num = parseFloat(formatarPrecoParaValidacao(valor)); return !isNaN(preco_num) && preco_num > 0; },
    quantidade: valor => { const quantidade_num = parseInt(valor, 10); return !isNaN(quantidade_num) && quantidade_num > 0; },
    data: valor => {
      const regexData = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!regexData.test(valor)) return false;
      const [dia, mes, ano] = valor.split('/').map(Number);
      const dataObj = new Date(ano, mes - 1, dia);
      const dataCorrente = new Date();
      dataCorrente.setHours(0, 0, 0, 0);
      return dataObj.getFullYear() === ano && dataObj.getMonth() + 1 === mes && dataObj.getDate() === dia && dataObj <= dataCorrente;
    },
    descricao: valor => valor && valor.trim().length >= 10
  };

  Object.keys(regrasDoOnBlur).forEach(id => {
    const input = document.getElementById(id);
    const errSpan = document.getElementById(`err-${id}`);
    if (!input) return;
    input.addEventListener('blur', () => {
      const ok = regrasDoOnBlur[id](input.value);
      if (!ok) {
        const msgs = {
          nome: 'Informe o nome do Artista.',
          data: 'Data no formato DD/MM/AAAA (não pode ser futura).',
        };
        setarErro(input, errSpan, msgs[id]);
      } else {
        limparErro(input, errSpan);
      }
    });
  });

  const statusRadios = document.querySelectorAll('input[name="status"]');
  const errStatus = document.getElementById('err-status');
  statusRadios.forEach(r => r.addEventListener('change', () => limparErro(statusRadios[0], errStatus)));

  const termos = document.getElementById('termos');
  const errTermos = document.getElementById('err-termos');
  termos.addEventListener('change', () => termos.checked ? limparErro(termos, errTermos) : null);
}

function inicializarMascarasManuais() {
  const cnpj = document.getElementById('cnpj');
  if (cnpj) {
    cnpj.addEventListener('input', (e) => {
      e.target.value = mascaraCNPJ(e.target.value);
    });
  }
  
  const preco = document.getElementById('preco');
  if (preco) {
    preco.addEventListener('input', (e) => {
      e.target.value = mascaraPreco(e.target.value);
    });
  }
  
  const data = document.getElementById('data');
  if (data) {
    data.addEventListener('input', (e) => {
      e.target.value = mascaraData(e.target.value);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
    
  inicializarMascarasManuais();
  
  document.getElementById('artistaForm').addEventListener('submit', validarFormularioHtml);
  document.getElementById('resetBtn').addEventListener('click', () => {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('[id^="err-"]').forEach(span => { 
      span.textContent = ''; 
      span.classList.add('d-none'); 
      span.classList.remove('d-block'); 
    });    
  });

  incluirValidacaoOnBlur();
});