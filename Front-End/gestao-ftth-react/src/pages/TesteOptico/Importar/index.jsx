import React, {useState, useEffect, useRef, useCallback} from "react";
import { Content, GlobalStyle, RotuloTitulo, Template } from '../../../GlobalStyle';
import { GetControleCdo, ImportarArquivo} from "../../../api/testeOptico";
import { DownloadArquivo } from "../../../api/base";
import DataGridTable from '../../../components/DataGrid/DataGridTesteOptico';
import { ImportArea, InputImport, ButtonUpload, ButtonDownload, LinhaVertical, SubMenu, ButtonImagem } from "./style";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import { UseAuth } from "../../../contexts/auth";
import DialogAlert from "../../../components/Dialog";
import InfoDataBase from '../../../components/DbInfo';
import ProgressComponent from '../../../components/progress/ProgressComponent';

function ImportFile(){
    const [testeOptico, setTesteOptico] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [visible, setVisible] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [dialogAviso, setDialogAviso] = useState();
    const [event, setEvent] = useState({});
    const [submitClicked, setSubmitClicked] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const inputRef = useRef(null);
    const { name } = event.target ?? "";
    const { user, ValidarToken } = UseAuth();
    const userPrivate = user?.tipo ?? 1;

    const controller = new AbortController();
    const signal = controller.signal;

    async function FetchDownloadModelo(){
        await DownloadArquivo();
    }

    async function FetchUpaloadArquivo(arquivo){
      try {
        const importar = await ImportarArquivo(arquivo);

        if(importar.status == 200) {
          setMensagem(importar.data);

        } 
        
      } catch (error) {
        setMensagem("Erro ao realizar upload.");
        setLoading(true);
        
      } finally {
        setLoading(true);
      }
    }

    const fetchTesteOptico = useCallback(async () => {
      try {
        const filtro = {
          pagina : currentPage,
          UF : '',
          Construtora : '',
          Estacao : '',
          CDO: '',
          DataTeste : '',
          DataRecebimento : '',
          DataConstrucao : '',
          Set : 1
        };
    
        const response = await GetControleCdo(filtro, {signal});

        if(response.status == 200) {
          setTesteOptico(response.data);

        }

        } catch (error) {
          setDialogAviso(true);
          setMensagem(`Erro ao carregar.`)
          setVisible(true);
          setLoading(true);
          setInitialLoad(false);
          
        } finally {
          setLoading(true);

        }    
        
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [submitClicked]);
    
      // Função para avançar para a próxima página
      const nextPage = async () => {
        setCurrentPage(currentPage + 1);
        setSubmitClicked(true)
      };
    
      // Função para retroceder para a página anterior
      const prevPage = async () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        setSubmitClicked(true)
      };

      useEffect(() => {
        if(user && Object.keys(user).length !== 0){
        ValidarToken(user);
        }
          
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[user]);
     
      useEffect(() => {
        const handleVisibilityChange = () => {
          if (!document.hidden) {
            // A aba do navegador está visível, então fazemos a chamada para fetchTesteOptico
            fetchTesteOptico();
            setLoading(false);
            setSubmitClicked(false);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        if (initialLoad) {
          // Realiza a pesquisa inicial apenas uma vez ao carregar a página
          fetchTesteOptico();

        } else if (submitClicked) {
          // Realiza pesquisas apenas quando o botão de pesquisa é clicado
          fetchTesteOptico();
          setLoading(false);
          setSubmitClicked(false);
    
        } else {
    
          return () => { 
            controller.abort(); 
          };
        }

        return () => { 
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [fetchTesteOptico]);

      const columns = [
        { key: 'uf', name: 'UF', width: '2%'},
        { key: 'construtora', name: 'CONSTRUTORA', width: '10%'},
        { key: 'siglaEstacao', name: 'SIGLA', width: '5%' },
        { key: 'estacao', name: 'ESTACÃO', width: '10%'},
        { key: 'dataRecebimento', name: 'DATA RECEBIMENTO',  width: '10%' },
        { key: 'dataConstrucao', name: 'DATA CONSTRUÇÃO',  width: '10%' },
        { key: 'dataTeste', name: 'DATA TESTE', width: '10%' },
        { key: 'cdo', name: 'CDO',  width: '10%' },
        { key: 'cabo', name: 'CABO',  width: '5%' },
        { key: 'celula', name: 'CELULA', width: '5%' },
        { key: 'totalUMs', name: 'UMS',  width: '5%' },
        { key: 'tecnico', name: 'TECNICO',  width: '12%' },
      ];

      const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };

      const handleUpload = async (e) => {
        setEvent(e);

        if(file){
          await FetchUpaloadArquivo(file)
          setDialogAviso(false);
          fetchLoading();
          setLoading(false);
        }else{
          setDialogAviso(true);
          setMensagem("Nenhum arquivo selecionado.");
          setVisible(true);
        }
      };
    
      const downloadModelo = async ()=> {
        await FetchDownloadModelo();
      }

      const fetchLoading = (value) => {
        fetchTesteOptico();
        setLoading(value);
        setLoading(false);
      }

      const ExcluirFecth = () => {
        inputRef.current.value = null;
        setFile(null)
        setVisible(false);
      }

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Teste Óptico - Importação"} />
        <Content>
          { userPrivate !== 1 ||  userPrivate === 3 ?
          <>
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
                  buttonConfirmar={() => ExcluirFecth()} 
              />
              ):(
                name == 'upload' ? (
                  <DialogAlert 
                  visibleDiag={visible} 
                  visibleHide={() => setVisible(false)}
                  header={<h4>Aviso</h4>}
                  colorType={'#13293d'}
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
                  ConfirmaButton={true}
                  textCloseButton={'Cancelar'}
                  text={
                    <>
                    <p>{mensagem}</p>
                    </>
                  }
                  buttonConfirmar={() => ExcluirFecth()} 
                />
                )
              )
            }
            <InfoDataBase />
            <ImportArea>
                <InputImport onChange={handleFileChange} type="file"
                ref={inputRef} 
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                <ButtonUpload name="upload" onClick={handleUpload} >Upload</ButtonUpload>
                <LinhaVertical />
                <ButtonDownload onClick={downloadModelo} >Download Modelo</ButtonDownload>
            </ImportArea>
            <SubMenu>
              <ButtonImagem onClick={fetchLoading} >Atualizar</ButtonImagem>
            </SubMenu>
            <RotuloTitulo><p>Controle de CDOs</p></RotuloTitulo>
            { testeOptico.resultado !== undefined ? (
              loading ? (  
            <DataGridTable 
              columns={columns} 
              rows={testeOptico.resultado} 
              paginacao={testeOptico.paginacao}
              pagina={currentPage}
              left={prevPage}
              right={nextPage}
              atualizar={fetchLoading}
            />
              ):(<ProgressComponent />)
            ) : ( <ProgressComponent /> )
            }
            </>
            : <p style={{
              border: "1px solid red",
              color: "red",
              padding: "1rem",
              fontSize: "1rem",
              fontWeight: "600",
              marginTop: "1rem",
              backgroundColor: "#fff4f4" 
          }}>ACESSO NEGADO!</p>
          }
        </Content>
        <Footer />
        </Template>
        </>
    );
}

export default ImportFile;