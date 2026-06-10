<template>
	<view class="tabbar">
		<view class="tabbar_list" @click="nato('/pages/index/index')">
			<image class="img" src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-homepage.svg" mode=""></image>

			<view class="text">首页</view>
		</view>
		<view class="tabbar_list"  @click="nato('/pages/order/order')">
			<image class="img" style="margin-top: -30px;width: 64px !important;height: 64px !important;" src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-createorder-bottom.svg" mode=""></image>
		
			<view class="text">创建运单</view>
		</view>
		<view class="tabbar_list"  @click="nato('/pages/home/home')">
			<image class="img"src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-me.svg" mode=""></image>
		
			<view class="text">我的</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					pagePath: 'pages/index/index',
					iconPath: 'https://eplusfile.blob.core.windows.net/shuyu/homeicon-homepage.svg',
					selectedIconPath: 'https://eplusfile.blob.core.windows.net/shuyu/homeicon-homepage.svg',
					text: '首页'
				},
				{
					pagePath: 'pages/order/order',
					iconPath: 'https://eplusfile.blob.core.windows.net/shuyu/homeicon-createorder-bottom.svg',
					selectedIconPath: 'https://eplusfile.blob.core.windows.net/shuyu/homeicon-createorder-bottom.svg',
					text: '创建运单'
				},
				{
					pagePath: 'pages/home/home',
					iconPath: 'https://eplusfile.blob.core.windows.net/shuyu/homeicon-me.svg',
					selectedIconPath: 'https://eplusfile.blob.core.windows.net/shuyu/homeicon-me.svg',
					text: '我的'
				}
			]
		};
	},
	methods:{
		nato(e){			
			uni.switchTab({
				url:e,
				complete:(e=>{
				
				})
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.tabbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 5upx 0;
	box-sizing: border-box;
	// border-top: 1upx solid rgba(0, 0, 0, 0.33);
			background-color: #fff;
	box-sizing: border-box;
	.tabbar_list {
		width: 33.33%;
		text-align: center;

	padding-top: 5px;
	box-sizing: border-box;
	
		
		.text{
			font-size: 10px;
			color: #999999;
			    line-height: normal;
			    // margin-top: 3px;
		}
		.img {
			width: 24px;
			height: 24px;
		}
	}
}
</style>
