<template>
		<u-picker :defaultIndex="defaultIndex" :show="true" :columns="columns" @cancel="cancel" @confirm="confirm"
			keyName="label" confirmColor="#4166D8"></u-picker>
</template>
<script>
	export default {
		name: "HmsDatePicker",
		props: ['deFaultSecond'],
		created() {
			let hours = this.init(0, 23, '时')
			let mins = this.init(0, 59, '分')
			let seconds = this.init(0, 59, '秒')
			hours = hours.concat(hours)
			mins = mins.concat(mins)
			seconds = seconds.concat(seconds)
			this.columns = [
				hours,
				mins,
				seconds
			]
		},
		data() {
			return {
				columns: []
			}
		},
		methods: {
			init(start, end, unit = '') {
				let val = []
				for (var i = start; i <= end; i++) {
					val.push({
						label: i + unit,
						value: i
					})
				}
				return val
			},
			confirm(val) {
				this.$emit('confirm', val.value)
			},
			cancel() {
				this.$emit('cancel')
			}
		},
		computed:{
			defaultIndex(){
				if (this.deFaultSecond) {
					let defaultHours = parseInt(this.deFaultSecond / 3600)
					let defaultMins = parseInt((this.deFaultSecond - (defaultHours * 3600)) / 60)
					let defaultSecond = this.deFaultSecond - (defaultHours * 3600) - (defaultMins * 60)
					if (defaultHours < 24 && defaultMins < 60 && defaultSecond <= 60) {
						return [
							24 + defaultHours,
							60 + defaultMins,
							60 + defaultSecond
						]
					}
				}
				return [24, 60, 60]
			}
		}
	}
</script>
