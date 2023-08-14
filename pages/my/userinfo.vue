<template>
	<view class="userinfo">
		<view class="userinfo-item flex-center__sb">
			<view class="userinfo-item__label">头像</view>
			<view class="flex-center__center">
				<button class="userinfo-item__avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar userinfo-item__avatar"
						:src="avatar(user.avatar)"></image>
				</button>
				<u-icon name="arrow-right" size="12" color="#CCCCCC"></u-icon>
			</view>
		</view>
		<view class="userinfo-item flex-center__sb">
			<view class="userinfo-item__label">用户名</view>
			<view class="flex-center__center" @click="showEditNicknameModal = true">
				<view class="userinfo-item__nickname">{{user.nickname}}</view>
				<u-icon name="arrow-right" size="12" color="#CCCCCC"></u-icon>
			</view>
		</view>

		<u-modal :show="showEditNicknameModal" :closeOnClickOverlay="true" :showConfirmButton="false"
			@close="closeNicknameModal()">
			<view class="edit-modal">
				<view class="flex-center__sb">
					<view class="edit-modal__title">修改用户名</view>
					<view class="edit-modal__close-icon-box">
						<u-icon name="close" size="36rpx" @click="closeNicknameModal()">
						</u-icon>
					</view>
				</view>

				<view class="edit-modal__item">
					<input id="nickname" v-model="user.nickname" type="nickname" @blur="getnickname"
						placeholder-style="color:#999999;"
						class="edit-modal__item-nickname" placeholder="请输入昵称" maxlength="16" />
					<view class="edit-modal__item-nickname-explain">
						英文字母或汉字，限4-16个字符，一个汉字为2个字符
					</view>
				</view>
				<button class="uni-primary-btn edit-modal__save-btn" @click="editNickname()">
					保存设置
				</button>
			</view>

		</u-modal>

	</view>
</template>

<script>
	import http from '@/http/index'
	import baseApi from '@/apis/base'
	import userApi from '@/apis/user'
	import defaultParams from '@/untils/defalutParams'
	export default {
		onLoad() {
			this.getInfoFromStorage()
		},
		data() {
			return {
				user: {},
				showEditNicknameModal: false,
			}
		},
		methods: {
			onChooseAvatar(e) {
				uni.uploadFile({
					url: baseApi.getUploadPicUrl(true),
					filePath: e.detail.avatarUrl,
					name: 'file',
					success: res => {
						let result = JSON.parse(res.data)
						if (result.code == 0) {
							this.editAvatar(result.data.url)
						} else {
							uni.showToast({
								icon: 'none',
								title: '头像上传失败'
							});
						}
					}
				})
			},
			editAvatar(url) {
				userApi.editAvatar({
					avatar: url
				}).then(res => {
					if (res && res.code == 0) {
						this.user.avatar = url
						this.setInfoToStorage()
						uni.showToast({
							title: '上传中成功'
						});
						return
					}
				})
			},
			editNickname() {
				if (!this.user.nickname) {
					uni.showToast({
						icon: 'none',
						title: '请输入昵称'
					});
					return
				}
				userApi.editNickname({
					nickname: this.user.nickname
				}).then(res => {
					if (res && res.code == 0) {
						this.showEditNicknameModal = false
						this.setInfoToStorage()
						uni.showToast({
							title: '编辑成功'
						});
						return
					}
				})
			},
			getnickname(e) {
				this.user.nickname = e.detail.value;
			},
			closeNicknameModal() {
				this.getInfoFromStorage()
				this.showEditNicknameModal = false
			},
			getInfoFromStorage() {
				let userInfo = uni.getStorageSync('userInfo')
				if (userInfo == null || !userInfo.encryptionMobile) {
					toPage.login()
				} else {
					this.user = userInfo
				}
			},
			setInfoToStorage() {
				uni.setStorage({
					key: 'userInfo',
					data: this.user
				});
			},
			avatar(url) {
				return defaultParams.avatar(url)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userinfo {
		&-item {
			background: #FFFFFF;
			border-bottom: 1px solid #F8F8F8;
			height: 140rpx;
			padding: 0 30rpx 0 60rpx;

			&__label {
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.8);
			}

			&__avatar-btn {
				background-color: transparent;
				line-height: 100rpx;
				height: 100rpx;
				width: 100rpx;
				margin: 0 30rpx 0 0;
				padding: 0;
				border: 0;
				border-color: transparent;

				&::after {
					border: 0;
				}
			}

			&__avatar {
				width: 100rpx;
				height: 100rpx;
			}

			&__nickname {
				margin-right: 30rpx;
				font-size: 32rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.45);
			}
		}

		.edit-modal {
			width: 100%;

			&__title {
				font-size: 28rpx;
				font-weight: 400;
			}

			&__close-icon-box {
				float: right;
				padding: 15rpx;
			}

			&__item {
				margin-top: 70rpx;

				&-nickname {

					background-color: #F8F8F8;
					border-radius: 4rpx;
					padding: 25rpx 15rpx;
					font-size: 30rpx;
					color: black;

					&-explain {
						font-size: 24rpx;
						font-weight: 500;
						color: #999999;
					}
				}

			}

			&__save-btn {
				width: 100%;
				margin-top: 74rpx;
			}
		}
	}
</style>
