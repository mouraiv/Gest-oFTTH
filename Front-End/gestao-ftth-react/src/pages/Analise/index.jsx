import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, ButtonImagem, FooterButton, ButtonCdoia, TableGrid} from "./styles";
import { DetalheTesteOptico} from "../../api/testeOptico";
import { updateAnalise, createAnalise } from "../../api/analise";
import { getEnderecoTotalAny } from "../../api/enterecoTotais"
import { Content, GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../GlobalStyle";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import { useAuth } from "../../contexts/auth";
import DialogAlert from "../../components/Dialog";

function Vizualizar(){
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [uf, setUf] = useState();
    const [dataAtual] = useState(new Date());
    const [estacao, setEstacao] = useState();
    const [cdo, setCdo] = useState();
    const [testeOptico, setTesteOptico] = useState({});
    const [enderecoTotal, setEnderecoTotal] = useState({});
    const [visible, setVisible] = useState(false);
    const [visualizarAnalise, setVisualizarAnalise] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [dialogAviso, setDialogAviso] = useState();
    const [dialogEdit, setDialogEdit] = useState(false);
    const [statusAnalise, setStatusAnalise] = useState("");
    const [event, setEvent] = useState({});
    const [cdoia, setCdoia] = useState({});
    const [inputValue, setInputValue] = useState({analiseObservacao:"", status: ""});

    const navigate = useNavigate();
    const { user } = useAuth();
    const{ name } = event.target ?? "";

    async function fetchValidar() {
        try {
            const _dataAtual = dataAtual.toISOString();
            
            const analiseData = {
                ...testeOptico.analises[0]
            };

            const _analiseObservacao = analiseData.analiseObservacao != null ? analiseData.analiseObservacao.replace(';.','') : "";

            if(dialogEdit) {
              const observacao = _analiseObservacao.split(';');
              const index = (observacao.length - 1);
              observacao[index] = inputValue.analiseObservacao;
              const _observacao = observacao.join(';');

              analiseData.analiseObservacao = ` ${_observacao}`;

              const analiseResponse = await updateAnalise(analiseData);
    
              if (analiseResponse.status === 200) {
                  console.log("Validado com sucesso")
              };
            
            } else {
              analiseData.analista = user.nome.toUpperCase();
              analiseData.status = statusAnalise == 'APROVADO' ? 'REPROVADO' : 'APROVADO';
              analiseData.dataAnalise = _dataAtual;

              if(_analiseObservacao != "") {      
                       
                if (inputValue.analiseObservacao != "") {analiseData.analiseObservacao = `${_analiseObservacao}; ${inputValue.analiseObservacao}`};

                const analiseResponse = await updateAnalise(analiseData);
    
                if (analiseResponse.status === 200) {
                    console.log("Validado com sucesso")
                };
                  
              }else{
                if (inputValue.analiseObservacao != "") {analiseData.analiseObservacao = `${inputValue.analiseObservacao}`};

                const analiseResponse = await updateAnalise(analiseData);
    
                if (analiseResponse.status === 200) {
                    console.log("Validado com sucesso")
                };

              } 

            }
                        
            
        } catch (error) {
            setDialogAviso(true);
            setMensagem(`Erro ao validar`);
            setVisible(true);
            setLoading(true);

        } finally {
            setLoading(true);
        }
    }

    async function fetchInsertValidar(status) {
      try {
          const _dataAtual = dataAtual.toISOString();

          const analiseInsert = {
            CHAVE: '',
            status: status,
            analista: user.nome.toUpperCase(),
            dataAnalise: _dataAtual,
            analiseObservacao: inputValue.analiseObservacao,
            id_TesteOptico: id,
          }

          const analiseResponse = await createAnalise(analiseInsert);
  
          if (analiseResponse.status === 200) {
            console.log("Validado com sucesso")
          }           
          
      } catch (error) {
          setDialogAviso(true);
          setMensagem(`Erro ao validar`);
          setVisible(true);
          setLoading(true);

      } finally {
          setLoading(true);
      }
    }

    async function fecthDetalheTesteOptico(){
        try {
            const detalheTesteOptico = await DetalheTesteOptico(id);

            if(detalheTesteOptico.status == 200) {
                setTesteOptico(detalheTesteOptico.data);
                setCdo(detalheTesteOptico.data.cdo);
                setEstacao(detalheTesteOptico.data.estacao);
                setUf(detalheTesteOptico.data.uf);
                setCdoia(detalheTesteOptico.data.analises[0].analiseCDOIAs ?? {})

                let status = detalheTesteOptico.data.analises.length;

                if(status > 0) {
                setStatusAnalise(detalheTesteOptico.data.analises[0].status);

                let obs = detalheTesteOptico.data.analises[0].analiseObservacao.split(';');
                let _obs = obs[obs.length - 1];

                setInputValue(
                    {
                      analiseObservacao: `${_obs}`, 
                      status: `${obs.length > 1 ? "RE-TESTE" : "TESTADO"}`
                    }
                  );

                const detalheEnderecoTotal = await getEnderecoTotalAny(
                    detalheTesteOptico.data.id_EnderecoTotal
                );

                if(detalheEnderecoTotal.status == 200) {
                    setEnderecoTotal(detalheEnderecoTotal.data);
                }
              }
            }

        } catch (error) {
            setLoading(true);
            
        } finally {
            setLoading(true);
        }
    }

    useEffect(() => {
        fecthDetalheTesteOptico();

    },[loading, statusAnalise])

    const handleVoltar = () => {
        navigate(-1); 
    };

    const handleImagens = () => {
        navigate(`/TesteOptico/Imagem/${uf}/${estacao}/${cdo}`); 
    };

    const Observacao = () => {
      if (testeOptico.analises && testeOptico.analises.length > 0) {
        const observacoes = testeOptico.analises.map(analise => analise.analiseObservacao ?? "");
        const _observacoes = observacoes.map(obs => obs.replace(';.','').split(';'));
        return _observacoes;
      }
      return [];
    };
    
    
    const Adicionar = (e) => {
      setInputValue({analiseObservacao:"", status: ""});
      setEvent(e);
      setDialogEdit(false);
      setDialogAviso(false);
      setVisible(true);
    };

    const AnaliseDetalhe = () => {
      setVisualizarAnalise(true);
    };

    const handleInputChange = (e) => {
      const { value } = e.target;
      setInputValue({analiseObservacao: value});
    };

    const handleEdit = () => {
      setDialogEdit(true);
      setVisible(true);
    };

    const ConfirmarAnalise = () => {
      if(statusAnalise == "") {
        if(name == 'aprovado') {
          fetchInsertValidar("APROVADO");
          setVisible(false);
          setLoading(false);

        }else{
          fetchInsertValidar("REPROVADO");
          setVisible(false);
          setLoading(false);

        }

      }else{
        fetchValidar();
        setVisible(false);
        setLoading(false);
      }
    }

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Analise"} />
        <Content>
        <DialogAlert 
                    visibleDiag={visualizarAnalise} 
                    visibleHide={() => setVisualizarAnalise(false)}
                    header={<h4>Análise Observações</h4>}
                    colorType={'#13293d'}
                    ConfirmaButton={false}
                    textCloseButton={'Ok'}
                    text={
                        <>
                        <TableGrid style={{
                          width: '100%',
                          fontSize: '0.7rem'
                        }}>
                          <tbody>
                            {Observacao().map((observacaoArray, outerIndex) => (
                              observacaoArray.map((observacao, innerIndex) => (
                                <tr key={`${outerIndex}-${innerIndex}`}>
                                  <td style={{padding:'0.5rem'}}>{observacao}</td>
                                </tr>
                              ))
                            ))}
                          </tbody>
                        </TableGrid>
                        </>
                    }
                />
        { dialogAviso ? (
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
                ):(
                    <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => setVisible(false)}
                    header={<h4>Analise</h4>}
                    colorType={'#13293d'}
                    ConfirmaButton={true}
                    textCloseButton={'Cancelar'}
                    buttonConfirmar={ConfirmarAnalise}
                    text={
                        <>
                        { !dialogEdit ?
                        ( 
                          statusAnalise != "" ? (
                          <div>
                            {name == 'aprovado' ? (
                            <div style={
                                {
                                  display: 'flex',
                                  width: '430px',
                                  marginLeft: '0.5rem',
                                  fontSize: '0.8rem', 
                                  fontWeight: '700', 
                                  justifyContent: 'center', 
                                  padding: '0.2rem',
                                  backgroundColor: '#D4EFDF',
                                  color: '#145A32',
                                  border: '1px solid #145A32'
                                }
                              }>APROVADO</div>
                              ) : (
                                <div style={
                                  {
                                    display: 'flex',
                                    width: '430px',
                                    marginLeft: '0.5rem',
                                    fontSize: '0.8rem', 
                                    fontWeight: '700', 
                                    justifyContent: 'center', 
                                    padding: '0.2rem',
                                    backgroundColor: '#E6B0AA',
                                    color: '#641E16',
                                    border: '1px solid #641E16'
                                  }
                                }>REPROVADO</div>
                              )
                              }
                            <div style={{display: 'flex'}}>
                              <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                                <label style={{fontSize: '0.7rem', fontWeight: '700'}}>OBSERVAÇÃO:</label>
                                <textarea onChange={handleInputChange} name="testeObservacao" style={
                                  {
                                    width: '430px', 
                                    height: '100px', 
                                    resize: 'none',
                                    padding: '0.3rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                  }
                                }
                                />
                            </div>
                            </div>
                          </div>
                          ):(
                            <div>
                            {name == 'aprovado' ? (
                            <div style={
                                {
                                  display: 'flex',
                                  width: '430px',
                                  marginLeft: '0.5rem',
                                  fontSize: '0.8rem', 
                                  fontWeight: '700', 
                                  justifyContent: 'center', 
                                  padding: '0.2rem',
                                  backgroundColor: '#D4EFDF',
                                  color: '#145A32',
                                  border: '1px solid #145A32'
                                }
                              }>APROVADO</div>
                              ) : (
                                <div style={
                                  {
                                    display: 'flex',
                                    width: '430px',
                                    marginLeft: '0.5rem',
                                    fontSize: '0.8rem', 
                                    fontWeight: '700', 
                                    justifyContent: 'center', 
                                    padding: '0.2rem',
                                    backgroundColor: '#E6B0AA',
                                    color: '#641E16',
                                    border: '1px solid #641E16'
                                  }
                                }>REPROVADO</div>
                              )
                              }
                            <div style={{display: 'flex'}}>
                              <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                                <label style={{fontSize: '0.7rem', fontWeight: '700'}}>OBSERVAÇÃO:</label>
                                <textarea onChange={handleInputChange} name="testeObservacao" style={
                                  {
                                    width: '430px', 
                                    height: '100px', 
                                    resize: 'none',
                                    padding: '0.3rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                  }
                                }
                                />
                            </div>
                            </div>
                          </div>
                          )
                        ) : (
                          <div>
                            {name == 'aprovado' ? (
                            <div style={
                                {
                                  display: 'flex',
                                  width: '430px',
                                  marginLeft: '0.5rem',
                                  fontSize: '0.8rem', 
                                  fontWeight: '700', 
                                  justifyContent: 'center', 
                                  padding: '0.2rem',
                                  backgroundColor: '#D4EFDF',
                                  color: '#145A32',
                                  border: '1px solid #145A32'
                                }
                              }>APROVADO</div>
                              ) : (
                                <div style={
                                  {
                                    display: 'flex',
                                    width: '430px',
                                    marginLeft: '0.5rem',
                                    fontSize: '0.8rem', 
                                    fontWeight: '700', 
                                    justifyContent: 'center', 
                                    padding: '0.2rem',
                                    backgroundColor: '#E6B0AA',
                                    color: '#641E16',
                                    border: '1px solid #641E16'
                                  }
                                }>REPROVADO</div>
                              )
                              }
                            <div style={{display: 'flex'}}>
                              <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                                <label style={{fontSize: '0.7rem', fontWeight: '700'}}>OBSERVAÇÃO:</label>
                                <textarea onChange={handleInputChange} defaultValue={`${inputValue.analiseObservacao}`} name="testeObservacao" style={
                                  {
                                    width: '430px', 
                                    height: '100px', 
                                    resize: 'none',
                                    padding: '0.3rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '600'
                                  }
                                }
                                />
                            </div>
                            </div>
                          </div>
                        )
                        }
                        </>
                    }
                    />
                )
                }
            { loading ? (
            <>
            <div style={{
                 display:'flex',
                 minWidth: '720px', 
                 justifyContent: 'flex-start', 
                 alignItems: 'flex-end',
                 marginTop: '1.5rem',
            }}>
                <ButtonImagem onClick={handleImagens}>Imagens</ButtonImagem>
            </div>  
            <TableGrid>
                <thead>
                    <tr>
                        <th colSpan={3}>-- ANALISE {uf} - {estacao} - {cdo} --</th>
                    </tr>
                    { statusAnalise != "" ? (
                    <tr>
                      <th style={statusAnalise == 'APROVADO' ? {
                          backgroundColor: '#D4EFDF',
                          color: '#145A32',
                          borderTop: '1px solid #145A32',
                          borderBottom: '1px solid #145A32'
                        } : {
                            backgroundColor: '#E6B0AA',
                            color: '#641E16',
                            borderTop: '1px solid #641E16',
                            borderBottom: '1px solid #641E16'
                        }} colSpan={3}> {statusAnalise} </th>
                      </tr>
                    ) : (null)
                    }
                </thead>
                <tbody>
                        <tr>
                          { statusAnalise != "" ? (
                            <td style={{backgroundColor: '#34495E', color: '#ffffff'}}>{inputValue.status}</td> 
                          ): ( 
                            <td style={{backgroundColor: '#34495E', color: '#ffffff'}}>TESTE</td>
                          )
                          }
                            <td style={{backgroundColor: '#34495E', color: '#ffffff'}}>ANALISTA : {user.nome.toUpperCase() ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>{testeOptico.uf ?? '-------'} - {enderecoTotal.estado ?? '-------'}</td>
                            <td>{testeOptico.construtora ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Estação: {testeOptico.estacao ?? '-------'} - {enderecoTotal.siglaEstacao ?? '-------'}</td>
                            <td>Tipo Obra: {testeOptico.tipoObra ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Estado Campo: {testeOptico.estadoCampo ?? '-------'}</td>
                            <td>Estado Projeto {enderecoTotal.estadoProjeto ?? '-------'}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <table>
                              <tbody>
                              <tr>
                                <td>Cabo: {testeOptico.cabo ?? '-------'}</td>
                                <td>Celula: {testeOptico.celula ?? '-------'}</td>
                                <td>Total UMs: {testeOptico.totalUMs ?? '-------'}</td>
                              </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>{testeOptico.cdo ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Codigo: {enderecoTotal.cod_Viabilidade ?? '-------'} | {enderecoTotal.tipoViabilidade ?? '-------'}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{padding: '0'}}>
                            <table style={{width: '100%', fontSize: '0.6rem', marginTop: '0.5rem', marginBottom: '0.8rem'}}>
                              <thead>
                                <tr>
                                <th colSpan={5}>HISTÓRICO ANÁLISE</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th style={{width: '25%'}}>ANALISTA</th>
                                  <th style={{width: '15%'}}>DATA ANALISE</th>
                                  <th style={{width: '15%'}}>STATUS</th>
                                  <th style={{width: '20%'}}>OBSERVAÇÃO</th>
                                  <th># AÇÕES #</th>
                                </tr>
                              </thead>
                              <tbody>
                              {testeOptico.analises.map((analise, index) => (
                                  <tr key={index} style={analise.status == 'APROVADO' ?
                                  {backgroundColor:'#D5F5E3'} : {backgroundColor:'#F5B7B1'}}>
                                    <td>{analise.analista}</td>
                                    <td>{new Date(analise.dataAnalise).toLocaleDateString()}</td>
                                    <td>{analise.status}</td>
                                    <td>
                                      <>
                                        <Button style={{fontSize: '0.6rem', fontWeight: '700'}} onClick={AnaliseDetalhe} >OBSERVAÇÕES</Button>
                                      </> 
                                    </td> 
                                    <td>
                                      <>
                                        <Button onClick={handleEdit} >Editar</Button>
                                      </> 
                                    </td> 
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                            <td>Data Est. Operacional: {enderecoTotal.dataEstadoOperacional == 0 ? '-------' : enderecoTotal.dataEstadoOperacional}</td>
                            <td>Estado Operacional: {enderecoTotal.estadoOperacional == 0 ? '-------' : enderecoTotal.estadoOperacional}</td>
                        </tr>
                        <tr>
                            <td>Data Est. Controle: {enderecoTotal.dataEstadoControle == 0 ? '-------' : enderecoTotal.dataEstadoControle}</td>
                            <td>Estado Controle: {enderecoTotal.EstadoControle ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Bobina Lançamento: {testeOptico.bobinaLancamento ?? '-------'}</td>
                            <td>Posição ICX/DGO: {testeOptico.posicaoIcxDgo ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Bobina de Recepção: {testeOptico.BobinadeRecepcao ?? '-------'}</td>
                            <td>Splitter CEOS: {testeOptico.SplitterCEOS ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Quantidade Teste: {testeOptico.quantidadeDeTeste ?? '-------'}</td>
                            <td>Fibra DGO: {testeOptico.fibraDGO ?? '-------'}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{padding: '0'}}>
                            <table style={{width: '100%', fontSize: '0.6rem', marginTop: '0.5rem', marginBottom: '0.8rem'}}>
                              <thead>
                                <tr>
                                <th colSpan={6}>ANÁLISE CDOIAS</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th style={{width: '20%'}}>CDOIA</th>
                                  <th style={{width: '20%'}}>ANALISTA</th>
                                  <th style={{width: '15%'}}>DATA ANALISE</th>
                                  <th style={{width: '8%'}}>STATUS</th>
                                  <th style={{width: '15%'}}>OBSERVAÇÃO</th>
                                  <th># AÇÕES #</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <>
                                    <div>
                                      <ButtonCdoia onClick={handleEdit} >ADICIONAR</ButtonCdoia>
                                    </div>
                                    </>
                                  </td>
                                </tr>
                              {cdoia.map((analise, index) => (
                                  <tr key={index} style={analise.cdoiaStatus == 'OK' ?
                                  {backgroundColor:'#D5F5E3'} : {backgroundColor:'#F5B7B1'}}>
                                    <td>{cdo}.{analise.cdoia}</td>
                                    <td>{analise.analista ?? "--"}</td>
                                    <td>{analise.dataAnalise == null ? "--" : new Date(analise.dataAnalise).toLocaleDateString()}</td>
                                    <td>{analise.cdoiaStatus}</td>
                                    <td>
                                      <>
                                        <Button style={{fontSize: '0.6rem', fontWeight: '700'}} onClick={AnaliseDetalhe} >OBSERVAÇÕES</Button>
                                      </> 
                                     </td> 
                                     <td>
                                      <>
                                        <Button style={{marginLeft:'0.5rem', marginRight: '0.5rem'}} onClick={handleEdit} >Editar</Button>
                                        <Button onClick={handleEdit} >Excluir</Button>
                                      </> 
                                    </td> 
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                </tbody>
            </TableGrid>
            <FooterButton>
              <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
              {statusAnalise == 'REPROVADO' ? (
                <ButtonConfirma name="aprovado" style={{backgroundColor:'#00ce59'}} onClick={Adicionar} >APROVAR</ButtonConfirma>
              ) :(
                <ButtonConfirma name="reprovado" style={{backgroundColor:'#fa1e1e'}} onClick={Adicionar} >REPROVAR</ButtonConfirma>
              )}
              { statusAnalise == "" ? (
                  <ButtonConfirma name="aprovado" style={{backgroundColor:'#00ce59'}} onClick={Adicionar} >APROVAR</ButtonConfirma>
              ) : (null)
              }
            </FooterButton>
            </>
            ):(<Spinner />)
            }
        </Content>
            <Footer />
        </Template>
        </>
    );
}

export default Vizualizar;