import api from '../services/api';

export const getEnderecoTotalAny = async (filtro) => {
  const response = await api.get('/EnderecoTotal/Carregar', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response.data;
};