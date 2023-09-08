import React from "react"
import { Input, Div, Button, Title, Container } from "./styles"
import { GlobalStyle, Template } from "../../GlobalStyle"
import Header from "../../components/Header"
import Footer from "../../components/Footer"


function Login() {
    GlobalStyle();
      return (
        <>
        <Template>
          <Header />
            <Container>
              <Div>
                <div>
                  <Title>Gestão FTTH | Acessar</Title>
                <div>
                  <Input></Input>
                </div>
                <div>
                  <Input type='password'></Input>
                </div>
                  <Button>Entrar</Button>
                </div>
              </Div>
              </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default Login