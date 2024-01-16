import Api from '../services/api';

const GetTesteOptico = async (filtro, {signal}) => {
  const response = await Api.get('/TesteOptico/Listar', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const GetControleCdo = async (filtro, {signal}) => {
  const response = await Api.get('/TesteOptico/ControleCdo', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const CreateTesteOptico = async (testeOptico) => {
  const response = await Api.post('/TesteOptico/Cadastrar', testeOptico);
  return response;
};

const UpdateTesteOptico = async (testeOptico) => {
  const response = await Api.put(`/TesteOptico/Atualizar/${testeOptico.id_TesteOptico}`, testeOptico);
  return response;
};

const DeleteTesteOptico = async (id) => {
  const response = await Api.delete(`/TesteOptico/Deletar/${id}`);
  return response;
};

const DropTesteOptico = async () => {
  const response = await Api.get("/TesteOptico/ListaUnica", {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

const DetalheTesteOptico = async (id) => {
  const response = await Api.get("/TesteOptico/Detalhe", {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

const ImportarArquivo = async (arquivo) => {
  
  const formData = new FormData();
  formData.append('arquivo', arquivo);

  const response = await Api.post('/TesteOptico/UploadModelo', formData);
  return response;
};

export {
  GetControleCdo,
  GetTesteOptico,
  ImportarArquivo,
  DeleteTesteOptico,
  DetalheTesteOptico,
  DropTesteOptico,
  UpdateTesteOptico,
  CreateTesteOptico
}