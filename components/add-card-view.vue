<template>
	<view class="uni-flex uni-column add-item-card" @click="clickHandler">

		<image src="../static/images/index/icon-index-add@2x.png" style="width: 30rpx;height: 32rpx;"></image>
		<view class="item-title">{{title}}</view>
	</view>
</template>

<script>
	export default {
		name: "add-card-view",
		props: {
			title: {
				type: String,
				default: '添加设备'
			}
		},
		data() {
			return {

			};
		},
		methods: {
			clickHandler() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-item-card {
		background: #FFFFFF;
		border-radius: 8rpx;
		justify-content: center;
		align-items: center;
		height: 150rpx;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}

	.item-title {
		font-size: 28rpx;
		color: #999999;
		margin-top: 10rpx;
		font-weight: 500;
	}
</style>
