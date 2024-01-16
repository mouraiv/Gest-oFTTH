import Api from '../services/api';

  const CreateAnalise = async (analise) => {
    const response = await Api.post('/Analise/Cadastrar', analise);
    return response;
  };
  
  const UpdateAnalise = async (analise) => {
    console.log(analise.id_Analise)
    const response = await Api.put(`/Analise/Atualizar/${analise.id_Analise}`, analise);
    return response;
  };

  const DeleteAnalise = async (id) => {
    const response = await Api.delete(`/Analise/Deletar/${id}`);
    return response;
  };

  export {
    CreateAnalise,
    UpdateAnalise,
    DeleteAnalise
  }