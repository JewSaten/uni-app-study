<template>
	<view class="task uni-page">
		<view class="uni-card task-card flex-center__sb">
			开关启用
			<u-switch v-model="enable"></u-switch>
		</view>
		<view class="uni-card task-card flex-center__sb">
			名称
			<input class="uni-input" v-model="item.taskName" placeholder="请输入" placeholder-style="color:#999999;"/>
		</view>
		<view class="uni-card task-card">
			<view class="flex-center__sb task-card">
				有效期
				<view class="flex-center__sb">
					<view class="uni-text-grey">长期</view>
					<u-checkbox-group iconPlacement="right" v-model="isForever">
						<u-checkbox :customStyle="{marginLeft:'14rpx'}" :name="true"></u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
			<view class="task-card task-time-box" v-if="isForever.length <=0">
				<uni-datetime-picker type="datetimerange" v-model="specifyTime" rangeSeparator="至">
					<view class="base-grey-box">
						开始时间：{{specifyTime[0]?specifyTime[0]:'请选择'}}
						<br>
						结束时间：{{specifyTime[1]?specifyTime[1]:'请选择'}}
					</view>
				</uni-datetime-picker>
			</view>
			<view class="task-card">
				预约
				<view class="base-grey-box">
					<WeekChoose :weekList="weekList" @changeWeek="changeWeek"></WeekChoose>
				</view>
			</view>
		</view>
		<view class="uni-card task-card flex-center__sb" @click="openHmsPicker(null)">
			执行时间
			<view class="flex-center__sb">
				<view class="uni-text-grey">{{startTimeSecond | secondFormat }}</view>
				<u-icon name="arrow-right" color="#999"></u-icon>
			</view>
		</view>
		<view class="uni-card task-card">
			开关设置

			<view class="gateway-setting" v-for="(btnTask, index) in item.btnTaskList" :key="index">
				<view class="flex-center__sb">
					<view class="flex-center__sb">
						<view class="gateway-setting-switch">
						<u-switch size="18" v-model="btnTask.enable"></u-switch>	
						</view>
						{{btnTask.gatewayBtnName}}
					</view>
					<view class="flex-center__sb" @click="openHmsPicker(btnTask)">
						<view class="uni-text-grey" v-if="btnTask.enable">开启：{{btnTask.second | secondFormat}}</view>
						<view class="uni-text-grey" v-else>不开启</view>
						<u-icon name="arrow-right" color="#999"></u-icon>
					</view>
				</view>
			</view>

		</view>

		<button class="uni-primary-btn" @click="save()">保存设置</button>

		<HmsDatePicker :deFaultSecond="deFaultSecond" v-if="showHmsPicker" @confirm="confirmHms"
			@cancel="showHmsPicker =false"></HmsDatePicker>


	</view>
</template>

<script>
	import HmsDatePicker from '@/components/hmsDatePicker'
	import date from '@/untils/date'
	import gatewayTaskApi from '@/apis/gatewayTask'
	import gatewayApi from '@/apis/gateway'
	import toPage from '../../untils/toPage'
	import WeekChoose from '@/components/weekChoose'
	export default {
		components: {
			HmsDatePicker,
			WeekChoose
		},
		onLoad(option) {
			this.gatewayId = option.gatewayId
			this.gatewayTaskId = option.gatewayTaskId
			if (this.gatewayId) {
				this.gatewayInfo()
			}
			if (this.gatewayTaskId) {
				this.detail()
			}
		},
		data() {
			return {
				gatewayId: '',
				gatewayTaskId: '',
				gateway: {},
				item: {
					taskName: '',
					enable: 1,
					isForever: 1,
					cron: '0 0 0 ? * 1,2,3,4,5,6,7 *',
					btnTaskList: []
				},
				operaBtnTask: {},
				//是否长期
				isForever: [],
				//非长期的时间区间
				specifyTime: [],
				//对应的星期 单次为空数组
				weekList: [],
				//每日开始的起始时间
				startTimeSecond: 0,
				//是否显示 每日开始的起始时间 选择
				showHmsPicker: false,
				deFaultSecond: 0,
				enable: true
			}
		},
		methods: {
			init(type) {
				if (type == 'add') {
					for (let btn of this.gateway.btnList) {
						this.item.btnTaskList.push({
							gatewayBtnName: btn.name,
							enable: true,
							second: 0,
							gatewayBtnId: btn.gatewayBtnId
						})
					}
				}

				this.enable = this.item.enable ? true : false

				if (this.item.isForever) {
					this.isForever = [true]
				} else {
					if (this.item.startAt && this.item.endAt) {
						this.specifyTime = [this.item.startAt, this.item.endAt]
					}
				}
				this.decodeCron(this.item.cron)
			},
			save() {
				this.item.enable = this.enable ? 1 : 0
				this.item.isForever = this.isForever.length > 0 ? 1 : 0
				if (!this.item.isForever) {
					if (this.specifyTime.length != 2) {
						uni.showToast({
							icon: 'none',
							title: '请选择执行时间段'
						})
						return
					}
					this.item.startAt = this.specifyTime[0]
					this.item.endAt = this.specifyTime[1]
				}
				this.item.cron = this.encodeCron()
				for(let taskBtn of this.item.btnTaskList){
					if(!taskBtn.enable){
						taskBtn.second = 0
					}
				}		
				//新增
				if (this.gatewayId) {	
					this.item.gatewayId = this.gatewayId
					uni.showLoading()
					gatewayTaskApi.create(this.item).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '新增成功'
							})
							setTimeout(() => {
								toPage.gatewayTask(this.gatewayId)
							}, 1000)

						}
					})
				} else {
					//编辑
					uni.showLoading()
					gatewayTaskApi.edit(this.item).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '编辑成功'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
						}
					})
				}

			},
			detail() {
				if (this.gatewayTaskId) {
					gatewayTaskApi.detail({
						gatewayTaskId: this.gatewayTaskId
					}).then(res => {
						if (res.code == 0) {
							for(let taskBtn of res.data.btnTaskList){
								taskBtn.enable = (taskBtn.second > 0)
							}
							this.item = res.data
							this.init('edit')
						}
					})
				}
			},
			gatewayInfo() {
				gatewayApi.detail({
					gatewayId: this.gatewayId
				}).then(res => {
					if (res.code == 0) {
						this.gateway = res.data
						this.init('add')
					}
				})
			},
			encodeCron() {
				let nowDate = new Date()
				let year = nowDate.getFullYear()
				let mon = nowDate.getMonth() + 1
				let day = nowDate.getDate()
				let hours = parseInt(this.startTimeSecond / 3600)
				let mins = parseInt((this.startTimeSecond - (hours * 3600)) / 60)
				let second = this.startTimeSecond - (hours * 3600) - (mins * 60)
				if (this.weekList.length == 0) {
					return `${second} ${mins} ${hours} ${day} ${mon} ? ${year}`
				} else {
					let weekStr = this.weekList.join()
					return `${second} ${mins} ${hours} ? * ${weekStr} *`
				}
			},
			decodeCron(cron) {
				let cronList = cron.split(' ')
				let year = cronList[6]
				this.startTimeSecond = parseInt(cronList[0]) + parseInt(cronList[1]) * 60 + parseInt(cronList[2]) * 3600
				if (year == '*') {
					this.weekList = cronList[5].split(',')
				} else {
					this.weekList = []
				}
			},
			changeWeek(week) {
				if (week == null) {
					this.weekList = []
					this.item.isForever = 1
					this.isForever = [true]

					return
				}
				let index = this.weekList.indexOf(week)
				if (index < 0) {
					this.weekList.push(week)
				} else {
					this.weekList.splice(index, 1)
				}
			},
			confirmHms(e) {
				let val = e[0].value * 3600 + e[1].value * 60 + e[2].value
				let hasRun = val > 0
				if (this.operaBtnTask != null) {
					this.operaBtnTask.second = val
					if(hasRun){
						this.operaBtnTask.enable = true
					}
				} else {
					this.startTimeSecond = val
				}
				this.showHmsPicker = false
			},
			openHmsPicker(val) {
				this.operaBtnTask = val
				if (this.operaBtnTask != null) {
					this.deFaultSecond = this.operaBtnTask.second
				} else {
					this.deFaultSecond = this.startTimeSecond
				}
				this.showHmsPicker = true
			},
		},
		filters: {
			secondFormat(second = 0) {
				return date.secondFormat(second)
			}
		},
		computed: {
			isSingle() {
				return !this.weekList.length
			}
		}
	}
</script>

<style lang="scss" scoped>
	.task {

		&-card {
			font-size: 32rpx;
			margin-bottom: 30rpx;
		}

		&-time-box {
			text-align: center;
			color: rgba(0, 0, 0, 0.5);
		}

		.base-grey-box {
			padding: 24rpx;
			background-color: #F8F8F8;
			border-radius: 8rpx;
			margin: 0 -10rpx;
		}

		&-choose-btn {
			background-color: #4166D8;
			border-color: #4166D8;
			color: white;
			flex: 0 0 120rpx;
			height: 70rpx;
			margin: 10rpx;
			font-size: 28rpx;
			padding: 0;
		}

		&-btn {
			background-color: white;
			border-color: #DFDFDF;
			color: rgba(0, 0, 0, 0.5);
			flex: 0 0 120rpx;
			height: 70rpx;
			margin: 10rpx;
			font-size: 28rpx;
			padding: 0;
		}

		.gateway-setting {
			margin-top: 42rpx;

			&__point {
				width: 10rpx;
				height: 10rpx;
				background-color: #4166D8;
				margin-right: 14rpx;
			}

			&-grey-box {
				margin-top: 12rpx;
			}
			
			&-switch{
				margin-right: 10rpx;
			}
		}
	}
</style>
