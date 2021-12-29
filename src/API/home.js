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
// 权限列表 ->获取权限列表
export const G_getRightsList = (type)=>http.get(`/rights/${type}`)
// 角色列表 ->获取角色列表
export const G_getRolesList = ()=>http.get('/roles')
// 角色列表 ->删除角色权限
export const D_delRole = (uid,id)=>http.delete(`/roles/${uid}/rights/${id}`)
// 角色列表 ->分配角色权限
export const P_setUserRole=(uid,roleStr) =>http.post(`/roles/${uid}/rights`,{rids:roleStr})

//角色管理 > 添加角色
export const P_addUserRole=(roleMsg) =>http.post(`/roles`,roleMsg)
//~角色管理 > 根据 ID 查询角色
export const G_getUserRoleDataById = (uid)=>http.get(`/roles/${uid}`)
//~角色管理 > 编辑提交角色
export const P_eidtUserRole = (roleMsg)=>http.put('/roles/'+roleMsg.roleId,roleMsg)
//角色管理->删除角色
export const D_delUserRole = (id)=>http.delete('/roles/'+id)

