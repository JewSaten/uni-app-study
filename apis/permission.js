import http from '@/http/index'

export default {
	list(params) {
		return http.get('/app/permission/list', params)
	},
	edit(params) {
		return http.post('/app/permission/edit', params)
	},
	remove(permissionId) {
		return http.post('/app/permission/remove?permissionId=' + permissionId)
	},
	getGatewayPerm(gatewayId) {
		return http.get('/app/permission/getGatewayPerm?gatewayId=' + gatewayId)
	}
}
