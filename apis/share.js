import http from '@/http/index'

export default {
	create(params) {
		return http.post('/app/share/create', params)
	},
	edit(params) {
		return http.post('/app/share/edit', params)
	},
	bind(params){
		return http.post('/app/share/bind', params)
	}
}
