import axios from "axios"

const API = import.meta.env.VITE_API_URL
export const getGenres= async()=> {
    const res= await axios.get(`${API}/genre`)
    return res.data.data
}
export const createGenre= async(data, token)=> {
    return axios.post(`${API}/genre`, data, {
        headers: {Authorization: `Bearer ${token}`}
    })
}
export const deleteGenre= async(id, token)=> {
    return axios.delete(`${API}/genre/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
}