import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

export function setAuthToken(token) {
    if (token) {
        api.defaults.headers.common["x-auth-token"] = token;
        storeToken(token);
    } else {
        removeAuthToken();
    }
}

export function getAuthToken() {
    return localStorage.getItem('token');
}

export function storeToken(token) {
    localStorage.setItem('token', token);
}

export function removeAuthToken() {
    delete api.defaults.headers.common["x-auth-token"];
    localStorage.removeItem('token');
}

export default api;