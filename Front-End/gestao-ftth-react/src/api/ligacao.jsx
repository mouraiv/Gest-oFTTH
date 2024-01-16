import Api from '../services/api';

const GetCarregarLigacao = async (id) => {
    const response = await Api.get('/Ligacao/ListarCarregarId', {
      params: {id},
      headers:{
        'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
      },
    });
  
    return response;
  };

const GetLigacaoAny = async (id) => {
    const response = await Api.get('/Ligacao/Carregar', {
      params: {id},
      headers:{
        'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
      },
    });
  
    return response;
  };

  export {
    GetCarregarLigacao,
    GetLigacaoAny
  }