<template>
  <!-- home是一个有权限的路由页面。所以需要登陆（存在token,且token正确）没有token或不正确时应该跳会登陆页面 -->
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="~assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout" class="logout_btn"
        >退出登陆</el-button
      >
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          unique-opened
          background-color="#333744"
          text-color="#fff"
          active-text-color="#4090ff"
          :default-active="$route.path"
        >
          <el-submenu
            v-for="item in menuList"
            :key="item.id"
            :index="item.id + ''"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.id"
              :index="'/'+subItem.path"
              @click="subItemClick(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from '@/API/home'
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      isCollapse: false, //side是否折叠
    }
  },
  methods: {
    // 退出登陆
    logout() {
      window.sessionStorage.clear() //清空token
      this.$router.push('/login')
    },
    // side折叠和展开
    toggleClick() {
      this.isCollapse = !this.isCollapse
    },
    //点击side菜单内按钮行为:路由跳转。
    subItemClick(path){
      this.$router.push('/'+path)
    }
  },
  async mounted() {
    const { data, meta } = await getMenuList()
    if (meta.status !== 200) {
      return this.$message.error(meta.msg)
    } else {
      this.menuList = data
    }
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-container {
  height: 100%;
  overflow: hidden;
}

.el-menu {
  border-right: 0;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  text-align: center;
  height: 24px;
  line-height: 24px;
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: 1px;
}
// ------aside内容超出也不显示滚动条-----
.el-aside {
  background-color: #333744;
  height: 100%;
  overflow-y: auto;
  transition: width 0.5s;
}
.el-aside::-webkit-scrollbar {
  display: none;
}
// ------------------------
.el-main {
  background-color: #eaedf1;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  line-height: 60px;
  color: #ddd;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    width: 50px;
    height: 50px;
    margin-right: 15px;
  }
  .logout_btn {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    
  }
}
.iconfont {
  margin-right: 10px;
}
</style>