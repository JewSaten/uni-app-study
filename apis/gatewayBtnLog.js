import http from '@/http/index'

export default {
	list(params) {
		return http.get('/app/gatewayBtnLog/list', params)
	},
	sprayList(params){
		return http.get('/app/gatewayBtnLog/sprayList', params)
	},
	switchList(params){
		return http.get('/app/gatewayBtnLog/switchList', params)
	}
}
