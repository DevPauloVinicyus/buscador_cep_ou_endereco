 document.addEventListener('DOMContentLoaded', () => {
    const btnBuscar = document.querySelector('.btn-search');
    const btnLimpar = document.querySelector('.btn-clear');

    const campoCEP = document.querySelector('.CEP');
    const campoEndereco = document.querySelector('.endereco');
    const campoBairro = document.querySelector('.bairro');
    const campoCidade = document.querySelector('.cidade');
    const campoEstado = document.querySelector('.estado');

    // Busca ao clicar em "Buscar"
    btnBuscar.addEventListener('click', async (e) => {
      e.preventDefault();

      const cep = campoCEP.value.replace(/\D/g, '');
      const endereco = campoEndereco.value.trim();
      const bairro = campoBairro.value.trim();
      const cidade = campoCidade.value.trim();
      const estado = campoEstado.value.trim();

      // --- Se CEP preenchido, busca endereço ---
      if (cep && cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (data.erro) {
            alert('CEP não encontrado.');
            return;
          }

          campoEndereco.value = data.logradouro;
          campoBairro.value = data.bairro;
          campoCidade.value = data.localidade;
          campoEstado.value = data.uf;
        } catch (error) {
          alert('Erro ao buscar o CEP.');
        }

      // --- Se todos os campos de endereço preenchidos, busca CEP ---
      } else if (endereco && bairro && cidade && estado) {
        try {
          const url = `https://viacep.com.br/ws/${estado}/${cidade}/${endereco}/json/`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.length === 0) {
            alert('Endereço não encontrado.');
            return;
          }

          // Pega o primeiro resultado e confere se o bairro é o mesmo
          const resultado = data.find(item => item.bairro.toLowerCase() === bairro.toLowerCase()) || data[0];
          campoCEP.value = resultado.cep;
        } catch (error) {
          alert('Erro ao buscar o endereço.');
        }

      } else {
        alert('Preencha o CEP ou todos os campos do endereço para buscar.');
      }
    });

    // Botão LIMPAR
    btnLimpar.addEventListener('click', (e) => {
      e.preventDefault();
      campoCEP.value = '';
      campoEndereco.value = '';
      campoBairro.value = '';
      campoCidade.value = '';
      campoEstado.value = '';
    });
  });