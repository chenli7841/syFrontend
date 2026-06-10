<template>
	<view class="index bgColor">
		<image style="width: 100%;" src="https://eplusfile.blob.core.windows.net/shuyu/system/2/images/InsurancePolicyImageURL.png" mode="widthFix"></image>
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
			
		}
	}
</script>

<style lang="scss" scoped>
</style>
