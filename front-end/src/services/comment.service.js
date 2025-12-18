import axios from "axios"

const API = import.meta.env.VITE_API_URL

export const getComments = async (novelId) => {
  const res = await axios.get(
    `${API}/comment?novel_id=${novelId}&chapter_id=null`
  )
  return res.data.data
}
export const getCommentsByChapter = async (novelId, chapterId) => {
  const res = await axios.get(
    `${API}/comment?novel_id=${novelId}&chapter_id=${chapterId}`
  )
  return res.data.data
}

export const createComment = async (data, token) => {
  return axios.post(`${API}/comment`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const updateComment = async (id, data, token) => {
  return axios.put(`${API}/comment/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const deleteComment = async (id, token) => {
  return axios.delete(`${API}/comment/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
