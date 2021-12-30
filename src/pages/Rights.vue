<template>
  <div>
    <!--面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card v-if="rightsTableData.length">
      <!-- 权限列表表格 -->
      <el-table :data="c_rightsTableData" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0" type="success">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="warning"
              >二级</el-tag
            >
            <el-tag v-else type="danger">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 8, 12, 15]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rightsTableData.length"
      v-if="rightsTableData.length"
    >
    </el-pagination>
  </div>
</template>

<script>
import { G_getRightsList } from '@/API/home'
export default {
  data() {
    return {
      rightsTableData: [],
      currentPage: 1,
      pageSize:5,
    }
  },
  mounted() {
    this.getRightsList()
  },
  computed:{
    c_rightsTableData(){
      let start = this.pageSize*(this.currentPage-1)
      let  end = start + this.pageSize
      let temp = this.rightsTableData.slice(start,end) 
      return temp
    }
  },
  methods: {
    async getRightsList() {
      const { data, meta } = await G_getRightsList('list')
      if (meta.status !== 200) {
        return this.$message.error('获取权限列表失败~')
      }
      this.rightsTableData = data
    },
    handleSizeChange(val) {
      this.pageSize=val
    },
    handleCurrentChange(val) {
      this.currentPage =val
    },
  },
}
</script>

<style lang="less" scoped>
::v-deep td,
th,
caption {
  font-size: 15px;
}
::v-deep .cell {
  text-align: center;
}
</style>