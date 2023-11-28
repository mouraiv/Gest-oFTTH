import React from "react";
import { Container } from "./styles";
import { useAuth } from "../../contexts/auth";
import { GlobalStyle, Template } from "../../GlobalStyle";
import Header from "../../components/Header"
import InfoDataBase from "../../components/DbInfo"
import Footer from "../../components/Footer"
import Spinner from "../../components/Spinner";


function Home() {
    const { user } = useAuth();

    GlobalStyle();

    return (
      <>
        <Template>
          <Header title={"Início"} />
            <Container>
              <InfoDataBase />
             <div className="avisoInicial">
               <h5>Bem-vindo ao Sistema Gestão FTTH (Beta)!</h5>
                <br />
                <p>Caro(a) <b>{user.nome}</b>,</p>
                <br />
                <p>Gostaríamos de informar que o sistema está atualmente em fase beta, o que significa que estamos em constante evolução para oferecer a você a melhor experiência possível. Durante este período, você pode encontrar novos recursos sendo adicionados, melhorias sendo implementadas e ajustes sendo feitos para garantir o desempenho e a confiabilidade.

                A sua opinião é valiosa! Encorajamos você a compartilhar feedback, relatar qualquer problema que encontrar e sugerir melhorias. Estamos aqui para ouvir e tornar este sistema ainda melhor.

                Fique à vontade para explorar e utilizar todas as funcionalidades disponíveis. Agradecemos por sua paciência e compreensão enquanto trabalhamos para oferecer a você a melhor experiência possível.</p>
                <br />
                <p><b>Atenciosamente,</b></p>
                <p><b>Equipe Gestão FTTH</b></p>
             </div>
              </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default Home;