import Api from '../services/api';

const VerificarUsuario = async (data) => {
  const response = await Api.post('/Usuario/Verificar', data, {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },

  });

  return response;

  };

  const TestarUsuario = async (login) => {
    const response = await Api.get('/Usuario/TestarUsuario', {
      params: {login},
      headers:{
        'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
      },
  
    });
  
    return response;
  
  };
  

  const GetUsuario = async () => {
    const response = await Api.get('/Usuario/Listar', {
      headers:{
        'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
      },
    });
  
    return response;
  };  

export {
  TestarUsuario,
  VerificarUsuario,
  GetUsuario,
}
