<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="15">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary"  @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表表格区域 -->
      <el-table :data="userList" :border="true" :stripe="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="msg">
            <el-switch
              v-model="msg.row.mg_state"
              @change="stateChange(msg.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="msg">
            <!-- 操作-修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updateUser(msg.row.id)"
            ></el-button>
            <!-- 操作-删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(msg.row.id)"
            ></el-button>
            <!-- 操作-分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
              @click=""
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addDialogClosed"
    >
      <!-- 对话框内容区域 -->
      <el-form :model="addfrom" :rules="addfromRules" ref="addfrom" label-width="80px" class="addfrom">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addfrom.username"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input v-model="addfrom.password"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="addfrom.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile">
          <el-input v-model="addfrom.mobile"></el-input>
        </el-form-item>
        </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
      <el-dialog
      title="修改用户"
      :visible.sync="updateDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <!-- 对话框内容区域 -->
        <el-form :model="editfrom" :rules="editfromRules" ref="editfrom" label-width="80px" class="editfrom">
        <el-form-item label="用户名称" >
          <el-input v-model="editfrom.username" disabled></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="editfrom.email"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile">
          <el-input v-model="editfrom.mobile"></el-input>
        </el-form-item>
        </el-form>
    
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    

  </div>
</template>

<script>
import { G_getUserList, P_userSatateChange,P_addUser,G_getUserData,P_eidtUserData,D_delUser } from '@/API/home'
export default {
  data() {
    // 自定义添加用户名表单的校验规则：
     var checkEmaill = (rule, value, callback) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          return callback()
        }
        callback( new Error('请输入合法的邮箱'))
      };
    //自定义手机的验证规则
    var checkMobile = (rule,value,callback)=>{
      const regMobile =  /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/
        if(regMobile.test(value)){
          return callback()
        }
        callback( new Error('请输入合法的手机'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3,
      },
      userList: [],
      total: 0,

      // 添加用户弹出框部分的状态：
      addDialogVisible: false,
      addfrom:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      addfromRules:{
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        email:[
           { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmaill, trigger: 'blur' },
        ],
        mobile:[
           { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 修改用户弹出框部分的状态：
      updateDialogVisible:false,
      editfrom:{},
      editfromRules:{
         email:[
           { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmaill, trigger: 'blur' },
        ],
        mobile:[
           { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data, meta } = await G_getUserList(this.queryInfo)
      if (meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = data.users
      this.total = data.total
    },
    // 修改列表每页显示的个数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    // 点击页码请求对应页的数据
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    // 修改用户状态
    async stateChange(val) {
      const { data, meta } = await P_userSatateChange(val)
      if (meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message.error('更新用户状态失败~')
      }
      this.$message.success('更新状态成功')
    },
    // 事件监听： 添加用户框关闭时：重置添加用户框内容
    addDialogClosed(){
        this.$refs.addfrom.resetFields()
    },
    // 添加新用户
    addUser(){
      this.$refs.addfrom.validate(async(valid)=>{
        if(!valid){return}
        const {data,meta} = await P_addUser(this.addfrom)
        if(meta.status!==201){
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功。')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    //修改用户:点击按钮显示Dialog框拿到ID请求数据，显示到默认表单上
    async updateUser(id){
      this.updateDialogVisible=true
      const {data,meta} = await G_getUserData(id)
      if(meta.status!==200){
        return this.$message.error('查询用户信息失败')
      }
      this.editfrom = data
    },
    // 监听修改用户的Dialog框关闭事件。
    editDialogClosed(){
      this.$refs.editfrom.resetFields()
    },
    //点击确认进行预验证，通过则 发送请求修改用户信息，关闭修改Dialog框,提示消息，请求刷新整体数据。 
    async editUserInfo(){
     if (!this.$refs.editfrom.validate()){return}
     const {data,meta}  = await P_eidtUserData(this.editfrom.id,this.editfrom.email,this.editfrom.mobile)
     if(meta.status!==200){ return this.$message.error('更新用户信息失败~')}
     this.updateDialogVisible = false
     this.getUserList()
     this.$message.success('更新用户数据成功~')
    },
    //删除用户
    delUser(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
           const {data, meta} = await D_delUser(id)
           console.log(data,meta);
           if(meta.status!==200){return this.$message.error('删除失败!')}
           this.$message({type: 'success',message: '删除成功!'});
           this.getUserList()
        }).catch(() => {
          this.$message({type: 'info',message: '已取消删除'});          
        });
    }
  },
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
  margin-bottom: 15px;
}
::v-deep td,
th,
caption {
  font-size: 12px;
}
::v-deep .cell {
  text-align: center;
}
</style>