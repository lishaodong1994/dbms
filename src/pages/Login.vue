<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="~assets/logo.png" alt="" />
      </div>
      <el-form
        class="login_from"
        ref="loginFromRef"
        :model="loginForm"
        :rules="loginRules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetLoginForm('loginFromRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { P_login } from "@/API/login";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
        // 验证用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        // 验证密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6 到 15 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetLoginForm(formName) {
      this.$refs[formName].resetFields();
    },
    login() {
      // 点击登陆预验证
      this.$refs.loginFromRef.validate(async (flag) => {
        if (!flag) {
          return;
        }
        // 登陆请求
        const { data, meta } = await P_login(this.loginForm);
        if (meta.status != 200) {
          this.$message.error("登陆失败！" + meta.msg);
        } else {
          this.$message.success("登陆成功~," + data.username);
          //把后端返的token保存到客户端的sessionStorage（会话级别）中。项目中除了登陆之外的其他API接口，必须在登陆之后才能访问
          // token应当只在当前网页打开期间生效，所以将token保存在sessionStorage中
          // 接着通过路由跳转到'/home'。
          window.sessionStorage.setItem('token',data.token)
          this.$router.replace('/home')
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
}
.login_box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 50%;
  box-shadow: 0px 0px 10px #ccc;
  img {
    background-color: #eee;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.login_from {
  box-sizing: border-box;
  padding: 0 10px;
  width: 100%;
  position: absolute;
  bottom: 0;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>