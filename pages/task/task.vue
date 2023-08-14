<template>
	<view class="task uni-page">
		<EmptyList v-if="list.length == 0"></EmptyList>
		<u-swipe-action>
			<view class="task-item-box" v-for="(item, index) in list" :key="item.gatewayTaskId">
				<u-swipe-action-item :options="options" @click="del(item)">
					<view class="uni-card" @click="taskDetail(item.gatewayTaskId)">
						<view class="flex-center__sb">
							<view class="title flex-center__sb">
								<u-icon :customStyle="{marginRight:'10rpx'}" slot="icon" size="40rpx"
									name="/static/images/task/icon-task-clock@2x.png"></u-icon>
								{{item.taskName?item.taskName:''}}
							</view>
							<view :class="item.enable?'online-color':'offline-color'">{{item.enable?'启用':'未启用'}}
							</view>
						</view>
						<view class="flex-center__sb">
							<view>网关:</view>
							<view class="uni-text-grey">{{item.gatewayName}}</view>
						</view>
						<view class="flex-center__sb">
							<view>下次任务:</view>
							<view class="uni-text-grey">{{item.nextExeTime ? item.nextExeTime:'无'}}</view>
						</view>
						<view class="btn-box flex-center__center">
							<WeekChoose :weekList="weekList(item.cron)"></WeekChoose>
						</view>

					</view>
				</u-swipe-action-item>
			</view>
		</u-swipe-action>

	</view>
</template>

<script>
	import gatewayTaskApi from '@/apis/gatewayTask'
	import toPage from '@/untils/toPage'
	import date from '@/untils/date'
	import EmptyList from '@/components/emptyList'
	import WeekChoose from '@/components/weekChoose'
	export default {
		name: "Task",
		props: ['gatewayId'],
		components: {
			EmptyList,
			WeekChoose
		},
		created() {
			if (this.gatewayId) {
				this.getList()
			}
		},
		onShow() {
			this.getList()
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#f56c6c'
					}
				}],
				list: []
			}
		},
		methods: {
			taskDetail(taskId) {
				toPage.taskDetail(taskId)
			},
			getList() {
				gatewayTaskApi.list(this.gatewayId).then(res => {
					if (res.code == 0) {
						this.list = res.data
					}
				})
			},
			del(e) {
				gatewayTaskApi.remove(e.gatewayTaskId).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '删除成功'
						})
						this.getList()
					}
				})
			},
			weekList(cron) {
				if (!cron) {
					return []
				}
				let cronList = cron.split(' ')
				let year = cronList[6]
				if (year == '*') {
					return cronList[5].split(',')
				} else {
					return []
				}
			}
		},
		filters: {
			secondFormat(second = 0) {
				return date.secondFormat(second)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.task {
		font-size: 32rpx;

		.title {
			font-weight: 500;
			font-size: 36rpx;
			margin-bottom: 10rpx;
		}

		.btn-box {
			background-color: aliceblue;
			padding: 20rpx;
			border-radius: 10rpx;
			margin-top: 10rpx;
		}


		&-item-box {
			margin-bottom: 20rpx;
		}

		.gateway-setting {
			margin-top: 10rpx;

			&__point {
				width: 10rpx;
				height: 10rpx;
				background-color: #4166D8;
				margin-right: 14rpx;
			}

			&-grey-box {
				margin-top: 12rpx;
			}
		}
	}
</style>
