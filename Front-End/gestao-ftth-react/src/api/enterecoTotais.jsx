import Api from '../services/api';

const GetEnderecoTotalAny = async (id, survey, filterSurvey) => {
  const response = await Api.get('/EnderecoTotal/Carregar', {
    params: {id: id, survey: survey, filterSurvey: filterSurvey},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

const GetCarregarEnderecoTotal = async (id) => {
  const response = await Api.get('/EnderecoTotal/ListarCarregarId', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

const GetEnderecoTotal = async (filtro, {signal}) => {
  const response = await Api.post('/EnderecoTotal/Listar', filtro, {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const DropEnderecoTotal = async () => {
  const response = await Api.get(`/EnderecoTotal/ListaUnica`, {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

const GetGraficoPrincipal = async () => {
  const response = await Api.get(`/EnderecoTotal/GraficoPrincipal`, {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

const DropLocalidade = async (filtro) => {
  const response = await Api.get(`/EnderecoTotal/ListaUnicaLocalidade`, {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

const GetBaseAcumulada = async (filtro, {signal}) => {
  const response = await Api.get('/EnderecoTotal/BaseAcumulada', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const GetGanhoSurvey = async (filtro, {signal}) => {
  const response = await Api.get('/EnderecoTotal/GanhoSurvey', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const GetGanhoSurveyDia = async (filtro) => {
  const response = await Api.get('/EnderecoTotal/GanhoSurveyDia', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

const ExportExcel = async (filtro) => {

    const response = await Api.post('/EnderecoTotal/DownloadExcel', filtro, {
      responseType: 'arraybuffer', 
      });
  
      const dataAtual = new Date().toLocaleDateString().split('/').join('-'); // Formatar a data atual como dd-mm-yyyy
      const nomeArquivo = `SGF_EnderecosTotais_${dataAtual}.xlsx`;
  
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

  const FazerUploadMultiplaAssociacao = async (files, source) => {
      const formData = new FormData();
      formData.append('arquivo', files);
    
      const response = await Api.post("/EnderecoTotal/ImportarMultiplaAssociacao", formData, { cancelToken: source });
      return response;
  };

export {
  FazerUploadMultiplaAssociacao,
  GetGraficoPrincipal,
  DropEnderecoTotal,
  DropLocalidade,
  GetBaseAcumulada,
  GetEnderecoTotal,
  GetCarregarEnderecoTotal,
  GetGanhoSurveyDia,
  GetGanhoSurvey,
  GetEnderecoTotalAny,
  ExportExcel
}