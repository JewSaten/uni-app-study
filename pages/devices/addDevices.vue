<template>
	<view class="add-devices">

		<view class="flex-center__sb add-devices__cell-item" @click="showPicker(0)">

			<view class="add-devices__cell-item-title-text">类型</view>

			<view class="align-items__center">

				<!-- 				<image src="/static/images/index//icon-env-whd@2x.png" class="add-devices__cell-item-small-icon"></image> -->
				<view class="add-devices__cell-item-subtitle-text">{{typeDisplayName}}</view>
				<u-icon name="arrow-right" color="#999"></u-icon>
			</view>

		</view>

		<view class="flex-center__sb add-devices__cell-item">

			<view class="add-devices__cell-item-title-text">名称</view>

			<input class="add-devices__cell-item-input" v-model="deviceName" placeholder-style="color:#999999;"
				type="text" placeholder="请输入设备名称" />

		</view>

		<view class="flex-center__sb add-devices__cell-item">

			<view class="add-devices__cell-item-title-text">额定功率</view>

			<input class="add-devices__cell-item-input" v-model="flow" placeholder-style="color:#999999;" type="digit"
				placeholder="请输入功率(非必填)" />

		</view>
		
		<view class="flex-center__sb add-devices__cell-item">
		
			<view class="add-devices__cell-item-title-text">数量</view>
		
			<input class="add-devices__cell-item-input" v-model="quantity" placeholder-style="color:#999999;" type="number"
				placeholder="请输入数量" @blur="onBlur"/>
		
		</view>


	<!-- 	<view class="flex-center__sb add-devices__cell-item" @click="showPicker(1)">

			<view class="add-devices__cell-item-title-text">关联网关</view>

			<view class="align-items__center">

				<view class="add-devices__cell-item-subtitle-text">{{gatewayDisplayName}}</view>
				<u-icon name="arrow-right" color="#999"></u-icon>
			</view>

		</view> -->


		<view class="flex-center__sb add-devices__cell-item" @click="showPicker(2)">

			<view class="add-devices__cell-item-title-text">关联开关</view>

			<view class="align-items__center">

				<view class="add-devices__cell-item-subtitle-text">{{btnDisplayName}}</view>
				<u-icon name="arrow-right" color="#999"></u-icon>
			</view>

		</view>


		<button class="add-devices__btn" @click="addDevice">确认添加</button>

		<u-picker :show="show1" :columns="columns1" closeOnClickOverlay title="设备类型" confirmColor="#4166D8"
			@cancel="cancel" @confirm="typePickerConfirm" @close="close"></u-picker>

		<u-picker :show="show2" :columns="columns2" closeOnClickOverlay title="关联网关" confirmColor="#4166D8"
			@cancel="cancel" @confirm="gatewayPickerConfirm" @close="close"></u-picker>

		<u-picker :show="show3" :columns="columns3" closeOnClickOverlay title="关联开关" confirmColor="#4166D8"
			@cancel="cancel" @confirm="btnPickerConfirm" @close="close"></u-picker>
	</view>
</template>

<script>
	import toPage from '@/untils/toPage'
	import gatewayApi from '@/apis/gateway'
	import baseApi from '@/apis/base'

	export default {

		onLoad(options) {
			baseApi.findDicByKey({
				key: "envImpType"
			}).then(res => {
				if (res.code == 0) {
					this.envTypes = res.data.map(item => (item.dictValue))
					this.columns1.push(res.data.map(item => (item.dictName)))
					this.typeDisplayName = this.columns1[0][0]
					this.typeValue = this.envTypes[0]
				}
			})
			// gatewayApi.list().then(res => {
			// 	if (res && res.code == 0) {
			// 		console.log("json: " + JSON.stringify(res.data))
						
			// 		this.gatewayIds = res.data.map(item => (item.gatewayId))
			// 		this.columns2.push(res.data.map(item => (item.name)))
			// 		this.gatewayDisplayName = this.columns2[0][0]
			// 		this.gatewayValue = this.gatewayIds[0]
			// 		this.getGatewayBtns(res.data[0].gatewayId)
			// 	}
			// })
			this.getGatewayBtns(options.gatewayId)
		},

		data() {
			return {
				index: 0,
				deviceName: '',
				flow: '',
				envTypes: [], 
				gatewayIds:[],
				gatewayBtnIds:[],
				show1: false,
				show2: false,
				show3: false,
				columns1: [],
				columns2: [],
				columns3: [],
				typeDisplayName:'',
				typeValue:'',
				gatewayDisplayName:'',
				gatewayValue:'',
				btnDisplayName:'',
				btnValue:'',
				quantity:1
			}
		},
		methods: {

			showPicker(index) {
				console.log("index: "+index)
				this.index = index + 1
				console.log("index1: "+this.index)
				this[`show${index + 1}`] = true
			},
			getGatewayBtns(gatewayId) {
				gatewayApi.detail({
					gatewayId: gatewayId
				}).then(res => {
					if (res.code == 0) {
						this.gatewayBtnIds = res.data.btnList.map(item => (item.gatewayBtnId))
						this.columns3.push(res.data.btnList.map(item => (item.name)))
						this.btnDisplayName = this.columns3[0][0]
						this.btnValue = this.gatewayBtnIds[0]
					}
				})
			},
			close() {
				this[`show${this.index}`] = false
			},
			typePickerConfirm(e){
				this[`show${this.index}`] = false
				this.typeDisplayName = e.value[0]
				this.typeValue = this.envTypes[e.indexs[0]]
			},
			gatewayPickerConfirm(e){
				this[`show${this.index}`] = false
				this.gatewayDisplayName = e.value[0]
				this.gatewayValue = this.gatewayIds[e.indexs[0]]
				this.getGatewayBtns(this.gatewayValue)
			},
			btnPickerConfirm(e){
				this[`show${this.index}`] = false
				this.btnDisplayName = e.value[0]
				this.btnValue = this.gatewayBtnIds[e.indexs[0]]
			},
			cancel() {
				this[`show${this.index}`] = false
			},
			onBlur(e){
				if(!e.detail.value || e.detail.value == 0){
					this.quantity = 1
				}
			},
			addDevice(){
				if(!this.deviceName){
					uni.showToast({
						icon: 'none',
						title: '请输入设备名称'
					})
					return
				}
				uni.showLoading()
				gatewayApi.addEnvDevice({
					gatewayBtnId: this.btnValue,
					environmentalType: this.typeValue,
					name:this.deviceName,
					flow:this.flow,
					quantity:this.quantity
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.navigateBack()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-devices {
		background-color: #f8f8f8;

		&__cell-item {
			background-color: white;
			padding: 48rpx 30rpx 48rpx 60rpx;
			margin-top: 2rpx;

			&-title-text {
				font-size: 36rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.8);
			}

			&-subtitle-text {
				font-size: 32rpx;
				font-weight: 400;
				color: black;
				margin-left: 10rpx;
				margin-right: 30rpx;
			}

			&-small-icon {

				width: 40rpx;
				height: 40rpx;

			}

			&-input {
				width: 452rpx;
				height: 80rpx;
				background: #F8F8F8;
				border-radius: 4rpx;
				padding: 0 22rpx;
				font-weight: 400;
				color: #999999;
				font-size: 32rpx;
				color: black;
			}

		}

		&__btn {
			height: 88rpx;
			background: #4166D8;
			border-radius: 8rpx;
			color: white;
			font-size: 36rpx;
			margin: 40rpx 70rpx 0rpx;
			box-shadow: 0 10rpx 10rpx 0 rgba(22, 80, 226, 0.3);
			padding: 0rpx;
		}


	}
</style>