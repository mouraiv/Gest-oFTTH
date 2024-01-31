import React, { useState, useEffect } from 'react';
import { Container } from './styles';

const ProgressComponentSleep = ({status}) => {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    let intervalId;

    if(status){
      intervalId = setInterval(() => {
        setContador((prevCount) => (prevCount <= 100 ? prevCount + 1 : 0));

      }, 5); // Define o intervalo em milissegundos (1 segundo, por exemplo)
    }else{
      clearInterval(intervalId);
    }

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contador]); // Dependências para o useEffect

  return (
    <Container>
        <div className="progress-bar" ></div>
        <div className="sleep" style={{ left: `${contador}%`, width: `${contador <= 50 ? contador : 100 - contador}px` }} ></div>
    </Container>
  );
};

export default ProgressComponentSleep;
