import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from 'react-router-dom';
import { Content, GlobalStyle, RotuloTitulo, Template } from '../../../GlobalStyle';
import { getControleCdo, ImportarArquivo} from "../../../api/testeOptico";
import { DownloadArquivo } from "../../../api/base";
import DataGridTable from '../../../components/DataGrid';
import { ImportArea, InputImport, ButtonUpload, ButtonDownload, LinhaVertical } from "./style";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';
import DialogAlert from "../../../components/Dialog";
import InfoDataBase from '../../../components/DbInfo';

function ImportFile(){
    const [testeOptico, setTesteOptico] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [visible, setVisible] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [dialogAviso, setDialogAviso] = useState()
    const [event, setEvent] = useState({});

    const navigate = useNavigate();
    const inputRef = useRef(null);
    const { name } = event.target ?? "";

    async function fetchDownloadModelo(){
        await DownloadArquivo();
    }

    async function fetchUpaloadArquivo(arquivo){
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

    async function fetchTesteOptico() {
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
    
        const response = await getControleCdo(filtro);

        if(response.status == 200) {
          setTesteOptico(response.data);

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
    
      // Função para avançar para a próxima página
      const nextPage = async () => {
        setCurrentPage(currentPage + 1);
        setLoading(false);
      };
    
      // Função para retroceder para a página anterior
      const prevPage = async () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        setLoading(false);
      };
     
      useEffect(() => {
          fetchTesteOptico();

      }, [loading]);

      const columns = [
        { key: 'id', name: 'ID' },
        { key: 'id_MaterialRede', name: 'NETWIN' },
        { key: 'uf', name: 'UF' },
        { key: 'construtora', name: 'CONSTRUTORA' },
        { key: 'estacao', name: 'ESTACÃO' },
        { key: 'dataRecebimento', name: 'DATA RECEBIMENTO' },
        { key: 'dataConstrucao', name: 'DATA CONSTRUÇÃO' },
        { key: 'dataTeste', name: 'DATA TESTE' },
        { key: 'cdo', name: 'CDO' },
        { key: 'cabo', name: 'CABO' },
        { key: 'celula', name: 'CELULA' },
        { key: 'totalUMs', name: 'UMS' },
        { key: 'tecnico', name: 'TECNICO' },
      ];

      const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };

      const handleUpload = async (e) => {
        setEvent(e);

        if(file){
          await fetchUpaloadArquivo(file)
          setDialogAviso(false);
          setVisible(true);
          setLoading(false);
        }else{
          setDialogAviso(true);
          setMensagem("Nenhum arquivo selecionado.");
          setVisible(true);
        }
      };
    
      const downloadModelo = async ()=> {
        await fetchDownloadModelo();
      }

      const fetchLoading = () => {
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
            <RotuloTitulo><p>-- Controle de CDOs --</p></RotuloTitulo>
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
              ):(<Spinner />)
            ) : ( <Spinner /> )
            }
        </Content>
        <Footer />
        </Template>
        </>
    );
}

export default ImportFile;