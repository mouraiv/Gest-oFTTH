import React, { useState, useEffect, useRef } from 'react';
import useSignalR from '../../hooks/useSignalR';
import { Container } from './styles';
import './progressBar.css';
import { formatarNumero } from "../../util/formatarNumeros";
import ProgressComponentSleep from './progressSleep/ProgressComponentSleep';

const ProgressComponent = ({exportar}) => {
  const [progress, setProgress] = useState({ start: false, contador: 5, descricao: 'Carregando...', total: 100});
  const [expor, setExpor] = useState({contador : 0, total: 0});
  const connection = useSignalR();

  const progressRun = async () => {
    if (connection) {
      // Remover o manipulador de eventos anterior
      await connection.off("ReceiveProgress", receiveProgressHandler);

      // Adicionar o novo manipulador de eventos
      await connection.on("ReceiveProgress", receiveProgressHandler);
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

  useEffect(() => {
    if(progress.descricao === "Transferindo dados..."){
      expor.contador = progress.contador;
      expor.total = progress.total;

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  return (
    <>
      <Container>
          { exportar ?
            <>
              <div className="progress-container" style={{ position: 'relative', display: 'flex',flexDirection: 'column', alignItems: 'center' }}>
              <ProgressComponentSleep status={true} />
              <progress value={expor.contador} max={expor.total} style={{marginBottom: '0.2rem', marginTop : '0.3rem'}}/>
              <div style={{ position: 'absolute', fontSize:'0.8rem', marginLeft: 'auto', marginRight: 'auto', marginTop: '0.6rem', textAlign: 'center', left: '0', right: '0', top: '0', width: '500px', fontWeight: '600' }}>
                <p>{expor.contador === 0 ? `[ Iniciando... ]` : `[ ${formatarNumero(expor.contador)} / ${formatarNumero(expor.total)} ] [ ${(parseFloat(expor.contador) / parseFloat(expor.total) * 100).toFixed(1)}% ] Carregando Registros...`}</p>
              </div>
              </div>
            </>
            :
            <>
            <div className="progress-container" style={{ position: 'relative', display: 'flex',flexDirection: 'column', alignItems: 'center' }}>
            <progress value={progress.contador} max={progress.total} style={{marginBottom: '0.2rem'}}/>
            <div style={{ position: 'absolute', fontSize:'0.8rem', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', left: '0', right: '0', top: '0', width: '500px', fontWeight: '600' }}>
              <p>{`${progress.contador}% [ ${progress.descricao} ]`}</p>
            </div>
            { progress.descricao === "Calculando Ganho..." || progress.descricao === "Preenchendo Lista..." || progress.descricao === "Calculando soma de Ums..." || progress.descricao === "Carregando surveys..." || progress.descricao === "Carregando chave CDOEs..." || progress.descricao === "Carregando chave celulas..." ?
              <ProgressComponentSleep status={true} />
              : null
            }
            </div>
            </>
          }
      </Container>
    </>
  );
};

export default ProgressComponent;
