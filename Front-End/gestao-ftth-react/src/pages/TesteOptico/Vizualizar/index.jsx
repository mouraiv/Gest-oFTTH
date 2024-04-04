import React, { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Tab, Tabs } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import { ButtonCancelar, ButtonConfirma, Content, GlobalStyle, Template } from "../../../GlobalStyle";
import { DetalheMaterialRedeAny } from "../../../api/materialRede";
import { GetEnderecoTotalAny } from "../../../api/enterecoTotais";
import { DetalheTesteOptico, UpdateTesteOptico } from "../../../api/testeOptico";
import { CreateValidacao } from '../../../api/validacao';
import DialogAlert from "../../../components/Dialog";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';
import { UseAuth } from "../../../contexts/auth";
import { FaLocationDot } from 'react-icons/fa6';
import { ButtonAnalise, ButtonEditar, ButtonImagem, ButtonReValidar, ButtonValidar, ContentTabs, FooterButton, TableGrid } from "./style";

function Vizualizar(){
    const { id, idNetwin, survey } = useParams();
    const [loading, setLoading] = useState(false);
    const [totalUms, setTotalUms] = useState({
        totalUms: 0,
        totalUmsComGanho: 0,
        totalUmsSemGanho: 0
    });
    const [loadingMaterial, setLoadingMaterial] = useState(false);
    const [uf, setUf] = useState();
    const [dataAtual, setDataAtual] = useState(new Date());
    const [estacao, setEstacao] = useState();
    const [siglaEstacao, setSiglaEstacao] = useState();
    const [cdo, setCdo] = useState();
    const [testeOptico, setTesteOptico] = useState({});
    const [materialRede, setMaterialRede] = useState(null);
    const [enderecoTotalAny, setEnderecoTotalAny] = useState({});
    const [visible, setVisible] = useState(false);
    const [visibleExcluir, setVisibleExcluir] = useState(false);
    const [visibleTesteOptico, setVisibleTesteOptico] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [mapDialogVisible, setMapDialogVisible] = useState(false);
    const [positionMap, setPositionMap] = useState()
    const [infoMap, setInfoMap] = useState({endereco:'', cdo: ''})
    const [valueEndereco, setValueEndereco] = useState()
    const [submitClicked, setSubmitClicked] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [analseDelete, setAnaliseDelete] = useState();

    const navigate = useNavigate();
    const { user } = UseAuth();

    const { analises } = testeOptico;
    const { ligacao, enderecoTotal = enderecoTotalAny } = materialRede ?? {};

    async function fetchDelete(){
        try {
          atualizar(false)
          if(id !== undefined){
            await DeleteTesteOptico(id);
          }
        } catch (error) {
          atualizar(true);
          
        }finally{
          atualizar(true);
        }
        
      }

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

    
            const testeOpticoResponse = await UpdateTesteOptico(testeOpticoData);
    
            if (testeOpticoResponse.status === 200) {
                await CreateValidacao(validacao);
            }

        } catch (error) {
            setMensagem(`Erro ao validar.`);
            setVisible(true);
            setLoading(true);

        } finally {
            setLoading(true);
            setSubmitClicked(true);

        }
    }
    const fecthDetalheTesteOptico = useCallback(async () => {
        try {
            const detalheTesteOptico = await DetalheTesteOptico(id);

            if(detalheTesteOptico.status == 200) {
                setPositionMap([]);
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
            setInitialLoad(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    } , [submitClicked]);

    const fecthDetalheMaterialRede = useCallback(async () => {
        try {
                const detalheEnderecoTotal = await GetEnderecoTotalAny(null, survey, true);

                if(detalheEnderecoTotal.status == 200) {

                    if (idNetwin == 'null') {
                        const _detalheEnderecoTotal = [detalheEnderecoTotal.data];
                        setEnderecoTotalAny(_detalheEnderecoTotal);
                        console.log(_detalheEnderecoTotal);

                        const somaUMS = _detalheEnderecoTotal.reduce((acc, value) => acc + (value.quantidadeUMS || 0), 0);
                        const somaUMSComGanho = _detalheEnderecoTotal.filter(value => value.id_StatusGanho === 1).reduce((acc, value) => acc + (value.quantidadeUMS || 0), 0);
                        const somaUMSSemGanho = _detalheEnderecoTotal.filter(value => value.id_StatusGanho === 2).reduce((acc, value) => acc + (value.quantidadeUMS || 0), 0);

                        setTotalUms({
                            totalUms: somaUMS,
                            totalUmsComGanho: somaUMSComGanho,
                            totalUmsSemGanho: somaUMSSemGanho
                        })
                        
                    }
                    
                }
                
                const detalheMaterialRede = await DetalheMaterialRedeAny(idNetwin);

                if(detalheMaterialRede.status == 200) {

                    if (idNetwin !== 'null') {
                        setMaterialRede(detalheMaterialRede.data);
                        
                        const somaUMS = detalheMaterialRede.data.enderecoTotal?.reduce((acc, value) => acc + (value.quantidadeUMS || 0), 0);
                        const somaUMSComGanho = detalheMaterialRede.data.enderecoTotal?.filter(value => value.id_StatusGanho === 1).reduce((acc, value) => acc + (value.quantidadeUMS || 0), 0);
                        const somaUMSSemGanho = detalheMaterialRede.data.enderecoTotal?.filter(value => value.id_StatusGanho === 2).reduce((acc, value) => acc + (value.quantidadeUMS || 0), 0);
                        setTotalUms({
                            totalUms: somaUMS,
                            totalUmsComGanho: somaUMSComGanho,
                            totalUmsSemGanho: somaUMSSemGanho
                        });
                    }
 
                }

        } catch (error) {
            setLoadingMaterial(true);
            
        } finally {
            setLoadingMaterial(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitClicked]);

    useEffect(() => {    
          fecthDetalheTesteOptico();
          
        if (initialLoad) {
          fecthDetalheMaterialRede();
          setLoading(false);

        }
        setSubmitClicked(false); 

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fecthDetalheTesteOptico, fecthDetalheMaterialRede, enderecoTotalAny]);    

    const statusAnalise = () => {
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

    const handleOpenMapDialog = async (latitude, longitude, endereco, cdo) => {
            const _latitude = await latitude;
            const _longitude = await longitude;
            const _endereco = await endereco;
            const _cdo = await cdo;
            
            infoMap.endereco = _endereco;
            infoMap.cdo = _cdo;
            setPositionMap([parseFloat(_latitude.replace(",", ".")), parseFloat(_longitude.replace(",", "."))]);
            setMapDialogVisible(true);

    };
    
    const handleVoltar = () => {
        navigate(-1); 
    };

    const handleImagens = () => {
        navigate(`/TesteOptico/Imagem/${uf}/${siglaEstacao}/${cdo}`); 
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

    function formatarNumero(numero) {
        // Converte o número para uma string
        const numeroString = numero.toString();
      
        // Divide a string em grupos de 3 caracteres
        const grupos = [];
        for (let i = numeroString.length; i > 0; i -= 3) {
          grupos.unshift(numeroString.substring(Math.max(0, i - 3), i));
        }
      
        // Junta os grupos usando o ponto como separador e retorna
        return grupos.join('.');
      }

    const handleTesteOpticoDetalhe = (event) => {
        const survey = event.currentTarget.id;
        filterEnderecoTotalObj(survey);
        setVisibleTesteOptico(true);
    };

    const HandleEditar = () => {
        navigate(`/TesteOptico/Editar/${id ?? null}`);
      }
    
      const HandleExcluir = () => {
        setVisibleExcluir(true);
    
        if(analises.length == 0) {
          setAnaliseDelete(false);
        }else{
          setAnaliseDelete(true);
        }  
      }
    
      const ExcluirFecth = async () => {
        await fetchDelete();
        setVisibleExcluir(false);
      }

    GlobalStyle();
    return(
        <>
        { id !== "null" ? (
        <>
        <Template>
        <Header navbar={false} title={"Teste Óptico - Visualizar"}  />
        <Content>
        <DialogAlert 
            visibleDiag={visibleExcluir} 
            visibleHide={() => setVisibleExcluir(false)}
            header={<h4>Atenção</h4>}
            colorType={'#ff0000'}
            ConfirmaButton={analseDelete ? false : true}
            textCloseButton={analseDelete ? 'OK' : 'Cancelar'}
            text={
              <>
              { analseDelete ? (
                <>
                <p>Esse teste não pode ser excluído!</p>
                <p></p>
                <p>O teste possuí analises associadas.</p>
                </>

              ):(
                <>
                <p>Esta ação é irreversível</p>
                <p></p>
                <p>Tem certeza que gostaria de excluir esse teste?</p>
                </>
              )
              }
              </>
            }
            buttonConfirmar={() => ExcluirFecth()} 
         />    
        <DialogAlert
            visibleDiag={mapDialogVisible}
            visibleHide={() => setMapDialogVisible(false)}
            header={
                    <>
                        <h4>Mapa Geográfico </h4> 
                        <br /> 
                        <p>{infoMap.endereco}</p>
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
                                <div style={{textAlign: 'center'}}><b>{infoMap.cdo}</b></div>
                                <div><p><i>{infoMap.endereco}</i></p></div>
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
                        <th colSpan={3}>TESTE ÓPTICO - {testeOptico.chave}</th>
                    </tr>
                    <tr>
                    <th style={{ backgroundColor:'#2C3E50', border: '1px solid #13293d' }}>{statusAnalise()}</th>    
                    <th style={testeOptico.sel === 2  ? {
                                backgroundColor: '#d6d6d6',
                                color: '#000000',
                                border: '1px solid #797979'
                                
                            } : testeOptico.sel === 0 && testeOptico.sel !== 2 ? {
                                backgroundColor: '#D4EFDF',
                                color: '#145A32',
                                border: '1px solid #145A32'
                                
                            } : {
                                backgroundColor: '#E6B0AA',
                                color: '#641E16',
                                border: '1px solid #641E16'
                            }
                        }>  {testeOptico.sel !== 2 ?
                             analises?.[0]?.status
                            :
                            "PENDENTE"
                        } </th>
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
                        <tr>
                            <td colSpan={2}></td>
                        </tr>
                </tbody>
            </TableGrid>
            <FooterButton>
                <div style={{width: '100%'}}>
                    <>
                    {statusAnalise !== 'TESTE PENDENTE' ?
                    <>
                    {testeOptico.sel == 1 ? (
                        <ButtonValidar onClick={handleValidar}>Validar</ButtonValidar>
                        ) : (
                        <ButtonReValidar onClick={handleRevalidar}>Re-Validar</ButtonReValidar>
                    )}
                    </>
                    : (null)
                    }
                    { loadingMaterial ?
                    <ButtonImagem onClick={handleImagens}>Imagens</ButtonImagem> 
                    :
                    <ButtonImagem disabled>Carregando...</ButtonImagem>
                    }
                    </>
                </div>
                    <ButtonEditar onClick={() => HandleEditar()} >Editar</ButtonEditar>
                    <ButtonEditar onClick={() => HandleExcluir()} >Excluir</ButtonEditar>
                    <ButtonConfirma onClick={handleAnalise}>Analisar</ButtonConfirma>
            </FooterButton>
            </Tab>
            <Tab eventKey="MaterialRede" title="Netwin">
            { materialRede !== undefined && enderecoTotal !== undefined && enderecoTotalAny?.length !== 0 && ligacao !== undefined ? (
            <>
            {loadingMaterial ? (
            <TableGrid>
                <thead>
                    <tr>
                        <th colSpan={3}>MATERIAIS DE REDE</th>
                    </tr>
                </thead>
                <tbody>
                    {materialRede.id_MaterialRede !== undefined ? (
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
                                        <td className="mapsTd" onClick={() => handleOpenMapDialog(materialRede.latitude_Mt,materialRede.longitude_Mt, materialRede.endereco_Mt, materialRede.codigo_Mt)}><FaLocationDot style={{fontSize:"1.7em", color:"red", fill:"red"}} /></td>
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
                        <tr>
                          <td colSpan={2} style={{padding: '0'}}>
                            <table className="tableEnderecoTotal">
                              <thead>
                                <tr>
                                <th colSpan={8}>ENDEREÇOS TOTAIS</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th style={{width: '10%'}}>STATUS</th>
                                  <th style={{width: '20%'}}>CELULA</th>
                                  <th style={{width: '5%'}}>SURVEY</th>
                                  <th style={{width: '5%'}}>UMS</th>
                                  <th style={{width: '8%'}}>COD. VIAB</th>
                                  <th style={{width: '20%'}}>TIPO VIAB</th>
                                  <th style={{width: '10%'}}>DISP. COMERCIAL</th>
                                  <th style={{width: '5%'}}>MAPS</th>
                                </tr>
                              </thead>
                              <tbody>
                                {enderecoTotal !== undefined && enderecoTotal?.length !== 0 ? (
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
                                            <td className="mapsTdEnd" onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenMapDialog(valueEndereco.latitude,valueEndereco.longitude, `${valueEndereco.logradouro}, ${valueEndereco.numeroFachada}, ${valueEndereco.bairro}, ${valueEndereco.municipio}, ${valueEndereco.uf} ${valueEndereco.cep}`, valueEndereco.nomeCdo);
                                            
                                            }}><FaLocationDot style={{fontSize:"1.7em", color:"red", fill:"red"}} /></td>
                                        </tr>
                                        )),
                                    ...enderecoTotal
                                        .filter((value) => value.cod_Survey !== survey)
                                        .map((valueEndereco, index) => (
                                        <tr
                                        style={valueEndereco.id_StatusGanho === 1 ?
                                            { backgroundColor: '#D5F5E3'} : 
                                            { backgroundColor: '#FADBD8'}}
                                            
                                            key={index + 1}
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
                                            <td className="mapsTdEnd" onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenMapDialog(valueEndereco.latitude,valueEndereco.longitude, `${valueEndereco.logradouro}, ${valueEndereco.numeroFachada}, ${valueEndereco.bairro}, ${valueEndereco.municipio}, ${valueEndereco.uf} ${valueEndereco.cep}`, valueEndereco.nomeCdo);
                                            
                                            }}><FaLocationDot style={{fontSize:"1.7em", color:"red", fill:"red"}} /></td>
                                        </tr>
                                        )),
                                    ]
                                ) : (
                                    <tr>
                                     <td colSpan={8} style={{ fontSize: '0.7rem', cursor: 'default', minWidth: '700px', backgroundColor: '#ffffff' }}>
                                        Nenhum resultado.
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {enderecoTotal !== undefined && enderecoTotal?.length !== 0 &&
                            <tr>
                                <th style={{backgroundColor: '#34495E',fontSize:'0.6rem', border:'1px solid #13293d', paddingBottom:0}} colSpan={6}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td style={{border:0}}>( UMS ) Com Ganho : {`${formatarNumero(totalUms.totalUmsComGanho)}`}</td>
                                                    <td style={{border:0}}>( UMS ) Sem Ganho : {`${formatarNumero(totalUms.totalUmsSemGanho)}`}</td>
                                                    <td style={{border:0}}>( UMS ) Total: {`${formatarNumero(totalUms.totalUms)}`} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </th>
                              </tr>
                            }
                          </td>
                        </tr>
                    </tbody>
            </TableGrid>
            ):(<Spinner />)}
             </>
             ):(<p style={{textAlign: 'center', marginTop: '1rem'}}>Nenhum resultado.</p>)
             }
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
        <Header navbar={false} title={`NetWin = ${materialRede !== null ? `${materialRede.siglaFederativa_Mt} - ${materialRede.siglaAbastecedora_Mt} - ${materialRede.codigo_Mt}` : ""}`} />
        <Content>
        <DialogAlert
            visibleDiag={mapDialogVisible}
            visibleHide={() => setMapDialogVisible(false)}
            header={
                    <>
                        <h4>Mapa Geográfico </h4> 
                        <br /> 
                        <p>{infoMap.endereco}</p>
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
                                <div style={{textAlign: 'center'}}><b>{infoMap.cdo}</b></div>
                                <div><p><i>{infoMap.endereco}</i></p></div>
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
                        <th colSpan={3}>MATERIAIS DE REDE</th>
                    </tr>
                </thead>
                <tbody>
                    {materialRede !== null ? (
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
                                        <td className="mapsTd" onClick={() => handleOpenMapDialog(materialRede.latitude_Mt,materialRede.longitude_Mt, materialRede.endereco_Mt,materialRede.codigo_Mt)}><FaLocationDot style={{fontSize:"1.7em", color:"red", fill:"red"}} /></td>
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
                        ) : (<tr><td colSpan={2} style={{fontSize:'0.7rem'}}>Nenhum resultado.</td></tr>)
                        }
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
                        <tr>
                          <td colSpan={2} style={{paddingBottom: '0.3rem', paddingLeft:0, paddingRight:0}}>
                          <table className="tableEnderecoTotal">
                              <thead>
                                <tr>
                                <th colSpan={8}>ENDEREÇOS TOTAIS</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th style={{width: '10%'}}>STATUS</th>
                                  <th style={{width: '20%'}}>CELULA</th>
                                  <th style={{width: '5%'}}>SURVEY</th>
                                  <th style={{width: '5%'}}>UMS</th>
                                  <th style={{width: '8%'}}>COD. VIAB</th>
                                  <th style={{width: '20%'}}>TIPO VIAB</th>
                                  <th style={{width: '10%'}}>DISP. COMERCIAL</th>
                                  <th style={{width: '5%'}}>MAPS</th>
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
                                            <td className="mapsTdEnd" onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenMapDialog(valueEndereco.latitude,valueEndereco.longitude, `${valueEndereco.logradouro}, ${valueEndereco.numeroFachada}, ${valueEndereco.bairro}, ${valueEndereco.municipio}, ${valueEndereco.uf} ${valueEndereco.cep}`, valueEndereco.nomeCdo);
                                            
                                            }}><FaLocationDot style={{fontSize:"1.7em", color:"red", fill:"red"}} /></td>
                                        </tr>
                                        )),
                                    ...enderecoTotal
                                        .filter((value) => value.cod_Survey !== survey)
                                        .map((valueEndereco, index) => (
                                        <tr
                                            style={valueEndereco.id_StatusGanho === 1 ?
                                                { backgroundColor: '#D5F5E3'} : 
                                                { backgroundColor: '#FADBD8'}}
                                            key={index + 1}
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
                                            <td className="mapsTdEnd" onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenMapDialog(valueEndereco.latitude,valueEndereco.longitude, `${valueEndereco.logradouro}, ${valueEndereco.numeroFachada}, ${valueEndereco.bairro}, ${valueEndereco.municipio}, ${valueEndereco.uf} ${valueEndereco.cep}`, valueEndereco.nomeCdo);
                                            
                                            }}><FaLocationDot style={{fontSize:"1.7em", color:"red", fill:"red"}} /></td>
                                        </tr>
                                        )),
                                    ]
                                ) : (
                                    <tr>
                                    <td colSpan={8} style={{ fontSize: '0.7rem', cursor: 'default', minWidth: '700px', backgroundColor: '#ffffff' }}>
                                        Nenhum resultado.
                                    </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {enderecoTotal !== undefined && enderecoTotal?.length !== 0 &&
                            <tr>
                                <th style={{backgroundColor: '#34495E',fontSize:'0.6rem', border:'1px solid #13293d', paddingBottom:0}} colSpan={6}>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td style={{border:0}}>( UMS ) Com Ganho : {`${formatarNumero(totalUms.totalUmsComGanho)}`}</td>
                                                    <td style={{border:0}}>( UMS ) Sem Ganho : {`${formatarNumero(totalUms.totalUmsSemGanho)}`}</td>
                                                    <td style={{border:0}}>( UMS ) Total: {`${formatarNumero(totalUms.totalUms)}`} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </th>
                              </tr>
                            }
                          </td>
                        </tr>
                    </tbody>
            </TableGrid>
             <FooterButton style={{width: '700px'}}>
             <div>
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