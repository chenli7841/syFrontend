<template>
	<view class="index bgColor">
		<view class="main">
			<view class="list">
				<checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in orderList" :key="index">
						<view><checkbox style="transform:scale(0.7)" :checked="orderIds.includes(String(item.id))" :value="String(item.id)" /></view>
						<view class="list-li bfff">
							<view class="num">
								<view class="num-left c333 f26">
									<text>批次号：{{ item.name }}</text>
								</view>
							</view>
							<view class="count">
								<view class="countO">
									<text class="textO f24 c666">包裹数：{{ item.number }}</text>
									<text class="textT f24 c666">总重量：{{ item.totalWeightKg }}</text>
									<text class="textT f24 c666">总费用：${{ item.totalShippingCost }}</text>
								</view>
							</view>
							<view class="btn"><text @click="toBath(item)" class="f24 capp">批次详情</text></view>
						</view>
					</label>
				</checkbox-group>
			</view>
		</view>
		<!-- 底部操按钮 -->
		<view class="footer">
			<view class="fotbtn">
				<checkbox-group @change="allChoose">
					<label>
						<checkbox value="all" style="transform:scale(0.7)" :class="{ checked: allChecked }" :checked="allChecked ? true : false"></checkbox>
						<text class="f24 c666">全选</text>
					</label>
				</checkbox-group>
				<view class="items">
					<text class="f20 c666">已选择{{ orderIds.length }}个批次</text>
				</view>
				<view class="xbtn f28 cfff" @click="deliveryOrder">送货</view>
			</view>
		</view>
		<!-- pop层 -->
		<u-popup v-model="isPopup" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">筛选查询</view>
				<view class="log">
					<view class="item ">
						<view class="label f28 c333">批次号</view>
						<input class="ipt f28 c333" type="text" v-model="screen.name" placeholder="请输入批次号" placeholder-class="placeholder" />
					</view>
					<view class="item ">
						<view class="label f28 c333">运单号</view>
						<input class="ipt f28 c333" type="text" v-model="screen.ordernumber" placeholder="请输入运单号" placeholder-class="placeholder" />
					</view>
					<view class="item ">
						<view class="label f28 c333">国内单号</view>
						<input class="ipt f28 c333" type="number" v-model="screen.domesticnumber" placeholder="请输入国内单号" placeholder-class="placeholder" />
					</view>
				</view>
				<view class="oneBtn">
					<view @click="search()" class="lbtn f28 cfff btnColor">搜索</view>
					<view @click="reset()" class="ubtn f28 c999 ">重置</view>
				</view>
			</view>
		</u-popup>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			isMore: false,
			isPopup: false,
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			allChecked: false,
			orderIds: [],
			orderList: [],
			pickUpLocationIds: '',
			screen: {
				page: 1,
				size: 10,
				name: '',
				ordernumber: '',
				aeronumber: '',
				queryType: 2,
				grouptype: 65,
				pickUpLocationId: ''
			}
		};
	},
	onLoad() {},
	onShow() {
		this.orderList = [];
		this.screen.page = 1;
		this.pickUpLocation();
	},
	onNavigationBarButtonTap() {
		this.isPopup = true;
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			this.batch();
		}
	},
	methods: {
		//批次详情
		toBath(item) {
			uni.setStorageSync('yjitem', item);
			uni.navigateTo({
				url: '/pages/index/parcel/batch?queryType=3'
			});
		},
		//筛查
		search() {
			this.screen.page = 1;
			this.orderList = [];

			this.isPopup = false;
			if (this.screen.pickUpLocationId != '') {
				this.batch();
			}
		},
		//重置
		reset() {
			this.screen = {
				page: 1,
				size: 10,
				aeronumber: '',
				ordernumber: '',
				queryType: 2,
				name: '',
				grouptype: 65,
				pickUpLocationId: this.pickUpLocationIds
			};
			this.orderList = [];
			if (this.screen.pickUpLocationId != '') {
				this.batch();
			}
			this.isPopup = false;
		},
		//确认送货

		deliveryOrder() {
			var that = this;
			if (this.orderIds == '') {
				this.$toast('请勾选需要派送的订单');
				return false;
			}
			var data = {
				batchIds: this.orderIds
			};
			uni.showModal({
				title: '提示',
				content: '确认送货？',
				success: function(res) {
					if (res.confirm) {
						that.request
							.myRequest({
								url: '/api/order/deliveryOrder',
								data: data,
								method: 'post'
							})
							.then(res => {
								that.orderIds = [];
								that.orderList = [];
								that.screen.page = 1;
								that.pickUpLocation();
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//全选
		allChoose(e) {
			//console.log(e);
			let chooseItem = e.detail.value;
			// 全选
			if (this.orderList != '') {
				if (chooseItem[0] == 'all') {
					this.allChecked = true;
					var shippingcost = 0; //派送费
					var storagecost = 0; //仓储费
					for (let item of this.orderList) {
						let itemVal = String(item.id);
						shippingcost += item.shippingcost;
						storagecost += item.storagecost;
						if (!this.orderIds.includes(itemVal)) {
							this.orderIds.push(itemVal);
						}
					}
					this.storagecost = storagecost * 1;
					this.shippingcost = shippingcost * 1;
					this.cost = storagecost * 1 + shippingcost * 1;
					this.selectorder = this.orderList;
				} else {
					// 取消全选
					this.allChecked = false;
					this.orderIds = [];
					this.selectorder = [];
				}
			} else {
				this.$toast('暂无数据');
				this.allChoose = false;
			}
		},
		//多选
		checkboxChange(e) {
			this.orderIds = e.detail.value;
			if (this.orderIds.length < this.orderList.length) {
				this.allChecked = false;
			}
			var list = [];
			var shippingcost = 0; //派送费
			var storagecost = 0; //仓储费
			for (var i = 0; i < this.orderList.length; i++) {
				for (var j = 0; j < this.orderIds.length; j++) {
					if (this.orderList[i].id == this.orderIds[j]) {
						list.push(this.orderList[i]);
						shippingcost += this.orderList[i].shippingcost;
						storagecost += this.orderList[i].storagecost;
					}
				}
			}
			this.storagecost = storagecost * 1;
			this.shippingcost = shippingcost * 1;
			this.cost = storagecost * 1 + shippingcost * 1;
			this.selectorder = list;
			//console.log(this.selectorder);
		},
		//批次列表
		batch() {
			this.status = 'loading';
			this.request
				.myRequest({
					url: '/api/batch',
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
				});
		},
		//高级账户自提点
		pickUpLocation() {
			var logistics_user = uni.getStorageSync('YjuserInfo');

			this.request
				.myRequest({
					url: '/api/pickUpLocation',
					data: {
						belongsToId: 1,
						category: 2,
						sort: ' number,asc',
						companyId:2,
					}
				})
				.then(res => {
					if (res.data.content != '') {
						var ids = [];

						for (var i = 0; i < res.data.content.length; i++) {
							ids.push(res.data.content[i].id);
						}

						this.screen.pickUpLocationId = res.data.content[0].id;
						this.pickUpLocationIds = res.data.content[0].id;
						this.batch();
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
	position: relative;
	.main {
		width: 100%;
		margin-top: 16upx;
		.list {
			width: 100%;
			.uni-list-cell {
				display: flex !important;
				align-items: baseline;
				background-color: #fff;
				margin-bottom: 16upx;
				padding: 30upx;
				box-sizing: border-box;
			}
			.list-li {
				width: 100%;
				margin: 16upx 0;
				padding: 30upx 30upx;
				box-sizing: border-box;
				.num {
					height: 50upx;
					display: flex;
					// justify-content: space-between;
					.numImg {
						flex-basis: 30upx;
						height: 30upx;
						margin-right: 20upx;
					}
					.num-left {
						flex: 1;
						text:first-child {
							margin-right: 22upx;
						}
						text:last-child {
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
						line-height: 54upx;
						border-radius: 10upx;
					}
				}
			}
		}
	}
	.footer {
		position: fixed;
		z-index: 10;
		bottom: 0;
		left: 0;
		width: 100%;
		.fotbtn {
			width: 100%;
			height: 120upx;
			background: #fff;
			padding: 0 30upx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.item {
				flex: 1;
				display: flex;
				height: 120upx;
				align-items: center;
				.numImg {
					width: 32upx;
					height: 32upx;
					position: relative;
					top: 5upx;
					margin-right: 15upx;
				}
			}
			.items {
				flex: 1;
				text-align: center;
			}
			.xbtn {
				flex-basis: 146upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
				background: #5178ff;
			}
		}
	}
	.popup {
		width: 100%;
		.title {
			height: 100upx;
			line-height: 100upx;
			text-align: center;
		}
		.info {
			height: 60upx;
			line-height: 60upx;
			padding-left: 30upx;
			box-sizing: border-box;
		}
		.log {
			width: 88%;
			margin: 20upx auto;
			.item {
				width: 100%;
				margin-bottom: 30upx;

				.label {
					margin: 20upx 0;
				}
				.ipt {
					height: 60upx;
					line-height: 60upx;
					border: 1px solid #dedede;
					border-radius: 10upx;
					padding-left: 20upx;
					box-sizing: border-box;
				}
			}
		}
		.oneBtn {
			width: 100%;
			height: 130upx;
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			text-align: center;
			padding-right: 30upx;
			box-sizing: border-box;
			background: #fff;
			view {
				flex-basis: 220upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
			}
			.ubtn {
				border: 1px solid #d1d1d1;
			}
			.lbtn {
				margin-left: 20upx;
			}
		}
		.gtn {
			display: flex;
			justify-content: center;
			align-items: center;
			view {
				flex-basis: 170upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
			}
		}
	}
}
</style>
