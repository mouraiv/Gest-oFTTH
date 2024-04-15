import Api from '../services/api';

  const CreateStatusLogin = async (status) => {
    const response = await Api.post('/StatusLogin/Cadastrar', status);
    return response;
  };
  
  const UpdateStatusLogin = async (status) => {
    const response = await Api.put(`/StatusLogin/Atualizar/${status.id_Usuario}`, status);
    return response;
  };

  const VerificarStatusLogin = async (id) => {
    const response = await Api.get("/StatusLogin/Verificar", {
      params: {id},
      headers:{
        'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
      },
    });
    return response;
  };

  export {
    VerificarStatusLogin,
    CreateStatusLogin,
    UpdateStatusLogin
  }