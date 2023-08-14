<template>
	<view class="common-edit">
		<view class="flex-center__sb uni-label-font common-edit__item">
			<view class="uni-label-font">{{iconLabel}}</view>
			<view class="align-items__center">
				<u-upload @afterRead="afterRead" name="1" multiple :maxCount="1" width="96rpx"
					height="96rpx" :previewFullImage="true">
					<image v-if="this_icon" :src="this_icon" style="width: 96rpx;height: 96rpx;"
						@error="imageOnError()"></image>
				</u-upload>
				<u-icon name="arrow-right" color="#999"></u-icon>
			</view>
		</view>
		<view class="flex-center__sb common-edit__item">
			<view class="uni-label-font">{{nameLabel}}</view>
			<input v-model="this_name" placeholder="请输入" border="surround" class="uni-input common-edit__item-name" placeholder-style="color:#999999;"
				maxlength="30"></input>
		</view>
	</view>
</template>

<script>
	import baseApi from '@/apis/base'
	export default {
		name: "NameAndIconEdit",
		props: ['nameLabel', 'name', 'iconLabel', 'icon'],
		data() {
			return {
				this_name: this.name,
				this_icon: this.icon
			}
		},
		methods: {
			async afterRead(event) {
				let file = event.file[0]
				uni.showLoading()
				uni.uploadFile({
					url: baseApi.getUploadPicUrl(true),
					filePath: file.url,
					name: 'file',
					success: res => {
						uni.hideLoading()
						let result = JSON.parse(res.data)
						if (result.code == 0) {
							this.this_icon = result.data.url
						}
					},
					fail() {
						uni.hideLoading()
					}
				})
			},
			imageOnError() {
				if (this.this_icon) {
					this.this_icon = ''
				}
			},
		},
			watch: {
				this_name() {
					this.$emit('update:name', this.this_name)
				},
				this_icon(){
					this.$emit('update:icon', this.this_icon)
				}
			},
	}
</script>

<style lang="scss" scoped>
	.common-edit {
		&__item {
			margin-top: 10rpx;
			padding-bottom: 10rpx;
			border-bottom: 1rpx solid #F8F8F8;

			&-name {
				text-align: right;
				color: black;
			}
		}
	}
</style>
