import React, {useState, useEffect, useCallback} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Input } from "./styles";
import { DetalheTesteOptico, UpdateTesteOptico, DropTesteOptico } from "../../../api/testeOptico";
import { GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../../GlobalStyle";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Spinner from "../../../components/Spinner";
import DialogAlert from "../../../components/Dialog";
import DropBox from '../../../components/dropbox';
import { DateMask } from "../../../components/TextInput/mask/index";


function Editar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [testeOptico, setTesteOptico] = useState({});
    const [visible, setVisible] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [dialogAviso, setDialogAviso] = useState();
    const [dropConstrutora, setDropConstrutora] = useState([""]);
    const [construtora, setConstrutora] = useState("");
    const [dropUf, setDropUf] = useState([""]);
    const [uf, setUf] = useState("");
    const [dateInputRecebimento, setDateInputRecebimento] = useState('');
    const [dateInputTeste, setDateInputTeste] = useState('');
    const [dateInputConstrucao, setDateInputConstrucao] = useState('');
    const [submitClicked, setSubmitClicked] = useState(false);


    async function FetchDropFilter () {
    
        try {
          const dropList = await DropTesteOptico();
              
          if(dropList.status == 200) {
            const _dropListUf = dropList.data
            .map((value) => value.uf)
            .filter((value, index, self) => {
                return self.indexOf(value) === index;
            });
            setDropUf(_dropListUf);

            const _dropListConstrutora = dropList.data
            .map((value) => value.construtora)
            .filter((value, index, self) => {
                 return self.indexOf(value) === index;
            });
            setDropConstrutora(_dropListConstrutora);
        }
        
        } catch (error) {
          console.log("Erro ao carregar droplist" + error)
          
        } 

      }

    async function FetchUpdateTesteOptico() {
        try {

            const testeOpticoData = {
                id_TesteOptico: id,
                ...testeOptico
            }

            testeOpticoData.CHAVE = testeOpticoData.CHAVE == null ? null : `${uf}-${testeOptico.siglaEstacao.replace(/\s/g,"")}${testeOptico.cdo}`;
            testeOpticoData.uf = uf;
            testeOpticoData.construtora = construtora;
            testeOpticoData.dataConstrucao = formatarDateJson(dateInputConstrucao);
            testeOpticoData.dataRecebimento = formatarDateJson(dateInputRecebimento);
            testeOpticoData.dataTeste = formatarDateJson(dateInputTeste);
         
            const testeOpticoResponse = await UpdateTesteOptico(testeOpticoData);
    
            if (testeOpticoResponse.status == 200) {
                setDialogAviso(false);
                setMensagem(testeOpticoResponse.data)
                setVisible(true);
                
            }

        } catch (error) {
            setDialogAviso(true);
            setMensagem(`Erro ao editar.`)
            setVisible(true);

        } finally {
            setLoading(false);
            setSubmitClicked(true);
            
        }
    }

    const fecthDetalheTesteOptico = useCallback(async () => {

        try {
            const detalheTesteOptico = await DetalheTesteOptico(id);

            if(detalheTesteOptico.status == 200) {
                setTesteOptico(detalheTesteOptico.data);
                setUf(detalheTesteOptico.data.uf);
                setConstrutora(detalheTesteOptico.data.construtora);
                setDateInputConstrucao(detalheTesteOptico.data.dataConstrucao != '' ? new Date(detalheTesteOptico.data.dataConstrucao).toLocaleDateString() : '');
                setDateInputTeste(detalheTesteOptico.data.dataTeste != '' ? new Date(detalheTesteOptico.data.dataTeste).toLocaleDateString(): '');
                setDateInputRecebimento(detalheTesteOptico.data.dataRecebimento != '' ? new Date(detalheTesteOptico.data.dataRecebimento).toLocaleDateString() : '');

            }

        } catch (error) {
            setDialogAviso(true);
            setMensagem(`Não foi possível carregar.`)
            setVisible(true);
            setLoading(true);
            
        } finally {
            setLoading(true);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitClicked]);

    useEffect(() => {
        FetchDropFilter();
    
    },[]);

    useEffect(() => {
        fecthDetalheTesteOptico();
        setLoading(false);
        setSubmitClicked(false);

    },[fecthDetalheTesteOptico]);

    const handleVoltar = () => {
        navigate(-1); 
    };

    const formatarDateJson = (date) => {
        const parts = date.split('/');
        return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTesteOptico({ ...testeOptico, [name]: value });
    };

    const camposObrigatorios = ['cdo', 'cabo', 'celula', 'totalUMs', 'dataTeste', 'dataRecebimento', 'tecnico'];

    const handleEdite = () => {
        const camposVazios = camposObrigatorios.filter(campo => !testeOptico[campo]);
        if (camposVazios.length > 0 || uf == '' || construtora == '') {
            setDialogAviso(true);
            setMensagem(`Preencha os campos obrigatórios: ${camposVazios.join(', ')}`);
            setVisible(true);
        } else {
            FetchUpdateTesteOptico();
        }
    }

    const handleDataTeste = (event) => {
        const input = DateMask(event);
        setDateInputTeste(input);
      }
      const handleDataContrucao = (event) => {
        const input = DateMask(event);
        setDateInputConstrucao(input);
      }
      const handleDataRecebimento = (event) => {
        const input = DateMask(event);
        setDateInputRecebimento(input);
      }

    const handleUf = (event) => {
        const input = event.target.value;
        setUf(input);
      };
    
      const handleConstrutora = (event) => {
        const input = event.target.value;
        setConstrutora(input);
      };
    
    GlobalStyle();

    return (
      <>
        <Template>
          <Header title={"Teste Óptico - Editar"} />
            <Container>
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
                    header={<h4>Aviso</h4>}
                    colorType={'#13293d'}
                    ConfirmaButton={false}
                    textCloseButton={'OK'}
                    text={
                        <>
                        <p>{mensagem}</p>
                        </>
                    }
                    />
                )
                }
                { loading ? (
                <div className="formulario">
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <DropBox width={"240px"} height={"24px"} valueDefaut={testeOptico.uf} label={"UF"} event={handleUf} lista={dropUf} text={uf} /> 
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <DropBox width={"240px"} height={"24px"} valueDefaut={testeOptico.construtora} label={"CONSTRUTORA:"} event={handleConstrutora} lista={dropConstrutora} text={construtora} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>ESTAÇÃO:</label>
                            <div>
                            <Input name="siglaEstacao" onChange={handleInputChange} defaultValue={testeOptico.siglaEstacao} style={{width: '50px', marginRight: '0.2rem'}} /> 
                            <Input name="estacao" onChange={handleInputChange} defaultValue={testeOptico.estacao} style={{width: '240px'}} />
                            </div>
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>TIPO OBRA:</label>
                            <div>
                            <Input name="tipoObra" onChange={handleInputChange} defaultValue={testeOptico.tipoObra} style={{width: '187px'}} />
                            </div>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>CDO:</label>
                            <Input name="cdo" onChange={handleInputChange} defaultValue={testeOptico.cdo} style={{width: '240px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>CAPACIDADE:</label>
                            <Input name="capacidade" onChange={handleInputChange} defaultValue={testeOptico.capacidade} style={{width: '240px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>CABO:</label>
                            <Input name="cabo" onChange={handleInputChange} defaultValue={testeOptico.cabo} style={{width: '155px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>CELULA:</label>
                            <Input name="celula" onChange={handleInputChange} defaultValue={testeOptico.celula} style={{width: '155px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>UMS:</label>
                            <Input name="totalUMs" onChange={handleInputChange} defaultValue={testeOptico.totalUMs} style={{width: '154px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>ENDEREÇO:</label>
                            <Input name="endereco" onChange={handleInputChange} defaultValue={testeOptico.endereco} style={{width: '497PX'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>ESTADO CAMPO:</label>
                            <Input name="estadoCampo" onChange={handleInputChange} defaultValue={testeOptico.estadoCampo} style={{width: '240px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>ESTADO PROJETO:</label>
                            <Input name="estadoProjeto" onChange={handleInputChange} defaultValue={testeOptico.estadoProjeto} style={{width: '240px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>ESTADO CONTROLE:</label>
                            <Input name="estadoControle" onChange={handleInputChange} defaultValue={testeOptico.estadoControle} style={{width: '240px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>DATA CONSTRUÇÃO:</label>
                            <Input name="dataConstrucao" onChange={handleDataContrucao} placeholder="__/__/____" value={dateInputConstrucao} style={{width: '240px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>DATA TESTE:</label>
                            <Input name="dataTeste" onChange={handleDataTeste} placeholder="__/__/____" value={dateInputTeste} style={{width: '240px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>DATA RECEBIMENTO:</label>
                            <Input name="dataRecebimento" onChange={handleDataRecebimento} placeholder="__/__/____" value={dateInputRecebimento} style={{width: '240px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>TÉCNICO:</label>
                            <Input name="tecnico" onChange={handleInputChange} defaultValue={testeOptico.tecnico} style={{width: '240px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>EQUIPE DE CONSTRUÇÃO:</label>
                            <Input name="equipeConstrucao" onChange={handleInputChange} defaultValue={testeOptico.equipeConstrucao} style={{width: '240px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>BOBINA LANÇAMENTO:</label>
                            <Input name="bobinaLancamento" onChange={handleInputChange} defaultValue={testeOptico.bobinaLancamento} style={{width: '155px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>BOBINA RECEPÇÃO:</label>
                            <Input name="bobinaRecepcao" onChange={handleInputChange} defaultValue={testeOptico.bobinaRecepcao} style={{width: '155px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>POSIÇÃO ICX / DGO:</label>
                            <Input name="posicaoIcxDgo" onChange={handleInputChange} defaultValue={testeOptico.posicaoIcxDgo} style={{width: '154px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>SPLITTER CEOS:</label>
                            <Input name="splitterCEOS" onChange={handleInputChange} defaultValue={testeOptico.splitterCEOS} style={{width: '240px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>FIBRA DGO:</label>
                            <Input name="fibraDGO" onChange={handleInputChange} defaultValue={testeOptico.fibraDGO} style={{width: '240px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>OBSERVAÇÃO:</label>
                            <textarea name="testeObservacao" onChange={handleInputChange} defaultValue={testeOptico.testeObservacao} style={{width: '498px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '0.8rem'}}>
                        <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
                        { dropConstrutora.length > 0 && loading ?
                        <ButtonConfirma onClick={handleEdite}>Editar</ButtonConfirma> 
                        :
                        <ButtonConfirma disabled>Carregando...</ButtonConfirma>
                        }
                    </div>
                </div>
                ):(<Spinner />)
                }
              </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default Editar;