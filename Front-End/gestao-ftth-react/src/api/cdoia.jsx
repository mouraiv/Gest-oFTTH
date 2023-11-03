import api from '../services/api';

export const createAnaliseCdoia = async (cdoia) => {
    const response = await api.post('/AnaliseCDOIA/Cadastrar', cdoia);
    return response;
  };
  
  export const updateAnaliseCdoia = async (cdoia) => {
    const response = await api.put(`/AnaliseCDOIA/Atualizar/${cdoia.id_AnaliseCDOIA}`, cdoia);
    return response;
  };

  export const deleteAnaliseCdoia = async (id) => {
    const response = await api.delete(`/AnaliseCDOIA/Deletar/${id}`);
    return response;
  };