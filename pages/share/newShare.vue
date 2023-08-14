<template>
	<view class="new-share">
		<view class="uni-card">
			<view class="flex-center__center new-share-qrcode">
				<img class="new-share-qrcode__img" :src="item.qrCodeUrl" v-if="item.qrCodeUrl">
				<u-empty v-if="!item.qrCodeUrl" icon="/static/images/commons/empty-qrcode.png" text="生成二维码中...">
				</u-empty>
			</view>
			<view>
				<view class="justify-content__sb new-share-item">
					拥有权限
					<u-checkbox-group placement="row" v-model="permissionList" @change="checkboxChange">
						<u-checkbox label="编辑" name="0" :customStyle="{marginRight: '30rpx',fontSize:'10rpx'}">
						</u-checkbox>
						<u-checkbox label="删除" name="1" :customStyle="{marginRight: '30rpx'}"></u-checkbox>
						<u-checkbox label="控制" name="2"></u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="justify-content__sb new-share-item">
					分享次数
					<input placeholder="请输入" border="surround" class="uni-input new-share-item__share-count"
						type="number" v-model="item.count" placeholder-style="color:#999999;"></input>
				</view>
				<view class="justify-content__sb new-share-item" @click="showQrCodeTimePicker = true">
					二维码有效期
					<view class="justify-content__sb">
						<text>{{item.qrExpiredTime | timeFormat}}</text>
						<u-icon name="arrow-right" color="#999"></u-icon>
					</view>

				</view>
				<view class="justify-content__sb new-share-item" @click="showShareTimePicker = true">
					设备有效期
					<view class="justify-content__sb">
						<text>{{item.expiredTime | timeFormat}}</text>
						<u-icon name="arrow-right" color="#999"></u-icon>
					</view>
				</view>
			</view>
		</view>

		<view class="flex-center__sb btn-box">
			<button class="uni-primary-btn btn-box__delfault-btn" @click="saveShare()">保存二维码</button>
			<button class="uni-default-btn btn-box__delfault-btn" open-type="share">分享</button>
		</view>

		<u-datetime-picker confirmColor="#4166D8" :show="showQrCodeTimePicker" @confirm="showQrCodeTimePicker=false"
			@cancel="showQrCodeTimePicker=false" v-model="item.qrExpiredTime" mode="date"></u-datetime-picker>

		<u-datetime-picker confirmColor="#4166D8" :show="showShareTimePicker" @confirm="showShareTimePicker=false"
			@cancel="showShareTimePicker=false" v-model="item.expiredTime" mode="date"></u-datetime-picker>
	</view>
</template>

<script>
	import dateUtils from '@/untils/date'
	import apiShare from '@/apis/share'
	import date from '@/untils/date'
	import {
		HOME_PAGE_PATH
	} from '@/untils/const'
	export default {
		onLoad(option) {
			this.item.gatewayId = option.gatewayId
			this.permissionList = ['0', '1', '2']
			this.create()
		},
		data() {
			return {
				showQrCodeTimePicker: false,
				showShareTimePicker: false,
				permissionList: [],
				item: {
					shareId: '',
					gatewayId: '',
					expiredTime: new Date('2099-12-31').getTime(),
					qrExpiredTime: date.plusDay(date.nowZeroTime(), 7).getTime(),
					count: 1,
					qrCodeUrl: '',
					path: HOME_PAGE_PATH,
					permission: '1,1,1'
				}
			}
		},
		methods: {
			create() {
				uni.showToast({
					title: '生成二维码',
					icon: 'loading',
					duration: 3000
				})
				apiShare.create(this.item).then(res => {
					if (res.code == 0) {
						res.data.expiredTime = new Date(res.data.expiredTime).getTime()
						res.data.qrExpiredTime = new Date(res.data.qrExpiredTime).getTime()
						this.item = res.data
					}
					uni.hideToast()
				})
			},
			edit() {
				if (this.item.shareId) {
					apiShare.edit(this.item).then(res => {

					})
				}
			},
			saveShare() {
				if (!this.item.qrCodeUrl) {
					uni.showToast({
						type: 'none',
						title: '请生成二维码',
						duration: 1000
					})
				}
				let _this = this
				uni.downloadFile({
					url: this.item.qrCodeUrl,
					success: (res) => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									uni.showToast({
										title: '保存成功'
									});
								}
							});
						}
					}
				});
			},
			onShareAppMessage(res) {

				return {
					title: '智能网关的分享',
					path: this.item.path
				}
			},
			checkboxChange(n) {
				this.permissionList = n
			}
		},
		filters: {
			timeFormat(timestamp) {
				if (timestamp) {
					return dateUtils.date2Str1(new Date(timestamp))
				}
				return ''
			}
		},
		watch: {
			item: {
				handler: function(n, o) {
					if (o.shareId) {
						this.edit()
					}

				},
				deep: true
			},
			permissionList: {
				handler: function() {
					this.item.permission = ((this.permissionList.indexOf('0') >= 0 ? '1' : '0') + ',') +
						((this.permissionList.indexOf('1') >= 0 ? '1' : '0') + ',') +
						((this.permissionList.indexOf('2') >= 0 ? '1' : '0'))

				},
				deep: true
			}
		}



	}
</script>

<style lang="scss" scoped>
	.new-share {

		&-qrcode {
			margin-top: 60rpx;

			&__img {
				width: 210px;
			}
		}

		&-item {
			margin-top: 50rpx;
			font-size: 32rpx;

			&__share-count {
				background: #F8F8F8;
				width: 352rpx;
				height: 70rpx;
				border-radius: 4rpx;
				text-align: right;
				color: black;
			}
		}

		.btn-box {

			padding: 30rpx 40rpx;

			&__delfault-btn {
				width: 49%;
			}
		}
	}
</style>