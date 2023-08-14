import http from '@/http/index'

export default{
	loginWechat(params){
		return http.post('/app/user/loginWechat',params)
	},
	editNickname(params){
		return http.post('/app/user/editNickname',params)
	},
	editAvatar(params){
		return http.post('/app/user/editAvatar',params)
	}
}