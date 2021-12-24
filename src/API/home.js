import http from '@/util/http.js'

// 登陆页->登陆请求
export const P_login =(loginData)=> http.post('/login',loginData)
//主页-> 获取侧边栏的菜单：
export const getMenuList=()=> http.get('/menus')
//用户列表->获取用户列表：
export const G_getUserList=(info)=> http.get('/users',{params:info})
//用户列表->修改用户状态：
export const P_userSatateChange=(userInfo)=>http.put(`/users/${userInfo.id}/state/${userInfo.mg_state}`)
// 用户列表 -> 添加新用户:
export const P_addUser=(newUserInfo)=>http.post('/users',newUserInfo)
// 用户列表->修改用户信息->按用户ID查询用户信息：
export const G_getUserData = (id)=>http.get(`/users/${id}`)
// 用户列表->修改用户信息
export const P_eidtUserData = (id,email,mobile)=>http.put('/users/'+id,{email,mobile})
// 用户列表->删除用户
export const D_delUser = (id)=>http.delete('/users/'+id)
