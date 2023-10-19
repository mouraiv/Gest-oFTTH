import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Content, GlobalStyle, RotuloTitulo, Template } from '../../../GlobalStyle';
import { getVisualizarArquivo, deleteImagem } from "../../../api/base";
import { ImportArea, ButtonUpload, ImagemArea, ButtonDWG } from "./style";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';
import DialogAlert from "../../../components/Dialog";

function Imagem(){
    const [testeOptico, setTesteOptico] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const { uf, estacao, cdo } = useParams();
    const [urlImage, setUrlImage] = useState("");
    const [url, setUrl] = useState("");
    const [mensagem, setMensagem] = useState();

    const navigate = useNavigate();

    async function fetchUpaloadArquivo(arquivo){
        const data = await ImportarArquivo(arquivo).finally(() => setLoading(true));
        setMensagem(data);
    }

    async function fetchDeletaArquivo(){
      const data = await deleteImagem(url).finally(() => setLoading(true));
      setMensagem(data);
    }

    async function fetchVizualizarArquivo() {
      const filtro = {
          UF : uf,
          Estacao : 'bot',
          CDO: cdo,
      };
      const data = await getVisualizarArquivo(filtro).finally(() => setLoading(true));

      setTesteOptico(data)

      }
    
      useEffect(() => {
          fetchVizualizarArquivo();
        
      }, [loading]);

      function groupUrlsByFolders(testeOptico) {
        const groupedUrls = {};
        let primeiroEncontrado = false;

        testeOptico.forEach((url) => {
          const parts = url.split("\\");
          let currentGroup = groupedUrls;

          primeiroEncontrado = true;

          // Ignoramos o primeiro e o último elemento, pois são partes da URL fixas
          for (let i = 5; i < parts.length; i++) {
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

      const Delete = () => {
        setUrl(urlImage.replace("http://localhost:5226/Uploads\\Anexos\\",""));
        setVisible(true);
      }
    
      const ExcluirFecth = async () => {
        await fetchDeletaArquivo();
        setUrlImage("");
        setLoading(false);
        setVisible(false);
      }

      const handleButtonClick = (url) => {
        setUrlImage(url);
      };

      const handleImportar = () => {
        navigate('/TesteOptico/Imagem/Importar');
      };

    GlobalStyle();
    return(
        <>
        <Template>
        <Header title={"Teste Óptico - Imagem"} />
        <Content>
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
            <ImportArea>
                <ButtonUpload onClick={handleImportar} >Importar</ButtonUpload>
            </ImportArea>
            <RotuloTitulo><p>{uf} - {estacao}- {cdo}</p></RotuloTitulo>
            <ImagemArea>
              {loading ? (
                testeOptico[0] !== undefined ? (
                  <>
                    <div className="menuImagem">
                      <div className="menuContainer">
                        {Object.keys(groupedTesteOptico).map((folderName, folderIndex) => (
                          <div key={folderIndex}>
                            <div
                              style={{
                                backgroundColor: '#13293d',
                                color: '#ffffff',
                                padding: '0.3rem',
                              }}
                            >
                              {folderName}
                            </div>
                            <ul>
                              {Object.keys(groupedTesteOptico[folderName]).map(
                                (subFolderName, subFolderIndex) => (
                                  <div key={subFolderIndex}>
                                    <div className={`folder_${subFolderIndex}`}
                                      style={{
                                        backgroundColor: '#13293d',
                                        color: '#ffffff',
                                        padding: '0.3rem',
                                      }}
                                    >
                                      {subFolderName}
                                    </div>
                                    <ul>
                                      {groupedTesteOptico[folderName][subFolderName].urls.map(
                                        (url, urlIndex) => (
                                          <li key={urlIndex} onClick={() => handleButtonClick(url)}>
                                            {url.replace(/^.*[\\\/]/, '')}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="displayImagem">
                      {urlImage &&
                      urlImage.replace(/^.*[\\\/]/, '').match(/\.[0-9a-z]+$/i)[0] == '.dwg' ? (
                        <div>
                          <ButtonDWG>Visualizar DWG</ButtonDWG>
                        </div>
                      ) : (
                        urlImage !== "" ? (
                        <>
                        <div className="propImagem">
                          <a onClick={Delete}>DELETAR</a>
                        </div>
                        <img src={urlImage} alt={`Imagem_${urlImage}`} />
                        </>
                        ):(<p style={{fontSize: '0.8rem', marginLeft: '1rem', fontWeight: '600'}}>Selecione uma imagem</p>)
                      )}
                    </div>
                  </>
                ) : (
                  <p style={{ padding: '0.5rem', fontSize: '0.8rem' }}>Nenhum resultado</p>
                )
              ) : (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spinner />
                </div>
              )}
            </ImagemArea>
        </Content>
            <Footer />
        </Template>
        </>
    );
}

export default Imagem;