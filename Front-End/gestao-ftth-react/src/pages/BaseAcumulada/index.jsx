import React, { useEffect, useState } from "react"
import { Container } from "./styles"
import { GlobalStyle, Template } from "../../GlobalStyle"
import EmDesenvolvimento from "../../../public/imagens/em_desenvolvimento.png"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

function BaseAcumulada() {
    GlobalStyle();
        
    return (
      <>
        <Template>
          <Header title={"Base Acumulada"} />
            <Container>
                <img src={EmDesenvolvimento} />   
            </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default BaseAcumulada;