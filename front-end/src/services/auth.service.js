import axios from "axios"

const API = import.meta.env.VITE_API_URL

export const loginService= async(data)=> {
    return axios.post(`${API}/auth/login`, data)
}
export const registerService= async(data)=> {
    return axios.post(`${API}/auth/register`, data)
}