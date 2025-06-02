import axios from "axios";

const initAxios = axios.create({
    timeout: 10000//数据响应过期时间
})

//请求拦截器
initAxios.interceptors.request.use((config) => {
    //在发送之前做点什么
    return config
}, (error) => {
    //对请求错误做点什么
    return error
})

//响应拦截器
initAxios.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    if (error.response && error.response.status == 401) {
    }
    console.log(error);
    return Promise.resolve(error.response.data);
})
//导出
export default () => initAxios