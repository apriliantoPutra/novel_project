import axios from "axios"

const API = import.meta.env.VITE_API_URL

export const getUsers= async(token)=> {
    const res= await axios.get(`${API}/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res.data.data
}
export const getUserById= async(id,token)=> {
    const res= await axios.get(`${API}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res.data.data
}
export const createUser= async(data, token)=> {
    return axios.post(`${API}/user`, data, {
        headers: {Authorization: `Bearer ${token}`}
    })
}
export const updateUser= async(id, data, token)=> {
    return axios.put(`${API}/user/${id}`, data, {
        headers: {Authorization: `Bearer ${token}`}
    })
}
export const deleteUser= async(id, token)=> {
    return axios.delete(`${API}/user/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
}