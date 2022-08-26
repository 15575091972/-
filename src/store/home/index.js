import { reqCategoryList, reqGetBannerlist, reqFloorList } from '@/api';

const state = {
    //数据初始值
    categoryList: [],
    //轮播图数据
    bannerList: [],

    floorList: [],
};

//修改state
const mutations = {
    CAREGORYLIST(state, categoryList) {
        state.categoryList = categoryList;
    },

    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList;
        console.log('修改仓库中的bannerlist数据')
    },

    GETFLOORLIST(state, floorList) {
        state.floorList = floorList;
    },

};
const actions = {
    //三级联动数据
    async categoryList({ commit }) {
        let result = await reqCategoryList();
        if (result.code == 200) {
            commit('CAREGORYLIST', result.data);
        }

    },
    //获取首页轮播图数据
    async getBannerList({ commit }) {
        console.log('请求轮播图数据');
        let result = await reqGetBannerlist();
        if (result.code == 200) {
            commit('GETBANNERLIST', result.data);

        }
    },
    async getFloorList({ commit }) {
        console.log('请求floor数据');
        let result = await reqFloorList();
        if (result.code == 200) {
            commit('GETFLOORLIST', result.data);

        }
    },



};
const getters = {};


export default {
    state,
    mutations,
    actions,
    getters
}