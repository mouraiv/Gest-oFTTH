import React, { useEffect, useState } from "react"
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

    const {Login, status, loading, user} = useAuth();
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [inputLogin, setInputLogin] = useState("");
    const [inputSenha, setInputSenha] = useState("");
    const refreshToken = sessionStorage.getItem("@App:token");
      
    async function handleLogin() {
      try {

        if(inputLogin !== "" && inputSenha !== "") {
        const response = await Login({
          login: inputLogin,
          senha: inputSenha,
        });

        if(response.data.login === false || response.data.pws === false) {
          setMsg("Login/Senha incorreto.");
        } else {
          navigate('/Home');
          setMsg("");
        }
      } else {
        inputSenha === "" ? setMsg("*Campo senha obrigatório") : "";       
        inputLogin === "" ? setMsg("*Campo login obrigatório") : "";
      }    

      } catch (error) {
        console.log("Erro de conexão " + error);

      } 
    }

    useEffect(() => {
      if(refreshToken){
        navigate('/Home');
      }

    },[])

    const handleInputLogin = (event) => {
        const input = event.target.value;
        setInputLogin(input);
    }

    const handleInputSenha = (event) => {
        const input = event.target.value;
        setInputSenha(input);
    }

    return (
      <>
        <Template>
          <Header />
            <Container>
              { !loading ? (<Spinner />) :(
               status ? (
                <div>
                <div style={{backgroundColor:'#13293d', padding: '0.1rem', display: 'flex', justifyContent: 'center'}}>
                  <img width={100} src="/public/imagens/logictel.png" />
                </div>
              <Div>
                <div>
                  <Title>Gestão FTTH | Acessar</Title>
                  <p style={{fontSize: '0.8rem', color: 'red', textAlign: 'center', fontWeight: '600'}}>{msg}</p>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <label>Login</label>
                  <Input onChange={handleInputLogin} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <label>Senha</label>
                  <Input onChange={handleInputSenha} type='password' />
                </div>
                  <Button onClick={handleLogin}>Entrar</Button>
                </div>
              </Div>
              </div>
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