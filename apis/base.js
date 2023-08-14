import http from '@/http/index'

export default {
	getUploadPicUrl(forever = false) {
		return http.config.baseUrl + '/app/base/uploadPic?forever=' + forever
	},
	findDicByKey(params) {
		return http.get('/app/base/findDicByKey', params)
	}
}
