import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, GlobalStyle, Template } from "../../GlobalStyle";
import { DropTesteOptico, GetControleCampo, ExportExcel } from "../../api/testeOptico";
import ButtonDefaut from '../../components/Button/ButtonDefaut';
import ButtonSearch from '../../components/Button/ButtonSeach';
import DataGridTable from '../../components/DataGrid/DataGridControleCampo';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import TextInput from '../../components/TextInput';
import { DateMask } from "../../components/TextInput/mask/index";
import DropBox from '../../components/dropbox';
import { Filter, SubMenu, ButtonExportarExcel, ButtonImport } from './style';
import InfoDataBase from '../../components/DbInfo';
import ProgressComponent from '../../components/progress/ProgressComponent';
import { UseAuth } from "../../contexts/auth";
import DialogAlert from "../../components/Dialog";


function ControleCampo() {
  GlobalStyle();

  /* estado lista teste óptico grid */
  const [testeOptico, setTesteOptico] = useState({});
  
  /* Estado filtro de seguimento */
  const [dropUf, setDropUf] = useState([]);
  const [uf, setUf] = useState("");
  const [regiao, setRegiao] = useState("");

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
  const [submitClicked, setSubmitClicked] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [carregarExport, setCarregarExport] = useState(false);
  const [visible, setVisible] = useState(false);
  const [exportSimple, setExportSimple] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const navigate = useNavigate();

  const controller = new AbortController();
  const signal = controller.signal;
  const { user, ValidarToken } = UseAuth();
  const totalRegistros = testeOptico?.paginacao?.total;
  const _dateInputRecebimento = dateInputRecebimento.replace(/\D/g, '-');

  const filtro = {
    pagina : currentPage,
    UF : regiao === "" ? uf : regiao,
    Celula : regiao === "" ? celula : null,
    Estacao : regiao === "" ? estacao : null,
    SiglaEstacao : regiao === "" ? siglaEstacao : null,
    CDO: regiao === "" ? cdoInput : "",
    Cabo: regiao === "" ? cabo : null,
    DataRecebimento : regiao === "" ? _dateInputRecebimento : null,
  };

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

  const FetchTesteOptico = useCallback(async () => {

    try {
      const response = await GetControleCampo(filtro, {signal});
      if(response.status == 200) {
        setTesteOptico(response.data);
      }

    } catch (error) {
      console.log(`Houve um error : ${error}`)
      setLoading(true);
      
    } finally {
      setLoading(true)
      initialLoad ? FetchDropFilter() : null;
      setInitialLoad(false);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitClicked]);

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
          setExportSimple(false)
          setRegiao("");

        });
      }

    } catch (error) {
      setMensagem(`Erro ao carregar : ${error}`);
      setVisible(true);
      
    } 

  }

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
    if (initialLoad) {
      // Realiza a pesquisa inicial apenas uma vez ao carregar a página
      FetchTesteOptico();

    } else if (submitClicked) {
      // Realiza pesquisas apenas quando o botão de pesquisa é clicado
      FetchTesteOptico();
      setLoading(false);
      setSubmitClicked(false);

    } else {

      return () => { controller.abort() };
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FetchTesteOptico]);

  const columns = [
    { key: 'chave', name: 'CHAVE', width: '5%'},
    { key: 'uf', name: 'UF', width: '5%'},
    { key: 'siglaEstacao', name: 'SIGLA', width: '5%' },
    { key: 'tipoObra', name: 'TIPO OBRA', width: '5%'},
    { key: 'cabo', name: 'CABO',  width: '2%' },
    { key: 'celula', name: 'CELULA', width: '2%' },
    { key: 'cdo', name: 'CDO',  width: '5%' },
    { key: 'capacidade', name: 'CAPACIDADE',  width: '2%' },
    { key: 'totalUMs', name: 'UMS',  width: '2%' },
    { key: 'construtora', name: 'CONSTRUTORA', width: '5%'},
    { key: 'estadoProjeto', name: 'ESTADO PROJETO', width: '8%'},
    { key: 'estadoControle', name: 'ESTADO CONTROLE', width: '8%'},
    { key: '-', name: 'ACEITACAO DATA', width: '5%'},
    { key: 'baseAcumulada', name: 'BASE ACUM.', width: '5%'},
    { key: 'dataRecebimento', name: 'DATA RECEBIMENTO',  width: '5%' }, 
  ];

  const handleUf = (event) => {
    const input = event.target.value;
    setUf(input);
    setSiglaEstacao("");
    setEstacao("");
 
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
  
  const handleExportExcelRegiao = () => {
    setVisible(true);
  }

  const handleExportSimples = () => {
    setExportSimple(true)
    setVisible(true);
    FetchExportExcel();
  }

  const handleRegiao = (event) => {
    const input = event.target.value;
    setRegiao(input);
  };

  const handleExport = () => {
    setCarregarExport(true);
    FetchExportExcel();
  }

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
    setCurrentPage(1);
    setSubmitClicked(true);

  };

  const fetchLoading = () => {
    setLoading(false);
  }

  return (
      <>
      <Template>
        <Header title={"Controle de Campo"} />
          <Content>
          <InfoDataBase />
            <SubMenu>
             </SubMenu>
             <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => {
                      setVisible(false);
                      setRegiao("");
                    }}
                    header={<h5>Exportação: Controle de Campo</h5>}
                    colorType={carregarExport ? null : '#13293d'}
                    ConfirmaButton={false}
                    CancelaButton={carregarExport || exportSimple ? true : false}
                    textCloseButton={'Fechar'}
                    text={
                        <>
                         { !exportSimple ? (
                          <>
                            { !carregarExport ? (
                              <div style={{display: 'flex', height:'30px'}}>
                              <label style={{paddingRight: '0.5rem'}}>Região:</label>
                              <select onChange={handleRegiao} style={{fontSize: '0.9rem', fontWeight: '600', width: '200px'}}>
                                <option selected="selected">-Selecione-</option>
                                <option value="Nordeste">Nordeste</option>
                                <option value="Centro-Oeste">Centro-Oeste</option>
                                <option value="Sudeste - (RJ)">{"Sudeste - (RJ)"}</option>
                                <option value="Sudeste - (SP)">{"Sudeste - (SP)"}</option>
                                <option value="Sudeste - (MG-ES)">{"Sudeste - (MG-ES))"}</option>
                                <option value="Sul">Sul</option>
                              </select>

                              <ButtonImport onClick={handleExport}>Exportar</ButtonImport>
                              </div>
                            ):(null)}

                            { carregarExport ? (
                              <>
                              <div>
                                <div style={{border:'1px solid', borderRadius:'0.3rem', fontSize:'0.8rem'}}>
                                  <div style={{padding: '0.5rem'}}>
                                    <p>Exportando registros.</p>
                                    <p>Esse processo pode demora de acordo com da quantidade de registros.</p>
                                </div>
                                    <ProgressComponent exportar={true}/>
                                </div>
                            </div>
                              </>
                            ):(
                            <p>{mensagem}</p>
                            )}
                            </>
                          ):(
                          <>
                            <div>
                                <div style={{border:'1px solid', borderRadius:'0.3rem', fontSize:'0.8rem'}}>
                                  <div style={{padding: '0.5rem'}}>
                                    <p>Exportando registros.</p>
                                    <p>Esse processo pode demora de acordo com da quantidade de registros.</p>
                                </div>
                                    <ProgressComponent exportar={true}/>
                                </div>
                            </div>
                          </>
                          )
                          }
                        </>
                    } 
                />
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
              { loading && dropLoading ? (
                <>
                <ButtonSearch event={submit} />
                <ButtonDefaut event={limparFiltro} text={"Limpar"} />
                 </>
              ):(null)
              }
              </div>
              <div style={{position:'absolute', right:0, top:0, marginTop:'0.3rem', marginRight:'0.4rem'}}>
              { loading && !dropLoading ? (
                <>
                <ButtonExportarExcel style={{width: "100px"}} onClick={handleExportSimples}>Exportar</ButtonExportarExcel>
                <ButtonExportarExcel style={{width: "150px", marginLeft: "0.3rem"}} onClick={handleExportExcelRegiao}>Exportar Região</ButtonExportarExcel>
                </>
              ):(null)}
              </div>         
              </div> 
            </Filter>
           {loading && dropLoading ? (  
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
            ) : ( <ProgressComponent /> )
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default ControleCampo;