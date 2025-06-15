//引入封装好的 axios
import Axios from './axios'

//实例化
const instance = Axios()

//创建需要的请求方法:get post put delete
//url:请求的接口地址
//params:请求参数
//headers:请求头
export default {
  get(url, params, headers) {
    return instance.get(url, { params, headers })
  },
  post(url, params, headers) {
    const isWhep = url.includes('.whep');
    return instance.post(url, params, {
      headers,
      responseType: isWhep ? 'text' : 'json'  // 👈 动态处理
    });
  },
  patch(url, params, headers) {
    const isWhep = url.includes('.whep');
    return instance.patch(url, params, {
      headers,
      responseType: isWhep ? 'text' : 'json'  // 👈 动态处理
    });
  },
  put(url, params, headers) {
    return instance.put(url, params, { headers })
  },
  delete(url, params, headers) {
    return instance.delete(url, { params, headers })
  }
}