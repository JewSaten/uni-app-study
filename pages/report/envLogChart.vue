<template>
	<view class="report-chart">
		<view class="report-chart__box">
			<view class="justify-content__sb card-charts uni-inline-item">
				<view class='card-charts__tab' v-for="(item, tbIndex) in handlingType" :key="tbIndex"
					@tap="showType(tbIndex)">
					<view class="card-charts__choose-btn"
						:class="[tbIndex == tabbarIndex ? 'card-charts__choose-active' : '']">{{ item.value }}
					</view>
				</view>
			</view>
			<view class="charts-box">
				<qiun-data-charts type="line" :opts="opts" :chartData="chartData" :ontouch="true"
				   :canvas2d="true" canvasId="sensorId" 
				 />
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/uni_modules/qiun-data-charts/js_sdk/u-charts/u-charts.js';
	import gatewayBtnLogApi from '@/apis/gatewayBtnLog';
	import environmentalLogApi from '@/apis/environmentalLog';
	import baseApi from '@/apis/base';
	var uChartsInstance = {};
	export default {
		// components: {
		// 	CoverViewDialog,
		// 	CoverViewPopup
		// },
		onLoad(option) {
			// this.gatewayBtnId = option.gatewayBtnId;
			this.environmentalCollectionId = option.environmentalCollectionId
			this.tabbarIndex = option.tabbarIndex;
			this.evnLogParam.days = option.days;
			this.evnLogParam.beginTime = option.beginTime;
			this.evnLogParam.endTime = option.endTime;
			// this.getLatestEvnLog();
			// this.getBtnLogList();
			
			// this.getUChartsOptsData();
		},
		data() {
			return {
				gatewayBtnId: '',
				environmentalCollectionId:'',
				evnLogParam: {},
				latestEvnLog: {},
				evnLogList: {},
				btnLogList: [],
				tabbarIndex: -1,
				specifyTime: [],
				handlingType: [{
						value: '今天'
					},
					{
						value: '近7天'
					},
					{
						value: '近15天'
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
					padding: [20, 0, 0, 25],
					enableScroll: true,
					legend: {
						padding:0,
						margin:0
					},
					xAxis: {
						itemCount: 20,
						disableGrid: true,
						rotateLabel: true,
						rotateAngle: 45,
						marginTop:10
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
			this.getEvnLogData();
		},
		methods: {
			getUChartsOptsData() {
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
								labelOffsetX: 160,
								labelOffsetY: 25,
								labelPadding:2,
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
			getEvnLogData() {
				let param = {environmentalCollectionId : this.environmentalCollectionId}
				if(this.evnLogParam.days){
					param.days = this.evnLogParam.days;
				}else{
					param.beginTime = this.evnLogParam.beginTime;
					param.endTime = this.evnLogParam.endTime;
				}
				this.evnLogParam = {environmentalCollectionId : this.environmentalCollectionId};
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
				});
				this.evnLogParam = {environmentalCollectionId : this.environmentalCollectionId};
			},
			showType(tbIndex) {
				this.tabbarIndex = tbIndex;
				if (this.tabbarIndex == 0) {
					this.evnLogParam.days = 1;
					this.getEvnLogData();
				} else if (this.tabbarIndex == 1) {
					this.evnLogParam.days = 7;
					this.getEvnLogData();
				} else if (this.tabbarIndex == 2) {
					this.evnLogParam.days = 15;
					this.getEvnLogData();
				} else if (this.tabbarIndex == 3) {
					//this.$refs.dayInputDialog.open();
				}
			}
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
				if (!value) {
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
		height: 260rpx;
	}

	.report-chart {
		background-color: white;
		margin-top: 5px;
		box-shadow: 0px 4px 20px 2px rgba(153, 153, 153, 0.2);
		border-radius: 10px;
		width:100%;
		overflow-x: hidden;
		
		&__box{
			padding: 5rpx 5rpx 10rpx 30rpx;
		}
		
		.card-charts {
			//margin-top: 36rpx;

			&__tab {
				width: 33.33%;
				text-align: center;
			}

			&__choose-btn {
				color: #7d7d7d;
				font-size: 15rpx;
				font-weight: 500;
				line-height: 20rpx;
			}

			&__choose-active {
				background: #F0F4FE;
				border-radius: 5px;
				border: 1rpx solid #4166D8;
				width: 100%;
				//padding: 12rpx 0;
				color: #4166D8;
			}
		}
	}
</style>
