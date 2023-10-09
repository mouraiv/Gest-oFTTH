import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { Content, GlobalStyle, RotuloTitulo, Template } from '../../../GlobalStyle';
import { getControleCdo, ImportarArquivo, deleteTesteOptico } from "../../../api/testeOptico";
import { DownloadArquivo } from "../../../api/base";
import DataGridTable from '../../../components/DataGrid';
import { ImportArea, InputImport, ButtonUpload, ButtonDownload, LinhaVertical } from "./style";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';

function ImportFile(){
    const [testeOptico, setTesteOptico] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingInput, setLoadingInput] = useState(false);
    const [file, setFile] = useState(null);

    const navigate = useNavigate();

    async function fetchDownloadModelo(){
        await DownloadArquivo();
    }

    async function fetchUpaloadArquivo(arquivo){
        const data = await ImportarArquivo(arquivo).finally(() => {
          setLoadingInput(true)
        });
    }

    async function fetchTesteOptico() {    
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
    
        const data = await getControleCdo(filtro).finally(() => {
          setLoading(true)
        });
        setTesteOptico(data);
      }
    
      // Função para avançar para a próxima página
      const nextPage = async () => {
        setLoading(false);
        await fetchTesteOptico();
        setCurrentPage(currentPage + 1);
      };
    
      // Função para retroceder para a página anterior
      const prevPage = async () => {
        setLoading(false);
        await fetchTesteOptico();
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      useEffect(() => {
        fetchTesteOptico();
        
      }, [ loading, loadingInput ]);
    
      useEffect(() => {
        fetchTesteOptico();
        setCurrentPage(1);
            
      }, []);
    
      const columns = [
        { key: 'id', name: 'ID' },
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

      const handleUpload = async () => {
        fetchUpaloadArquivo(file)
        setLoading(false);
        await fetchTesteOptico();
      };
    
      const downloadModelo = async ()=> {
        await fetchDownloadModelo();
      }

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Teste Óptico - Importação"} />
        <Content>
            <ImportArea>
                <InputImport onChange={handleFileChange} type="file" />
                <ButtonUpload onClick={handleUpload} >Upload</ButtonUpload>
                <LinhaVertical />
                <ButtonDownload onClick={downloadModelo} >Download Modelo</ButtonDownload>
            </ImportArea>
            <RotuloTitulo><p>-- Controle de CDOs --</p></RotuloTitulo>
            { testeOptico.resultado !== undefined ? (
              loading || loadingInput ? (  
            <DataGridTable 
              columns={columns} 
              rows={testeOptico.resultado} 
              paginacao={testeOptico.paginacao}
              pagina={currentPage}
              left={prevPage}
              right={nextPage}
              atualizar={fetchTesteOptico}
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