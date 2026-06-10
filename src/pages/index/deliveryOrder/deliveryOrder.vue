<template>
	<view class="index bgColor">
		<view class="item" @click="navto('/pages/index/deliveryOrder/want')">
			<text class="f28 c333">我要派送（{{orderNumbers.wantDeliverCount ? orderNumbers.wantDeliverCount:0}}）</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<view class="item" @click="navto('/pages/index/deliveryOrder/beBeing?type=1')">
			<text class="f28 c333">正在派送订单（{{orderNumbers.beingDeliveredCount ? orderNumbers.beingDeliveredCount:0}}）</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<view class="item" @click="navto('/pages/index/deliveryOrder/beBeing?type=2')">
			<text class="f28 c333">已派送订单（{{orderNumbers.deliveredCount ? orderNumbers.deliveredCount:0}}）</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
		import tabbar from '@/components/tabbar/tabbar.vue';
export default {

	components:{
		tabbar
	},
	data() {
		return {
			orderNumbers:'',
		};
	},
	onLoad() {},
	onShow() {
		this.orderNumber();
	},
	methods: {
		//订单数量
		orderNumber() {
			var data = {
				
			};
			this.request
				.myRequest({
					url: '/api/order/selectDeliverOrderData',
					data: data
				})
				.then(res => {
					this.orderNumbers=res.data;
				});
		},
		navto(url) {
			uni.navigateTo({
				url: url
			});
		},
		toBills() {
			uni.navigateTo({
				url: './billings'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	padding-top: 1upx;
	.item {
		width: 94%;
		margin: 20upx auto;
		height: 140upx;
		background: #fff;
		border-radius: 20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 26upx 0 36upx;
		box-sizing: border-box;
		text {
		}
		image {
			flex-basis: 96upx;
			height: 52upx;
		}
	}
}
</style>
