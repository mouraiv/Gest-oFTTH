import React, {useState, useEffect, useRef} from "react";
import { useNavigate } from 'react-router-dom';
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
    const [uf, setUf] = useState();
    const [estacao, setEstacao] = useState();
    const [cdo, setCdo] = useState();
    const [cdoia, setCdoia] = useState();
    const [imageName, setImageName] = useState();
    const [urlImage, setUrlImage] = useState(null);
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
          UF : 'rj',
          Estacao : 'bot',
          CDO: 'cdoe-8204',
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
    
      const ExcluirFecth = async () => {
        inputRef.current.value = null;
        setFile(null)
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
                    <p>{mensagem}</p>
                    </>
                  }
                  buttonConfirmar={() => ExcluirFecth()} 
                />
              )
            }
            <ImportArea>
                <InputImport onChange={handleFileChange} type="file"
                ref={inputRef} 
                accept="" />
                <ButtonUpload onClick={handleUpload} >Upload</ButtonUpload>
            </ImportArea>
            <RotuloTitulo><p>-- Controle de CDOs --</p></RotuloTitulo>
            <ImagemArea>
              <div className="menuImagem">
                {testeOptico.map((url, index) => (
                  <div key={index}>
                    <ul>
                      <li onClick={() => handleButtonClick(url)}>
                        {url.replace(/^.*[\\\/]/, '')}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            <div className="displayImagem">
              {urlImage && <img src={urlImage} alt="Imagem Selecionada" />}
            </div>
          </ImagemArea>
        </Content>
            <Footer />
        </Template>
        </>
    );
}

export default Imagem;