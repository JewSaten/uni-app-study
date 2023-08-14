<template>
	<view class="report-detail uni-page">
		<view class="uni-card card-list">
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
		</view>
		<view class="uni-card card-list">
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

			<view class="justify-content__sb" v-for="(btnLog, index) in btnLogList" :key="index">
				<view class="card-list-td">{{btnLog.openTime | logTimeFilter}}</view>
				<view class="card-list-td">{{btnLog.closeTime | logTimeFilter}}</view>
				<view class="card-list-td">{{btnLog.second | logSecondFilter}}</view>
				<view class="card-list-td">{{btnLog.ml | logMlFilter}}</view>
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
		<view class="uni-card">
			<view class="flex-center__sb">
				<view class="card-label">数据分析</view>
				<view class="card-label-extend" @click="toEnvLogChart()">展开</view>
			</view>
			<!-- 			<view class="justify-content__sb card-charts uni-inline-item">
				<view class="card-charts__choose-btn">近7天</view>
				<view>近30天</view>
				<view>近1年</view>
				<view>其他</view>
			</view> -->
			<view class="justify-content__sb card-charts uni-inline-item">
				<view class='card-charts__tab' v-for="(item, tbIndex) in handlingType" :key="tbIndex"
					@tap="showType(tbIndex)">
					<view class="" :class="[tbIndex == tabbarIndex ? 'card-charts__choose-btn' : '']">{{ item.value }}
					</view>
				</view>
			</view>
			<view class="charts-box">
				<qiun-data-charts type="line" :opts="opts" :chartData="chartData" :ontouch="true" :canvas2d="true"
					canvasId="mZbrYROUrPvNgTslmqDSlStehFFRHSsH" />
			</view>
		</view>
		<uni-datetime-picker ref="timePicker" type="datetimerange"  v-model="envLogDateTimeRange">\t</uni-datetime-picker>
	</view>
</template>

<script>
	import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js';
	import gatewayBtnLogApi from '@/apis/gatewayBtnLog';
	import environmentalLogApi from '@/apis/environmentalLog';
	import baseApi from '@/apis/base';
	import toPage from '@/untils/toPage';
	var uChartsInstance = {};
	export default {
		onLoad(option) {
			this.gatewayBtnId = option.gatewayBtnId
			this.evnLogParam = {gatewayBtnId: option.gatewayBtnId}
			this.getLatestEvnLog()
			this.getBtnLogList()
			this.getUChartsOptsData()
		},
		data() {
			return {
				gatewayBtnId: '',
				evnLogParam: {},
				latestEvnLog: {},
				evnLogList: {},
				btnLogList: [],
				tabbarIndex: 0,
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
				chartData: {},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
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
		onReady() {
			this.getEvnLogData(1);
		},
		methods: {
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
				gatewayBtnLogApi.list({
					gatewayBtnId: this.gatewayBtnId,
					limit: 10,
					page: 1
				}).then(res => {
					if (res.code == 0) {
						this.btnLogList = res.data.list
					}
				})
			},
			getLatestEvnLog() {
				environmentalLogApi.latestEvnLog({
					gatewayBtnId: this.gatewayBtnId
				}).then(res => {
					if (res.code == 0) {
						this.latestEvnLog = res.data != null ? res.data : {}
					}
				})
			},
			getEvnLogData(days) {
				let param = {gatewayBtnId : this.gatewayBtnId}
				if(days){
					this.envLogDateTimeRange = [];
					param.days = days;
				}else{
					param.beginTime = this.envLogDateTimeRange[0];
					param.endTime = this.envLogDateTimeRange[1];
				}
				this.evnLogParam = param;
				environmentalLogApi.data(param).then(res => {
					if (res.code == 0) {
						this.chartData = JSON.parse(JSON.stringify(res.data));
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
				toPage.toEnvLogChart(this.evnLogParam,this.tabbarIndex);
			}
		},
		watch: {
			envLogDateTimeRange(newval) {
				if(this.envLogDateTimeRange.length != 0){
					this.getEvnLogData();
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
				if (null == value|| value == undefined) {
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
			}
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
		}
	
		.card-label-extend {
			font-size: 26rpx;
			color: gray;
		}

		.card-env {

			padding: 58rpx 80rpx 70rpx;

			&__update-time {
				font-size: 26rpx;
				color: gray;
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
			margin-bottom: 20rpx;

			&-header {
				background: #FAFAFA;
				box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.06);
				padding: 18rpx 0;
			}

			&-th {
				width: 25%;
				font-size: 28rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				padding: 0 5rpx;
				line-height: 40rpx;
				text-align: center;
			}

			&-td {
				width: 25%;
				font-size: 28rpx;
				font-weight: 400;
				color: rgba(0, 0, 0, 0.85);
				line-height: 78rpx;
				padding: 0 5rpx;
				border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
				text-align: center;
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
</style>
