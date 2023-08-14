<template>
	<view>
		<view class="logo">
			<image style="width: 100%;" src="../../static/images/index/bg_index@2x.jpg"></image>
			<view class="uni-flex uni-row logo-title" @click="farmList.length>1?handleOpenFarmPopup():null">
				<text class="logo-title-text">{{curFarmName}}</text>
				<u-icon name="/static/images/index/icon-dropdown@2x.png" width="18rpx" height="18rpx"
					v-if="farmList.length>1"></u-icon>
			</view>
			<!-- 预警总数 -->
			<view class="logo-subtitle">
				<view class="logo-subtitle-text" v-if="totalWarnCount">
					预警总数 <text class="warn-total">{{totalWarnCount}}</text>
				</view>
			</view>
		</view>

		<!-- tabs -->
		<view style="margin-top: -75px;">
			<view class="index-tab">
				<!-- <u-sticky> -->
				<u-tabs :list="list" lineColor="#4166D8" :activeStyle="tabsActiveStyle"
					:inactiveStyle="tabsInactiveStyle" :itemStyle="tabsItemStyle" @click="onTabClick"
					:current="currentTab">
					<view slot="right" class="uni-flex tab-more-bg" @tap="handleOpenDrawer">
						<u-icon name="/static/images/index/icon-tab-more@2x.png"></u-icon>
					</view>
				</u-tabs>
				<!-- </u-sticky> -->
			</view>
			<view class="index-content">
				<!-- 为空时 -->
				<EmptyList v-if="list.length == 0"></EmptyList>
				<!-- 详情 -->
				<view class="flex-center__sb" v-else>
				
				<view class="bg-item-card flex-center__center" style="margin-right: 20rpx;" >
					
					<view class="bg-item-card__name-status">
						<view class="uni-flex uni-row">
							<image src="/static/images/index/icon-index-stock@2x.png" 
							style="width: 40rpx;height: 40rpx;"></image>
							<text style="margin-left: 10rpx;font-size: 28rpx;color: black;font-weight: 500;">存栏</text>
						</view>
						<!-- <view class="label-theme-status">
							{{hasLivestock?'有':'无'}}
						</view> -->
						<u-switch  @change="gatewayStockSet" v-model="hasLivestock" size="20"
						 active-color="#4166D8" :active-value="openStatus" :inactive-value="closeStatus">
							
						</u-switch>
					</view>
					
				</view>	
				
				<view class="bg-item-card flex-center__center"  @click="navToGateWayDetail">
					<!-- 设备状态 -->
					<view class="bg-item-card__name-status">
						<view class="uni-flex uni-row">
							<image :src="plcOnline ? '/static/images/index/icon-gateway-online@2x.png'
						:'/static/images/gateway/wifi-off@2x.png'" style="width: 40rpx;height: 40rpx;"></image>
							<text style="margin-left: 10rpx;font-size: 28rpx;color: black;font-weight: 500;">{{
							deviceTypeName[deviceType-1]
						}}</text>
						</view>
						<view class="label-status">
							<view class="online-dot" v-if="plcOnline"></view>
							{{plcOnline?'在线':'离线'}}
							<u-icon name="arrow-right" color="#999"></u-icon>
						</view>
					</view>
				</view>
				</view>
				<template v-if="currentPlcInfo.gatewayId">
					<!-- 传感设备 -->
					<view style="margin-top: 20rpx;" v-for="(item,index) in environmentalCollectionList" :key="index">
						<env-card-view :env-data="item" @click="showEnvSuggestions"></env-card-view>
					</view>
					<!-- 改良设备 -->
					<u-row :customStyle="{flexWrap: 'wrap',marginTop:'10rpx'}" gutter="10"
						v-if="statisticsList.length>0">
						<u-col :span="statisticsList.length>1?6:12" v-for="(item,index) in statisticsList" :key="index">
							<plc-card-view :count-info="item" @click="toDeviceCtrl"></plc-card-view>
						</u-col>
					</u-row>
					<view v-else>
						<u-row :customStyle="{flexWrap: 'wrap',marginTop:'10rpx'}" gutter="10" v-if="deviceType == 1">
							<u-col span="12">
								<add-card-view @click="addDevices"></add-card-view>
							</u-col>
						</u-row>
					</view>
				</template>
			</view>
		</view>
		<!-- 添加网关弹框 -->
		<u-modal :show="showEnterCodeModal" :closeOnClickOverlay="true" :showConfirmButton="false"
			:safeAreaInsetBottom="true" @close="showEnterCodeModal =false">
			<view class="edit-modal">
				<view class="flex-center__sb">
					<view class="edit-modal__title">添加网关</view>
					<view class="edit-modal__close-icon-box">
						<u-icon name="close" size="36rpx" @click="showEnterCodeModal = false">
						</u-icon>
					</view>
				</view>
				<view class="edit-modal__item">
					<input class="edit-modal__input" v-model="addDeviceSn" type="text" placeholder="请输入设备编码"  placeholder-style="color:#999999;"/>
				</view>
				<button class="uni-primary-btn edit-modal__save-btn" @click="snBind(addDeviceSn)">
					添加
				</button>
			</view>

		</u-modal>
		
		<!-- 预警建议框 start-->
		
		<u-modal :show="showSuggestModel" :closeOnClickOverlay="true" :showConfirmButton="false"
			:safeAreaInsetBottom="true" @close="showSuggestModel =false">
			<view class="suggest-modal">
	
				<view class="suggest-modal__popup-title">预警分析建议</view>
				
				
				<view class="justify-content__sb" style="align-items: flex-end">
					
					<view class="suggest-modal__title">问题描述：</view>
					
					<view class="suggest-modal__range" v-if="envSuggestions.warnConfDetailList!=null && envSuggestions.warnConfDetailList.length > 0">{{envSuggestions.warnConfDetailList | envTypeFilter }}</view>
					
				</view>
				
				<view class="suggest-modal__content">{{envSuggestions.description}}</view>
				
				<view class="suggest-modal__title" v-if="envSuggestions.outdoorReason!=null && envSuggestions.outdoorReason.length > 0">外部原因：</view>
				
				<view style="margin-top: 20rpx;" v-if="envSuggestions.outdoorReason!=null && envSuggestions.outdoorReason.length > 0">
				<view class="suggest-modal__content" v-for="(item, index) in envSuggestions.outdoorReason" :key="index" >{{`${index+1}. ${item}`}}</view>
				</view>
				<view class="suggest-modal__title">设备运行情况：</view>
				
				<view style="margin-top: 20rpx;">
					
					<view v-if="envSuggestions.conditionList ==null || envSuggestions.conditionList.length==0" class="suggest-modal__content">无</view>	
					
				<view class="suggest-modal__content" v-for="(item, index) in envSuggestions.conditionList" :key="index">{{`${index+1}. ${item}`}}</view>
				</view>
				<view class="suggest-modal__title">建议：</view>
				
				<view style="margin-top: 20rpx;">
			
			<view v-if="envSuggestions.suggestion==null || envSuggestions.suggestion.length==0"  class="suggest-modal__content">无</view>		
					
				<view class="suggest-modal__content" v-for="(item, index) in envSuggestions.suggestion" :key="index">{{`${index+1}. ${item}`}}</view>
				
				</view>	
			</view>
		
		</u-modal>
		
		
		<!-- 预警建议框 end -->
		
		<!-- 左侧列表弹框 -->
		<uni-drawer ref="leftDrawer" mode="left" :width="260">
			<view class="drawer">
				<scroll-view class="drawer__scroll-view" scroll-y="true">
					<view class="drawer__view-holder"></view>
					<add-card-view title="添加网关" @click="showAddGateWayOptionSheet"></add-card-view>
					<view class="drawer__view-divider"></view>
					<EmptyList v-if="list.length == 0"></EmptyList>
					<block v-for="(item, index) in list" :key="index">
						<view class="drawer__item-view  flex-center__sb" hover-class="drawer__item-view-hover"
							@click="onDrawItemClick(item,index)">
							<view class="drawer__item-view-title">{{item.name}}</view>
							<u-badge :value="item.warnNum" type="error" shape="circle" bgColor="#FF5A46"></u-badge>
						</view>
						<view class="drawer__item-divider"></view>
					</block>
				</scroll-view>
			</view>
		</uni-drawer>

		<!-- 养殖场列表弹框 -->
		<!-- <u-popup :show="farmPopupVisible" :round="10" mode="bottom" @close="farmPopupVisible = false"> -->
		<uni-popup ref="farmPopup" background-color="#fff" type="bottom">
			<view class="bottom-sheet">
				<scroll-view class="drawer__scroll-view" scroll-y="true">
					<block v-for="(item, index) in farmList" :key="index">
						<view class="bottom-sheet__item-view flex-center__sb"
							hover-class="bottom-sheet__item-view-hover" @click="onFarmItemClick(item,index)">
							<view class="bottom-sheet__item-view-text">{{item.name}}</view>
							<u-icon name="checkmark" size="26" color="#4166D8" v-if="curFarmPos == index"></u-icon>
						</view>
						<view class="bottom-sheet__item-view-decoration"></view>
					</block>
				</scroll-view>
			</view>
		</uni-popup>
		<!-- </u-popup> -->

	</view>
</template>

<script>
	import toPage from '@/untils/toPage'
	import gatewayApi from '@/apis/gateway'
	import shareApi from '@/apis/share'
	import envCardView from "@/components/env-card-view.vue"
	import addCardView from "@/components/add-card-view.vue"
	import plcCardView from "@/components/plc-card-view.vue"
	import wybNoticeBar from '@/components/wyb-noticeBar/wyb-noticeBar.vue'
	import addDevicesVue from '../devices/addDevices.vue'
	import baseApi from '@/apis/base';
	import dateUtils from '@/untils/date'
	import EmptyList from '@/components/emptyList'
	import {
		OPEN_STATUS,
		CLOSE_STATUS,
	} from '@/untils/const'

	export default {
		components: {
			EmptyList,
			envCardView,
			addCardView,
			plcCardView,
			wybNoticeBar
		},

		onLoad(option) {
			let shareCode = option.shareCode
			if (shareCode) {
				this.shareBind(shareCode)
			}
			this.getFarmList()
		},
		onShow() {
			this.isDestroyed = false
			this.intervalNoticeId = setInterval(() => {
				this.getList()
			}, 1000)
			// this.intervalNoticeId = setInterval(() => {
			// 	this.getOfflineList()
			// }, 5000)
			uni.$once('update', function(data) {
				this.currentTab = 0
			})
		},
		onHide() {
			this.cancelRequest()
		},
		onUnload() {
			this.cancelRequest()
		},
		data() {
			return {
				showEnterCodeModal: false,
				showSuggestModel:false,
				addDeviceSn: '',
				list: [],
				deviceTypeName: ['网关', 'PLC'],
				deviceType: 1,
				isDestroyed: false,
				intervalNoticeId: null,
				timer: '',
				environmentalCollectionList: [{
			environmentalCollectionId: 84,
			farmId: 2307,
			gatewayId: 72,
			sn: null,
			channel: 1,
			collectionType: 4,
			collectionData: "1.0,29.79,92.50",
			farmName: null,
			name: "氨气温湿度传感器1",
			online: 1,
			brandType: null,
			offlineTime: "2023-08-11 00:54:09",
			lastTranServerTime: "2023-08-14 16:13:15",
			envCollectionDataList: [{
				dataType: 1,
				dataValue: 1.0,
				dataStatus: 0
			}, {
				dataType: 2,
				dataValue: 29.79,
				dataStatus: 0
			}, {
				dataType: 3,
				dataValue: 92.50,
				dataStatus: 0
			}]
		}, {
			environmentalCollectionId: 85,
			farmId: 2307,
			gatewayId: 72,
			sn: null,
			channel: 1,
			collectionType: 5,
			collectionData: "502",
			farmName: null,
			name: "二氧化碳传感器1",
			online: 1,
			brandType: null,
			offlineTime: "2023-08-10 18:04:11",
			lastTranServerTime: "2023-08-14 16:13:13",
			envCollectionDataList: [{
				dataType: 5,
				dataValue: 502,
				dataStatus: 0
			}]
		}],
				statisticsList: [{
			environmentalType: "1",
			num: "1",
			faultNum: "0",
			openNum: "1",
			onlineNum: "1"
		}, {
			environmentalType: "2",
			num: "1",
			faultNum: "0",
			openNum: "0",
			onlineNum: "1"
		}, {
			environmentalType: "3",
			num: "1",
			faultNum: "0",
			openNum: "0",
			onlineNum: "1"
		}, {
			environmentalType: "5",
			num: "1",
			faultNum: "0",
			openNum: "0",
			onlineNum: "1"
		}],
				addEntries: [{
					environmentalType: -1,
					num: 0,
					onlineNum: 0
				}],
				currentTab: 0,
				notices: [],

				farmList: [
					{farmId:2307,name:'XXX111'},
					{farmId:8239,name:'XXX222'}
				],
				curFarmPos: 0,
				curFarmId: 0,
				curFarmName: '',
				envSuggestions:{},
				openStatus: OPEN_STATUS,
				closeStatus: CLOSE_STATUS,
				hasLivestock:0,
				// 养殖场弹出框
				// farmPopupVisible: false,

			}
		},
		computed: {
			tabsActiveStyle() {
				return {
					color: '#000',
					fontSize: '34rpx'
				}
			},
			tabsInactiveStyle() {
				return {
					color: '#999',
				}
			},
			tabsItemStyle() {
				return {
					height: '70rpx',
					color: '#999',
					fontSize: '30rpx',
					fontWeight: '500',
				}
			},
			totalWarnCount() {
				let count = 0;
				this.list.map(o => {
					count += o.warnNum
				})
				return count
			},

			// 当前网关信息
			currentPlcInfo() {
				const plcInfo = this.list.length ? this.list[this.currentTab] : {
					online: 0,
					gatewayId: 0
				};
				return plcInfo
			},
			plcOnline() {
				return this.currentPlcInfo.online
			}
		},
		methods: {
			getList() {
				if (this.farmList.length == 0) return
				gatewayApi.listv2(this.curFarmId).then(res => {
					if (res && res.code == 0) {
						this.list = res.data.map(item => ({
							...item,
							hasLivestock: item.hasLivestock || this.closeStatus,
							badge: {
								value: item.warnNum
							}
						}))
						this.deviceType = this.currentPlcInfo.type
						this.hasLivestock = this.currentPlcInfo.hasLivestock
					}
				}).then(() => {
					this.getEnvList()
				})
			},
			getFarmList() {
				gatewayApi.farmList().then(res => {
					if (res && res.code == 0) {
						// this.farmList = res.data || [];
						this.curFarmId = this.farmList.length > 0 ? this.farmList[0].farmId : 0;
						this.curFarmPos = 0;
						this.curFarmName = this.farmList.length > 0 ? this.farmList[0].name : '';
						uni.setStorageSync('farmId', this.curFarmId);
					}
				}).then(() => {
					this.getList()
				})
			},
			getEnvList() {
				if (this.list.length == 0) return
				gatewayApi.envList(this.currentPlcInfo.gatewayId).then(res => {
					if (res && res.code == 0) {
						// this.environmentalCollectionList = res.data.environmentalCollectionList || [];
						// this.statisticsList = res.data.statisticsList || [];

						// 	let tmpList = res.data.statisticsList != null && res.data.statisticsList.length > 0 ? res
						// 		.data.statisticsList.filter(item => +item.environmentalType > 0) : []
						// 	this.statisticsList = this.deviceType == 1 ?
						// 		tmpList.concat(this.addEntries) : tmpList
					}
				})
			},

			getOfflineList() {
				if (this.list.length == 0) return
				gatewayApi.offlineList({
					gatewayId: this.currentPlcInfo.gatewayId,
					limit: 10,
					page: 1
				}).then(res => {
					if (res && res.code == 0) {
						this.notices = res.data.list.map(item => (dateUtils.formatDateStr(item
							.lastTranServerTime) + item.name + '掉线'))
					}
				})
			},

			onTabClick(item) {
				this.currentTab = item.index
				this.deviceType = this.currentPlcInfo.type
				this.getEnvList()
			},
			onDrawItemClick(item, index) {
				this.handleCloseDrawer()
				this.currentTab = index
				this.deviceType = item.type
				this.getEnvList()
			},
			onFarmItemClick(item, index) {
				if (this.curFarmId === item.farmId) {
					this.handleClosePopup()
					return
				}
				this.currentTab = 0
				this.curFarmPos = index
				this.handleClosePopup()
				this.curFarmId = item.farmId
				this.curFarmName = item.name
				uni.setStorageSync('farmId', item.farmId)

				this.getList()
			},

			navToGateWayDetail() {
				console.log('this.currentPlcInfo.online:'+this.currentPlcInfo.online)
				toPage.gatewayDetail({
					gatewayId: this.currentPlcInfo.gatewayId,
					title: this.deviceTypeName[this.deviceType - 1],
					online: this.currentPlcInfo.online,
					name: this.currentPlcInfo.name,
					type: this.deviceType
				})
			},
			addDevices() {
				toPage.addDevices(this.currentPlcInfo.gatewayId)
			},
			openScan() {
				let _this = this
				uni.scanCode({
					success(res) {
						_this.snBind(res.result)
					},
					fail(e) {
						uni.showToast({
							icon: 'none',
							title: '扫码失败，请手动添加'
						});
					}
				})
			},
			showAddSheet() {
				let _this = this
				uni.showActionSheet({
					itemList: _this.list.length > 0 ? ['添加网关', '添加设备'] : ['添加网关'],
					success: function(res) {
						if (res.tapIndex == 0) {
							_this.showAddGateWayOptionSheet()
							return
						}
						if (res.tapIndex == 1) {
							_this.addDevices()
							return
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				})
			},
			showAddGateWayOptionSheet() {
				this.handleCloseDrawer()
				let _this = this
				uni.showActionSheet({
					itemList: ['扫码添加', '手动添加'],
					success: function(res) {
						if (res.tapIndex == 0) {
							_this.openScan()
							return
						}
						if (res.tapIndex == 1) {
							_this.showEnterCodeModal = true
							return
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				})
			},
			snBind(sn) {
				if (sn) {
					uni.showLoading()
					gatewayApi.bind({
						sn: sn
					}).then(res => {
						if (res.code == 0) {
							uni.hideLoading()
							this.showEnterCodeModal = false
							uni.showToast({
								type: 'none',
								title: '添加成功'
							});
							this.getFarmList()
						}
					})
				}
			},
			shareBind(code) {
				if (code) {
					shareApi.bind({
						code: code
					}).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '添加成功'
							});
							this.getFarmList()
						}
					})
				}
			},
			toDeviceCtrl(e) {
				toPage.toDeviceCtrl({
					gatewayId: this.currentPlcInfo.gatewayId,
					title: e.title,
					type: e.type,
					deviceType: this.deviceType
				})
			},
			defaultAdd() {
				return {
					environmentalType: -1,
					num: 0,
					onlineNum: 0
				}
			},
			handleOpenDrawer() {
				this.$refs.leftDrawer.open()
			},
			handleCloseDrawer() {
				this.$refs.leftDrawer.close()
			},


			cancelRequest() {
				this.isDestroyed = true
				clearInterval(this.intervalNoticeId)
			},

			// 打开养殖场弹框
			handleOpenFarmPopup() {
				// this.farmPopupVisible = true;
				this.$refs.farmPopup.open()
			},
			handleClosePopup() {
				// this.farmPopupVisible = false;
				this.$refs.farmPopup.close()
			},
		
			showEnvSuggestions(e){
				console.log('showEnvSuggestions： '+this.hasLivestock)
				if(!this.hasLivestock) return
				uni.showLoading()
				
				gatewayApi.envSuggestion({
					CollectionType:e.dataType,
					EnvironmentalCollectionId:e.collectionId
				}).then(res => {
					if (res && res.code == 0) {
						uni.hideLoading()
						this.envSuggestions = res.data
						this.showSuggestModel = true
					}
				})
				
			},
			gatewayStockSet(e){
				console.log('change', e);
				uni.showLoading()
				this.hasLivestock = e
				gatewayApi.gatewaySetStock({
					gatewayId:this.currentPlcInfo.gatewayId,
					hasLivestock: this.hasLivestock
				}).then(res => {
					if (res && res.code == 0) {
						uni.hideLoading()
					}
				})
			},
		},
		filters: {
			envDataFilter(value, type) {
				if (null == value || value == undefined) {
					return '--'
				}
				if (type == "temp") {
					return value + '℃'
				} else if (type == "hum") {
					return value + '%'
				}
			},
			envTypeFilter(arr) {
				let type = arr[0].collectionType
				let title = ["NH3", "温度", "湿度", "", "CO2", "H2S"][type - 1]
				let unit= ["PPM", "℃", "%", "", "PPM", "PPM"][type - 1]
				
				let sort = arr.length>1?[...arr].sort((x,y) => x.warnValue - y.warnValue):arr
	
				return `${title}标准：${sort.map(e => e.warnValue).join(' - ')}${unit}`
			}
		}
	}
</script>

<style lang="scss" scoped>
	.logo {
		overflow: hidden;
		position: relative;
	}

	.logo-title {
		position: absolute;
		left: 50rpx;
		top: calc(var(--status-bar-height) + 132rpx);
		align-items: flex-end;

		&-text {
			font-size: 36rpx;
			color: #000000;
			font-weight: 500;
			line-height: 40rpx;
		}
	}

	.logo-subtitle {
		position: absolute;
		left: 54rpx;
		top: calc(var(--status-bar-height) + 182rpx);

		&-text {
			font-size: 30rpx;
			font-weight: 500;
			line-height: 44rpx;
			color: #666666;
		}

		.warn-total {
			font-size: 48rpx;
			color: #FF5A46;
			font-weight: bold;
			margin-left: 10rpx;
		}
	}

	.index-tab {
		margin-left: 30rpx;
		margin-right: 30rpx;
		position: sticky;
	}

	.index-content {
		background: #f8f8f8;
		margin-top: 30rpx;
		padding: 40rpx;
		border-radius: 30rpx 30rpx 0rpx 0rpx;
		box-shadow: 0rpx -10rpx 10rpx 1rpx rgba(153, 153, 153, 0.2);
		position: sticky;
	}

	.bg-item-card {
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153, 153, 153, 0.2);
		border-radius: 8rpx;
		padding: 26rpx 30rpx;
		display: flex;
		flex: 1;
		flex-direction: row;

		&__time {
			display: flex;
			justify-content: space-between;

			&-label {
				font-size: 24rpx;
				font-weight: 400;
				color: #999999;
			}
		}


		&__name-status {
			display: flex;
			flex: 1;
			justify-content: space-between;
		}
	}

	.normal-text {
		color: #999999;
		font-weight: 400;
	}

	.bold-text {
		color: #000000;
		font-weight: bold;
	}

	.tab-more-bg {
		width: 60rpx;
		height: 42rpx;
		padding-left: 4rpx;
		padding-right: 4rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 10rpx 1rpx rgba(153, 153, 153, 0.2);
		border-radius: 12rpx;
		justify-content: center;
		align-items: center;
	}

	.edit-modal {
		width: 100%;

		&__title {
			font-size: 36rpx;
			font-weight: 400;
		}

		&__close-icon-box {
			float: right;
			padding: 15rpx;
		}

		&__item {
			margin-top: 70rpx;
		}

		&__input {
			background-color: #F8F8F8;
			border-radius: 4rpx;
			padding: 25rpx 15rpx;
			font-size: 30rpx;
			color: black;
		}

		&__save-btn {
			width: 100%;
			margin-top: 74rpx;
		}
	}
	
	.suggest-modal{
		width: 100%;
		&__popup-title {
			font-size: 34rpx;
			font-weight: 400;
		    text-align: center;
		}
		
		&__title{
			font-size: 30rpx;
			font-weight: 400;
			color:#000000;
			margin-top: 20rpx;
		}
		
		&__content{
			font-size: 28rpx;
			font-weight: 300;
			color:#000000;
			margin-top: 10rpx;
		}
	
		&__range{
			font-size: 26rpx;
			font-weight: 500;
			color:#5AD8A6;
		}
		
	}

	.label-status {
		font-size: 28rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-weight: 500;
		color: #999999;
	}
		
	.label-theme-status{
		@extend .label-status;
		color: #4166D8;
	}

	.online-dot {
		width: 8rpx;
		height: 8rpx;
		background: #5AD8A6;
		margin-left: 10rpx;
		margin-right: 10rpx;
		border-radius: 50%;
	}

	.drawer {
		height: 100vh;
		background: #FFFFFF;

		&__view-holder {
			height: var(--status-bar-height);
			background: #FFFFFF;
		}

		&__view-divider {
			height: 1rpx;
			background-color: #F0F0F0;
		}

		&__scroll-view {
			flex: 1;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}

		&__item-view {
			background: #FFFFFF;
			height: 140rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;

			&-hover {
				background-color: #eee;
			}

			&-title {
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.85);
				word-break: break-all;
				word-wrap: break-word;
			}
		}

		&__item-divider {
			width: 100%;
			height: 1rpx;
			background: #F0F0F0;
		}
	}

	.bottom-sheet {
		height: 60vh;

		&__item-view {
			background: #FFFFFF;
			height: 140rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;

			&-hover {
				background-color: #eee;
			}

			&-text {
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.85);
			}

			&-decoration {
				width: 100%;
				height: 1rpx;
				background: #F0F0F0;
			}
		}
	}
</style>
