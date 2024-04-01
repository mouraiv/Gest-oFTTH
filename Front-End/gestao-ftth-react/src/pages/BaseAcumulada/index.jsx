import React, { useEffect, useState, useCallback } from 'react';
import { Content, GlobalStyle, Template } from "../../GlobalStyle";
import { GetBaseAcumulada } from "../../api/enterecoTotais";
import ButtonDefaut from '../../components/Button/ButtonDefaut';
import ButtonSearch from '../../components/Button/ButtonSeach';
import DataGridTable from '../../components/DataGrid';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import TextInput from '../../components/TextInput';
import DropBox from '../../components/dropbox';
import { Filter } from './styles';
import InfoDataBase from '../../components/DbInfo';
import ProgressComponent from '../../components/progress/ProgressComponent';

function BaseAcumulada() {
  GlobalStyle();

  const [enderecoTotal, setEnderecoTotal] = useState({});
  const [dropEstacao, setDropEstacao] = useState([]);
  const [estacao, setEstacao] = useState("");
  const [dropSiglaEstacao, setDropSiglaEstacao] = useState([]);
  const [siglaEstacao, setSiglaEstacao] = useState("");
  const [uf, setUf] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cdoInput, setCdoInput] = useState('');
  const [loading, setLoading] = useState();
  const [viabilidade, setViabilidade] = useState("");
  const [survey, setSurvey] = useState("");
  const [grupoOperacional, setGrupoOperacional] = useState("");
  const [estadoOperacional, setEstadoOperacional] = useState("");
  const [estadoControle, setEstadoControle] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const controller = new AbortController();
  const signal = controller.signal;

  const fetchEnderecoTotal = useCallback(async () => {

    try {

      const filtro = {
        pagina : currentPage,
        UF : uf,
        SiglaEstacao : siglaEstacao,
        Estacao : estacao,
        CDO: cdoInput,
        Cod_Viabilidade : viabilidade,
        Cod_Survey: survey,
        GrupoOperacional : grupoOperacional,
        EstadoOperacional: estadoOperacional,
        EstadoControle: estadoControle,
      };

      const response = await GetBaseAcumulada(filtro, {signal});

      if(response.status == 200) {
        setEnderecoTotal(response.data);
      }

    } catch (error) {
      console.log(`Erro ao carregar : ${error}`)
      setLoading(true);
      
    } finally {
      setLoading(true)
      setInitialLoad(false);
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
    { key: 'anoMes', name: 'AnoMes' },
    { key: 'localidade', name: 'LOCALIDADE' },
    { key: 'celula', name: 'CELULA' },
    { key: 'siglaEstacao', name: 'SIGLA' },
    { key: 'materialRede.nomeAbastecedora_Mt', name: 'ESTAÇÃO' },
    { key: 'nomeCdo', name: 'CDO' },
    { key: 'cod_Viabilidade', name: 'COD. VIAB' },
    { key: 'tipoViabilidade', name: 'TIPO VIAB' },
    { key: 'cod_Survey', name: 'SURVEY' },
    { key: 'quantidadeUMS', name: 'UMS' },
    { key: 'materialRede.grupoOperacional_Mt', name: 'GRUPO OPERACIONAL' },
    { key: 'materialRede.estadoControle_Mt', name: 'EST. CONTROLE' },
    { key: 'materialRede.estadoOperacional_Mt', name: 'EST. OPERACIONAL' },
  ];

  const handleUf = (event) => {
    const input = event.target.value;
    setUf(input);

    const filteredEstacoes = estacaoOptions.filter(([ufOption]) => ufOption === input);
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

  const submit = () => {
    setSubmitClicked(true);
    setCurrentPage(1);
  };

  const limparFiltro = () => {
    setUf("");
    setEstacao("");
    setSiglaEstacao("");
    setSurvey("");
    setCdoInput("");
    setViabilidade("");
    setGrupoOperacional("");
    setEstadoControle("");
    setEstadoOperacional("");
    setCurrentPage(1);
    setSubmitClicked(true);

  };

  const fetchLoading = () => {
    setLoading(false);
  }

  return (
      <>
      <Template>
        <Header title={"Base Acumulada"} />
          <Content>
          <InfoDataBase />
            <Filter>
              <div>
              <div style={{display: 'flex'}}>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"UF"} event={handleUf} lista={ufOptions.sort()} text={uf} />
              </div>
              { uf !== '' ? (
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
              </div>
                
              <div style={{display: 'flex'}}>
              <TextInput label={"Survey"} event={handleSurvey} text={survey} />
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
              ):(<ProgressComponent />)
            ) : ( <ProgressComponent /> )
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default BaseAcumulada;