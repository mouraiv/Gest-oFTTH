import Api from '../services/api';

const GetTesteOptico = async (filtro, {signal}) => {
  const response = await Api.get('/TesteOptico/Listar', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const GetControleCampo = async (filtro, {signal}) => {
  const response = await Api.get('/TesteOptico/ControleCampo', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const GetControleCdo = async (filtro, {signal}) => {
  const response = await Api.get('/TesteOptico/ControleCdo', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const CreateTesteOptico = async (testeOptico) => {
  const response = await Api.post('/TesteOptico/Cadastrar', testeOptico);
  return response;
};

const UpdateTesteOptico = async (testeOptico) => {
  const response = await Api.put(`/TesteOptico/Atualizar/${testeOptico.id_TesteOptico}`, testeOptico);
  return response;
};

const DeleteTesteOptico = async (id) => {
  const response = await Api.delete(`/TesteOptico/Deletar/${id}`);
  return response;
};

const DropTesteOptico = async () => {
  const response = await Api.get("/TesteOptico/ListaUnica", {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

const DetalheTesteOptico = async (id) => {
  const response = await Api.get("/TesteOptico/Detalhe", {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

const ImportarArquivo = async (arquivo) => {
  
  const formData = new FormData();
  formData.append('arquivo', arquivo);

  const response = await Api.post('/TesteOptico/UploadModelo', formData);
  return response;
};

const ExportExcel = async (filtro) => {

  const response = await Api.post('/TesteOptico/DownloadExcel', filtro, {
    responseType: 'arraybuffer', 
    });

    const dataAtual = new Date().toLocaleDateString().split('/').join('-'); // Formatar a data atual como dd-mm-yyyy
    const nomeArquivo = `SGF_Controle_de_Campo_${dataAtual}.xlsx`;

    // Criar um URL temporário para o Blob e criar um link para iniciar o download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();

    // Limpar o URL temporário após o download
    window.URL.revokeObjectURL(url);

    return response;

};

export {
  ExportExcel,
  GetControleCampo,
  GetControleCdo,
  GetTesteOptico,
  ImportarArquivo,
  DeleteTesteOptico,
  DetalheTesteOptico,
  DropTesteOptico,
  UpdateTesteOptico,
  CreateTesteOptico
}