import api from '../services/api';

export const createValidacao = async (validacao) => {
    const response = await api.post('/Validacao/Cadastrar', validacao);
    return response;
  };

  export const updateValidacao = async (validacao) => {
    const response = await api.put(`/Validacao/Atualizar/${validacao.id_Validacao}`, validacao);
    return response;
  };
  
  export const deleteValidacao = async (id) => {
    const response = await api.delete(`/Validacao/Deletar/${id}`);
    return response;
  };  
