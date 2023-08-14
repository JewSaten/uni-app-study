<template>
	<view class="gateway-task">
		<view class="btn-box">
			<button class="uni-primary-btn" @click="taskCreate">新增任务</button>
		</view>
		<Task ref="taskList"  v-if="gatewayId" :gatewayId="gatewayId"></Task>
	</view>
</template>
<script>
	import Task from '@/pages/task/task'
	import toPage from '@/untils/toPage'
	export default {
		components: {
			Task
		},
		onLoad(option) {
			this.gatewayId = option.gatewayId
		},
		onShow() {
			if(this.$refs.taskList){
				this.$refs.taskList.getList()
			}
		},
		data() {
			return {
				gatewayId: ''
			}
		},
		methods: {
			taskCreate() {
				toPage.taskCreate(this.gatewayId)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gateway-task {
		.btn-box {
			/* #ifdef MP */
			padding: 20rpx 40rpx;
			/* #endif */
			/* #ifndef MP */
			padding: 20rpx 40rpx 0;
			/* #endif */
		}
	}
</style>
