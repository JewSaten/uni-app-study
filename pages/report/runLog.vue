<template>
	<view class="runLog">


		<u-sticky>
			<view class="align-items__center card-list-header">
				<view class="card-list-th1">开启时间</view>
				<view class="card-list-th1">关闭时间</view>
				<view class="card-list-th">设备数</view>
				<view class="card-list-th">{{envImpSelectedType | envImpDataTitleFilter}}</view>
			</view>
		</u-sticky>
		<EmptyList v-if="envImpList.length == 0"></EmptyList>

		<view class="card-list">

			<block v-for="(envLog, index) in envImpList" :key="index">

				<view class="justify-content__sb">
					<view class="card-list-td1">{{envLog.powerOnTime | switchLogTimeFilter}}</view>
					<view class="card-list-td1">{{envLog.powerOffTime | switchLogTimeFilter}}</view>
					<view class="card-list-td">{{envLog.quantity | logQuantityFilter}}</view>
					<view class="card-list-td">{{envLog.improvementData | envImpDataFilter}}</view>
				</view>
				<view class="card-list-decoration"></view>
			</block>

		</view>
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" 
					v-if="envImpList.length>0" />

	</view>
</template>

<script>
	import environmentalLogApi from '@/apis/environmentalLog'
	import EmptyList from '@/components/emptyList'

	export default {
		components: {
			EmptyList
		},
		onLoad(options) {
			this.envImpSelectedType = options.type
			this.environmentalImprovementId = options.id
			this.refresh()
		},

		onPullDownRefresh() {
			this.refresh()
		},
		onReachBottom() {
			if (this.isLastPage) return
			this.status = 'more'
			this.loadmore()
		},

		data() {
			return {
				environmentalImprovementId: 0,
				envImpSelectedType: 0,
				envImpList: [],
				status: 'more',
				isLastPage: false,
				page: 1,
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多数据了'
				}
			}
		},
		methods: {

			refresh() {
				this.page = 1
				environmentalLogApi.envImpLogList({
					environmentalImprovementId: this.environmentalImprovementId,
					limit: 20,
					page: this.page
				}).then(res => {
					if (res.code == 0) {
						this.envImpList = res.data.list
						this.status = res.data.isLastPage ? 'noMore' : 'loading'
						this.isLastPage = res.data.isLastPage
						uni.stopPullDownRefresh()
					}
				})
			},
			loadmore() {
				environmentalLogApi.envImpLogList({
					environmentalImprovementId: this.environmentalImprovementId,
					limit: 20,
					page: ++this.page
				}).then(res => {
					if (res.code == 0) {
						this.envImpList = this.envImpList.concat(res.data.list)
						this.status = res.data.isLastPage ? 'noMore' : 'loading'
						this.isLastPage = res.data.isLastPage
					}
				})
			},
		},
		filters: {
			logTimeFilter(time) {
				if (!time) {
					return '/'
				}
				return time.split(' ')[1]
			},
			switchLogTimeFilter(time) {
				if (!time) {
					return '/'
				}
				return time
			},
			logMlFilter(ml) {
				if (!ml) {
					return 0
				}
				return ml / 1000
			},
			logSecondFilter(val) {
				if (!val) {
					return '0s'
				}
				let hours = parseInt(val / 3600)
				let mins = parseInt((val - (hours * 3600)) / 60)
				let seconds = parseInt(val - (hours * 3600) - (mins * 60))
				if (hours > 0) {
					return hours + 'h' + mins + 'm' + seconds + 's'
				}
				if (mins > 0) {
					return mins + 'm' + seconds + 's'
				}
				return seconds + 's'
			},
			logQuantityFilter(quntity) {
				if (!quntity) {
					return '/'
				}
				return quntity
			},

			envImpDataTitleFilter(type) {
				if(type == 1){
					return '通风量(m³)'
				}else if(type == 3){
					return '喷洒量(ml)'
				}
				return '--'
			},

			envImpDataFilter(data) {
				if (null == data || data == undefined) {
					return '/'
				}
				return data
			},

		}
	}
</script>

<style lang="scss" scoped>
	.runLog {
		background: #FFFFFF;
		height: 100vh;
		
		.card-list {
			padding-left: 15rpx;
			padding-right: 15rpx;
			background: #FFFFFF;
			&-header {
				background: #FAFAFA;
				box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.06);
				padding: 18rpx 0;
			}

			&-th {
				width: 20%;
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				padding: 0 5rpx;
				line-height: 40rpx;
				text-align: center;
			}

			&-td {
				width: 20%;
				height: 78rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.85);
				line-height: 34rpx;
				padding: 0 5rpx;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			&-th1 {
				width: 30%;
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				padding: 0 5rpx;
				line-height: 40rpx;
				text-align: center;
			}

			&-td1 {
				width: 30%;
				height: 78rpx;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.85);
				line-height: 34rpx;
				padding: 0 5rpx;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
			}


			&-decoration {
				width: 100%;
				height: 1rpx;
				background: #F0F0F0;
			}

		}




	}
</style>