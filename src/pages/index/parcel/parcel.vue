<template>
	<view class="index bgColor">
		<view class="item" @click="navto('','全部')">
			<text class="f28 c333">全部包裹</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
		import tabbar from '@/components/tabbar/tabbar.vue';
		components:{
			tabbar
		}
	export default {
		data(){
			return {
				
			}
		},
		onLoad() {
			
		},
		onShow() {
			
		},
		methods:{
			navto(type,name){
				uni.navigateTo({
					url:'./inParcels?type=' + type+'&name='+name
				})
			},
			toBills(){
				uni.navigateTo({
					url:'./billings'
				})
			}
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

 