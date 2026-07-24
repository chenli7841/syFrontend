<template>
	<view class="index bgColor">
		<view class="top">
			<view class="top-left f32 c333">账单明细</view>
			<!-- <view class="top-right cfff btnColor f20">
				导出数据
			</view> -->
		</view>
		<view class="list">
			<view class="list-li bfff" v-for="(item, index) in orderList" :key="index">
				<view class="num">
					<view class="c333 f26">
						<text>日期：{{ item.date }}</text>
					</view>
					<view class="num-status c333 f24">金额：{{ item.fromuserdisplayamount ? item.fromuserdisplayamount : item.amount }}</view>
				</view>
				<view class="count">
					<view class="countT mb5" @click="toOrder(item)">
						<text class="textO f24 c666">运单号：</text>
						<text class="textT f24 capp underline">{{ item.orderNumber }}</text>
					</view>
					<view class="countT mb5" @click="toBatch(item)">
						<text class="textO f24 c666">批次号：</text>
						<text class="textT f24 capp underline">{{ item.batchName }}</text>
					</view>

					<view class="countO">
						<view class="textO f24 c666">用户：{{ item.userName }}</view>
						<view class="textT f24 c666">
							类别：
							<text v-if="item.type == 0">运单支付</text>
							<text v-if="item.type == 1">存款</text>
							<text v-if="item.type == 2">余额调整</text>
							<text v-if="item.type == 3">活动充值</text>
							<text v-if="item.type == 5">给自己充值</text>
							<text v-if="item.type == 6">给他人充值</text>
							<text v-if="item.type == 7">收取运费</text>
							<text v-if="item.type == 8">运费返利</text>
							<text v-if="item.type == 9">仓库使用费</text>
							<text v-if="item.type == 10">批次扣款</text>
							<text v-if="item.type == 11">结算调整</text>
							<text v-if="item.type == 12">优惠券</text>
						</view>
						<view class="textT f24 c666">方式：{{ item.method }}</view>
					</view>
					<view class="countT mb5" v-if="item.couponnumber">
						<text class="textO f24 c666">优惠券码：</text>
						<text class="textT f24 c666">{{ item.couponnumber ? item.couponnumber:'-' }}</text>
					</view>
					<view class="countO">
						<text class="textT f24 c666">所属销售代表：{{ item.belongsToUserName }}</text>
						
						
					</view>
					<view class="countT mb5">
						<text v-if="YjuserInfo.id == item.touserid && YjuserInfo.id != item.fromuserid" class="textT f24 c666">当前余额：{{item.tousercurrentbalance }}</text>
						<text v-if="YjuserInfo.id == item.fromuserid && YjuserInfo.id != item.touserid" class="textT f24 c666">当前余额：{{item.fromusercurrentbalance }}</text>
						<text v-if="YjuserInfo.id == item.fromuserid && YjuserInfo.id == item.touserid" class="textT f24 c666">当前余额：{{item.fromusercurrentbalance }}</text>
					</view>
					<view class="countT mb5">
						<text class="textT f24 c666">备注：{{ item.notes }}</text>
					</view>
					
				</view>
			</view>
		</view>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			Billtype: [
				{
					label: '运单支付 ',
					value: 0
				},
				{
					label: '余额调整',
					value: 1
				},
				{
					label: '活动充值',
					value: 2
				},
				{
					label: '理赔款项',
					value: 3
				},
				{
					label: '给自己充值',
					value: 5
				},
				{
					label: '给他人充值',
					value: 6
				},
				{
					label: '收取运费',
					value: 7
				},
				{
					label: '运费返利',
					value: 8
				},
				{
					label: '仓库使用费',
					value: 9
				},
				{
					label: '批次扣款',
					value: 10
				},
				{
					label: '结算调整',
					value: 11
				},
				{
					code: 12,
					name: '优惠券'
				}
			],
			orderList: [],
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			screen: {
				page: 1,
				size: 20
			},
			YjuserInfo:{},
		};
	},
	onLoad() {},
	onShow() {
		this.YjuserInfo=uni.getStorageSync('YjuserInfo');
		console.log(uni.getStorageSync('YjuserInfo'))
		this.screen.page = 1;
		this.orderList = [];
		this.order();
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			this.order();
		}
	},
	methods: {
		//包裹详情
		toOrder(item) {
			if(!item.orderid){
				return false
			}
			var items={
				id:item.orderid,
				
			}
			uni.navigateTo({
				url: '../parcel/luggage?item=' + JSON.stringify(items)
			});
		},
		//批次详情
		toBatch(item) {
			if(!item.batchid){
				return false
			}
			let items={
				name:item.batchName,
				id:item.batchid
			}
			uni.setStorageSync('yjitem',items)
			uni.navigateTo({
				url: '../parcel/batch?queryType=3'
			});
		},
		//订单列表
		order() {
			this.status = 'loading';
			this.request
				.myRequest({
					url: '/api/balancehistory',
					data: this.screen
				})
				.then(res => {
					var list = this.orderList.concat(res.data.content);
					this.orderList = list;
					if (this.orderList == '') {
						this.status = 'nomore';
					}
					this.isMore = list.length < res.data.totalElements ? true : false;
					if (this.isMore) {
						this.status = 'loadmore';
						this.screen.page = this.screen.page + 1;
					} else {
						this.status = 'nomore';
					}
				})
				.catch(() => {
					this.status = 'nomore';
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	.underline{
		text-decoration: underline;
	}
	.mb5{
		margin-bottom: 5upx;
	}
	.top {
		width: 100%;
		padding: 0 30upx 0 40upx;
		box-sizing: border-box;
		background: #f1f3f6;
		height: 104upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.top-right {
			flex-basis: 148upx;
			height: 48upx;
			text-align: center;
			line-height: 48upx;
			border-radius: 10upx;
		}
	}
	.list {
		width: 100%;
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
				}
			}
			.count {
				width: 100%;
				.countO {
					display: flex;
					height: auto;
					align-items: flex-end;
					margin-bottom: 10upx;
					.textO {
						width: 33.33%;
						// flex-basis: 33.33%upx;
					}
					.textT {
						width: 33.33%;
						flex: 1;
						// flex-basis: 33.33%upx;
					}
				}
			}
		}
	}
}
</style>
