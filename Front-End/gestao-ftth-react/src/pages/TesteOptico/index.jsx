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

function TesteOptico() {
  GlobalStyle();

  const [testeOptico, setTesteOptico] = useState({});
  const [dropConstrutora, setDropConstrutora] = useState([]);
  const [construtora, setConstrutora] = useState("");
  const [dropEstacao, setDropEstacao] = useState([]);
  const [estacao, setEstacao] = useState("");
  const [dropUf, setDropUf] = useState([]);
  const [uf, setUf] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cdoInput, setCdoInput] = useState('');
  const [loading, setLoading] = useState();
  const [dateInputRecebimento, setDateInputRecebimento] = useState('');
  const [dateInputTeste, setDateInputTeste] = useState('');
  const [dateInputConstrucao, setDateInputConstrucao] = useState('');

  const navigate = useNavigate();

  async function fetchDropConstrutora(coluna){
    const data = await DropTesteOptico(coluna);
    setDropConstrutora(data);
  }

  async function fetchDropEstacao(coluna){
    const data = await DropTesteOptico(coluna);
    setDropEstacao(data);
  }

  async function fetchDropUf(coluna){
    const data = await DropTesteOptico(coluna);
    setDropUf(data);
  }

  async function fetchTesteOptico() {
    const _dateInputRecebimento = dateInputRecebimento.replace(/\D/g, '-');
    const _dateInputTeste = dateInputTeste.replace(/\D/g, '-');
    const _dateInputConstrucao = dateInputConstrucao.replace(/\D/g, '-');

    const filtro = {
      pagina : currentPage,
      UF : uf,
      Construtora : construtora,
      Estacao : estacao,
      CDO: cdoInput,
      DataTeste : _dateInputTeste,
      DataRecebimento : _dateInputRecebimento,
      DataConstrucao : _dateInputConstrucao
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
    fetchDropConstrutora("Construtora");
    fetchDropEstacao("Estacao");
    fetchDropUf("UF");
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
    fetchTesteOptico();
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
    fetchTesteOptico();
    setCurrentPage(1);

  };

  return (
      <>
      <Template>
        <Header title={"Teste Óptico"} />
          <Content>
            <SubMenu>
              <ButtonImport onClick={handleImportar} >Importar Xlsx</ButtonImport>
             </SubMenu>
            <Filter>
              <DropBox label={"UF"} event={handleUf} lista={dropUf} text={uf} /> 
              <DropBox label={"Construtora"} event={handleConstrutora} lista={dropConstrutora} text={construtora} />
              <DropBox label={"Estação"} event={handleEstacao} lista={dropEstacao} text={estacao} />   
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
            </Filter>
            { testeOptico.resultado !== undefined ? (
              loading ? (  
            <DataGridTable 
              columns={columns} 
              rows={testeOptico.resultado} 
              paginacao={testeOptico.paginacao}
              pagina={currentPage}
              left={prevPage}
              right={nextPage} 
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