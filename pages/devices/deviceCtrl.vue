<template>
	<view class="dev-ctrl">
		<EmptyList v-if="btnList.length == 0"></EmptyList>
<!-- 		<view style="padding-left: 5rpx;padding-right: 5rpx;">
			<u-row :customStyle="{flexWrap: 'wrap'}">
				<u-col span="4" v-for="(btn,index) in btnList" :key="index">
					<view class="dev-ctrl__item-view">
						<image class="dev-ctrl__item-view-item-btn" :src="gatewayBtnIcon(btn)">
						</image>

						<view class="uni-flex uni-row"
							style="margin-top: -15rpx; justify-content: center;align-items: center;">

							<view class="dot" :class="btn.status == openStatus ? 'dot-status-on':'dot-status-off'">
							</view>

							<view class="dev-ctrl__item-view-item-text"
								:class="btn.status == openStatus ?'dev-ctrl__item-view-item-text-on':'dev-ctrl__item-view-item-text-off'">
								{{btn.name}}
							</view>

						</view>

					</view>
				</u-col>
			</u-row>
		</view> -->
		
		<view class="dev-ctrl__list">
			
			
		<u-row :customStyle="{flexWrap: 'wrap'}"  justify="space-between"
            gutter="15">
			
			<u-col span="12"  v-for="(btn,index) in btnList" :key="index">
				
				
			<view class="card-item flex-center__sb" v-if="deviceType == 1">
				
				<view class="uni-flex uni-column" v-for="(item,i) in btn.environmentalImprovementList" :key="i" style="margin-right: 10rpx;">
					
					<view class="uni-flex uni-row" style="align-items: flex-end">
					<image class="card-item__icon" :src="btnTypeIcon"></image>
					<text class="card-item__title-num" v-if="item.quantity">{{`x${item.quantity}`}}</text>
					</view>	
					<view class="card-item__title-name">
						{{plcTitle}}
					</view>	
					
					<view class="card-item__tag-view uni-flex uni-row">
						
				<text style="margin-right: 10rpx;" class="card-item__tag-view-error" v-if="item.errorStatus==1">故障</text>
						
						<text class="card-item__tag-view-text" v-if="item.flow">{{item.flow | flowValFilter(item.environmentalType)}}</text>
					</view>
						
					</view>
					
					<image class="card-item__image" :src="gatewayBtnIcon(btn)" @click="toggle(btn)">
					</image>		
							
									
									
			</view>
				
				
				<view class="card-item flex-center__sb" v-for="(item,i) in btn.environmentalImprovementList" :key="i" v-else>
					
					
					<view class="uni-flex uni-column">
					
					<view class="uni-flex uni-row" style="align-items: flex-end">
					<image class="card-item__icon" :src="btnTypeIcon"></image>
					<text class="card-item__title-num" v-if="item.quantity">{{`x${item.quantity}`}}</text>
					</view>	
					<view class="card-item__title-name">
						{{plcTitle}}
					</view>	
					
					<view class="card-item__tag-view  uni-flex uni-row">
			
							<text style="margin-right: 10rpx;" class="card-item__tag-view-error" v-if="item.errorStatus==1">故障</text>
					<text style="margin-right: 10rpx;" class="card-item__tag-view-text">{{remoteStatus[item.remoteStatus]}}</text>
				<text class="card-item__tag-view-text" v-if="item.flow" >{{item.flow}}</text>
						
					</view>
						
					</view>
					
					<view class="uni-flex uni-row">
						
			
					<image  class="card-item__image" :src="autoModelIcon(item)">
					</image>
			
					<image class="card-item__image" :src="gatewayBtnIconPlc(item)">
					</image>
					
					</view>
					
				</view>
			</u-col>
			
		</u-row>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import api from '@/apis/gateway'
	import permissionApi from '@/apis/permission'
	import defaultParams from '@/untils/defalutParams'
	import EmptyList from '@/components/emptyList'
	import {
		OPEN_STATUS,
		CLOSE_STATUS,
		PLC_ICONS,
		PLC_TITLES
	} from '@/untils/const'

	export default {
		components: {
			EmptyList
		},

		onLoad(option) {
			uni.setNavigationBarTitle({
				title: option.title
			})
			this.gatewayId = option.gatewayId
			this.envType = option.type
			
			this.deviceType = option.deviceType
			console.log('this.devicetype:'+this.deviceType)
			if(this.deviceType == 1){
				this.getPerms()
			}
		},
		onShow() {
			this.isDestroyed = false
			this.detail()
		},
		destroyed() {
			this.isDestroyed = true
		},
		data() {
			return {
				gatewayId: '',
				envType: 0,
				perms: null,
				openStatus: OPEN_STATUS,
				closeStatus: CLOSE_STATUS,
				btnList: [{
		createTime: "2023-06-14 18:04:44",
		remark: null,
		gatewayBtnId: 341,
		name: "PLC1",
		num: 1,
		gatewayId: 72,
		openIcon: null,
		closeIcon: null,
		status: 1,
		lastOpenTime: "2023-08-12 21:09:50",
		canClick: false,
		gatewayName: null,
		environmentalImprovementList: [{
			environmentalImprovementId: 73,
			environmentalType: 1,
			farmId: 2307,
			flow: null,
			gatewayBtnId: 341,
			gatewayBtnName: null,
			delFlag: 0,
			farmName: null,
			canRemoteControl: false,
			quantity: null,
			errorStatus: 0,
			switchStatus: 1,
			remoteStatus: 1,
			timeoutStatus: 0,
			autoModel: 0,
			name: "PLC1",
			brandType: null,
			online: null,
			offlineTime: null,
			lastTranServerTime: "2023-08-12 21:09:50",
			gatewayName: null,
			remark: null
		}],
		environmentalImprovementNum: null
	}],
				canClickBtns: [],
				timer: '',
				isDestroyed: false,
				remoteStatus:['就地','远程'],
				autoModel:['自动','手动'],
				deviceType:0,
				// btnList:[
				// 	{
				// 		environmentalImprovementList:[
				// 			{
				// 				autoModel: 0,
				// 				brandType: null,
				// 				canRemoteControl: false,
				// 				delFlag: 0,
				// 				environmentalImprovementId: 192,
				// 				environmentalType: 3,
				// 				errorStatus: 0,
				// 				farmId: null,
				// 				farmName: null,
				// 				flow: 20,
				// 				gatewayBtnId: 460,
				// 				gatewayBtnName: null,
				// 				gatewayName: null,
				// 				lastTranServerTime: "2023-06-25 13:40:13",
				// 				name: "雾化盘1",
				// 				offlineTime: null,
				// 				online: null,
				// 				quantity: 4,
				// 				remark: null,
				// 				remoteStatus: 0,
				// 				switchStatus: 0,
				// 				timeoutStatus: 0,
				// 			}
				// 		]
				// 	},{
				// 		environmentalImprovementList:[
				// 			{
				// 				autoModel: 0,
				// 				brandType: null,
				// 				canRemoteControl: false,
				// 				delFlag: 0,
				// 				environmentalImprovementId: 192,
				// 				environmentalType: 3,
				// 				errorStatus: 1,
				// 				farmId: null,
				// 				farmName: null,
				// 				flow: 10,
				// 				gatewayBtnId: 460,
				// 				gatewayBtnName: null,
				// 				gatewayName: null,
				// 				lastTranServerTime: "2023-06-25 13:40:13",
				// 				name: "雾化盘1",
				// 				offlineTime: null,
				// 				online: null,
				// 				quantity: 2,
				// 				remark: null,
				// 				remoteStatus: 0,
				// 				switchStatus: 0,
				// 				timeoutStatus: 0,
				// 			}
				// 		]
				// 	}
				// ]
			}
		},
		methods: {
		gatewayBtnIcon(btn) {
				return defaultParams.gatewayBtnIconv2((btn.status == this.openStatus), (btn.status == this.openStatus ? btn
					.openIcon :
					btn.closeIcon))
			},
			
			gatewayBtnIconPlc(btn) {
				return defaultParams.gatewayBtnIconv2((btn.switchStatus == this.openStatus), (btn.switchStatus == this.openStatus ? btn
					.openIcon :
					btn.closeIcon))
			},
			
			autoModelIcon(btn){
				return btn.autoModel == 0 ? '/static/images/gateway/btn/icon-plc-auto-remote@2x.png':
				'/static/images/gateway/btn/icon-plc-hand@2x.png'
			},
			
			// btnTypeIcon(type){
			// 	const iconName = PLC_ICONS[type - 1]
			// 	return `/static/images/gateway/icon-color-${iconName}@2x.png`
			// },
			getPerms() {
				permissionApi.getGatewayPerm(this.gatewayId).then(res => {
					if (res.code == 0) {
						this.perms = res.data
					}
				})
			},
			detail() {
				if (this.timer) {
					clearTimeout(this.timer)
				}
				api.gatewayBtnList({
					gatewayId: this.gatewayId,
					type: this.envType
				}).then(res => {
					if (res.code == 0) {
						// this.btnList = res.data.btnList
						// this.canClickBtns = this.btnList.filter(item => item.canClick)
						// 	.map(item => item.gatewayBtnId)
						// if (!this.isDestroyed) {
						// 	this.timer = setTimeout(this.detail, 5000)
						// }
						// this.btnList = res.data
						if (!this.isDestroyed) {
							this.timer = setTimeout(this.detail, 1000)
						}
					}
				})
			},
			toggle(btn) {
				if (!(this.perms.isOwner || this.perms.permissions[0])) {
					this.$refs.uToast.show({
						type: 'defalut',
						title: '没有控制权限',
						message: '您没有该设备的控制权限',
						duration: 1000
					})
				} else {

					if (!btn.canClick) {
						this.$refs.uToast.show({
							type: 'default',
							message: '无法控制',
							duration: 300
						})
						return
					}
					let status = btn.status == this.openStatus ? this.closeStatus : this.openStatus

					this.$refs.uToast.show({
						type: 'loading',
						title: '执行中',
						message: status == this.openStatus ? '开启中' : '关闭中',
						duration: 300
					})
					api.toggle([btn.gatewayBtnId],
						status
					).then(res => {
						if (res.code == 0) {

						}
					})
				}

			},
			batchToggle(status) {
				if (this.canClickBtns.length == 0) return
				if (!(this.perms.isOwner || this.perms.permissions[0])) {
					this.$refs.uToast.show({
						type: 'defalut',
						title: '没有控制权限',
						message: '您没有该设备的控制权限',
						duration: 1000
					})
				} else {
					this.$refs.uToast.show({
						type: 'loading',
						title: '执行中',
						message: status == this.openStatus ? '开启中' : '关闭中',
						duration: 300
					})
					api.toggle(this.canClickBtns,
						status
					).then(res => {
						if (res.code == 0) {

						}
					})

				}
			},

		},
		filters:{
			flowValFilter(val,type){
				if (null == val || val == undefined) {
					return ''
				}
				if(type == 1){
					return `通风量${val}m³/s`
				}
				else if(type == 3){
					return `喷洒量${val}ml/s`
				}
				return `功率${val}w`
			}
		},
		computed: {
			plcTitle() {
				return PLC_TITLES[this.envType - 1]
			},
			btnTypeIcon(){
				const iconName = PLC_ICONS[this.envType - 1]
				return `/static/images/gateway/icon-color-${iconName}@2x.png`
			},
		},
	}
</script>

<style lang="scss">
	.dev-ctrl {
		height: 100vh;
		background: #FFFFFF;

		&__list {
			padding: 15rpx 30rpx;
		}

		&__all-ctrl-btn {
			display: flex;
			justify-content: space-between;


			&-switch-on {
				flex: 1;
				margin-right: 15rpx;
			}

			&-switch-off {
				flex: 1;
				background: white;
				margin-left: 15rpx;
			}
		}

		&__item-view {
			text-align: center;
			margin-top: 10rpx;
			margin-bottom: 10rpx;

			&-item-btn {
				height: 200rpx;
				width: 200rpx;
			}

			&-item-text {
				font-size: 26rpx;
				font-weight: 500;

				&-on {
					color: #666666;
				}

				&-off {
					color: #CCCCCC;
				}

			}

		}

		.dot {
			width: 8rpx;
			height: 8rpx;
			margin-left: 10rpx;
			margin-right: 10rpx;
			border-radius: 50%;

			&-status-on {
				background: #5AD8A6;
			}

			&-status-off {
				background: #CCCCCC;
			}
		}
	}
	.card-item{
		height: 226rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153,153,153,0.2);
		border-radius: 8rpx;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
		padding-left: 50rpx;
		padding-right: 18rpx;
	
		&__icon{
			width: 60rpx;
			height: 60rpx;
		}
		
		&__title{
			font-size: 28rpx;
			font-weight: 500;
			
			&-name{
				color: #000000;
			}
			
			&-num{
				margin-left: 10rpx;
				color: #999999;
			}
			
		}
		
		&__tag-view{
			margin-top: 16rpx;
			
			&-text{
				padding: 2rpx 14rpx;
				background: #F3F3F3;
				border-radius: 4rpx;
				text-align: center;
				font-size: 20rpx;
				font-weight: 500;
				color: rgba(153,153,153,0.8);
			}
			
			&-error{
				padding: 2rpx 14rpx;
				border-radius: 4rpx;
				border: 1px solid #FF5A46;
				text-align: center;
				font-size: 20rpx;
				font-weight: 500;
				color: #FF5A46;
			}
			
		}
		
		&__image{
			width: 164rpx;
			height: 164rpx;
		}
			
		
	}
	
</style>
