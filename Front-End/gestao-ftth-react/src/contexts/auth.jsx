import React, { createContext, useContext, useState, useEffect} from "react";
import Api from "../services/api";
import { VerificarUsuario } from "../Api/usuario";

const AuthContext = createContext({
    user: {},
    Login: async (data) => {},
    Logout: () => {},
    status: true,
    loading: false,
    IsTokenExpired: () => false, // Função para verificar se o token está expirado
  });

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [status, setStatus] = useState();
    const [loading, setLoading] = useState();

    async function ServerStatus(){
      await VerificarUsuario({login: ''}) 
        .then(() => {
          // O servidor respondeu, então está online
          setStatus(true);
        })
        .catch(() => {
          // Não foi possível conectar ao servidor, então está offline
          setStatus(false);
        }).finally(() => { setLoading(true)});
      }
            
    useEffect(()=>{
      ServerStatus();
      const storagedUser = JSON.parse(sessionStorage.getItem('@App:user'));
      const storagedToken = sessionStorage.getItem('@App:token');
      Api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      setUser(storagedUser);
    },[]);   
  
    async function Login(data) {
      try {
        const response = await VerificarUsuario(data);

        if (response.status === 200) {
            if (response.data.login || response.data.pws) {
            setUser(response.data);
            Api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
            sessionStorage.setItem('@App:user', JSON.stringify(response.data));
            sessionStorage.setItem('@App:token', response.data.token);
            
          }

        } 
        
        return response;

      } catch (error) {
        console.error('Erro de conexão: ' + error)
      }
    }
  
    function Logout() {
      sessionStorage.removeItem('@App:user');
      sessionStorage.removeItem('@App:token');
    }
  
    // Função para verificar se o token está expirado
    function IsTokenExpired() {
      if (!token) return true; // Token não existe, considerar expirado
      const decodedToken = decode(token); // Decodifique o token (use uma biblioteca JWT para isso)
      if (!decodedToken.exp) return false; // Sem tempo de expiração definido
      const currentTime = Date.now() / 1000; // Tempo atual em segundos
      return decodedToken.exp < currentTime; // Verifique se o token expirou
    }
  
    return (
      <AuthContext.Provider value={{ user, Login, Logout, status, loading, IsTokenExpired }}>
        {children}
      </AuthContext.Provider>
    );
};
  
export function UseAuth() {
    const context = useContext(AuthContext);
  
    return context;
};






