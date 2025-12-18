import axios from 'axios'

const API= import.meta.env.VITE_API_URL

export const getNovels= async()=> {
    const res= await axios.get(`${API}/novel`)
    return res.data.data
}
export const getNovelsByAuthor= async(token)=> {
    const res= await axios.get(`${API}/novel/author`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    return res.data.data
}
export const getNovelById= async(id)=>{
    const res= await axios.get(`${API}/novel/detail/${id}`)
    return res.data.data
}
export const createNovel= async(data, token)=> {
    return axios.post(`${API}/novel/create`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}
export const updateNovel= async(id, data, token)=> {
    return axios.put(`${API}/novel/edit/${id}`, data, {
        headers: {Authorization: `Bearer ${token}`}
    })
}
export const deleteNovel= async(id, token)=> {
    return axios.delete(`${API}/novel/delete/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
}