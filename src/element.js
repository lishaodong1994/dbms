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
    MessageBox,
    Tag,
    Tree,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload,
    Timeline,
    TimelineItem,
} from 'element-ui';

// 第三方组件vue-table-with-tree-grid
import ZKTable from 'vue-table-with-tree-grid'
Vue.use(ZKTable)
// 第三方组件vue-quill-editor
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 注意：按照elementUI文档按需引入会报错Syntax Error: Error: Cannot find module 'babel-preset-es2015'、
// 安装@babel/preset-env 将.babelrc的配置es2015  改成 @babel/preset-env 即可。......
Vue.use(Button)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm