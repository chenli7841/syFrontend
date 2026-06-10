<template>
	<view class="container">
		<view class="content">
			<view class="prices">
				<view class="success">
					<radio color="#5178FF" checked="true" />
					<text>充值成功</text>
				</view>
			</view>
			
				<view class="btn"><button @click="toIndexs"><text>返回首页</text></button></view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			success:3,
			trade_status:"",
			visa:"",
		};
	},
	methods: {
		toIndexs(){
			uni.reLaunch({
					url:'/pages/index/index'
			})			
		},
		toIndex(){
			uni.navigateTo({
				url:'/pages/index/topUp/toUp'
			})
		}
	},
	onLoad(op) {
		this.visa=op.visa;
		
		
	}
};
</script>

<style lang="less">
page {
	background-color: #f5f5f5;
		height: 100vh;
}
.container {
background-color: #fff;
	height: 100vh;
}
.content {
	width: 100%;
	margin: 0 auto 16upx;
	.prices {
		color: #333;
		padding: 80upx 0 20upx;
		background-color: #fff;
		border-radius: 14upx 14upx 0 0;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		.success {
			display: flex;
			align-items: center;
			justify-content: center;
			text {
				margin-left: 10upx;
				font-size: 34upx;
			}
			margin-bottom: 20upx;
		}
	}
	.small {
		padding: 30upx 0;
		background-color: #fff;
		text-align: center;
		font-size: 24upx;
		color: #333;
	}
	.btn {
		display: flex;
		justify-content: center;
		background-color: #fff;
		padding: 30upx 0 60upx;
		border-radius: 0 0 14upx 14upx;
		button {
			width: 30%;
			border-radius: 60upx;
			font-size: 24upx;
			padding: 6upx 0;
			margin: 0 30upx;
		}
		button:first-child {
			border: 2upx solid #5178FF;
			background-color: #fff;
			color: #5178FF;
		}
		button:nth-child(2) {
			border: 2upx solid #999;
			background-color: #fff;
			color: #999;
		}
		
	}
}
.moreshop {
	margin: 40upx auto 30upx;
	text-align: center;
	color: #333;
	image {
		width: 32upx;
		height: 10upx;
		margin: 0 10upx;
	}
}
.vertical {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	width: 95%;
	margin: 20upx auto;
	.vertical-item {
		flex-basis: 49%;
		display: flex;
		flex-direction: column;
		background-color: #fff;
		border-radius: 14upx;
		padding-bottom: 20upx;
		margin-bottom: 20upx;
		.name {
			color: #333;
			font-size: 28upx;
			margin: 20upx 0;
			padding: 0 20upx;
			height: 70upx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		image {
			width: 100%;
			height: 300upx;
			border-radius: 10upx;
		}
		.gives {
			display: flex;
			margin: 10upx 0 10upx 20upx;
			view {
				border: 2upx solid #ff6506;
				color: #ff4600;
				background-color: #ffefe5;
				border-radius: 6upx;
				padding: 0upx 20upx;
			}
		}
		.price {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20upx;
			view:first-child {
				color: #ff0000;
				text:first-child {
					font-size: 20upx;
				}
				text:nth-child(2) {
					font-size: 34upx;
				}
			}
			view:nth-child(2) {
				color: #999;
				font-size: 24upx;
				text:nth-child(2) {
					margin-left: 30upx;
				}
			}
		}
	}
}
</style>
