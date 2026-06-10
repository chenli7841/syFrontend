<template>
	<view class="index bgColor">
		<view class="item" @click="toConing(1,'未匹配包裹')">
			<text class="f28 c333">未匹配包裹({{orderNumber.item1}})</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<view class="item" @click="toSend(10,'待发货包裹',15)">
			<text class="f28 c333">待发货包裹({{orderNumber.item2}})</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<view class="item" @click="toSend(60,'待确认包裹',25)">
			<text class="f28 c333">待确认包裹({{orderNumber.item3}})</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
		import tabbar from '@/components/tabbar/tabbar.vue';
	export default {

		components:{
			tabbar,
		},
		data(){
			return {
				orderNumber:{},
			}
		},
		onLoad(e) {
			this.orderNumber=e;
		},
		onShow() {
			
		},
		methods:{
			toSend(type,title,state){
				uni.navigateTo({
					url:'./route?type=' + type+'&title='+title+'&state='+state
				})
			},
			navto(type){
				uni.navigateTo({
					url:'./inParcels?type=' + type
				})
			},
			toConing(type,title){
				uni.navigateTo({
					url:'./warehouse?type=' + type+'&title='+title
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		// min-height: 100vh;
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
