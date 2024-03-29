import React, {useState, useEffect, useRef} from "react";
import { useParams } from 'react-router-dom';
import { Content, GlobalStyle, RotuloTitulo, Template, ImputError, MsgError, MsgSucess } from '../../../GlobalStyle';
import { GetVisualizarArquivo, DeleteImagem, FazerUploadDeArquivo } from "../../../api/base";
import { ImportArea, NavArea, ButtonImport, InputImport, ButtonUpload, ImagemArea, ButtonDWG} from "./style";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Spinner from '../../../components/Spinner';
import DialogAlert from "../../../components/Dialog";

function Imagem(){
    const [testeOptico, setTesteOptico] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleImport, setVisibleImport] = useState(false);
    const { uf, sigla, estacao, cdo } = useParams();
    const [cdoia, setCdoia] = useState();
    const [urlImage, setUrlImage] = useState("");
    const [arquivo, setArquivo] = useState(null);
    const [mensagem, setMensagem] = useState({tipo: "", msg: ""});
    const [inputMensagem, setInputMensagem] = useState({tipo: "", msg: ""});

    const inputFile= useRef();
    const inputRef = useRef();
 
    async function FetchUploadImage(){

      try{
        const filtro = {
          UF : uf,
          Estacao : sigla,
          CDO: cdo,
          CDOIA: cdoia,
        };

        const response = await FazerUploadDeArquivo(arquivo, filtro);
       
        if (response.status == 200) {
          setMensagem({tipo: 'error', msg: ''});
          setMensagem({tipo: 'sucesso', msg: response.data});

        } 

      }catch(error){
        setMensagem({tipo: 'error', msg: "Erro ao realizar o upload." + error});
        setLoading(true);

      } finally {
        setLoading(true);

      }
    }

    async function FetchDeletaArquivo(){
      try {
        const response = await DeleteImagem(urlImage);

        if(response.status == 200) {
          setMensagem({tipo: 'sucesso', msg: response.data});
          setTesteOptico([]);

        }

      } catch (error) {
        setMensagem({tipo: 'error', msg: "Erro ao deletar."});
        setVisible(true);
        setLoading(true);
        
      } finally {
        setLoading(true)

      }
    }

    async function FetchVizualizarArquivo() {
      
        try {
          const filtro = {
            UF : uf,
            Estacao : sigla,
            CDO: cdo,
          };

          const response = await GetVisualizarArquivo(filtro);
         
          if(response.status == 200) {
            setTesteOptico(response.data)
          }

         }catch(error){
          setLoading(true);
        
        } finally {
          setLoading(true)
        }
      }
    
      useEffect(() => {
          FetchVizualizarArquivo();
          
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [loading]);

      function groupUrlsByFolders(testeOptico) {
        const groupedUrls = {};

        testeOptico.forEach((url) => {
          const parts = url.split("/");
          let folder = parts[parts.length - 2];

          let currentGroup = groupedUrls;
    
          currentGroup[folder] = currentGroup[folder] || [];
          currentGroup[folder].push(url);
        });

        return groupedUrls;
      }

      const groupedTesteOptico = groupUrlsByFolders(testeOptico);

      const Delete = () => {
        setVisible(true);
      }
    
      const ExcluirFecth = async () => {
        await FetchDeletaArquivo();
        setUrlImage("");
        setVisible(false);
        setLoading(false);
      }

      const handleButtonClick = (url) => {
        setUrlImage(url);
      };

      const handleImportar = () => {
        setMensagem(""),
        setVisibleImport(true);
      };

      const handleFileChange = (event) => {
        setArquivo(event.target.files); 
      };

      const handleChangeCdoia = (event) => {
        const _cdoia = `${cdo}.${event.target.value}`;
        setCdoia(_cdoia);
      }
    
      const handleUpload = async () => {
        
        if (arquivo) {
          await FetchUploadImage();
          
          if (inputFile.current) {
            inputFile.current.value = null;
          }
          
          inputRef.current ? (inputRef.current.value = null) : null;
          
          setArquivo(null);
          setInputMensagem({});
          setCdoia("");
          setLoading(false);

        } else {
          setInputMensagem({tipo: 'error', msg: 'Nenhum arquivo selecionado.'});
        }
      };

      const subpasta = (folder) => {
        const suaString = folder;
        const padrao = /^[A-Za-z]+-\d+_\d+\.[A-Za-z]+$/;

        if (padrao.test(suaString)) {
          return true;
        } else {
          return false
        }
      }

    GlobalStyle();
    return(
        <>
        <Template>
        <Header navbar={false} title={"Teste Óptico - Imagem"} />
        <Content>
                <DialogAlert 
                  visibleDiag={visibleImport} 
                  visibleHide={() => setVisibleImport(false)}
                  header={<h4>Importação de Imagens</h4>}
                  colorType={'#13293d'}
                  ConfirmaButton={false}
                  textCloseButton={'Fechar'}
                  text={
                    <>
                    { mensagem.tipo == 'sucesso' &&
                      <MsgSucess>
                        <p>{mensagem.msg}</p>
                      </MsgSucess> }{ 
                      mensagem.tipo == 'error' &&
                      <MsgError>
                        <p>{mensagem.msg}</p>
                      </MsgError>
                     }
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #5D6D7E',
                      backgroundColor: '#E5E8E8',
                      padding: '1rem'
                    }}>
                      { cdo.replace(/-.*$/, '') == 'CDOI' ?
                        <div>
                          {cdo}. <input ref={inputRef} onChange={handleChangeCdoia} style={{
                            width:'40px',
                            paddingLeft:'0.5rem',
                            fontWeight: '600',
                            fontSize:'0.9rem'
                          }} />
                        </div> : <div>{cdo}</div>
                      }
                      <ImportArea>
                        <InputImport onChange={handleFileChange} type="file"
                        ref={inputFile} 
                        accept=".jpg, .jpeg, .png, .jfif, .tiff, .bmp, .dwg" 
                        multiple/>
                        <ButtonUpload onClick={handleUpload} >Upload</ButtonUpload>
                      </ImportArea>
                       { inputMensagem.tipo == 'error' &&
                        <ImputError>
                          <p>{inputMensagem.msg}</p>
                        </ImputError>
                        }
                    </div>
                    </>
                  }
                />
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
            <NavArea>
                <ButtonImport onClick={handleImportar} >Importar</ButtonImport>
            </NavArea>
            <RotuloTitulo><p>{`${uf ?? ""} - ${sigla ?? ""} - ${cdo ?? ""}`}</p></RotuloTitulo>
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
                              {groupedTesteOptico[folderName].map(
                                (url, urlIndex) => (
                                  <li key={urlIndex} onClick={() => handleButtonClick(url)}>
                                    {url.replace(/^.*[\\\/]/, '')}
                                  </li>
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