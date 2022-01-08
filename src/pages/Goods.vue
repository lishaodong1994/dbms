<template>
  <div>
    <!--面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="addCateEvent">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树表格 本次使用vue-table-with-tree-grid 第三方组件npm i vue-table-with-tre e-grid -S -->
      <zk-table
        :data="categoriesList"
        :columns="categoriesListColumns"
        :selection-type="false"
        :expand-type="false"
        :show-index = "true"
        :index-text= "'#'"
        border
      >
        <template slot="aaa" slot-scope="scope">
        <i class="el-icon-success" :style="{color:'green'}" v-if="!scope.row.cat_deleted"></i>
        <i class="el-icon-circle-close" :style="{color:'red'}" v-if="scope.row.cat_deleted"></i>
      </template>
       <template slot="bbb" slot-scope="scope">
        <el-tag type="success" v-if="scope.row.cat_level===0">一级</el-tag>
        <el-tag type="warning" v-else-if="scope.row.cat_level===1">二级</el-tag>
        <el-tag type="danger" v-else>三级</el-tag>
      </template>
       <template slot="ccc" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(scope.row)">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini"  @click="deleteCate(scope.row)" >删除</el-button>
      </template>
      </zk-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[3, 6, 9, 12]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="AddCateDialogVisible"
      width="50%"
      @close="AddCateDialogclosed"
    >
      <el-form ref="addCateForm" :model="addCateFormInfo" :rules="addCateFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name" >
          <el-input v-model="addCateFormInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
           <el-cascader
             :style="{width:'100%'}"
             v-model="selectedKeys"
            :options="parentCategoriesList"
            :props="categoriesProps"
            @change="parentCateChanged"
            expand-trigger="hover"
            clearable
           >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="defineAddCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form ref="editCateForm" :model="editCateFormInfo" :rules="editCateFormRules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name" >
          <el-input v-model="editCateFormInfo.cat_name"></el-input>
        </el-form-item>
      </el-form>
       <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="defineEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { G_getcategoriesList,P_addCategories,P_editCategories,D_deleteCategories} from '@/API/home.js'
export default {
  data() {
    return {
      categoriesList: [],
      categoriesListColumns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
         {
          label:'是否有效',
          type:'template',
          template:'aaa'
        },
        {
          label:'标签级别',
          type:'template',
          template:'bbb'
        },
         {
          label:'操作',
          width:'200px',
          type:'template',
          template:'ccc'
        },
        
      ],
      total:0,
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:3
      },
      AddCateDialogVisible:false,
      addCateFormInfo:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      addCateFormRules:{
        cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
      },
      selectedKeys:[],
      parentCategoriesList:[],
      categoriesProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children',
          checkStrictly:true,//联级select默认只能选中最后一级。设置为true可以选任意级。
      },
      editCateDialogVisible:false,
      editCateFormInfo:{
        cat_id:'',
        cat_name:''
      },
      editCateFormRules:{
        cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ],
      },
      editCurrentCateRow:{},
    }
  },
  mounted() {
    this.getcategoriesList()
  },
  methods: {
    showScope(s){
      console.log(s);
    },
   async getcategoriesList() {
      const { data, meta } = await G_getcategoriesList(this.queryInfo)
      if(meta.status!==200){return this.$message.error('获取数据失败')}
      this.categoriesList = data.result || data
      this.total = data.total
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getcategoriesList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.queryInfo.pagenum = val
      this.getcategoriesList()
    },
    async addCateEvent(){
      const {data,meta} = await G_getcategoriesList({type:2})
      if(meta.status!==200){return this.$message.error('获取父级分类失败')}
      this.parentCategoriesList = data
      this.AddCateDialogVisible=true
    },
    parentCateChanged(){
      if(this.selectedKeys.length>0){
        this.addCateFormInfo.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        this.addCateFormInfo.cat_level = this.selectedKeys.length
      }else{
        this.addCateFormInfo.cat_pid = 0
        this.addCateFormInfo.cat_level = 0
      }
    },
      defineAddCate(){
       this.$refs.addCateForm.validate(async(valid)=>{
          if(!valid){return}
          const {data,meta} = await P_addCategories(this.addCateFormInfo)
          if(meta.status!==201){return this.$message.error('添加商品类别失败')}
          this.$message.success('添加商品类别成功')
          this.getcategoriesList()
          this.AddCateDialogVisible = false
       })
      },
    AddCateDialogclosed(){
      this.$refs.addCateForm.resetFields()
      this.selectedKeys=[]
      this.addCateFormInfo.cat_pid = 0
      this.addCateFormInfo.cat_level = 0
    },
    editCate(cateRow){
      this.editCateFormInfo.cat_id = cateRow.cat_id;  
      this.editCateFormInfo.cat_name = cateRow.cat_name;  
      this.editCurrentCateRow = cateRow
      this.editCateDialogVisible = true
    },
    defineEditCate(){
      this.$refs.editCateForm.validate(async(valid)=>{
          if(!valid){return}
          const {data,meta} = await P_editCategories(this.editCateFormInfo)
          if(meta.status!==200){return this.$message.error('类别更新失败')}
          this.$message.success('类别更新成功')
          this.$set(this.editCurrentCateRow,'cat_name',data.cat_name)
          this.$forceUpdate();
          this.editCateDialogVisible = false
          // 留了一个问题没解决：
          // 为了不刷新页面导致表格收回，这里用了$set想局部刷一下页面数据渲染没效果，又用了$forceUpdate()强制渲染还是没效果。
          // 最终还是不得不请求了后端整体表格数据，渲染了一次页面。
          this.getcategoriesList()
      })
    },
    deleteCate(cateRow){
       this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const {data,meta} = await D_deleteCategories(cateRow.cat_id)
          if(meta.status!==200){return this.$message.error('删除失败')}
          this.$message({type: 'success',message: '删除成功!'});
          this.getcategoriesList()
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});          
        });
      
    }
  },
}
</script>

<style lang="less" scoped >

</style>