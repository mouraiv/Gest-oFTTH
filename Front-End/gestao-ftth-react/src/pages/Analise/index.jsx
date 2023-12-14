import React, {useState, useEffect, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, ButtonImagem, FooterButton, ButtonCdoia, TableGrid} from "./styles";
import { DetalheTesteOptico} from "../../api/testeOptico";
import { DetahleMaterialRedeAny} from "../../api/materialRede";
import { updateAnalise, createAnalise, deleteAnalise } from "../../api/analise";
import { updateAnaliseCdoia, createAnaliseCdoia, deleteAnaliseCdoia } from "../../api/cdoia";
import { Content, GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../GlobalStyle";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import { useAuth } from "../../contexts/auth";
import DialogAlert from "../../components/Dialog";

function Vizualizar(){
    const { id, idNetwin } = useParams();
    const [currentCdoia, setCurrentCdoia] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataAtual] = useState(new Date());
    const [testeOptico, setTesteOptico] = useState({});
    const [materialRede, setMaterialRede] = useState({});
    const [visible, setVisible] = useState(false);
    const [visualizarAnalise, setVisualizarAnalise] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [dialogAviso, setDialogAviso] = useState();
    const [event, setEvent] = useState({});
    const [inputCdoia, setInputCdoia] = useState("1");
    const [inputValue, setInputValue] = useState({});
    const [selectedOption, setSelectedOption] = useState("OK");

    const navigate = useNavigate();
    const inputRef = useRef();
    const { user } = useAuth();
    const _dataAtual = dataAtual.toISOString();
    const{ name } = event.target ?? "";
    const removeDateObs = /\[ \d{2}\/\d{2}\/\d{4} \]/g;

    const {
      uf, 
      estacao, 
      cdo, 
      construtora,
      tipoObra,
      cabo,
      celula,
      totalUMs,
      bobinaLancamento,
      bobinaRecepcao,
      quantidadeTeste,
      posicaoIcxDgo,
      splitterCEOS,
      estadoCampo,
      fibraDGO, 
      analises,

    } = testeOptico ?? {};

    const {
      enderecoTotal,
      siglaAbastecedora_Mt

    } = materialRede ?? {};

    const { 
      analista, 
      dataAnalise, 
      status, 
      analiseCDOIAs,
      analiseObservacao,
      id_Analise
      
    } = analises ?? {};

    async function fetchValidar() {
        try {
            const analiseData = {
                ...analises
            };

            const _analiseObservacao = analiseData.analiseObservacao != null ? analiseData.analiseObservacao.replace(';.','') : "";
            const observacao = _analiseObservacao.split(';');
            const index = (observacao.length - 1);
            const inputObs = inputValue.analiseObservacao.replace(removeDateObs,"");
            
            if(name === 'editar') {
              observacao[index] = `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputObs}`;
              const _observacao = observacao.join(';');

              analiseData.analiseObservacao = inputObs != "" ? `${_observacao}` : `${analiseData.analiseObservacao}`;

            } else {
              analiseData.analista = user.nome.toUpperCase();
              analiseData.status = status == 'APROVADO' ? 'REPROVADO' : 'APROVADO';
              analiseData.dataAnalise = _dataAtual;

              if(new Date(dataAnalise).toLocaleDateString() == new Date(_dataAtual).toLocaleDateString()){
                if(inputValue.analiseObservacao != "") {
                observacao[index] = `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputObs}`;
                const _observacao = observacao.join(';');
                analiseData.analiseObservacao = inputObs != "" ? `${_observacao}` : `${analiseData.analiseObservacao}`;

                }

              }else{
                analiseData.analiseObservacao = inputObs != "" ? `${analiseData.analiseObservacao};[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputObs}` : `${analiseData.analiseObservacao}`;

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

    async function fetchDeleteCdo(){
      try {
        const response = await deleteAnalise(id_Analise);

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

    async function fetchInsertValidarCdoia() {
      try {
          const analiseInsert = {
            cdoia: inputCdoia ?? "1",
            cdoiaStatus: selectedOption,
            analista: user.nome.toUpperCase(),
            dataAnalise: _dataAtual,
            cdoiaObservacao: inputValue.analiseObservacao != "" ? `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputValue.analiseObservacao.replace(removeDateObs,"")}` : "",
            id_Analise: id_Analise
          }

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
              ...analiseCDOIAs[0]
            };

            analiseData.id_AnaliseCDOIA = currentCdoia.idAnaliseCdoia,
            analiseData.cdoia = currentCdoia.cdoia,
            analiseData.analista = user.nome.toUpperCase();
            analiseData.cdoiaStatus = currentCdoia.cdoiaStatus;
            analiseData.dataAnalise = _dataAtual;
            analiseData.cdoiaObservacao = currentCdoia.cdoiaObservacao != "" ? `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${currentCdoia.cdoiaObservacao.replace(removeDateObs,"")}` : "";

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

                const detalheMaterialRede = await DetahleMaterialRedeAny(idNetwin);

                if(detalheMaterialRede.status == 200) {
                  setMaterialRede(detalheMaterialRede.data);
                  
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
      
    },[loading]);

    const tipoCdoe = () => {
      const regex = /[A-Z]+-(\d+)/;
      
      if(cdo !== undefined){
      const match = cdo !== undefined ? cdo.match(regex) : '';

        if (match) {
          const extractedPart = match[0].split('-')[0];  
          return extractedPart === 'CDOE' ? 'CDOE' : 'CDOIA'; 
          }
      }else{
        return '';
      }

    }
    
    const analiseState = () => {
      let obs = analiseObservacao?.split(';');
      return `${obs?.length > 1 ? "RE-TESTE" : "TESTADO"}`
    }

    const handleVoltar = () => {
        navigate(-1); 
    };

    const handleImagens = () => {
        navigate(`/TesteOptico/Imagem/${uf}/${siglaAbastecedora_Mt}/${estacao}/${cdo}`); 
    };

    const Observacao = () => {
      if (analiseObservacao !== null) {
          const observacoes = analiseObservacao.replace(';.','').split(';');
          const _observacoes = observacoes.map(obs => obs);
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
      setCurrentCdoia({idAnaliseCdoia: id});
      setEvent(e);
      setVisible(true);

    }

    const ConfirmarExluirCdoia = () => {
      fetchDeleteCdoia();
      setVisible(false);
      setLoading(false);

    }

    const handleExcluirCdo = (e) => {
      setEvent(e);
      setVisible(true);

    }

    const ConfirmarExluirCdo = () => {
      fetchDeleteCdo();
      setVisible(false);
      setLoading(false);

    }

    const handleObservacaoCdoia = (e, cdoiaObservacao) => {
      setCurrentCdoia({cdoiaObservacao: cdoiaObservacao});
      setEvent(e);
      setVisible(true);

    }

    const ConfirmarAnalise = () => {
      if(status === undefined) {
        if(name === 'aprovado') {
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
      const _cdoiaRepeat = analiseCDOIAs.filter(p => p.cdoia == inputCdoia)
      .map(value => value.cdoia);
      
      if(_cdoiaRepeat.length > 0){
        setMensagem(`${cdo}.${inputCdoia} já existe.`)
        setInputCdoia("1")

      }else{
        setMensagem("");
        fetchInsertValidarCdoia();
        setInputCdoia("1")
        setVisible(false);

      }
      setLoading(false);
    }

    const handleSelectChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const handleChangeCdoia = (event) => {
      const _cdoia = `${event.target.value}`;
      setMensagem("");
      setInputCdoia(_cdoia);
    }

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Analise"} />
        <Content>
        { loading || status !== undefined ? (
            <>
            { name === 'observacao' ? (
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
                                  {Observacao().map((observacao, innerIndex) => (
                                      <tr key={`${innerIndex}`}>
                                        <td style={{padding:'0.5rem'}}>{observacao}</td>
                                      </tr>
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

            { name === 'editar' ? (
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
                      { status === "APROVADO" ? (
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
                              <textarea onChange={handleInputChange} defaultValue={`${inputValue.analiseObservacao?.replace(removeDateObs,"") ?? ""}`} name="testeObservacao" style={
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

            { name === 'excluirCdo' ? (
                <DialogAlert 
                    visibleDiag={visible} 
                    visibleHide={() => setVisible(false)}
                    header={<h4>Excluir analise</h4>}
                    colorType={'#ff0000'}
                    ConfirmaButton={true}
                    textCloseButton={'Cancelar'}
                    buttonConfirmar={ConfirmarExluirCdo}
                    text={
                          <>
                            <p>Esta ação é irreversível</p>
                            <p></p>
                            <p>Tem certeza que gostaria de excluir</p>
                          </>
                          }   
                 />
            ):(null)
            }

            { name === 'adicionarCdoia' ? (
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
                      { mensagem !== "" ? (
                        <div style={
                            {
                              width:'100%',
                              backgroundColor:'#FDEDEC',
                              border:'1px solid red',
                              textAlign: 'center',
                              color: 'red',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              padding:'0.1rem',
                              marginBottom: '0.6rem'
                            }
                          }>{mensagem}</div>
                        ) : (null)
                        }
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

            { name === 'observacaoCdoia' ? (
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

            { name === 'editarCdoia' ? (
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
                              <textarea onChange={handleInputChangeCdoia} defaultValue={`${currentCdoia.cdoiaObservacao?.replace(removeDateObs,"") ?? ""}`} name="testeObservacao" style={
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

            { name === 'excluirCdoia' ? (
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

            { status !== undefined && (name == "aprovado" || name == "reprovado") ? (
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
                      { status !== "APROVADO" ? (
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

            { status === undefined ? (
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
                      {  name === 'aprovado' ? (
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
                        <th colSpan={3}>-- ANALISE : {uf} - {estacao} - {cdo} --</th>
                    </tr>
                    { status !== undefined && status === "APROVADO" ? (
                    <tr>
                      <th style={{
                          backgroundColor: '#D4EFDF',
                          color: '#145A32',
                          borderTop: '1px solid #145A32',
                          borderBottom: '1px solid #145A32'
                        }} colSpan={3}> {status} </th>
                      </tr>
                    ) : (null)
                    }
                    { status !== undefined && status === "REPROVADO" ? (
                    <tr>
                      <th style={{
                            backgroundColor: '#E6B0AA',
                            color: '#641E16',
                            borderTop: '1px solid #641E16',
                            borderBottom: '1px solid #641E16'
                        }} colSpan={3}> {status} </th>
                      </tr>
                    ) : (null)
                    }
                </thead>
                <tbody>
                        <tr>
                          { status !== undefined ? (
                            <td style={{backgroundColor: '#34495E', color: '#ffffff'}}>{analiseState()}</td> 
                          ): ( 
                            <td style={{backgroundColor: '#34495E', color: '#ffffff'}}>TESTE</td>
                          )
                          }
                            <td style={{backgroundColor: '#34495E', color: '#ffffff'}}>ANALISTA : {user.nome.toUpperCase() ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>{uf ?? '-------'} - {materialRede?.nomeFederativa_Mt ?? '-------'}</td>
                            <td>{construtora ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Estação: {estacao ?? '-------'} - {enderecoTotal?.[0]?.siglaEstacao ?? '-------'}</td>
                            <td>Tipo Obra: {tipoObra ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Estado Campo: {estadoCampo ?? '-------'}</td>
                            <td>Estado Projeto {enderecoTotal?.[0]?.estadoProjeto ?? '-------'}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <table>
                              <tbody>
                              <tr>
                                <td>Cabo: {cabo ?? '-------'}</td>
                                <td>Celula: {celula ?? '-------'}</td>
                                <td>Total UMs: {totalUMs ?? '-------'}</td>
                              </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>{cdo ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Codigo: {enderecoTotal?.[0]?.cod_Viabilidade ?? '-------'} | {enderecoTotal?.[0]?.tipoViabilidade ?? '-------'}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{padding: '0'}}>
                            <table style={{width: '100%', fontSize: '0.6rem', marginTop: '0.5rem', marginBottom: '0.8rem'}}>
                            { testeOptico.sel == 1 ? (
                              <>
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
                              {status !== undefined ? (                           
                               <tr style={status === 'APROVADO' ?
                                  {backgroundColor:'#D5F5E3'} : {backgroundColor:'#F5B7B1'}}>
                                    <td>{analista}</td>
                                    <td>{new Date(dataAnalise).toLocaleDateString()}</td>
                                    <td>{status}</td>
                                    <td>
                                      <>
                                        <Button name="observacao" style={{fontSize: '0.6rem', fontWeight: '700'}} onClick={AnaliseDetalhe} >OBSERVAÇÕES</Button>
                                      </> 
                                    </td> 
                                    <td>
                                      <>
                                        <Button name="editar" style={{marginLeft:'0.5rem', marginRight: '0.5rem'}} onClick={handleEdit} >Editar</Button>
                                        <Button name="excluirCdo" onClick={handleExcluirCdo} >Excluir</Button>
                                      </> 
                                    </td> 
                                  </tr>
                              ):(null)
                              }
                              </tbody>
                              </>
                              ):(
                                <>
                              <thead>
                                <tr>
                                <th colSpan={4}>HISTÓRICO ANÁLISE</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th style={{width: '25%'}}>ANALISTA</th>
                                  <th style={{width: '15%'}}>DATA ANALISE</th>
                                  <th style={{width: '15%'}}>STATUS</th>
                                  <th style={{width: '20%'}}>OBSERVAÇÃO</th>
                                </tr>
                              </thead>
                              <tbody>
                              {status !== undefined ? (                           
                               <tr style={status === 'APROVADO' ?
                                  {backgroundColor:'#D5F5E3'} : {backgroundColor:'#F5B7B1'}}>
                                    <td>{analista}</td>
                                    <td>{new Date(dataAnalise).toLocaleDateString()}</td>
                                    <td>{status}</td>
                                    <td>
                                      <>
                                        <Button name="observacao" style={{fontSize: '0.6rem', fontWeight: '700'}} onClick={AnaliseDetalhe} >OBSERVAÇÕES</Button>
                                      </> 
                                    </td> 
                                  </tr>
                              ):(null)
                              }
                              </tbody>
                              </>
                              )
                              }
                            </table>
                          </td>
                        </tr>
                        <tr>
                            <td>Data Est. Operacional: {materialRede?.dataEstadoOperacional_Mt === undefined ? '-------' : materialRede?.dataEstadoOperacional_Mt}</td>
                            <td>Estado Operacional: {materialRede?.estadoOperacional_Mt === undefined ? '-------' : materialRede?.estadoOperacional_Mt}</td>
                        </tr>
                        <tr>
                            <td>Data Est. Controle: {materialRede?.dataEstadoControle_Mt === undefined ? '-------' : materialRede?.dataEstadoControle_Mt}</td>
                            <td>Estado Controle: {materialRede?.estadoControle_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Bobina Lançamento: {bobinaLancamento ?? '-------'}</td>
                            <td>Posição ICX/DGO: {posicaoIcxDgo ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Bobina de Recepção: {bobinaRecepcao ?? '-------'}</td>
                            <td>Splitter CEOS: {splitterCEOS ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Quantidade Teste: {quantidadeTeste ?? '-------'}</td>
                            <td>Fibra DGO: {fibraDGO ?? '-------'}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{padding: '0'}}>
                          {tipoCdoe() === 'CDOIA' ? (
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
                              { testeOptico.sel == 1 &&
                                <tr>
                                  <td>
                                      <ButtonCdoia name="adicionarCdoia" onClick={handleAdicionarCdoia} >ADICIONAR</ButtonCdoia>      
                                  </td>
                                </tr>
                                }
                                {analiseCDOIAs?.map((analise, index) => (
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
                                ))}
                              </tbody>
                            </table>
                            ):(null)
                            }
                          </td>
                        </tr>
                </tbody>
            </TableGrid>
            <FooterButton>
              <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
              { testeOptico.sel == 1 &&
                  <>
                  {status === undefined ? (
                      <>
                          <ButtonConfirma name="aprovado" style={{backgroundColor:'#00ce59'}} onClick={Adicionar} >APROVAR</ButtonConfirma>
                          <ButtonConfirma name="reprovado" style={{backgroundColor:'#fa1e1e'}} onClick={Adicionar} >REPROVAR</ButtonConfirma>
                      </>  
                  ) : null}
                  {status !== undefined && status !== "APROVADO" ? (
                      <ButtonConfirma name="aprovado" style={{backgroundColor:'#00ce59'}} onClick={Adicionar} >APROVAR</ButtonConfirma>
                  ) : null}
                  {status !== undefined && status === "APROVADO" ? (
                      <ButtonConfirma name="reprovado" style={{backgroundColor:'#fa1e1e'}} onClick={Adicionar} >REPROVAR</ButtonConfirma>
                  ) : null}
                  </>
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