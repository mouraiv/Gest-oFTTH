import Api from '../services/api';

const GetEnderecoTotalAny = async (id) => {
  const response = await Api.get('/EnderecoTotal/Carregar', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

const GetCarregarEnderecoTotal = async (id) => {
  const response = await Api.get('/EnderecoTotal/ListarCarregarId', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

const GetEnderecoTotal = async (filtro, {signal}) => {
  const response = await Api.post('/EnderecoTotal/Listar', filtro, {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const GetBaseAcumulada = async (filtro, {signal}) => {
  const response = await Api.get('/EnderecoTotal/BaseAcumulada', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const GetGanhoSurvey = async (filtro, {signal}) => {
  const response = await Api.get('/EnderecoTotal/GanhoSurvey', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

const GetGanhoSurveyDia = async (filtro) => {
  const response = await Api.get('/EnderecoTotal/GanhoSurveyDia', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

export {
  GetBaseAcumulada,
  GetEnderecoTotal,
  GetCarregarEnderecoTotal,
  GetGanhoSurveyDia,
  GetGanhoSurvey,
  GetEnderecoTotalAny
}