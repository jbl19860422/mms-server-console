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
initAxios.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];
    if (contentType?.includes('application/json')) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    console.error("响应错误", error);
    return Promise.reject(error); // ✅ 保证 catch 能捕获
  }
);
//导出
export default () => initAxios