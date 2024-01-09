import api from '../services/api';

export const getEnderecoTotalAny = async (id) => {
  const response = await api.get('/EnderecoTotal/Carregar', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

export const getCarregarEnderecoTotal = async (id) => {
  const response = await api.get('/EnderecoTotal/ListarCarregarId', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};

export const getEnderecoTotal = async (filtro, {signal}) => {
  const response = await api.post('/EnderecoTotal/Listar', filtro, {
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

export const getBaseAcumulada = async (filtro, {signal}) => {
  const response = await api.get('/EnderecoTotal/BaseAcumulada', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

export const getGanhoSurvey = async (filtro, {signal}) => {
  const response = await api.get('/EnderecoTotal/GanhoSurvey', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
    signal: signal
  });

  return response;
};

export const getGanhoSurveyDia = async (filtro) => {
  const response = await api.get('/EnderecoTotal/GanhoSurveyDia', {
    params: filtro,
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });

  return response;
};