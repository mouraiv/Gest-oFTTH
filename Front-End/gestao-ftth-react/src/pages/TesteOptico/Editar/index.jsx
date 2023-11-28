import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Input } from "./styles";
import { DetalheTesteOptico, updateTesteOptico, DropTesteOptico } from "../../../api/testeOptico";
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
    const [dropConstrutora, setDropConstrutora] = useState([]);
    const [construtora, setConstrutora] = useState("");
    const [dropEstacao, setDropEstacao] = useState([]);
    const [estacao, setEstacao] = useState("");
    const [dropUf, setDropUf] = useState([]);
    const [uf, setUf] = useState("");
    const [dateInputRecebimento, setDateInputRecebimento] = useState('');
    const [dateInputTeste, setDateInputTeste] = useState('');
    const [dateInputConstrucao, setDateInputConstrucao] = useState('');

    async function fetchDropFilter () {
    
        try {
          const uf = await DropTesteOptico("UF");
    
          if(uf.status == 200) {
            setDropUf(uf.data);
    
            const construtora = await DropTesteOptico("Construtora");
    
            if(construtora.status == 200) {
              setDropConstrutora(construtora.data);
            }
    
            const estacao = await DropTesteOptico("Estacao");
    
            if(estacao.status == 200) {
              setDropEstacao(estacao.data);
            }
          }
          
        } catch (error) {
          console.log("Erro ao carregar droplist" + error)
          
        } 
      }

    async function fetchUpdateTesteOptico() {
        try {

            const testeOpticoData = {
                id_TesteOptico: id,
                ...testeOptico
            }

            testeOpticoData.CHAVE = `${uf}-${estacao.replace(/\s/g,"")}${testeOptico.cdo}`;
            testeOpticoData.uf = uf;
            testeOpticoData.construtora = construtora;
            testeOpticoData.estacao = estacao;
            testeOpticoData.dataConstrucao = formatarDateJson(dateInputConstrucao);
            testeOpticoData.dataRecebimento = formatarDateJson(dateInputRecebimento);
            testeOpticoData.dataTeste = formatarDateJson(dateInputTeste);

            console.log(testeOpticoData)
         
            const testeOpticoResponse = await updateTesteOptico(testeOpticoData);
    
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
        }
    }

    async function fecthDetalheTesteOptico(){
        try {
            const detalheTesteOptico = await DetalheTesteOptico(id);

            if(detalheTesteOptico.status <= 200) {
                setTesteOptico(detalheTesteOptico.data);
                setUf(detalheTesteOptico.data.uf);
                setConstrutora(detalheTesteOptico.data.construtora);
                setEstacao(detalheTesteOptico.data.estacao)

            }

        } catch (error) {
            setDialogAviso(true);
            setMensagem(`Não foi possível carregar.`)
            setVisible(true);
            setLoading(true);
            
        } finally {
            setLoading(true);
        }
    }

    useEffect(() => {
        fetchDropFilter();
        
    },[]);

    useEffect(() => {
        fecthDetalheTesteOptico();
        setDateInputConstrucao(testeOptico?.dataConstrucao != '' ? new Date(testeOptico?.dataConstrucao).toLocaleDateString() : '');
        setDateInputTeste(testeOptico?.dataTeste != '' ? new Date(testeOptico?.dataTeste).toLocaleDateString(): '');
        setDateInputRecebimento(testeOptico?.dataRecebimento != '' ? new Date(testeOptico?.dataRecebimento).toLocaleDateString() : '');
        
    },[loading]);

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

    const camposObrigatorios = ['cdo',
                                'cabo', 'celula', 'totalUMs', 'dataTeste', 'dataRecebimento', 'tecnico'];

    const handleEdite = () => {
        const camposVazios = camposObrigatorios.filter(campo => !testeOptico[campo]);
        if (camposVazios.length > 0 || uf == '' || construtora == '' || estacao == '') {
            setDialogAviso(true);
            setMensagem(`Preencha os campos obrigatórios: ${camposVazios.join(', ')}`);
            setVisible(true);
        } else {
            fetchUpdateTesteOptico();
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
    
      const handleEstacao = (event) => {
        const input = event.target.value;
        setEstacao(input);
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
                            <DropBox width={"240px"} height={"24px"} valueDefaut={testeOptico.estacao} label={"ESTAÇÃO:"} event={handleEstacao} lista={dropEstacao} text={estacao} /> 
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>TIPO OBRA:</label>
                            <Input name="tipoObra" onChange={handleInputChange} defaultValue={testeOptico.tipoObra} style={{width: '240px'}} />
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
                        { dropEstacao.length > 0 ?
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