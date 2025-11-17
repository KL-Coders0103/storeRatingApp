import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

export const authAPI = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const storesAPI = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const ratingAPI = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const adminAPI = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

const addAuthToken = (config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}

const handleResponseError = (error) => {
    if (error.response?.status === 401){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }
    return Promise.reject(error)
}

[authAPI, storesAPI, ratingAPI, adminAPI].forEach(api => {
    api.interceptors.request.use(addAuthToken)
    api.interceptors.response.use(response => response, handleResponseError)
})

