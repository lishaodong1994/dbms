<template>
  <div>
     <!--面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryObj.query"
            class="input-with-select"
            clearable
            @clear="getOrdersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="ordersList" style="width: 100%" border>
        <el-table-column width="35" label="#">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="288px"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="是否付款"
          width="120px"
        >
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay==0">未付款</el-tag>
            <el-tag type="danger" v-else-if="scope.row.order_pay==1">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="120px"
        ></el-table-column>
        <el-table-column
          label="下单时间"
          width="180px"
        >
          <template slot-scope="scope">
            {{scope.row.update_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 操作-修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editAdress"
            ></el-button>
            <!-- 操作-设置按钮 -->
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="showTimeLine"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryObj.pagenum"
        :page-sizes="[3,5,8,10]"
        :page-size="queryObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
      >
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" >
          <el-form-item label="地区" prop="address1">
             <el-cascader
              v-model="addressForm.address1"
              :options="addressOptions"
              :props="addressOptionsProps"
              :style="{width:'100%'}"
              ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="definAddressForm" >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="物流信息"
      :visible.sync="timeDialogVisible"
      width="50%"
     >
      <el-timeline >
        <el-timeline-item
          v-for="(item, index) in timeLineInfo"
          :key="index"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import addressOptions from './citydata'
import {G_getOrdersList,G_getWuLiuList} from '@/API/home.js'
export default {
  data(){
    return{
      ordersList:[],
      total:0,
      queryObj:{
        query:'',
        pagenum:1,
        pagesize:8,
        user_id:'',
        pay_status:'',
        is_send:'',
        order_fapiao_title:'',
        order_fapiao_company:'',
        order_fapiao_content:'',
        consignee_addr:'',
      },
      editDialogVisible:false,
      addressForm:{
        address1:'',
        address2:''
      },
      addressFormRules:{
        address1: [
            { required: true, message: '请选择地区', trigger: 'blur' },
          ],
        address2: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
      },
      addressOptionsProps:{ 
        expandTrigger: 'hover' ,
      },
      timeDialogVisible:false,
      timeLineInfo:[]
    }
  },
  mounted(){
    this.getOrdersList()
  },
  computed:{
    addressOptions(){return addressOptions}
  },
  methods:{
    async getOrdersList(){
      const {data,meta} = await G_getOrdersList(this.queryObj)
      if(meta.status!==200){return this.$message.error('获取订单列表失败')}
      this.ordersList =  data.goods
      this.total = data.total
    },
    handleSizeChange(val){
      this.queryObj.pagesize=val-0 
      this.getOrdersList()
    },
    handleCurrentChange(val){
     this.queryObj.pagenum=val-0 
     this.getOrdersList()
    },
    editAdress(){
      this.editDialogVisible = true
    },
    editDialogClosed(){
      this.$refs.addressFormRef.resetFields()
    },
    definAddressForm(){
      this.editDialogVisible = false
    },
    async showTimeLine(){
      this.timeDialogVisible=true
      const {data} = await G_getWuLiuList()
      if(data.meta.status!==200){return this.$message.error('获取物流信息失败')}
      this.timeLineInfo = data.data;
    }
  }
}
</script>

<style lang="less" scoped>

</style>