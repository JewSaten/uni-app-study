<template>
	<view class="uni-flex uni-row" :class="countInfo.faultNum>0?'plc-item-card-anim':'plc-item-card'"
		@click="handleClickPlc">
		<view class="uni-flex uni-column" style="align-items: center;">
			<image class="icon-env" :src="icon" style="width: 40rpx;height: 40rpx; "></image>
			<text class="plc-item-title">{{plcTitle}}</text>
		</view>
		<view class="uni-flex uni-column" style="align-items: center;">
			<view class="uni-flex uni-row" style="align-self: flex-start;">
				<text class="plc-item-subtitle" style="margin-right: 10rpx;">启动</text>
				<view class="plc-item-subtitle" :class="countInfo.openNum>0 ? 
				'plc-item-subtitle-online-color' : 'plc-item-subtitle-offline-color'">
					{{countInfo.openNum}}
				</view>
				<text class="plc-item-subtitle">{{'/'+countInfo.num}}</text>
			</view>
			<text class="plc-item-error-text" :class="countInfo.faultNum>0?'plc-item-error-text-error-color'
		:'plc-item-error-text-normal-color'" style="align-self: flex-start;">{{'故障数 '+countInfo.faultNum}}</text>
		</view>
	</view>
</template>

<script>
	import {
		PLC_ICONS,
		PLC_TITLES
	} from '@/untils/const'

	export default {
		name: "plc-card-view",
		props: {
			countInfo: {
				type: Object,
				default: {
					environmentalType: 1,
					faultNum: 0,
					num: 0,
					onlineNum: 0,
					openNum: 0,
				}
			}
		},
		data() {
			return {
			};
		},
		methods: {
			handleClickPlc() {
				this.$emit('click', {
					title: this.plcTitle,
					type: this.countInfo.environmentalType
				})
			}
		},
		computed: {
			icon() {
				const iconName = PLC_ICONS[this.countInfo.environmentalType - 1]
				return `/static/images/index/icon-env-${iconName}@2x.png`
			},
			plcTitle() {
				return PLC_TITLES[this.countInfo.environmentalType - 1]
			}
		},
	}
</script>

<style lang="scss">
	.plc-item-card {
		background: #FFFFFF;
		box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153, 153, 153, 0.2);
		border-radius: 8rpx;
		align-items: center;
		justify-content: space-between;
		height: 150rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}

	.plc-item-card-anim {
		@extend .plc-item-card;
		border: 3rpx solid transparent;
		animation: bordercolor 1s linear 0s infinite alternate;
	}

	@keyframes bordercolor {
		from {
			border-color: #FF5A46;
		}

		to {
			border-color: transparent;
		}
	}

	.plc-item-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #000000;
	}

	.plc-item-subtitle {

		font-size: 25rpx;
		color: #999999;
		font-weight: 500;

		&-online-color {
			color: #5AD8A6;
		}

		&-offline-color {
			color: #999999;
		}
	}

	.online-dot {
		width: 8rpx;
		height: 8rpx;
		background: #5AD8A6;
		margin-left: 10rpx;
		margin-right: 10rpx;
		border-radius: 50%;
	}

	.plc-item-error-text {
		font-size: 25rpx;
		font-weight: 500;
		color: #999999;

		&-normal-color {
			color: #999999;
		}

		&-error-color {
			color: #FF5A46;
		}
	}
</style>
