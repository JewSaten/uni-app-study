<template>
	<view class="gateway-btn-share">
		<EmptyList v-if="list.length == 0"></EmptyList>
		<view class="uni-card gateway-btn-share__item" v-for="(item, index) in list" :key="index">
			<view class="uni-flex-wrap">
				<image class="gateway-btn-share__item-avatar" :src="avatar(item.avatar)">
				</image>
				<view class="gateway-btn-share__item-username">{{item.nickname}}</view>
			</view>
			<view class="justify-content__sb">
				<view>
					<view class="gateway-btn-share__item-permission gateway-btn-share__item-label">
						拥有权限: {{item | permissionsFilter}}
					</view>
					<view class="gateway-btn-share__item-permission gateway-btn-share__item-label">
						有效期: {{new Date(item.expiredTime) | timeFormat}}
					</view>
					<view class="gateway-btn-share__item-permission gateway-btn-share__item-label">
						{{item.createTime}}
					</view>
				</view>
				<view class="justify-content__sb">
					<view class="gateway-btn-share__item-permission__edit-btn" @click="openEditModal(item)">修改</view>
					<view class="gateway-btn-share__item-permission__del-btn" @click="openDel(item)">删除
					</view>
				</view>
			</view>
		</view>
		<button class="uni-primary-btn save-btn" @click="toNewShare()">
			新增分享
		</button>

		<u-modal :show="showEditModal" :closeOnClickOverlay="true" :showConfirmButton="false" @close="closeEditModal()">
			<view class="edit-modal">
				<view class="edit-modal__close-icon-box">
					<u-icon name="close" customStyle="{float:'right'}" size="36rpx" @click="showEditModal = false">
					</u-icon>
				</view>
				<view class="flex-center__sb edit-modal__item">
					<view class="uni-flex-wrap">
						<image class="gateway-btn-share__item-avatar" :src="avatar(chooseItem.avatar)"></image>
						<view class="gateway-btn-share__item-username">{{chooseItem.nickname}}</view>
					</view>
					<view>{{chooseItem.createTime}}</view>
				</view>

				<view class="justify-content__sb edit-modal__item">
					拥有权限
					<u-checkbox-group placement="row" v-model="permissionList" @change="checkboxChange">
						<u-checkbox label="编辑" name="0" :customStyle="{marginRight: '8rpx',fontSize:'10rpx'}">
						</u-checkbox>
						<u-checkbox label="删除" name="1" :customStyle="{marginRight: '8rpx'}"></u-checkbox>
						<u-checkbox label="控制" name="2"></u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="justify-content__sb edit-modal__item">
					有效期
					<view class="justify-content__sb" @click="showShareTimePicker=true">
						<u-icon name="edit-pen-fill"></u-icon>
						<view>{{expiredTimestamp | timeFormat }}</view>
					</view>
				</view>
				<button class="uni-primary-btn edit-modal__save-btn" @click="editShare()">
					保存
				</button>
			</view>

		</u-modal>

		<u-modal :show="showDelModal" :closeOnClickOverlay="true" :showCancelButton="true" @cancel="showDelModal=false"
			@close="showDelModal=false" title="删除" @confirm="remove()">
			确认删除 [{{chooseItem.nickname}}] 的用户权限?
		</u-modal>

		<u-datetime-picker confirmColor="#4166D8" :show="showShareTimePicker" @confirm="showShareTimePicker=false"
			@cancel="showShareTimePicker=false" v-model="expiredTimestamp" mode="date"></u-datetime-picker>

	</view>


</template>

<script>
	import dateUtils from '@/untils/date'
	import permissionApi from '@/apis/permission'
	import toPage from '@/untils/toPage'
	import defaultParams from '@/untils/defalutParams'
	import EmptyList from '@/components/emptyList'
	export default {
		components: {
			EmptyList
		},
		onLoad(option) {
			this.gatewayId = option.gatewayId
			this.getList()
		},
		data() {
			return {
				gatewayId: '',
				list: [],
				chooseItem: {},
				permissionList: [],
				expiredTimestamp: '',
				showEditModal: false,
				showDelModal: false,
				showShareTimePicker: false
			}
		},
		methods: {

			openEditModal(item) {
				this.chooseItem = item
				let perList = item.permission.split(',')
				this.permissionList = []
				for (var i = 0; i < perList.length; i++) {
					if (perList[i] == '1') {
						this.permissionList.push('' + i)
					}
				}
				this.expiredTimestamp = new Date(item.expiredTime).getTime()
				this.showEditModal = true
			},
			closeEditModal() {
				this.showEditModal = false
			},
			editShare() {
				this.chooseItem.permission = ((this.permissionList.indexOf('0') >= 0 ? '1' : '0') + ',') +
					((this.permissionList.indexOf('1') >= 0 ? '1' : '0') + ',') +
					((this.permissionList.indexOf('2') >= 0 ? '1' : '0'))
				this.chooseItem.expiredTime = this.expiredTimestamp
				uni.showLoading()
				permissionApi.edit(this.chooseItem).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						uni.showToast({
							title: '编辑成功'
						});
						setTimeout(() => {
							this.getList()
						}, 1000)
						this.showEditModal = false
					}
				})

			},
			toNewShare(gatewayId) {
				toPage.newShare(this.gatewayId)
			},
			getList() {
				uni.showLoading()
				permissionApi.list({
					gatewayId: this.gatewayId
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.list = res.data
					}
				})
			},
			avatar(url) {
				return defaultParams.avatar(url)
			},
			remove() {
				permissionApi.remove(this.chooseItem.permissionId).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title: '删除成功',
							duration: 800
						})
						this.showDelModal = false
						this.getList()
					}
				})
			},
			openDel(item) {
				this.chooseItem = item
				this.showDelModal = true
			},
			checkboxChange(n) {
				this.permissionList = n
			}
		},
		filters: {
			permissionsFilter(item) {
				let perList = item.permission.split(',')
				return (perList[0] == '1' ? '编辑 ' : '') +
					(perList[1] == '1' ? '删除 ' : '') +
					(perList[2] == '1' ? '控制 ' : '')
			},
			timeFormat(timestamp) {
				if (timestamp) {
					return dateUtils.date2Str1(new Date(timestamp))
				}
				return ''
			}
		}
	}
</script>

<style lang="scss" scoped>
	.gateway-btn-share {
		padding: 0 30rpx 30rpx;
		color: #999999;


		&__item {
			background-color: white;
			border-radius: 8rpx;
			margin: 20rpx 0;

			&-label {
				font-size: 24rpx;
				font-weight: 400;
			}

			&-avatar {
				width: 100rpx;
				height: 100rpx;
				margin-right: 18rpx;
				border-radius: 50%;
			}

			&-username {
				font-size: 32rpx;
				font-weight: 400;
				color: #000000;
				line-height: 98rpx;
			}

			&-permission {
				margin-top: 16rpx;

				&__edit-btn {
					margin-right: 50rpx;
					color: #4166D8;
					font-size: 30rpx;
				}

				&__del-btn {
					color: #4166D8;
					font-size: 30rpx;
				}
			}
		}

		.save-btn {
			position: fixed;
			width: calc(100% - 60rpx);
			bottom: 92rpx;
			font-size: 32rpx;
			height: 80rpx;
		}

		.edit-modal {
			width: 100%;

			&__close-icon-box {
				float: right;
			}

			&__item {
				margin-top: 50rpx;
			}

			&__save-btn {
				width: 100%;
				margin-top: 74rpx;
			}
		}
	}
</style>