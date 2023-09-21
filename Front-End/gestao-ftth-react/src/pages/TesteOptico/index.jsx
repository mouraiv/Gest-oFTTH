import React, { useState, useEffect } from 'react';
import { GlobalStyle, Template, Content } from "../../GlobalStyle"
import { getTesteOptico } from "../../api/testeOptico";
import DataGridTable from '../../components/DataGrid';
import Footer from "../../components/Footer";
import Header from "../../components/Header";

function TesteOptico() {
  GlobalStyle();

  const [testeOptico, setTesteOptico] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  async function fetchTesteOptico(page) {
    const data = await getTesteOptico(page);
    setTesteOptico(data);
  }

  useEffect(() => {
    fetchTesteOptico(1);

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

  // Função para avançar para a próxima página
  const nextPage = () => {
    setCurrentPage(currentPage + 100);
    fetchTesteOptico(currentPage + 100);
  };

  // Função para retroceder para a página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 100);
      fetchTesteOptico(currentPage - 100);
    }
  };

  console.log(currentPage);

  return (
      <>
      <Template>
        <Header title={"Teste Óptico"} />
          <Content>
            { testeOptico.resultado !== undefined ? (
            <DataGridTable 
              columns={columns} 
              rows={testeOptico.resultado} 
              paginacao={testeOptico.paginacao}
              pagina={currentPage}
              left={prevPage}
              right={nextPage} 
            />
            ) : ( <p>Carregando...</p> )
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default TesteOptico;