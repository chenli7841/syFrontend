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
									<text>{{ item.ordernumber ? item.ordernumber : '-' }}</text>
									|
									<text>{{ item.recipientname ? item.recipientname : '-' }}</text>
								</view>
								<view class="num-status f24" v-if="item.picktype == 0">货运提货</view>
								<view class="num-status f24" v-if="item.picktype == 1">商城团购提货</view>
								<view class="num-status f24" v-if="item.picktype == 2">团购线到货</view>
							</view>
							<view class="count">
								<view class="countO">
									<text class="textO f24 c666">收费重量：{{ item.weightkg ? item.weightkg : '-' }}</text>
									<text class="textO f24 c666">总运费：{{ item.shippingcost ? item.shippingcost : '-' }}</text>
								</view>
								<view class="countO">
									<text class="textT f24 c666">国内单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
								</view>
								<view class="countO">
									<text class="textT f24 c666">批次号：{{ item.loadDeliveryBatchName ? item.loadDeliveryBatchName : '-' }}</text>
								</view>
							</view>
						</view>
					</label>
				</checkbox-group>
			</view>
		</view>
		<!-- 底部操按钮 -->
		<view class="footer">
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
				<view class="xbtn f28 cfff" @click="clickDelivery">要求送货</view>
			</view>
		</view>
		<!-- pop层 -->
		<u-popup v-model="isPopup" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">筛选查询</view>
				<view class="log">
					<view class="item">
						<view class="label f28 c333">批次号</view>
						<input class="ipt f28 c333" v-model="screen.batchname" placeholder="请输入批次号" placeholder-class="placeholder" />
					</view>
					<view class="item">
						<view class="label f28 c333">运单号</view>
						<input class="ipt f28 c333" type="text" v-model="screen.ordernumber" placeholder="请输入运单号" placeholder-class="placeholder" />
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
		<!-- pop层 -->
		<u-popup v-model="stepOne" mode="center" :border-radius="20" :closeable="true" :mask-close-able="false" width="632">
			<view class="popup">
				<view class="title c333 f30">确认发货地址</view>
				<!-- .replace(/^(.{4}).*(.{3})$/,"$1***$2") -->
				<view class="info c333 f28 fb">{{ addressInfo.consignee }} {{ addressInfo.mobile }}</view>
				<view class="log">
					<view class="item">
						<view class="label f28 c333"></view>
						<view class="ipt f28 c333">{{ addressInfo.province }}{{ addressInfo.city }}{{ addressInfo.district }}{{ addressInfo.detailArea }}</view>
					</view>
					<view class="address capp f24" @click="selectAddress">选择其他地址></view>
					<view class="gtn"><view @click="clickstep(1)" class="lbtn f28 cfff btnColor">下一步</view></view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="stepTwos" mode="center" :border-radius="20" :closeable="true" :mask-close-able="false" width="632">
			<view class="popup">
				<view class="title c333 f30">确认送货费用</view>
				<view class="display_center">
					<view class="f30 c333 text_right">送货费:</view>
					<view class="f30 c333 text_left">${{ deliveryCost }}</view>
				</view>
				<view class="display_center">
					<view class="f30 c333 text_right">运费:</view>
					<view class="f30 c333 text_left">${{ carriageCost }}</view>
				</view>
				<view class="display_center">
					<view class="f30 c333 text_right">仓储费:</view>
					<view class="f30 c333 text_left">${{ storagecost }}</view>
				</view>
				<view class="display_center">
					<view class="f30 c333 text_right fb">总费用:</view>
					<view class="f30 c333 text_left fb">${{ deliveryCost + carriageCost + storagecost }}</view>
				</view>
				<view class="display_center">
					<view class="f30 c333 text_right">余额:</view>
					<view class="f30 c333 text_left">${{ userInfo.balance }}</view>
				</view>
				<view class="gtn"><u-button type="primary" class="btnColor btns" shape="circle" size="medium" :loading="loading" @click="clickstep(2)">确认送货</u-button></view>
			</view>
		</u-popup>
		<!-- pop层 -->
		<u-popup v-model="isPopup" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">筛选查询</view>
				<view class="log">
					<view class="item">
						<view class="label f28 c333">批次号</view>
						<input class="ipt f28 c333" v-model="screen.name" placeholder="请输入批次号" placeholder-class="placeholder" />
					</view>
					<view class="item">
						<view class="label f28 c333">运单号</view>
						<input class="ipt f28 c333" type="text" v-model="screen.ordernumber" placeholder="请输入运单号" placeholder-class="placeholder" />
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
		<u-toast ref="uToast" :duration="3000" />
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			deliveryCost: '',
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			loading: false,
			addressInfo: {},
			stepTwos: false,
			stepOne: false,
			selectorder: [],
			sendAddressId: '',
			allChecked: false, //是否全选
			orderIds: [],
			totalElements: '',
			orderList: [],
			show: false,
			circuitData: [],
			isfromchina: '',
			routeName: '',
			isPopup: false,
			screen: {
				page: 1,
				size: 10,
				state: 30,
				ordernumber: '',
				domesticnumber: ''
			},
			isMore: false,
			carriageCost: 0,
			storagecost: 0,
			deliveryCost: 0,
			userInfo: ''
		};
	},
	onLoad() {},
	onShow() {
		this.orderList = [];
		this.screen.page = 1;
		this.order();
		this.user();
		if (uni.getStorageSync('address')) {
			this.addressInfo = uni.getStorageSync('address');
		}
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			this.order();
		}
	},
	onNavigationBarButtonTap() {
		this.isPopup = true;
	},
	methods: {
		//用户信息
		user() {
			var userInfo = uni.getStorageSync('YjuserInfo');
			var data = {
				id: userInfo.id
			};
			this.request
				.myRequest({
					url: '/api/user',
					data: data
				})
				.then(res => {
					this.userInfo = res.data.content[0];
				});
		},
		//计算送货费用
		calculateDeliveryCost() {
			var data = {
				address: {
					id: this.addressInfo.id
				},
				orderIdlist: this.orderIds.toString()
			};
			this.request
				.myRequest({
					url: '/api/order/calculateDeliveryCost',
					data: data,
					method: 'post'
				})
				.then(res => {
					this.deliveryCost = res.data;

					this.stepTwos = true;
					this.stepOne = false;
				});
		},
		//去选择地址
		selectAddress() {
			var that = this;
			uni.navigateTo({
				url: '/pages/home/the/new?type=' + that.isfromchina
			});
		},
		//点击下一步
		clickstep(e) {
			if (e == 1) {
				this.calculateDeliveryCost();
			} else if (e == 2) {
				//确认送货
				var cost=this.deliveryCost*1 + this.carriageCost*1 + this.storagecost*1;
				if(this.userInfo.balance*1 < cost){
					this.$toast('余额不足');
					return false
				}
				this.loading = true;
				//console.log(this.orderIds);
				//console.log(this.addressInfo.id);
				//console.log(this.storagecost);
				//console.log(this.carriageCost);
				//console.log(this.deliveryCost);
				// return false
				this.request
					.myRequest({
						method: 'post',
						url: '/api/order/confirmDelivery',
						data: {
							orderIds: this.orderIds,
							sendAddressId: this.addressInfo.id,
							storageCost: this.storagecost,
							shippingCost: this.carriageCost,
							deliveryCost: this.deliveryCost
						}
					})
					.then(res => {
						this.$refs.uToast.show({
							title: '派送申请已提交'
						});
						uni.removeStorageSync('address');
						this.orderList = [];
						this.screen.page = 1;
						this.order();
						this.orderIds = [];
						this.loading = false;
						this.stepTwos = false;
						this.allChecked = false;
					});
			}
		},
		//判断是否有默认地址

		//点$attrs击送货
		clickDelivery() {
			var that = this;
			if (that.orderIds.length == 0) {
				that.$refs.uToast.show({
					title: '请勾选送货订单',
					type: 'error'
				});
				return false;
			}
			let isfromchinas=false;
			for(var i =0; i<that.selectorder.length;i++ ){
					if(that.selectorder[0].isfromchina != that.selectorder[i].isfromchina){
						isfromchinas=true;
						break
					}
			}		
			if(isfromchinas){
				that.$refs.uToast.show({
					title: '勾选的订单出现国内外混合订单，请重新勾选',
					type: 'error'
				});
				return false;
			}else{
				that.isfromchina = that.selectorder[0].isfromchina;
			}

			uni.showModal({
				title: '提示',
				content: '确认派送后不可自取，仓库将在2-3个工作日有人员进行派送，请保持电话畅通！',
				success: function(res) {
					//console.log(res)
					if (res.confirm) {
					
						that.address();
					} else if (res.cancel) {
						//console.log('用户点击取消');
					}
				},
				fail(res) {
					//console.log(res);
				}
			});
		},
		//全选
		allChoose(e) {
			//console.log(e);
			let chooseItem = e.detail.value;
			// 全选
			if (chooseItem[0] == 'all') {
				this.allChecked = true;
				var carriageCost = 0; //运费
				var storagecost = 0;
				for (let item of this.orderList) {
					let itemVal = String(item.id);
					if (!this.orderIds.includes(itemVal)) {
						this.orderIds.push(itemVal);
						carriageCost += item.shippingcost;
						storagecost += item.storagecost;
					}
				}
				this.carriageCost = carriageCost;
				this.storagecost = storagecost;
				this.selectorder = this.orderList;
				//console.log(this.orderIds);
			} else {
				// 取消全选
				this.allChecked = false;
				this.orderIds = [];
				this.selectorder = [];
			}
		},
		//多选
		checkboxChange(e) {
			this.orderIds = e.detail.value;
			if (this.orderIds.length < this.orderList.length) {
				this.allChecked = false;
			}
			var list = [];
			var carriageCost = 0; //运费
			var storagecost = 0;
			for (var i = 0; i < this.orderList.length; i++) {
				for (var j = 0; j < this.orderIds.length; j++) {
					if (this.orderList[i].id == this.orderIds[j]) {
						list.push(this.orderList[i]);
						carriageCost += this.orderList[i].shippingcost;
						storagecost += this.orderList[i].storagecost;
					}
				}
			}
			this.carriageCost = carriageCost;
			this.storagecost = storagecost;
			this.selectorder = list;
			//console.log(this.selectorder);
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
						this.stepOne = true;
						this.addressInfo = res.data.content[0];
					}

					//console.log(res.data.content);
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
					this.totalElements = res.data.totalElements;
				});
		},
		//筛查
		search() {
			this.screen.page = 1;
			this.orderList = [];
			this.order();
			this.isPopup = false;
		},
		//重置
		reset() {
			this.screen = {
				page: 1,
				size: 10,
				state: 30,
				ordernumber: '',

				domesticnumber: ''
			};
			this.orderList = [];
			this.order();
			this.isPopup = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	// min-height: 100vh;
	position: relative;
	margin-bottom: 300upx;
	.main {
		width: 100%;
		padding-top: 16upx;

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
				margin: 0upx 0 16upx;
				padding-left: 30upx;
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
						color: #666;
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
					}
				}
			}
		}
	}
	.popup {
		width: 100%;
		padding-bottom: 30upx;
		.title {
			height: 100upx;
			line-height: 100upx;
			text-align: center;
		}
		.info {
			height: 60upx;
			line-height: 60upx;
			padding-left: 20upx;
			box-sizing: border-box;
		}
		.text_left {
			text-align: left;
			padding-left: 33upx;
			box-sizing: border-box;
			margin-bottom: 18upx;
			flex: 1;
		}
		.text_right {
			text-align: right;
			padding-right: 33upx;
			box-sizing: border-box;
			margin-bottom: 18upx;
			flex: 1;
		}
		.log {
			width: 100%;
			padding: 0 20upx;
			box-sizing: border-box;
			.item {
				width: 100%;
				margin-bottom: 30upx;

				.label {
					margin: 20upx 0;
				}
				.ipt {
					height: auto;
					line-height: 40upx;
					padding-bottom: 10upx;
					border-bottom: 1px solid #dedede;

					box-sizing: border-box;
				}
			}
			.address {
				margin: 20upx 0 0;
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
				flex-basis: 170upx;
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
			margin-top: 22upx;
			view {
				flex-basis: 170upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
			}
			.btns {
				width: 170upx !important;
				margin: 0;
				padding: 0 !important;
				// height: 68upx !important;
				text-align: center !important;
				// line-height: 68upx !important;
				// border-radius: 34upx !;
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
				width: 190upx;
				flex-basis: 190upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
				background: #5178ff;
			}
		}
	}
}
</style>
