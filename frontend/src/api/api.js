import axios from 'axios'
const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000/';

export const api = axios.create({
    baseURL: API_BASE,
})

export function setAuthToken(token){
    if(token) 
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else
        delete api.defaults.headers.common["Authorization"];
}

export default api;