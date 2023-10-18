import React, {useState, useEffect, useRef} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Content, GlobalStyle, RotuloTitulo, Template } from '../../../GlobalStyle';
import { getVisualizarArquivo } from "../../../api/base";
import { ImportArea, InputImport, ButtonUpload, ImagemArea } from "./style";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';
import DialogAlert from "../../../components/Dialog";
//import { useForm } from "react-hook-form";

function Imagem(){
    const [testeOptico, setTesteOptico] = useState([]);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [visible, setVisible] = useState(false);
    const { uf, estacao, cdo } = useParams();
    const [cdoia, setCdoia] = useState();
    const [imageName, setImageName] = useState();
    const [urlImage, setUrlImage] = useState("");
    const [mensagem, setMensagem] = useState();
    const [dialogAviso, setDialogAviso] = useState()

    const navigate = useNavigate();
    const inputRef = useRef(null);

    async function fetchUpaloadArquivo(arquivo){
        const data = await ImportarArquivo(arquivo).finally(() => setLoading(true));
        setMensagem(data);
    }

    async function fetchVizualizarArquivo() {
      const filtro = {
          UF : uf,
          Estacao : 'bot',
          CDO: cdo,
          CDOIA: cdoia,
          ImageName: imageName,
      };
      const data = await getVisualizarArquivo(filtro).finally(() => setLoading(true));

      setTesteOptico(data)

    }
         
      useEffect(() => {
          fetchVizualizarArquivo();
    
      }, [loading]);

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

      function groupUrlsByFolders(testeOptico) {
        const groupedUrls = {};
      
        testeOptico.forEach((url) => {
          const parts = url.split("\\");
          let currentGroup = groupedUrls;

          // Ignoramos o primeiro e o último elemento, pois são partes da URL fixas
          for (let i = 6; i < parts.length; i++) {
            const folder = parts[i].split('/')[0];
            currentGroup[folder] = currentGroup[folder] || {};
            currentGroup = currentGroup[folder];
          }
      
          currentGroup.urls = currentGroup.urls || [];
          currentGroup.urls.push(url);
        });

        return groupedUrls;
      }

      const groupedTesteOptico = groupUrlsByFolders(testeOptico);

      const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };

      const handleUpload = async () => {
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

      const Delete = () => {
        setVisible(true);
      }
    
      const ExcluirFecth = () => {
        setVisible(false);
      }

      const handleButtonClick = (url) => {
        setUrlImage(url);
      };

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Teste Óptico - Imagem"} />
        <Content>
          { dialogAviso ? (
            <DialogAlert 
                  visibleDiag={visible} 
                  visibleHide={() => setVisible(false)}
                  header={<h4>Aviso</h4>}
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
                <DialogAlert 
                  visibleDiag={visible} 
                  visibleHide={() => setVisible(false)}
                  header={<h4>Atenção</h4>}
                  colorType={'#13293d'}
                  ConfirmaButton={true}
                  textCloseButton={'Cancelar'}
                  text={
                    <>
                      <p>Esta ação é irreversível</p>
                      <p></p>
                      <p>Tem certeza que gostaria de excluir esse imagem?</p>
                    </>
                  }
                  buttonConfirmar={() => ExcluirFecth()} 
                />
              )
            }
            <ImportArea>
                <InputImport onChange={handleFileChange} type="file"
                ref={inputRef} 
                accept=".jpg, .jpeg, .png, .jfif, .bmp, .dwg" />
                <ButtonUpload onClick={handleUpload} >Upload</ButtonUpload>
            </ImportArea>
            <RotuloTitulo><p>{uf} - {estacao}- {cdo}</p></RotuloTitulo>
            <ImagemArea>
            {testeOptico[0] != undefined ? (
              <>
              <div className="menuImagem">
             {Object.keys(groupedTesteOptico).map((folderName, folderIndex) => (
                <div key={folderIndex}>
                  <div style={{
                    backgroundColor:'#13293d',
                    color: '#ffffff',
                    padding: '0.3rem'
                  }}>{folderName}</div>
                  <ul>
                    {groupedTesteOptico[folderName]?.urls?.map((url, urlIndex) => (
                      <li key={urlIndex} onClick={() => handleButtonClick(url)}>
                        {url.replace(/^.*[\\\/]/, '')}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="displayImagem">
              {
                urlImage && urlImage.replace(/^.*[\\\/]/, '').match(/\.[0-9a-z]+$/i)[0] != '.dwg' ?
               (
                <>
                  <div className="propImagem"><a onClick={Delete}>DELETAR</a></div>
                  <img src={urlImage} alt={`Imagem_${urlImage}`} />
                </>
               ) : (<p>DWG</p>)
              }
            </div>
            </>
          ):(<p style={{
            padding: '0.5rem',
            fontSize: '0.8rem'
          }}>Nenhum resultado</p>)}
          </ImagemArea>
        </Content>
            <Footer />
        </Template>
        </>
    );
}

export default Imagem;