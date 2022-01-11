import Vue from 'vue'
import App from './App.vue'
import router from './route/router'
import '@/assets/css/global.css'
import './element.js'
import 'assets/fonts/iconfont.css'
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.config.productionTip = false
import moment from 'moment'
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

// import store from './store'

new Vue({
  // store,
  render: h => h(App),
  router,
}).$mount('#app')
