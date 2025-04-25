
  document.addEventListener("DOMContentLoaded", function () {
    const btnBuscar = document.querySelector(".btn-search");
    const btnLimpar = document.querySelector(".btn-clear");

    const ruaInput = document.querySelector(".endereco");
    const bairroInput = document.querySelector(".bairro");
    const cidadeInput = document.querySelector(".cidade");
    const estadoInput = document.querySelector(".estado");
    const cepInput = document.querySelector(".CEP");

    const limparCampos = () => {
      ruaInput.value = "";
      bairroInput.value = "";
      cidadeInput.value = "";
      estadoInput.value = "";
      cepInput.value = "";
    };

    const mostrarMensagem = (mensagem) => {
      alert(mensagem);
    };

    const buscarCepPorEndereco = async () => {
      const rua = ruaInput.value.trim();
      const bairro = bairroInput.value.trim();
      const cidade = cidadeInput.value.trim();
      const estado = estadoInput.value.trim();

      if (!rua || !bairro || !cidade || !estado) {
        mostrarMensagem("Informe o endereço completo para buscar o CEP.");
        return;
      }

      try {
        const response = await axios.get(`https://viacep.com.br/ws/${estado}/${cidade}/${rua}/json/`);
        const data = response.data;

        if (data && data.length > 0) {
          const resultado = data.find(item => item.bairro.toLowerCase() === bairro.toLowerCase());
          if (resultado) {
            cepInput.value = resultado.cep;
          } else {
            mostrarMensagem("Endereço encontrado, mas bairro não corresponde.");
          }
        } else {
          mostrarMensagem("Endereço não encontrado.");
        }
      } catch (error) {
        mostrarMensagem("Erro ao buscar o CEP.");
      }
    };

    const buscarEnderecoPorCep = async () => {
      const cep = cepInput.value.replace(/\D/g, "");

      if (!cep || cep.length < 8) {
        mostrarMensagem("Informe um CEP válido para buscar o endereço.");
        return;
      }

      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        if (data && !data.erro) {
          ruaInput.value = data.logradouro;
          bairroInput.value = data.bairro;
          cidadeInput.value = data.localidade;
          estadoInput.value = data.uf;
        } else {
          mostrarMensagem("CEP não encontrado.");
        }
      } catch (error) {
        mostrarMensagem("Erro ao buscar o endereço.");
      }
    };

    btnBuscar.addEventListener("click", function (e) {
      e.preventDefault();
      const cep = cepInput.value.trim();
      const rua = ruaInput.value.trim();
      const bairro = bairroInput.value.trim();
      const cidade = cidadeInput.value.trim();
      const estado = estadoInput.value.trim();

      if (!cep && (!rua || !bairro || !cidade || !estado)) {
        mostrarMensagem("Informe o endereço completo ou CEP para melhor lhe auxiliar.");
        return;
      }

      if (cep) {
        buscarEnderecoPorCep();
      } else {
        buscarCepPorEndereco();
      }
    });

    btnLimpar.addEventListener("click", function (e) {
      e.preventDefault();
      limparCampos();
    });
  });
