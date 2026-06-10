<template>
	<view class="content">
		<view class="header">
			<view class="userInfo">
				<image class="userImg" :src="userInfo.avatar" mode=""></image>
				<view class="username">{{ userInfo.username }}</view>
			</view>
			<view class="userInfo center">
				<view class="textBox">
					<view class="text">账户余额</view>
					<view class="texts">${{ userInfo.balance }}</view>
				</view>
				<view class="textBox">
					<view class="text">未付款</view>
					<view class="texts">{{ userInfo.unpaid }}</view>
				</view>
			</view>
			<image class="headerImg" src="../../../static/index/c10.png" mode=""></image>
		</view>
		<view class="display_between list" @click="to('/pages/index/topUp/toUp?token='+accessToken)">
			<view class="display_center">
				<image class="icon" src="../../../static/index/c12.png" mode=""></image>
				<view class="f28 c333">账户充值</view>
			</view>
			<image class="jiantou" src="../../../static/index/c13.png" mode=""></image>
		</view>
		<view class="display_between list" @click="to('/pages/index/topUp/billInfo')">
			<view class="display_center">
				<image class="icon" src="../../../static/index/c11.png" mode=""></image>
				<view class="f28 c333">账户明细</view>
			</view>
			<image class="jiantou" src="../../../static/index/c13.png" mode=""></image>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: '',
			accessToken:'',
		};
	},
	onShow() {
		this.accessToken=uni.getStorageSync('YjaccessToken');
		this.getUserInfo();
	},
	methods: {
		to(e){
			uni.navigateTo({
				url:e
			})
		},
		getUserInfo() {
		
			this.request
				.myRequest({
					url: '/api/user/getUser',
					data: ''
				})
				.then(res => {
					this.userInfo = res.data;
				})
				.catch(error => {});
		}
	}
};
</script>

<style>
page {
	background-color: #fff;
}
.content {
	height: 100vh;
	padding: 30upx;
	box-sizing: border-box;
	background-color: #fff;
}
.header {
	width: 100%;
	height: 320upx;
	position: relative;
	padding: 40upx;
	box-sizing: border-box;
}
.headerImg {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
}
.userInfo {
	display: flex;
	align-items: center;
	z-index: 22;
}
.center {
	justify-content: center;
	margin-top: 32upx;
}
.userImg {
	width: 64upx;
	height: 64upx;
	border-radius: 50%;
	z-index: 22;
}
.username {
	font-size: 24upx;
	font-family: PingFang SC;
	font-weight: 400;
	color: #ffffff;
	margin-left: 24upx;
	z-index: 22;
}
.text {
	font-size: 26upx;
	font-family: PingFang SC;
	font-weight: 400;

	color: #ffffff;
	opacity: 0.8;
	z-index: 22;
	text-align: center;
}
.texts {
	font-size: 36upx;
	font-family: PingFang SC;
	font-weight: bold;
	z-index: 22;
	color: #ffffff;
	text-align: center;
	margin-top: 10upx;
}
.list{
	padding: 30upx 0;
	box-sizing: border-box;
	border-bottom: 1upx solid #DBDBDB;
}
.textBox {
	z-index: 22;
	flex: 1;
}
.icon {
	width: 80upx;
	height: 80upx;
	margin-right: 20upx;
}
.jiantou {
	width: 10upx;
	height: 20upx;
}
</style>
