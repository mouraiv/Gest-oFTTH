import React, { useState, useEffect } from 'react';
import { GlobalStyle, Template, Content } from "../../GlobalStyle"
import { Filter } from './styles';
import { getTesteOptico, DropTesteOptico } from "../../api/testeOptico";
import { DateMask } from "../../components/TextInput/mask/index"
import DataGridTable from '../../components/DataGrid';
import Spinner from '../../components/Spinner';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import DropBox from '../../components/dropbox';
import TextInput from '../../components/TextInput';
import ButtonSearch from '../../components/buttonSearch';

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

    let filtro = {
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
    
  }, [currentPage]);

  useEffect(() => {
    fetchDropConstrutora("Construtora")
    fetchDropEstacao("Estacao")
    fetchDropUf("UF")
    setCurrentPage(1);
        
  }, []);

  const columns = [
    { key: 'rowIndex', name: '#' },
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

  const submit = () => {
    setLoading(false);
    setCurrentPage(1);
    fetchTesteOptico();
  };

  return (
      <>
      <Template>
        <Header title={"Teste Óptico"} />
          <Content>
            <Filter>
              <DropBox label={"UF"} event={handleUf} lista={dropUf} /> 
              <DropBox label={"Construtora"} event={handleConstrutora} lista={dropConstrutora} />
              <DropBox label={"Estação"} event={handleEstacao} lista={dropEstacao} />   
              <TextInput label={"CDO"} event={handleCdo} />
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