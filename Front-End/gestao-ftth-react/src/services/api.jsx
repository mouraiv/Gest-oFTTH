import axios from 'axios';

const Api = axios.create({
 baseURL: 'http://192.168.4.10:8000/Api',
});

export default Api;