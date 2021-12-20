import Vue from 'vue'
import VueRouter from 'vue-router'


const Login = ()=>import('@/pages/Login.vue')
const Home = ()=>import('@/pages/Home.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect:'/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
]

const router = new VueRouter({
    routes
})
// 前置路由拦截：除了login随便等，其他则需要登陆（要有token）才给进入。
router.beforeEach((to,from,next)=>{
    if(to.path==='/login'){return next()};
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr){return next('/login')}
    next()
})
export default router