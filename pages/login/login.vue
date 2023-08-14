<template>
	<view class="login">
		<view class="login-box flex-center__center">
			<image class="login-logo"></image>
		</view>
		<view class="login-box">
			<button class="login-btn" type="primary" open-type="getPhoneNumber"
				@getphonenumber="decryptPhoneNumber">手机号快捷登录</button>
		</view>
	</view>
</template>

<script>
	import apiUser from '@/apis/user'
	import toPage from '@/untils/toPage'
	import {
		mapMutations
	} from 'vuex'
	export default {
		methods: {
			...mapMutations(['login']),
			decryptPhoneNumber(e) {
				if (e) {
					let _this = this
					wx.login({
						success(res) {
							if (res.code) {
								if (e.detail.code) {
									uni.showLoading()
									apiUser.loginWechat({
										openIdCode: res.code,
										phoneCode: e.detail.code
									}).then(res => {
										uni.hideLoading()
										if (res.code == 0) {
											_this.login(res.data)
											uni.showToast({
												type: 'none',
												title: '登录成功'
											});
											setTimeout(() => {
												toPage.toHome()
											}, 300)

										}
									})
								}
							} else {
								_this.showFailMsg('...')
							}
						},
						fail() {
							_this.showFailMsg('..')
						}
					})
				} else {
					_this.showFailMsg('.')
				}
			},
			showFailMsg(str = '') {
				uni.showToast({
					icon: 'none',
					title: '登录失败，请稍候再试' + str
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		height: 100%;

		&-box {
			height: 50%;
			padding: 0 80rpx;

		}

		&-logo {
			width: 300rpx;
			height: 300rpx;
		}

		&-btn {
			background-color: rgb(1, 184, 91);
			border-color: rgb(1, 184, 91);
			border-radius: 8px;
		}
	}
</style>
