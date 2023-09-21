import api from '../services/api';

export const getTesteOptico = async (pagina) => {
  const response = await api.get(`/TesteOptico/Listar?pagina=${pagina}`, {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response.data;
};

export const createTesteOptico = async (user) => {
  const response = await api.post('/TesteOptico/Cadastrar', user);
  return response.data;
};

export const updateTesteOptico = async (user) => {
  const response = await api.put(`/TesteOptico/Atualizar/${user.id}`, user);
  return response.data;
};

export const deleteTesteOptico = async (id) => {
  const response = await api.delete(`/TesteOptico/Deletar/${id}`);
  return response.data;
};
