import api from '../services/api';

export const getTesteOptico = async (filtro) => {
  const response = await api.get('/TesteOptico/Listar', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

export const getControleCdo = async (filtro) => {
  const response = await api.get('/TesteOptico/ControleCdo', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

export const createTesteOptico = async (testeOptico) => {
  const response = await api.post('/TesteOptico/Cadastrar', testeOptico);
  return response;
};

export const updateTesteOptico = async (testeOptico) => {
  const response = await api.put(`/TesteOptico/Atualizar/${testeOptico.id_TesteOptico}`, testeOptico);
  return response;
};

export const deleteTesteOptico = async (id) => {
  const response = await api.delete(`/TesteOptico/Deletar/${id}`);
  return response;
};

export const DropTesteOptico = async (coluna) => {
  const response = await api.get("/TesteOptico/ListaUnica", {
    params: {coluna},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

export const DetalheTesteOptico = async (id) => {
  const response = await api.get("/TesteOptico/Detalhe", {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

export const ImportarArquivo = async (arquivo) => {
  
  const formData = new FormData();
  formData.append('arquivo', arquivo);

  const response = await api.post('/TesteOptico/UploadModelo', formData);
  return response;
}; 