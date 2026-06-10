<template>
	<view class="index bgColor">
		<view class="item" v-for="(item,index) in houseData" :key="index" @click="toSend(item.id,item.type)">
			<text class="f28 c333">{{item.name}}{{item.ordernumber?'('+item.ordernumber+')':''}}</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<!-- <view class="item" @click="toSend(10,'待发货包裹')">
			<text class="f28 c333">待发货包裹</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view>
		<view class="item" @click="toSend(60,'待确认包裹')">
			<text class="f28 c333">待确认包裹</text>
			<image src="../../../static/order/ri.png" mode=""></image>
		</view> -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				circuitData:[],
				screen:{},
				houseData:[],
			}
		},
		onLoad(op) {
			this.screen=op
			// uni.setNavigationBarTitle({
			// 	title: op.title
			// });
		},
		onShow() {
			this.house();
		},
		methods:{
			//查询包裹
			toSend(id,type){
				this.screen.routeid=id;
				const t=this;
				uni.navigateTo({
					url:'./coning?type=' + t.screen.type+'&title='+t.screen.title+'&warehouseid='+id+'&routeType='+type
				})
				
			},
			//仓库
			house() {
				var data = {
					
					state:0
				};
				this.request
					.myRequest({
						url: '/api/warehouse/getWarehousesNumber',
						data: data
					})
					.then(res => {
						this.houseData = res.data.content;
					
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		// min-height: 100vh;
		padding-top: 1upx;
		margin-bottom: 200upx;
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
