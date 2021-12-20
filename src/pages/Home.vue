<template>
  <div>
      <!-- home是一个有权限的路由页面。所以需要登陆（存在token,且token正确）没有token或不正确时应该跳会登陆页面 -->
      <el-button type="info" @click="logout">退出登陆</el-button>
  </div>
</template>

<script>
export default {
date(){
    return{

    }
},
methods:{
    // 退出登陆
    logout(){
        window.sessionStorage.clear() //清空token
        this.$router.push('/login')
    }
}

}
</script>

<style lang="less" scoped>

</style>