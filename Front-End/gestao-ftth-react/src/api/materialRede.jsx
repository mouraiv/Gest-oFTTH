import Api from '../services/api';

const DetalheMaterialRedeAny = async (id) => {
  const response = await Api.get('/MaterialRede/Carregar', {
    params: {id},
    headers:{
      'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return response;
};

  const DropMaterialRede = async (
    uf, 
    cdo, 
    sigla,
    estacao,
    semCdo,
    anoMesBool
    ) => {
    const response = await Api.get('/MaterialRede/ListaUnica', {
      params: { 
        uf: uf, 
        cdo: cdo,
        sigla : sigla,
        estacao : estacao,
        semCdo : semCdo,
        anoMesBool: anoMesBool 
      },
      headers:{
        'Accept': 'application/json, text/plain','Content-Type': 'application/json;charset=UTF-8'
      },
    });
    return response;
  };

export {
  DetalheMaterialRedeAny,
  DropMaterialRede
}