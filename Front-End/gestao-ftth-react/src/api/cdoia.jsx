import api from '../services/api';

export const createAnalise = async (analise) => {
    const response = await api.post('/Analise/Cadastrar', analise);
    return response;
  };
  
  export const updateAnalise = async (analise) => {
    const response = await api.put(`/Analise/Atualizar/${analise.id_Analise}`, analise);
    return response;
  };