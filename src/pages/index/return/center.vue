<template>
	<view class="index bgColor">
		<view class="item" @click="toOnes(1,'申请退运包裹')">
			<text class="f28 c333">申请退运包裹</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<view class="item" @click="toOnes(70,'待退运包裹')">
			<text class="f28 c333">待退运包裹（{{orderNumbers.beReturnedCount ? orderNumbers.beReturnedCount:0}}）</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<view class="item" @click="toOnes(75,'已退运包裹')">
			<text class="f28 c333">已退运包裹（{{orderNumbers.returnedCount ? orderNumbers.returnedCount:0}}）</text>
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
		data(){
			return {
				orderNumbers:''
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.orderNumber();
		},
		methods:{
			//订单数量
			orderNumber() {
				var data = {
					
				};
				this.request
					.myRequest({
						url: '/api/order/selectReturnOrderData',
						data: data
					})
					.then(res => {
						this.orderNumbers=res.data;
					});
			},
			toOnes(type,title){
				uni.navigateTo({
					url:'./ones?type=' + type+'&title='+title
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		min-height: 100vh;
		padding-top: 1upx;
		.item{
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
			text{
				
			}
			image{
				flex-basis: 96upx;
				height: 52upx;
			}
		}
	}
</style>
