import React from "react"
import { Input, Div, Button, Title, Container } from "./styles"
import { GlobalStyle, Template } from "../../GlobalStyle"
import { useAuth } from "../../contexts/auth"
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Spinner from "../../components/Spinner";
import StatusInforme from "../../components/StatusInforme";

function Login() {
    GlobalStyle();

    const {Login, status, loading} = useAuth();
    const navigate = useNavigate();
      
    async function handleLogin() {
      await Login({
        login: 'wesley.moura',
        senha: '1234',
      });

      navigate('/TesteOptico');
    }

    return (
      <>
        <Template>
          <Header />
            <Container>
              { !loading ? (<Spinner />) :(
               status ? (
              <Div>
                <div>
                  <Title>Gestão FTTH | Acessar</Title>
                <div>
                  <Input></Input>
                </div>
                <div>
                  <Input type='password'></Input>
                </div>
                  <Button onClick={handleLogin}>Entrar</Button>
                </div>
              </Div>
              ):( <StatusInforme text={"-- Servidor offline ou em manutenção --"} />)
              )
              }
              </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default Login;