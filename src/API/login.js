import http from '@/util/http.js'

export function P_login(loginData){
    return http.post('/login',loginData)
}