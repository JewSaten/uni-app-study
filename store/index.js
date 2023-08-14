import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/http/index.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		hasLogin: uni.getStorageSync('hasLogin') || false,
		userInfo: {},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({ //缓存用户登陆状态
				key: 'hasLogin',
				data: state.hasLogin
			});	
			uni.setStorage({ //缓存用户登陆状态
				key: 'userInfo',
				data: provider
			});
			uni.setStorage({
				key: 'token',
				data: provider.token,
				success: function() {

				}
			});
			http.setConfig((config) => {
				config.header.token = provider.token;
				return config
			});
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({
				key: 'userInfo'
			})
			uni.removeStorage({
				key: 'token'
			})
			uni.removeStorage({
				key: 'farmId'
			})
			uni.setStorage({ //缓存用户登陆状态
				key: 'hasLogin',
				data: state.hasLogin
			});	
		}
	},
	actions: {

	}
})

export default store
