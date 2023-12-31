import React, { useEffect, useState, useCallback } from 'react';
import { Content, GlobalStyle, Template } from "../../GlobalStyle";
import { getEnderecoTotal } from "../../api/enterecoTotais";
import { ufOptions, dispComercialOptions, grupoOperacionalOptions,localidadeOptions, estacaoOptions, viabilidadeOptions, controleOptions, operacionalOptions} from '../../components/dropbox/options';
import ButtonDefaut from '../../components/Button/ButtonDefaut';
import ButtonSearch from '../../components/Button/ButtonSeach';
import DataGridTable from '../../components/DataGrid';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import TextInput from '../../components/TextInput';
import DropBox from '../../components/dropbox';
import { Filter } from './styles';
import DialogAlert from "../../components/Dialog";
import InfoDataBase from '../../components/DbInfo';

function EnderecoTotal() {
  GlobalStyle();

  const [enderecoTotal, setEnderecoTotal] = useState({});
  const [dropConstrutora, setDropConstrutora] = useState([]);
  const [construtora, setConstrutora] = useState("");
  const [dropSiglaEstacao, setDropSiglaEstacao] = useState([]);
  const [siglaEstacao, setSiglaEstacao] = useState("");
  const [dropEstacao, setDropEstacao] = useState([]);
  const [estacao, setEstacao] = useState("");
  const [uf, setUf] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cdoInput, setCdoInput] = useState('');
  const [loading, setLoading] = useState();
  const [visible, setVisible] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [viabilidade, setViabilidade] = useState("");
  const [survey, setSurvey] = useState("");
  const [grupoOperacional, setGrupoOperacional] = useState("");
  const [estadoOperacional, setEstadoOperacional] = useState("");
  const [estadoControle, setEstadoControle] = useState("");
  const [dispComercial, setDispComercial] = useState("");
  const [inputDispComercial, setInputDispComercial] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const controller = new AbortController();
  const signal = controller.signal;

  const fetchEnderecoTotal = useCallback(async () => {

    try {

      const filtro = {
        pagina : currentPage,
        UF : uf,
        Localidade : construtora,
        SiglaEstacao : siglaEstacao,
        Estacao : estacao,
        CDO: cdoInput,
        Cod_Viabilidade : viabilidade,
        CodSurvey: survey,
        Id_Disponibilidade: dispComercial,
        GrupoOperacional : grupoOperacional,
        EstadoOperacional: estadoOperacional,
        EstadoControle: estadoControle,
      };

      const response = await getEnderecoTotal(filtro, {signal});

      if(response.status == 200) {
        setEnderecoTotal(response.data);
      }

    } catch (error) {
      setMensagem(`Erro ao carregar : ${error}`)
      setLoading(true);
      
    } finally {
      setLoading(true)
      setInitialLoad(false);
    }

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
    const input = event.target.value;
    setSurvey(input);
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

  const submit = () => {
    setSubmitClicked(true);
    setCurrentPage(1);
  };

  const limparFiltro = () => {
    setUf("");
    setConstrutora("");
    setEstacao("");
    setSiglaEstacao("");
    setSurvey("");
    setCdoInput("");
    setViabilidade("");
    setGrupoOperacional("");
    setEstadoControle("");
    setEstadoOperacional("");
    setInputDispComercial("");
    setDispComercial(null);
    setCurrentPage(1);
    setSubmitClicked(true);

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

              <TextInput label={"Survey"} event={handleSurvey} text={survey} />
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
              
              <ButtonSearch event={submit} />
              <ButtonDefaut event={limparFiltro} text={"Limpar"} />
              </div>
              </div>           
            </Filter>
            { enderecoTotal.resultado !== undefined ? (
              loading ? (  
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
              ):(<Spinner />)
            ) : ( <Spinner /> )
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default EnderecoTotal;