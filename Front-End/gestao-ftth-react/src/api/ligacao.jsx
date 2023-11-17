import api from '../services/api';

export const getCarregarLigacao = async (id) => {
    const response = await api.get('/Ligacao/ListarCarregarId', {
      params: {id},
      headers:{
        'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
      },
    });
  
    return response;
  };

  export const getLigacaoAny = async (id) => {
    const response = await api.get('/Ligacao/Carregar', {
      params: {id},
      headers:{
        'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
      },
    });
  
    return response;
  };