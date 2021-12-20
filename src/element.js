import Vue from 'vue';
import { 
    Button,
    Select,
    Form,
    FormItem,
    Input,
    Message,
} from 'element-ui';


// 注意：按照elementUI文档按需引入会报错Syntax Error: Error: Cannot find module 'babel-preset-es2015'、
// 安装@babel/preset-env 将.babelrc的配置es2015  改成 @babel/preset-env 即可。......
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message