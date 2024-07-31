import axios from 'axios';

const interno_IP = "http://192.168.4.10:8000/Api";
const externo_IP = "http://201.59.13.102/Api";

const url_Valida = window.location.hostname === '192.168.4.10' ? interno_IP : externo_IP;

const Api = axios.create({
 baseURL: url_Valida ,
 headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

export default Api;