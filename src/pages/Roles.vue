<template>
  <div>
    <!-- 面包屑 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片区域 -->
    <el-card >
      <el-button type="primary"> 添加角色 </el-button>
      <!-- 权限列表表格 -->
      <el-table :data="rolesTableData" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column  label="操作" width="300">
          <template slot-scope="scope">
            <!-- 操作-编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            >编辑</el-button>
            <!-- 操作-删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            >删除</el-button>
            <!-- 操作-分配权限-->
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
              >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { G_getRolesList } from '@/API/home'

export default {
  data(){
    return{
      rolesTableData: [],
    }
  },
  mounted(){
    this.getRolesList()
  },
  methods:{
     async getRolesList() {
      const { data, meta } = await G_getRolesList()
      console.log(data,meta);
      if (meta.status !== 200) {
        return this.$message.error('获取权限列表失败~')
      }
      this.rolesTableData = data
    },
  }
}
</script>

<style>
</style>