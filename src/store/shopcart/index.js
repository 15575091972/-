//购物车小仓库
import { reqShopCart, reqDeleteCart, reqUpdateChecked } from '@/api'
//规范:利用vuex存储数据
// import { SET_USERID } from '@/utils/USER_ID';
let state = {
     //vuex仓库存储用户临时身份,vuex存储数据确实非持久化的，SET_USERID执行返回结果,可是本地存储获取的！！
     //  USER_ID: SET_USERID(),
     shopCartInfo: []
};
let mutations = {
     GETSHOPCART(state, payload) {
          state.shopCartInfo = payload;
     }
};
let actions = {
     //获取用户购物车的数据
     async getShopCart({ commit, state, dispatch }) {
          let result = await reqShopCart();
          if (result.code == 200) {
               commit('GETSHOPCART', result.data);
          }
     },
     // 删除某一个商品的数据
     async deleteCartById({ commit, state, dispatch }, skuId) {
          let result = await reqDeleteCart(skuId);
          if (result.code == 200) {
               return 'ok';
          } else {
               return Promise.reject();
          }
     },
     //修改某一个商品勾选状态
     async changeChecked({ commit, state, dispatch }, { skuId, isChecked }) {
          let result = await reqUpdateChecked(skuId, isChecked);
          if (result.code == 200) {
               return 'ok';
          } else {
               return Promise.reject();
          }
     },
     // 修改勾选状态
     allUpdateChecked({ getters, dispatch }, isChecked) {
          let arr = [];
          //获取购物车商品的个数,进行遍历
          getters.CartInfo.cartInfoList.forEach(item => {
               //调用修改某一个商品的action【四次】
               let ps = dispatch("changeChecked", { skuId: item.skuId, isChecked });
               arr.push(ps);
          })
          return Promise.all(arr);
     },
     //删除选中的商品
     deleteAllCart({ getters, dispatch }) {
          // alert(88888)
          let arr = [];
          //获取仓库里面购物车的数据
          getters.CartInfo.cartInfoList.forEach(item => {
               // 商品的勾选状态是勾选的,发请求一个一个删除
               if (item.isChecked == 1) {
                    let ps = dispatch('deleteCartById', item.skuId);
                    arr.push(ps);
               }
          })
          return Promise.all(arr);
     }

};
let getters = {

     // 计算数组里面第一个元素：对象
     CartInfo(state) {
          return state.shopCartInfo[0] || {};
     },
};

//对外暴露
export default {
     state,
     mutations,
     actions,
     getters
}