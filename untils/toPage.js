export default {
	toHome() {
		uni.switchTab({
			url: '/pages/index/index'
		})
	},
	login() {
		uni.redirectTo({
			url: '/pages/login/login'
		})
	},
	gatewayDetail(gatewayId) {
		uni.navigateTo({
			url: '/pages/gateway/detail?gatewayId=' + gatewayId
		})
	},
	gatewayDetail(pageParam) {
		uni.navigateTo({
			url: '/pages/gateway/detail?gatewayId=' + pageParam.gatewayId
			+ '&title=' + pageParam.title + '&online='+pageParam.online
			+ '&name='+pageParam.name  + '&deviceType='+pageParam.type
		})
	},
	toSetting(gatewayId, name) {
		uni.navigateTo({
			url: '/pages/setting/setting?gatewayId=' + gatewayId + '&name=' + encodeURIComponent(name)
		})
	},
	userinfo() {
		uni.navigateTo({
			url: '/pages/my/userinfo'
		})
	},
	gatewayEdit(gatewayId) {
		uni.navigateTo({
			url: '/pages/gateway/edit?gatewayId=' + gatewayId
		})
	},
	gatewayBtnEdit(gatewayId) {
		uni.navigateTo({
			url: '/pages/gateway/btnEdit?gatewayId=' + gatewayId
		})
	},
	gatewayShare(gatewayId) {
		uni.navigateTo({
			url: '/pages/share/share?gatewayId=' + gatewayId
		})
	},
	newShare(gatewayId) {
		uni.navigateTo({
			url: '/pages/share/newShare?gatewayId=' + gatewayId
		})
	},
	taskCreate(gatewayId) {
		uni.redirectTo({
			url: '/pages/task/detail?gatewayId=' + gatewayId
		})

	},
	taskDetail(gatewayTaskId) {
		uni.navigateTo({
			url: '/pages/task/detail?gatewayTaskId=' + gatewayTaskId
		})
	},
	gatewayTask(gatewayId){
		uni.redirectTo({
			url: '/pages/task/gatewayTask?gatewayId=' + gatewayId
		})
	},
	task() {
		uni.redirectTo({
			url: '/pages/task/task'
		})
	},
	toEnvLogChart(evnLogParam,tabIndex){
		uni.navigateTo({
			url: '/pages/report/envLogChart?environmentalCollectionId='
				+evnLogParam.environmentalCollectionId 
				+ '&days=' + (evnLogParam.days? evnLogParam.days: '') 
				+ '&beginTime=' + (evnLogParam.beginTime? evnLogParam.beginTime: '')
				+ '&endTime=' + (evnLogParam.endTime?  evnLogParam.endTime : '')
				+ '&tabbarIndex='+tabIndex
		})
	},
	addDevices(gatewayId){
		uni.navigateTo({
			url: '/pages/devices/addDevices?gatewayId=' + gatewayId
		})
	},
	
	toDeviceCtrl(pageParam){
		uni.navigateTo({
			url: '/pages/devices/deviceCtrl?gatewayId=' + pageParam.gatewayId
			 + '&title=' + pageParam.title+ '&type=' + pageParam.type 
			 + '&deviceType='+ pageParam.deviceType
		})
	},
	runLog(envImpSelectedType,environmentalImprovementId){
		uni.navigateTo({
			url: '/pages/report/runLog?type=' + envImpSelectedType+ '&id=' + environmentalImprovementId
		})
	},
	toFeedDetail(pageParam){
		uni.navigateTo({
			url: '/pages/feeding/feedingDetail'
		})
	},
}
