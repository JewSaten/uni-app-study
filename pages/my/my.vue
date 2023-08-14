<template>
	<view class="my uni-page">
		<view class="my-header uni-flex-wrap" @click="toUserinfo()">
			<image class="avatar" :src="avatar(user.avatar)"></image>
			<view class="my-header__user-info">
				<view class="my-header__user-info-nickname">{{user.nickname}}</view>
				<view class="my-header__user-info-phone">{{user.encryptionMobile}}</view>
			</view>
		</view>
		<view class="my-content">
			<view class="my-content__item align-items__center" @click="toUserinfo()">
				<image class="my-content__item-icon" src="../../static/images/setting/icon-device@2x.png"></image>
				<view class="my-content__item-label">个人资料</view>
			</view>
			<view class="my-content__item align-items__center" @click="showLogoutModal = true">
				<image class="my-content__item-icon" src="../../static/images/setting/icon-btn@2x.png"></image>
				<view class="my-content__item-label">退出账号</view>
			</view>
		</view>

	<!-- 	<view class="my-version">
			v{{version}}
		</view> -->


		<u-modal :show="showLogoutModal" content='您是否确认退出' @cancel="this.showLogoutModal=false" title="退出账号"
			:showCancelButton="true" @confirm="confirmLogout()" confirmColor="#4166D8"></u-modal>
	</view>
</template>

<script>
	import toPage from '@/untils/toPage'
	import defaultParams from '@/untils/defalutParams'
	import {
		mapMutations
	} from 'vuex'
	export default {
		onLoad() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#4166d8',
				animation: {
					duration: 200,
					timingFunc: 'easeIn'
				}
			})
			this.getVersion()
		},
		onShow() {
			let userInfo = uni.getStorageSync('userInfo')
			if (userInfo == null || !userInfo.encryptionMobile) {
				toPage.login()
			} else {
				this.user = userInfo
			}
		},
		data() {
			return {
				user: {},
				version: '',
				showLogoutModal: false
			}
		},
		methods: {
			...mapMutations(['logout']),
			toUserinfo() {
				toPage.userinfo()
			},
			confirmLogout() {
				this.showLogoutModal = false
				this.logout()
				toPage.login()
			},
			avatar(url) {
				return defaultParams.avatar(url)
			},
			getVersion(){
				let _this = this
				uni.getSystemInfo({
					success(val) {
						_this.version = val.appVersion 
						console.log(`version:${_this.version}`)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.my {
		padding-left: 0;
		padding-right: 0;
		padding-top: 0;

		&-header {
			height: 308rpx;
			background: #4166D8;
			padding: 28rpx 40rpx 0;
			box-shadow: 0px 4px 20px 2px rgba(153, 153, 153, 0.2);

			&__user-info {
				padding-top: 28rpx;
				padding-left: 20rpx;
				color: #FFFFFF;

				&-nickname {
					font-size: 36rpx;
					font-weight: 600;
				}

				&-phone {
					font-size: 32rpx;
					font-weight: 400;
				}
			}
		}

		&-content {
			margin: -100rpx 30rpx;
			padding: 34rpx 58rpx 0;
			background: #FFFFFF;
			box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153, 153, 153, 0.2);
			border-radius: 8rpx;
			height: 260rpx;

			&__item {
				padding: 30rpx 0;

				&-icon {
					width: 54rpx;
					height: 54rpx;
				}

				&-label {
					padding-left: 34rpx;
					font-size: 28rpx;
					font-weight: 400;
					color: #999999;
				}
			}
		}
		
		&-version{
			margin-top: 120rpx;
			color: #999;
			text-align: center;
		}
	}
</style>
