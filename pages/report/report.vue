<template>
	<view class="report uni-page">
		<view class="report-search-box">
			<u-search placeholder="请输入关键字" v-model="keyword" :showAction="false" bgColor="#FFFFFF" height="42"
				@change="allBtn" @search="allBtn"></u-search>
		</view>

		<EmptyList v-if="list.length == 0"></EmptyList>
		<view class="uni-card report-item flex-center__sb" @click="toDetail(item.gatewayBtnId,item.gatewayId)"
			v-for="(item, index) in list" :key="index">
			<view class="report-item__left">
				<view class="report-item__left__icon"></view>
				<text class="report-item__left__label">{{item.name}}</text>
			</view>
			<view class="report-item__right uni-column-end">
				<view :class="item.gatewayIsOnline ? 'online-color':'offline-color'">
					{{item.gatewayName}}({{item.gatewayIsOnline?'在线':'离线'}})
				</view>
				<view>
					{{item.lastOpenTime ? item.lastOpenTime : '无'}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import gatewayApi from '@/apis/gateway.js'
	import EmptyList from '@/components/emptyList'
	export default {
		components: {
			EmptyList
		},
		onShow() {
			this.allBtn()
		},
		data() {
			return {
				list: [],
				keyword: ''
			}
		},
		methods: {
			toDetail(gatewayBtnId,gatewayId) {
				uni.navigateTo({
					url: '/pages/report/detail?gatewayBtnId='+gatewayBtnId+'&gatewayId='+gatewayId
				})
			},
			allBtn() {
				gatewayApi.allBtn({
					keyword: this.keyword
				}).then(res => {
					if (res.code == 0) {
						this.list = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.report {
		font-size: 32rpx;
		font-weight: 500;

		&-search-box {
			// padding: 10rpx 0;
			// background-color: #FFFFFF;
			// border-radius: 5%;
			// box-shadow: 0px 4px 20px 2px rgba(153, 153, 153, 0.2);
		}

		&-item {
			margin-top: 20rpx;
			height: 150rpx;

			&__left {

				&__icon {
					background: url(../../static/images/report/icon-spray@2x.png) no-repeat center center;
					background-size: 100% 100%;
					width: 40rpx;
					height: 40rpx;
					margin-left: 30rpx;
				}

				&__label {
					margin-left: 15rpx;
				}
			}
		}

	}
</style>
