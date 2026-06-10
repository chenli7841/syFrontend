<template>
	<view class="index bgColor">
	<!-- 	<u-tabs :list="circuitData" style="margin-top: 16upx;" :is-scroll="true" :current="currents" @change="changeCurrent"></u-tabs> -->

		<!-- //待发货 -->
		<view class="main">
			<!-- 待发货 -->
			<view class="list" v-if="type == 10">
				<checkbox-group @change="checkboxChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in orderList" :key="index">
						<view><checkbox style="transform:scale(0.7)" :checked="orderIds.includes(String(item.id))" :value="String(item.id)" /></view>
						<view class="list-li bfff">
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
									<text class="textT f24 c666">国内单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
								</view>
								<view class="countO">
									<text class="textT f24 c666">创建时间：{{ item.datecreated ? item.datecreated : '-' }}</text>
								</view>
							</view>
							<view class="countO num-left">
								<text class="textO f24 c666">包裹内件：</text>
								<text class="textO f24 c666">{{ item.itemNames ? item.itemNames.toString() : '-' }}</text>
							</view>
							
							<view class="countO num-left">
								<text class="textO f24 c666">包裹状态：</text>
								<text class="textO f24 c666">{{ type == 10 ? '待发货':'-' }}</text>
							</view>
							<view class="btn">
								<text @click="toLuggage(item)" class="f24 capp">包裹详情</text>
								<text @click="kefu(item)" class="f24 c666 borDb bor">联系客服</text>
							</view>
						</view>
					</label>
				</checkbox-group>
			</view>
			<view class="list" v-if="type == 60">
				<view class="list-lii bfff" v-if="routeType == 1 || routeType == 4" v-for="(item, index) in orderList" :key="index">
					<view class="num">
						<view class="num-left c333 f26 fb">
							<text>{{ item.ordernumber ? item.ordernumber : '-' }}</text>
|
							<text>{{ item.recipientname ? item.recipientname : '-' }}</text> 
						</view>
						<view class="num-status f24"></view>
					</view>
					<view class="count">
						<view class="countO">
							<text class="textT f24 c666">国内单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
						</view>
						<view class="countO">
							<text class="textT f24 c666">创建时间：{{ item.datecreated ? item.datecreated : '-' }}</text>
						</view>
						<view class="countO">
							<text v-if="!isBatch" class="textO f24 c666">运费：{{ item.shippingcost ? item.shippingcost : '0' }}</text>
						</view>
						
						
						<view class="countO">
							<text class="textO f24 c666">原因：{{ item.actionreason }}</text>
						</view>
						<view class="countO num-left">
							<text class="textO f24 c666">包裹内件：{{ item.itemNames ? item.itemNames.toString() : '-' }}</text>
						
						</view>
						
						<view class="countO num-left">
							<text class="textO f24 c666">包裹状态：待确认</text>
							
						</view>
					</view>
					<view class="btn">
						<text @click="handleClick(item, 1)" class="f24 cfff btnColor">去确认</text>
						<text @click="toLuggage(item)" class="f24 capp">包裹详情</text>
						<text @click="toLoistics(item)" class="f24 capp">物流详情</text>
						<text @click="kefu(item)" class="f24 c666 borDb bor">联系客服</text>
					</view>
				</view>
				<view class="list-lii bfff" v-if="routeType == 2 || routeType == 3" v-for="(item, index) in orderList" :key="index">
					<view class="num">
						<view class="num-left c333 f26 fb">
							<text>{{ item.name ? item.name : '-' }}</text>

							<text></text>
						</view>
						<view class="num-status f24"></view>
					</view>
					<view class="count">
						<view class="countO">
							<text class="textO f24 c666">包裹数：{{ item.number ? item.number : '0' }}</text>
							<text class="textO f24 c666">收费重量：{{ item.paidweightkg ? item.paidweightkg : '0' }}</text>
							<text class="textO f24 c666">运费：{{ item.totalexpense ? item.totalexpense : '0' }}</text>
						</view>
						<view class="countO">
							<text class="textT f24 c666">国际快递单号：{{ item.intnumber ? item.intnumber : '-' }}</text>
						</view>
						<view class="countO">
							<text class="textT f24 c666">国际快递公司：{{ item.intcarrier ? item.intcarrier : '-' }}</text>
						</view>
					</view>
					<view class="btn">
						<text @click="handleClick(item, 2)" class="f24 cfff btnColor">去确认</text>
						<text @click="toBath(item)" class="f24 capp">批次详情</text>
						<text @click="kefu(item)" class="f24 c666 borDb bor">联系客服</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 待发货底部操按钮 -->
		<view class="footer" v-if="type == 10">
			<view class="fotbtn">
				<view class="item">
					<checkbox-group @change="allChoose">
						<label>
							<checkbox value="all" style="transform:scale(0.7)" :class="{ checked: allChecked }" :checked="allChecked ? true : false"></checkbox>
							<text class="f24 c666">全选</text>
						</label>
					</checkbox-group>
				</view>
				<view class="items">
					<text class="f20 c666">共{{ totalElements }}单，</text>
					<text class="f20 capp">已选择{{ orderIds.length }}单</text>
				</view>
				<u-button type="primary" class="xbtn f28 cfff btnColor " shape="circle" size="medium" @click="toChange">打包发货</u-button>
				<!-- <view class="xbtn f28 cfff" @click="toChange">确认送货</view> -->
			</view>
		</view>
		<!-- pop层 -->
		<u-popup v-model="isMask" mode="center" :border-radius="20" :closeable="true" :mask-close-able="false" width="632" height="auto">
			<view class="popup">
				<view class="title c333 f30">确认发货地址</view>
				<!-- .replace(/^(.{4}).*(.{3})$/,"$1***$2") -->
				<view class="info c333 f28 fb">{{ addressInfo.consignee }} {{ addressInfo.mobile }}</view>
				<view class="log">
					<view class="item">
						<view class="label f28 c333"></view>
						<view class="ipts f28 c333 borDb">{{ addressInfo.province }}{{ addressInfo.city }}{{ addressInfo.district }}{{ addressInfo.detailArea }}</view>
					</view>
					<view class="address capp f24" @click="selectAddress">选择其他地址></view>
					<view class="gtn"><u-button type="primary" class="btnColor btns" shape="circle" size="medium" :loading="loading" @click="submitGoods">确认</u-button></view>
				</view>
			</view>
		</u-popup>
		<!-- pop层 -->
		<u-popup v-model="isPopup" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">筛选查询</view>
				<view class="log">
					<view class="item">
						<view class="label f28 c333">运单号</view>
						<input class="ipt f28 c333 border" type="text" v-model="screen.ordernumber" placeholder="请输入运单号" placeholder-class="placeholder" />
					</view>
					<view class="item">
						<view class="label f28 c333">国内单号</view>
						<input class="ipt f28 c333" v-model="screen.domesticnumber" placeholder="请输入国内单号" placeholder-class="placeholder" />
					</view>
				</view>
				<view class="oneBtn">
					<view @click="search()" class="lbtn f28 cfff btnColor">搜索</view>
					<view @click="reset()" class="ubtn f28 c999 ">重置</view>
				</view>
			</view>
		</u-popup>
		<u-loadmore :status="status" style="margin-top: 150upx;" :icon-type="iconType" :load-text="loadText" />
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			isBatch: false,
			currents: 0,
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			loading: false,
			isfromchina: '',
			totalElements: '',
			sendAddressId: '',
			addressInfo: {},
			orderIds: [],
			allChecked: false,
			description: 'dianhua',
			tips: true,
			isPopup: false,
			routeType: '',
			orderList: [],
			current: 0,
			type: 1,
			isMask: false,
			screen: {
				page: 1,
				size: 10,
				domesticnumber: '',
				ordernumber: '',
				routeid: '',
				state: ''
			},
			screenBatch: {
				page: 1,
				size: 10,
				domesticnumber: '',
				ordernumber: '',
				routeid: '',
				grouptype: 25
			},
			circuitData: []
		};
	},
	onNavigationBarButtonTap() {
		this.isPopup = true;
	},
	onLoad(op) {
		console.log(op);
		this.type = op.type;
		this.screen.state = op.type;
		this.screen.routeid=op.routeid;
		this.screenBatch.routeid=op.routeid;
		this.routeType=op.routeType;
		this.isfromchina=op.type == 4 ? 0 : 1;
		uni.setNavigationBarTitle({
			title: op.title
		});
	},
	onShow() {
		if (uni.getStorageSync('address')) {
			this.addressInfo = uni.getStorageSync('address');
			this.sendAddressId = uni.getStorageSync('address').id;
		}
		this.currents = 0;
		this.orderList = [];
		this.screen.page = 1;
		if (this.type == 60) {
			if (this.routeType == 1 || this.routeType == 4) {
				this.order();
			} else if (this.routeType == 2 || this.routeType == 3) {
				this.batch();
			}
		} else {
			this.order();
		}
		// this.circuit();
	},
	methods: {
		//查看物流
		toLoistics(item) {
			uni.navigateTo({
				url: '../flight/logisticsDetails?item=' + JSON.stringify(item)
			});
		},
		//点击联系客服
		kefu(e) {
			var data = {
				page: 1,
				size: 1,
				id: e.routeid
			};
			this.request
				.myRequest({
					url: '/api/route',
					data: data
				})
				.then(res => {
					//console.log(res);
					var serviceData = res.data.content[0].supportWechat;
					var serviceDataInfo = res.data.content[0].description;

					uni.showModal({
						title: serviceData,
						content: serviceDataInfo,
						showCancel: false,
						confirmText: '联系客服',
						success: function(res) {
							if (res.confirm) {
								//console.log('用户点击确定');
								uni.makePhoneCall({
									phoneNumber: serviceData //仅为示例
								});
							} else if (res.cancel) {
								//console.log('用户点击取消');
							}
						}
					});
				});
		},
		// 选择其他地址
		selectAddress() {
			uni.navigateTo({
				url: '/pages/home/the/new?type=' + this.isfromchina
			});
		},

		//包裹详情
		toLuggage(item) {
			uni.navigateTo({
				url: '/pages/index/parcel/luggage?item=' + JSON.stringify(item)
			});
		},
		//确认送货
		submitGoods() {
			this.loading = true;
			this.request
				.myRequest({
					url: '/api/order/confirmAddress',
					method: 'post',
					data: {
						orderIds: this.orderIds,
						sendAddressId: this.sendAddressId,
						routeId: this.screen.routeid
					}
				})
				.then(res => {
					if (res.statusCode == 200 || res.statusCode == 201) {
						this.isMask = false;
						this.loading = false;
						this.orderIds = [];
						setTimeout(() => {
							this.$toast('操作成功');
							this.reset();
						}, 1500);
					} else {
						this.isMask = false;
						this.loading = false;
					}
				}).catch((res)=>{
						this.isMask = false;
					this.loading = false;
				})
		},
		//多选
		checkboxChange(e) {
			this.orderIds = e.detail.value;
			if (this.orderIds.length < this.orderList.length) {
				this.allChecked = false;
			}
		},
		//全选
		allChoose(e) {
			//console.log(e);
			let chooseItem = e.detail.value;
			// 全选
			if (chooseItem[0] == 'all') {
				this.allChecked = true;
				for (let item of this.orderList) {
					let itemVal = String(item.id);
					if (!this.orderIds.includes(itemVal)) {
						this.orderIds.push(itemVal);
					}
				}
			} else {
				// 取消全选
				this.allChecked = false;
				this.orderIds = [];
			}
		},
		//地址
		address() {
			this.request
				.myRequest({
					url: '/api/sysShippingAddress',
					data: {
						addresstype: this.isfromchina,
						isDefault: true
					}
				})
				.then(res => {
					if (res.data.content == '') {
						this.$refs.uToast.show({
							title: '请到个人中心设置默认地址',
							type: 'error',
							url: '/pages/home/the/goots'
						});
						return false;
					} else {
						// return false
						this.isMask = true;
						this.addressInfo = res.data.content[0];
						this.sendAddressId = res.data.content[0].id;
					}

					//console.log(res.data.content);
				});
		},
		// 线路
		circuit() {
			var data = {
				page: 1,
				size: 100
			};
			this.request
				.myRequest({
					url: '/api/route',
					data: data
				})
				.then(res => {
					this.circuitData = res.data.content;
					this.current = res.data.content[0].id;

					this.screen.routeid = res.data.content[0].id;
					this.routeType = res.data.content[0].type;
					this.isfromchina = res.data.content[0].isfromchina;
					if (this.type == 25) {
						if (res.data.content[0].type == 1 || res.data.content[0].type == 4) {
							this.order();
						} else if (res.data.content[0].type == 2 || res.data.content[0].type == 3) {
							this.batch();
						}
					} else {
						this.order();
					}
				});
		},
		//订单列表
		order() {
			this.status = 'loading';
			this.isBatch = false;
			this.request
				.myRequest({
					url: '/api/order',
					data: this.screen
				})
				.then(res => {
					var list = this.orderList.concat(res.data.content);
					this.orderList = list;
					if (this.orderList == '') {
						this.status = 'nomore';
					}
					console.log(this.orderList,'列表')
					this.isMore = list.length < res.data.totalElements ? true : false;
					if (this.isMore) {
						this.status = 'loadmore';
						this.screen.page = this.screen.page + 1;
					} else {
						this.status = 'nomore';
					}
					this.totalElements = res.data.totalElements;
				});
		},
		//批次列表
		batch() {
			this.status = 'loading';
			this.isBatch = true;
			this.request
				.myRequest({
					url: '/api/batch',
					data: this.screenBatch
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
		//筛查
		search() {
			this.screen.page = 1;
			this.orderList = [];
			if (this.type == 60) {
				if (this.routeType == 1 || this.routeType == 4) {
					this.order();
				} else if (this.routeType == 2 || this.routeType == 3) {
					this.batch();
				}
			} else if (this.type == 10) {
				this.order();
			}
			this.isPopup = false;
		},
		//重置
		reset() {
			this.screen.domesticnumber='';
			this.screen.ordernumber='';
			this.screen.page=1;
			this.screen.size=10;
			// this.screen = {
			// 	page: 1,
			// 	size: 10,
			// 	domesticnumber: '',
			// 	ordernumber: '',
			// 	routeid: this.current,
			// 	state: this.type
			// };
			this.screenBatch.domesticnumber='';
				this.screenBatch.ordernumber='';
				this.screenBatch.page=1;
			// this.screenBatch = {
			// 	page: 1,
			// 	size: 10,
			// 	domesticnumber: '',
			// 	ordernumber: '',
			// 	routeid: this.current,
			// 	grouptype: 25
			// };
			this.orderList = [];
			if (this.type == 60) {
				if (this.routeType == 1 || this.routeType == 4) {
					this.order();
				} else if (this.routeType == 2 || this.routeType == 3) {
					this.batch();
				}
			} else if (this.type == 10) {
				this.order();
			}
			this.isPopup = false;
		},
		//去确认
		handleClick(item, e) {
			var url = e == 1 ? '/api/order/confirmOrder' : '/api/order/confirmBatch';
			if (e == 1) {
				var data = {
					orderId: item.id
				};
			} else {
				var data = {
					batchId: item.id
				};
			}
			var type=e;
			var that = this;
			uni.showModal({
				title: '提示',
				content: '是否确认包裹信息？',
				success: function(res) {
					if (res.confirm) {
						that.request
							.myRequest({
								url: url,
								method: 'get',
								data: data
							})
							.then(res => {
								uni.showToast({
									title: '包裹已确认',
									icon: 'none',
									duration: 1500
								});
								that.screen.page = 1;
								that.orderList = [];
								if (type == 1) {
									that.order();
								} else {
									that.batch();
								}
							});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//批次详情
		toBath(item) {
			uni.setStorageSync('yjitem', item);
			uni.navigateTo({
				url: '/pages/index/parcel/batch?state=60'
			});
		},

		toChange() {
			if (this.orderIds == '') {
				this.$toast('请选择发货订单');
				return false;
			}
			this.address();
		},
		//点击线路
		changeCurrent(index) {
			this.orderIds = [];
			this.allChecked = false;
			this.currents = index;
			this.current = this.circuitData[index].id;
			this.routeType = this.circuitData[index].type;
			this.isfromchina = this.circuitData[index].type == 4 ? 0 : 1;
			this.orderList = [];
			this.screen.page = 1;
			this.reset();
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	position: relative;
	.nav {
		width: 100%;
		position: fixed;
		top: 88upx;
		left: 0;
		z-index: 10;
		// height: 1upx;
		// margin: 20upx 0;
		.scoll {
			overflow: hidden;
			white-space: nowrap;
			padding-left: 20upx;
			box-sizing: border-box;
			height: 120upx;

			.typea {
				display: inline-block;
				width: auto;
				margin-right: 40upx;
				.nav-li {
					width: auto;
					height: 120upx;
					line-height: 120upx;
					position: relative;

					// text:first-child{
					// 	display: inline-block;
					// 	text-align: center;
					// 	width: auto;
					// 	height: 60upx;
					// 	position: absolute;
					// 	top: 0;
					//     left: 0;
					// 	right: 0;
					// 	bottom: 0;
					// 	margin: auto;
					// }
					// text:nth-child(2){
					// 	position: absolute;
					// 	right: 0;
					// 	top: -13upx;
					// 	display: inline-block;
					// 	border-radius: 50%;
					// 	width: 26upx;
					// 	height: 26upx;
					// 	text-align: center;
					// 	line-height: 26upx;
					// }
				}
			}
		}
	}
	.main {
		width: 100%;
		position: relative;
		// top: 140upx;
		.list {
			width: 100%;
			margin-bottom: 300upx;
			.uni-list-cell {
				display: flex !important;
				align-items: baseline;
				background-color: #fff;
				margin-top: 16upx;
				padding: 30upx;
				box-sizing: border-box;
			}
			.list-li {
				width: 100%;

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
						width: 200upx;
						height: 54upx;
						border: 1px solid #5178ff;
						text-align: center;
						line-height: 49upx;
						border-radius: 10upx;
						margin-left: 20upx;
					}
					.bor {
						border: 1px solid #c4c4c4;
					}
				}
			}
			.list-lii {
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
						width: 180upx;
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
			}
			.xbtn {
				flex-basis: 190upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
				background: #5178ff;
				margin: 0 !important;
				padding: 0 !important;
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
			width: 100%;
			padding: 20upx 20upx;
			box-sizing: border-box;
			.item {
				width: 100%;
				margin-bottom: 30upx;

				.label {
					margin: 20upx 0;
				}
				.ipts {
					height: auto;
					line-height: 60upx;
					box-sizing: border-box;
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
			.address {
				margin: 20upx 0;
				text-align: center;
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
