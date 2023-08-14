import http from '@/http/index'

export default {
	
	shedList(farmId) {
		return http.get('/app/shed/shedList?farmId=' + farmId)
	},
	getShedInfo(shedId){
		return http.get('/app/shed/shedInfo?shedId=' + shedId)
	},
	
	shedBatchUpdate(addMode,params){
		return http.post(addMode?'/app/shedBatch/add':'/app/shedBatch/edit',params)
	},
	
	shedOutOfEnd(shedId){
		return http.post('/app/shedBatch/end?shedId',shedId)
	},
	
	weightList(params){
		return http.get('/app/livestockWeightLogs/weightList',params)
	},
	
	dayWeightList(params){
		return http.get('/app/livestockWeightLogs/dayWeightList',params)
	},
	
	shedBatchList(shedId){
		return http.get('/app/shedBatch/shedBatchList?sheId='+shedId)
	}
	
}