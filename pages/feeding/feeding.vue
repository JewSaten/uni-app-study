<template>
	<view class="feed">
		<EmptyList v-if="feedList.length==0"></EmptyList>
		
		<view class="feed__list">
			
		<u-row :customStyle="{flexWrap: 'wrap'}"  justify="space-between"
		    gutter="15">
			
			<u-col span="6"  v-for="(feed,index) in feedList" :key="index">
				
				
			<view class="feed__card-item flex-center__sb" @click="toDetail">
				
				<view class="uni-flex uni-column" style="margin-right: 10rpx;">
					
					<image class="feed__card-item__icon" src="/static/images/index/icon-feed@2x.png"></image>
					<view class="feed__card-item__title">
						{{feed.name}}
					</view>	
					
					<view class="feed__card-item__tag-view">
						
						<text class="feed__card-item__tag-view-text">{{`${feed.feed}g/分钟`}}</text>
					</view>
						
					</view>
					
					<image class="feed__card-item__image" src="/static/images/gateway/btn/status-open@2x.png">
					</image>		
									
			</view>
			
		</u-col>
			
		</u-row>
		</view>
		
	</view>
</template>

<script>
	import EmptyList from '@/components/emptyList'
	import toPage from '@/untils/toPage'
	
	export default {
		components: {
			EmptyList
		},
		data() {
			return {
				feedList:[
					{
						name:'栏舍1',
						feed:600,
						status:1
					},
					{
						name:'栏舍1',
						feed:600,
						status:1
					},
					{
						name:'栏舍1',
						feed:600,
						status:1
					},
					{
						name:'栏舍1',
						feed:600,
						status:1,
					},
					{
						name:'栏舍1',
						feed:600,
						status:1
					}
				]
			}
		},
		onShow() {
			
		},
		methods: {
			
			toDetail(){
				toPage.toFeedDetail()
			}
		}
	}
</script>

<style lang="scss">
	
	.feed{
		height: 100vh;
		background: #FFFFFF;
		
		&__list {
			padding: 15rpx 30rpx;
		}
		
		&__card-item{
			height: 180rpx;
			background: #FFFFFF;
			box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153,153,153,0.2);
			border-radius: 8rpx;
			margin-top: 15rpx;
			margin-bottom: 15rpx;
			padding-left: 30rpx;
		
			&__icon{
				width: 40rpx;
				height: 40rpx;
			}
			
			&__title{
				font-size: 28rpx;
				font-weight: 500;
				color: #000000;
			}
			
			&__tag-view{
				margin-top: 10rpx;
				
				&-text{
					padding: 2rpx 14rpx;
					background: #F3F3F3;
					border-radius: 4rpx;
					text-align: center;
					font-size: 20rpx;
					font-weight: 500;
					color: rgba(153,153,153,0.8);
				}
				
			}
			
			&__image{
				width: 164rpx;
				height: 164rpx;
			}

		}
		
	}
	
</style>
