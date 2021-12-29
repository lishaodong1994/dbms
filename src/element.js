import Vue from 'vue';
import { 
    Button,
    Select,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    BreadcrumbItem,
    Breadcrumb,
    Card,
    Col,
    Row,
    TableColumn,
    Table,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox
} from 'element-ui';


// 注意：按照elementUI文档按需引入会报错Syntax Error: Error: Cannot find module 'babel-preset-es2015'、
// 安装@babel/preset-env 将.babelrc的配置es2015  改成 @babel/preset-env 即可。......
Vue.use(Button)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
// 我加了点没用的内容上去~~~
