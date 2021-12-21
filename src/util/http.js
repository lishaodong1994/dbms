import axios from 'axios'

const http = axios.create({
    baseURL: 'http://139.9.202.95:8888/api/private/v1',
    timeout: 3000,
    //headers:''
})
http.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // console.log(config);
    return config
})
http.interceptors.response.use(
    response => response.data,
    error => {
        console.log('失败了,原因:', error)
        return new Promise.reject(error)
    }

)
export default http