// useSignalR.js
import { useState, useEffect } from 'react';
import * as signalR from "@microsoft/signalr";

const useSignalR = (apiUrl) => {
  const [connection, setConnection] = useState(null);

  const signalrRun = async () => {
    //const apiUrl = "http://localhost:5226";

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(apiUrl, { withCredentials: true })  // ajuste conforme necessário
      .build();

      try {
        await newConnection.start();
        setConnection(newConnection);

      } catch (error) {
        console.error("Erro ao iniciar a conexão SignalR:", error);

      }

  } 

  useEffect(() => {
    signalrRun();
  
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  return connection;
};

export default useSignalR;
