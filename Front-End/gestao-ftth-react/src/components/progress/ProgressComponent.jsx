import React, { useState, useEffect, useRef } from 'react';
import useSignalR from '../../hooks/useSignalR';
import { Container } from './styles';
import './progressBar.css';
import ProgressComponentSleep from './progressSleep/ProgressComponentSleep';

const ProgressComponent = () => {
  const [progress, setProgress] = useState({ start: false, contador: 0, descricao: '', total: 100 });
  const connection = useSignalR();

  const progressRun = () => {
    if (connection) {
      // Remover o manipulador de eventos anterior
      connection.off("ReceiveProgress", receiveProgressHandler);

      // Adicionar o novo manipulador de eventos
      connection.on("ReceiveProgress", receiveProgressHandler);
    }
  }

  const receiveProgressHandler = (response) => {
    setProgress({ ...response });
  };

  useEffect(() => {
    progressRun();

    // Remover o manipulador de eventos quando o componente é desmontado
    return () => {
      if (connection) {
        connection.off("ReceiveProgress", receiveProgressHandler);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  return (
    <>
      <Container>
        <div className="progress-container" style={{ position: 'relative', display: 'flex',flexDirection: 'column', alignItems: 'center' }}>
          <progress value={progress.contador} max={progress.total} style={{marginBottom: '0.2rem'}}/>
          <div style={{ position: 'absolute', fontSize:'0.9rem', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', left: '0', right: '0', top: '0', width: '500px', fontWeight: '600' }}>
            <p>{`${progress.contador}% -- ${progress.descricao} --`}</p>
          </div>
          { progress.descricao === "Calculando Ganho..." || progress.descricao === "Preenchendo Lista... " ?
            <ProgressComponentSleep status={true} />
            : null
          }
        </div>
      </Container>
    </>
  );
};

export default ProgressComponent;
