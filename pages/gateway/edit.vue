<template>
	<view class="gateway-edit">
		<NameAndIconEdit v-if="item.name != undefined" 
		nameLabel="设备名称" :name.sync="item.name" 
		iconLabel="设备图标" :icon.sync="item.icon"></NameAndIconEdit>
		<button class="uni-primary-btn save-btn" @click="edit()">保存</button>
	</view>

</template>

<script>
	import gatewayApi from '@/apis/gateway'
	import baseApi from '@/apis/base'
	import http from '@/http/index'
	import defaultParams from '@/untils/defalutParams'
	import NameAndIconEdit from '@/components/nameAndIconEdit'
	export default {
		components: {
			NameAndIconEdit
		},
		onLoad(option) {
			this.gatewayId = option.gatewayId
			this.detail()
		},
		data() {
			return {
				gatewayId: '',
				item: {}
			}
		},
		methods: {
			detail() {
				gatewayApi.detail({
					gatewayId: this.gatewayId
				}).then(res => {
					if (res.code == 0) {
						if (!this.item.name || this.item.name != res.data.name) {
							uni.setNavigationBarTitle({
								title: res.data.name
							})
						}
						this.item = res.data
						this.item.icon = this.gatewayIcon(res.data.icon)
					}
				})
			},
			edit() {
				uni.showLoading()
				gatewayApi.edit(this.item).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.showToast({
							type: 'none',
							title: '编辑成功'
						})
						uni.$emit('edit',{name:this.item.name})
						this.detail()
					}
				})
			},
			gatewayIcon(url) {
				return defaultParams.gatewayIcon(url)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.gateway-edit {
		background-color: white;
		padding: 22rpx 30rpx 30rpx 60rpx;
		font-size: 36rpx;
		
		.save-btn {
			margin-top: 60rpx;
		}
	}
</style>
