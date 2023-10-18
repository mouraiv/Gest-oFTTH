import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ButtonCancelar, ButtonConfirma, ButtonImagem, FooterButton, TableGrid } from "./style";
import { DetalheTesteOptico } from "../../../api/testeOptico";
import { getEnderecoTotalAny } from "../../../api/enterecoTotais"
import { Content, GlobalStyle, Template } from "../../../GlobalStyle";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';

function Vizualizar(){
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [uf, setUf] = useState();
    const [estacao, setEstacao] = useState();
    const [cdo, setCdo] = useState();
    const [testeOptico, setTesteOptico] = useState({});
    const [enderecoTotal, setEnderecoTotal] = useState({});

    const navigate = useNavigate()

    async function fetchEnderecoTotalAny() {
        return getEnderecoTotalAny(id);
    }

    useEffect(() => {
        DetalheTesteOptico(id).then((dataTesteOptico) => {
            setTesteOptico(dataTesteOptico);
                setUf(dataTesteOptico.uf);
                setEstacao(dataTesteOptico.estacao);
                setCdo(dataTesteOptico.cdo);
        
            fetchEnderecoTotalAny(
                uf,
                estacao,
                cdo
            ).then((dataEnderecoTotal) => {
                setEnderecoTotal(dataEnderecoTotal);
                setLoading(true);
            });    
        });
    },[])

    const handleVoltar = () => {
        navigate(-1); 
    };

    const handleImagens = () => {
        navigate(`/TesteOptico/Imagem/${uf}/${estacao}/${cdo}`); 
    };

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Teste Óptico - Visualizar"} />
        <Content>
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
                <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
                <ButtonConfirma>Analisar</ButtonConfirma>
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