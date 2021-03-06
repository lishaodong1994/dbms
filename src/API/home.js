import http from '@/util/http.js'
import axios from 'axios'
const MOCKhttp = axios.create({
    baseURL: 'https://www.fastmock.site/mock/0d94b59864be14ac23ec2739a630ec50/test1',
    timeout: 3000,
    //headers:''
})

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
// 用户列表->分配用户角色
export const P_setupUserRole =(id,rid)=>http.put(`/users/${id}/role`,{rid})
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
//角色管理 > 根据 ID 查询角色
export const G_getUserRoleDataById = (uid)=>http.get(`/roles/${uid}`)
//角色管理 > 编辑提交角色
export const P_eidtUserRole = (roleMsg)=>http.put('/roles/'+roleMsg.roleId,roleMsg)
//角色管理->删除角色
export const D_delUserRole = (id)=>http.delete('/roles/'+id)

// 请求商品分类数据列表
export const G_getcategoriesList = (queryInfoObj)=>http.get('/categories',{params:queryInfoObj})
// 添加商品分类
export const P_addCategories = (addcateInfo)=>http.post('/categories',addcateInfo)
// 编辑提交分类
export const P_editCategories = (editInfo)=>http.put(`/categories/${editInfo.cat_id}`,editInfo)
// 删除分类
export const D_deleteCategories = (cateId) => http.delete(`/categories/${cateId}`)
// 根据所选分类的ID和当前所处的面板获取对应的参数
export const G_getCateParams = (cateId,query)=>http.get(`categories/${cateId}/attributes`,{params:query})
// 添加动态参数或静态属性
export const P_addParams = (cateId,attr_name,attr_sel) =>http.post(`/categories/${cateId}/attributes`,{attr_name,attr_sel})
// 编辑提交参数
export const P_editParams = (id,attrId,queryObj) => http.put(`categories/${id}/attributes/${attrId}`,queryObj)
// 删除参数
export const D_delParams = (id,attr_id)=>http.delete(`categories/${id}/attributes/${attr_id}`) 

//获取商品列表
export const G_getGoodsList = (queryObj)=>http.get('/goods',{params:queryObj})
//根据ID查询商品信息
export const G_getGoodsInfo = (id) => http.get(`goods/${id}`)  
// 删除商品
export const D_delGoods= (id) =>http.delete(`/goods/${id}`)
//添加商品
export const P_addGoods = (form )=>http.post(`goods`,form)
// 修改商品
export const P_editGoods = (id,form )=>http.put(`goods/${id}`,form)

// 获取订单列表
export const G_getOrdersList =(queryObj)=>http.get(`orders`,{params:queryObj})

// 获取物流信息
export const G_getWuLiuList =()=>MOCKhttp.get(`/kuaidi/1106975712662`)

// 获取图标信息
export const G_getReport = ()=>http.get(`/reports/type/1`)