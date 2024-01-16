import Api from '../services/api';

export const VerificarUsuario = async (data) => {
  const response = await Api.post('/Usuario/Verificar', data, {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};
