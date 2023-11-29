import React, { useEffect, useState } from "react"
import { Container } from "./styles"
import { GlobalStyle, Template } from "../../GlobalStyle"
import { useAuth } from "../../contexts/auth"
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header"
import Footer from "../../components/Footer"

function BaseAcumulada() {
    GlobalStyle();
        
    return (
      <>
        <Template>
          <Header title={"Base Acumulada"} />
            <Container>
                <p>BASE ACUMULADA</p>    
            </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default BaseAcumulada;