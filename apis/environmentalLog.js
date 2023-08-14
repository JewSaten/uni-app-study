import http from '@/http/index'

export default {
	list(params) {
		return http.get('/app/environmentalLog/list', params)
	},
	latestEvnLog(params) {
		return http.get('/app/environmentalLog/getLatestEvnLog', params)
	},
	data(params) {
		return http.get('/app/environmentalLog/data', params)
	},
	envTypeList(gatewayId){
		return http.get('/app/environmentalCollection/environmentalCollectionList?gatewayId=' + gatewayId)
	},
	
	datav2(params){
		return http.get('/app/environmentalLog/environmentalCollectionLog', params)
	},
	envImprovementList(gatewayId){
		return http.get('/app/environmentalImprovement/envImprovementList?gatewayId=' + gatewayId)
	},
	envImpLogList(params){
		return http.get('/app/environmentalImprovementLog/envImprovementList',params)
	},
}
