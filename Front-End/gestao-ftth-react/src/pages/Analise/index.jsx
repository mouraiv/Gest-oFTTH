import React, {useState, useEffect, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, ButtonImagem, FooterButton, ButtonCdoia, TableGrid} from "./styles";
import { DetalheTesteOptico} from "../../api/testeOptico";
import { updateAnalise, createAnalise } from "../../api/analise";
import { updateAnaliseCdoia, createAnaliseCdoia, deleteAnaliseCdoia } from "../../api/cdoia";
import { getEnderecoTotalAny } from "../../api/enterecoTotais"
import { Content, GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../GlobalStyle";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import { useAuth } from "../../contexts/auth";
import DialogAlert from "../../components/Dialog";

function Vizualizar(){
    const { id } = useParams();
    const [currentCdoia, setCurrentCdoia] = useState({});
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
    const [statusAnalise, setStatusAnalise] = useState("");
    const [event, setEvent] = useState({});
    const [cdoia, setCdoia] = useState({});
    const [inputCdoia, setInputCdoia] = useState();
    const [inputValue, setInputValue] = useState({analiseObservacao:"", status: ""});
    const [selectedOption, setSelectedOption] = useState("OK");

    const navigate = useNavigate();
    const inputRef = useRef();
    const { user } = useAuth();
    const _dataAtual = dataAtual.toISOString();
    const{ name } = event.target ?? "";
    const removeDateObs = /\[ \d{2}\/\d{2}\/\d{4} \]/g;

    async function fetchValidar() {
        try {
            const analiseData = {
                ...testeOptico.analises[0]
            };

            const _analiseObservacao = analiseData.analiseObservacao != null ? analiseData.analiseObservacao.replace(';.','') : "";

            if(name == 'editar') {
              const observacao = _analiseObservacao.split(';');
              const index = (observacao.length - 1);
              observacao[index] = `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputValue.analiseObservacao.replace(removeDateObs,"")}`;
              const _observacao = observacao.join(';');

              analiseData.analiseObservacao = `${_observacao}`;

            } else {
              analiseData.analista = user.nome.toUpperCase();
              analiseData.status = statusAnalise.status == 'APROVADO' ? 'REPROVADO' : 'APROVADO';
              analiseData.dataAnalise = _dataAtual;

              if(_analiseObservacao != "") {      
                       
                if (inputValue.analiseObservacao != "") {analiseData.analiseObservacao = `${_analiseObservacao};[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputValue.analiseObservacao.replace(removeDateObs,"")}`};
                      
              }else{
                if (inputValue.analiseObservacao != "") {analiseData.analiseObservacao = `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputValue.analiseObservacao.replace(removeDateObs,"")}`};

              } 

            }

            const analiseResponse = await updateAnalise(analiseData);
    
            if (analiseResponse.status === 200) {
                console.log("Validado com sucesso")
            };
                        
            
        } catch (error) {
            setDialogAviso(true);
            setMensagem(`Erro ao analisar`);
            setVisible(true);
            setLoading(true);

        } finally {
            setLoading(true);
        }
    }

    async function fetchInsertValidar(status) {
      try {
          const analiseInsert = {
            CHAVE: '',
            status: status,
            analista: user.nome.toUpperCase(),
            dataAnalise: _dataAtual,
            analiseObservacao: inputValue.analiseObservacao != "" ? `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputValue.analiseObservacao}` : "",
            id_TesteOptico: id,
          }

          const analiseResponse = await createAnalise(analiseInsert);
  
          if (analiseResponse.status === 200) {
            console.log("Analisado com sucesso")
          }           
          
      } catch (error) {
          setDialogAviso(true);
          setMensagem(`Erro ao analisar`);
          setVisible(true);
          setLoading(true);

      } finally {
          setLoading(true);
      }
    }

    async function fetchInsertValidarCdoia() {
      try {
          const analiseInsert = {
            cdoia: inputCdoia ?? "1",
            cdoiaStatus: selectedOption,
            analista: user.nome.toUpperCase(),
            dataAnalise: _dataAtual,
            cdoiaObservacao: inputValue.analiseObservacao != "" ? `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputValue.analiseObservacao}` : "",
            id_Analise: statusAnalise.id_Analise
          }

          console.log(analiseInsert);

          const analiseResponse = await createAnaliseCdoia(analiseInsert);
  
          if (analiseResponse.status === 200) {
            console.log("Analisado com sucesso")
          }           
          
      } catch (error) {
          setDialogAviso(true);
          setMensagem(`Erro ao analisar`);
          setVisible(true);
          setLoading(true);

      } finally {
          setLoading(true);
      }
    }

    async function fetchEditarCdoia() {
      try {
          const analiseData = {
              ...testeOptico.analises[0].analiseCDOIAs[0]
            };

            analiseData.id_AnaliseCDOIA = currentCdoia.idAnaliseCdoia,
            analiseData.cdoia = currentCdoia.cdoia,
            analiseData.analista = user.nome.toUpperCase();
            analiseData.cdoiaStatus = currentCdoia.cdoiaStatus;
            analiseData.dataAnalise = _dataAtual;
            analiseData.cdoiaObservacao = currentCdoia.cdoiaObservacao != "" ? `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${currentCdoia.cdoiaObservacao}` : "";

            console.log(analiseData);

            const analiseResponse = await updateAnaliseCdoia(analiseData);
  
            if (analiseResponse.status === 200) {
                console.log("Analisado com sucesso");
            };
              
      } catch (error) {
          setDialogAviso(true);
          setMensagem(`Erro ao analisar`);
          setVisible(true);
          setLoading(true);

      } finally {
          setLoading(true);
      }
  }

    async function fetchDeleteCdoia(){
      try {
        const response = await deleteAnaliseCdoia(currentCdoia.idAnaliseCdoia);

        if(response.status == 200) {
          console.log("Excluido com sucesso");
        }
        
      } catch (error) {
        setDialogAviso(true);
        setMensagem(`Erro ao excluir`);
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
                setCdoia(detalheTesteOptico.data.analises[0].analiseCDOIAs ?? null)

                let status = detalheTesteOptico.data.analises.length;

                if(status > 0) {
                setStatusAnalise(detalheTesteOptico.data.analises[0] ?? null);

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

    },[loading])

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
      setDialogAviso(false);
      setVisible(true);
    };

    const AnaliseDetalhe = (e) => {
      setEvent(e);
      setVisualizarAnalise(true);
    };

    const handleInputChange = (e) => {
      const { value } = e.target;
      setInputValue({analiseObservacao: value});
    };

    const handleInputChangeCdoia = (e) => {
      const { value } = e.target;
      currentCdoia.cdoiaObservacao = value;
    };

    const handleEdit = (e) => {
      setEvent(e);
      setVisible(true);
    };
    
    const handleAdicionarCdoia = (e) => {
      setSelectedOption("OK");
      setInputValue({analiseObservacao:"", status: ""});
      setEvent(e);
      setVisible(true);

    }

    const handleEditarCdoia = (e, id_AnaliseCDOIA, cdoia, cdoiaStatus, cdoiaObservacao) => {
      setSelectedOption(cdoiaStatus);
      setCurrentCdoia({
        idAnaliseCdoia: id_AnaliseCDOIA,
        cdoia: cdoia,
        cdoiaStatus: cdoiaStatus,
        cdoiaObservacao: cdoiaObservacao
      });
      setEvent(e);
      setVisible(true);

    }

    const confirmarEditCdoia = () => {
      currentCdoia.cdoiaStatus = selectedOption;
      fetchEditarCdoia();
      setVisible(false);
      setLoading(false);
    }

    const handleExcluirCdoia = (e, id) => {
      setCurrentCdoia({idAnalise: 0, idAnaliseCdoia: id});
      setEvent(e);
      setVisible(true);

    }

    const ConfirmarExluirCdoia = () => {
      fetchDeleteCdoia();
      setVisible(false);
      setLoading(false);

    }

    const handleObservacaoCdoia = (e, cdoiaObservacao) => {
      setCurrentCdoia({cdoiaObservacao: cdoiaObservacao});
      setEvent(e);
      setVisible(true);

    }

    const ConfirmarAnalise = () => {
      if(statusAnalise == "") {
        if(name == 'aprovado') {
          fetchInsertValidar("APROVADO");
          setVisible(false);

        }else{
          fetchInsertValidar("REPROVADO");
          setVisible(false);

        }

      }else{
        fetchValidar();
        setVisible(false);
      }

      setLoading(false);

    }

    const ConfirmarAnaliseCdoia = () => {
      fetchInsertValidarCdoia();
      setVisible(false);
      setLoading(false);

    }

    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const handleChangeCdoia = (event) => {
      const _cdoia = `${event.target.value}`;
      setInputCdoia(_cdoia);
    }

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Analise"} />
        <Content>
        { loading ? (
            <>
            { name == 'observacao' ? (
                <DialogAlert 
                    visibleDiag={visualizarAnalise} 
                    visibleHide={() => setVisualizarAnalise(false)}
                    header={<h4>Observações</h4>}
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

            ):(null)
            }

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
            ) : (null)
            }

            { name == 'editar' ? (
                <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => setVisible(false)}
                    header={<h4>Editar Observação</h4>}
                    colorType={'#13293d'}
                    ConfirmaButton={true}
                    textCloseButton={'Cancelar'}
                    buttonConfirmar={ConfirmarAnalise}
                    text={
                      <>
                      { statusAnalise.status == "APROVADO" ? (
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
                              <textarea onChange={handleInputChange} defaultValue={`${inputValue.analiseObservacao.replace(removeDateObs,"")}`} name="testeObservacao" style={
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
                      </>
                          }   
                 />
            ):(null)
            }

            { name == 'adicionarCdoia' ? (
                <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => setVisible(false)}
                    header={<h4>Adicionar CDOIA</h4>}
                    colorType={'#13293d'}
                    ConfirmaButton={true}
                    textCloseButton={'Cancelar'}
                    buttonConfirmar={ConfirmarAnaliseCdoia}
                    text={
                      <>
                        <div style={
                                {
                                  display: 'flex',
                                  width: '430px',
                                  marginLeft: '0.5rem',
                                  fontSize: '0.8rem', 
                                  fontWeight: '700', 
                                  justifyContent: 'space-between', 
                                  padding: '0.2rem',
                                }
                              }>
                                <div>
                                  {cdo}. <input type="number" defaultValue={1} min={1} ref={inputRef} onChange={handleChangeCdoia} style={{
                                    width:'50px',
                                    paddingLeft:'0.5rem',
                                    fontWeight: '600',
                                    fontSize:'0.9rem'
                                  }} />
                                </div>
                                <select 
                                style={{
                                  width: '100px', 
                                  fontWeight:'700' , 
                                  height:'25px',
                                  color: selectedOption === "OK" ? 'green' : 'red'
                                }}
                                value={selectedOption}
                                onChange={handleSelectChange}
                                >
                                  <option style={{color:'green', fontWeight:'700'}} value={"OK"}>OK</option>
                                  <option style={{color:'red', fontWeight:'700'}} value={"NOK"}>NOK</option>
                                </select>
                              </div>
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
                        </>
                      }         
                 />
            ):(null)
            }

            { name == 'observacaoCdoia' ? (
                <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => setVisible(false)}
                    header={<h4>Observações CDOIA</h4>}
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
                                  <tr>
                                    <td style={{padding:'0.5rem'}}>{currentCdoia.cdoiaObservacao}</td>
                                  </tr>
                                  </tbody>
                                  </TableGrid>
                          </>
                          }   
                 />
            ):(null)
            }

            { name == 'editarCdoia' ? (
                <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => setVisible(false)}
                    header={<h4>Editar Observação CDOIA</h4>}
                    colorType={'#13293d'}
                    ConfirmaButton={true}
                    textCloseButton={'Cancelar'}
                    buttonConfirmar={confirmarEditCdoia}
                    text={
                          <>
                            <div style={
                                {
                                  display: 'flex',
                                  width: '430px',
                                  marginLeft: '0.5rem',
                                  fontSize: '0.8rem', 
                                  fontWeight: '700', 
                                  justifyContent: 'end', 
                                  padding: '0.2rem',
                                }
                              }>
                                <select 
                                style={{
                                  width: '100px', 
                                  fontWeight:'700' , 
                                  height:'25px',
                                  color: selectedOption === "OK" ? 'green' : 'red'
                                }}
                                value={selectedOption}
                                onChange={handleSelectChange}
                                >
                                  <option style={{color:'green', fontWeight:'700'}} value={"OK"}>OK</option>
                                  <option style={{color:'red', fontWeight:'700'}} value={"NOK"}>NOK</option>
                                </select>
                              </div>
                          <div style={{display: 'flex'}}>
                            <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                              <label style={{fontSize: '0.7rem', fontWeight: '700'}}>OBSERVAÇÃO:</label>
                              <textarea onChange={handleInputChangeCdoia} defaultValue={`${currentCdoia.cdoiaObservacao.replace(removeDateObs,"")}`} name="testeObservacao" style={
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
                          </>
                          }   
                 />
            ):(null)
            }

            { name == 'excluirCdoia' ? (
                <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => setVisible(false)}
                    header={<h4>Excluir CDOIA</h4>}
                    colorType={'#ff0000'}
                    ConfirmaButton={true}
                    textCloseButton={'Cancelar'}
                    buttonConfirmar={ConfirmarExluirCdoia}
                    text={
                          <>
                            <p>Esta ação é irreversível</p>
                            <p></p>
                            <p>Tem certeza que gostaria de excluir?</p>
                          </>
                          }   
                 />
            ):(null)
            }

            { statusAnalise.id_Analise != undefined && (name == "aprovado" || name == "reprovado") ? (
                <DialogAlert 
                visibleDiag={visible} 
                visibleHide={() => { setVisible(false)}}
                header={<h4>Analisar</h4>}
                colorType={'#13293d'}
                ConfirmaButton={true}
                textCloseButton={'Cancelar'}
                buttonConfirmar={ConfirmarAnalise}
                text={
                    <>
                      { statusAnalise.status != "APROVADO" ? (
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
                      </>
                      }   
                />
            ) : (null)
            }

            { statusAnalise.id_Analise == undefined ? (
                <DialogAlert 
                visibleDiag={visible} 
                visibleHide={() => setVisible(false)}
                header={<h4>Analisar</h4>}
                colorType={'#13293d'}
                ConfirmaButton={true}
                textCloseButton={'Cancelar'}
                buttonConfirmar={ConfirmarAnalise}
                text={
                    <>
                      {  name == 'aprovado' ? (
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
                      </>
                      }   
                />
            ) : (null)
            }
            
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
                      <th style={statusAnalise.status == 'APROVADO' ? {
                          backgroundColor: '#D4EFDF',
                          color: '#145A32',
                          borderTop: '1px solid #145A32',
                          borderBottom: '1px solid #145A32'
                        } : {
                            backgroundColor: '#E6B0AA',
                            color: '#641E16',
                            borderTop: '1px solid #641E16',
                            borderBottom: '1px solid #641E16'
                        }} colSpan={3}> {statusAnalise.status} </th>
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
                                        <Button name="observacao" style={{fontSize: '0.6rem', fontWeight: '700'}} onClick={AnaliseDetalhe} >OBSERVAÇÕES</Button>
                                      </> 
                                    </td> 
                                    <td>
                                      <>
                                        <Button name="editar" onClick={handleEdit} >Editar</Button>
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
                                    {statusAnalise != "" ? (
                                      <ButtonCdoia name="adicionarCdoia" onClick={handleAdicionarCdoia} >ADICIONAR</ButtonCdoia>
                                    ):(null)
                                    }
                                    </div>
                                    </>
                                  </td>
                                </tr>
                              {statusAnalise != "" ? (cdoia.map((analise, index) => (
                                  <tr key={index} style={analise.cdoiaStatus == 'OK' ?
                                  {backgroundColor:'#D5F5E3'} : {backgroundColor:'#F5B7B1'}}>
                                    <td>{cdo}.{analise.cdoia ?? "--"}</td>
                                    <td>{analise.analista ?? "--"}</td>
                                    <td>{analise.dataAnalise == null ? "--" : new Date(analise.dataAnalise).toLocaleDateString()}</td>
                                    <td>{analise.cdoiaStatus ?? "--"}</td>
                                    <td>
                                      <>
                                        <Button name="observacaoCdoia" style={{fontSize: '0.6rem', fontWeight: '700'}} onClick={(e) => handleObservacaoCdoia(e, analise.cdoiaObservacao)} >OBSERVAÇÕES</Button>
                                      </> 
                                     </td> 
                                     <td>
                                      <>
                                        <Button name="editarCdoia" style={{marginLeft:'0.5rem', marginRight: '0.5rem'}} onClick={(e) => handleEditarCdoia(e, analise.id_AnaliseCDOIA, analise.cdoia, analise.cdoiaStatus, analise.cdoiaObservacao)} >Editar</Button>
                                        <Button name="excluirCdoia" onClick={(e) => handleExcluirCdoia(e, analise.id_AnaliseCDOIA)} >Excluir</Button>
                                      </> 
                                    </td> 
                                  </tr>
                                ))
                              ) :  (<tr></tr>)}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                </tbody>
            </TableGrid>
            <FooterButton>
              <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
              { statusAnalise.status == undefined ? (
                <>
                  <ButtonConfirma name="aprovado" style={{backgroundColor:'#00ce59'}} onClick={Adicionar} >APROVAR</ButtonConfirma>
                  <ButtonConfirma name="reprovado" style={{backgroundColor:'#fa1e1e'}} onClick={Adicionar} >REPROVAR</ButtonConfirma>
                </>  
              ) : (null)
              }
              { statusAnalise.id_Analise != undefined ? (
                statusAnalise.status != "APROVADO" ? (
                <ButtonConfirma name="aprovado" style={{backgroundColor:'#00ce59'}} onClick={Adicionar} >APROVAR</ButtonConfirma>
                ) : (
                  <ButtonConfirma name="reprovado" style={{backgroundColor:'#fa1e1e'}} onClick={Adicionar} >REPROVAR</ButtonConfirma>
                )
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