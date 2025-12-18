import axios from "axios"

const API = import.meta.env.VITE_API_URL

export const getChaptersByNovelId = async(novelId)=> {
    const res= await axios.get(`${API}/novel/${novelId}/chapters`)
    return res.data.data
}
export const getChapterById = async(id, token)=> {
    const res= await axios.get(`${API}/chapter/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return res.data.data
}
export const createChapter= async(novelId, data, token)=>{
    return axios.post(`${API}/novel/${novelId}/chapter`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
}
export const updateChapter= async(id, data, token)=>{
    return axios.put(`${API}/chapter/${id}`,data, {
        headers: {Authorization: `Bearer ${token}`}
    })
}
export const deleteChapter= async(id, token)=> {
    axios.delete(`${API}/chapter/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
}