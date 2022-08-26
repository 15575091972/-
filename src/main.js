import Vue from 'vue'
import App from './App.vue'
//三级联动组件
import TypeNav from '@/components/TypeNav';
import Pagination from '@/components/Pagination'

//引入swiper
import 'swiper/css/swiper.css';

//按需引入
import { Button,MessageBox } from 'element-ui';

//第一个参数，全局组件的名字，
Vue.component(TypeNav.name, TypeNav);
Vue.component(Pagination.name,Pagination);

Vue.component(Button.name,Button);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;


//引入mockserve.js
import '@/mock/mockServve';


Vue.config.productionTip = false;





//引入路由
import router from './router'

import store from './store'

//将项目全部请求函数引入进来[分别暴露]
import  * as http from '@/api';
//注册
new Vue({
  render: h => h(App),
  //全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this;
     //通过Vue.prototype原型对象,将全部请求函数挂载到原型对象身上[VC:就可以使用请求函数]
     Vue.prototype.$http = http;
  },


  store,
  router
}).$mount('#app')
