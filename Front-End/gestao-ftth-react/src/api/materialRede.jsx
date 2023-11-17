import api from '../services/api';

export const DetahleMaterialRedeAny = async (id) => {
  const response = await api.get('/MaterialRede/Carregar', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};