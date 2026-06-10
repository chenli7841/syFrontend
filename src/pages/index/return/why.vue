<template>
	<view class="index bgColor">
		<view class="top bfff">
			<view class="num">
				<view class="num-left c333 f26">
					<text>{{ order.ordernumber ? order.ordernumber : '-' }}</text>
					|
					<text>{{ order.recipientname ? order.recipientname : '-' }}</text>
				</view>
				<view class="num-status f24">未入库</view>
			</view>
			<view class="count">
				<view class="countO">
					<text class="textT f24 c666">国内单号：{{ order.domesticnumber ? order.domesticnumber : '-' }}</text>
				</view>
			</view>
		</view>
		<!-- item -->
		<view class="item bfff">
			<view class="title c333 f26">退运原因</view>
			<textarea class="ipt f24" v-model="textarea" placeholder="请输入退运原因" />
		</view>
		<view class="item bfff" v-if="address != ''">
			<view class="title c333 f26">退运地址</view>
			<!-- item.mobile.substr(0,3)}}****{{item.mobile.substr(-4) -->
			<view class="name c333 f24">{{ address.consignee }}（收）{{ address.mobile.substr(0, 3) }}****{{ address.mobile.substr(-4) }}</view>
			<view class="address f24 c666">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detailArea }}</view>
			<view class="change f24 capp" @click="selectAddress">选择其他地址</view>
		</view>
		<view class="btns"><u-button :loading='loading' type="primary" class="send f28 cfff btnColor" @click="submitReturn">提交</u-button></view>
		<u-toast ref="uToast" :duration="3000" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading:false,
			order: '',
			address: '',
			textarea: ''
		};
	},
	onLoad(e) {
			this.orderInfo(e.id);
	},
	onShow() {

if(uni.getStorageSync('address')){
		this.address = uni.getStorageSync('address');
}
	},
	methods: {
		//选择其他地址
		//去选择地址
		selectAddress(){
			uni.navigateTo({
				url:'/pages/home/the/new?type='+this.order.isfromchina
			})
		},
		//确认提交
		submitReturn() {
			var that=this;
			if(this.address == ''){
				this.$toast('请选择收货地址');
				return false
			}
			if(this.textarea == ''){
				this.$toast('请填写退运原因');
				return false
			}
			var data = {
				businessId: this.order.id,
				applyContent: this.textarea,
				addressId: this.address.id,
				type: 3
			};
			this.loading=true;
			this.request
				.myRequest({
					url: '/api/order/applyReturn',
					method:'post',
					data:data
				})
				.then(res => {
					this.$toast('申请成功，请等待审核');
						uni.removeStorageSync('address')
					setTimeout(()=>{
						uni.navigateBack({
						    delta: 1
						});
							that.loading=false;
					},2000)
				})
				.catch(error => {});
		},
		//订单列表
		orderInfo(id) {
			this.request
				.myRequest({
					url: '/api/order',
					data: {
						id: id
					}
				})
				.then(res => {
					this.order = res.data.content[0];
							this.getList();
				});
		},
		//获取收货地址
		getList() {
			var data = {
				addresstype: this.order.isfromchina,
				page: 1,
				size: 1
			};
			this.request
				.myRequest({
					url: '/api/sysShippingAddress',
					method: 'GET',
					data: data
				})
				.then(res => {
					if (res.data.content.length == 0) {
						this.$refs.uToast.show({
							title: '请到个人中心设置默认地址',
							type: 'error',
							url: '/pages/home/the/goots'
						});
					} else {
						this.address = res.data.content[0];
					}
				})
				.catch(error => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	.top {
		width: 100%;
		margin: 16upx 0;
		padding: 30upx 30upx;
		box-sizing: border-box;
		.num {
			height: 50upx;
			display: flex;
			justify-content: space-between;
			.num-left {
				text:first-child {
					margin-right: 22upx;
				}
				text:last-child {
					margin-left: 22upx;
				}
			}
			.num-status {
				color: #ff7e33;
			}
		}
		.count {
			width: 100%;
			.countO {
				display: flex;
				height: 50upx;
				align-items: center;
				.textO {
					flex-basis: 240upx;
				}
				.textT {
					flex: 1;
				}
			}
		}
	}
	.item {
		width: 100%;
		margin: 20upx 0;
		padding: 0 30upx 30upx;
		box-sizing: border-box;
		.title {
			height: 100upx;
			line-height: 100upx;
		}
		.ipt {
			background: #f1f3f6;
			border-radius: 10upx;
			padding: 20upx;
			box-sizing: border-box;
			height: 230upx;
		}
		.address {
			margin: 20upx 0;
		}
	}
	.btns {
		display: flex;
		flex-direction: row-reverse;
		margin-top: 22upx;
		padding-right: 30upx;
		box-sizing: border-box;
		button {
			flex-basis: 180upx;
			height: 68upx;
			margin: 0 !important;
			
			line-height: 68upx;
			text-align: center;
			border-radius: 34upx;
		}
	}
}
</style>
