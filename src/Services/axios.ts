import axios from 'axios';
import { getBaseUrl } from '../common/utils';

let instance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
    },
    responseType: 'json',
});

export default instance;