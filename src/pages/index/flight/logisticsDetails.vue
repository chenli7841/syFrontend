<template>
	<view class="index bgColor">
		<view class="header_box_l">
			<view class="header_box">
				<view class="display_between" style="margin-bottom: 22upx;">
					<view class="f26 c333">单号：{{ order.ordernumber }}</view>
					<!-- <view class="f26 capp">清关中</view> -->
				</view>
				<view class="display_between" style="margin-bottom: 22upx;">
					<view class="f26 c666">国内单号：{{ order.domesticnumber }}</view>
				</view>
				<view class="display_between">
					<view class="f26 c666">线路：{{ order.route }}</view>
				</view>
			</view>
			<view class="header_box" style="margin: 16upx 0;">
				<view class="display_between" style="margin-bottom: 22upx;"><view class="f26 c333">物流详情</view></view>
				<u-time-line>
				
					<u-time-line-item v-for="(item, index) in logisticsDatas" :key="item.datecreated">
						<template v-slot:content>
							<view>
								<view class="u-order-desc">{{item.context}}</view>
								

								<view class="u-order-time">{{ item.time }}</view>
							</view>
						</template>
					</u-time-line-item>
					
				</u-time-line>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			order: '',
			logisticsDatas: [],
			logisticsData: [],
			isfromchina: ''
		};
	},
	onLoad(e) {
		this.order = JSON.parse(e.item);
		// this.queryExpress(this.order.domesticcarrier, this.order.domesticnumber);
		this.orderstatus(this.order.ordernumber);
		//console.log(this.order);
	},
	methods: {
		//国内物流
		queryExpress(code, num) {
			var data = {
				code: code,
				num: num
			};
			this.request
				.myRequest({
					url: '/api/orderstatus/getAllOrderStatus',
					data: data
				})
				.then(res => {
					this.logisticsData = res.data.data;
				});
		},
		//批次物流
		orderstatus(orderNumber) {
			var data = {
				orderNumber: orderNumber
			};
			this.request
				.myRequest({
					url: '/api/orderstatus/getAllOrderStatus',
					data: data
				})
				.then(res => {
					this.logisticsDatas = res.data.domesticDate;
					// this.logisticsData = res.data.domesticDate;
					// this.isfromchina = res.data.isfromchina;
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	position: relative;
	.header_box_l {
		width: 100%;
		padding-top: 16upx;
		.header_box {
			width: 100%;
			background-color: #fff;
			padding: 30upx 46upx;
			box-sizing: border-box;
		}
	}
}
</style>
