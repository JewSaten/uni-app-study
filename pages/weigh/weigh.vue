<template>
	<EmptyList v-if="shedList == 0"></EmptyList>
	<view class="weigh" v-else>
		
		<view class="flex-center__center">
			
		<u-tabs :list="tabs" lineColor="#4166D8" :activeStyle="tabsActiveStyle"
			:inactiveStyle="tabsInactiveStyle" :itemStyle="tabsItemStyle" @click="onTabClick"
			:current="currentTab" />
		</view>
		<view style="margin-top: 20rpx;">
			
			<!-- 详情-->
			<view v-if="currentTab == 0" class="weigh__content">
				
				<view class="weigh__title" v-if="shedInfo.appShedBatchVO!=null">{{`当前批次：${shedInfo.appShedBatchVO.shedBatchMark}`}}</view>
				
				<view class="flex-center__sb">
					
				<view class="uni-flex uni-row weigh__big-title-view" @click="shedList.length>1?handleOpenBottomPopup():null">
					<text class="weigh__big-title-view-text">{{curShedName||'--'}}</text>
					<u-icon name="/static/images/index/icon-dropdown@2x.png" width="18rpx" 
					height="18rpx" v-if="shedList.length>1"></u-icon>
				</view>
				
				<view class="uni-flex uni-row" style="margin-left: 10rpx;">
					
					<button class="weigh__default-btn flex-center__center" 
					@click="showFeed">{{shedInfo.appShedBatchVO?'修改':'进猪'}}</button>
					<button class="weigh__primary-btn flex-center__center" 
					style="margin-left: 10rpx;" @click="showOutofEndDlg=true" 
					v-if="shedInfo.appShedBatchVO!=null">出猪</button>
				</view>
				
				</view>
				
				
				<view class="flex-center__sb" style="margin-top: 50rpx;">
					
					
					<view class="uni-flex uni-column" style="flex: 1;">
						
						
						<view class="weigh__title">
								进猪时间
						</view>
						
						<view class="weigh__title-val">
							{{shedInfo.appShedBatchVO|formatDate}}
						</view>
						
					</view>
					
					<u-icon name="reload" label="刷新" size="20" label-size="12" color="#4166D8" 
					label-color="#4166D8" @click="getShedInfo(true)"></u-icon>
			
					
				</view>
				
			
				<view class="justify-content__sb"  style="margin-top: 40rpx;">
					
					<view class="uni-flex uni-column" >
						<text class="weigh__title">状态</text>
						<text class="weigh__title-val">{{STATUS[shedInfo.type-1]||'--'}}</text>
					</view>
					<view class="uni-flex uni-column" >
						<text class="weigh__title">日龄(天)</text>
						<text class="weigh__title-val">{{shedInfo.appShedBatchVO.dayNumber||'--'}}</text>
					</view>
					
					<view class="uni-flex uni-column" >
						<text class="weigh__title">平均体重(kg)</text>
						<text class="weigh__title-val">{{shedInfo.avgWeight||'--'}}</text>
					</view>
					<view class="uni-flex uni-column">
						<text class="weigh__title">实时体重(kg)</text>
						<text class="weigh__title-val">{{shedInfo.weight||'--'}}</text>
					</view>
					
				</view>
				
				<image mode="aspectFill" :src="shedInfo.pic" :data-src="shedInfo.pic" style="background-color: #cfcfcf;width:100%;height: 760rpx;margin-top: 40rpx;" @tap="previewImage"></image>
				
			</view>
			
			
			<!-- 数据-->
			<view v-if="currentTab == 1" class="weigh__content">
				
								<view class="weigh__title" style="margin-bottom: 10rpx;" v-if="shedInfo.appShedBatchVO!=null">{{`当前批次：${shedInfo.appShedBatchVO.shedBatchMark}`}}</view>
				<view class="flex-center__sb">
					
				<view class="uni-flex uni-row weigh__big-title-view" @click="shedList.length>1?handleOpenBottomPopup():null">
					<text class="weigh__big-title-view-text">{{curShedName||'--'}}</text>
					<u-icon name="/static/images/index/icon-dropdown@2x.png" width="18rpx" 
					height="18rpx" v-if="shedList.length>1"></u-icon>
				</view>
				
				<u-icon name="reload" label="刷新" size="20" label-size="12" color="#4166D8"
					label-color="#4166D8" @click="getDataInfo"></u-icon>
				
				
				</view>
				
				
				<view style="margin-top: 40rpx;">
					
					<view class="weigh__section-title">- 时间统计 -</view>
					
					
					<view class="flex-center__sb" style="margin-top: 20rpx;">
						
						<view class="weigh__time-view flex-center__sb" @click="$refs.timePicker.show()">
							
							<view class="uni-flex uni-row">
								<text class="weigh__time-view-text">{{startTime||'开始时间'}}</text>
								<u-icon name="arrow-down" color="#999"></u-icon>
							</view>
							<text class="weigh__time-view-text">至</text>
							<view class="uni-flex uni-row">
								<text class="weigh__time-view-text">{{endTime||'结束时间'}}</text>
								<u-icon name="arrow-down" color="#999"></u-icon>
							</view>
							
							
							
						</view>
						
						<button class="weigh__primary-btn flex-center__center"
						style="margin-left: 20rpx;" @click="weighReport">统计</button>
					</view>
					
					
					<view class="justify-content__sb"  style="margin: 40rpx 40rpx 0rpx 40rpx;">
						
						<view class="uni-flex uni-column" >
							<text class="weigh__title">起始体重(kg)</text>
							<text class="weigh__title-val">{{weightData.beginWeight||'--'}}</text>
						</view>
						<view class="uni-flex uni-column" >
							<text class="weigh__title">终止体重(kg)</text>
							<text class="weigh__title-val">{{weightData.endWeight||'--'}}</text>
						</view>
						
						<view class="uni-flex uni-column" >
							<text class="weigh__title">日均增重(kg)</text>
							<text class="weigh__color-title-val">{{weightData.dayAddWeight|dayAddWeightFilter}}</text>
						</view>
						
					</view>
					
					
					<view class="weigh__charts">
						
						<text class="weigh__charts-title">日均体重</text>
						<qiun-data-charts type="line"   :opts="opts" :chartData="weightChartData"
						  :canvas2d="true" canvasId="weightId"  :ontouch="true"
						 />
					</view>
					
					

					<view class="weigh__section-title" style="margin-top: 80rpx;">- 体重统计 -</view>
					
					
					<view class="uni-flex uni-row flex-center__center" style="margin-top: 20rpx;">
						
						<view class="uni-flex uni-row" style="flex: 1;">
							
						
						<u-number-box color="#666666" bgColor="#f1f1f1" 
						 integer iconStyle="color: #666666" v-model="beginWeigh"
						 :disabledInput="true"
						 step="1"
						 :disablePlus="beginWeigh+1>=endWeigh"
						 ></u-number-box>
						 <view style="width: 10rpx;"></view>
						<u-number-box  color="#666666" bgColor="#f1f1f1"
						integer iconStyle="color: #666666" v-model="endWeigh"
						:disabledInput="true"
						step="1"
						:disableMinus="endWeigh-1<=beginWeigh"
						 ></u-number-box>
						
						</view>
						<button class="weigh__primary-btn flex-center__center"
						@click="gainWeighReport" style="margin-left: 10rpx;">统计</button>
					</view>
					
<!-- 					
					<view class="justify-content__sb"  style="margin: 40rpx 40rpx 0rpx 40rpx;">
						
						<view class="uni-flex uni-column" >
							<text class="weigh__title">起始体重(kg)</text>
							<text class="weigh__title-val">{{gainWeightData.beginWeight||'--'}}</text>
						</view>
						<view class="uni-flex uni-column" >
							<text class="weigh__title">终止体重(kg)</text>
							<text class="weigh__title-val">{{gainWeightData.beginWeight||'--'}}</text>
						</view>
						
						<view class="uni-flex uni-column" >
							<text class="weigh__title">日均增重(kg)</text>
							<text class="weigh__color-title-val">{{gainWeightData.dayAddWeight|dayAddWeightFilter}}</text>
						</view>
						
					</view> -->
					
					
					<view class="weigh__charts">
						
						<text class="weigh__charts-title">日均增重</text>
						<qiun-data-charts type="line"  :opts="opts" :chartData="gainWeightChartData"
						 :canvas2d="true" canvasId="gainWeightId" :ontouch="true"
						 />
					</view>
					
					
				</view>
				
			</view>
		
		
		
		<!--出猪modal -->
		
		<u-modal :show="showBatchModal" :closeOnClickOverlay="true" :showConfirmButton="false"
			:safeAreaInsetBottom="true" @close="showBatchModal =false">
			<view class="weigh__show-modal">
				<view class="flex-center__sb">
					<view class="weigh__show-modal__title">出猪情况</view>
					<view class="weigh__show-modal__close-icon-box">
						<u-icon name="close" size="36rpx" @click="showBatchModal = false">
						</u-icon>
					</view>
				</view>
				<view class="weigh__show-modal__item">
					
					<view class="weigh__show-modal__subtitle">数量(只)</view>
					<input class="weigh__show-modal__input" v-model="quantity" type="number" placeholder="请输入数量" placeholder-style="color:#999999;"/>
				</view>
				<button class="uni-primary-btn weigh__show-modal__save-btn">
					保存
				</button>
			</view>
		
		</u-modal>
		
		
		
		
		<!--修改数据modal -->
		
		<u-modal :show="showFeedModal" :closeOnClickOverlay="true" :showConfirmButton="false"
			:safeAreaInsetBottom="true" @close="showFeedModal =false">
			<view class="weigh__show-modal">
				<view class="flex-center__sb">
					<view class="weigh__show-modal__title">{{shedInfo.appShedBatchVO?'修改数据':'进猪'}}</view>
					<view class="weigh__show-modal__close-icon-box">
						<u-icon name="close" size="36rpx" @click="showFeedModal = false">
						</u-icon>
					</view>
				</view>
				
				<view class="weigh__show-modal__item" v-if="shedInfo.appShedBatchVO==null">
					
					<view class="weigh__show-modal__subtitle">进猪时间</view>
					<input class="weigh__show-modal__input" v-model="beginTime" type="text" placeholder="请选择进猪时间" placeholder-style="color:#999999;" @click="showBeginTimePicker=true" disabled="true"/>
				</view>
				
				<view class="weigh__show-modal__item_2" v-if="shedInfo.appShedBatchVO==null">
					
					<view class="weigh__show-modal__subtitle">批次</view>
					<input class="weigh__show-modal__input" v-model="shedBatchMark" type="text"
					 placeholder="请输入批次" placeholder-style="color:#999999;"
					  @input="onBatchKeyInput" @focus="onBatchKeyInput"/>
				</view>
				
				<view class="weigh__show-modal__item_2" v-if="shedInfo.appShedBatchVO==null">
					
					<view class="weigh__show-modal__subtitle">日龄(天)</view>
					<input class="weigh__show-modal__input" v-model="dayNumber" type="number" placeholder="请输入日龄" placeholder-style="color:#999999;"/>
				</view>
				
				<view 
			:class="shedInfo.appShedBatchVO==null?'weigh__show-modal__item_2':'weigh__show-modal__item'">
					<view class="weigh__show-modal__subtitle">数量(只)</view>
					<input class="weigh__show-modal__input" v-model="quantity" type="number" placeholder="请输入数量" placeholder-style="color:#999999;"/>
				</view>
		
				<view class="weigh__show-modal__item_2">
					
					<view class="weigh__show-modal__subtitle">单只推荐
喂料量(kg)</view>
					<input class="weigh__show-modal__input" v-model="feedWeight" type="digit" placeholder="请输入喂料量" placeholder-style="color:#999999;"/>
				</view>
				<button class="uni-primary-btn weigh__show-modal__save-btn_2" @click="intoShed">
					保存
				</button>
			</view>
		
		</u-modal>
		
		
		
		<!--日期范围控件 -->
		<uni-datetime-picker ref="timePicker" type="daterange"
			v-model="datetimerange">\t</uni-datetime-picker>
			
			<!--进猪日期 -->
				
				<u-calendar :show="showBeginTimePicker" mode="single" 
				@confirm="beginTimeConfirm" @close="showBeginTimePicker=false" title="进猪时间"></u-calendar>
				
				<u-modal :show="showOutofEndDlg" content='是否确认出猪?' @cancel="showOutofEndDlg=false" title="出猪提示"
					:showCancelButton="true" @confirm="confirmOutOfEnd" confirmColor="#4166D8"></u-modal>

		<u-picker :show="showBatchPicker" :columns="shedBatchList" closeOnClickOverlay title="选择批次" confirmColor="#4166D8"
			@cancel="showBatchPicker=false" @confirm="batchPickerConfirm" @close="showBatchPicker=false"></u-picker>					
					
		</view>
		
	
		
		<!-- bottomsheet -->
		<uni-popup ref="shedPopup" background-color="#fff" type="bottom">
			<view class="weigh__bottom-popup">
				<scroll-view class="weigh__bottom-popup__scroll" scroll-y="true">
					<block v-for="(item, index) in shedList" :key="index">
						<view class="weigh__bottom-popup__item-view flex-center__sb"
							hover-class="weigh__bottom-popup__item-view-hover" @click="onShedItemClick(item,index)">
							<view class="weigh__bottom-popup__item-view-text">{{item.shedName}}</view>
							<u-icon name="checkmark" size="26" color="#4166D8" v-if="curShedPos == index"></u-icon>
						</view>
						<view class="weigh__bottom-popup__item-view-decoration"></view>
					</block>
				</scroll-view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	import shedApi from '@/apis/shed'
	import EmptyList from '@/components/emptyList'
	export default {
		components:{
			EmptyList
		},
		data() {
			return {
				curFarmId:0,
				tabs:[{name: '详情'},{name: '数据'}],
				currentTab:0,
				startTime:dayjs().subtract(1, 'week').startOf('day').format('YYYY-MM-DD'),
				endTime:dayjs().endOf('day').format('YYYY-MM-DD'),
				datetimerange:[],
				weightChartData: {
					categories: ['2023-7-1','2023-7-2','2023-7-3','2023-7-4','2023-7-5'],
					series: [
						{name:'日均体重',data:['40','42','44','50','48']}
					]
				},
				gainWeightChartData: {
					categories: ['2023-7-1','2023-7-2','2023-7-3','2023-7-4','2023-7-5'],
					series: [
						{name:'日均增重',data:['0','0.2','0.4','0.8','1']}
					]
				},
				opts: {
					padding:[20, 0, 0, 0],
					dataPointShapeType:'hollow',
					color: ['#4166D8'],
					enableScroll: true,
					legend: {
						show:false
					},
					xAxis: {
						itemCount: 3,
						disableGrid: true,
					},
					yAxis: {
						gridType: "solid",
						dashLength: 2,
					},
					extra: {
						line: {
							type:"curve",
							width: 2,
							activeType: "solid"
						}
					}
				},
				shedList:[
					{
						shedId:1,
						shedName:'肥猪舍1'
					},{
						shedId:2,
						shedName:'肥猪舍2'
					}
				],
				shedInfo:{},
				curShedPos: 0,
				curShedId: 0,
				curShedBatchId:0,
				curShedName: '',
				showBatchModal:false,
				showFeedModal:false,
				STATUS:['育肥'],
				beginTime:'',
				quantity:'',
				feedWeight:'',
				dayNumber:'',
				shedBatchMark:'',
				beginWeigh:30,
				endWeigh:50,
				showBeginTimePicker:false,
				weightData:{},
				gainWeightData:{},
				showOutofEndDlg:false,
				shedBatchList:[[]],
				showBatchPicker:false
			}
		},
		onLoad() {
			console.log('onload')
		},
		
		onShow(){
			console.log('onShow')
			let farmId = uni.getStorageSync('farmId')
			console.log(`farmId: ${farmId}`)
			if(this.curFarmId !== farmId){
				this.currentTab = 0
			}
			this.curFarmId = farmId
			if(this.curFarmId){
				shedApi.shedList(this.curFarmId).then(res => {
				if (res && res.code == 0) {
					this.shedList = res.data || [];
					this.curShedId = this.shedList.length > 0 ? this.shedList[0].shedId : 0;
					this.curShedPos = 0;
					this.curShedName = this.shedList.length > 0 ? this.shedList[0].shedName : '';
					}
				}).then(() => {
					this.onPageReload()
				})
			}
		},
		watch: {
			datetimerange(newval) {
				console.log("范围:", this.datetimerange)
				this.startTime = this.datetimerange[0]
				this.endTime = this.datetimerange[1]
			},
		},
		computed: {
			tabsActiveStyle() {
				return {
					color: '#000',
					fontSize: '34rpx'
				}
			},
			tabsInactiveStyle() {
				return {
					color: '#999',
				}
			},
			tabsItemStyle() {
				
				return {
					height: '70rpx',
					color: '#999',
					fontSize: '30rpx',
					fontWeight: '500',
				}
			}
		},
		methods: {
			onPageReload(){
				if(this.currentTab == 0){
					this.getShedInfo()
				}else{
					this.getDataInfo()
				}
			},
			onTabClick(item) {
				this.currentTab = item.index
				this.onPageReload()
			},
			handleOpenBottomPopup() {
				this.$refs.shedPopup.open()
			},
			handleCloseBottomPopup() {
				this.$refs.shedPopup.close()
			},
			
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: [current],
					indicator:'none'
				})
			},
			
			onShedItemClick(item, index) {
				if (this.curShedId === item.shedId) {
					this.handleCloseBottomPopup()
					return
				}
				this.curShedPos = index
				this.handleCloseBottomPopup()
				this.curShedId = item.shedId
				this.curShedName = item.shedName
				this.onPageReload()
			},
			
			getShedInfo(refresh){
				if(refresh) uni.showLoading()
				shedApi.getShedInfo(this.curShedId).then(res => {
					if(res && res.code ==0){
						uni.hideLoading()
						this.shedInfo = res.data
						let vo = this.shedInfo.appShedBatchVO
						this.dayNumber = vo?vo.dayNumber:''
						this.quantity = vo?vo.quantity:''
						this.feedWeight = vo?vo.feedWeight:''
						this.curShedBatchId = vo?vo.shedBatchId:0
					}
					
				})
			},
			getDataInfo(){
				console.log('数据')
				this.weighReport()
				this.gainWeighReport()
			},
			weighReport(){
				console.log('weighReport')
				console.log('begintime:'+dayjs(dayjs(this.startTime).startOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss'))
								console.log('endtime:'+dayjs(dayjs(this.endTime).endOf('day').valueOf()).format('YYYY-MM-DD HH:mm:ss'))
				uni.showLoading()
				shedApi.weightList({
					beginTime:dayjs(this.startTime).startOf('day').valueOf(),
					endTime:dayjs(this.endTime).endOf('day').valueOf(),
					shedBatchId:this.curShedBatchId,
					shedId:this.curShedId
				}).then(res =>{
					if(res && res.code == 0){
						uni.hideLoading()
						this.weightData = res.data
						this.weightChartData = {
							categories: this.weightData.list.map(item=>dayjs(item.createTime).format('YYYY-MM-DD')),
							series: [
								{name:'日均体重',data:this.weightData.list.map(item=>item.weight)}
							]
						}
					}
				})
			},
			gainWeighReport(){
				console.log('gainWeighReport')
				uni.showLoading()
				shedApi.dayWeightList({
					beginWeight:this.beginWeigh,
					endWeight:this.endWeigh,
					shedBatchId:this.curShedBatchId,
					shedId:this.curShedId
				}).then(res =>{
					if(res && res.code == 0){
						uni.hideLoading()
						this.gainWeightData = res.data
						
						this.gainWeightChartData = {
							categories: this.gainWeightData.list.map(item=>dayjs(item.createTime).format('YYYY-MM-DD')),
							series: [
								{name:'日均增重',data:this.gainWeightData.list.map(item=>item.dayAddWeight)}
							]
						}
					}
				})
			},
			intoShed(){
				console.log(`daynum:${this.dayNumber},quntity:${this.quantity},feed:${this.feedWeight}`)
				let addMode = this.shedInfo.appShedBatchVO == null
				
				if(addMode){
				if (!this.dayNumber) {
					uni.showToast({
						icon: 'none',
						title: '请输入日龄'
					});
					return
				}
				if(!this.beginTime){
					uni.showToast({
						icon: 'none',
						title: '请输入进猪时间'
					});
					return
				}
				if(!this.shedBatchMark){
					uni.showToast({
						icon: 'none',
						title: '请输入批次'
					});
					return
				}
				}else{
					if (!this.feedWeight) {
						uni.showToast({
							icon: 'none',
							title: '请输入饲料量'
						});
						return
					}
				}
				if (!this.quantity) {
					uni.showToast({
						icon: 'none',
						title: '请输入数量'
					});
					return
				}
				let editParams = {
					shedId:this.curShedId,
					quantity:this.quantity,
					feedWeight:this.feedWeight,
				}
				let addParams = {...editParams,
					dayNumber:this.dayNumber,
					beginTime:dayjs(this.beginTime).valueOf(),
					shedBatchMark:this.shedBatchMark
				}
			
				uni.showLoading()
				shedApi.shedBatchUpdate(addMode,addMode?addParams:editParams).then(res=>{
					if(res && res.code==0){
						this.showFeedModal = false
						uni.hideLoading()
						this.getShedInfo()
					}
				})
				
			},
			outOfShed(){
				uni.showLoading()
				shedApi.shedOutOfEnd(this.curShedId).then(res =>{
					if(res && res.code ==0){
						uni.hideLoading()
						this.beginTime = dayjs().format('YYYY-MM-DD')
						this.shedBatchMark=''
						this.getShedInfo()
					}
				})
			},
			confirmOutOfEnd(){
				this.showOutofEndDlg = false
				this.outOfShed()
			},
			beginTimeConfirm(e){
				this.beginTime = e
				this.showBeginTimePicker = false
			},
			showFeed(){
				shedApi.shedBatchList(this.curShedId).then(res =>{
					if(res && res.code ==0){
						this.shedBatchList =[]
						this.shedBatchList.push(res.data.map(item=>item.shedBatchMark))
						this.shedBatchMark = this.shedBatchList[0][0]||''
						this.showFeedModal=true
					}
				})
			},
			batchPickerConfirm(e){
				this.showBatchPicker = false
				this.shedBatchMark = e.value[0]
			},
			onBatchKeyInput(e){
				let inputValue = e.target.value;
				this.showBatchPicker=inputValue.length==0 && this.shedBatchList[0].length>0
			},
			onBatchInputFocus(e){
				let inputValue = e.detail.value;
				this.showBatchPicker=inputValue.length==0 && this.shedBatchList[0].length>0
			}
		},
		filters:{
			dayAddWeightFilter(val){
				return val?val:'--'
			},
			formatDate(obj){
				if(obj == null || obj == undefined){
					return '--'
				}
				return obj ? dayjs(obj.beginTime).format('YYYY-MM-DD'):'--'
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.weigh{
		padding: 20rpx 40rpx;
		
		&__content{
			background: #FFFFFF;
			box-shadow: 0rpx 4rpx 20rpx 2rpx rgba(153,153,153,0.2);
			border-radius: 8rpx;
			padding: 40rpx;
		}
		
		&__big-title-view{
			
			align-items: flex-end;
			flex: 1;
			&-text{
				font-size: 36rpx;
				font-weight: 600;
				color: #000000;
				line-height: 40rpx;
			}
			
		}
		
		&__default-btn{
			width: 120rpx;
			height: 60rpx;
			background: #FFFFFF;
			border-radius: 12rpx;
			border: 2rpx solid #4166D8;
			color: #4166D8;
			font-size: 24rpx;
		}
		
		&__primary-btn{
			width: 120rpx;
			height: 60rpx;
			background: #4166D8;
			border-radius: 12rpx;
			color: #FFFFFF;
			font-size: 24rpx;
		}
		
		&__title{
			font-size: 24rpx;
			font-weight: 400;
			color: #999999;
			line-height: 30rpx;
		}
		
		&__title-val{
			font-size: 36rpx;
			font-weight: 600;
			color: #000000;
			line-height: 40rpx;
		}
		
		&__color-title-val{
			@extend .weigh__title-val;
			color:#4166D8
		}
		
		&__section-title{
			font-size: 28rpx;
			font-weight: bold;
			color: #666666;
			line-height: 40rpx;
			text-align: center;
		}
		
		&__time-view{
			height: 60rpx;
			background: #F8F8F8;
			border-radius: 8rpx;
			border: 2rpx solid #F8F8F8;
			padding-left: 20rpx;
			padding-right: 20rpx;
			flex: 1;
			
			&-text{
				font-size: 26rpx;
				font-weight: 500;
				color: #999999;
				line-height: 48rpx;
				margin-right: 10rpx;
			}
		}
		
		&__charts{
			margin-top: 20rpx;
			
			&-title{
				font-size: 24rpx;
				font-weight: 500;
				color: #999999;
				line-height: 30rpx;
			}
		}
		
		&__bottom-popup{
			height: 60vh;
			
			&__scroll{
				flex: 1;
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
			}
			
			&__item-view {
				background: #FFFFFF;
				height: 140rpx;
				padding-left: 20rpx;
				padding-right: 20rpx;
			
				&-hover {
					background-color: #eee;
				}
			
				&-text {
					font-size: 28rpx;
					font-weight: 400;
					color: rgba(0, 0, 0, 0.85);
				}
			
				&-decoration {
					width: 100%;
					height: 1rpx;
					background: #F0F0F0;
				}
			}
			
		}
		
		&__show-modal{
			width: 100%;
			
			&__title {
				font-size: 36rpx;
				font-weight: 400;
			}
			
			&__close-icon-box {
				float: right;
				padding: 15rpx;
			}
			
			&__item {
				margin-top: 76rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			
			&__item_2 {
				@extend .weigh__show-modal__item;
				margin-top: 56rpx;
			}
			
			&__subtitle{
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(0,0,0,0.8);
				line-height: 44rpx;
				width: 154rpx;
			}
			
			&__input {
				background: #F8F8F8;
				border-radius: 4rpx;
				padding: 25rpx 15rpx;
				font-size: 30rpx;
				width: 350rpx;
				color: black;
			}
			
			&__save-btn {
				width: 100%;
				margin-top: 68rpx;
			}
			
			&__save-btn_2 {
				@extend .weigh__show-modal__save-btn;
				margin-top: 92rpx;
			}
		}
		
	}

</style>
