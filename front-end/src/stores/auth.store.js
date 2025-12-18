import { defineStore } from "pinia";
import {loginService, registerService} from "../services/auth.service"

export const useAuthStore= defineStore("auth", {
    state: ()=> ({
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null
    }),

    getters: {
        isLogin: (state)=> !!state.user,
        username: (state)=> state.user?.username || "",
        role: (state)=> state.user?.role || ""
    },

    actions: {
        async login(data){
            const res= await loginService(data)
            
            this.token= res.data.tokenJWT
            this.user= res.data.data

            localStorage.setItem("token", this.token)
            localStorage.setItem("user", JSON.stringify(this.user))
        },
        async register(data){
            const res= await registerService(data)
            
            this.token= res.data.tokenJWT
            this.user= res.data.data

            localStorage.setItem("token", this.token)
            localStorage.setItem("user", JSON.stringify(this.user))
        },
        async logout(){
            this.user= null
            this.token= null

            localStorage.removeItem("token")
            localStorage.removeItem("user")
        }
    }
})
