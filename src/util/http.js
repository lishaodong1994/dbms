import axios from 'axios'
import { Loading, Message } from 'element-ui' 
import NProgress from 'nprogress' //npm install --save nprogress
import 'nprogress/nprogress.css'

const http = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 3000,
    //headers:''
})
let loading = null
http.interceptors.request.use((config) => {
    loading = Loading.service({ text: ' ' })
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // console.log(config);
    return config
})
http.interceptors.response.use(
    response => {
        if (loading) { loading.close() }
        NProgress.done()
        return response.data
    },
    error => {
        console.log('失败了,原因:', error)
        return new Promise.reject(error)
    }

)
export default http