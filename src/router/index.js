import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
//使用插件
Vue.use(VueRouter)

import Home from '@/pages/Home'
import Search from '@/pages/search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import paySuccess from '@/pages/paySuccess'
import Center from '@/pages/center'


import MyOrder from '@/pages/center/myOrder';
import TeamOrder from '@/pages/center/teamOrder'

let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function (location, resolve, reject) {
  //当前函数this：即为VueRouter类的实例
  //相当于push方法里面this，是windows【完犊子了】
  //利用人家push方法实现路由跳转，保证push里面this,应该vueRouter类的实例
  if (resolve && reject) {
    //代表真:代表着两个形参接受参数【箭头函数】
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(this, location, () => { }, () => { });
  }
}


VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    //代表真:代表着两个形参接受参数【箭头函数】
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(this, location, () => { }, () => { });
  }
}
//配置路由
let router = new VueRouter({
  routes: [
    {
      path: "/paysuccess",
      component: paySuccess,
      meta: { show: true }
    },
    {
      path: '/center',
      component: Center,
      meta: { show: true },
      //二级路由配置的地方
      children:[
           //我的订单
           {
                path:'myorder',
                component:MyOrder
           }
           ,
           {
               path:'teamorder',
               component:TeamOrder
           }
           ,
           {
               path:'/center',
               redirect:'/center/myorder'
           }
      ]
  },
    {
      path: "/trade",
      component: Trade,
      meta: { show: true }
    },

    {
      path: "/pay",
      component: Pay,
      meta: { show: true }
    },
    {
      path: "/shopcart",
      component: ShopCart,
      meta: { show: true }
    },
    {
      path: "/home",
      component: Home,
      meta: { show: true }
    },
    {
      path: '/detail/:skuId?',
      component: Detail,
      meta: { show: true }
    },

    {
      path: '/addcartsuccess',
      component: AddCartSuccess,
      meta: { show: true }
    },
    {
      path: "/search/:keyword?",
      component: Search,
      name: "search",
      meta: { show: true }
    },
    {
      path: "/login",
      component: Login,
      meta: { show: false }
    },
    {
      path: "/register",
      component: Register,
      meta: { show: false }
    },
    //重定向
    {
      path: "*",
      redirect: "/home",

    }
  ],

  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    return { y: 0 };
  },

})
//全局守卫
router.beforeEach( async(to, from, next) => {
  let hasToken = store.state.user.token;
  //用户信息
  let hasNickName = store.state.user.nickName;
  //用户登录
  if (hasToken) {
    //用户登录了,不能去login

    if (to.path == "/login") {
      next('/home');
    } else {
      //用户登陆了
      if (hasNickName) {
        next();
      } else {
        //用户登陆了,但是没有用户信息 
        try {
          //发请求获取用户信息
          await store.dispatch('getUserInfo');
          next();
        } catch (error) {
          //token失效:本地清空数据、服务器的token通知服务器清除
          await store.dispatch('logout');
          next('/login');
        }
      }
    }
  } else {
    //用户未登录||目前的判断都是放行.将来这里会'回手掏'增加一些判断
    //用户未登录:不能进入/trade、/pay、/paysuccess、/center、/center/myorder  /center/teamorder
    let toPath = to.path;
    if (toPath.indexOf('trade') != -1 || toPath.indexOf('pay') != -1 || toPath.indexOf('center') != -1) {
      next('/login?redirect=' + toPath);
    } else {
      next();
    }
  }
});
export default router;

