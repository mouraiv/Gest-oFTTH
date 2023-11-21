import React, {useState, useEffect} from "react";
import { Tab, Tabs } from 'react-bootstrap';
import { useParams, useNavigate } from "react-router-dom";
import { ButtonValidar, ButtonImagem, FooterButton, TableGrid, ButtonReValidar, ButtonEditar, ContentTabs } from "./style";
import { DetalheTesteOptico, updateTesteOptico } from "../../../api/testeOptico";
import { DetahleMaterialRedeAny } from "../../../api/materialRede";
import { Content, GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../../GlobalStyle";
import { createValidacao } from '../../../api/validacao';
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';
import { useAuth } from "../../../contexts/auth";
import DialogAlert from "../../../components/Dialog";

function Vizualizar(){
    const { id, idNetwin } = useParams();
    const [loading, setLoading] = useState(false);
    const [loadingMaterial, setLoadingMaterial] = useState(false);
    const [uf, setUf] = useState();
    const [dataAtual, setDataAtual] = useState(new Date());
    const [estacao, setEstacao] = useState();
    const [cdo, setCdo] = useState();
    const [testeOptico, setTesteOptico] = useState({});
    const [materialRede, setMaterialRede] = useState({});
    const [visible, setVisible] = useState(false);
    const [mensagem, setMensagem] = useState("");


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

         if (statusAnalise != null) {
            return statusAnalise.split(';').length > 0 ? 'RE-TESTE' : 'TESTADO';
         } else {
            return 'TESTE';
         }

    }

    const handleVoltar = () => {
        navigate(-1); 
    };

    const handleImagens = () => {
        navigate(`/TesteOptico/Imagem/${uf}/${estacao}/${cdo}`); 
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

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Teste Óptico - Visualizar"} />
        <Content>
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
                    }}> {testeOptico.sel == 0 ? "VALIDADO" : "NÃO VALIDADO"} </th>
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
                            <td>Data Teste: {testeOptico.dataTeste ?? '-------'}</td>
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
                            <td>Data Construção: {testeOptico.dataConstrucao ?? '-------'}</td>
                            <td>Data Recebimento: {testeOptico.dataRecebimento ?? '-------'}</td>
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
                    <ButtonImagem onClick={handleImagens}>Imagens</ButtonImagem>
                    </>
                </div>
                    <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
                    
                    { testeOptico.sel == 1 &&
                    <>
                    <ButtonConfirma onClick={handleAnalise}>Analisar</ButtonConfirma>
                    </>
                    }
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
                            <td>Infraestrutura: {materialRede.infraestruturaRede_Mt ?? '-------'}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Fabricante: {materialRede.fabricante_Mt ?? '-------'}</td>
                            <td>Modelo: {materialRede.modelo_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Endereço: {materialRede.endereco_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Data Estado Operacional: {materialRede.dataEstadoOperacional_Mt ?? '-------'}</td>
                            <td>Estado Operacional: {materialRede.estadoOperacional_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Data Estado Controle: {materialRede.dataEstadoControle_Mt ?? '-------'}</td>
                            <td>Estado Controle: {materialRede.estadoControle_Mt ?? '-------'}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{padding: '0'}}>
                            <table style={{width: '100%', fontSize: '0.6rem', marginTop: '0.5rem', marginBottom: '0.8rem'}}>
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
                              <tbody style={{cursor: 'pointer'}}>
                                {enderecoTotal != undefined ? (
                                    enderecoTotal.map((valueEndereco, index) => (
                                    <tr key={index}>
                                    <td>{valueEndereco.celula ?? "--"}</td>
                                    <td>{valueEndereco.cod_Survey ?? "--"}</td>
                                    <td>{valueEndereco.quantidadeUMS ?? "--"}</td>
                                    <td>{valueEndereco.cod_Viabilidade ?? "--"}</td>
                                    <td>{valueEndereco.tipoViabilidade ?? "--"}</td>
                                    <td>{valueEndereco.disp_Comercial ?? "--"}</td> 
                                  </tr>
                                ))):(<tr><td colSpan={6}>Nenhum resultado.</td></tr>)}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                            <th style={{backgroundColor: '#13293d'}} colSpan={2}>LIGAÇÕES</th>
                        </tr>
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
                            <td>Etiqueta Padrão: {ligacao.etiquetaPadrao_ls ?? '-------'}</td>
                            <td>Fora Do Padrão: {ligacao.foraPadrao_ls ?? '-------'}</td>
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
                    </tbody>
            </TableGrid>
            ):(<p>Carregando...</p>)}
            </Tab>
            </Tabs>
            </ContentTabs>
            ):(<Spinner />)
        }
        </Content>
            <Footer />
        </Template>
        </>
    );
}

export default Vizualizar;