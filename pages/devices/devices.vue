<template>
	<view class="devices">
		<view class="devices-item flex-center__sb">
			<view class="devices-item__left">
				<view class="icon"></view>
				<view class="name">
					风机
				</view>
				<view class="tags">
					<view class="tags-item">
						
					</view>
				</view>
			</view>
			<view class="devices-item__btn flex-center__sb">
				<view class="toggle-btn">
					
				</view>
			</view>
		</view>		
	</view>
</template>

<script>
	import {envImpList} from '@/apis/gateway.js'
	export default {
		data() {
			return {
				list: []
			};
		},
		
		computed: {
			iconName() {
				return ''
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
