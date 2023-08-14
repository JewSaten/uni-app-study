<template>
	<view class="detail">

	<u-sticky>
		<view class="detail__header flex-center__sb" @click="$refs.timePicker.show()">

				<view class="detail__time">
					<text class="detail__time-text">{{startTime||'开始时间'}}</text>
					<u-icon name="arrow-down" color="#999"></u-icon>
				</view>
				<text class="detail__time-text">至</text>
				<view class="detail__time">
					<text class="detail__time-text">{{endTime||'结束时间'}}</text>
					<u-icon name="arrow-down" color="#999"></u-icon>
				</view>

		</view>
	

	
			<view class="align-items__center detail__card-list-header">
				<view class="detail__card-list-th">下料时间</view>
				<view class="detail__card-list-th1">时长(min)</view>
				<view class="detail__card-list-th1">重量(kg)</view>
			</view>
	</u-sticky>
		<EmptyList v-if="feedReports.length == 0"></EmptyList>

		<view class="detail__card-list">

			<block v-for="(item, index) in feedReports" :key="index">

				<view class="justify-content__sb">
					<view class="detail__card-list-td">{{item.feedTime}}</view>
					<view class="detail__card-list-td1">{{item.duration}}</view>
					<view class="detail__card-list-td1">{{item.feedVal}}</view>
				</view>
				<view class="detail__card-list-decoration"></view>
			</block>

		</view>
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" v-if="feedReports.length>0" />

	<uni-datetime-picker ref="timePicker" type="daterange"
		v-model="datetimerange">\t</uni-datetime-picker>
	</view>
</template>

<script>
	import EmptyList from '@/components/emptyList'
	import dayjs from 'dayjs'
	
	export default {
		components: {
			EmptyList
		},
		onLoad(options) {
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
		onLoad(){
		},
		data() {
			return {
				startTime:dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
				endTime:dayjs().format('YYYY-MM-DD'),
				datetimerange:[],
				
				feedReports: [
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:7,
						feedVal:50
					},
					
					{
						feedTime:'2023-06-27 10:40:01',
						duration:1,
						feedVal:60
					},
					{
						feedTime:'2023-06-27 10:40:01',
						duration:8,
						feedVal:50
					},
				],
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
			},
			loadmore() {},
		},
		watch: {
			datetimerange(newval) {
				console.log("范围:", this.datetimerange)
				this.startTime = this.datetimerange[0]
				this.endTime = this.datetimerange[1]
			},
		},
	}
</script>

<style lang="scss">
	.detail {
		background: #FFFFFF;
		height: 100vh;

		&__header {
			padding: 30rpx 15rpx;
			border-top-style: solid;
			border-top-color: #F8F8F8;
			border-top-width: 2rpx;
			background: #FFFFFF;

			box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153, 153, 153, 0.2);
			border-radius: 8rpx;
		}
		
		&__time{
			display: flex;
			flex-direction: row;
			flex: 1;
			justify-content: center;
			align-items: center;
			
			
			&-text{
				font-size: 30rpx;
				font-weight: 500;
				color: #999999;
				line-height: 48rpx;
				margin-right: 10rpx;
			}
		}
		
		
		&__card-list {
			padding-left: 15rpx;
			padding-right: 15rpx;
			background: #FFFFFF;
			&-header {
				background: #FAFAFA;
				box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.06);
				padding: 18rpx 0;
			}
		
			&-th {
				width: 50%;
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				padding: 0 5rpx;
				line-height: 40rpx;
				text-align: center;
			}
		
			&-td {
				width: 50%;
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
				width: 25%;
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				padding: 0 5rpx;
				line-height: 40rpx;
				text-align: center;
			}
		
			&-td1 {
				width: 25%;
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