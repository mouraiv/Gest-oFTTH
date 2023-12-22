import api from '../services/api';

export const createAnalise = async (analise) => {
    const response = await api.post('/Analise/Cadastrar', analise);
    return response;
  };
  
  export const updateAnalise = async (analise) => {
    console.log(analise.id_Analise)
    const response = await api.put(`/Analise/Atualizar/${analise.id_Analise}`, analise);
    return response;
  };

  export const deleteAnalise = async (id) => {
    const response = await api.delete(`/Analise/Deletar/${id}`);
    return response;
  };