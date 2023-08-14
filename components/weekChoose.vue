<template>
	<view class="uni-flex-wrap">
		<button v-for="(weekBtn, index) in weekBtnList" :key="index" @click="changeWeek(weekBtn.value)"
			:class="weekList.includes(weekBtn.value) ?'week-choose-btn':'week-btn'">{{weekBtn.label}}</button>
		<button @click="changeWeek(null)" :class="isSingle ?'week-choose-btn':'week-btn'">单次</button>
	</view>
</template>

<script>
	export default {
		name: "WeekChoose",
		props: ['weekList'],
		data() {
			return {
				weekBtnList: [{
						label: '星期一',
						value: '2'
					},
					{
						label: '星期二',
						value: '3'
					},
					{
						label: '星期三',
						value: '4'
					},
					{
						label: '星期四',
						value: '5'
					},
					{
						label: '星期五',
						value: '6'
					},
					{
						label: '星期六',
						value: '7'
					},
					{
						label: '星期天',
						value: '1'
					}
				]
			}
		},
		methods: {
			changeWeek(week) {
				this.$emit('changeWeek', week)
			}
		},
		computed: {
			isSingle() {
				return !this.weekList.length
			}
		}
	}
</script>

<style lang="scss" scoped>
	.week {
		// .base-grey-box {
		// 	// padding: 24rpx;
		// 	background-color: #F8F8F8;
		// 	border-radius: 8rpx;
		// 	// margin: 0 -10rpx;
		// }

		&-choose-btn {
			background-color: #4166D8;
			border-color: #4166D8;
			color: white;
			flex: 0 0 23%;
			height: 70rpx;
			margin: 1%;
			font-size: 28rpx;
			padding: 0;
		}

		&-btn {
			background-color: white;
			border-color: #DFDFDF;
			color: rgba(0, 0, 0, 0.5);
			flex: 0 0 23%;
			height: 70rpx;
			margin: 1%;
			font-size: 28rpx;
			padding: 0;
		}
	}
</style>
