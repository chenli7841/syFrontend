<template>
	<view class="index bgColor">
		<view class="top">
			<view class="cfff f26">{{ bacth.name }}</view>
			<view class="count">
				<text class="cfff f26">总重量：{{ totalWeightKg }}</text>
				<text class="cfff f26">总费用：{{ totalShippingCost }}</text>
				<text class="cfff f26">包裹数：{{ number }}</text>
			</view>
		</view>
		<view class="list">
			<view class="list-li bfff" v-for="(item, index) in orderList" :key="index">
				<view class="num">
					<view class="num-left c333 f26">
						<text>{{ item.ordernumber ? item.ordernumber : '-' }}</text>
						|
						<text>{{ item.recipientname ? item.recipientname : '-' }}</text>
					</view>
					<view class="num-status f24"></view>
				</view>
				<view class="count">
					<view class="countO">
						<text class="textO f24 c666">收费重量：{{ item.weightkg ? item.weightkg : '-' }}</text>
						<text class="textT f24 c666">国内单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
					</view>
					<view class="countO">
						<text class="textO f24 c666">总运费：{{ item.shippingcost ? item.shippingcost : '-' }}</text>
						<text class="textT f24 c666">创建时间：{{ item.datecreated ? item.datecreated : '-' }}</text>
					</view>
					<view class="countO">
						<text class="textO f24 c666">箱数：{{ item.baggagenum ? item.baggagenum : '-' }}</text>
						<text class="textT f24 c666">线路：{{ item.route ? item.route : '-' }}</text>
					</view>
					<view class="countO">
						<text class="textT f24 c666">取货点：{{item.pickUpLocationName}}</text>
					</view>
					<view class="countO">
						<text class="textT f24 c666">包裹内件：{{item.itemNames ? item.itemNames.toString() : '-' }}</text>
					</view>
				</view>
				<view class="btn"><text @click="navto(item)" class="f24 capp">查看物流</text></view>
				<!-- <view class="btn" v-if="type == 4">
					<text @click="navto()" class="f24 capp">包裹详情</text>
				</view> -->
			</view>
		</view>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			number: 0,
			totalShippingCost: 0,
			totalWeightKg: 0,
			bacth: '',
			orderList: [],
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			screen: {
				batchId: '',
				page: 1,
				size: 1000,
				state: '',
				queryType: ''
			}
		};
	},
	onLoad(e) {
		if (e.state) {
			this.screen.state = e.state;
			
		}
		this.screen.queryType = e.queryType ?e.queryType:1;
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			this.order();
		}
	},
	onShow() {
		this.screen.page = 1;
		this.orderList = [];
		this.totalShippingCost = 0;
		this.totalWeightKg = 0;
		this.number = 0;
		this.bacth = uni.getStorageSync('yjitem');
		this.screen.batchId = this.bacth.id;

		this.order();
	},
	methods: {
		//查看物流
		navto(item) {
			uni.navigateTo({
				url: '../flight/logisticsDetails?item=' + JSON.stringify(item)
			});
		},
		//订单列表
		order() {
			this.status = 'loading';
			this.request
				.myRequest({
					url: '/api/order',
					data: this.screen
				})
				.then(res => {
					// var list = this.orderList.concat(res.data.content);
					this.orderList = res.data.content;
					this.number = this.orderList.length;
					if (this.orderList.length > 0) {
						this.orderList.forEach(element => {
							this.totalShippingCost += element.shippingcost * 1;
							this.totalWeightKg += element.weightkg * 1;
						});
					}

					if (this.orderList == '') {
						this.status = 'nomore';
					}
					this.isMore = this.orderList.length < res.data.totalElements ? true : false;
					console.log(this.isMore, 'sssssss');
					if (this.isMore) {
						this.status = 'loadmore';
						this.screen.page = this.screen.page + 1;
					} else {
						this.status = 'nomore';
					}
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	.top {
		width: 100%;
		height: 180upx;
		background: #5178ff;
		padding: 40upx 30upx;
		box-sizing: border-box;
		.count {
			margin-top: 15upx;
			text:nth-child(2) {
				margin: 0 30upx;
			}
		}
	}
	.list {
		width: 100%;
		padding-top: 16upx;
		.list-li {
			width: 100%;
			margin: 16upx 0;
			padding: 30upx 30upx;
			box-sizing: border-box;
			.num {
				height: 50upx;
				display: flex;
				justify-content: space-between;
				.num-left {
					text:first-child {
						margin-right: 22upx;
					}
					text:last-child {
						margin-left: 22upx;
					}
				}
				.num-status {
					color: #ff7e33;
				}
			}
			.count {
				width: 100%;
				.countO {
					display: flex;
					height: 50upx;
					align-items: center;
					.textO {
						flex-basis: 240upx;
					}
					.textT {
						flex: 1;
					}
				}
			}
			.btn {
				width: 100%;
				display: flex;
				flex-direction: row-reverse;
				padding: 20upx 0;
				text {
					width: 132upx;
					height: 54upx;
					border: 1px solid #5178ff;
					text-align: center;
					line-height: 50upx;
					border-radius: 10upx;
					margin-left: 20upx;
				}
				.bor {
					border: 1px solid #c4c4c4;
				}
			}
		}
	}
}
</style>
