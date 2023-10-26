import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ButtonValidar, ButtonImagem, FooterButton, TableGrid, ButtonReValidar, ButtonEditar } from "./style";
import { DetalheTesteOptico, updateTesteOptico } from "../../../api/testeOptico";
import { getEnderecoTotalAny } from "../../../api/enterecoTotais"
import { Content, GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../../GlobalStyle";
import { createValidacao } from '../../../api/validacao';
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';
import { useAuth } from "../../../contexts/auth";
import DialogAlert from "../../../components/Dialog";

function Vizualizar(){
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [uf, setUf] = useState();
    const [dataAtual, setDataAtual] = useState(new Date());
    const [estacao, setEstacao] = useState();
    const [cdo, setCdo] = useState();
    const [testeOptico, setTesteOptico] = useState({});
    const [enderecoTotal, setEnderecoTotal] = useState({});
    const [visible, setVisible] = useState(false);
    const [mensagem, setMensagem] = useState("");
    

    const navigate = useNavigate();
    const { user } = useAuth();
    
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

                const detalheEnderecoTotal = await getEnderecoTotalAny(
                    detalheTesteOptico.data.id_EnderecoTotal
                );

                if(detalheEnderecoTotal.status == 200) {
                    setEnderecoTotal(detalheEnderecoTotal.data);
                }

            }

        } catch (error) {
            setMensagem(`Erro ao carregar.`)
            setVisible(true);
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

    const handleValidar = async() => {
        await fetchValidar(0);
        setLoading(false);
    }

    const handleRevalidar = async() => {
        await fetchValidar(1);
        setLoading(false);
    }

    const handleAnalise = () => {
        navigate(`/Analise/${id}`); 
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
                        <th colSpan={3}>-- TESTE ÓPTICO | FICHA TÉCNICA --</th>
                    </tr>
                    <tr>
                    <th style={testeOptico.sel == 0 ? {
                        backgroundColor: '#D4EFDF',
                        color: '#145A32',
                        border: '1px solid #145A32'
                    } : {
                        backgroundColor: '#E6B0AA',
                        color: '#641E16',
                        border: '1px solid #641E16'
                    }} colSpan={3}> {testeOptico.sel == 0 ? "VALIDADO" : "NÃO VALIDADO"} </th>
                    </tr>
                </thead>
                <tbody>
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
                            <td>Cabo Primario: {enderecoTotal.caboPrimario ?? '-------'}</td>
                            <td>Cabo Secundário: {enderecoTotal.caboSecundario ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>{testeOptico.cdo ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Codigo: {enderecoTotal.cod_Viabilidade ?? '-------'} | {enderecoTotal.tipoViabilidade ?? '-------'}</td>
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
                            <td>Projeto: {enderecoTotal.projeto ?? '-------'}</td>
                            <td>Data Teste: {testeOptico.dataTeste ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Data Construção: {testeOptico.dataConstrucao ?? '-------'}</td>
                            <td>Data Recebimento: {testeOptico.dataRecebimento ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Cod Survey: {enderecoTotal.cod_Survey ?? '-------'}</td>
                            <td>CEP: {enderecoTotal.cep ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td>Município: {enderecoTotal.municipio ?? '-------'}</td>
                            <td>Bairro: {enderecoTotal.bairro ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Localização: {enderecoTotal.logradouro ?? '-------'}</td>
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
                    </>
                </div>
                    <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
                    
                    { testeOptico.sel == 1 &&
                    <>
                    <ButtonConfirma onClick={handleAnalise}>Analisar</ButtonConfirma>
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