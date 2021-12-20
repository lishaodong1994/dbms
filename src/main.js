import Vue from 'vue'
import App from './App.vue'
import router from './route/router'
import '@/assets/css/global.css'
import './element.js'
import 'assets/fonts/iconfont.css'
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
