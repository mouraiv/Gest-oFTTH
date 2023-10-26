import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, ButtonImagem, FooterButton, TableGrid} from "./styles";
import { DetalheTesteOptico, updateTesteOptico } from "../../api/testeOptico";
import { getEnderecoTotalAny } from "../../api/enterecoTotais"
import { Content, GlobalStyle, Template, ButtonCancelar, ButtonConfirma } from "../../GlobalStyle";
import { createValidacao } from '../../api/validacao';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import { useAuth } from "../../contexts/auth";
import DialogAlert from "../../components/Dialog";

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
    const [visualizarAnalise, setVisualizarAnalise] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [dialogAviso, setDialogAviso] = useState();

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
            setDialogAviso(true);
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
            setDialogAviso(true);
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

    const Observacao = () => {
      if (testeOptico.analises && testeOptico.analises.length > 0) {
        const observacoes = testeOptico.analises.map(analise => analise.analiseObservacao);
        const _observacoes = observacoes.map(obs => obs.replace(';.','').split(';'));
        return _observacoes;
      }
      return [];
    };
    
    
    const Adicionar = () => {
      setDialogAviso(false);
      setVisible(true);
    };

    const AnaliseDetalhe = () => {
      setVisualizarAnalise(true);
    };

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Analise"} />
        <Content>
        <DialogAlert 
                    visibleDiag={visualizarAnalise} 
                    visibleHide={() => setVisualizarAnalise(false)}
                    header={<h4>Análise Observações</h4>}
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
                            {Observacao().map((observacaoArray, outerIndex) => (
                              observacaoArray.map((observacao, innerIndex) => (
                                <tr key={`${outerIndex}-${innerIndex}`}>
                                  <td style={{padding:'0.5rem'}}>{observacao}</td>
                                </tr>
                              ))
                            ))}
                          </tbody>
                        </TableGrid>
                        </>
                    }
                />
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
                        <th colSpan={3}>-- ANALISE {uf} - {estacao} - {cdo} --</th>
                    </tr>
                    <tr>
                    <th style={testeOptico.analises[0].status == 'APROVADO' ? {
                        backgroundColor: '#D4EFDF',
                        color: '#145A32',
                        border: '1px solid #145A32'
                    } : {
                        backgroundColor: '#E6B0AA',
                        color: '#641E16',
                        border: '1px solid #641E16'
                    }} colSpan={3}> {testeOptico.analises[0].status} </th>
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
                          <td colSpan={2}>
                            <table>
                              <tbody>
                              <tr>
                                <td>Cabo: {testeOptico.cabo ?? '-------'}</td>
                                <td>Celula: {testeOptico.celula ?? '-------'}</td>
                                <td>Total UMs: {testeOptico.totalUMs ?? '-------'}</td>
                              </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                            <td>{testeOptico.cdo ?? '-------'}</td>
                            <td style={{backgroundColor: '#34495E', color: '#ffffff'}}>ANALISTA : {user.nome.toUpperCase() ?? '-------'}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}>Codigo: {enderecoTotal.cod_Viabilidade ?? '-------'} | {enderecoTotal.tipoViabilidade ?? '-------'}</td>
                        </tr>
                        <tr>
                          <td colSpan={2} style={{padding: '0'}}>
                            <table style={{width: '100%', fontSize: '0.6rem', marginTop: '0.5rem', marginBottom: '0.8rem'}}>
                              <thead>
                                <tr>
                                <th colSpan={4}>HISTÓRICO ANÁLISE</th>
                                </tr>
                                <tr style={{backgroundColor:'#34495E'}}>
                                  <th>ANALISTA</th>
                                  <th>DATA ANALISE</th>
                                  <th>STATUS</th>
                                  <th># AÇÕES #</th>
                                </tr>
                              </thead>
                              <tbody>
                              {testeOptico.analises.map((analise, index) => (
                                  <tr key={index} style={analise.status == 'APROVADO' ?
                                  {backgroundColor:'#D5F5E3'} : {backgroundColor:'#F5B7B1'}}>
                                    <td>{analise.analista}</td>
                                    <td>{new Date(analise.dataAnalise).toLocaleDateString()}</td>
                                    <td>{analise.status}</td>
                                    <td>
                                      <>
                                        <Button onClick={AnaliseDetalhe} >Observações</Button>
                                      </> 
                                    </td> 
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
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
                </tbody>
            </TableGrid>
            <FooterButton>
              <ButtonCancelar onClick={handleVoltar}>Voltar</ButtonCancelar>
              {testeOptico.analises[0].status == 'REPROVADO' ? (
                <ButtonConfirma style={{backgroundColor:'#00ce59'}} onClick={Adicionar} >APROVAR</ButtonConfirma>
              ) :(
                <ButtonConfirma style={{backgroundColor:'#fa1e1e'}} onClick={Adicionar} >REPROVAR</ButtonConfirma>
              )}
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