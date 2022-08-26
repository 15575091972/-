
import axios from "axios";
//引入进度条
import nprogress from 'nprogress';

//获取仓库:存储数据
import store from "@/store";
import "nprogress/nprogress.css";

let requests = axios.create({
    //基础路径,发请求URL携带api【发现:真实服务器接口都携带/api】
    baseURL: "/api",
    //超时的设置
    timeout: 5000
});


// 请求拦截器
requests.interceptors.request.use((config) => {
    nprogress.start();
    if (store.state.detail.uuid_token) {
        config.headers.userTempId = store.state.detail.uuid_token;
    }
    //token[公共参数]

    if (store.state.user.token) {
        config.headers.token = store.state.user.token;
    }
    return config;
})


//响应拦截器：请求数据返回会执行
requests.interceptors.response.use((res) => {
    //res:实质就是项目中发请求、服务器返回的数据
    //进度条结束
    nprogress.done();
    return res.data;
}, (err) => {
    //温馨提示:某一天发请求,请求失败,请求失败的信息打印出来
    alert(err.message);
    //终止Promise链
    return Promise.reject(new Error('faile'));
});

//对外暴露
export default requests;