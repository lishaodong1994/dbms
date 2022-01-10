<template>
  <div>
    <!--面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps :active="active - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="goodsForm"
        :rules="goodsFormRules"
        ref="goodsFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="active"
          :before-leave="TabLeave"
          @tab-click="tabHandleclick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="goodsForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="goodsForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="goodsForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="goodsForm.goods_cat"
                :options="goodsCatCascaderOptions"
                @change="handleChange"
                :props="goodsCatCascaderProps"
                style="width: 100%"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in goodsParams"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(ite, index) in item.attr_vals"
                  :key="index"
                  :label="ite"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in goodsAttr"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--action上传到的后端服务器地址接口  -->
            <el-upload
              action="http://139.9.202.95:8888/api/private/v1/upload"
              :headers="headersObj"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">上传图片</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 npm install vue-quill-editor --save  -->
            <quill-editor v-model="goodsForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="picDialogVisible" width="50%">
      <img class="dialogImg" :src="picUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { G_getcategoriesList, G_getCateParams,P_addGoods } from '@/API/home'
import _ from 'lodash'
export default {
  data() {
    return {
      active: '0',
      goodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics:[],
        attrs:[]
      },
      goodsFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
      goodsCatCascaderOptions: [],
      goodsCatCascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
      },
      goodsParams:[],
      goodsAttr:[],
      headersObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      picUrl:'',
      picDialogVisible:false
    }
  },
  mounted() {
    this.getGoodsCatCascaderOptions()
  },
  computed: {
    cateId() {
      if (this.goodsForm.goods_cat.length === 3) {
        return this.goodsForm.goods_cat[2]
      } else {
        return undefined
      }
    },
  },
  methods: {
    TabLeave() {
      if (this.active === '0' && this.goodsForm.goods_cat.length !== 3) {
        this.$message.info('请先选择 ‘商品分类’ ')
        return false
      }
    },
    async tabHandleclick() {
      if (this.goodsForm.goods_cat.length !== 3) {
        return
      }
      if (this.active == 1) {
        const { data, meta } = await G_getCateParams(this.cateId, { sel:"many" })
        if(meta.status!==200){return this.$message.error('获取动态参数失败')}
        data.forEach(item=>{
          item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : []
        })
        this.goodsParams = data    
      } else if(this.active==2) {
        const { data, meta } = await G_getCateParams(this.cateId, { sel:"only" })
        if(meta.status!==200){return this.$message.error('获取静态属性失败')}
        this.goodsAttr = data    
      }
      
    },
    async getGoodsCatCascaderOptions() {
      const { data, meta } = await G_getcategoriesList()
      if (meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败')
      }
      this.goodsCatCascaderOptions = data
    },
    handleChange() {
      if (this.goodsForm.goods_cat.length !== 3) {
        this.goodsForm.goods_cat.length = []
      }
    },
      handleRemove(file) {
        const i = this.goodsForm.pics.findIndex((item)=>{
          return item.pic ===file.response.data.tmp_path
        })
        this.goodsForm.pics.splice(i,1)
      },
      handlePreview(file) {
        this.picUrl= 'http://139.9.202.95:8888/'+file.response.data.tmp_path
        this.picDialogVisible=true
      },
      handleSuccess(response){
        const picInfo = {pic:response.data.tmp_path}
        this.goodsForm.pics.push(picInfo)
      },
      addGoods(){
        this.$refs.goodsFormRef.validate(async(valid)=>{
          if(!valid){return this.$message.error('必填项需要补充')}
          const cloneForm = _.cloneDeep(this.goodsForm)
          cloneForm.goods_cat = cloneForm.goods_cat.join(',')
          //处理动态参数和静态属性
          this.goodsParams.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
            this.goodsForm.attrs.push(newInfo)
          })
          this.goodsAttr.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
            this.goodsForm.attrs.push(newInfo)
          })
          cloneForm.attrs = this.goodsForm.attrs
          const {data,meta} = await P_addGoods(cloneForm)
          if(meta.status!==201){return this.$message.error('添加商品失败')}
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
      }
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 10px;
  margin-bottom: 10px;
}
.el-checkbox {
  margin: 0 5px 0px 0px !important;
}
.dialogImg {
  width: 100%;
  height: 100%;
}
::v-deep .ql-editor {
  min-height: 220px !important;
}
.el-button {
  margin-top: 10px;
}
</style>