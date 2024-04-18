import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, GlobalStyle, Template } from "../../GlobalStyle";
import { DropTesteOptico, GetTesteOptico } from "../../api/testeOptico";
import ButtonDefaut from '../../components/Button/ButtonDefaut';
import ButtonSearch from '../../components/Button/ButtonSeach';
import DataGridTable from '../../components/DataGrid/DataGridTesteOptico';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import TextInput from '../../components/TextInput';
import { DateMask } from "../../components/TextInput/mask/index";
import DropBox from '../../components/dropbox';
import { Filter, ButtonImport, SubMenu } from './styles';
import InfoDataBase from '../../components/DbInfo';
import ProgressComponent from '../../components/progress/ProgressComponent';
import { UseAuth } from "../../contexts/auth";


function TesteOptico() {
  GlobalStyle();

  /* estado lista teste óptico grid */
  const [testeOptico, setTesteOptico] = useState({});
  
  /* Estado filtro de seguimento */
  const [dropUf, setDropUf] = useState([]);
  const [uf, setUf] = useState("");

  const [listSiglaEstacao, setListSiglaEstacao] = useState([]);
  const [dropSiglaEstacao, setDropSiglaEstacao] = useState([""]);
  const [siglaEstacao, setSiglaEstacao] = useState("");

  const [listEstacao, setListEstacao] = useState([]);
  const [dropEstacao, setDropEstacao] = useState([""]);
  const [estacao, setEstacao] = useState("");
  
  const [dropCabo, setDropCabo] = useState([]);
  const [cabo, setCabo] = useState("");

  const [dropCelula, setDropCelula] = useState([]);
  const [celula, setCelula] = useState("");

  /*------------------------------------*/ 

  const [currentPage, setCurrentPage] = useState(1);
  const [cdoInput, setCdoInput] = useState('');
  const [loading, setLoading] = useState();
  const [dropLoading, setDropLoading] = useState();
  const [dateInputRecebimento, setDateInputRecebimento] = useState('');
  const [dateInputTeste, setDateInputTeste] = useState('');
  const [dateInputConstrucao, setDateInputConstrucao] = useState('');
  const [submitClicked, setSubmitClicked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const navigate = useNavigate();

  const controller = new AbortController();
  const signal = controller.signal;
  const { user, ValidarToken } = UseAuth();
  const userPrivate = user?.tipo ?? 1;

  async function FetchDropFilter () {
    
    try {
      const dropList = await DropTesteOptico();

      if (dropList.status == 200) {
        const _dropListUf = dropList.data
            .map((value) => value.uf)
            .filter((value, index, self) => {
                return self.indexOf(value) === index;
        });
        setDropUf(_dropListUf);

        const _dropListSiglaEstacao = dropList.data
            .map((value, index) => {
              if(value.siglaEstacao != null){ 
                return `${value.uf},${value.siglaEstacao}`.split(',')
              }
            })
            .filter((value) => value !== undefined);
            setListSiglaEstacao(_dropListSiglaEstacao);    

        const _dropListEstacao = dropList.data
            .map((value, index) => {
              if(value.siglaEstacao != null){ 
                return `${value.uf},${value.estacao}`.split(',')
              }
            })
            .filter((value) => value !== undefined);
            setListEstacao(_dropListEstacao);
           
        const _dropListCabo = dropList.data
            .map((value) => value.cabo)
            .filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            setDropCabo(_dropListCabo);
        
        const _dropListCelula = dropList.data
            .map((value) => value.celula)
            .filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            setDropCelula(_dropListCelula);  
  
    }
      
    } catch (error) {
      console.log(`Houve um error : ${error}`)
      setDropLoading(true);
      
    } finally {
      setDropLoading(true);

    }
  }

  const fetchTesteOptico = useCallback(async () => {

    try {
      const _dateInputRecebimento = dateInputRecebimento.replace(/\D/g, '-');
      const _dateInputTeste = dateInputTeste.replace(/\D/g, '-');
      const _dateInputConstrucao = dateInputConstrucao.replace(/\D/g, '-');

      const filtro = {
        pagina : currentPage,
        UF : uf,
        Celula : celula,
        Estacao : estacao,
        SiglaEstacao : siglaEstacao,
        CDO: cdoInput,
        Cabo: cabo,
        DataTeste : _dateInputTeste,
        DataRecebimento : _dateInputRecebimento,
        DataConstrucao : _dateInputConstrucao
      };

      const response = await GetTesteOptico(filtro, {signal});

      if(response.status == 200) {
        setTesteOptico(response.data);
      }

    } catch (error) {
      console.log(`Houve um error : ${error}`)
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
    if(user && Object.keys(user).length !== 0){
    ValidarToken(user);
    }
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user])

  useEffect(() => {
    FetchDropFilter()
  
  },[dropLoading])

  useEffect(() => {    
    if (initialLoad) {
      // Realiza a pesquisa inicial apenas uma vez ao carregar a página
      fetchTesteOptico();

    } else if (submitClicked) {
      // Realiza pesquisas apenas quando o botão de pesquisa é clicado
      fetchTesteOptico();
      setLoading(false);
      setSubmitClicked(false);

    } else {

      return () => { controller.abort() };
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTesteOptico]);

  const columns = [
    { key: 'siglaEstacao', name: 'SIGLA' },
    { key: 'uf', name: 'UF' },
    { key: 'estacao', name: 'ESTACÃO' },
    { key: 'cabo', name: 'CABO' },
    { key: 'celula', name: 'CELULA' },
    { key: 'cdo', name: 'CDO' },
    { key: 'construtora', name: 'CONSTRUTORA' },
    { key: 'dataRecebimento', name: 'DATA RECEBIMENTO' },
    { key: 'dataConstrucao', name: 'DATA CONSTRUÇÃO' },
    { key: 'dataTeste', name: 'DATA TESTE' },    
    { key: 'totalUMs', name: 'UMS' },
    { key: 'tecnico', name: 'TECNICO' },
  ];

  const handleUf = (event) => {
    const input = event.target.value;
    setUf(input);
 
    const _siglaEstacaoFilter = listSiglaEstacao.filter(([uf]) => { return uf === input})
    const _subSiglaEstacoes = _siglaEstacaoFilter
      .map(subarray => subarray[1])
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    setDropSiglaEstacao(_subSiglaEstacoes);

    const _estacaoFilter = listEstacao.filter(([uf]) => { return uf === input})
    const _subEstacoes = _estacaoFilter
      .map(subarray => subarray[1])
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    setDropEstacao(_subEstacoes);
    
  };

  const handleSiglaEstacao = (event) => {
    const input = event.target.value;
    setSiglaEstacao(input);

  };
  
  const handleEstacao = (event) => {
    const input = event.target.value;
    setEstacao(input);
  };

  const handleCelula = (event) => {
    const input = event.target.value;
    setCelula(input);
  };

  const handleCabo = (event) => {
    const input = event.target.value;
    setCabo(input);
  };

  const handleCdo = (event) => {
    const input = event.target.value;
    setCdoInput(input);
  };

  const handleDateRecebimento = (event) => {
    const formattedDate = DateMask(event);
    setDateInputRecebimento(formattedDate);
  };

  const handleDateTeste = (event) => {
    const formattedDate = DateMask(event);
    setDateInputTeste(formattedDate);
  };

  const handleDateConstrucao = (event) => {
    const formattedDate = DateMask(event);
    setDateInputConstrucao(formattedDate);
  };

  const handleImportar = () => {
    navigate('/TesteOptico/Importar');
  };

  const submit = () => {
    setSubmitClicked(true);
    setCurrentPage(1);
  };

  const limparFiltro = () => {
    setUf("");
    setCelula("");
    setEstacao("");
    setSiglaEstacao("");
    setCdoInput("");
    setDateInputRecebimento("");
    setDateInputConstrucao("");
    setDateInputTeste("");
    setCurrentPage(1);
    setSubmitClicked(true);

  };

  const fetchLoading = () => {
    setLoading(false);
  }

  return (
      <>
      <Template>
        <Header title={"Teste Óptico"} />
          <Content>
          <InfoDataBase />
            {userPrivate !== 1 || userPrivate === 3 ?
            <SubMenu>
              <ButtonImport onClick={handleImportar} >Controler CDOs</ButtonImport>
             </SubMenu>
             : null
            }
            <Filter>
              <div>
              <div style={{display: 'flex'}}>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"UF"} event={handleUf} lista={dropUf.sort()} text={uf} />
              </div>
              { uf !== '' ? (
              <>
              { estacao !== '' ? (
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Sigla Estação"} event={handleSiglaEstacao} lista={[""]} text={siglaEstacao} disable={true}/>
              </div>
              ) : (
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Sigla Estação"} event={handleSiglaEstacao} lista={dropSiglaEstacao !== '' || dropSiglaEstacao[0] !== 'null' ? dropSiglaEstacao.sort() : [""]} text={siglaEstacao} />
                </div>
              )}
               { siglaEstacao !== '' ? (
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={[""]} text={estacao} disable={true}/>
              </div>
               ):(
                <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={dropEstacao !== '' && dropEstacao[0] !== 'null' ? dropEstacao.sort() : [""]} text={estacao}/>
              </div>
               )}
              </>
              ) : (
              <>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Sigla Estação"} event={handleSiglaEstacao} lista={dropSiglaEstacao != '' ? dropSiglaEstacao.sort() : [""]} text={siglaEstacao} disable={true}/>
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={dropEstacao != '' ? dropEstacao.sort() : [""]} text={estacao} disable={true}/>
               </div>
               </> 
              )}
              </div>
              <div style={{display: 'flex'}}>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Cabo"} event={handleCabo} lista={dropCabo.sort()} text={cabo} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Celula"} event={handleCelula} lista={dropCelula.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))} text={celula} />
              </div>    
              <TextInput label={"CDO"} event={handleCdo} text={cdoInput} />
              <TextInput 
                label={"Data Recebimento"} 
                event={handleDateRecebimento} 
                text={dateInputRecebimento}
                placeholder={"__/__/____"} 
              />
              <TextInput 
                label={"Data Construção"}
                event={handleDateConstrucao} 
                text={dateInputConstrucao}
                placeholder={"__/__/____"} 
              />          
              <TextInput 
                label={"Data Teste"}
                event={handleDateTeste} 
                text={dateInputTeste}
                placeholder={"__/__/____"} 
              />
              { loading ? (
                <>
                <ButtonSearch event={submit} />
                <ButtonDefaut event={limparFiltro} text={"Limpar"} />
                 </>
              ):(null)
              }
              </div>
              </div>          
            </Filter>
            { testeOptico.resultado !== undefined ? (
              loading ? (  
            <DataGridTable 
              columns={columns} 
              rows={testeOptico.resultado} 
              paginacao={testeOptico.paginacao}
              pagina={currentPage}
              sel={testeOptico.sel}
              left={prevPage}
              right={nextPage}
              atualizar={fetchLoading} 
            />
              ):( <ProgressComponent />)
            ) : (  <ProgressComponent /> )
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default TesteOptico;