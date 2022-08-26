
import axios from "axios";
//引入进度条
import nprogress from 'nprogress';
import"nprogress/nprogress.css";

let requests = axios.create({
    //基础路径,发请求URL携带api【发现:真实服务器接口都携带/api】
    baseURL: "/mock",
    //超时的设置
    timeout: 5000
});


// 请求拦截器
requests.interceptors.request.use((config)=>{
    nprogress.start();
    return config;
})


//响应拦截器：请求数据返回会执行
requests.interceptors.response.use((res) => {
    //进度条结束
     nprogress.done();
    return res.data;
}, (err) => {
    alert(err.message);
    //终止Promise链
    return Promise.reject(new Error('faile'));
});

//对外暴露
export default requests;