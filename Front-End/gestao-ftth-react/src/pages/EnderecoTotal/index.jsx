import React, { useEffect, useState, useCallback } from 'react';
import { Content, GlobalStyle, Template } from "../../GlobalStyle";
import { GetEnderecoTotal } from "../../api/enterecoTotais";
import { ufOptions, dispComercialOptions, grupoOperacionalOptions,localidadeOptions, estacaoOptions, viabilidadeOptions, controleOptions, operacionalOptions} from '../../components/dropbox/options';
import ButtonDefaut from '../../components/Button/ButtonDefaut';
import DataGridTable from '../../components/DataGrid';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import TextInput from '../../components/TextInput';
import DropBox from '../../components/dropbox';
import { Filter, ButtonUpload, ProgressBar } from './styles';
import DialogAlert from "../../components/Dialog";
import InfoDataBase from '../../components/DbInfo';

function EnderecoTotal() {
  GlobalStyle();

  const [enderecoTotal, setEnderecoTotal] = useState({});
  const [enderecoTotalLocal, setEnderecoTotalLocal] = useState({});
  const [dropConstrutora, setDropConstrutora] = useState([]);
  const [construtora, setConstrutora] = useState("");
  const [dropSiglaEstacao, setDropSiglaEstacao] = useState([]);
  const [siglaEstacao, setSiglaEstacao] = useState("");
  const [dropEstacao, setDropEstacao] = useState([]);
  const [estacao, setEstacao] = useState("");
  const [uf, setUf] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cdoInput, setCdoInput] = useState('');
  const [surveyInput, setSurveyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleSurvey, setVisibleSurvey] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [viabilidade, setViabilidade] = useState("");
  const [survey, setSurvey] = useState("");
  const [grupoOperacional, setGrupoOperacional] = useState("");
  const [estadoOperacional, setEstadoOperacional] = useState("");
  const [estadoControle, setEstadoControle] = useState("");
  const [dispComercial, setDispComercial] = useState(null);
  const [inputDispComercial, setInputDispComercial] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [countListSurvey, setCountListSurvey] = useState(0);
  const [surveyList, setSurveyList] = useState([]);
  const [viewListSurvey, setViewListSurvey] = useState("");
  const [listLocalSurvey, setListLocalSurvey] = useState(false);
  const [carregarListsurvey, setCarregarListSurvey] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const controller = new AbortController();
  const signal = controller.signal;
  const intervalo = 100;

  const segundos = () => {
    let milissegundos;
    const base = 450; // Valor base para o multiplicador
    const decrementoPorIntervalo = 30; // Decremento do multiplicador a cada intervalo
    const tamanhoDoIntervalo = 500; // Tamanho de cada intervalo

    // Calcular o número de intervalos que countListSurvey ultrapassa
    let intervalosUltrapassados = Math.floor((countListSurvey - 50) / tamanhoDoIntervalo);

    // Calcular o multiplicador
    let multiplicador = base - (intervalosUltrapassados * decrementoPorIntervalo);

    // Assegurar que o multiplicador não seja negativo
    multiplicador = Math.max(multiplicador, 0);

    // Calcular milissegundos
    milissegundos = countListSurvey * multiplicador;

    return milissegundos;
  }

  const aplicarFiltros = useCallback((dados) => {
    return dados.filter(
      value =>
      (uf !== "" ? value.uf === uf : true) &&
      (construtora !== "" ? value.localidade === construtora : true)  && 
      (siglaEstacao !== "" ? value.siglaEstacao === siglaEstacao : true) &&
      (estacao !== "" ? value?.materialRede?.nomeAbastecedora_Mt === estacao : true) &&
      (cdoInput !== "" ? value.nomeCdo === cdoInput : true) &&
      (viabilidade !== "" ? value.cod_Viabilidade === viabilidade : true) &&
      //(survey !== "" ? value.cod_Survey === survey : true) &&
      (dispComercial !== null ? value.id_Disponibilidade === dispComercial :  true) &&
      (grupoOperacional !=="" ? value?.materialRede?.grupoOperacional_Mt === grupoOperacional : true) &&
      (estadoOperacional !=="" ? value?.materialRede?.estadoOperacional_Mt === estadoOperacional : true) &&
      (estadoControle !=="" ? value?.materialRede?.estadoControle_Mt === estadoControle : true)
    );
  },[cdoInput, construtora, dispComercial, estacao, estadoControle, estadoOperacional, grupoOperacional, siglaEstacao, uf, viabilidade])

  const fetchEnderecoTotal = useCallback(async () => {    
    try {
      const filtro = {
        pagina : currentPage,
        totalSurveyList: countListSurvey,
        UF : uf,
        Localidade : construtora,
        SiglaEstacao : siglaEstacao,
        Estacao : estacao,
        CDO: cdoInput,
        Cod_Viabilidade : viabilidade,
        Cod_Survey: survey !== "" ? survey : surveyInput,
        Id_Disponibilidade: dispComercial,
        GrupoOperacional : grupoOperacional,
        EstadoOperacional: estadoOperacional,
        EstadoControle: estadoControle,
      };
      
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
      countListSurvey > 4 ? setListLocalSurvey(true) : setListLocalSurvey(false);
            
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
    { key: 'uf', name: 'UF' },
    { key: 'localidade', name: 'LOCALIDADE' },
    { key: 'celula', name: 'CELULA' },
    { key: 'siglaEstacao', name: 'SIGLA' },
    { key: 'materialRede.nomeAbastecedora_Mt', name: 'ESTAÇÃO' },
    { key: 'nomeCdo', name: 'CDO' },
    { key: 'cod_Viabilidade', name: 'COD. VIAB' },
    { key: 'tipoViabilidade', name: 'TIPO VIAB' },
    { key: 'cod_Survey', name: 'SURVEY' },
    { key: 'quantidadeUMS', name: 'UMS' },
    { key: 'disp_Comercial', name: 'Disp. Comercial' },
    { key: 'materialRede.grupoOperacional_Mt', name: 'GRUPO OPERACIONAL' },
    { key: 'materialRede.estadoControle_Mt', name: 'EST. CONTROLE' },
    { key: 'materialRede.estadoOperacional_Mt', name: 'EST. OPERACIONAL' },
  ];

  const handleUf = (event) => {
    const input = event.target.value;
    setUf(input);

    const filteredLocalidades = localidadeOptions.filter(([ufOption]) => ufOption === input);
    const subElementoLocalidade = filteredLocalidades.map(subarray => subarray[1]);
    setDropConstrutora(subElementoLocalidade?.length == 0 ? [""] : subElementoLocalidade);

    setEstacao('');
  };

  const handleConstrutora = (event) => {
    const input = event.target.value;
    setConstrutora(input);
 
   // Filtrar estações correspondentes à localidade selecionada
    const filteredEstacoes = estacaoOptions.filter(([localidade]) => localidade === input);
    const subSiglaEstacoes = filteredEstacoes.map(subarray => subarray[1]);
    setDropSiglaEstacao(subSiglaEstacoes?.length == 0 ? [""] : subSiglaEstacoes);
    const subEstacoes = filteredEstacoes.map(subarray => subarray[2]);
    setDropEstacao(subEstacoes?.length == 0 ? [""] : subEstacoes);

  };

  const handleSiglaEstacao = (event) => {
    const input = event.target.value;
    setSiglaEstacao(input);
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

  const handleEstacao = (event) => {
    const input = event.target.value;
    setEstacao(input);
  };

  const handleCdo = (event) => {
    const input = event.target.value;
    setCdoInput(input);
  };

  const handleSurvey = (event) => {
    const lines = event.target.value.toUpperCase().split(','); // Divide por novas linhas
    const surveys = lines.filter(line => line.trim() !== '');
    setSurveyInput(surveys.join(','));
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
    setSurvey(surveyList);
    setVisibleSurvey(false);
  };

  const handleImportSurvey = () => {
    setSurvey("")
    setVisibleSurvey(true);
  }

  const submit = () => {
    setSubmitClicked(true);
    setCurrentPage(1);
    segundos();
    if(countListSurvey > 4){
      if(enderecoTotalLocal.resultado === undefined){
        startProgressSurvey();
      }
      setCarregarListSurvey(true);
      
     }else{
      setEnderecoTotalLocal({});
      setListLocalSurvey(false);
      
    }
    
  };

  const limparFiltro = () => {
    setUf("");
    setConstrutora("");
    setEstacao("");
    setSiglaEstacao("");
    setSurveyList([]);
    setSurvey("");
    setViewListSurvey("")
    setCountListSurvey(0);
    setCdoInput("");
    setViabilidade("");
    setGrupoOperacional("");
    setEstadoControle("");
    setEstadoOperacional("");
    setInputDispComercial("");
    setSurveyInput("");
    setDispComercial(null);
    setCurrentPage(1);
    setSubmitClicked(true);
    setListLocalSurvey(false);
    setEnderecoTotalLocal({})
    setCarregarListSurvey(false);

  };

  const fetchLoading = () => {
    setLoading(false);
  }

  const startProgressSurvey = () => {
      let tempoDecorrido = 0;

      // Calcula o incremento de tempo para cada intervalo com base no tempo máximo
      const incremento = (segundos() / (segundos() / intervalo));

      const intervalId = setInterval(() => {
          tempoDecorrido += incremento;
          setProgresso(tempoDecorrido / segundos() * 100);

          if (tempoDecorrido >= segundos()) {
              clearInterval(intervalId);
          }
      }, intervalo);

      return () => clearInterval(intervalId); // Limpeza no desmonte
  // eslint-disable-next-line react-hooks/exhaustive-deps
  };

return (
      <>
      <Template>
        <Header title={"EnderecoTotal"} />
          <Content>
          <InfoDataBase />
          <DialogAlert 
                    visibleDiag={visibleSurvey} 
                    visibleHide={() => setVisibleSurvey(false)}
                    header={<h4>Lista Survey</h4>}
                    colorType={'#13293d'}
                    ConfirmaButton={countListSurvey < 59999 ? true : false}
                    CancelaButton={countListSurvey < 59999 ? false : true}
                    buttonConfirmar={handleConfirm}
                    textCloseButton={'Cancelar'}
                    text={
                        <>
                        <p style={countListSurvey < 59999 ? 
                        {fontSize: '0.9rem', marginBottom: '0.2rem', fontStyle: 'italic'} :
                        {fontSize: '0.9rem', marginBottom: '0.2rem', fontStyle: 'italic', color:'red'}}>{ countListSurvey > 0 ? ((countListSurvey + 1) - 1) : 0 } / 60.000 Surveys</p>
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
                          placeholder="Cole os surveys aqui"
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
                    header={<h4>Atenção</h4>}
                    colorType={'#ff0000'}
                    ConfirmaButton={false}
                    textCloseButton={'Ok'}
                    text={
                        <>
                        <p>{mensagem}</p>
                        </>
                    }
                />
            <Filter>
              <div>
              <div style={{display: 'flex'}}>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"UF"} event={handleUf} lista={ufOptions.sort()} text={uf} />
              </div>
              { uf !== '' ? (
                <>
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                  <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Localidade"} event={handleConstrutora} lista={dropConstrutora.sort()} text={construtora} />
                </div>   
                </>
              ) : (
                <>
                  <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                    <DropBox width={"300px"} height={"25px"} valueDefaut={"- Selecionar -"} label={"Localidade"} lista={[""]} disable={true}/>
                  </div> 
                 </>
              )}

              { construtora !== '' ? (
                <> 
                { estacao !== '' ? (
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                  <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Sigla Estação"} event={handleSiglaEstacao} lista={dropSiglaEstacao.sort()} text={siglaEstacao} disable={true}/>
                </div>
                ):(
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                  <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Sigla Estação"} event={handleSiglaEstacao} lista={dropSiglaEstacao.sort()} text={siglaEstacao} />
                </div>
                )}
                {siglaEstacao !== '' ? (
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                  <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={dropEstacao.sort()} text={estacao} disable={true}/>
                </div>
                ):(
                  <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                  <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={dropEstacao.sort()} text={estacao} />
                 </div>
                )}
                </>
              ) : (
                <>
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                    <DropBox width={"150px"} height={"25px"} valueDefaut={"- Selecionar -"} label={"Sigla Estação"} lista={[""]} disable={true}/>
                  </div>
                  <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                    <DropBox width={"300px"} height={"25px"} valueDefaut={"- Selecionar -"} label={"Estação"} lista={[""]} disable={true}/>
                  </div>
                 </>
              )}
              <div style={{display:'flex', flexDirection: 'column'}}>
                <div style={{marginTop: '0.6rem', marginLeft:'1rem'}}>
                  <label>Survey</label>
                </div>
               <div style={{display: 'flex'}}> 
              { countListSurvey > 0 ? (
                <input style={{
                  marginLeft: '1rem',
                  paddingLeft: '0.2rem',
                  marginTop: '0.1rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  width: '150px',
                  height: '24px',
                  backgroundColor: 'white',
                  border: '1px solid',
                }} label={"Survey"} value={''} placeholder={countListSurvey > 0 ? `${countListSurvey} Surveys` : null} disabled/>
              ) : (
              <input style={{
                  marginLeft: '1rem',
                  marginTop: '0.1rem',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  width: '150px',
                  height: '24px',
                  textTransform: 'uppercase'
                }} label={"Survey"} maxLength="30" onChange={handleSurvey} value={surveyInput} />
              )
              }
              <ButtonUpload name="upload" onClick={handleImportSurvey} >Lista</ButtonUpload>
              </div> 
              </div>

              </div>

                
              <div style={{display: 'flex'}}>
              
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                    <DropBox width={"150px"} height={"25px"} valueDefaut={""} event={handleDispComercial} label={"Disponibilidade"} lista={dispComercialOptions} text={inputDispComercial} />
              </div>
              <TextInput label={"Cdo"} event={handleCdo} text={cdoInput} /> 
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Viabilidade"} event={handleViabilidade} lista={viabilidadeOptions.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))} text={viabilidade} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"200px"} height={"25px"} valueDefaut={""} label={"Grupo Operacional"} event={handleGrupoOperacional} lista={grupoOperacionalOptions.sort()} text={grupoOperacional} />
              </div>      
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"350px"} height={"25px"} valueDefaut={""} label={"Est. Controle"} event={handleControle} lista={controleOptions.sort()} text={estadoControle} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"200px"} height={"25px"} valueDefaut={""} label={"Est. Operacional"} event={handleOperacional} lista={operacionalOptions.sort()} text={estadoOperacional} />
              </div>
              <ButtonDefaut event={submit} text={"Filtrar"} />
              <ButtonDefaut event={limparFiltro} text={"Limpar"} />
              </div>
              </div>           
            </Filter>
            { enderecoTotal.resultado !== undefined ? (
              <>
              {carregarListsurvey ? (
                <>  
                { loading && progresso.toFixed(2) >= 100.00 ? (
                  <>
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
                              <p>Buscando {<b>{countListSurvey}</b>} Surveys no banco de dados.</p>
                              <p>Esse processo pode ser demorado de acordo com da quantidade de surveys.</p>
                          </div>
                            <div style={{position: 'relative'}}><ProgressBar value={progresso} max={100} />
                              <div style={{position: 'absolute', marginLeft: 'auto', marginRight:'auto', marginTop: '0.4rem',textAlign: 'center', left:'0', right:'0', top: '0', width:'500px', fontWeight:'600'}}><p>{progresso.toFixed(2) >= 100.00 ? 'Baixando...' : 'Carregando Surveys:  -- '+progresso.toFixed(2)+'% --'}</p></div>
                            </div>
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
                    <Spinner />
                    )
                }
                </>
                )}
                </> 
            ):( <Spinner /> )
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default EnderecoTotal;