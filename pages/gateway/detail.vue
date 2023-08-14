<template>
	<view class="gateway-detail">
		<u-sticky>
		<view class="header">
			<view class="flex-center__sb">
				<view class="header-name">{{name}}</view>

				<view class="uni-flex uni-row">
					<view class="header-wifi">
						<view class="header-wifi-icon"
							:class="online==1 ? 'header-wifi-icon-on' : 'header-wifi-icon-off'">
						</view>
						<view class="header-wifi-status"
							:class="online==1 ? 'header-wifi-status-online':'header-wifi-status-offline'">
							{{online==1 ? '在线': '离线'}}
						</view>
					</view>


					<!-- 	<view class="header-clock">
						
						<view class="header-clock-icon" ></view>

						<view class="header-clock-label">定时</view>

					</view> -->

					<view @click="toSetting">
						<view class="header-setting-icon"></view>
						<view class="header-setting-label">设置</view>
					</view>
				</view>

			</view>
		</view>
		</u-sticky>
<!-- 		<scroll-view scroll-y="true" class="gateway-detail__list">
			<u-row :customStyle="{flexWrap: 'wrap',marginTop:'10rpx'}">
				<u-col span="4" v-for="(btn,index) in item.btnList" :key="index">
					<view class="item-view" @click="toggle(btn)">
						<image class="item-view-item-btn" :src="gatewayBtnIcon(btn)">
						</image>
						<view class="uni-flex uni-row"
							style="margin-top: -15rpx; justify-content: center;align-items: center;">

							<view class="dot" :class="btn.status == openStatus ? 'dot-status-on':'dot-status-off'">
							</view>

							<view class="item-view-item-text"
								:class="btn.status == openStatus ?'item-view-item-text-on':'item-view-item-text-off'">
								{{btn.name}}
							</view>
						</view>
					</view>
				</u-col>
			</u-row>
		</scroll-view> -->
		
		<view class="gateway-detail__list">
			
	
		<u-row :customStyle="{flexWrap: 'wrap'}"  justify="space-between"
            gutter="15">
			
			<u-col span="12"  v-for="(btn,index) in btnList" :key="index">
				
				
			<view class="card-item flex-center__sb"  v-if="deviceType==1">
						
					<view class="uni-flex uni-column" v-for="(item,i) in btn.environmentalImprovementList" :key="i" style="margin-right: 10rpx;">
						
						<view class="uni-flex uni-row">
						<image class="card-item__icon" :src="btnTypeIcon(item.environmentalType)"></image>
						<text class="card-item__title-num" v-if="item.quantity">{{`x${item.quantity}`}}</text>
						</view>	
						<view class="card-item__title-name">
							{{item.name}}
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
					
					<view class="uni-flex uni-row">
					<image class="card-item__icon" :src="btnTypeIcon(item.environmentalType)"></image>
					<text class="card-item__title-num" v-if="item.quantity">{{`x${item.quantity}`}}</text>
					</view>	
					<view class="card-item__title-name">
						{{item.name}}
					</view>	
					
					<view class="card-item__tag-view uni-flex uni-row">
						
					
					<text style="margin-right: 10rpx;" class="card-item__tag-view-error" v-if="item.errorStatus==1">故障</text>
						<text style="margin-right: 10rpx;" class="card-item__tag-view-text">{{remoteStatus[item.remoteStatus]}}</text>
					<text class="card-item__tag-view-text" v-if="item.flow" >{{item.flow | flowValFilter(item.environmentalType)}}</text>	
						
					</view>
						
					</view>

					
					<view class="uni-flex uni-row">
						
								
					<image class="card-item__image" :src="autoModelIcon(item)">
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
	import toPage from '@/untils/toPage'
	import permissionApi from '@/apis/permission'
	import defaultParams from '@/untils/defalutParams'
	import {
		OPEN_STATUS,
		CLOSE_STATUS,
		PLC_ICONS
	} from '@/untils/const'
	export default {
		data() {
			return {
				perms: null,
				openStatus: OPEN_STATUS,
				closeStatus: CLOSE_STATUS,
				timer: '',
				isDestroyed: false,
				editName: false,
				gatewayId: '',
				item: {},
				canClickBtns: [],
				btnList:[],
				online:0,
				name:'',
				deviceType:0,
				remoteStatus:['就地','远程'],
				autoModel:['自动','手动'],
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
		onLoad(option) {
			if (option.title) {
				uni.setNavigationBarTitle({
					title: option.title
				})
			}
			this.gatewayId = option.gatewayId
			this.online = option.online
			this.name = option.name
			this.deviceType = option.deviceType
			if(this.deviceType == 1){
				this.getPerms()
			}
			uni.$on('edit',this.onChangeGatewayName)
		},
		onShow() {
			this.isDestroyed = false
			this.editName = true
			this.detail()
		},
		destroyed() {
			this.isDestroyed = true
			this.editName = false
			uni.$off('edit',this.onChangeGatewayName)
		},
		methods: {
			getPerms() {
				permissionApi.getGatewayPerm(this.gatewayId).then(res => {
					if (res.code == 0) {
						this.perms = res.data
					}
				})
			},
			onChangeGatewayName(data){
				console.log(`edit event${data.name}`)
				this.name = data.name
				console.log('edit event set val')
			},
			detail() {
				if (this.timer) {
					clearTimeout(this.timer)
				}
				api.gatewayBtnList({
					gatewayId: this.gatewayId
				}).then(res => {
					if (res.code == 0) {
						// if (this.editName || !this.item.name || this.item.name != res.data.name) {
						// 	this.editName = false
						// 	// uni.setNavigationBarTitle({
						// 	// 	title: res.data.name
						// 	// })
						// }
						// this.item = res.data
						// this.canClickBtns = this.item.btnList.filter(item => item.canClick)
						// 	.map(item => item.gatewayBtnId)
						this.btnList = res.data
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
			toSetting() {
				toPage.toSetting(this.gatewayId, this.name)
			},
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
			
			btnTypeIcon(type){
				const iconName = PLC_ICONS[type - 1]
				return `/static/images/gateway/icon-color-${iconName}@2x.png`
			}
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
			},
		}

	}
</script>

<style lang="scss" scoped>
	.gateway-detail {
		background: #FFFFFF;
		height: 100vh;
		
		&__list {
			padding: 15rpx 30rpx;
		}
	}

	.header {
		padding: 30rpx 40rpx;
		border-top-style: solid;
		border-top-color: #F8F8F8;
		border-top-width: 2rpx;

		background: #FFFFFF;

		box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153, 153, 153, 0.2);
		border-radius: 8rpx;

		&-setting {

			&-icon {
				width: 54rpx;
				height: 54rpx;
				background-repeat: no-repeat;
				background-position: center center;
				background-size: 100% 100%;
				background-image: url(../../static/images/gateway/icon-setting@2x.png);
			}

			&-label {
				font-size: 30rpx;
				font-weight: 500;
				color: #999999;
			}
		}

		&-clock {
			margin-left: 50rpx;
			margin-right: 50rpx;

			&-icon {
				width: 54rpx;
				height: 54rpx;
				background-repeat: no-repeat;
				background-position: center center;
				background-size: 100% 100%;
				background-image: url(../../static/images/gateway/icon-clock@2x.png);
			}

			&-label {
				font-size: 30rpx;
				font-weight: 500;
				color: #999999;
			}
		}

		&-name {
			font-size: 36rpx;
			font-weight: 500;
			margin-left: 18rpx;
			flex: 1;
			word-break: break-all;
			word-wrap: break-word;
		}

		&-wifi {
			margin-left: 50rpx;
			margin-right: 50rpx;

			&-status {
				font-size: 30rpx;
				font-weight: 500;


				&-online {
					color: #4166D8;
				}

				&-offline {
					color: #999999;
				}
			}

			&-icon {
				height: 54rpx;
				width: 54rpx;
				background-repeat: no-repeat;
				background-position: center center;
				background-size: 100% 100%;

				&-on {
					background-image: url(../../static/images/gateway/wifi-on@2x.png);

				}

				&-off {
					background-image: url(../../static/images/gateway/wifi-off@2x.png);
				}
			}

		}

	}
	
	.card-item{
		height: 180rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153,153,153,0.2);
		border-radius: 8rpx;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
		padding-left: 30rpx;

		&__icon{
			width: 40rpx;
			height: 40rpx;
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
			margin-top: 10rpx;
			
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

	.item-view {
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
</style>
