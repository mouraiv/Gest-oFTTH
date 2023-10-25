import React from "react"
import { Container } from "./styles"
import { GlobalStyle, Template } from "../../GlobalStyle"
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Spinner from "../../components/Spinner";

function Analise() {
    GlobalStyle();

    const navigate = useNavigate();
      
    return (
      <>
        <Template>
          <Header />
            <Container>
             <p>Analise</p>
              </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default Analise;