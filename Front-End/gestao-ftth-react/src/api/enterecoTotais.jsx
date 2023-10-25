import api from '../services/api';

export const getEnderecoTotalAny = async (id) => {
  const response = await api.get('/EnderecoTotal/Carregar', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};