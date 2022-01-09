<template>
  <div>
    <!--面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="$router.push('/goods/add')">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column width="35" label="#">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="515px"
        ></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）"
          width="120px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          width="140px"
        >
          <template slot-scope="scope">
            {{scope.row.upd_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 操作-修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope)"
            ></el-button>
            <!-- 操作-删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,8,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { G_getGoodsList,D_delGoods} from '@/API/home'
import moment from 'moment'
import Vue from 'vue'
Vue.filter('dataFormat',function(originVal){
  // const dt = new Date(originVal)
  // const y = dt.getFullYear()
  // const m = (dt.getMonth()+1+'').padStart(2,'0')
  // const d = (dt.getDate()+'').padStart(2,'0')
  // const hh = (dt.getHours()+'').padStart(2,'0')
  // const mm = (dt.getMinutes()+'').padStart(2,'0')
  // const ss = (dt.getSeconds()+'').padStart(2,'0')
  // return `${y}-${m}-${d} ${hh}:${mm}:${ss}` 
  return moment(originVal).format('YYYY-MM-DD hh:mm:ss')
})
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8,
      },
      goodsList: [],
      total:0,
    }
  },
  mounted() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data, meta } = await G_getGoodsList(this.queryInfo)
      console.log(data, meta)
      if (meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      this.goodsList = data.goods
      this.total=data.total
    },
    editGoods(scope) {
      console.log(scope)
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val-0
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum=val-0
      this.getGoodsList()
    },
     delGoods(row){
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data,meta} = await D_delGoods(row.goods_id)
          if(meta.status!==200){return this.$message.error('删除商品失败')}
          this.$message.success('删除商品成功')
          this.getGoodsList()
        }).catch(() => { this.$message({type: 'info',message: '已取消删除'}) });
  
    }
  },
}
</script>

<style>
</style>