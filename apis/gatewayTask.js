import http from '@/http/index'

export default {
	list(gatewayId) {
		if (gatewayId) {
			return http.get('/app/gatewayTask/list?gatewayId=' + gatewayId)
		} else {
			return http.get('/app/gatewayTask/list')
		}
	},
	detail(params) {
		return http.get('/app/gatewayTask/detail', params)
	},
	edit(params) {
		return http.post('/app/gatewayTask/edit', params)
	},
	create(params) {
		return http.post('/app/gatewayTask/create', params)
	},
	remove(gatewayTaskId) {
		return http.post('/app/gatewayTask/remove?gatewayTaskId=' + gatewayTaskId)
	}

}
