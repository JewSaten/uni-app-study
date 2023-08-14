<template>
	<view class="gateway-btn-edit">
		<view class="gateway-btn-edit__item" v-for="(btn, index) in item.btnList" :key="index">
			<view class="flex-center__sb uni-label-font">
				<view class="uni-label-font">选择图标</view>
				<view class="align-items__center" @click="openIconMoal(btn)">
					<image :src="gatewayBtnIcon(true,btn.openIcon)" class="gateway-btn-edit__item-icon"></image>
					<image :src="gatewayBtnIcon(false,btn.closeIcon)" class="gateway-btn-edit__item-icon"></image>
					<u-icon name="arrow-right" color="#999"></u-icon>
				</view>
			</view>
			<view class="flex-center__sb">
				<view class="uni-label-font">开关名称</view>
				<input v-model="btn.name" placeholder="请输入" border="surround" placeholder-style="color:#999999;"
					class="uni-input gateway-btn-edit__item-name" maxlength="30"></input>
			</view>
		</view>
		<button class="uni-primary-btn save-btn" @click="edit()">
			<view style="display: inline-block;margin-left: -52rpx;margin-right: 28rpx;">
				<u-icon name="reload" color="white" size="32rpx"></u-icon>
			</view>
			同步
		</button>
		<view style="height: 1rpx;"></view>
		<u-modal :show="showIconModal" :closeOnClickOverlay="true" :showConfirmButton="false"
			@close="showIconModal = false">
			<view class="edit-modal">
				<view class="edit-modal__close-icon-box">
					<u-icon name="close" customStyle="{float:'right'}" size="36rpx" @click="showIconModal = false">
					</u-icon>
				</view>
				<view class="flex-center__sb edit-modal__item edit-modal__item-choose-box">
					<view class="edit-modal__item-choose-box-btn" @click="chooseIconType = 1"
						:class="chooseIconType == 1?'edit-modal__item-choose-box-choose':''">开启图标</view>
					<view class="edit-modal__item-choose-box-btn" @click="chooseIconType = 0"
						:class="chooseIconType == 0?'edit-modal__item-choose-box-choose':''">关闭图标</view>
				</view>
				<view class="flex-center__sb edit-modal__item">
					<view class="edit-modal__item-box" :style="chooseIconType == 1 ? '' : 'display:none;'">
						<view class="edit-modal__item-box-item">
							<u-upload @afterRead="afterRead" name="1" multiple :maxCount="1" width="100rpx"
								height="98rpx" :previewFullImage="true">
							</u-upload>
						</view>
						<image class="edit-modal__item-box-item"
							:class="chooseOpenIconIndex === index ? 'edit-modal__item-box-choose':''"
							v-for="(pic, index) in openIconList" :key="index" :src="pic"
							@click="chooseOpenIconIndex = index"></image>
					</view>
					<view class="edit-modal__item-box" :style="chooseIconType == 0 ? '' : 'display:none;'">
						<view class="edit-modal__item-box-item">
							<u-upload @afterRead="afterRead" name="1" multiple :maxCount="1" width="100rpx"
								height="98rpx" :previewFullImage="true">
							</u-upload>
						</view>
						<image class="edit-modal__item-box-item"
							:class="chooseCloseIconIndex === index ? 'edit-modal__item-box-choose':''"
							v-for="(pic, index) in closeIconList" :key="index" :src="pic"
							@click="chooseCloseIconIndex = index"></image>
					</view>
				</view>
				<button class="uni-primary-btn edit-modal__save-btn" @click="editBtnIcon()">
					确认
				</button>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import gatewayApi from '@/apis/gateway'
	import baseApi from '@/apis/base'
	import http from '@/http/index'
	import defaultParams from '@/untils/defalutParams'
	import {
		OPEN_BTN_ICON_LIST,
		CLOSE_BTN_ICON_LIST
	} from '@/untils/const'
	export default {
		onLoad(option) {
			this.gatewayId = option.gatewayId
			this.detail()
		},
		data() {
			return {
				chooseIconType: 1,
				chooseOpenIconIndex: '',
				chooseCloseIconIndex: '',
				openIconList: OPEN_BTN_ICON_LIST,
				closeIconList: CLOSE_BTN_ICON_LIST,
				showIconModal: false,
				gatewayId: '',
				chooseBtn: {},
				item: {
					btnList: []
				}
			}
		},
		methods: {
			detail() {
				uni.showLoading()
				gatewayApi.detail({
					gatewayId: this.gatewayId
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.item = res.data
					}
				})
			},
			async afterRead(event) {
				let file = event.file[0]
				uni.showLoading()
				uni.uploadFile({
					url: baseApi.getUploadPicUrl(true),
					filePath: file.url,
					name: 'file',
					success: res => {
						uni.hideLoading()
						let result = JSON.parse(res.data)
						if (result.code == 0) {
							if (this.chooseIconType == 1) {
								this.openIconList.unshift(result.data.url)
							}
							if (this.chooseIconType == 0) {
								this.closeIconList.unshift(result.data.url)
							}

						}
					},
					fail() {
						uni.hideLoading()
					}
				})
			},
			gatewayBtnIcon(open, url) {
				return defaultParams.gatewayBtnIcon(open, url)
			},
			openIconMoal(btn) {
				this.chooseOpenIconIndex = this.openIconList.indexOf(btn.openIcon) >= 0 ? this.openIconList.indexOf(btn
					.openIcon) : ''
				this.chooseCloseIconIndex = this.closeIconList.indexOf(btn.closeIcon) >= 0 ? this.closeIconList.indexOf(btn
					.closeIcon) : ''
				this.chooseBtn = btn
				this.showIconModal = true
			},
			editBtnIcon() {
				let openIcon = this.openIconList[this.chooseOpenIconIndex]
				let closeIcon = this.closeIconList[this.chooseCloseIconIndex]
				if (openIcon) {
					this.chooseBtn.openIcon = openIcon
				}
				if (closeIcon) {
					this.chooseBtn.closeIcon = closeIcon
				}
				this.showIconModal = false
			},
			edit() {
				uni.showLoading()
				gatewayApi.btnEdit(this.item.btnList).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.showToast({
							type: 'none',
							title: '编辑成功'
						});
						setTimeout(()=>{
							this.detail()
						},1000)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gateway-btn-edit {

		margin: 0 30rpx 30rpx 30rpx;
		font-size: 36rpx;

		&__item {
			background-color: white;
			margin-top: 20rpx;
			box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153, 153, 153, 0.2);
			border-radius: 8rpx;
			padding: 30rpx 40rpx;

			&-name {
				text-align: right;
				color:black;
			}

			&-icon {
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 50%;
			}
		}

		.save-btn {
			margin: 40rpx 0 160rpx 0;
			font-size: 32rpx;
			height: 80rpx;
		}

		.edit-modal {
			width: 100%;

			&__close-icon-box {
				float: right;
			}

			&__item {
				margin-top: 50rpx;

				&-choose-box {
					padding: 0 130rpx;

					&__btn {
						padding: 10rpx;
					}

					&-choose {
						color: #4166D8;
					}
				}

				&-box {
					padding: 0 15rpx;
					display: flex;
					flex-wrap: wrap;

					&-item {
						border: 1rpx solid rgba(153, 153, 153, 0.2);
						border-radius: 15%;
						width: 100rpx;
						height: 100rpx;
						margin: 10rpx 13rpx;
					}

					&-choose {
						border-color: #4166D8;
						border-width: 4rpx;
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
