import {useState, useEffect, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, ButtonImagem, FooterButton, ButtonCdoia, TableGrid} from "./styles";
import { DetalheTesteOptico, UpdateTesteOptico} from "../../api/testeOptico";
import { DetalheMaterialRedeAny} from "../../api/materialRede";
import { UpdateAnalise, CreateAnalise, DeleteAnalise } from "../../api/analise";
import { UpdateAnaliseCdoia, CreateAnaliseCdoia, DeleteAnaliseCdoia } from "../../api/cdoia";
import { Content, GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../GlobalStyle";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import { UseAuth } from "../../contexts/auth";
import DialogAlert from "../../components/Dialog";

function Vizualizar(){
    const { id, idNetwin } = useParams();
    const [ idAnalise, setIdAnalise ] = useState();
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
    const { user, ValidarToken } = UseAuth();
    const userPrivate = user?.tipo ?? 1;
    const _dataAtual = dataAtual.toISOString();
    const{ name } = event.target ?? "";
    const removeDateObs = /\[\s*\d{2}\/\d{2}\/\d{4}\s*\]/g;

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
      analiseCDOIAs

    } = testeOptico ?? {};
    
    const {
      enderecoTotal

    } = materialRede ?? {};

    const { 
      dataAnalise, 
      status, 
      analiseObservacao,
      id_Analise
      
    } = analises?.[analises.length - 1] ?? {};

    const cdoia = () => {
      return analiseCDOIAs.length > 0 ? false : true;
    }

    const cdoiaDay = () => {
      const _dataAtualCdoia = analiseCDOIAs?.[analiseCDOIAs.length - 1]?.dataAnalise;
      return new Date(_dataAtualCdoia).toLocaleDateString() === new Date(_dataAtual).toLocaleDateString() ? true : false;
    }

    const day = (dataAnalise) => {
       return new Date(dataAnalise).toLocaleDateString() === new Date(_dataAtual).toLocaleDateString() ? true : false;
    }

    async function FetchValidar(hd_status) {
        try {

            const _status = hd_status;

            if(name !== 'editar') {

              if(day(dataAnalise) === true){
                const ultimaAnalise = {}

                ultimaAnalise.id_Analise = id_Analise;

                const _analiseObservacao = ultimaAnalise.analiseObservacao != null ? ultimaAnalise.analiseObservacao.replace(';.','') : "";
                const observacao = _analiseObservacao.split(';');
                const index = (observacao.length - 1);
                const inputObs = inputValue.analiseObservacao.replace(removeDateObs,"");
                observacao[index] = `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputObs}`;

                const _observacao = observacao.join(';');

                ultimaAnalise.analista = user.nome.toUpperCase();
                ultimaAnalise.status = _status;
                
                ultimaAnalise.analiseObservacao = inputObs != "" ? `${_observacao}` : `${ultimaAnalise.analiseObservacao}`;
                
                const analiseResponse = await UpdateAnalise(ultimaAnalise);
      
                  if (analiseResponse.status === 200) {
                      console.log("Validado com sucesso")
                  };  
              
              }else{
                FetchInsertValidar(_status);
    
              }
            }

            if(name === 'editar') {
             
              const analiseEditId = analises?.filter((f) => f.id_Analise === idAnalise).map((value) => {return value});
              const editObs = {...analiseEditId?.[0]};

              const _analiseObservacao = editObs.analiseObservacao != null ? editObs.analiseObservacao.replace(';.','') : "";
              const observacao = _analiseObservacao.split(';');
              const index = (observacao.length - 1);
              const inputObs = inputValue.analiseObservacao.replace(removeDateObs,"");
              observacao[index] = `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputObs}`;

              const _observacao = observacao.join(';');
              
              if(day(dataAnalise) === true){
                editObs.analiseObservacao = inputObs != "" ? `${_observacao}` : `${editObs.analiseObservacao}`;
                
                const analiseResponse = await UpdateAnalise(editObs);
    
                if (analiseResponse.status === 200) {
                    console.log("Validado com sucesso")
                }
                
              }else{
                editObs.analiseObservacao = inputObs != "" ? `${editObs.analiseObservacao};[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputObs}` : `${editObs.analiseObservacao}`;

                const analiseResponse = await updateAnalise(editObs);
    
                if (analiseResponse.status === 200) {
                    console.log("Validado com sucesso")
                }

              }
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

    async function FetchInsertValidar(hd_status) {
      
      try {
          const analiseInsert = {
            CHAVE: `${testeOptico?.uf}-${testeOptico?.siglaEstacao}${testeOptico?.cdo}`,
            status: hd_status,
            analista: user.nome.toUpperCase(),
            dataAnalise: _dataAtual,
            analiseObservacao: inputValue.analiseObservacao != "" ? `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputValue.analiseObservacao}` : "",
            id_TesteOptico: id,
          }

          const analiseResponse = await CreateAnalise(analiseInsert);
  
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

    async function FetchDeleteCdo(){
      try {
        const response = await DeleteAnalise(idAnalise);

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

    async function FetchInsertValidarCdoia() {
      try {
          const analiseInsert = {
            cdoia: inputCdoia ?? "1",
            cdoiaStatus: selectedOption,
            analista: user.nome.toUpperCase(),
            dataAnalise: _dataAtual,
            cdoiaObservacao: inputValue.analiseObservacao != "" ? `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${inputValue.analiseObservacao.replace(removeDateObs,"")}` : "",
            id_TesteOptico: id
          }

          const analiseResponse = await CreateAnaliseCdoia(analiseInsert);
  
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

    async function FetchEditarCdoia() {
      try {
          const _cdoiaObservacao = currentCdoia.cdoiaObservacao != "" ? `[ ${new Date(_dataAtual).toLocaleDateString()} ] ${currentCdoia.cdoiaObservacao.replace(removeDateObs,"").trim()}` : "";
          const analiseData = {
              ...analiseCDOIAs[0]
            };

            analiseData.id_AnaliseCDOIA = currentCdoia.idAnaliseCdoia,
            analiseData.cdoia = currentCdoia.cdoia,
            analiseData.analista = user.nome.toUpperCase();
            analiseData.cdoiaStatus = currentCdoia.cdoiaStatus;
            analiseData.dataAnalise = _dataAtual;
            analiseData.cdoiaObservacao = _cdoiaObservacao;

            const analiseResponse = await UpdateAnaliseCdoia(analiseData);
  
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

    async function FetchDeleteCdoia(){
      try {
        const response = await DeleteAnaliseCdoia(currentCdoia.idAnaliseCdoia);

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

    async function FecthDetalheTesteOptico(){
        try {
            const detalheTesteOptico = await DetalheTesteOptico(id);
            
            if(detalheTesteOptico.status == 200) {
                setTesteOptico(detalheTesteOptico.data);
                const detalheMaterialRede = await DetalheMaterialRedeAny(idNetwin);

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
    if(user && Object.keys(user).length !== 0){
    ValidarToken(user);
    }
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user])

  useEffect(() => {
    FecthDetalheTesteOptico();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[loading]);

    const tipoCdoe = () => {
      const regex = /[A-Z]+-(\d+)/;
      
      if(cdo !== undefined && cdo !== null){
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
      let reteste = analises?.map(value => value.dataAnalise)
                     .filter((date, index, self) => self.indexOf(date) === index);

        if(analises !== undefined && reteste.length !== 0) {
          if(reteste.length > 1){
            return 'RE-TESTE';
          
            }else{
            return 'TESTADO';
          }
          
        }else{
          return 'TESTE PENDENTE';
          
        }
    }

    const handleVoltar = () => {
        navigate(-1); 
    };

    const handleImagens = () => {
        navigate(`/TesteOptico/Imagem/${uf}/${testeOptico?.siglaEstacao}/${cdo}`); 
    };

    const Observacao = () => {
      if (analiseObservacao !== null) {
          const _observacoes = analises?.filter((f) => f.id_Analise == idAnalise && f.analiseObservacao !== 'undefined').map((value, index) => (value.analiseObservacao.replace(';.','').split(';')));
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

    const AnaliseDetalhe = (e, id) => {
      setIdAnalise(id)
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

    const handleEdit = (e, id) => {
      setIdAnalise(id);
      setEvent(e);
      setVisible(true);
      setLoading(false);
    };
    
    const handleAdicionarCdoia = (e) => {
      setMensagem("");
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
      FetchEditarCdoia();
      setVisible(false);
      setLoading(false);
    }

    const handleExcluirCdoia = (e, id) => {
      setCurrentCdoia({idAnaliseCdoia: id});
      setEvent(e);
      setVisible(true);

    }

    const ConfirmarExluirCdoia = () => {
      FetchDeleteCdoia();
      setVisible(false);
      setLoading(false);

    }

    const handleExcluirCdo = (e, id) => {
      setIdAnalise(id)
      setEvent(e);
      setVisible(true);

    }

    const ConfirmarExluirCdo = () => {
      FetchDeleteCdo();
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
          FetchInsertValidar("APROVADO");
          setVisible(false);

        }else{
          FetchInsertValidar("REPROVADO");
          setVisible(false);

        }

      }else{
        if(name === 'aprovado') {
          FetchValidar("APROVADO");
          setVisible(false);

        }else{
          FetchValidar("REPROVADO");
          setVisible(false);

        }

      }
      setLoading(false);
    }

    const EditeObsAnalise = () => {
        if(status === 'APROVADO') {
          FetchValidar("APROVADO");
          setVisible(false);

        }else if(status === 'REPROVADO'){
          FetchValidar("REPROVADO");
          setVisible(false);

        }
      setLoading(false);
    }
    const ConfirmarAnaliseCdoia = () => {
      const dataAtual = new Date(_dataAtual).toLocaleDateString();
      const _cdoiaObj = analiseCDOIAs?.filter(p => p.cdoia === inputCdoia);
      
      if(cdoiaDay() === true && _cdoiaObj[0]?.cdoia === inputCdoia){
        setMensagem(`${cdo}.${inputCdoia} já possui registro com a data ${dataAtual}.`)
        setInputCdoia("1")

      }else{
        setMensagem("");
        FetchInsertValidarCdoia();
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
        <Header navbar={false} title={"Analise"} />
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
                                  )).filter((value) => value !== 'undefined')}
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
                    buttonConfirmar={EditeObsAnalise}
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
                        <th colSpan={3}>ANALISE : {uf} - {estacao} - {cdo}</th>
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
                            backgroundColor: '#F2D7D5',
                            color: '#7B241C',
                            borderTop: '1px solid #641E16',
                            borderBottom: '1px solid #641E16'
                        }} colSpan={3}> {status} </th>
                      </tr>
                    ) : (null)
                    }
                </thead>
                <tbody>
                        <tr>
                            <td style={{backgroundColor: '#34495E', color: '#ffffff'}}>{analiseState()}</td> 
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
                              <thead>
                                <tr>
                                <th colSpan={5}>HISTÓRICO ANÁLISE</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th style={{width: '25%'}}>ANALISTA</th>
                                  <th style={{width: '15%'}}>DATA ANALISE</th>
                                  <th style={{width: '15%'}}>STATUS</th>
                                  {userPrivate !== 1 ||  userPrivate === 3 ?
                                  <>
                                  <th style={day(dataAnalise) === true || cdoia() === true ? {width: '20%'} : testeOptico.sel === 1 ? {width: '50%'} : {width: '20%'}}>OBSERVAÇÃO</th>
                                  <th># AÇÕES #</th>                                
                                  </>
                                  : <th style={{width: '50%'}}>OBSERVAÇÃO</th>
                                  } 
                                </tr>
                              </thead>
                              <tbody>
                              {status !== undefined ?
                              <>
                              {
                              analises?.map((value, index) => (
                                <tr key={index} style={value.status === 'APROVADO' ? { backgroundColor: '#D5F5E3' } : { backgroundColor: '#F5B7B1' }}>
                                  <td>{value.analista}</td>
                                  <td>{new Date(value.dataAnalise).toLocaleDateString()}</td>
                                  <td>{value.status}</td>
                                  <td>
                                    <Button name="observacao" style={{ fontSize: '0.6rem', fontWeight: '700' }} onClick={(e) => AnaliseDetalhe(e, value.id_Analise)}>
                                      OBSERVAÇÕES
                                    </Button>
                                  </td>
                                  {userPrivate !== 1 ||  userPrivate === 3 && testeOptico.sel === 1 ?
                                  <td>
                                    <>
                                    { day(value.dataAnalise) === true ?
                                      <Button name="editar" style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }} onClick={(e) => handleEdit(e, value.id_Analise)}>
                                        Editar
                                      </Button>
                                      : null
                                    }
                                    { cdoia() === true ?
                                      <Button name="excluirCdo" onClick={(e) => handleExcluirCdo(e ,value.id_Analise)}>
                                        Excluir
                                      </Button>
                                      : null
                                    }
                                    </>
                                  </td>
                                  : null
                                  }
                                </tr>
                              ))}
                              </>
                              : <tr><td colSpan={5}>Nenhum resultado.</td></tr> 
                              }
                            </tbody>
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
                                  <th style={ userPrivate !== 1 ||  userPrivate === 3 ? {width: '15%'} : {width: '35%'}}>OBSERVAÇÃO</th>
                                  { userPrivate !== 1 ||  userPrivate === 3 ? 
                                  <th># AÇÕES #</th>
                                  : null
                                  }
                                </tr>
                              </thead>
                              <tbody>
                              {userPrivate !== 1 ||  userPrivate === 3 && analises !== undefined && analises.length !== 0 && testeOptico.sel === 1 ?
                                <tr>
                                  <td>
                                      <ButtonCdoia name="adicionarCdoia" onClick={handleAdicionarCdoia} >ADICIONAR</ButtonCdoia>      
                                  </td>
                                </tr>
                                :null
                                }
                                { analiseCDOIAs !== undefined && analiseCDOIAs.length !== 0 ?
                                <>
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
                                     {userPrivate !== 1 ||  userPrivate === 3 ? 
                                     <td>
                                      <>
                                        <Button name="editarCdoia" style={{marginLeft:'0.5rem', marginRight: '0.5rem'}} onClick={(e) => handleEditarCdoia(e, analise.id_AnaliseCDOIA, analise.cdoia, analise.cdoiaStatus, analise.cdoiaObservacao)} >Editar</Button>
                                        <Button name="excluirCdoia" onClick={(e) => handleExcluirCdoia(e, analise.id_AnaliseCDOIA)} >Excluir</Button>
                                      </>
                                    </td>
                                    :null
                                     } 
                                  </tr>
                                ))}
                                </>
                                : <tr><td colSpan={6}>Nenhum resultado</td></tr>
                              }
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
              { userPrivate !== 1 ||  userPrivate === 3 && testeOptico.sel == 1 ?
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
                  :null
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