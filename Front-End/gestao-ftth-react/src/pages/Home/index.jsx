import React, {useState,useEffect} from "react";
import { Container } from "./styles";
import { UseAuth } from "../../contexts/auth";
import { GlobalStyle, Template } from "../../GlobalStyle";
import Header from "../../components/Header"
import InfoDataBase from "../../components/DbInfo"
import Footer from "../../components/Footer"
import { GetGraficoPrincipal } from "../../api/enterecoTotais";
import Spinner from '../../components/Spinner';
import { BarChart } from "../../components/Grafico/Bar";

function Home() {
    const [loading, setLoading] = useState(false);
    //const [graficoPrincipal, setGraficoPrincial] = useState({});

    const [chartData, setChartData] = useState({});
    const [mensagem, setMensagem] = useState("");

    const { user, ValidarToken } = UseAuth();

    const fetchGraficoPrincial = async () => {    
      try {
      
            const response = await GetGraficoPrincipal();

            if(response.status == 200) {
              const resultado = response.data;
        
              setChartData({
                labels: resultado.map((data) => data.uf), 
                datasets: [
                  {
                    label: "Users Gained ",
                    data: resultado.map((data) => data.quantidadeSurvey),
                    backgroundColor: [
                      "#2a71d0"
                    ],
                    borderColor: "black",
                    borderWidth: 2
                  }
                ]
              })
            }
            
          } catch (error) {
            setMensagem(`Erro ao carregar : ${error}`)
            
          } finally {
            setLoading(true)       
          }
    }

    useEffect(() => {
      if(user && Object.keys(user).length !== 0){
        ValidarToken(user);
      }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])

    useEffect(() => {
      fetchGraficoPrincial();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    GlobalStyle();

    return (
      <>
        <Template>
          <Header title={"Início"} />
            <Container>
              <InfoDataBase />
              { loading ? 
             <div className="avisoInicial">
              
              <BarChart chartData={chartData} />
             </div>
             : <Spinner />
              }
              </Container>
            <Footer />
          </Template>
        </>
      )
  }
  
  export default Home;