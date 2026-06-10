<template>
	<view style="padding: 40upx;">
        <view style="font-size: 40upx; font-weight: 600; margin-bottom: 20upx;">多伦多总仓地址:</view>
        <view style="margin-bottom: 20upx;">40 Konrad Crescent, Markham, ON L3R 8T4</view>
        <view style="font-size: 40upx; font-weight: 600; margin-bottom: 20upx;">仓库联系电话:</view>
        <view style="margin-bottom: 20upx;">905-616-6633</view>
        <view style="font-size: 40upx; font-weight: 600; margin-bottom: 20upx;">营业时间:</view>
        <view style="margin-bottom: 20upx;">上午10点--下午7点</view>
        <view style="margin-bottom: 20upx;">每星期日为休息日</view>
        <view style="font-size: 40upx; font-weight: 600; margin-bottom: 20upx;">如有取货，烦请提前通知，方便您更快捷取货</view>
        <view style="font-size: 40upx; font-weight: 600; margin-bottom: 20upx;">客服微信:</view>
        <image src="https://eplusfile.blob.core.windows.net/shuyu/contactus.png" mode="widthFix" style="width: 100%;"></image>
		<tabbar></tabbar>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				screen:{}
			}
		},
		onLoad(op) {
			this.screen=op
			// uni.setNavigationBarTitle({
			// 	title: op.title
			// });
		},
		onShow() {
		},
		methods:{
			//查询包裹
			toSend(id,type){
				this.screen.routeid=id;
				const t=this;
				uni.navigateTo({
					url:'./send?type=' + t.screen.type+'&title='+t.screen.title+'&routeid='+id+'&routeType='+type
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
