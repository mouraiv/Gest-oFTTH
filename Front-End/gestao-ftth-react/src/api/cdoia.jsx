import Api from '../services/api';

  const CreateAnaliseCdoia = async (cdoia) => {
    const response = await Api.post('/AnaliseCDOIA/Cadastrar', cdoia);
    return response;
  };
  
  const UpdateAnaliseCdoia = async (cdoia) => {
    const response = await Api.put(`/AnaliseCDOIA/Atualizar/${cdoia.id_AnaliseCDOIA}`, cdoia);
    return response;
  };

  const DeleteAnaliseCdoia = async (id) => {
    const response = await Api.delete(`/AnaliseCDOIA/Deletar/${id}`);
    return response;
  };

  export {
    CreateAnaliseCdoia,
    UpdateAnaliseCdoia,
    DeleteAnaliseCdoia
  }