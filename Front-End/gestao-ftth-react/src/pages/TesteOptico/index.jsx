import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, GlobalStyle, Template } from "../../GlobalStyle";
import { DropTesteOptico, getTesteOptico } from "../../api/testeOptico";
import ButtonDefaut from '../../components/Button/ButtonDefaut';
import ButtonSearch from '../../components/Button/ButtonSeach';
import DataGridTable from '../../components/DataGrid';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Spinner from '../../components/Spinner';
import TextInput from '../../components/TextInput';
import { DateMask } from "../../components/TextInput/mask/index";
import DropBox from '../../components/dropbox';
import { Filter, ButtonImport, SubMenu } from './styles';
import DialogAlert from "../../components/Dialog";
import InfoDataBase from '../../components/DbInfo';

function TesteOptico() {
  GlobalStyle();

  const [testeOptico, setTesteOptico] = useState({});
  const [dropConstrutora, setDropConstrutora] = useState([]);
  const [construtora, setConstrutora] = useState("");
  const [dropEstacao, setDropEstacao] = useState([]);
  const [estacao, setEstacao] = useState("");
  const [dropCabo, setDropCabo] = useState([]);
  const [cabo, setCabo] = useState("");
  const [dropUf, setDropUf] = useState([]);
  const [uf, setUf] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cdoInput, setCdoInput] = useState('');
  const [loading, setLoading] = useState();
  const [dropLoading, setDropLoading] = useState();
  const [dateInputRecebimento, setDateInputRecebimento] = useState('');
  const [dateInputTeste, setDateInputTeste] = useState('');
  const [dateInputConstrucao, setDateInputConstrucao] = useState('');
  const [visible, setVisible] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const navigate = useNavigate();

  async function fetchDropFilter () {
    
    try {
      const uf = await DropTesteOptico("UF");

      if(uf.status == 200) {
        setDropUf(uf.data);

        const estacao = await DropTesteOptico("Estacao");

        if(estacao.status == 200) {
          setDropEstacao(estacao.data);

          const cabo = await DropTesteOptico("Cabo");

          if(cabo.status == 200) {
            setDropCabo(cabo.data);

            const celula = await DropTesteOptico("Celula");

            if(celula.status == 200) {
              setDropConstrutora(celula.data);

            
            }   
          }
        }
      }
      
    } catch (error) {
      setDropLoading(true);
      
    } finally {
      setDropLoading(true);

    }
  }

  async function fetchTesteOptico () {

    try {
      const _dateInputRecebimento = dateInputRecebimento.replace(/\D/g, '-');
      const _dateInputTeste = dateInputTeste.replace(/\D/g, '-');
      const _dateInputConstrucao = dateInputConstrucao.replace(/\D/g, '-');

      const filtro = {
        pagina : currentPage,
        UF : uf,
        Celula : construtora,
        Estacao : estacao,
        CDO: cdoInput,
        Cabo: cabo,
        DataTeste : _dateInputTeste,
        DataRecebimento : _dateInputRecebimento,
        DataConstrucao : _dateInputConstrucao
      };

      const response = await getTesteOptico(filtro);

      if(response.status == 200) {
        setTesteOptico(response.data);
      }

    } catch (error) {
      setMensagem(`Erro ao carregar.`)
      setVisible(true);
      setLoading(true);
      
    } finally {
      setLoading(true)
    }

  }

  // Função para avançar para a próxima página
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    setLoading(false);
  };

  // Função para retroceder para a página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDropFilter()

  },[dropLoading])

  useEffect(() => {
    fetchTesteOptico();

  }, [loading, currentPage]);

  const columns = [
    { key: 'id', name: 'ID' },
    { key: 'id_MaterialRede', name: 'NETWIN' },
    { key: 'uf', name: 'UF' },
    { key: 'estacao', name: 'ESTACÃO' },
    { key: 'cabo', name: 'CABO' },
    { key: 'celula', name: 'CELULA' },
    { key: 'cdo', name: 'CDO' },
    { key: 'construtora', name: 'CONSTRUTORA' },
    { key: 'dataRecebimento', name: 'DATA RECEBIMENTO' },
    { key: 'dataConstrucao', name: 'DATA CONSTRUÇÃO' },
    { key: 'dataTeste', name: 'DATA TESTE' },    
    { key: 'totalUMs', name: 'UMS' },
    { key: 'tecnico', name: 'TECNICO' },
  ];

  const handleUf = (event) => {
    const input = event.target.value;
    setUf(input);
  };

  const handleConstrutora = (event) => {
    const input = event.target.value;
    setConstrutora(input);
  };

  const handleEstacao = (event) => {
    const input = event.target.value;
    setEstacao(input);
  };

  const handleCabo = (event) => {
    const input = event.target.value;
    setCabo(input);
  };

  const handleCdo = (event) => {
    const input = event.target.value;
    setCdoInput(input);
  };

  const handleDateRecebimento = (event) => {
    const formattedDate = DateMask(event);
    setDateInputRecebimento(formattedDate);
  };

  const handleDateTeste = (event) => {
    const formattedDate = DateMask(event);
    setDateInputTeste(formattedDate);
  };

  const handleDateConstrucao = (event) => {
    const formattedDate = DateMask(event);
    setDateInputConstrucao(formattedDate);
  };

  const handleImportar = () => {
    navigate('/TesteOptico/Importar');
  };

  const submit = () => {
    setLoading(false);
    setCurrentPage(1);
  };

  const limparFiltro = () => {
    setLoading(false);
    setUf("");
    setConstrutora("");
    setEstacao("");
    setCdoInput("");
    setDateInputRecebimento("");
    setDateInputConstrucao("");
    setDateInputTeste("");
    setCurrentPage(1);

  };

  const fetchLoading = () => {
    setLoading(false);
  }

  return (
      <>
      <Template>
        <Header title={"Teste Óptico"} />
          <Content>
          <InfoDataBase />
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
            <SubMenu>
              <ButtonImport onClick={handleImportar} >Controler CDOs</ButtonImport>
             </SubMenu>
            <Filter>
              <div>
              <div style={{display: 'flex'}}>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"UF"} event={handleUf} lista={dropUf.sort()} text={uf} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"300px"} height={"25px"} valueDefaut={""} label={"Estação"} event={handleEstacao} lista={dropEstacao.sort()} text={estacao} />
              </div>
              </div>
              <div style={{display: 'flex'}}>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Cabo"} event={handleCabo} lista={dropCabo.sort()} text={cabo} />
              </div>
              <div style={{marginLeft: '1rem', marginTop: '0.7rem'}}>
                <DropBox width={"150px"} height={"25px"} valueDefaut={""} label={"Celula"} event={handleConstrutora} lista={dropConstrutora.sort((a, b) => parseInt(a, 10) - parseInt(b, 10))} text={construtora} />
              </div>    
              <TextInput label={"CDO"} event={handleCdo} text={cdoInput} />
              <TextInput 
                label={"Data Recebimento"} 
                event={handleDateRecebimento} 
                text={dateInputRecebimento}
                placeholder={"__/__/____"} 
              />
              <TextInput 
                label={"Data Construção"}
                event={handleDateConstrucao} 
                text={dateInputConstrucao}
                placeholder={"__/__/____"} 
              />          
              <TextInput 
                label={"Data Teste"}
                event={handleDateTeste} 
                text={dateInputTeste}
                placeholder={"__/__/____"} 
              />
              <ButtonSearch event={submit} />
              <ButtonDefaut event={limparFiltro} text={"Limpar"} />
              </div>
              </div>          
            </Filter>
            { testeOptico.resultado !== undefined ? (
              loading ? (  
            <DataGridTable 
              columns={columns} 
              rows={testeOptico.resultado} 
              paginacao={testeOptico.paginacao}
              pagina={currentPage}
              sel={testeOptico.sel}
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
    )
  }
  
  export default TesteOptico;