import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { Content, GlobalStyle, Template } from '../../../GlobalStyle';
import { getTesteOptico, ImportarArquivo } from "../../../api/testeOptico";
import { DownloadArquivo } from "../../../api/base";
import { ImportArea, InputImport, ButtonUpload, ButtonDownload, LinhaVertical } from "./style";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';

function ImportFile(){
    const [testeOptico, setTesteOptico] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState();
    const [file, setFile] = useState(null);

    const navigate = useNavigate();

    async function fetchDownloadModelo(){
        await DownloadArquivo();
    }
    
      async function fetchUpaloadArquivo(arquivo){
        const data = await ImportarArquivo(arquivo);
        console.log(data)
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
          DataConstrucao : ''
        };
    
        const data = await getTesteOptico(filtro).finally(() => {
          setLoading(true)
        });
        setTesteOptico(data);
      }
    
      // Função para avançar para a próxima página
      const nextPage = () => {
        setLoading(false);
        fetchTesteOptico();
        setCurrentPage(currentPage + 1);
      };
    
      // Função para retroceder para a página anterior
      const prevPage = () => {
        setLoading(false);
        fetchTesteOptico();
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      useEffect(() => {
        fetchTesteOptico();
        
      }, [ loading ]);
    
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

      const handleUpload = () => {
        fetchUpaloadArquivo(file)
      };
    
      const downloadModelo = ()=> {
        fetchDownloadModelo();
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
        </Content>
        <Footer />
        </Template>
        </>
    );
}

export default ImportFile;