export default {
	data() {
		return {
			mpShare: {
				title: '',
				path: '',
				imageUrl: ''
			}
		}
	},
	// 分享给微信好友
	onShareAppMessage(res) {
		return this.mpShare
	}
}