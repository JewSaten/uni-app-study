import Request from './request'
import toPage from '@/untils/toPage'
import { LOGIN_PAGE_PATH } from '@/untils/const'
import Vue from 'vue';
const http = new Request()

http.setConfig((config) => {
	config.baseUrl = 'https://xxx.com' /*由于本项目仅供学习参考，此处不便提供 */
	config.header = {
		...config.header
	}
	return config
})

/**
 * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
 * @param { Number } statusCode - 请求响应体statusCode（只读）
 * @return { Boolean } 如果为true,则 resolve, 否则 reject
 */
http.validateStatus = (statusCode) => {
	return statusCode === 200
}

http.interceptor.request((config, cancel) => {
	/* 请求之前拦截器 */
	config.header = {
		...config.header
	}
	const token = uni.getStorageSync('token');
	config.header.token = token;
	return config
})

http.interceptor.response((response) => {
	/* 请求之后拦截器 */
	if (response.data.code === 401) { // token失效
		uni.showToast({
			icon: 'none',
			title: response.data.msg,
			duration:1500
		});
		let pages = getCurrentPages()
		let curPage = pages[pages.length - 1]
		if(LOGIN_PAGE_PATH !== curPage.route){
			setTimeout(toPage.login,1000)
		}
		return
	}
	if (response.data.code !== 0) { // 服务端返回的状态码不等于0，则reject()
		uni.showToast({
			icon: 'none',
			title: response.data.msg,
			duration:1500
		});
	}
	return response.data;
}, (response) => { // 请求错误做点什么
	return response.data
})
Vue.http = Vue.prototype.$http = http;
export default http
