/**
 * 封装 axios
 * 函数的返回值是 promise 对象
 * 优化：
 *   1. 统一处理请求异常：在外层包一个自己Promise 对象，出错处理，不使用 reject 使用 message.error()
 *   2. 异步得到的不是 response, 而是 response.data。在请求成功时， resolve(response.data)
 */
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, mthods='GET', data={}){
	return new Promise((resolve, reject) => {
		let promise
		/**
		 * 1. 执行异步 ajax 请求
		 * 2. 成功调用 resolve(value)
		 * 3. 失败不调用 reject ，提示异常信息
		 */
		if (mthods === 'GET') {
			promise = axios.get(url, {
				params: data
			})
		} else {
			promise = axios.post(url, data)
		}
		promise.then(response => {
			resolve(response.data)
		})
	}).catch(error => {
    message.error('请求出错：' + error.msg)
	})
	
}