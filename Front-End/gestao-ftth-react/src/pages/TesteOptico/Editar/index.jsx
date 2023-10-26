import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Input } from "./styles";
import { DetalheTesteOptico, updateTesteOptico } from "../../../api/testeOptico";
import { GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../../GlobalStyle";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Spinner from "../../../components/Spinner";
import DialogAlert from "../../../components/Dialog";


function Editar() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [testeOptico, setTesteOptico] = useState({});
    const [visible, setVisible] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [dialogAviso, setDialogAviso] = useState()

    async function fetchUpdateTesteOptico() {
        try {

            const testeOpticoData = {
                id_TesteOptico: id,
                ...testeOptico
            }
         
            const testeOpticoResponse = await updateTesteOptico(testeOpticoData);
    
            if (testeOpticoResponse.status == 200) {
                setDialogAviso(false);
                setMensagem(testeOpticoResponse.data)
                setVisible(true);
                
                const detalheTesteOptico = await DetalheTesteOptico(id);

                if(detalheTesteOptico.status == 200) {
                    setTesteOptico(detalheTesteOptico.data);

                }

            }

        } catch (error) {
            setDialogAviso(true);
            setMensagem(`Erro ao editar.`)
            setVisible(true);
            setLoading(true);

        } finally {
            setLoading(true);
        }
    }

    async function fecthDetalheTesteOptico(){
        try {
            const detalheTesteOptico = await DetalheTesteOptico(id);

            if(detalheTesteOptico.status <= 200) {
                setTesteOptico(detalheTesteOptico.data);

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
        fecthDetalheTesteOptico();

    },[]);

    const handleVoltar = () => {
        navigate(-1); 
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTesteOptico({ ...testeOptico, [name]: value });
    };

    const camposObrigatorios = ['uf', 'construtora', 'estacao', 'cdo',
                                'cabo', 'celula', 'totalUMs', 'dataTeste', 'dataRecebimento', 'tecnico'];

    const handleEdite = () => {
        const camposVazios = camposObrigatorios.filter(campo => !testeOptico[campo]);
        if (camposVazios.length > 0) {
            setDialogAviso(true);
            setMensagem(`Preencha os campos obrigatórios: ${camposVazios.join(', ')}`);
            setVisible(true);
        } else {
            fetchUpdateTesteOptico();
            setLoading(false);
        }
    }

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
                            <label>UF:</label>
                            <Input name="uf" onChange={handleInputChange} defaultValue={testeOptico.uf} style={{width: '230px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>CONSTRUTORA:</label>
                            <Input name="construtora" onChange={handleInputChange} defaultValue={testeOptico.construtora} style={{width: '230px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>ESTAÇÃO:</label>
                            <Input name="estacao" onChange={handleInputChange} defaultValue={testeOptico.estacao} style={{width: '230px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>TIPO OBRA:</label>
                            <Input name="tipoObra" onChange={handleInputChange} defaultValue={testeOptico.tipoObra} style={{width: '230px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>CDO:</label>
                            <Input name="cdo" onChange={handleInputChange} defaultValue={testeOptico.cdo} style={{width: '230px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>CAPACIDADE:</label>
                            <Input name="capacidade" onChange={handleInputChange} defaultValue={testeOptico.capacidade} style={{width: '230px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>CABO:</label>
                            <Input name="cabo" onChange={handleInputChange} defaultValue={testeOptico.cabo} style={{width: '145px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>CELULA:</label>
                            <Input name="celula" onChange={handleInputChange} defaultValue={testeOptico.celula} style={{width: '145px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>UMS:</label>
                            <Input name="totalUMs" onChange={handleInputChange} defaultValue={testeOptico.totalUMs} style={{width: '144px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>ENDEREÇO:</label>
                            <Input name="endereco" onChange={handleInputChange} defaultValue={testeOptico.endereco} style={{width: '490PX'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>ESTADO CAMPO:</label>
                            <Input name="estadoCampo" onChange={handleInputChange} defaultValue={testeOptico.estadoCampo} style={{width: '230px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>ESTADO PROJETO:</label>
                            <Input name="estadoProjeto" onChange={handleInputChange} defaultValue={testeOptico.estadoProjeto} style={{width: '230px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>ESTADO CONTROLE:</label>
                            <Input name="estadoControle" onChange={handleInputChange} defaultValue={testeOptico.estadoControle} style={{width: '230px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>DATA CONSTRUÇÃO:</label>
                            <Input name="dataConstrucao" onChange={handleInputChange} placeholder="__/__/____" defaultValue={testeOptico.dataConstrucao} style={{width: '230px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>DATA TESTE:</label>
                            <Input name="dataTeste" onChange={handleInputChange} placeholder="__/__/____" defaultValue={testeOptico.dataTeste} style={{width: '230px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>DATA RECEBIMENTO:</label>
                            <Input name="dataRecebimento" onChange={handleInputChange} placeholder="__/__/____" defaultValue={testeOptico.dataRecebimento} style={{width: '230px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>TÉCNICO:</label>
                            <Input name="tecnico" onChange={handleInputChange} defaultValue={testeOptico.tecnico} style={{width: '230px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>EQUIPE DE CONSTRUÇÃO:</label>
                            <Input name="equipeConstrucao" onChange={handleInputChange} defaultValue={testeOptico.equipeConstrucao} style={{width: '230px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>BOBINA LANÇAMENTO:</label>
                            <Input name="bobinaLancamento" onChange={handleInputChange} defaultValue={testeOptico.bobinaLancamento} style={{width: '145px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>BOBINA RECEPÇÃO:</label>
                            <Input name="bobinaRecepcao" onChange={handleInputChange} defaultValue={testeOptico.bobinaRecepcao} style={{width: '145px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>POSIÇÃO ICX / DGO:</label>
                            <Input name="posicaoIcxDgo" onChange={handleInputChange} defaultValue={testeOptico.posicaoIcxDgo} style={{width: '144px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>SPLITTER CEOS:</label>
                            <Input name="splitterCEOS" onChange={handleInputChange} defaultValue={testeOptico.splitterCEOS} style={{width: '230px'}} />
                        </div>
                        <div style={{display:'flex', margin: '0.5rem', flexDirection: 'column'}}>
                            <label>FIBRA DGO:</label>
                            <Input name="fibraDGO" onChange={handleInputChange} defaultValue={testeOptico.fibraDGO} style={{width: '230px'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{display:'flex', margin: '0.5rem' , flexDirection: 'column'}}>
                            <label>OBSERVAÇÃO:</label>
                            <textarea name="testeObservacao" onChange={handleInputChange} defaultValue={testeOptico.testeObservacao} style={{width: '490PX'}} />
                        </div>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '0.8rem'}}>
                        <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
                        <ButtonConfirma onClick={handleEdite}>Editar</ButtonConfirma>
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