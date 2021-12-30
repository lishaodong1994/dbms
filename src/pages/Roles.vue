<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-button type="primary" @click="showAddUserRoleDialog"> 添加角色 </el-button>
      <!-- 权限列表表格 -->
      <el-table :data="rolesTableData" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限循环 -->
            <el-row
              :class="['bdbottom', { bdtop: i1 === 0 }, 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  type="success"
                  @close="tagClose(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!--二级权限循环 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[{ bdtop: i2 !== 0 }, 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="tagClose(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="tagClose(scope.row, item3.id)"
                      type="success"
                      closable
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <!-- 操作-编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="eidtUserRole(scope.row)"
              >编辑</el-button
            >
            <!-- 操作-删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserRole(scope.row)"
              >删除</el-button
            >
            <!-- 操作-分配权限-->
            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addUserRoleDialogVisible"
      width="50%"
      @close="addUserRoleDialogClose">
      <el-form ref="addRoleForm" :rules="addRoleFormRules" :model="addRoleMsg" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleMsg.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleMsg.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserRoleEvent">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的对话框 -->
    <el-dialog
      title="编辑角色信息"
      :visible.sync="editUserRoleDialogVisible"
      width="50%"
      @close="$refs.editRoleForm.resetFields()"
     >
      <el-form ref="editRoleForm" :rules="editRoleFormRules" :model="editRoleMsg" label-width="80px">
        <el-form-item label="角色ID" >
          <el-input v-model="editRoleMsg.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleMsg.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleMsg.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserRoleEvent">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="SetRightDialogVisible"
      width="50%"
    >
      <el-tree :data="rightsList" :props="rightsListProps" show-checkbox default-expand-all 
      node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="allotRight" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { 
G_getRolesList, D_delRole, G_getRightsList, 
P_setUserRole,P_addUserRole,D_delUserRole,
G_getUserRoleDataById,P_eidtUserRole } from '@/API/home'

export default {
  data() {
    return {
      rolesTableData: [],
      addUserRoleDialogVisible:false,
      addRoleMsg:{
        roleName:'',
        roleDesc:''
      },
      addRoleFormRules:{
         roleName:[
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ]
      },
      editUserRoleDialogVisible:false,
      editRoleMsg:{
        roleId:'',
        roleName:'',
        roleDesc:''
      },
       editRoleFormRules:{
         roleName:[
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        roleDesc:[
          { required: true, message: '请输入角色描述', trigger: 'blur' },
        ]
      },
      SetRightDialogVisible: false,
      rightsList:[],
      rightsListProps:{
         children: 'children',
         label: 'authName'
      },
      defKeys:[],//默认选中的权限
      roleId:'',
    }
  },
  mounted() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data, meta } = await G_getRolesList()
      if (meta.status !== 200) {
        return this.$message.error('获取权限列表失败~')
      }
      this.rolesTableData = data
    },
    tagClose(u, id) {
      this.$confirm('删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data, meta } = await D_delRole(u.id, id)
          console.log(data, meta)
          if (meta.status !== 200) {
            return this.$message({ type: 'info', message: '删除失败！' })
          }
          u.children = data //让后端返回删除之后的数据，避免去刷新整个页面，导致下拉菜单缩回。
          this.$message({ type: 'success', message: '删除成功!' })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    // 获取三级权限数组
    getLeafKeys(node,arr){
      if(!node.children){return arr.push(node.id)}
      node.children.forEach(item=>{
        this.getLeafKeys(item,arr)
      })
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const {data,meta} = await G_getRightsList('tree')
      if(meta.status!==200){return this.$message.error('获取权限数据失败')}
      this.rightsList = data
      this.defKeys=[]
      this.getLeafKeys(role,this.defKeys)
      this.SetRightDialogVisible=true
    },
    async allotRight(){
      let keysArr = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      let keysStr = keysArr.join(',')
      const {data,meta}= await P_setUserRole(this.roleId,keysStr)
      if(meta.status!==200){return this.$message.error('分配权限失败') }
      this.$message.success('分配权限成功')
      this.SetRightDialogVisible = false
      this.getRolesList()
    },
    // 显示添加角色框
    showAddUserRoleDialog(){
      this.addUserRoleDialogVisible=true
    },
    //添加角色框关闭回调
    addUserRoleDialogClose(){
      this.$refs.addRoleForm.resetFields()
    //  this.addRoleMsg.roleName=''
    //  this.addRoleMsg.roleDesc=''
    },
    // 添加角色
     addUserRoleEvent(){
      this.$refs.addRoleForm.validate(async(vali)=>{
       if(!vali){return}
       const {data,meta}= await P_addUserRole(this.addRoleMsg)
       console.log(data,meta);
       if(meta.status!==201){return this.$message.error('添加角色失败')}
       this.$message.success('添加角色成功')
       this.getRolesList()
       this.addUserRoleDialogVisible = false
      })
    },
    // 删除角色
    delUserRole(scopedRow){
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data,meta} = await D_delUserRole(scopedRow.id)
          if(meta.status!==200){ return this.$message.error('删除失败！')}
          this.$message({ type: 'success',message: '删除成功!'});
          this.getRolesList()
        }).catch(() => {this.$message({type: 'info',message: '已取消删除'})});
    },
    // 编辑角色
    async eidtUserRole(scopedRow){
      console.log(scopedRow.id);
      this.editUserRoleDialogVisible=true
     const {data,meta} = await G_getUserRoleDataById(scopedRow.id)
     if(meta.status!==200){return this.$message.error('获取用户信息失败')}
     this.editRoleMsg=data
    },
    async editUserRoleEvent(){
     if(!this.$refs.editRoleForm.validate()){return}
     const {data,meta} = await P_eidtUserRole(this.editRoleMsg)
     if(meta.status!==200){return this.$message.error('修改用户信息失败')}
     this.$message.success('修改用户信息成功')
     this.editUserRoleDialogVisible=false
     this.getRolesList()
    }
  },
}
</script>

<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>