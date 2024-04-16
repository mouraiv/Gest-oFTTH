import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Content, GlobalStyle, Template } from "../../../GlobalStyle";
import { GetUsuario } from "../../../Api/usuario";
import DataGridTable from '../../../components/DataGrid/DataGridUsuario';
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import InfoDataBase from '../../../components/DbInfo';
import ProgressComponent from '../../../components/progress/ProgressComponent';
import { UseAuth } from "../../../contexts/auth";
import { SubMenu, ButtonImagem } from './styles';
import Spinner from '../../../components/Spinner';


function Usuarios() {
  GlobalStyle();

  /* estado lista teste óptico grid */
  const [usuario, setUsuario] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState();

  const navigate = useNavigate();

  const { user, ValidarToken } = UseAuth();
  const userPrivate = user.tipo ?? 1;

  const fetchUsuario = async () => {

    try {
      const response = await GetUsuario();

      if(response.status == 200) {
        setUsuario(response.data);
      }

    } catch (error) {
      console.log(`Houve um error : ${error}`)
      setLoading(true);
      
    } finally {
      setLoading(true)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  // Função para avançar para a próxima página
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
    setSubmitClicked(true)
  };

  // Função para retroceder para a página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    setSubmitClicked(true)
  };

  useEffect(() => {
    if(user && Object.keys(user).length !== 0){
    ValidarToken(user);
    }
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user])

  useEffect(() => {    
      fetchUsuario();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const columns = [
    { key: 'login', name: 'LOGIN',  width: '10%' },
    { key: 'getTecnico.nome', name: 'TÉCNICO', width: '10%' },
    { key: 'getTecnico.email', name: 'E-MAIL' },
    { key: 'getTecnico.getCargo.nome', name: 'CARGO', width: '15%' },
    { key: 'getTecnico.getEmpresa.nome', name: 'EMPRESA', width: '15%' },
  ];

  const fetchLoading = () => {
    setLoading(false);
  }

  const fetchAtualizar = () => {
    setLoading(false);
  }

  return (
      <>
      <Template>
        <Header title={"Usuários"} />
          <Content>
            {userPrivate === 3 ?
            <>  
          <InfoDataBase />
          <SubMenu>
              <ButtonImagem onClick={fetchAtualizar} >Atualizar</ButtonImagem>
          </SubMenu>
            { usuario !== undefined ? (
              loading ? (  
            <DataGridTable 
              columns={columns} 
              rows={usuario} 
              paginacao={1}
              pagina={26}
              left={prevPage}
              right={nextPage}
              atualizar={fetchLoading} 
            />
              ):( <Spinner />)
            ) : (  <Spinner /> )
            }
            </>
            :
            <p style={{
                border: "1px solid red",
                color: "red",
                padding: "1rem",
                fontSize: "1rem",
                fontWeight: "600",
                marginTop: "1rem",
                backgroundColor: "#fff4f4" 
            }}>ACESSO NEGADO!</p>
            }
          </Content>
        <Footer />
      </Template>
      </>
    )
  }
  
  export default Usuarios;