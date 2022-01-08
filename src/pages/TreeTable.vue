<template >
  <div >
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      class="demo-dynamic"
    >
      <div class="container">
          <div class="vtlLine"></div>
          <div>
            <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domains"
          :key="domain.key"
          :prop="'domains.' + index + '.value'"
        >
          <div
            class="treeLabel"
            v-if="index === dynamicValidateForm.domains.length - 1"
          >
            <el-button
              @click="addDomain"
              type="primary"
              icon="el-icon-plus"
              circle
            ></el-button>
            <span>{{ `项目${index}` }}</span>
          </div>
          <div class="treeLabel" v-else>
            <span>{{ `项目${index}` }}</span>
          </div>
          <!--selectInput -->
          <el-select v-model="domain.value" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
            </el-form-item>
          </div>
      </div>
      
      <el-form-item>
        <el-button type="primary" @click="submitForm('dynamicValidateForm')"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dynamicValidateForm: {
        domains: [
          {
            value: '',
          },
        ],
      },
       options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }
        ],
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: '',
        key: Date.now(),
      })
    },
  },
}
</script>

<style scoped lang="less">
.container{
  display: flex;
    .el-form-item:first-child{
      position: relative;
    }
    .el-form-item:first-child::before{
      position: absolute;
      content: "";
      width: 3px;
      height: 50%;
      background: #fff;
      top: 0 ;
      left: -3px;
    }
    .el-form-item:last-child{
          margin-bottom: 0;
          position: relative;
        }
    .el-form-item:last-child::before{
      position: absolute;
      content: "";
      width: 3px;
      height: 50%;
      background: #fff;
      bottom: 0 ;
      left: -3px;
    }
  .vtlLine{
 width: 0px;
 border-left: 3px dashed #ccc;
 margin-left: 10px ;
}
}

.el-form {
  box-sizing: border-box;
  width: 100%;
  // border-left: 2px dashed #ccc;
  margin: 15px 15px 15px 0;
}

::v-deep .el-form-item__content {
  width: 100%;
  display: flex;
  .treeLabel {
    flex-basis: 80px;
    flex-grow: 0;
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
      width: 10px;
      height: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-input {
    flex: 1;
  }

  .treeLabel::before {
    content: '';
    display: inline-block;
    flex: 1;
    height: 0px;
    margin-right: 5px;
    border-bottom: 1px dashed #ccc;
  }
}

</style>