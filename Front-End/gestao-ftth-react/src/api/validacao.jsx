import Api from '../services/api';

  const CreateValidacao = async (validacao) => {
    const response = await Api.post('/Validacao/Cadastrar', validacao);
    return response;
  };

  const UpdateValidacao = async (validacao) => {
    const response = await Api.put(`/Validacao/Atualizar/${validacao.id_Validacao}`, validacao);
    return response;
  };
  
  const DeleteValidacao = async (id) => {
    const response = await Api.delete(`/Validacao/Deletar/${id}`);
    return response;
  };
  
  export {
    CreateValidacao,
    UpdateValidacao,
    DeleteValidacao
  }
