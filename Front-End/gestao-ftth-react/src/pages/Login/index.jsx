import React, { useEffect, useState } from "react"
import { Input, Div, Button, Title, Container, Background } from "./styles"
import { GlobalStyle, Template } from "../../GlobalStyle"
import { UseAuth } from "../../contexts/auth"
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Spinner from "../../components/Spinner";
import StatusInforme from "../../components/StatusInforme";
import logo from "../../../public/imagens/logictel.png";

function Login() {
    GlobalStyle();

    const {Login, status, loading} = UseAuth();
    const navigate = useNavigate();
    const [msg, setMsg] = useState("");
    const [inputLogin, setInputLogin] = useState("");
    const [inputSenha, setInputSenha] = useState("");
    const refreshToken = sessionStorage.getItem("@App:token");
      
    async function HandleLogin() {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <Background>
        <Template>
          <Header />
            <Container>
              { !loading ? (<Spinner />) :(
               status ? (
                <>
              <Div>
                <div style={{backgroundColor:'#13293d', padding: '0.1rem', display: 'flex', justifyContent: 'center', width: '100%'}}>
                  <img width={100} src={logo} />
                </div>
                <div>
                  <Title>Gestão FTTH | Acessar</Title>
                  <p style={{fontSize: '0.8rem', color: 'red', textAlign: 'center', fontWeight: '600'}}>{msg}</p>
                 </div> 
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <label>Login</label>
                  <Input onChange={handleInputLogin} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <label>Senha</label>
                  <Input onChange={handleInputSenha} type='password' />
                </div>
                  <Button onClick={HandleLogin}>Entrar</Button>
                  <div style={{height:'20px'}}></div>
                      <p style={{position: 'absolute',fontSize:'0.7rem', right:0, bottom:0, marginRight:'0.5rem'}}>Version 1.0-Beta</p>
              </Div>
              </>
              ):( <StatusInforme text={"-- Servidor offline ou em manutenção --"} />)
              )
              }
              
              </Container>
            <Footer />
          </Template>
          </Background>
        </>
      )
  }
  
  export default Login;