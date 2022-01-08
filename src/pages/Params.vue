<template>
  <div>
    <!--面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <div>
        选择商品的分类：
        <el-cascader
          v-model="selectedId"
          :options="options"
          :props="props"
          @change="handleChange"
        >
        </el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisable" @click="dialogVisible = true"
            >添加参数</el-button
          >
          <el-table :data="manyTableData" stripe style="width: 100%" border>
            <el-table-column type="expand" width="80"> 
                <template slot-scope="scope">
                  <el-tag
                    :key="tag"
                    v-for="tag in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope,tag)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope,scope.row.attr_vals)"
                    @blur="handleInputConfirm(scope,scope.row.attr_vals)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" >
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"  @click="editParams(scope)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisable" @click="dialogVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTableData" stripe style="width: 100%" border >
            <el-table-column type="expand" width="80">
                <el-table-column type="expand" width="80"> 
                <template slot-scope="scope">
                  <el-tag
                    :key="tag"
                    v-for="tag in scope.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(scope,tag)">
                    {{tag}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope,scope.row.attr_vals)"
                    @blur="handleInputConfirm(scope,scope.row.attr_vals)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope)">+ New Tag</el-button>
                </template>
            </el-table-column>
            </el-table-column>
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParams(scope)"
                  >编辑</el-button
                >
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams"
          >确 定</el-button
        >
      </span>
    </el-dialog>

     <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
    >
       <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="definEditParams"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { G_getcategoriesList, G_getCateParams,P_addParams, P_editParams,D_delParams} from '@/API/home.js'
export default {
  data() {
    return {
      selectedId: [],
      options: [],
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      addForm:{
        attr_name:''
      },
      addFormRules:{
        attr_name:[
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
      },
      editDialogVisible:false,
       editForm:{
        attr_name:''
      },
      editFormRules:{
        attr_name:[
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
      },
      currentEidtRowIndex:0,
    }
  },
  mounted() {
    this.getcategoriesList()
  },
  methods: {
    async getcategoriesList() {
      const { data, meta } = await G_getcategoriesList()
      if (meta.status !== 200) {
        this.$message.error('获取列表数据失败')
      }
      this.options = data
    },
    async getCateParams() {
      if (this.selectedId.length !== 3) {
        this.selectedId = []
        this.onlyTableData = []
        this.manyTableData = []
        return
      }
      const { data, meta } = await G_getCateParams(this.cateId - 0, { sel: this.activeName,})
      if (meta.status !== 200) { return this.$message.error('获取失败')}
      data.forEach(item=>{
        item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
        item.inputVisible=false;
        item.inputValue= ''
      })
      if (this.activeName === 'many') {
        this.manyTableData = data
      } else {
        this.onlyTableData = data
      }
    },
    handleChange() {
      this.getCateParams()
    },
    handleClick() {
      console.log(this.activeName)
      this.getCateParams()
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields() 
    },
    addParams(){
     this.$refs.addFormRef.validate(async(valid)=>{
      if(!valid){return}
      const {data,meta} = await P_addParams(this.cateId,this.addForm.attr_name,this.activeName)
      console.log(data,meta);
      if(meta.status!==201){return this.$message.error('添加参数失败')}
      this.$message.success('添加参数成功')
      this.addDialogVisible = false
      // this.getCateParams()
      if(this.activeName=='many'){ 
        this.manyTableData.push(data)
      }else{ this.onlyTableData.push(data)}
     })
    },
    editParams(scope){
      this.editForm.attr_name = scope.row.attr_name;
      this.currentEidtRow = scope.row;
      this.editDialogVisible=true
    },
     definEditParams(){
      this.$refs.editFormRef.validate(async(valid)=>{
        if(!valid){return}
        const {data,meta} =await P_editParams(this.cateId,this.currentEidtRow.attr_id,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
        if(meta.status!==200){return this.$message.error('修改参数失败') } 
        this.$message.success('修改参数成功')
        this.editDialogVisible=false
        this.currentEidtRow.attr_name = this.editForm.attr_name
      })
    },
    delParams(attr_id){
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const{data,meta} = await D_delParams(this.cateId,attr_id)
          if(meta.status!==200){return this.$message({type: 'info',message: '删除失败!' }); }
          this.$message({type: 'success',message: '删除成功!' });
          this.getCateParams()
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除'
          });          
        });
        
       
    },
     async handleClose(scope,tag) {
        scope.row.attr_vals.splice(scope.row.attr_vals.indexOf(tag), 1);
         const {data,meta} = await P_editParams(this.cateId,scope.row.attr_id,{
            attr_name:scope.row.attr_name,
            attr_sel:this.activeName,
            attr_vals: scope.row.attr_vals.join(' ')
            })
          if(meta.status!==200){return this.$message.error('删除参数失败')}
          this.$message.success('删除参数成功')
      },
      showInput(scope) {
        scope.row.inputVisible = true;
        //当页面被重新渲染的时候会执行里面的代码。 （Ps:scope.row.inputVisible = true;但dom是异步被更新）
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
       async handleInputConfirm(scope,attr_vals) {
        let inputValue = scope.row.inputValue;
        if (inputValue&&inputValue.trim()!=='') {
          attr_vals.push(inputValue);
          const {data,meta} = await P_editParams(this.cateId,scope.row.attr_id,{
            attr_name:scope.row.attr_name,
            attr_sel:this.activeName,
            attr_vals:attr_vals.join(' ')
            })
          if(meta.status!==200){return this.$message.error('修改参数失败')}
          this.$message.success('修改参数成功')
        }
        scope.row.inputVisible = false;
        scope.row.inputValue = '';
      }
      

  },
  computed: {
    isBtnDisable() {
      if (this.selectedId.length !== 3) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.selectedId.length === 3) {
        return this.selectedId[2]
      }
      return null
    },
    titleText(){
      if(this.activeName==='many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  },
}
</script>

<style lang="less" scoped >
.el-tag{
  margin-left: 10px;
}
 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>