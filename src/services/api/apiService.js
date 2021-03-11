import axios from 'axios';

const baseURL = 'http://localhost:3050/api/';

export default axios.create({
    baseURL,
});