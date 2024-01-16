import Api from '../services/api';

export const GetInfo = async () => {
  const response = await Api.get('/Info/Listar', {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};