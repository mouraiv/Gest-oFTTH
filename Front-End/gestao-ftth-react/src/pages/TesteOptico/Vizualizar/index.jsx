import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/images/marker-icon-2x.png';
import { Tab, Tabs, Toast } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { ButtonCancelar, ButtonConfirma, Content, GlobalStyle, Template } from "../../../GlobalStyle";
import { DetahleMaterialRedeAny } from "../../../api/materialRede";
import { DetalheTesteOptico, updateTesteOptico } from "../../../api/testeOptico";
import { createValidacao } from '../../../api/validacao';
import DialogAlert from "../../../components/Dialog";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';
import { useAuth } from "../../../contexts/auth";
import { FaLocationDot } from 'react-icons/fa6';
import { ButtonImagem, ButtonReValidar, ButtonValidar, ContentTabs, FooterButton, TableGrid } from "./style";

function Vizualizar(){
    const { id, idNetwin, survey } = useParams();
    const [loading, setLoading] = useState(false);
    const [totalUms, setTotalUms] = useState({
        totalUms: 0,
        totalUmsGanho: 0
    });
    const [loadingMaterial, setLoadingMaterial] = useState(false);
    const [uf, setUf] = useState();
    const [dataAtual, setDataAtual] = useState(new Date());
    const [estacao, setEstacao] = useState();
    const [siglaEstacao, setSiglaEstacao] = useState();
    const [cdo, setCdo] = useState();
    const [testeOptico, setTesteOptico] = useState({});
    const [materialRede, setMaterialRede] = useState({});
    const [visible, setVisible] = useState(false);
    const [visibleTesteOptico, setVisibleTesteOptico] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [mapDialogVisible, setMapDialogVisible] = useState(false);
    const [positionMap, setPositionMap] = useState()
    const [valueEndereco, setValueEndereco] = useState()

    const navigate = useNavigate();
    const { user } = useAuth();

    const { analises } = testeOptico;
    const { ligacao, enderecoTotal } = materialRede ?? {};

    async function fetchValidar(sel) {
        try {

            const _dataAtual = dataAtual.toISOString();

            const testeOpticoData = {
                id_TesteOptico: id,
                ...testeOptico
            }

            testeOpticoData.sel = sel;
            testeOpticoData.aceitacaoData = sel == 0 ? _dataAtual : null;

            const validacao = {
                DataValidacao: _dataAtual,
                Tecnico: user.nome,
                Id_TesteOptico: id,
                Status: sel == 0 ? "VALIDADO" : "NÃO VALIDADO"
            }

    
            const testeOpticoResponse = await updateTesteOptico(testeOpticoData);
    
            if (testeOpticoResponse.status === 200) {
                await createValidacao(validacao);
            }

        } catch (error) {
            setMensagem(`Erro ao validar.`);
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
                setSiglaEstacao(detalheTesteOptico.data.siglaEstacao);
                setEstacao(detalheTesteOptico.data.estacao);
                setUf(detalheTesteOptico.data.uf);
            }

        } catch (error) {
            setMensagem(`Erro ao carregar.`)
            setVisible(true);
            setLoading(true);
            
        } finally {
            setLoading(true);
        }
    }

    async function fecthDetalheMaterialRede(){
        try {
            const detalheMaterialRede = await DetahleMaterialRedeAny(idNetwin);

            if(detalheMaterialRede.status == 200) {
                setMaterialRede(detalheMaterialRede.data);
                setPositionMap([parseFloat(detalheMaterialRede.data.latitude_Mt.replace(",", ".")), parseFloat(detalheMaterialRede.data.longitude_Mt.replace(",", "."))]);

                const somaUMS = detalheMaterialRede.data.enderecoTotal?.reduce((acc, value) => acc + (value.quantidadeUMS || 0), 0);
                const somaUMS_gannhoDia = detalheMaterialRede.data.enderecoTotal?.reduce((acc, value) => acc + (value.quantidadeUMS_ganhoDia || 0), 0);
                setTotalUms({
                    totalUms: somaUMS,
                    totalUmsGanho: somaUMS_gannhoDia
                });
            }

        } catch (error) {
            setLoadingMaterial(true);
            
        } finally {
            setLoadingMaterial(true);
        }
    }

    useEffect(() => {
        fecthDetalheMaterialRede();
       
    }, []);

    useEffect(() => {
        fecthDetalheTesteOptico();
    
    },[loading])

    const statusAnalise = () => {
        const statusAnalise = analises?.analiseObservacao;
        const count = statusAnalise != null ? statusAnalise.split(';').length : 0;

        if(analises != undefined) {
            if(count > 1){
                return 'RE-TESTE';

            }else{
                return 'TESTADO';
            }

        }else{
            return 'TESTE';

        }

    }

    const countTeste = () => {
        const statusAnalise = analises?.analiseObservacao;
        const count = statusAnalise != null ? statusAnalise.split(';').length : 0;

        if(analises != undefined) {
            if(count > 1){
                return statusAnalise.split(';').length;

            }else{
                return 1;
            }

        }else{
            return 0;

        }

    }

    const handleOpenMapDialog = () => {
        setMapDialogVisible(true);
    };
    
    const handleVoltar = () => {
        navigate(-1); 
    };

    const handleImagens = () => {
        navigate(`/TesteOptico/Imagem/${uf}/${siglaEstacao}/${estacao}/${cdo}`); 
    };

    const handleValidar = async() => {
        await fetchValidar(0);
        setLoading(false);
    }

    const handleRevalidar = async() => {
        await fetchValidar(1);
        setLoading(false);
    }

    const handleAnalise = () => {
        navigate(`/Analise/${id}/${idNetwin}`); 
    };

    const filterEnderecoTotalObj = (survey) => {
        const _enderecoTotal = enderecoTotal;
        const filter = _enderecoTotal?.filter(p => p.cod_Survey === survey).map((value, index) => {
            return value;
        })
        setValueEndereco(filter[0]);
    }

    console.log(enderecoTotal)

    const handleTesteOpticoDetalhe = (event) => {
        const survey = event.currentTarget.id;
        filterEnderecoTotalObj(survey);
        setVisibleTesteOptico(true);
    };

    GlobalStyle();
    return(
        <>
        { id !== 'undefined' ? (
        <>
        <Template>
        <Header title={"Teste Óptico - Visualizar"} />
        <Content>
        <DialogAlert
            visibleDiag={mapDialogVisible}
            visibleHide={() => setMapDialogVisible(false)}
            header={
                    <>
                        <h4>Mapa Geográfico </h4> 
                        <br /> 
                        <p>{materialRede?.endereco_Mt}</p>
                    </>
                    }
            ConfirmaButton={false}
            textCloseButton={'Fechar'}
            text={
                    <MapContainer center={positionMap} zoom={17} style={{ width: '800px', height: '400px' }}>
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={positionMap}>
                        <Popup>
                            <div>
                                <div style={{textAlign: 'center'}}><b>{materialRede?.codigo_Mt}</b></div>
                                <div><p><i>{materialRede?.endereco_Mt}</i></p></div>
                            </div>
                        </Popup>
                        </Marker>
                    </MapContainer>
            }
        />
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
        <DialogAlert 
                    visibleDiag={visibleTesteOptico} 
                    visibleHide={() => setVisibleTesteOptico(false)}
                    colorType={'#13293d'}
                    ConfirmaButton={false}
                    textCloseButton={'Fechar'}
                    text={
                        <>
                        <TableGrid style={{width: '600px', fontSize: '0.7rem', marginTop: '0.5rem', marginBottom: '0.8rem'}}>
                              <thead>
                                <tr>
                                <th colSpan={6}>DETALHE ENDEREÇOS TOTAIS</th>
                                </tr>
                              </thead>
                              {valueEndereco != undefined ? ( 
                                        <tbody>
                                        <>     
                                        <tr>   
                                        <th colSpan={2} style={valueEndereco.id_StatusGanho == 1 ? {
                                            backgroundColor: '#D4EFDF',
                                            color: '#145A32',
                                            border: '1px solid #145A32'
                                        } : {
                                            backgroundColor: '#E6B0AA',
                                            color: '#641E16',
                                            border: '1px solid #641E16'
                                        }}> {valueEndereco.statusGanho} </th>
                                        </tr>
                                        <tr>
                                            <td>{valueEndereco.uf ?? '-------'}</td>
                                            <td>Município: {valueEndereco.municipio ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Localidade: {valueEndereco.localidade ?? '-------'}</td>
                                            <td>Sigla localidade: {valueEndereco.localidadeAbrev ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Cod. SURVEY: {valueEndereco.cod_Survey ?? '-------'}</td>
                                            <td>Sigla estação: {valueEndereco.siglaEstacao ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} style={{margin:0, padding:0}}>
                                                <table>
                                            
                                                    <tr>
                                                    <td>Cod. localidade: {valueEndereco.cod_Localidade ?? '-------'}</td>
                                                    <td>Cod. logradouro: {valueEndereco.cod_Logradouro ?? '-------'}</td>
                                                    <td>Id celula: {valueEndereco.id_Celula ?? '-------'}</td>
                                                    </tr>
                                                 
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Tipo rede: {valueEndereco.tipoRede ?? '-------'}</td>
                                            <td>Celula: {valueEndereco.celula ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>Nome CDO: {valueEndereco.nomeCdo ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Cod viabilidade: {valueEndereco.cod_Viabilidade ?? '-------'}</td>
                                            <td>Tipo viabilidade: {valueEndereco.tipoViabilidade ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>Logradouro: {valueEndereco.logradouro ?? '-------'}, {valueEndereco.numeroFachada ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} style={{margin:0, padding:0}}>
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                    <td>Complemento: {valueEndereco.complemento ?? '-------'}</td>
                                                    <td>Complemento II: {valueEndereco.complementoDois ?? '-------'}</td>
                                                    <td>Complemento III: {valueEndereco.complementoTres ?? '-------'}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Id endereco: {valueEndereco.id_Endereco ?? '-------'}</td>
                                            <td>Numero Piso: {valueEndereco.numeroPiso ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>CEP: {valueEndereco.cep ?? '-------'}</td>
                                            <td>Bairro: {valueEndereco.bairro ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>quantidadeUMS: {valueEndereco.quantidadeUMS ?? '-------'}</td>
                                            <td>Disponibilidade comercial: {valueEndereco.disp_Comercial ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>UCS Residenciais: {valueEndereco.ucS_Residenciais ?? '-------'}</td>
                                            <td>UCS Comerciais: {valueEndereco.ucS_Comerciais ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>UMS Certificadas: {valueEndereco.umS_Certificadas ?? '-------'}</td>
                                            <td>Rede Edificio Certificado: {valueEndereco.redeEdificio_Certificados ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Quantidade HCS: {valueEndereco.quantidade_HCS ?? '-------'}</td>
                                            <td>Projeto: {valueEndereco.projeto ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Latitude: {valueEndereco.latitude ?? '-------'}</td>
                                            <td>Longitude: {valueEndereco.longitude ?? '-------'}</td>
                                        </tr>
                                        </>
                                        </tbody>) : (null)}
                            </TableGrid>
                        </>
                    }
                />        
        { loading ? (
            <ContentTabs>
            <Tabs
            defaultActiveKey="TesteOptico"
            id="uncontrolled-tab-example"
            >
            <Tab eventKey="TesteOptico" title="Teste Optico">        
            <TableGrid>
                <thead>
                    <tr>
                        <th colSpan={3}>-- TESTE ÓPTICO - {testeOptico.chave} --</th>
                    </tr>
                    <tr>
                    <th style={{ backgroundColor:'#2C3E50', border: '1px solid #13293d' }}>{statusAnalise()}</th>    
                    <th style={testeOptico.sel == 0 ? {
                        backgroundColor: '#D4EFDF',
                        color: '#145A32',
                        border: '1px solid #145A32'
                    } : {
                        backgroundColor: '#E6B0AA',
                        color: '#641E16',
                        border: '1px solid #641E16'
                    }}> {testeOptico.sel == 0 ? `VALIDADO${analises?.status != null ? ` - ${analises.status}` : ''}` : `NÃO VALIDADO${analises?.status != null ? ` - ${analises.status}` : ''}`} </th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td>{testeOptico.uf ?? '-------'}</td>
                            <td>{testeOptico.construtora ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Estação: {testeOptico.estacao ?? '-------'}</td>
                            <td>Tipo Obra: {testeOptico.tipoObra ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Estado Campo: {testeOptico.estadoCampo ?? '-------'}</td>
                            <td>Data Teste: {testeOptico.dataTeste != null ? new Date(testeOptico.dataTeste).toLocaleDateString() : '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>{testeOptico.cdo ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Cabo: {testeOptico.cabo ?? '-------'}</td>
                            <td>Celula: {testeOptico.celula ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Capacinade: {testeOptico.capacidade ?? '-------'}</td>
                            <td>Técnico: {testeOptico.tecnico ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Total UMs: {testeOptico.totalUMs ?? '-------'}</td>
                            <td>Equipe Construção: {testeOptico.equipeConstrucao ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Data Construção: {testeOptico.dataConstrucao != null ? new Date(testeOptico.dataConstrucao).toLocaleDateString() : '-------'}</td>
                            <td>Data Recebimento: {testeOptico.dataRecebimento != null ? new Date(testeOptico.dataRecebimento).toLocaleDateString() : '-------'}</td>
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
                            <td>Quantidade Teste: {countTeste()}</td>
                            <td>Fibra DGO: {testeOptico.fibraDGO ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Observação: {testeOptico.testeObservacao ?? '-------'}</td>
                        </tr>
                </tbody>
            </TableGrid>
            <FooterButton>
                <div style={{width: '100%'}}>
                    <>
                    {testeOptico.sel == 1 ? (
                        <ButtonValidar onClick={handleValidar}>Validar</ButtonValidar>
                        ) : (
                        <ButtonReValidar onClick={handleRevalidar}>Re-Validar</ButtonReValidar>
                    )}
                    { loadingMaterial ?
                    <ButtonImagem onClick={handleImagens}>Imagens</ButtonImagem> 
                    :
                    <ButtonImagem disabled>Carregando...</ButtonImagem>
                    }
                    </>
                </div>
                    <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
                    <ButtonConfirma onClick={handleAnalise}>Analisar</ButtonConfirma>
            </FooterButton>
            </Tab>
            <Tab eventKey="MaterialRede" title="Netwin">
            {loadingMaterial ? (
            <TableGrid>
                <thead>
                    <tr>
                        <th colSpan={3}>-- MATERIAIS DE REDE - {materialRede.chave} --</th>
                    </tr>
                </thead>
                <tbody>
                    {materialRede.id_MaterialRede !== undefined ? (
                        <>
                        {enderecoTotal?.[0] !== undefined &&
                        <tr>   
                        <th colSpan={2} style={enderecoTotal?.[0]?.id_StatusGanho == 1 ? {
                            backgroundColor: '#D4EFDF',
                            color: '#145A32',
                            border: '1px solid #145A32'
                        } : {
                            backgroundColor: '#E6B0AA',
                            color: '#641E16',
                            border: '1px solid #641E16'
                        }}> {enderecoTotal?.[0]?.statusGanho} </th>
                        </tr>
                        }
                        <tr>
                            <td>{materialRede.siglaFederativa_Mt ?? '-------'}</td>
                            <td>{materialRede.nomeFederativa_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Sigla Localidade: {materialRede.siglaLocalidade_Mt ?? '-------'}</td>
                            <td>Nome Localidade: {materialRede.nomeLocalidade_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Municipio: {materialRede.municipio_Mt ?? '-------'}</td>
                            <td>Nome Abastecedora: {materialRede.nomeAbastecedora_Mt ?? '-------'}</td>
                        </tr>
                        <tr>          
                            <td>Sigla Abastecedora: {materialRede.siglaAbastecedora_Mt ?? '-------'}</td>
                            <td>Codigo SAP: {materialRede.codigoSap_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>{materialRede.codigo_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Elemento Rede: {materialRede.elementoRede_Mt ?? '-------'}</td>
                            <td>Tipo Rede: {materialRede.tipo_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Fabricante: {materialRede.fabricante_Mt ?? '-------'}</td>
                            <td>Modelo: {materialRede.modelo_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}style={{margin:0, padding:0}}>
                                <table>
                                    <tbody>
                                    <tr>
                                    <td style={{width:'90%', border:0}} >Endereço: {materialRede.endereco_Mt ?? '-------'}</td>
                                    <td className="mapsTd" onClick={() => handleOpenMapDialog()}><FaLocationDot style={{fontSize:"1.7em", color:"red", fill:"red"}} /></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>Infraestrutura: {materialRede.infraestruturaRede_Mt ?? '-------'}</td>
                            <td>Grupo Operacional: {materialRede.grupoOperacional_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Data Estado Operacional: {materialRede?.dataEstadoOperacional_Mt != '' ? new Date(materialRede?.dataEstadoOperacional_Mt).toLocaleDateString() : '-------'}</td>
                            <td>Estado Operacional: {materialRede.estadoOperacional_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Data Estado Controle: {materialRede?.dataEstadoControle_Mt != '' ? new Date(materialRede?.dataEstadoControle_Mt).toLocaleDateString() : '-------'}</td>
                            <td>Estado Controle: {materialRede.estadoControle_Mt ?? '-------'}</td>
                        </tr>
                        </>
                        ) : (<tr><td colSpan={2} style={{fontSize:'0.7rem'}}>Nenhum resultado</td></tr>)
                        }
                        <tr>
                          <td colSpan={2} style={{padding: '0'}}>
                            <table className="tableEnderecoTotal">
                              <thead>
                                <tr>
                                <th colSpan={6}>ENDEREÇOS TOTAIS</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th style={{width: '15%'}}>CELULA</th>
                                  <th style={{width: '10%'}}>SURVEY</th>
                                  <th style={{width: '5%'}}>UMS</th>
                                  <th style={{width: '8%'}}>COD. VIAB</th>
                                  <th style={{width: '25%'}}>TIPO VIAB</th>
                                  <th style={{width: '10%'}}>DISP. COMERCIAL</th>
                                </tr>
                              </thead>
                              <tbody>
                                {enderecoTotal != undefined ? (
                                    enderecoTotal.map((valueEndereco, index) => (
                                    <tr key={index} id={valueEndereco.cod_Survey} onClick={handleTesteOpticoDetalhe} className="enderecoTr">
                                    <td>{valueEndereco.celula ?? "--"}</td>
                                    <td>{valueEndereco.cod_Survey ?? "--"}</td>
                                    <td>{valueEndereco.quantidadeUMS ?? "--"}</td>
                                    <td>{valueEndereco.cod_Viabilidade ?? "--"}</td>
                                    <td>{valueEndereco.tipoViabilidade ?? "--"}</td>
                                    <td>{valueEndereco.disp_Comercial ?? "--"}</td> 
                                  </tr>
                                ))):(<tr><td colSpan={6} style={{fontSize:'0.7rem', cursor: 'default', width: '800px'}}>Nenhum resultado.</td></tr>)}
                                {enderecoTotal?.[0] !== undefined &&
                                <tr>
                                    <th style={{backgroundColor: '#34495E',fontSize:'0.6rem', border:'1px solid #13293d', padding:0}} colSpan={6}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td style={{border:0}}></td>
                                                    <td style={{border:0}}></td>
                                                    <td style={{border:0}}>Total UMS : {`${totalUms.totalUms}`} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </th>
                                </tr>
                                }
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                            <th style={{backgroundColor: '#13293d'}} colSpan={2}>LIGAÇÕES</th>
                        </tr>
                        {ligacao != undefined ? (
                            <>
                        <tr>
                            <td>Cabo Primário: {ligacao.caboPrimario_ls ?? '-------'}</td>
                            <td>Cabo Secundário: {ligacao.caboSecundario_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Nome OLT: {ligacao.nomeOlt_ls ?? '-------'}</td>
                            <td>Porta OLT: {ligacao.portaOlt_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>ICX: {ligacao.icX_ls ?? '-------'}</td>
                            <td>BSP: {ligacao.bsP_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>DGO: {ligacao.dgO_ls ?? '-------'}</td>
                            <td>Fibra DGO: {ligacao.fibraDgo_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Cabo DGO: {ligacao.caboDgo_ls ?? '-------'}</td>
                            <td>SplitterCEOS: {ligacao.splitterCEOS_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Out SplitterCEOS: {ligacao.outSplitterCEOS_ls ?? '-------'}</td>
                            <td>Cabo CDO: {ligacao.caboCdo_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Fibra CDO: {ligacao.fibraCdo_ls ?? '-------'}</td>
                            <td>Porta CDO: {ligacao.portaCdo_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Splitter CDO: {ligacao.splitteR_CDO_ls ?? '-------'}</td>
                            <td>CDO: {ligacao.cdO_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{margin:0, padding:0}}>
                                <table>
                                    <tbody>
                                    <tr>
                                    <td>Etiqueta Padrão: {ligacao.etiquetaPadrao_ls ?? '-------'}</td>
                                    <td>Fora Do Padrão: {ligacao.foraPadrao_ls ?? '-------'}</td>
                                    <td>Projeto: {ligacao.projeto_ls ?? '-------'}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>Etiqueta Campo: {ligacao.etiquetaCampo_ls ?? '-------'}</td>
                            <td>Identificação Terceiro: {ligacao.identificacaoTerceiro_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Etiqueta Terceiros: {ligacao.etiquetaTerceiro_ls ?? '-------'}</td>
                            <td>Rede: {ligacao.rede_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Destinação: {ligacao.destinacao_ls ?? '-------'}</td>
                            <td>Estado Ciclo Vida: {ligacao.estadoCicloVida_ls ?? '-------'}</td>
                        </tr>
                        </>
                        ) : (<tr><td colSpan={2} style={{fontSize:'0.7rem'}}>Nenhum resultado.</td></tr>)
                        }
                    </tbody>
            </TableGrid>
            ):(<Spinner />)}
            </Tab>
            </Tabs>
            </ContentTabs>
            ):(<Spinner />)
        }
        </Content>
            <Footer />
        </Template>
        </>
    ):(
        <>
        <Template>
        <Header title={"Netwin - Visualização"} />
        <Content>
        <DialogAlert
            visibleDiag={mapDialogVisible}
            visibleHide={() => setMapDialogVisible(false)}
            header={
                    <>
                        <h4>Mapa Geográfico </h4> 
                        <br /> 
                        <p>{materialRede?.endereco_Mt}</p>
                    </>
                    }
            ConfirmaButton={false}
            textCloseButton={'Fechar'}
            text={
                    <MapContainer center={positionMap} zoom={17} style={{ width: '800px', height: '400px' }}>
                        <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={positionMap}>
                        <Popup>
                            <div>
                                <div style={{textAlign: 'center'}}><b>{materialRede?.codigo_Mt}</b></div>
                                <div><p><i>{materialRede?.endereco_Mt}</i></p></div>
                            </div>
                        </Popup>
                        </Marker>
                    </MapContainer>
            }
        />
         <DialogAlert 
                    visibleDiag={visibleTesteOptico} 
                    visibleHide={() => setVisibleTesteOptico(false)}
                    colorType={'#13293d'}
                    ConfirmaButton={false}
                    textCloseButton={'Fechar'}
                    text={
                        <>
                        <TableGrid style={{width: '600px', fontSize: '0.7rem', marginTop: '0.5rem', marginBottom: '0.8rem'}}>
                              <thead>
                                <tr>
                                <th colSpan={6}>DETALHE ENDEREÇOS TOTAIS</th>
                                </tr>
                              </thead>
                              {valueEndereco != undefined ? ( 
                                        <tbody>
                                        <>
                                        <tr>   
                                        <th colSpan={2} style={valueEndereco.id_StatusGanho == 1 ? {
                                            backgroundColor: '#D4EFDF',
                                            color: '#145A32',
                                            border: '1px solid #145A32'
                                        } : {
                                            backgroundColor: '#E6B0AA',
                                            color: '#641E16',
                                            border: '1px solid #641E16'
                                        }}> {valueEndereco.statusGanho} </th>
                                        </tr>
                                        <tr>
                                            <td>{valueEndereco.uf ?? '-------'}</td>
                                            <td>Município: {valueEndereco.municipio ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Localidade: {valueEndereco.localidade ?? '-------'}</td>
                                            <td>Sigla localidade: {valueEndereco.localidadeAbrev ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Cod. SURVEY: {valueEndereco.cod_Survey ?? '-------'}</td>
                                            <td>Sigla estação: {valueEndereco.siglaEstacao ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} style={{margin:0, padding:0}}>
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                    <td>Cod. localidade: {valueEndereco.cod_Localidade ?? '-------'}</td>
                                                    <td>Cod. logradouro: {valueEndereco.cod_Logradouro ?? '-------'}</td>
                                                    <td>Id celula: {valueEndereco.id_Celula ?? '-------'}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Tipo rede: {valueEndereco.tipoRede ?? '-------'}</td>
                                            <td>Celula: {valueEndereco.celula ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>Nome CDO: {valueEndereco.nomeCdo ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Cod viabilidade: {valueEndereco.cod_Viabilidade ?? '-------'}</td>
                                            <td>Tipo viabilidade: {valueEndereco.tipoViabilidade ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2}>Logradouro: {valueEndereco.logradouro ?? '-------'}, {valueEndereco.numeroFachada ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} style={{margin:0, padding:0}}>
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                    <td>Complemento: {valueEndereco.complemento ?? '-------'}</td>
                                                    <td>Complemento II: {valueEndereco.complementoDois ?? '-------'}</td>
                                                    <td>Complemento III: {valueEndereco.complementoTres ?? '-------'}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Id endereco: {valueEndereco.id_Endereco ?? '-------'}</td>
                                            <td>Numero Piso: {valueEndereco.numeroPiso ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>CEP: {valueEndereco.cep ?? '-------'}</td>
                                            <td>Bairro: {valueEndereco.bairro ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>quantidadeUMS: {valueEndereco.quantidadeUMS ?? '-------'}</td>
                                            <td>Disponibilidade comercial: {valueEndereco.disp_Comercial ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>UCS Residenciais: {valueEndereco.ucS_Residenciais ?? '-------'}</td>
                                            <td>UCS Comerciais: {valueEndereco.ucS_Comerciais ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>UMS Certificadas: {valueEndereco.umS_Certificadas ?? '-------'}</td>
                                            <td>Rede Edificio Certificado: {valueEndereco.redeEdificio_Certificados ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Quantidade HCS: {valueEndereco.quantidade_HCS ?? '-------'}</td>
                                            <td>Projeto: {valueEndereco.projeto ?? '-------'}</td>
                                        </tr>
                                        <tr>
                                            <td>Latitude: {valueEndereco.latitude ?? '-------'}</td>
                                            <td>Longitude: {valueEndereco.longitude ?? '-------'}</td>
                                        </tr>
                                        </>
                                        </tbody>) : (null)}
                            </TableGrid>
                        </>
                    }
                />        
        {loadingMaterial ? (
            <>
            <TableGrid style={{marginTop:'1rem'}}>
                <thead>
                    <tr>
                        <th colSpan={3}>-- MATERIAIS DE REDE - {materialRede.chave} --</th>
                    </tr>
                </thead>
                <tbody>
                    {materialRede.id_MaterialRede != undefined ? (
                        <>
                        <tr>
                            <td>{materialRede.siglaFederativa_Mt ?? '-------'}</td>
                            <td>{materialRede.nomeFederativa_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Sigla Localidade: {materialRede.siglaLocalidade_Mt ?? '-------'}</td>
                            <td>Nome Localidade: {materialRede.nomeLocalidade_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Municipio: {materialRede.municipio_Mt ?? '-------'}</td>
                            <td>Nome Abastecedora: {materialRede.nomeAbastecedora_Mt ?? '-------'}</td>
                        </tr>
                        <tr>          
                            <td>Sigla Abastecedora: {materialRede.siglaAbastecedora_Mt ?? '-------'}</td>
                            <td>Codigo SAP: {materialRede.codigoSap_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>{materialRede.codigo_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Elemento Rede: {materialRede.elementoRede_Mt ?? '-------'}</td>
                            <td>Tipo Rede: {materialRede.tipo_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Fabricante: {materialRede.fabricante_Mt ?? '-------'}</td>
                            <td>Modelo: {materialRede.modelo_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}style={{margin:0, padding:0}}>
                                <table>
                                    <tbody>
                                    <tr>
                                    <td style={{width:'90%', border:0}} >Endereço: {materialRede.endereco_Mt ?? '-------'}</td>
                                    <td className="mapsTd" onClick={() => handleOpenMapDialog()}><FaLocationDot style={{fontSize:"1.7em", color:"red", fill:"red"}} /></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>Infraestrutura: {materialRede.infraestruturaRede_Mt ?? '-------'}</td>
                            <td>Grupo Operacional: {materialRede.grupoOperacional_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Data Estado Operacional: {materialRede?.dataEstadoOperacional_Mt != '' ? new Date(materialRede?.dataEstadoOperacional_Mt).toLocaleDateString() : '-------'}</td>
                            <td>Estado Operacional: {materialRede.estadoOperacional_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Data Estado Controle: {materialRede?.dataEstadoControle_Mt != '' ? new Date(materialRede?.dataEstadoControle_Mt).toLocaleDateString() : '-------'}</td>
                            <td>Estado Controle: {materialRede.estadoControle_Mt ?? '-------'}</td>
                        </tr>
                        </>
                        ) : (<tr><td colSpan={2} style={{fontSize:'0.7rem'}}>Nenhum resultado</td></tr>)
                        }
                        <tr>
                          <td colSpan={2} style={{paddingBottom: '0.3rem', paddingLeft:0, paddingRight:0}}>
                          <table className="tableEnderecoTotal">
                              <thead>
                                <tr>
                                <th colSpan={7}>ENDEREÇOS TOTAIS</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th style={{width: '10%'}}>CELULA</th>
                                  <th style={{width: '15%'}}>CELULA</th>
                                  <th style={{width: '10%'}}>SURVEY</th>
                                  <th style={{width: '5%'}}>UMS</th>
                                  <th style={{width: '8%'}}>COD. VIAB</th>
                                  <th style={{width: '25%'}}>TIPO VIAB</th>
                                  <th style={{width: '10%'}}>DISP. COMERCIAL</th>
                                </tr>
                              </thead>
                              <tbody>
                                {enderecoTotal !== undefined ? (
                                    [
                                    ...enderecoTotal
                                        .filter((value) => value.cod_Survey === survey)
                                        .map((valueEndereco, index) => (
                                        <tr
                                            style={
                                            valueEndereco.cod_Survey === survey
                                                ? { backgroundColor: '#F9E79F'}
                                                : null
                                            }
                                            key={index}
                                            id={valueEndereco.cod_Survey}
                                            onClick={handleTesteOpticoDetalhe}
                                            className="enderecoTr"
                                        >
                                            <td>{valueEndereco.statusGanho ?? '--'}</td>
                                            <td>{valueEndereco.celula ?? '--'}</td>
                                            <td>{valueEndereco.cod_Survey ?? '--'}</td>
                                            <td>{valueEndereco.quantidadeUMS ?? '--'}</td>
                                            <td>{valueEndereco.cod_Viabilidade ?? '--'}</td>
                                            <td>{valueEndereco.tipoViabilidade ?? '--'}</td>
                                            <td>{valueEndereco.disp_Comercial ?? '--'}</td>
                                        </tr>
                                        )),
                                    ...enderecoTotal
                                        .filter((value) => value.cod_Survey !== survey)
                                        .map((valueEndereco, index) => (
                                        <tr
                                            id-statusganho={valueEndereco.id_StatusGanho}
                                            key={index}
                                            id={valueEndereco.cod_Survey}
                                            onClick={handleTesteOpticoDetalhe}
                                            className="enderecoTr"
                                        >
                                            <td>{valueEndereco.statusGanho ?? '--'}</td>
                                            <td>{valueEndereco.celula ?? '--'}</td>
                                            <td>{valueEndereco.cod_Survey ?? '--'}</td>
                                            <td>{valueEndereco.quantidadeUMS ?? '--'}</td>
                                            <td>{valueEndereco.cod_Viabilidade ?? '--'}</td>
                                            <td>{valueEndereco.tipoViabilidade ?? '--'}</td>
                                            <td>{valueEndereco.disp_Comercial ?? '--'}</td>
                                        </tr>
                                        )),
                                    ]
                                ) : (
                                    <tr>
                                    <td colSpan={6} style={{ fontSize: '0.7rem', cursor: 'default', width: '800px' }}>
                                        Nenhum resultado.
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {enderecoTotal?.[0] !== undefined &&
                            <tr>
                                <th style={{backgroundColor: '#34495E',fontSize:'0.6rem', border:'1px solid #13293d', paddingBottom:0}} colSpan={6}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td style={{border:0}}></td>
                                                    <td style={{border:0}}></td>
                                                    <td style={{border:0}}>Total UMS : {`${totalUms.totalUms}`} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </th>
                              </tr>
                            }
                          </td>
                        </tr>
                        <tr>
                            <th style={{backgroundColor: '#13293d'}} colSpan={2}>LIGAÇÕES</th>
                        </tr>
                        {ligacao != undefined ? (
                            <>
                        <tr>
                            <td>Cabo Primário: {ligacao.caboPrimario_ls ?? '-------'}</td>
                            <td>Cabo Secundário: {ligacao.caboSecundario_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Nome OLT: {ligacao.nomeOlt_ls ?? '-------'}</td>
                            <td>Porta OLT: {ligacao.portaOlt_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>ICX: {ligacao.icX_ls ?? '-------'}</td>
                            <td>BSP: {ligacao.bsP_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>DGO: {ligacao.dgO_ls ?? '-------'}</td>
                            <td>Fibra DGO: {ligacao.fibraDgo_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Cabo DGO: {ligacao.caboDgo_ls ?? '-------'}</td>
                            <td>SplitterCEOS: {ligacao.splitterCEOS_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Out SplitterCEOS: {ligacao.outSplitterCEOS_ls ?? '-------'}</td>
                            <td>Cabo CDO: {ligacao.caboCdo_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Fibra CDO: {ligacao.fibraCdo_ls ?? '-------'}</td>
                            <td>Porta CDO: {ligacao.portaCdo_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Splitter CDO: {ligacao.splitteR_CDO_ls ?? '-------'}</td>
                            <td>CDO: {ligacao.cdO_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{margin:0, padding:0}}>
                                <table>
                                    <tbody>
                                    <tr>
                                    <td>Etiqueta Padrão: {ligacao.etiquetaPadrao_ls ?? '-------'}</td>
                                    <td>Fora Do Padrão: {ligacao.foraPadrao_ls ?? '-------'}</td>
                                    <td>Projeto: {ligacao.projeto_ls ?? '-------'}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>Etiqueta Campo: {ligacao.etiquetaCampo_ls ?? '-------'}</td>
                            <td>Identificação Terceiro: {ligacao.identificacaoTerceiro_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Etiqueta Terceiros: {ligacao.etiquetaTerceiro_ls ?? '-------'}</td>
                            <td>Rede: {ligacao.rede_ls ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Destinação: {ligacao.destinacao_ls ?? '-------'}</td>
                            <td>Estado Ciclo Vida: {ligacao.estadoCicloVida_ls ?? '-------'}</td>
                        </tr>
                        </>
                        ) : (<tr><td colSpan={2} style={{fontSize:'0.7rem'}}>Nenhum resultado.</td></tr>)
                        }
                    </tbody>
            </TableGrid>
             <FooterButton style={{width: '700px'}}>
             <div>
                 <>
                 <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
                 </>
             </div>
         </FooterButton>
         </>
            ):(<Spinner />)}
            </Content>
            <Footer />
        </Template>
        </>
    )}
    </>
    );
}

export default Vizualizar;