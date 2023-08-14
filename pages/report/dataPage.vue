<template>
	<view class="report-detail uni-page">

		<view style="margin-bottom: 15rpx;">
			<u-tabs :list="list" lineColor="#4166D8" :activeStyle="{
										color: '#000000',
										fontWeight: 'bold',
										fontSize: '30rpx',
										fontWeight: '500',
										transform: 'scale(1.05)'
									}" :inactiveStyle="{
										color: '#999999',
										fontSize:'30rpx',
										fontWeight: '500',
										transform: 'scale(1)'
									}" itemStyle="height: 35px;" @click="click" :current="currentTab">
								<view slot="right" class="uni-flex tab-more-bg" @tap="showDrawer" 
								v-if="list.length>0">
									<u-icon name="/static/images/index/icon-tab-more@2x.png" ></u-icon>
								</view>
			</u-tabs>

		</view>

		<EmptyList v-if="list.length == 0"></EmptyList>
		<view v-if="list.length >0">
	
		<u-empty v-if="envImpRange.length ==0 && range.length==0" 
		icon="/static/images/commons/empty-list.png" text="暂无数据"></u-empty>
		</view>

		<view v-if="list.length>0">
			<!-- 			<view class="uni-card card-list">
				<view class="flex-center__sb">
					<view class="card-label">环境指数</view>
					<view class="card-env__update-time">
						更新时间 {{latestEvnLog.createTime}}
					</view>
				</view>
				<view class="card-env flex-center__sb uni-flex-wrap">
					<view class="card-env__item align-items__center">
						<view class="card-env__item-icon card-env__item-temp"></view>
						<view class="uni-flex uni-column">
							<view class="card-env__item-label">温度</view>
							<view class="card-env__item-value">{{latestEvnLog.temp | evnLogFilter("temp")}} </view>
						</view>

					</view>
					<view class="card-env__item align-items__center">
						<view class="card-env__item-icon card-env__item-hum"></view>
						<view class="uni-flex uni-column">
							<view class="card-env__item-label">湿度</view>
							<view class="card-env__item-value">{{latestEvnLog.hum | evnLogFilter("hum")}}</view>
						</view>
					</view>

					<view class="card-env__item align-items__center">
						<view class="card-env__item-icon card-env__item-co2"></view>
						<view class="uni-flex uni-column">
							<view class="card-env__item-label">CO₂</view>
							<view class="card-env__item-value">{{latestEvnLog.co2 | evnLogFilter("co2")}}</view>
						</view>
					</view>
					<view class="card-env__item align-items__center">
						<view class="card-env__item-icon card-env__item-co2"></view>
						<view class="uni-flex uni-column">
							<view class="card-env__item-label">NH₃</view>
							<view class="card-env__item-value">{{latestEvnLog.nh3 | evnLogFilter("nh3")}}</view>
						</view>
					</view>
				</view>
			</view> -->


			<view class="uni-card card-list" v-if="envImpRange.length>0">
				<view class="justify-content__sb">
					<view class="card-label">运行日志</view>
					<view class="card-label-extend" @click="toRunLog">更多</view>
				</view>

				<uni-data-select v-model="environmentalImprovementId" :localdata="envImpRange" @change="envImpChange" :clear="false"></uni-data-select>

				<view class="align-items__center card-list-header">
					<view class="card-list-th1">开启时间</view>
					<view class="card-list-th1">关闭时间</view>
					<view class="card-list-th">设备数</view>
					<view class="card-list-th">{{envImpSelectedType | envImpDataTitleFilter}}</view>
				</view>

				<view v-for="(envLog, index) in envImpList" :key="index">

					<view class="justify-content__sb">
						<view class="card-list-td1">{{envLog.powerOnTime | switchLogTimeFilter}}</view>
						<view class="card-list-td1">{{envLog.powerOffTime | switchLogTimeFilter}}</view>
						<view class="card-list-td">{{envLog.quantity | logQuantityFilter}}</view>
					<view class="card-list-td">{{envLog.improvementData | envImpDataFilter}}</view>
					</view>
					<view class="card-list-decoration"></view>
				</view>

			</view>

			<view class="uni-card card-list" v-if="btnLogList.length>0">
				<view class="justify-content__sb">
					<view class="card-label">喷洒信息</view>
					<!-- <view class="more">更多</view> -->
				</view>

				<view class="align-items__center card-list-header">
					<view class="card-list-th">开始时间</view>
					<view class="card-list-th">结束时间</view>
					<view class="card-list-th">时长</view>
					<view class="card-list-th">喷洒量(L)</view>
				</view>

				<view v-for="(btnLog, index) in btnLogList" :key="index">

					<view class="justify-content__sb">
						<view class="card-list-td">{{btnLog.openTime | logTimeFilter}}</view>
						<view class="card-list-td">{{btnLog.closeTime | logTimeFilter}}</view>
						<view class="card-list-td">{{btnLog.second | logSecondFilter}}</view>
						<view class="card-list-td">{{btnLog.ml | logMlFilter}}</view>
					</view>
					<view class="card-list-decoration"></view>

				</view>

			</view>

			<!-- <view v-if="evnLogList.length != 0" class="uni-card card-list">
			<view class="justify-content__sb">
				<view class="card-label">环境指数</view>
			</view>
	
			<view class="align-items__center card-list-header">
				<view class="card-list-th">上报时间</view>
				<view class="card-list-th">温度</view>
				<view class="card-list-th">湿度</view>
				<view class="card-list-th">氨气</view>
			</view>
	
			<view class="justify-content__sb" v-for="(evnLog, index) in evnLogList" :key="index">
				<view class="card-list-td">{{evnLog.createTime | logTimeFilter}}</view>
				<view class="card-list-td">{{evnLog.temp | logTempFilter}}</view>
				<view class="card-list-td">{{evnLog.hum | logHumFilter}}</view>
				<view class="card-list-td">{{evnLog.nh3 | logNH3Filter}}</view>
			</view>
		</view> -->
			<view class="uni-card" v-if="range.length>0">
				<view class="justify-content__sb">
					<view class="card-label">数据分析</view>
					<view class="card-label-extend" @click="toEnvLogChart()">展开</view>
				</view>
				<!-- 			<view class="justify-content__sb card-charts uni-inline-item">
				<view class="card-charts__choose-btn">近7天</view>
				<view>近30天</view>
				<view>近1年</view>
				<view>其他</view>
			</view> -->
				<uni-data-select v-model="environmentalCollectionId" :localdata="range" @change="change" :clear="false"></uni-data-select>
				<view class="justify-content__sb card-charts uni-inline-item">
					<view class='card-charts__tab' v-for="(item, tbIndex) in handlingType" :key="tbIndex"
						@tap="showType(tbIndex)">
						<view class="" :class="[tbIndex == tabbarIndex ? 'card-charts__choose-btn' : '']">
							{{ item.value }}
						</view>
					</view>
				</view>
				<view class="charts-box">
					<qiun-data-charts type="line" :opts="opts" :chartData="chartData" :ontouch="true"
					 :canvas2d="true" canvasId="sensorId" 
					 />
				</view>
			</view>
			<uni-datetime-picker ref="timePicker" type="datetimerange"
				v-model="envLogDateTimeRange">\t</uni-datetime-picker>
		</view>
		
		<uni-drawer ref="leftDrawer" mode="left" :width="260">
		
		<view class="drawer">
			<scroll-view class="drawer__scroll-view" scroll-y="true">
			<EmptyList v-if="list.length == 0"></EmptyList>
			<block v-for="(item, index) in list" :key="index">
				
				<view class="drawer__item-view" hover-class="drawer__item-view-hover"
				 @click="onDrawItemClick(item,index)">
					<view class="drawer__item-view-title">{{item.name}}</view>
					
					<view class="drawer__item-divider"></view>
					
				</view>
				
			</block>
			</scroll-view>
		</view>
		</uni-drawer>
	</view>
</template>

<script>
	import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js';
	import gatewayBtnLogApi from '@/apis/gatewayBtnLog';
	import gatewayApi from '@/apis/gateway';
	import environmentalLogApi from '@/apis/environmentalLog';
	import baseApi from '@/apis/base';
	import toPage from '@/untils/toPage';
	import EmptyList from '@/components/emptyList'
	var uChartsInstance = {};
	export default {
		components: {
			EmptyList
		},
		onLoad() {
			// this.getUChartsOptsData()
		},
		onShow() {
			
			let farmId = uni.getStorageSync('farmId')
			console.log(`farmId: ${farmId}`)
			if(this.curFarmId !== farmId){
				this.currentTab = 0
			}
			this.curFarmId = farmId
			if(farmId){
				gatewayApi.listv2(farmId).then(res => {
				if (res && res.code == 0) {
					this.list = res.data
					this.onPageReload()
				}
				})
			}
		// 	uni.getStorage({
		// 		key: 'farmId',
		// 		success: function (result) {
		// 			console.log(`farmId: ${result.data}`)
				
		
		// 		}
		// 	});
		},
		data() {
			return {
				gatewayBtnId: '',
				environmentalCollectionId: 0,
				gatewayId: '',
				evnLogParam: {},
				list: [],
				isRefresh: false,
				currentTab: 0,
				curFarmId:0,
				keyword: '',
				range: [],
				environmentalImprovementId:0,
				envImpRange:[],
				envImpSelectedType:0,
				envImpTypes:[],
				// latestEvnLog: {},
				evnLogList: {},
				envImpList:[],
				btnLogList: [],
				switchList: [],
				tabbarIndex: 0,
				days: [1, 7, 15, 0],
				envLogDateTimeRange: [],
				handlingType: [{
						value: '今天'
					},
					{
						value: '近7天'
					},
					{
						value: '近15天'
					},
					{
						value: '其他'
					}
				],

				cWidth: 750,
				cHeight: 500,
				chartData: {
					categories: [],
					series: []
				},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#4166D8", "#5AD8A6", "#FAC858", "#EE6666", "#73C0DE", 
					"#3CA272", "#FC8452", "#9A60B4",	"#ea7ccc"],
					//rotate: true,
					padding: [20, 0, 0, 0],
					enableScroll: true,
					legend: {},
					xAxis: {
						itemCount: 4,
						disableGrid: true
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2
					},
					extra: {
						line: {
							type: "straight",
							width: 2,
							activeType: "hollow"
						},
						markLine: {
							type: "dash",
							dashLength: 4,
							data: []
						}
					}
				}
			};
		},
		// onReady() {
		// 	this.getEvnData(1)
		// },
		methods: {

			onPageReload() {
				// this.gatewayBtnId = this.list[this.currentTab].gatewayBtnId
				this.gatewayId = this.list[this.currentTab].gatewayId
				this.tabbarIndex = 0
				// this.evnLogParam = {
				// 	gatewayBtnId: this.gatewayBtnId
				// }
				// this.getLatestEvnLog()
				// this.getSwitchLogList()
				// this.getBtnLogList()
				
				this.getEnvImpList()

				// if (this.isRefresh) {
				this.getEvnData(this.days[this.tabbarIndex])
				// }
			},

			// getLatestEvnLog() {
			// 	gatewayApi.envList(this.gatewayId).then(res => {
			// 		if (res && res.code == 0) {
			// 			console.log("env res: " + JSON.stringify(res.data))
			// 			// this.$nextTick(() => {
			// 			this.environmentalCollectionList = res.data.environmentalCollectionList
			// 			// })
			// 			let response = res.data
			// 			if (response != null) {
			// 				if (response.environmentalCollectionList != null && response
			// 					.environmentalCollectionList.length > 0) {
			// 					this.latestEvnLog = response.environmentalCollectionList[0]
			// 				}
			// 			}

			// 		}
			// 	})
			// },

			click(item) {
				this.currentTab = item.index
				console.log("currentTab: " + this.currentTab)
				// this.isRefresh = true
				this.onPageReload()
			},
			onDrawItemClick(item,index){
				this.closeDrawer()
				this.currentTab = index
				this.onPageReload()
			},
			getUChartsOptsData() {

				let markLine = {
					type: "dash",
					dashLength: 4,
					data: [{
							value: 32,
							lineColor: "#ff0000",
							labelFontSize: 9,
							showLabel: true,
							labelAlign: "left",
							labelOffsetX: 90,
							labelOffsetY: 15,
							labelText: "NH3预警线",
							labelFontColor: "#ff0000",
							labelBgColor: "#ffffff",
							labelBgOpacity: 0
						},
						{
							value: 20,
							lineColor: "#ff0000",
							labelFontSize: 9,
							showLabel: true,
							labelAlign: "left",
							labelOffsetX: 90,
							labelOffsetY: 15,
							labelText: "H2S预警线",
							labelFontColor: "#ff0000",
							labelBgColor: "#ffffff",
							labelBgOpacity: 0
						}
					]
				};
				let datas = [];
				baseApi.findDicByKey({
					key: "ENV_WARN_LINE"
				}).then(res => {
					if (res.code == 0) {
						for (let key in res.data) {
							let data = {
								value: res.data[key].dictValue,
								lineColor: "#ff0000",
								labelFontSize: 7,
								showLabel: true,
								labelAlign: "left",
								labelOffsetX: 190,
								labelOffsetY: 40,
								labelText: res.data[key].dictName,
								labelFontColor: "#ff0000",
								labelBgColor: "#ffffff",
								labelBgOpacity: 0
							}
							datas.push(data);
						}
					}
				})
				//this.opts.extra.markLine = JSON.parse(JSON.stringify(markLine));
				this.opts.extra.markLine.data = datas;

			},
			getBtnLogList() {
				gatewayBtnLogApi.sprayList({
					gatewayId: this.gatewayId,
					limit: 10,
					page: 1
				}).then(res => {
					if (res.code == 0) {
						this.btnLogList = res.data.list
					}
				})
				// gatewayBtnLogApi.list({
				// 	gatewayBtnId: this.gatewayBtnId,
				// 	limit: 10,
				// 	page: 1
				// }).then(res => {
				// 	if (res.code == 0) {
				// 		this.btnLogList = res.data.list
				// 	}
				// })
			},
			getSwitchLogList() {
				gatewayBtnLogApi.switchList({
					gatewayId: this.gatewayId,
					limit: 10,
					page: 1
				}).then(res => {
					if (res.code == 0) {
						this.switchList = res.data.list
					}
				})
			},

			change(e) {
				// this.gatewayBtnId = val
				this.environmentalCollectionId = e.val
				this.getEvnLogData(this.days[this.tabbarIndex])
			},
			
			envImpChange(e){
				this.environmentalImprovementId = e.val
				this.envImpSelectedType = this.envImpTypes[e.idx]
				this.getEnvImpLogList()
			},
			
			getEnvImpList(){
				environmentalLogApi.envImprovementList(this.gatewayId).then(res => {
					if (res.code == 0) {
						// this.envImpRange = res.data != null && res.data.length > 0 
						// ? res.data.map(item => ({
						// 	value: item.environmentalImprovementId,
						// 	text: item.name
						// })) : []
						// this.environmentalImprovementId = this.envImpRange.length > 0 
						// ? this.envImpRange[0].value : 0
						// this.envImpTypes = this.envImpRange.length>0
						// ?res.data.map(item => item.environmentalType):[],
						// this.envImpSelectedType = this.envImpTypes.length>0?this.envImpTypes[0]:0
						// this.getEnvImpLogList()
				
					}
				})
			},
			
			getEnvImpLogList() {
				environmentalLogApi.envImpLogList({
					environmentalImprovementId: this.environmentalImprovementId,
					limit: 10,
					page: 1
				}).then(res => {
					if (res.code == 0) {
						this.envImpList = res.data.list
					}
				})
			},

			getEvnData(days) {
				// gatewayApi.detail({
				// 	gatewayId: this.gatewayId
				// }).then(res => {
				// 	if (res.code == 0) {

				// 		this.range = res.data.btnList.map(item => ({
				// 			value: item.gatewayBtnId,
				// 			text: item.name
				// 		}))

				// 		this.value = this.range.length > 0 ? this.range[0].value : 0
				// 		this.gatewayBtnId = this.value
				// 		this.getEvnLogData(days)
				// 	}
				// })
				environmentalLogApi.envTypeList(this.gatewayId).then(res => {
					if (res.code == 0) {
						this.range = res.data != null && res.data.length > 0 ? res.data.map(item => ({
							value: item.environmentalCollectionId,
							text: item.name
						})) : []
						this.environmentalCollectionId = this.range.length > 0 ? this.range[0].value : 0
						this.getEvnLogData(days)

					}
				})

			},
			getEvnLogData(days) {
				let param = {
					environmentalCollectionId: this.environmentalCollectionId
				}
				if (days > 0) {
					this.envLogDateTimeRange = [];
					param.days = days;
				} else {
					param.beginTime = this.envLogDateTimeRange[0];
					param.endTime = this.envLogDateTimeRange[1];
				}
				this.evnLogParam = param;
				environmentalLogApi.datav2(param).then(res => {
					if (res.code == 0) {
						if(res.data != null){
							
						this.chartData = res.data.categories!=null && res.data.series!=null ?
							JSON.parse(JSON.stringify(res.data)) : {
								categories: [],
								series: []
							};
						}else{
							this.chartData ={
								categories: [],
								series: []
							};
						}
					}
				})
			},
			showType(tbIndex) {
				this.tabbarIndex = tbIndex;
				if (this.tabbarIndex == 0) {
					this.getEvnLogData(1);
				} else if (this.tabbarIndex == 1) {
					this.getEvnLogData(7);
				} else if (this.tabbarIndex == 2) {
					this.getEvnLogData(15);
				} else if (this.tabbarIndex == 3) {
					//this.$refs.dayInputDialog.open();
					this.$refs.timePicker.show();
				}
			},
			toEnvLogChart() {
				toPage.toEnvLogChart(this.evnLogParam, this.tabbarIndex);
			},
			toRunLog() {
				toPage.runLog(this.envImpSelectedType,this.environmentalImprovementId)
			},
			showDrawer() {
				console.log('showDrawer')
				this.$refs.leftDrawer.open()
			},
			closeDrawer() {
				console.log('closeDrawer')
				this.$refs.leftDrawer.close()
			},
		},
		watch: {
			envLogDateTimeRange(newval) {
				if (this.envLogDateTimeRange.length != 0) {
					this.getEvnLogData(this.days[3]);
				}
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
			evnLogFilter(value, type) {
				if (null == value || value == undefined) {
					return '--'
				}
				if (type == "temp") {
					return value + '℃'
				} else if (type == "hum") {
					return value + '%'
				} else if (type == "nh3") {
					return value + 'ppm'
				} else if (type == "co2") {
					return value + 'ppm'
				}
				return '-'
			},
			logQuantityFilter(quntity){
				if (!quntity) {
					return '/'
				}
				return quntity
			},
			
			envImpDataTitleFilter(type){
				if(type == 1){
					return '通风量(m³)'
				}
				else if(type == 3){
					return '喷洒量(ml)'
				}
				return '--'
			},
			
			envImpDataFilter(data){
				if (null == data || data == undefined) {
					return '/'
				}
				return data
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	.charts-box {
		width: 100%;
		//height: 300px;
	}

	.report-detail {
		
		.more {
			color: #4166D8;
		}

		.card-label {
			font-size: 36rpx;
			color: #000000;
			font-weight: 600;
		}

		.card-label-extend {
			font-size: 26rpx;
			color: #999999;
			font-weight: 500;
		}

		.card-env {

			padding: 58rpx 80rpx 70rpx;

			&__update-time {
				font-size: 22rpx;
				color: #999999;
				font-weight: 400;
			}

			&__item {

				width: calc(50% - 60rpx);

				&:nth-child(2),
				&:nth-child(4) {
					margin-left: 60rpx;
				}

				&:nth-child(3),
				&:nth-child(4) {
					margin-top: 42rpx;
				}

				&-label {
					font-size: 24rpx;
					font-weight: 400;
					color: #999999;
					line-height: 30rpx;
				}

				&-value {
					font-size: 36rpx;
					font-weight: bold;
					color: #000000;
					line-height: 40rpx;
				}

				&-icon {
					background: no-repeat center center/contain;
					height: 60rpx;
					width: 60rpx;
					flex: 0 0 30px;
					margin-right: 10rpx;
				}

				&-temp {
					background-image: url(../../static/images/report/icon-temp@2x.png);
				}

				&-hum {
					background-image: url(../../static/images/report/icon-hum@2x.png);
				}

				&-co2 {
					background-image: url(../../static/images/report/icon-co2@2x.png);
				}

			}



		}

		.card-list {
			margin-top: 15rpx;
			margin-bottom: 15rpx;

			&-header {
				background: #FAFAFA;
				box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.06);
				padding: 18rpx 0;
				margin-top: 20rpx;
			}

			&-th {
				width: 18%;
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				padding: 0 5rpx;
				line-height: 40rpx;
				text-align: center;
			}

			&-td {
				width: 18%;
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
				width: 32%;
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				padding: 0 5rpx;
				line-height: 40rpx;
				text-align: center;
			}

			&-td1 {
				width: 32%;
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

		.card-charts {
			padding: 0 16rpx;
			color: #999999;
			margin-top: 36rpx;
			font-size: 28rpx;
			font-weight: 500;
			line-height: 36rpx;

			&__tab {
				width: 25%;
				text-align: center;
			}

			&__choose-btn {
				background: #F0F4FE;
				border-radius: 8px;
				border: 2rpx solid #4166D8;
				width: 100%;
				padding: 12rpx 0;
				color: #4166D8;
				line-height: 36rpx;
			}

			&-table {
				margin-left: -50rpx;
				margin-top: 20rpx;

				&__canvas {
					width: 100%;
					height: 600rpx;
				}
			}
		}


	}
	.tab-more-bg {
		width: 60rpx;
		height: 42rpx;
		padding-left: 4rpx;
		padding-right: 4rpx;
		background: #FFFFFF;
		box-shadow: 0rpx 2rpx 10rpx 1rpx rgba(153, 153, 153, 0.2);
		border-radius: 12rpx;
		justify-content: center;
		align-items: center;
	}
	
	.drawer{
		background: #FFFFFF;
		height: 100vh;
		
		&__scroll-view{
			flex: 1;
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
		}
		
		&__item-view{
			background: #FFFFFF;
			position: relative;
			height: 140rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			display: flex;
			align-items: center;
			&-hover{
				 background-color: #eee;
			}
			
			&-title{
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.85);
				word-break: break-all;
				word-wrap: break-word;
			}
		}
		&__item-divider{
			position: absolute;
			left: 20rpx;
			right: 20rpx;
			bottom: 0;
			height: 1rpx;
			background-color: #F0F0F0;
		}
		
	}
	
	
</style>