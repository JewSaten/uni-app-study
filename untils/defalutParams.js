export default {
	
	gatewayIcon(url){
		if (url) {
			return url
		}
		return '/static/images/login/logo.jpg'
	},

	gatewayBtnIcon(open, url) {
		if (url) {
			return url
		}
		if (open) {
			return '/static/images/gateway/btn/btn@2x.png'
		} else {
			return '/static/images/gateway/btn/btn-off@2x.png'
		}
	},
	
	gatewayBtnIconv2(open, url){
		if (url) {
			return url
		}
		if (open) {
			return '/static/images/gateway/btn/status-open@2x.png'
		} else {
			return '/static/images/gateway/btn/status-close@2x.png'
		}
	},
	
	avatar(url){
		if (url) {
			return url
		}
		return '/static/images/my/avatar.png'
	}

}
