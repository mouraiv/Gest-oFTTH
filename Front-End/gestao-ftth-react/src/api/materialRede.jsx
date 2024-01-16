import Api from '../services/api';

export const DetalheMaterialRedeAny = async (id) => {
  const response = await Api.get('/MaterialRede/Carregar', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};