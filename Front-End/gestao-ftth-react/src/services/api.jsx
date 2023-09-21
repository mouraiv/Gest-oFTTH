import axios from 'axios';

const api = axios.create({
 baseURL: 'http://localhost:5226/Api',
});

export default api;