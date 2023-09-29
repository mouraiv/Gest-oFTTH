import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { TableGrid } from "./style";
import { DetalheTesteOptico } from "../../../api/testeOptico";
import { Content, GlobalStyle, Template } from "../../../GlobalStyle";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';

function Vizualizar(){
    const { id } = useParams();
    const [loading, setLoading] = useState();
    const [testeOptico, setTesteOptico] = useState({});

    async function fetchTesteOptico() {
        const data = await DetalheTesteOptico(id).finally(() => {
          setLoading(true)
        });
        setTesteOptico(data);
    }

    useEffect(() => {
        fetchTesteOptico();
    }, [loading]);

    console.log(testeOptico)

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Teste Óptico - Visualizar"} />
        <Content>
        { testeOptico !== undefined ? (
              loading ? (  
            <TableGrid>
                <thead>
                    <tr>
                        <th colSpan={3}>-- FICHA TÉCNICA --</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td>{testeOptico.uf}</td>
                            <td>{testeOptico.construtora}</td>
                        </tr>
                        <tr>
                            <td>Estação: {testeOptico.estacao}</td>
                            <td>Tipo Obra: {testeOptico.tipoObra}</td>
                        </tr>
                        <tr>
                            <td>Fabricante: <a>@Model.Fabricante</a></td>
                            <td>Modelo: <a>@Model.Modelo</a></td>
                        </tr>
                        <tr>
                            <td colSpan={2}><a>@Model.CDO</a> - <a>@Model.Netwin?.Tipo</a></td>
                        </tr>
                        <tr>
                            <td colSpan={2}><a>-- @Model.Netwin?.Descricao --</a></td>
                        </tr>
                        <tr>
                            <td>Cabo: <a>@Model.Cabo</a></td>
                            <td>Celula: <a>@Model.Celula</a></td>
                        </tr>
                        <tr>
                            <td>Capacinade: <a>@Model.Capacidade</a></td>
                            <td>Técnico: <a>@Model.TecnicoNome</a></td>
                        </tr>
                        <tr>
                            <td>Total UMs: <a>@Model.TotalUms</a></td>
                            <td>Equipe Construção: <a>@Model.EquipedeConstrucao</a></td>
                        </tr>
                        <tr>
                            <td>Estado Campo: <a>@Model.EstadoCampo?.Nome</a></td>
                            <td>Data Teste: <a>@Model.DatadoTeste?</a></td>
                        </tr>
                        <tr>
                            <td>Data Construção: <a>@Model.DatadeConstrucao?</a></td>
                            <td>Data Recebimento: <a>@Model.DatadeRecebimento?</a></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Localização: <a>@Model.Endereco</a></td>
                        </tr>
                        <tr>
                            <td>Estado Operacional: <a>@Model.EstadoOperacional</a></td>
                            <td>Data Est. Operacional: <a>@Model.DataEstadoOperacional?</a></td>
                        </tr>
                        <tr>
                            <td>Estado Controle: <a>@Model.EstadoControle</a></td>
                            <td>Data Est. Controle: <a>@Model.DataEstadoControle?</a></td>
                        </tr>
                        <tr>
                            <td>Bobina Lançamento: <a>@Model.BobinadeLancamento</a></td>
                            <td>Posição ICX/DGO: <a>@Model.PosicaoICX_DGO</a></td>
                        </tr>
                        <tr>
                            <td>Bobina de Recepção: <a>@Model.BobinadeRecepcao</a></td>
                            <td>Splitter CEOS: <a>@Model.SplitterCEOS</a></td>
                        </tr>
                        <tr>
                            <td>Quantidade Teste: <a>@Model.QuantidadeDeTeste</a></td>
                            <td>Fibra DGO: <a>@Model.FibraDGO</a></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Observação: <a>@Model.Observacoes</a></td>
                        </tr>
                </tbody>
            </TableGrid>
            ):(<Spinner />)
            ) : ( <Spinner /> )
            }
        </Content>
        <Footer />
        </Template>
        </>
    );
}

export default Vizualizar;