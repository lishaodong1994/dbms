// let Vue;

// class Store{
//     // 执行器函数（初始化
//     constructor(options = {}){
//         this.state = options.state
//         let getters = options.getters
//         this.getters = {}
//         Object.keys(getters).forEach(getterName=>{
//             Object.defineProperty(this.getters,getterName,{
//                 get:()=>{
//                     return getters[getterName](this.state)
//                 }
//             })
//         }) 
//     }
// }
// // Vue.use()时会自动调用实例上 install 方法,
// const install = (_Vue) =>{
//      Vue = _Vue;
//      console.log('install');
//      //会给每个组件都 混入组件的生命周期
//      Vue.mixin({
//          beforeCreate(){
//              //this.$options是指new Vue({...}) 的{...}，能访问到里面的store
//              if(this.$options && this.$options.store){ 
//                  //根实例先添加$store
//                  this.$store =this.$options.store
//                 }else{
//                     //子
//                     this.$store = this.$parent && this.$parent.$store
//                 }
//                 console.log(this);//this谁调用指向谁。（即每个组件）
//             //为什么要像上方代码那样去挂载，而不直接在Vue.prototype上直接挂 this.$options.store ?
//             // 1、因为这样每一个new Vue()都会带一个store，会造成性能浪费
//             // 2、不会污染原型。
//             // 平时网上一些人直接在Vue.prototype上挂载axios的操作可以，但不是最佳的。
//             // 3、单独创建的实例，没有父亲就没有store
//          }
//      })
//  }

//  export default{
//      install,  
//      Store
//  }