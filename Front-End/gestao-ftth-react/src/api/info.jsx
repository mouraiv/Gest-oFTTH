import api from '../services/api';

export const getInfo = async () => {
  const response = await api.get('/Info/Listar', {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};