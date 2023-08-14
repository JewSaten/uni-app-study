<template>
	<view class="gateway uni-page">
		<button class="uni-primary-btn" @click="showSheet()">+添加设备</button>
		<EmptyList v-if="list.length == 0"></EmptyList>

		<view class="uni-card gateway-item align-items__center" @click="toGatewayDetail(item)"
			v-for="(item, index) in list" :key="index">
			<image class="gateway-item__icon" :src="gatewayIcon(item.icon)"></image>
			<view class="gateway-item__content uni-flex-item">
				<view class="gateway-item__content--top flex-center__sb">
					<view>{{item.name}}</view>
					<view class="uni-flex wifi-box">
						<view class="wifi-box__label" :class="item.isOnline ? 'online-color':'offline-color'">
							{{item.isOnline ? '在线':'离线'}}
						</view>
						<view class="icon-wifi" :class="item.isOnline ? 'icon-wifi-on':'icon-wifi-off'"></view>
					</view>
				</view>
				<view class="gateway-item__content--bottom uni-flex-wrap">
					<u-icon v-for="(btn,btnIndex) in item.btnList" :key="btnIndex" name="moments"
						:color="btn.status ? '#3c9cff':'#999'" :custom-style="{marginRight:'10rpx'}"></u-icon>
				</view>
			</view>
		</view>

		<u-modal :show="showEnterCodeModal" :closeOnClickOverlay="true" :showConfirmButton="false"
			:safeAreaInsetBottom="true" @close="showEnterCodeModal =false">
			<view class="edit-modal">
				<view class="flex-center__sb">
					<view class="edit-modal__title">添加设备</view>
					<view class="edit-modal__close-icon-box">
						<u-icon name="close" size="36rpx" @click="showEnterCodeModal = false">
						</u-icon>
					</view>
				</view>
				<view class="edit-modal__item">
					<input class="edit-modal__input" v-model="addDeviceSn" type="text" placeholder="请输入设备编码" placeholder-style="color:#999999;"/>
				</view>
				<button class="uni-primary-btn edit-modal__save-btn" @click="snBind(addDeviceSn)">
					添加
				</button>
			</view>

		</u-modal>

	</view>
</template>

<script>
	import toPage from '@/untils/toPage'
	import gatewayApi from '@/apis/gateway'
	import shareApi from '@/apis/share'
	import defaultParams from '@/untils/defalutParams'
	import EmptyList from '@/components/emptyList'
	export default {
		components: {
			EmptyList
		},
		onLoad(option) {
			let shareCode = option.shareCode
			if (shareCode) {
				this.shareBind(shareCode)
			}
		},
		onShow() {
			this.isDestroyed = false
			this.getList()
		},
		onHide() {
			this.isDestroyed = true
		},
		data() {
			return {
				addActionSheetShow: false,
				showEnterCodeModal: false,
				timer: '',
				isDestroyed: false,
				list: [],
				addDeviceSn: ''
			}
		},
		methods: {
			getList() {
				if (this.timer) {
					clearTimeout(this.timer)
				}
				gatewayApi.list().then(res => {
					if (res && res.code == 0) {
						this.list = res.data
						if (!this.isDestroyed) {
							this.timer = setTimeout(this.getList, 800)
						}
					}
				})
			},
			toGatewayDetail(item) {
				toPage.gatewayDetail(item.gatewayId)
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
			gatewayIcon(url) {
				return defaultParams.gatewayIcon(url)
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
						}
					})
				}
			},
			showSheet() {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gateway {

		&-item {
			margin-top: 20rpx;

			&__icon {
				width: 120rpx;
				height: 120rpx;
				border-radius: 8rpx;
			}

			&__content {
				padding-left: 40rpx;
			}
		}

		.wifi-box {
			align-items: center;

			.icon-wifi {
				height: 38rpx;
				width: 38rpx;
				margin-left: 6rpx;
				margin-top: -6rpx;

				display: inline-block;

				&-on {
					background: url(../../static/images/gateway/wifi-on@2x.png) no-repeat center center;
					background-size: 100% 100%;
				}

				&-off {
					background: url(../../static/images/gateway/wifi-off@2x.png) no-repeat center center;
					background-size: 100% 100%;
				}
			}

			&__label {
				line-height: 1;
			}
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

	}
</style>
