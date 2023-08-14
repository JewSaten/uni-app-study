<template>
	<view class="env-item-card">
		<view class="time" v-if="envData.lastTranServerTime!=null">
			{{'最近通讯时间: '+envData.lastTranServerTime}}
		</view>
		<view class="env-card-title justify-content__sb">
			<view class="uni-flex uni-row">
				<image class="icon-env" src="/static/images/index/icon-index-env@2x.png"></image>
				<text class="env-item-card__name">{{envData.name}}</text>
			</view>
			<view class="label-status">
				<view class="online-dot" v-if="envData.online"></view>{{envData.online?'在线':'离线'}}
			</view>
		</view>
		<!-- 1:氨气 2:温度 3:湿度 4:氨气温湿度 5:CO2 6:硫化氢 7温湿度 -->
		<view style="margin-top: 10rpx;">
			<u-row justify="space-between" gutter="10">
				<u-col v-for="(item, idx) in envCollectionDataList" :key="idx" :span="colNum">
					<view class="align-items__center uni-column" @click="handleClick(item,envData.environmentalCollectionId)">
						<text class="label-env-title">{{item.dataType | envTypeFilter}}</text>
						<text class="label-env-value"
							:class="item.dataStatus?'label-env-value-warn':'label-env-value-normal'">{{item.dataValue | envValFilter(item.dataType)}}</text>
					</view>
				</u-col>
			</u-row>
		</view>
	</view>
</template>

<script>
	export default {
		name: "env-card-view",
		props: {
			envData: {
				type: Object,
				required: true
			}
		},
		computed: {
			envCollectionDataList() {
				return this.envData.envCollectionDataList || []
			},
			colNum() {
				return this.envCollectionDataList.length > 1 ? 4 : 6
			}
		},
		data() {
			return {
			};
		},
		methods:{
			handleClick(item,id) {
				if(item.dataStatus){
					this.$emit('click',{
					dataType: item.dataType,
					collectionId: id
					})
				}
			},
			
		},
		filters: {
			envTypeFilter(val) {
				return ["NH3(PPM)", "温度(℃)", "湿度(%)", "", "CO2(PPM)", "H2S(PPM)"][val - 1]
			},
			envValFilter(val, status) {
				return status == 1 ? val : (val || '--')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.env-item-card {
		background: #fff;
		box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153, 153, 153, 0.2);
		border-radius: 8rpx;
		padding: 30rpx 42rpx;

		&__name {
			font-size: 28rpx;
			color: black;
			font-weight: 500;
			margin-left: 15rpx;
		}
	}

	.env-card-title {
		align-items: center;

		&-padding {
			padding-top: 30rpx;
		}

		&-no-padding {
			padding-top: 0rpx;
		}
	}

	.label-status {
		font-size: 28rpx;
		color: #999999;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-weight: 500;
	}

	.icon-env {
		width: 40rpx;
		height: 40rpx;
	}

	.label-env-title {
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;

		&-normal {
			color: #999999;
		}

		&-warn {
			color: #FF5A46;
			font-weight: 600;
		}
	}

	.time {
		font-size: 24rpx;
		font-weight: 400;
		color: #999999;
		text-align: right;
	}

	.label-env-value {
		font-size: 42rpx;
		font-weight: 500;
		color: #000000;

		&-normal {
			color: #000000;
		}

		&-warn {
			@extend .scale-anim;
			color: #FF5A46;
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

	.scale-anim {
		animation: scale 2s linear 0s infinite alternate;
	}

	@keyframes scale {
		0% {
			transform: scale(1);
		}

		25% {
			transform: scale(0.9);
		}

		50% {
			transform: scale(0.8);
		}

		75% {
			transform: scale(0.9);
		}

		100% {
			transform: scale(1);
		}
	}
</style>
