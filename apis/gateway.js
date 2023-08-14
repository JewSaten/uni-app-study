import http from '@/http/index'

export default {
	farmList() {
		return http.get('/app/farm/farmList')
	},
	list() {
		return http.get('/app/gateway/list')
	},
	listv2(farmId) {
		return http.get('/app/gateway/gatewayList?farmId=' + farmId)
	},
	envList(gatewayId) {
		return http.get('/app/environmentalCollection/environmentalInfo?gatewayId=' + gatewayId)
	},
	detail(params) {
		return http.get('/app/gateway/detail', params)
	},
	edit(params) {
		return http.post('/app/gateway/edit', params)
	},
	toggle(btns, status) {
		return http.post('/app/gateway/toggle?status=' + status, btns)
	},
	allBtn(params) {
		return http.get('/app/gateway/allBtn', params)
	},
	btnEdit(params) {
		return http.post('/app/gateway/btnEdit', params)
	},
	bind(params) {
		return http.post('/app/gateway/bind', params)
	},
	remove(gatewayId) {
		return http.post('/app/gateway/remove?gatewayId=' + gatewayId)
	},
	addEnvDevice(params) {
		return http.post('/app/environmentalImprovement/addEnvironmentalImprovement', params)
	},
	offlineList(params) {
		return http.get('/app/environmentalImprovement/offlineList', params)
	},

	// 改良设备列表
	envImpList(gatewayId) {
		return http.get('/app/environmentalImprovement/envImprovementList?gatewayId=' + gatewayId)
	},
	
	gatewayBtnList(params){
		return http.get('/app/gatewayBtn/list',params)
	},
	
	envSuggestion(params){
		return http.get('/app/environmentalCollection/environmentalSuggestion',params)
	},
	
	gatewaySetStock(params){
		return http.get('/app/gateway/gatewayHasLivestock',params)
	}
}
