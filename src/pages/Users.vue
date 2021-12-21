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
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
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
              <el-switch v-model="msg.row.mg_state" @change="stateChange(msg.row)"></el-switch></template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="msg">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
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
  </div>
</template>

<script>
import { G_getUserList } from '@/API/home'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3,
      },
      userList: [],
      total: 0,
    }
  },
  mounted() {
      this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data, meta } = await G_getUserList(this.queryInfo)
      if (meta.status !== 200) {return this.$message.error('获取用户列表失败')}
      this.userList = data.users
      this.total = data.total
    },
    handleSizeChange(val) {
        this.queryInfo.pagesize=val
        this.getUserList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum=val
      this.getUserList()
    },
    stateChange(val){
        console.log(val);
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