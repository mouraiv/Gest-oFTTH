import axios from 'axios';

const Api = axios.create({
 baseURL: 'http://localhost:5226/Api',
});

export default Api;