import React, { useEffect, useState, useCallback } from 'react';
import { Content, GlobalStyle, Template } from "../../GlobalStyle";
import { GetEnderecoTotal, ExportExcel} from "../../api/enterecoTotais";
import { DropMaterialRede } from "../../api/materialRede";
import {dispComercialOptions} from '../../components/dropbox/options';
import ButtonDefaut from '../../components/Button/ButtonDefaut';
import DataGridTable from '../../components/DataGrid';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import DropBox from '../../components/dropbox';
import { Filter, Painel,ButtonUpload, ButtonExportarExcel, InputText } from './styles';
import DialogAlert from "../../components/Dialog";
import InfoDataBase from '../../components/DbInfo';
import { formatarNumero } from "../../util/formatarNumeros";
import ProgressComponent from '../../components/progress/ProgressComponent';

function EnderecoTotal() {
  GlobalStyle();

  const [enderecoTotal, setEnderecoTotal] = useState({});
  const [enderecoTotalLocal, setEnderecoTotalLocal] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [cdoInput, setCdoInput] = useState('');

  /* --------------- DROP FILTER --------------------- */
  const [dropUf, setDropUf] = useState([]);
  const [uf, setUf] = useState("");

  const [dropSiglaEstacao, setDropSiglaEstacao] = useState([]);
  const [siglaEstacao, setSiglaEstacao] = useState("");

  const [dropEstacao, setDropEstacao] = useState([]);
  const [estacao, setEstacao] = useState("");

  const [dropBairro, setDropBairro] = useState([]);
  const [bairro, setBairro] = useState("");

  const [dropMunicipio, setDropMunicipio] = useState([]);
  const [municipio, setMunicipio] = useState("");

  const [dropViabilidade, setDropViabilidade] = useState([]);
  const [viabilidade, setViabilidade] = useState("");

  const [dropGrupoOperacional, setDropGrupoOperacional] = useState([]);
  const [grupoOperacional, setGrupoOperacional] = useState("");

  const [dropEstadoOperacional, setDropEstadoOperacional] = useState([]);
  const [estadoOperacional, setEstadoOperacional] = useState("");

  const [dropEstadoControle, setDropEstadoControle] = useState([]);
  const [estadoControle, setEstadoControle] = useState("");

  const [dispComercial, setDispComercial] = useState(null);

  const [logradouro, setLogradouro] = useState("");
  const [cep, setCep] = useState("");
  const [numeroFaichada, setNumeroFaichada] = useState("");

  /* -----------------------------------------------------------*/

  /* --------------- ESTADO PESQUISA LOTE --------------------- */
  const [checkedCheckbox, setCheckedCheckbox] = useState('');
  const [baseAcumulada, setBaseAcumulada] = useState();
  const [semCdo, setSemCdo] = useState();

  const [surveyInput, setSurveyInput] = useState('');
  const [chaveInput, setChaveInput] = useState('');
  const [chaveCelulaInput, setChaveCelulaInput] = useState('');

  const [survey, setSurvey] = useState("");
  const [chave, setChave] = useState("");
  const [chaveCelula, setChaveCelula] = useState("");

  /* ----------------------------------------------------------- */

  const [loading, setLoading] = useState(false);
  const [loadingDrop, setLoadingDrop] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleSurvey, setVisibleSurvey] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [inputDispComercial, setInputDispComercial] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [countListSurvey, setCountListSurvey] = useState(0);
  const [surveyList, setSurveyList] = useState([]);
  const [viewListSurvey, setViewListSurvey] = useState("");
  const [listLocalSurvey, setListLocalSurvey] = useState(false);
  const [carregarListsurvey, setCarregarListSurvey] = useState(false);
  const [carregarExport, setCarregarExport] = useState(false);

  const controller = new AbortController();
  const signal = controller.signal;
  const totalRegistros = enderecoTotal?.paginacao?.total;

  const aplicarFiltros = useCallback((dados) => {
    return dados.filter(
      value =>
      (uf !== "" ? value.uf === uf : true) &&
      (siglaEstacao !== "" ? value.siglaEstacao === siglaEstacao : true) &&
      (estacao !== "" ? value?.materialRede?.nomeAbastecedora_Mt === estacao : true) &&
      (logradouro !== "" ? value?.logradouro === logradouro : true) &&
      (numeroFaichada !== "" ? value?.numeroFaichada === numeroFaichada : true) &&
      (cep !== "" ? value?.CEP === cep : true) &&
      (bairro !== "" ? value?.bairro === bairro : true) &&
      (municipio !== "" ? value?.municipio === municipio : true) &&
      (cdoInput !== "" ? value.nomeCdo === cdoInput : true) &&
      (viabilidade !== "" ? value.cod_Viabilidade === viabilidade : true) &&
      (dispComercial !== null ? value.id_Disponibilidade === dispComercial :  true) &&
      (grupoOperacional !=="" ? value?.materialRede?.grupoOperacional_Mt === grupoOperacional : true) &&
      (estadoOperacional !=="" ? value?.materialRede?.estadoOperacional_Mt === estadoOperacional : true) &&
      (estadoControle !=="" ? value?.materialRede?.estadoControle_Mt === estadoControle : true)
    );
  },[cdoInput, dispComercial, estacao, logradouro, numeroFaichada, cep, bairro, municipio, estadoControle, estadoOperacional, grupoOperacional, siglaEstacao, uf, viabilidade])

  const filtro = {
    pagina : currentPage,
    totalSurveyList: countListSurvey,
    CHAVE: chave !== "" ? chave : chaveInput,
    ChaveCelula: chaveCelula !== "" ? chaveCelula : chaveCelulaInput,
    UF : uf,
    SiglaEstacao : siglaEstacao,
    Estacao : estacao,
    Logradouro : logradouro,
    numeroFachada : numeroFaichada,
    CEP : cep,
    Bairro : bairro,
    Municipio : municipio,
    CDO: cdoInput,
    Cod_Viabilidade : viabilidade,
    Cod_Survey: survey !== "" ? survey : surveyInput,
    Id_Disponibilidade: dispComercial,
    Id_StatusGanho: null,
    AnoMesBool : baseAcumulada,
    SemCdo : semCdo,
    GrupoOperacional : grupoOperacional,
    EstadoOperacional: estadoOperacional,
    EstadoControle: estadoControle,
  };

  async function FetchExportExcel(){
    try {
      if(totalRegistros === null || totalRegistros === 0){
        setCarregarExport(false)
        setMensagem('Nenhum registro para exportação.');
        
      }else if(totalRegistros >= 1000000){
        setCarregarExport(false)
        setMensagem('O filtro não pode exceder 1.000.000 de registros para exportação.');
       
      }else{
        await ExportExcel(filtro).finally(() => {
          setVisible(false);
          setCarregarExport(false);

        });
      }

    } catch (error) {
      setMensagem(`Erro ao carregar : ${error}`);
      setVisible(true);
      
    } 

  }

  const FetchDropFilter  = async () => {
    
    try {
      const dropList = await DropMaterialRede();

      if (dropList.status == 200) {
        const _dropListUf = dropList.data
            .map((value) => value.uf)
            .filter((value, index, self) => {
                return self.indexOf(value) === index;
        });
        setDropUf(_dropListUf);

        const _dropListGrupoOperacional = dropList.data
            .map((value) => value.grupoOperacional)
            .filter((value, index, self) => {
                  return self.indexOf(value) === index;
          });
          setDropGrupoOperacional(_dropListGrupoOperacional);

          const _dropListEstadoOperacional = dropList.data
          .map((value) => value.estadoOperacional)
          .filter((value, index, self) => {
                return self.indexOf(value) === index;
          });
          setDropEstadoOperacional(_dropListEstadoOperacional);
          
          const _dropListEstadoControle = dropList.data
          .map((value) => value.estadoControle)
          .filter((value, index, self) => {
                return self.indexOf(value) === index;
          });
          setDropEstadoControle(_dropListEstadoControle);
          
          const _dropListViab = [... new Set(dropList.data
            .map((value, index) => {
                return value.cod_Viabilidade
          }))]
          .filter((value) => value !== undefined);
          setDropViabilidade(_dropListViab);
  
    }

      
    } catch (error) {
      console.log(`Houve um error : ${error}`)
      setLoadingDrop(true);

    } finally{
      setLoadingDrop(true);
    }

  }

  const FetchDropFilterMaterialExec  = async (
    uf, 
    cdo, 
    sigla,
    estacao,
    semCdo,
    anoMesBool) => {
    
    try {

      const dropList = await DropMaterialRede(
        uf, 
        cdo, 
        sigla,
        estacao,
        semCdo,
        anoMesBool);

      if (dropList.status == 200) {
       
          const _dropListSiglaEstacao = [... new Set(dropList.data
          .map((value, index) => {
              if(value.siglaEstacao != null){ 
                return value.siglaEstacao
              }
          }))]
          .filter((value) => value !== undefined);
          setDropSiglaEstacao(_dropListSiglaEstacao);

          const _dropListEstacao = [... new Set(dropList.data
          .map((value, index) => {
              if(value.siglaEstacao != null){ 
                return value.nomeAbastecedora
              }
          }))]
          .filter((value) => value !== undefined);
          setDropEstacao(_dropListEstacao);

          const _dropListBairro = [... new Set(dropList.data
          .map((value) => value.bairro)
          .filter((value, index, self) => {
                return self.indexOf(value) === index;
          }))];
          setDropBairro(_dropListBairro);

          const _dropListMunicipio = [... new Set(dropList.data
          .map((value) => value.municipio)
          .filter((value, index, self) => {
                return self.indexOf(value) === index;
          }))];
          setDropMunicipio(_dropListMunicipio);

          const _dropListGrupoOperacional = [... new Set(dropList.data
          .map((value) => value.grupoOperacional)
          .filter((value, index, self) => {
                return self.indexOf(value) === index;
          }))];
          setDropGrupoOperacional(_dropListGrupoOperacional);

          const _dropListEstadoOperacional = [... new Set(dropList.data
          .map((value) => value.estadoOperacional)
          .filter((value, index, self) => {
                return self.indexOf(value) === index;
          }))];
          setDropEstadoOperacional(_dropListEstadoOperacional);
          
          const _dropListEstadoControle = [... new Set(dropList.data
          .map((value) => value.estadoControle)
          .filter((value, index, self) => {
                return self.indexOf(value) === index;
          }))];
          setDropEstadoControle(_dropListEstadoControle);
          
          const _dropListViab = [... new Set(dropList.data
            .map((value, index) => {
                return value.cod_Viabilidade
          }))]
          .filter((value) => value !== undefined);
          setDropViabilidade(_dropListViab);
  
    }
      
    } catch (error) {
      console.log(`Houve um error : ${error}`)
      setLoadingDrop(true);

    } finally{
      setLoadingDrop(true);
    }
  }

  const fetchEnderecoTotal = useCallback(async () => {    
    try {
    
      if(listLocalSurvey) {
        const surveyFiltro = await aplicarFiltros(enderecoTotal.resultado);
        let _survey = {
          paginacao:{
            pagina: 1,
            paginasCorrentes: surveyFiltro.length,
            tamanho: surveyFiltro.length,
            total: surveyFiltro.length,
            totalPaginas:1
          },
          resultado: surveyFiltro
        }
        setEnderecoTotalLocal(_survey);
          
      } else {
        const response = await GetEnderecoTotal(filtro, {signal});

        if(response.status == 200) {
          setEnderecoTotal(response.data);
        }
        
      }

    } catch (error) {
      setMensagem(`Erro ao carregar : ${error}`)
      
    } finally {
      setLoading(true)
      setInitialLoad(false);
      setCarregarListSurvey(false);
      countListSurvey > 0 ? setListLocalSurvey(true) : setListLocalSurvey(false);
            
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitClicked]);

  // Função para avançar para a próxima página
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    setSubmitClicked(true);
  };

  // Função para retroceder para a página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setSubmitClicked(true);
  };

  useEffect(() => {    
    if (initialLoad) {
      // Realiza a pesquisa inicial apenas uma vez ao carregar a página
      FetchDropFilter();
      fetchEnderecoTotal();

    } else if (submitClicked) {
      // Realiza pesquisas apenas quando o botão de pesquisa é clicado
      fetchEnderecoTotal();
      setLoading(false);
      setSubmitClicked(false);

    } else {

      return () => { controller.abort() };
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchEnderecoTotal]);

  const columns = [
    { key: 'uf', name: 'UF', width: '2%' },
    { key: 'anoMes', name: 'BASE ACUM.', width: '7%' },
    { key: 'localidade', name: 'LOCALIDADE', width: '8%' },
    { key: 'celula', name: 'CELULA', width: '8%' },
    { key: 'siglaEstacao', name: 'SIGLA', width: '6%' },
    { key: 'materialRede.nomeAbastecedora_Mt', name: 'ESTAÇÃO', width: '8%' },
    { key: 'nomeCdo', name: 'CDO', width: '5%' },
    { key: 'cod_Viabilidade', name: 'COD. VIAB', width: '3%' },
    { key: 'tipoViabilidade', name: 'TIPO VIAB', width: '8%' },
    { key: 'cod_Survey', name: 'SURVEY', width: '8%' },
    { key: 'quantidadeUMS', name: 'UMS', width: '3%' },
    { key: 'disp_Comercial', name: 'DISP. COMERCIAL', width: '5%' },
    { key: 'materialRede.grupoOperacional_Mt', name: 'GRUPO OPERACIONAL', width: '8%' },
    { key: 'materialRede.estadoControle_Mt', name: 'EST. CONTROLE', width: '8%' },
    { key: 'materialRede.estadoOperacional_Mt', name: 'EST. OPERACIONAL', width: '8%' },
  ];
  
  const handleCheckboxChange = (checkboxName) => {
    setCheckedCheckbox(checkboxName === checkedCheckbox ? '' : checkboxName);
    setChaveInput("");
    setChaveCelulaInput("");
    setSurveyInput("");
  };

  const handleUf = (event) => {
    const input = event.target.value;
    setLoadingDrop(false);
    setUf(input);
    FetchDropFilterMaterialExec(
      input, 
      cdoInput,
      siglaEstacao, 
      estacao,
      semCdo,
      baseAcumulada
    );
    
  };

  const handleSiglaEstacao = (event) => {
    const input = event.target.value;
    setSiglaEstacao(input);
    FetchDropFilterMaterialExec(
      uf, 
      cdoInput,
      input, 
      estacao,
      semCdo,
      baseAcumulada
    );
  }

  const handleGrupoOperacional = (event) => {
    const input = event.target.value;
    setGrupoOperacional(input);
  }

  const handleControle = (event) => {
    const input = event.target.value;
    setEstadoControle(input);
  }

  const handleOperacional = (event) => {
    const input = event.target.value;
    setEstadoOperacional(input);
  }

  const handleLogradouro = (event) => {
    const input = event.target.value;
    setLogradouro(input);
  };

  const handleNumeroFaichada = (event) => {
    const input = event.target.value;
    setNumeroFaichada(input);
  };

  const handleCep = (event) => {
    const input = event.target.value;
    setCep(input);
  };

  const handleBairro = (event) => {
    const input = event.target.value;
    setBairro(input);
  };

  const handleMunicipio = (event) => {
    const input = event.target.value;
    setMunicipio(input);
  };

  const handleEstacao = (event) => {
    const input = event.target.value;
    setEstacao(input);
    FetchDropFilterMaterialExec(
      uf, 
      cdoInput,
      siglaEstacao, 
      input,
      semCdo,
      baseAcumulada
    );
  };

  const handleCdo = (event) => {
    const input = event.target.value;
    setCdoInput(input);
  };

  const handleSurvey = (event) => {
    const lines = event.target.value.toUpperCase().split(','); // Divide por novas linhas
    const surveys = lines.filter(line => line.trim() !== '');
    const _survey = surveys.join(',');

    if (checkedCheckbox === 'chave_cdoe') {
      setSurveyInput("");
      setChaveCelulaInput("");
      setChaveInput(_survey);

    } else if(checkedCheckbox === 'chave_celula') {
      setSurveyInput("");
      setChaveInput("");
      setChaveCelulaInput(_survey);

    } else if(checkedCheckbox === 'survey'){
      setChaveInput("");
      setChaveCelulaInput("");
      setSurveyInput(_survey);

    }

  };

  const handleViabilidade = (event) => {
    const input = event.target.value;
    setViabilidade(input);
  };

  const handleDispComercial = (event) => {
    const input = event.target.value;
    setInputDispComercial(input);

    if(input == 'VIÁVEL'){
      setDispComercial(1);

    }
    if(input == 'INVIÁVEL'){
      setDispComercial(2);

    }
    if(input == ''){
      setDispComercial(null);

    }

  }

  const handleColarSurvey = (e) => {
    setViewListSurvey(e.target.value);
    const lines = e.target.value.split(/\r?\n|,/); // Divide por novas linhas
    const surveys = lines.filter(line => line.trim() !== ''); // Remove linhas vazias

    setCountListSurvey(surveys.length);
    setSurveyList(surveys.join(','));
  };

  const handleConfirm = () => {
    if (checkedCheckbox === 'chave_cdoe') {
      //console.log("CDOE");
      setChave(surveyList)

    }else if(checkedCheckbox === 'chave_celula') {
      //console.log("CELULA");
      setChaveCelula(surveyList)
      
    }else if(checkedCheckbox === 'survey'){
      //console.log("SURVEY");
      setSurvey(surveyList);

    }
    setVisibleSurvey(false);

  };

  const handleBaseAcumulada = (checkboxName) => {
    setBaseAcumulada(checkboxName === baseAcumulada ? false : checkboxName);
    FetchDropFilterMaterialExec(uf, cdoInput, siglaEstacao, estacao, semCdo, checkboxName);
    setLoadingDrop(false);
  }

  const handleSemCdo = (checkboxName) => {
    setSemCdo(checkboxName === semCdo ? false : checkboxName);
    FetchDropFilterMaterialExec(uf, cdoInput, siglaEstacao, estacao, checkboxName,  baseAcumulada,);
    setLoadingDrop(false);
  }

  const handleImportSurvey = () => {
    setSurvey("");
    setChave("");
    setChaveCelula("");
    setVisibleSurvey(true);
  }

  const handleExportExcel = () => {
    setVisible(true);
    setCarregarExport(true);
    FetchExportExcel();
  }

  const submit = () => {
    setSubmitClicked(true);
    setCurrentPage(1);
    if(countListSurvey > 0){
      setCarregarListSurvey(true);
      
     }else{
      setEnderecoTotalLocal({});
      setListLocalSurvey(false);
      setCarregarListSurvey(false);
      
    }
    FetchDropFilterMaterialExec(
      uf, 
      cdoInput,
      siglaEstacao, 
      estacao,
      semCdo,
      baseAcumulada
    );
    
  };

  const limparFiltro = () => {
    setUf("");
    setEstacao("");
    setSiglaEstacao("");
    setSurveyList([]);
    setSurvey("");
    setChave("");
    setChaveCelula("");
    setViewListSurvey("")
    setCountListSurvey(0);
    setCdoInput("");
    setLogradouro("");
    setNumeroFaichada("");
    setCep("");
    setBairro("")
    setMunicipio("");
    setViabilidade("");
    setGrupoOperacional("");
    setEstadoControle("");
    setEstadoOperacional("");
    setInputDispComercial("");
    setSurveyInput("");
    setChaveInput("");
    setChaveCelulaInput("");
    setDispComercial(null);
    setCurrentPage(1);
    setSubmitClicked(true);
    setListLocalSurvey(false);
    setEnderecoTotalLocal({})
    setCarregarListSurvey(false);
    setCheckedCheckbox('');
    setBaseAcumulada(false);
    setSemCdo(false);
    FetchDropFilter();

  };

  const fetchLoading = () => {
    setLoading(false);
  }

return (
      <>
      <Template>
        <Header title={"EnderecoTotal"} />
          <Content>
          <InfoDataBase />
          <DialogAlert 
                    visibleDiag={visibleSurvey} 
                    visibleHide={() => setVisibleSurvey(false)}
                    header={<h4>Inserir Lista</h4>}
                    colorType={'#13293d'}
                    ConfirmaButton={countListSurvey < 59999 ? true : false}
                    CancelaButton={countListSurvey < 59999 ? false : true}
                    buttonConfirmar={handleConfirm}
                    textCloseButton={'Cancelar'}
                    text={
                        <>
                        <p style={countListSurvey < 59999 ? 
                        {fontSize: '0.9rem', marginBottom: '0.2rem', fontStyle: 'italic'} :
                        {fontSize: '0.9rem', marginBottom: '0.2rem', fontStyle: 'italic', color:'red'}}>{ countListSurvey > 0 ? (formatarNumero((countListSurvey + 1) - 1)) : 0 } / 60.000 Registros</p>
                        <textarea style={{
                          width: '450px',
                          height: '300px',
                          padding: '0.5rem',
                          fontStyle: 'italic',
                          fontWeight: '600',
                          resize: 'none'
                        }}
                          value={viewListSurvey}
                          onChange={(e) => handleColarSurvey(e)}
                          placeholder="Cole os registros aqui"
                        />
                        {countListSurvey > 59999 ? (
                        <p style={{
                          border:'1px solid red',
                          textAlign: 'center',
                          color:'red',
                          fontSize:'0.8rem',
                          padding:'0.3rem'
                        }}>Quantidade máxima de 60.000 surveys excedida.</p>
                        ):(null)
                        }
                        </>
                    }
                />
          <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => setVisible(false)}
                    header={carregarExport ? null : <h4>Atenção</h4>}
                    colorType={carregarExport ? null : '#ff0000'}
                    ConfirmaButton={false}
                    CancelaButton={carregarExport ?? false}
                    textCloseButton={'Ok'}
                    text={
                        <>
                        { carregarExport ? (
                          <>
                          <div>
                            <div style={{border:'1px solid', borderRadius:'0.3rem', fontSize:'0.8rem'}}>
                              <div style={{padding: '0.5rem'}}>
                                <p>Exportando registros.</p>
                                <p>Esse processo pode demora de acordo com da quantidade de registros.</p>
                            </div>
                                <ProgressComponent />
                            </div>
                        </div>
                          </>
                        ):(
                        <p>{mensagem}</p>
                        )}
                        </>
                    }
                />
            <Filter>
              <div>
              <div style={{display: 'flex'}}>
              {loadingDrop ? (
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"UF"} event={handleUf} lista={dropUf.sort()} text={uf} />
              </div>
              ):(
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"UF"} event={null} lista={dropUf.sort()} text={uf} disable={true}/>
              </div>
              )}
              { uf !== '' ? (
              <>
              { estacao !== '' ? (
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Sigla Estação"} event={handleSiglaEstacao} lista={[""]} text={siglaEstacao} disable={true}/>
              </div>
              ) : (
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Sigla Estação"} event={handleSiglaEstacao} lista={loadingDrop ? dropSiglaEstacao.sort() ?? "" : []} text={siglaEstacao} />
                </div>
              )}
               { siglaEstacao !== '' ? (
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={[""]} text={estacao} disable={true}/>
              </div>
               ):(
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={loadingDrop ? dropEstacao.sort() : []} text={estacao}/>
              </div>
               )}

              </>
              ) : (
              <>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Sigla Estação"} event={handleSiglaEstacao} lista={[""]} text={siglaEstacao} disable={true}/>
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={[""]} text={estacao} disable={true}/>
               </div>
               </> 
              )}

              <div>
              <div style={{marginLeft:'1rem', height: '35px', width: '', marginTop: '0.6rem', border:"1px solid #aaaaaa", backgroundColor:"#e7e7e7", paddingLeft: '0.6rem', paddingTop: '0.4rem'}}>
                  <label>
                    <input
                      type="checkbox"
                      checked={baseAcumulada === true}
                      onChange={() => handleBaseAcumulada(true)}
                    />
                    {" Base Acumulada"}
                  </label>
              </div>
              <div style={{marginLeft:'1rem', height: '35px',  width: '160px', marginTop: '0.3rem', border:"1px solid #aaaaaa", backgroundColor:"#e7e7e7", paddingLeft: '0.6rem', paddingTop: '0.4rem'}}>
                  <label>
                    <input
                      type="checkbox"
                      checked={semCdo === true}
                      onChange={() => handleSemCdo(true)}
                    />
                    {" Sem CDO Associada"}
                  </label>
              </div>
              </div>

               <div style={{display:'flex', flexDirection: 'column'}}>
                <div style={{marginTop: '0.6rem', marginLeft:'1rem', border:"1px solid #aaaaaa", backgroundColor:"#e7e7e7", padding: '0.8rem'}}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checkedCheckbox === 'survey'}
                      onChange={() => handleCheckboxChange('survey')}
                    />
                    {" Survey"}
                  </label>

                  <label style={{marginLeft: "0.5rem"}}>
                    <input
                      type="checkbox"
                      checked={checkedCheckbox === 'chave_cdoe'}
                      onChange={() => handleCheckboxChange('chave_cdoe')}
                    />
                    {" Chave-CDOE"}
                  </label>

                  <label style={{marginLeft: "0.5rem"}}>
                    <input
                      type="checkbox"
                      checked={checkedCheckbox === 'chave_celula'}
                      onChange={() => handleCheckboxChange('chave_celula')}
                    />
                    {" Chave-Celula"}
                  </label>
                
               <div style={{display: 'flex'}}> 
              { countListSurvey > 0 ? (
                <input style={{
                  paddingLeft: '0.2rem',
                  marginTop: '0.3rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  width: '200px',
                  height: '24px',
                  backgroundColor: 'white',
                  border: '1px solid',
                }} label={"CHAVE"} value={''} placeholder={countListSurvey > 0 ? `${countListSurvey} Registros` : null} disabled/>
              ) : (
              <input style={{
                  marginTop: '0.3rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  width: '200px',
                  height: '24px',
                  textTransform: 'uppercase'
                }} label={"Survey"} maxLength="30" onChange={handleSurvey} value={chaveCelulaInput === "" ? (surveyInput === "" ? chaveInput : surveyInput): chaveCelulaInput} />
              )
              }
              <ButtonUpload name="upload" onClick={handleImportSurvey} >Lista</ButtonUpload>
              </div> 
              </div>
              
              </div>
             
              </div>

              <div style={{position:'absolute', right:0, top:0, marginTop:'0.3rem', marginRight:'0.4rem'}}>
              { loading && loadingDrop ? (
                <>
                <ButtonExportarExcel onClick={handleExportExcel}>Exportar Excel</ButtonExportarExcel>
                </>
              ):(null)}
              </div>

              <div style={{display: 'flex'}}>
             
              { uf !== '' && loadingDrop ? (
              <>
               <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem', marginTop: '0.7rem'}}>
              <label>Logradouro</label> 
              <InputText onChange={handleLogradouro} value={logradouro} style={{width: "500px"}}/>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem', marginTop: '0.7rem'}}>
              <label>N°</label>  
              <InputText onChange={handleNumeroFaichada} value={numeroFaichada} style={{width: "80px"}} />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem', marginTop: '0.7rem'}}>
              <label>CEP</label>  
              <InputText onChange={handleCep} value={cep} style={{width: "150px"}} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Bairro"} event={handleBairro} lista={loadingDrop ? dropBairro.sort() : []} text={bairro}/>
               </div>
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Município"} event={handleMunicipio} lista={loadingDrop ? dropMunicipio.sort() : []} text={municipio}/>
               </div>
              </>
              ):(
              <>
               <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem', marginTop: '0.7rem'}}>
              <label>Logradouro</label> 
              <InputText style={{width: "500px"}} value={logradouro} disabled/>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem', marginTop: '0.7rem'}}>
              <label>N°</label>  
              <InputText style={{width: "80px"}} value={numeroFaichada} disabled/>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem', marginTop: '0.7rem'}}>
              <label>CEP</label>  
              <InputText style={{width: "150px"}} value={cep} disabled/>
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"194px"} height={"25px"} valueDefaut={""} label={"Bairro"} event={null} lista={[""]} text={bairro} disable={true}/>
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Município"} event={null} lista={[""]} text={municipio} disable={true}/>
              </div>
              </>
              
              )}
              </div>

              <div style={{display: 'flex'}}>
              
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
              <DropBox width={"150px"} height={"25px"} valueDefaut={""} event={handleDispComercial} label={"Disponibilidade"} lista={loadingDrop ? dispComercialOptions : []} text={inputDispComercial} />
              </div>
              <div style={{display: 'flex', flexDirection: 'column', marginLeft: '1rem', marginTop: '0.7rem'}}>
              <label>CDO</label>
              { semCdo || !loadingDrop ?  
              <InputText style={{width: "150px"}} onChange={handleCdo} value={cdoInput} disabled/> : 
              <InputText style={{width: "150px"}} onChange={handleCdo} value={cdoInput} />
              } 
              </div>
              <div style={{ marginLeft: '1rem', marginTop: '0.7rem' }}>
              <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Viabilidade"} event={handleViabilidade} lista={loadingDrop ? dropViabilidade.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)) : []} text={viabilidade} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"200px"} height={"25px"} valueDefaut={""} label={"Grupo Operacional"} event={handleGrupoOperacional} lista={loadingDrop ? dropGrupoOperacional.sort() : []} text={grupoOperacional} />
              </div>      
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"350px"} height={"25px"} valueDefaut={""} label={"Est. Controle"} event={handleControle} lista={loadingDrop ? dropEstadoControle.sort() : []} text={estadoControle} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"208px"} height={"25px"} valueDefaut={""} label={"Est. Operacional"} event={handleOperacional} lista={loadingDrop ? dropEstadoOperacional.sort() : []} text={estadoOperacional} />
              </div>

              <div style={{display: 'flex', marginRight:'1rem'}}>
                {loading && loadingDrop ? (
                  <>
                  <ButtonDefaut event={submit} text={"Filtrar"} />
                  <ButtonDefaut event={limparFiltro} text={"Limpar"} />
                  </>
                ):(null)
                }
              </div>

              </div>
              </div>           
            </Filter>
            { enderecoTotal.resultado !== undefined ? (
              <>
              {carregarListsurvey ? (
                <>  
                { loading ? (
                  <>
                   <Painel>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.comGanhoTotal)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO ATIVO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.comGanhoAtivo)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO INATIVO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.comGanhoInativo)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO F. CÉLULA</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.comGanhoForaCelula)}</p>
                </div >
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.semGanhoTotal)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO ATIVO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.semGanhoAtivo)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO INATIVO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.semGanhoInativo)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO F. CÉLULA</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.semGanhoForaCelula)}</p>
                </div>
               </Painel>
                  <DataGridTable 
                    columns={columns} 
                    rows={enderecoTotal.resultado} 
                    paginacao={enderecoTotal.paginacao}
                    pagina={currentPage}
                    sel={enderecoTotal.sel}
                    left={prevPage}
                    right={nextPage}
                    atualizar={fetchLoading} 
                  />
                  </>
                  ):(
                    <>
                      <div>
                          <div style={{border:'1px solid', borderRadius:'0.3rem', fontSize:'0.8rem', marginTop:'10rem'}}>
                            <div style={{padding: '0.5rem'}}>
                              <p>Buscando registros no banco de dados.</p>
                              <p>Esse processo pode demora de acordo com da quantidade de Registros.</p>
                          </div>
                              <ProgressComponent />
                          </div>
                      </div>
                    </>
                  )
                }
                </>
                ):(
                <>
                {loading ? (  
                  <>
                  <Painel>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.comGanhoTotal)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO ATIVO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.comGanhoAtivo)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO INATIVO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.comGanhoInativo)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO F. CÉLULA</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.comGanhoForaCelula)}</p>
                </div >
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.semGanhoTotal)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO ATIVO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.semGanhoAtivo)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO INATIVO</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.semGanhoInativo)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO F. CÉLULA</p>
                    <p className='result'>{formatarNumero(enderecoTotal.painel?.semGanhoForaCelula)}</p>
                </div>
               </Painel>
                  <DataGridTable 
                    columns={columns} 
                    rows={enderecoTotalLocal?.resultado !== undefined ? enderecoTotalLocal.resultado : enderecoTotal.resultado} 
                    paginacao={enderecoTotalLocal?.resultado !== undefined ? enderecoTotalLocal.paginacao : enderecoTotal.paginacao}
                    pagina={currentPage}
                    sel={enderecoTotal.sel}
                    left={prevPage}
                    right={nextPage}
                    atualizar={fetchLoading} 
                    />
                    </>
                    ):(
                      <>
                      <ProgressComponent />
                    </>
                    )
                }
                </>
                )}
                </> 
            ):( 
            <>
              <ProgressComponent />
            </> 
            )
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default EnderecoTotal;