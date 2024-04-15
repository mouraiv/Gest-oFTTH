import React, { useEffect, useState, useRef } from "react"
import { Input, Div, Button, Title, Container, Background } from "./styles"
import { GlobalStyle, Template } from "../../GlobalStyle"
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { UseAuth } from "../../contexts/auth"
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Spinner from "../../components/Spinner";
import StatusInforme from "../../components/StatusInforme";
//import logo from "../../../public/imagens/logictel.png";
import wp from '../../../public/imagens/wp_ftth.png'
import { VerificarStatusLogin, UpdateStatusLogin } from "../../Api/statusLogin";
import { TestarUsuario } from "../../Api/usuario";

function Login() {
    GlobalStyle();

    const {Login, status, loading} = UseAuth();
    const navigate = useNavigate();

    const [msg, setMsg] = useState("");
    const [inputLogin, setInputLogin] = useState("");
    const [inputSenha, setInputSenha] = useState("");
    const [forceLogout, setForceLogout] = useState(false);

    const refreshToken = sessionStorage.getItem("@App:token");
;
    const valueRef = useRef(null);

    async function FetchVerificarStatus() {
      try {
            const input = valueRef.current.value;

              const response = await TestarUsuario(inputLogin);
             
              if(response.status === 200){
                const usuario = response.data;
                
                if(inputLogin !== "" && inputSenha !== "") {
                  if(validateCaptcha(input)){
                    if(usuario.login === false || usuario.pws === false) {
                        setMsg("*Login/Senha incorreto.");
        
                    } else {
                      if(forceLogout === false){
                        if(usuario.statusLogin?.status === 2){
                          setMsg("*Usuário já está logado!");
        
                        }else{                          
                          const responseUsuario = await Login({
                            login: inputLogin,
                            senha: inputSenha,
                          });
              
                          if(responseUsuario.status === 200){
                            await FetchEditarStatus(usuario.id_Usuario,2);
                            navigate('/Home');
                            setMsg("");
                          }

                        }

                      }else{
                        await FetchEditarStatus(usuario.id_Usuario, 1);
                          
                        const responseUsuario = await Login({
                          login: inputLogin,
                          senha: inputSenha,
                        });
              
                        if(responseUsuario.status === 200){
                          await FetchEditarStatus(usuario.id_Usuario,2);
                          navigate('/Home');
                          setMsg("");
                        }
                      }   
                    }

                  }else{
                    setMsg("*Captcha inválido"); 
                  }

                }else{
                  inputSenha === "" ? setMsg("*Campo senha obrigatório") : "";       
                  inputLogin === "" ? setMsg("*Campo login obrigatório") : "";

                }

              }else{
                setMsg("*Erro no login"); 

              }
              
      } catch (error) {
        console.log("Erro de conexão " + error);
      } 
    }

    async function FetchEditarStatus(id, status) {
      try {
          const statusData = {};

          statusData.status = status;
          statusData.id_Usuario = id;

          const response = await UpdateStatusLogin(statusData);

          if(response.status === 200){
            console.log("editado")
          }
     
      } catch (error) {
        console.log("Erro de conexão " + error);
      } 
    }

    const loadCaptcha = async () => {
      await loadCaptchaEnginge(5, '#CCD1D1', '#000000', 'lower');
    };

    useEffect(() => {  
      console.log(refreshToken);
      if(refreshToken){
        navigate('/Home');
      }

      if (loading) {
        loadCaptcha();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[loading])

    const handleInputLogin = (event) => {
        const input = event.target.value;
        setInputLogin(input);
    }

    const handleInputSenha = (event) => {
        const input = event.target.value;
        setInputSenha(input);
    }

    const handleForceLogoutChange = (event) => {
      setForceLogout(event.target.checked);
    }

    return (
      <>
        <Template>
          <Header />
            <Container>
              { !loading ? (
               <div style={{backgroundColor: 'whitesmoke', width: '100%', height: '100%'}}> 
              <Spinner />
              </div>
              ) :(
               status ? (
                <>
              <Div>
                <div style={{backgroundColor:'#13293d', padding: '0.1rem', display: 'flex', justifyContent: 'center', width: '100%'}}>
                  <a style={{color: 'white', fontWeight: '600'}}>SGF</a>
                </div>
              <div style={{padding: '1rem'}}>
                <div style={{width:'100%'}}>          
                  <Title><b>|</b> Acessar</Title>
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
                {loading &&
                <div style={{display: 'flex', flexDirection: 'row', marginTop:'1rem'}}>
                <LoadCanvasTemplate reloadColor="red"/>
                <input style={{width: '120px', height:'31px', marginLeft: '0.3rem', paddingLeft: '0.3rem', fontWeight: '600', fontSize:'1rem', borderRadius: '0', border: '1px solid #616A6B'}} ref={valueRef} placeholder="Insira captcha" type="text" />
                </div>
                }
                 <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                  <input type="checkbox" id="forceLogout" checked={forceLogout} onChange={handleForceLogoutChange} />
                  <label htmlFor="forceLogout" style={{ marginLeft: '0.5rem' }}>Forçar Logout</label>
                  </div>
                  <Button onClick={FetchVerificarStatus}>Entrar</Button>
                </div>
                  <div style={{height:'20px'}}></div>
                      <p style={{position: 'absolute',fontSize:'0.7rem', right:0, bottom:0, marginRight:'0.5rem'}}>Version 1.0-Beta</p>  
              </Div>
              <div style={{ width: '100%', height: '100%', padding: '2rem'}}>
                <img width={'900px'} src={wp} />
              </div>
              </>
              ):( 
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'whitesmoke', width: '100%', height: '100%'}}>   
                <StatusInforme text={"-- Servidor offline ou em manutenção --"} />
              </div>
              )
              )
              }
              
              </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default Login;