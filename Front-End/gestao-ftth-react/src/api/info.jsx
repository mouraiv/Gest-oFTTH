import Api from '../services/api';

const GetInfo = async () => {
  const response = await Api.get('/Info/Listar', {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  })
  return response;
};

const CreateInfo = async (info) => {
  const response = await Api.post('/Info/Cadastrar', info);
  return response;
};

const UpdateInfo = async (info) => {
  const response = await Api.put(`/Info/Atualizar/${info.id_info}`, info);
  return response;
};

const DeleteInfo = async (id) => {
  const response = await Api.delete(`/Info/Deletar/${id}`);
  return response;
};

export {
  GetInfo,
  CreateInfo,
  UpdateInfo,
  DeleteInfo
}