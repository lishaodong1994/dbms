import Vue from 'vue'
import VueRouter from 'vue-router'
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

const Login = ()=>import('@/pages/Login.vue')
const Home = ()=>import('@/pages/Home.vue')
const Welcome = ()=>import('@/pages/Welcome.vue')
const Users = ()=>import('@/pages/Users.vue')
const Rights = ()=>import('@/pages/Rights.vue')
const Roles = ()=>import('@/pages/Roles.vue')
const Goods = ()=>import('@/pages/Goods.vue')
const Params = ()=>import('@/pages/Params.vue')
const Categories = ()=>import('@/pages/Categories.vue')
const TreeTable = ()=>import('@/pages/TreeTable.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect:'/login' },
    { path: '/login', component: Login },
    { path: '/treetable', component: TreeTable },
    {
         path: '/home', component: Home,redirect:'/welcome' ,
         children:[
             {path:'/welcome',component:Welcome},
             {path:'/users',component:Users},
             {path:'/rights',component:Rights},
             {path:'/roles',component:Roles},
             {path:'/goods',component:Goods},
             {path:'/params',component:Params},
             {path:'/categories',component:Categories},
         ]
    },
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