import React, { useEffect, useState, useCallback } from 'react';
import { Content, GlobalStyle, Template } from "../../GlobalStyle";
import { GetGanhoSurvey } from "../../api/enterecoTotais";
import { ufOptions, localidadeOptions, estacaoOptions, statusGanhoOptions, disponibilidadeOptions} from '../../components/dropbox/options';
import ButtonDefaut from '../../components/Button/ButtonDefaut';
import ButtonSearch from '../../components/Button/ButtonSeach';
import DataGridTable from '../../components/DataGrid';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import TextInput from '../../components/TextInput';
import DropBox from '../../components/dropbox';
import { Filter, Painel } from './styles';
import InfoDataBase from '../../components/DbInfo';

function GanhoSurvey() {
  GlobalStyle();

  const [enderecoTotal, setEnderecoTotal] = useState({});
  const [dropConstrutora, setDropConstrutora] = useState([]);
  const [construtora, setConstrutora] = useState("");
  const [dropEstacao, setDropEstacao] = useState([]);
  const [estacao, setEstacao] = useState("");
  const [dropSiglaEstacao, setDropSiglaEstacao] = useState([]);
  const [siglaEstacao, setSiglaEstacao] = useState("");
  const [uf, setUf] = useState("");
  const [inputStatusGanho, setInputStatusGanho] = useState("");
  const [statusGanho, setStatusGanho] = useState("");
  const [inputStatusDisponibilidade, setInputStatusDisponibilidade] = useState("");
  const [statusDisponibilidade, setStatusDisponibilidade] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [survey, setSurvey] = useState("");

  const { painel } = enderecoTotal;

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
          CodSurvey: survey,
          id_StatusGanho: statusGanho,
          id_Disponibilidade: statusDisponibilidade
        };

        const response = await GetGanhoSurvey(filtro, {signal});

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
    setSubmitClicked(true)
  };

  // Função para retroceder para a página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setSubmitClicked(true)
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
    { key: 'statusGanho', name: 'STATUS' },
    { key: 'disponibilidade', name: 'DISPONIBILIDADE' },
    { key: 'localidade', name: 'LOCALIDADE' },
    { key: 'celula', name: 'CELULA' },
    { key: 'siglaEstacao', name: 'SIGLA' },
    { key: 'nomeCdo', name: 'CDO' },
    { key: 'cod_Survey', name: 'SURVEY' },
    { key: 'quantidadeUMS_ganhoDia', name: 'GANHO' },
    { key: 'cod_Viabilidade', name: 'COD. VIAB' },
    { key: 'tipoViabilidade', name: 'TIPO VIAB' },
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

  const handleEstacao = (event) => {
    const input = event.target.value;
    setEstacao(input);
  };

  const handleStatusGanho = (event) => {
    const input = event.target.value;
    setInputStatusGanho(input);

    if(input == 'COM GANHO'){
      setStatusGanho(1);

    }
    if(input == 'SEM GANHO'){
      setStatusGanho(2);

    }
    if(input == ''){
      setStatusGanho(null);

    }
    
  };

  const handleStatusDisponibilidade = (event) => {
    const input = event.target.value;
    setInputStatusDisponibilidade(input);

    if(input == 'ATIVA'){
      setStatusDisponibilidade(1);

    }
    if(input == 'INATIVA'){
      setStatusDisponibilidade(2);

    }
    if(input == 'F. DA CÉLULA'){
      setStatusDisponibilidade(3);

    }
    if(input == ''){
      setStatusDisponibilidade(null);

    }

  };

  const handleSurvey = (event) => {
    const input = event.target.value;
    setSurvey(input);
  };

  const submit = () => {
    setSubmitClicked(true);
    setCurrentPage(1);
  };

  const limparFiltro = () => {
    setUf("");
    setStatusGanho("");
    setInputStatusGanho("");
    setStatusDisponibilidade("");
    setInputStatusDisponibilidade("");
    setConstrutora("");
    setEstacao("");
    setSiglaEstacao("");
    setSurvey("");
    setCurrentPage(1);
    setSubmitClicked(true);
  };

  const fetchLoading = () => {
     setLoading(false);
  }

  function formatarNumero(numero) {
    // Converte o número para uma string
    const numeroString = numero.toString();
  
    // Divide a string em grupos de 3 caracteres
    const grupos = [];
    for (let i = numeroString.length; i > 0; i -= 3) {
      grupos.unshift(numeroString.substring(Math.max(0, i - 3), i));
    }
  
    // Junta os grupos usando o ponto como separador e retorna
    return grupos.join('.');
  }
  

  return (
      <>
      <Template>
        <Header title={"Ganho Survey"} />
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
              </div>
                
              <div style={{display: 'flex'}}>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Status Ganho"} event={handleStatusGanho} lista={statusGanhoOptions.sort()} text={inputStatusGanho} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Disponibilidade"} event={handleStatusDisponibilidade} lista={disponibilidadeOptions.sort()} text={inputStatusDisponibilidade} />
              </div>
              <TextInput label={"Survey"} height={"25px"} event={handleSurvey} text={survey} />
              
              
              <ButtonSearch event={submit} />
              <ButtonDefaut event={limparFiltro} text={"Limpar"} />
              </div>
              </div>           
            </Filter>
            { enderecoTotal.resultado !== undefined ? (
              loading ? (  
            <>
            <Painel>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO</p>
                    <p className='result'>{formatarNumero(painel?.comGanhoTotal)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO ATIVO</p>
                    <p className='result'>{formatarNumero(painel?.comGanhoAtivo)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO INATIVO</p>
                    <p className='result'>{formatarNumero(painel?.comGanhoInativo)}</p>
                </div>
                <div className='viewComGanho'>
                    <p className='lab'>COM GANHO F. CÉLULA</p>
                    <p className='result'>{formatarNumero(painel?.comGanhoForaCelula)}</p>
                </div >
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO</p>
                    <p className='result'>{formatarNumero(painel?.semGanhoTotal)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO ATIVO</p>
                    <p className='result'>{formatarNumero(painel?.semGanhoAtivo)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO INATIVO</p>
                    <p className='result'>{formatarNumero(painel?.semGanhoInativo)}</p>
                </div>
                <div className='viewSemGanho'>
                    <p className='lab'>SEM GANHO F. CÉLULA</p>
                    <p className='result'>{formatarNumero(painel?.semGanhoForaCelula)}</p>
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
              ):(<Spinner />)
            ) : ( <Spinner /> )
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default GanhoSurvey;