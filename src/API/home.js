import http from '@/util/http.js'

// 获取侧边栏的菜单
export function getMenuList(){
    return http.get('/menus')
}
//获取用户列表
export function G_getUserList(info){
    return http.get('/users',{params:info})
}