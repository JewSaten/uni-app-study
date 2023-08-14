<template>
	<view class="setting uni-page">
		<u-cell-group>
			<u-cell :border="false" center :isLink="true" :custom-style="cellStyle" @click="toGatewayEdit()">
				<view slot="title">设备信息</view>
				<u-icon slot="icon" size="40rpx" name="/static/images/setting/icon-device@2x.png"
					:custom-style="cellIconStyle"></u-icon>
			</u-cell>
			<u-cell v-if="perms != null && (perms.isOwner || perms.permissions[0])" :border="false" center
				:isLink="true" :custom-style="cellStyle" @click="toGatewayBtnEdit()">
				<view slot="title">开关设置</view>
				<u-icon slot="icon" size="40rpx" name="/static/images/setting/icon-btn@2x.png"
					:custom-style="cellIconStyle"></u-icon>
			</u-cell>
	<!-- 		<u-cell v-if="perms != null && (perms.isOwner || perms.permissions[2])" :border="false" center
				:isLink="true" :custom-style="cellStyle" @click="gatewayTask()">
				<view slot="title">定时任务</view>
				<u-icon slot="icon" size="40rpx" name="/static/images/tabBar/icon-clock-on@2x.png"
					:custom-style="cellIconStyle"></u-icon>
			</u-cell> -->
			<u-cell v-if="perms != null && perms.isOwner" :border="false" center :isLink="true"
				:custom-style="cellStyle" @click="toGatewayShare()">
				<view slot="title">设备分享</view>
				<u-icon slot="icon" size="40rpx" name="/static/images/setting/icon-share@2x.png"
					:custom-style="cellIconStyle"></u-icon>
			</u-cell>
			<u-cell v-if="perms != null && (perms.isOwner || perms.permissions[1])" :border="false" center
				:isLink="true" :custom-style="cellStyle" @click="$refs.alertDialog.open()">
				<view slot="title">删除设备</view>
				<u-icon slot="icon" size="40rpx" name="/static/images/setting/icon-delete@2x.png"
					:custom-style="cellIconStyle"></u-icon>
			</u-cell>
		</u-cell-group>

		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="取消" confirmText="确定" title="确认删除" :content="name" @confirm="del">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import toPage from '@/untils/toPage'
	import permissionApi from '@/apis/permission'
	import gatewayApi from '@/apis/gateway'
	export default {
		onLoad(option) {
			this.gatewayId = option.gatewayId
			this.getPerms()
		},
		data() {
			return {
				gatewayId: '',
				perms: null,
				name: '',
				cellStyle: {
					backgroundColor: 'white',
					margin: '30rpx 0 0',
					height: '108rpx',
					borderRadius: '8rpx',
					paddingTop: '10rpx',
				},
				cellIconStyle: {
					marginRight: '20rpx'
				}
			}
		},
		methods: {
			getPerms() {
				permissionApi.getGatewayPerm(this.gatewayId).then(res => {
					if (res.code == 0) {
						this.perms = res.data
						console.info(this.perms.permissions[2])
						if (this.perms.permissions[2]) {
							console.info(123)
						}
					}
				})
			},
			toGatewayEdit() {
				toPage.gatewayEdit(this.gatewayId)
			},
			toGatewayBtnEdit() {
				toPage.gatewayBtnEdit(this.gatewayId)
			},
			toGatewayShare() {
				toPage.gatewayShare(this.gatewayId)
			},
			gatewayTask() {
				toPage.gatewayTask(this.gatewayId)
			},
			del() {
				uni.showLoading()
				gatewayApi.remove(this.gatewayId).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.showToast({
							title: '删除成功'
						})
						toPage.toHome()
						uni.$emit('update',{msg:'页面更新'})
					}
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.setting {
		margin-top: -25rpx;
	}
</style>