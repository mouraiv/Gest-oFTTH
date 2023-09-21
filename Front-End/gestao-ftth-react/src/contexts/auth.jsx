import React, { createContext, useContext, useState, useEffect } from "react";

import api from '../services/api'

const AuthContext = createContext({
    user: {},
    Login: async (data) => {},
    Logout: () => {},
    isTokenExpired: () => false, // Função para verificar se o token está expirado
  });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});

    useEffect(()=>{
      const storagedUser = JSON.parse(sessionStorage.getItem('@App:user'));
      const storagedToken = sessionStorage.getItem('@App:token');
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      setUser(storagedUser);
    },[]);   
  
    async function Login(data) {
      await api.post('/Usuario/Verificar', data)
      .then(response => {
        setUser(response.data);
        api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
        sessionStorage.setItem('@App:user', JSON.stringify(response.data));
        sessionStorage.setItem('@App:token', response.data.token);
      })
      .catch(error => console.error('Erro de conexão:', error));
    }
  
    function Logout() {
      sessionStorage.removeItem('@App:user');
      sessionStorage.removeItem('@App:token');
    }
  
    // Função para verificar se o token está expirado
    function isTokenExpired() {
      if (!token) return true; // Token não existe, considerar expirado
      const decodedToken = decode(token); // Decodifique o token (use uma biblioteca JWT para isso)
      if (!decodedToken.exp) return false; // Sem tempo de expiração definido
      const currentTime = Date.now() / 1000; // Tempo atual em segundos
      return decodedToken.exp < currentTime; // Verifique se o token expirou
    }
  
    return (
      <AuthContext.Provider value={{ user ,Login, Logout, isTokenExpired }}>
        {children}
      </AuthContext.Provider>
    );
};
  
export function useAuth() {
    const context = useContext(AuthContext);
  
    return context;
};






