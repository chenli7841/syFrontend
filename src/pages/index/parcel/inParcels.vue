<template>
	<view class="index bgColor">
		<!-- <view class="title_box">
			<view class="">
				筛选查询
			</view>
		</view> -->
		<view class="summary bfff" v-if="type == 30">
			<view class="summary-item">
				<text class="f22 c666">总单数</text>
				<text class="f32 c333 fb">{{ totalCount }}</text>
			</view>
			<view class="summary-item">
				<text class="f22 c666">总计费重量</text>
				<text class="f32 c333 fb">{{ totalWeight }}</text>
			</view>
			<view class="summary-item">
				<text class="f22 c666">总运费</text>
				<text class="f32 c333 fb">${{ totalShippingCost }}</text>
			</view>
		</view>
		<view class="list" v-if="title == '未付款' || type == 20 || type == 1 || type == 5 || type == 100 || type == '' || type == 30">
			<view class="list-li bfff" v-for="(item, index) in orderList" :key="index">
				<view class="num">
					<view class="num-left c333 f26">
						<text>舒誉运单号: {{ item.ordernumber ? item.ordernumber : '-' }}</text>
						<text @click="copyToClipboard(item.ordernumber)">复制</text>
						<text style="display: none;">{{ item.recipientname ? item.recipientname : '-' }}</text>
					</view>
					<view class="num-status f24" v-if="type == 1">{{ item.status }}</view>
					<view class="num-status f24" v-else>{{ item.stateValue }}</view>
				</view>
				<view class="count">
					<view class="countO num-left">
						
						<text class="text0 f24 c666">国内快递单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
						<view class="text0 f24 c666" @click="copyToClipboard(item.domesticnumber)">复制</view>
						<text style="display: none;" v-if="type == '' || type == 100" class="textT f24 c666">国际单号：{{ item.secondtracknumber ? item.secondtracknumber : '-' }}</text>
					</view>
					<view class="countO num-left">
						<text class="textO f24 c666">创建时间：{{ item.datecreated ? item.datecreated : '-' }}</text>
						<text v-if="type == '' || type == 100 || type == 30 || title == '未付款'" class="textT f24 c666">总运费：${{ item.shippingcost ? item.shippingcost : '-' }}</text>
					</view>
					<view class="countO num-left marginBottom10" v-if="type == 30">
						<text class="textO f24 c666">计费重量：{{ item.weightkg ? item.weightkg : '-' }}</text>
					</view>
					<view class="countO num-left marginBottom10">
						<text class="textO  f24 c666">线路：{{ getRouteName(item) }}</text>
					</view>
					<view class="countO num-left marginBottom10">
						<text class="textO f24 c666">包裹内件：</text>
						<text class="textO f24 c666">{{ item.itemNames ? item.itemNames.toString() : '-' }}</text>
					</view>
					<view class="countO num-left marginBottom10" @click="toBatchDetails(item)" v-if="type == '' || title == '未付款' || type == 20 || type == 100">
						<text class="textO f24 c666">批次号：</text>
						<text class="textO f24 capp underline">{{ item.batchname ? item.batchname : '' }}</text>
					</view>
					<view class="countO num-left marginBottom10" v-if="type != 5">
						<text class="textO f24 c666">最新状态：</text>
						<text class="textO f24 c666">{{ item.status ? item.status : '-' }}</text>
					</view>
					<view class="countO num-left marginBottom10" v-if="type != 5 && type != 100">
						<text class="textO f24 c666">取货点：</text>
						<text class="textO f24 c666">{{ item.pickUpLocationName ? item.pickUpLocationName : '-' }}</text>
					</view>
				</view>
				<view class="btn" v-if="type == 1">
					<text @click="navtoGoots(item)" class="f24 cfff btnColor">改商品信息</text>

					<text v-if="item.isfromchina == 1" @click="changeGoots(item)" class="f24 capp">改快递单号</text>
					<text @click="toLuggage(item)" class="f24 c666 bor">包裹详情</text>
					<text @click="toLoistics(item)" class="f24 c666 bor">物流详情</text>
					<text @click="del(item.id)" class="f24 bors">删除包裹</text>
				</view>
				<view class="btn" v-if="type == 20 || type == 100 || type == 5 || type == 30 || type == '' || title == '未付款'">
					<text @click="toLuggage(item)" class="f24 capp">包裹详情</text>
					<text @click="toLoistics(item)" class="f24 c666 bor">物流详情</text>
				</view>
				<!-- <view class="btn" v-if="type == 4">
					<text @click="navto()" class="f24 capp">包裹详情</text>
				</view> -->
			</view>
		</view>
		<view class="list" v-if="type == 26">
			<view class="list-li bfff" v-for="(item, index) in orderList" :key="index">
				<view class="num">
					<view class=" c333 f26">
						<text>批次号：{{ item.name ? item.name : '-' }}</text>
					</view>
				</view>
				<view class="count">
					<view class="countO">
						<text class="textO f24 c666">包裹数：{{ item.number ? item.number : '-' }}</text>
						<text class="textT f24 c666">总重量：{{ item.totalWeightKg ? item.totalWeightKg : '-' }}</text>
						<text class="textT f24 c666">总费用：{{ item.totalShippingCost ? item.totalShippingCost : '-' }}</text>
					</view>
				</view>
				<view class="btn"><text @click="toBatch(item)" class="f24 capp">查看批次详情</text></view>
			</view>
		</view>
		<!-- pop层 -->
		<u-popup v-model="isPopup" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">筛选查询</view>
				<view class="log">
					<view class="item" v-if="type == 26">
						<view class="label f28 c333">运单号</view>
						<input class="ipt f28 c333" type="text" v-model="screenBatch.ordernumber" placeholder="请输入运单号" placeholder-class="placeholder" />
					</view>
					<view class="item" v-if="type != 26">
						<view class="label f28 c333">运单号</view>
						<input class="ipt f28 c333" type="text" v-model="screen.ordernumber" placeholder="请输入运单号" placeholder-class="placeholder" />
					</view>
					<view class="item" v-if="type == 26">
						<view class="label f28 c333">国内单号</view>
						<input class="ipt f28 c333" v-model="screenBatch.aeronumber" placeholder="请输入国内单号" placeholder-class="placeholder" />
					</view>

					<view class="item" v-if="type != 26">
						<view class="label f28 c333">国内单号</view>
						<input class="ipt f28 c333" v-model="screen.domesticnumber" placeholder="请输入国内单号" placeholder-class="placeholder" />
					</view>
					<view style="display: none;" class="item" v-if="type != 26 || type == ''">
						<view class="label f28 c333">国际运单号</view>
						<input class="ipt f28 c333" type="number" v-model="screen.secondtracknumber" placeholder="请输入国际运单号" placeholder-class="placeholder" />
					</view>
					<view style="display: none;" class="item" @click="show = true" v-if="type != 26">
						<view class="label f28 c333">选择线路</view>
						<!-- <view class="ipt f28 c333"> -->
						<input class="ipt f28 c333" disabled="true" v-model="routeName" type="text" placeholder="请选择线路" placeholder-class="placeholder" />
						<u-select @confirm="confirmRote" value-name="id" label-name="name" v-model="show" mode="single-column" :list="circuitData"></u-select>
					</view>
					<view style="display: none;" class="item" v-if="type == 26">
						<view class="label f28 c333">批次号</view>
						<input class="ipt f28 c333" v-model="screenBatch.name" placeholder="请输入批次号" placeholder-class="placeholder" />
					</view>
					<view style="display: none;" class="item" v-if="type != 26">
						<view class="label f28 c333">批次号</view>
						<input class="ipt f28 c333" v-model="screen.batchname" placeholder="请输入批次号" placeholder-class="placeholder" />
					</view>
					<view style="display: none;" class="item" v-if="type != 26">
						<view class="label f28 c333">收件人</view>
						<input class="ipt f28 c333" type="text" v-model="screen.recipientname" placeholder="请输入收件人" placeholder-class="placeholder" />
					</view>
				</view>
				<view class="oneBtn">
					<view @click="search()" class="lbtn f28 cfff btnColor">搜索</view>
					<view @click="reset()" class="ubtn f28 c999 ">重置</view>
				</view>
			</view>
		</u-popup>
		<!-- pop层 -->
		<u-popup v-model="isMask" mode="center" :border-radius="20" :closeable="true" :mask-close-able="false" width="632" height="600">
			<view class="popup">
				<view class="title c333 f30">更改快递单号</view>
				<view class="info c333 f28 fb">单号：{{ domesticnumber }}</view>
				<view class="log">
					<view class="item">
						<view class="label f28 c333">国内快递单号</view>
						<input
							@blur="domesticnumberInput"
							class="ipt f28 c333"
							v-model="updateOrder.domesticnumber"
							placeholder="请输入国内快递单号"
							placeholder-class="placeholder"
						/>
					</view>
					<view class="gtn">
						<u-button shape="circle" type="primary" size="medium" :loading="loading" @click="submitUpdate()" class="lbtn f28 cfff btnColor">确认修改</u-button>
					</view>
				</view>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
		<tabbar></tabbar>
	</view>
</template>

<script>
import tabbar from '@/components/tabbar/tabbar.vue';

export default {
	components: {
		tabbar
	},
	data() {
		return {
			orderState: [
				{ name: '未匹配', id: 0 },
				{ name: '未入库', id: 1 },
				{ name: '已入库', id: 5 },
				{ name: '待发货', id: 10 },
				{ name: '已发货', id: 20 },
				{ name: "集货中", id: 21 },
				{ name: "装车发货", id: 22 },
				{ name: "已起航", id: 23 },
				{ name: "清关中", id: 24 },
				{ name: "分拣中", id: 25 },
				{ name: '已到货', id: 26 },
				{ name: '待提货', id: 30 },
				{ name: '正在派送', id: 35 },
				{ name: '已派送', id: 40 },
				{ name: '待确认', id: 60 },
				{ name: '已确认', id: 65 },
				{ name: '待退运', id: 70 },
				{ name: '已退运', id: 75 },
				{ name: '违禁品', id: 80 },
				{ name: '历史包裹', id: 100 }
			],
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			domesticnumber: '',
			loading: false,
			updateOrder: {
				domesticcarrier: '',
				domesticnumber: '',
				id: ''
			},
			expressageList: [],
			isMore: false,
			orderList: [],
			routeName: '',
			show: false,
			circuitData: [],
			value1: 1,

			domesticnumber: '',
			screen: {
				page: 1,
				size: 10,
				state: '',
				secondtracknumber: '',
				ordernumber: '',
				routeid: '',
				recipientname: '',
				batchname: '',
				domesticnumber: ''
			},
			screenBatch: {
				name: '',
				aeronumber: '',
				ordernumber: '',
				page: 1,
				size: 10,
				grouptype: 60
			},
			type: '',
			isPopup: false,
			isMask: false,
			login: {
				username: '',
				password: ''
			}
		};
	},
	computed: {
		totalCount() {
			return this.orderList.length;
		},
		totalWeight() {
			return this.orderList.reduce((sum, item) => sum + (Number(item.weightkg) || 0), 0).toFixed(2);
		},
		totalShippingCost() {
			return this.orderList.reduce((sum, item) => sum + (Number(item.shippingcost) || 0), 0).toFixed(2);
		}
	},
	onLoad(op) {
		this.type = op.type;
		this.title = op.name;

		if (op.name == '未付款') {
			this.screen.stateStr = op.type;
		} else {
			this.screen.state = op.type;
		}
		uni.setNavigationBarTitle({
			title: op.name + '包裹'
		});
	},
	onShow() {
		// document.querySelector('.uni-page-head-hd').style.display = 'none'
		this.screen.page = 1;
		this.orderList = [];
		this.screenBatch.page = 1;
		if (this.type == 26) {
			this.batch();
		} else {
			this.order();
		}

		uni.removeStorageSync('put');

		this.circuit();
	},
	onNavigationBarButtonTap() {
		this.isPopup = true;
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			if (this.type == 4) {
				this.batch();
			} else {
				this.order();
			}
		}
	},
	methods: {
		async copyToClipboard(domesticnumber) {
			await navigator.clipboard.writeText(domesticnumber);
			this.$toast('复制成功');
		},
		//批次详情
		toBatchDetails(item) {
			if (!item.bachid) {
				return false;
			}
			let items = {
				name: item.batchname,
				id: item.bachid
			};
			uni.setStorageSync('yjitem', items);
			uni.navigateTo({
				url: '../parcel/batch'
			});
		},
		//删除包裹
		del(e) {
			let t = this;
			uni.showModal({
				title: '提示',
				content: '确认删除包裹？',
				success: function(res) {
					if (res.confirm) {
						t.delBtn(e);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		//提交删除包裹
		delBtn(id) {
			this.request
				.myRequest({
					url: '/api/order/deleteNotWarehousedOrder?orderId=' + id,
					data: {},
					method: 'post'
				})
				.then(res => {
					uni.showToast({
						title: '操作成功'
					});
					this.screen.page = 1;
					this.orderList = [];
					this.order();
				});
		},
		//查看物流
		toLoistics(item) {
			uni.navigateTo({
				url: '../flight/logisticsDetails?item=' + JSON.stringify(item)
			});
		},
		//根据快递单号获取快递公司
		//UPDATE：这一步不要了
		domesticnumberInput(e) {
			//console.log(e)
			/*
			var data = e.detail.value;
			this.request
				.myRequest({
					url: '/api/expressQuery/queryExpressCompanyNumber',
					data: {
						orderNumber: data
					}
				})
				.then(res => {
					//console.log(res)
					this.updateOrder.domesticcarrier = res.data.comCode;
				});
			*/
		},
		//订单列表
		order() {
			this.status = 'loading';
			var url = this.type == '' ? '/api/order/getAllOrders' : '/api/order';
			this.request
				.myRequest({
					url: url,
					data: this.screen
				})
				.then(res => {
					if (this.type == 30 && res.data.content.length > 0) {
						console.log('待提货订单字段排查', res.data.content[0]);
					}
					var list = this.orderList.concat(res.data.content);
					list.forEach(item => {
						const matched = this.orderState.find(({ id }) => id == item.state);
						if (this.type == '') {
							// item.itemNames=item.itemNames.join(',')
						}
						if (matched) {
							item.stateValue = matched.name;
						}
					});
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
		},
		//批次列表
		batch() {
			this.status = 'loading';
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
						this.screenBatch.page = this.screenBatch.page + 1;
					} else {
						this.status = 'nomore';
					}
				})
				.catch(() => {
					this.status = 'nomore';
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
					//console.log(res.data.content);
				});
		},
		//线路名称：订单本身没有存route文本时，按routeid从线路列表里查
		getRouteName(item) {
			if (item.route) {
				return item.route;
			}
			var matched = this.circuitData.find(r => r.id === item.routeid);
			return matched ? matched.name : '-';
		},
		//选择线路
		confirmRote(e) {
			//console.log(e);
			this.screen.routeid = e[0].value;
			this.routeName = e[0].label;
		},
		//选择快递公司
		selectExpressage(e) {
			//console.log(e);
			this.updateOrder.domesticcarrier = e[0].value;
		},
		//快递公司
		expressage() {
			this.request
				.myRequest({
					url: '/api/expressCompany/getList',
					data: {}
				})
				.then(res => {
					//console.log(res);
					this.expressageList = res.data;
				});
		},
		//筛查
		search() {
			this.resets();
			this.isPopup = false;
		},
		//初始化数据
		resets() {
			this.screenBatch.page = 1;
			this.screen.page = 1;
			this.orderList = [];
			if (this.type != 26) {
				this.order();
			} else {
				this.batch();
			}
		},
		//重置
		reset() {
			if (this.type != 26) {
				this.screen.page = 1;
				this.screen.secondtracknumber = '';
				this.screen.ordernumber = '';
				this.screen.routeid = '';
				this.screen.recipientname = '';
				this.screen.batchname = '';
				this.screen.domesticnumber = '';
				this.routeName = '';
				this.orderList = [];
				this.order();
			} else {
				this.screenBatch.page = 1;
				this.screenBatch.name = '';
				this.screenBatch.aeronumber = '';
				this.screenBatch.ordernumber = '';
				this.orderList = [];
				this.batch();
			}

			this.isPopup = false;
		},
		navtoGoots(item) {
			uni.navigateTo({
				url: '../../order/modify?id=' + item.id
			});
		},
		changeInput(e, name) {
			this.login[name] = e.detail.value;
		},
		//提交修改快递单号
		submitUpdate() {
			for (let x in this.updateOrder) {
				if (x === 'domesticcarrier') continue; // UPDATE：不再设定国内快递公司了
				//console.log(this.updateOrder[x]);
				if (this.updateOrder[x] == '') {
					//console.log('pppp');
					this.$refs.uToast.show({
						title: '请填写单号信息',
						type: 'default'
					});
					return false;
				}
			}
			this.loading = true;
			this.request
				.myRequest({
					url: '/api/order/updateOrder',
					data: this.updateOrder,
					method: 'put'
				})
				.then(res => {
					this.isMask = false;
					this.reset();
					this.loading = false;

					this.$toast('操作成功');
				})
				.catch(error => {
					this.loading = false;
				});
		},
		//点击修改快递单号按钮
		changeGoots(item) {
			this.domesticnumber = item.domesticnumber;
			this.updateOrder.id = item.id;
			this.isMask = true;
			this.expressage();
		},
		navto() {
			uni.navigateTo({
				url: './picksearch'
			});
		},
		toLuggage(item) {
			uni.navigateTo({
				url: './luggage?item=' + JSON.stringify(item)
			});
		},
		toBatch(item) {
			uni.setStorageSync('yjitem', item);
			uni.navigateTo({
				url: './batch'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	margin-bottom: 300upx;
	.summary {
		width: 100%;
		margin-top: 16upx;
		padding: 30upx 0;
		box-sizing: border-box;
		display: flex;
		.summary-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			text {
				margin-bottom: 8upx;
			}
		}
	}
	.list {
		width: 100%;
		padding-top: 16upx;

		.list-li {
			width: 100%;
			margin: 0 0 16upx;
			padding: 30upx 30upx;
			box-sizing: border-box;
			.countO {
				display: flex;
				flex-wrap: wrap;
				.text0 {
					// margin-left: 10upx;
					margin-bottom: 10upx;
					flex: 1;
				}
				.textT {
					margin-left: 10upx;
					flex: 1;
					margin-bottom: 10upx;
				}
			}
		
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
			.btn {
				width: 100%;
				display: flex;
				flex-direction: row-reverse;
				padding: 20upx 0;
				flex-wrap: wrap;
				text {
					width: 180upx;
					height: 54upx;
					border: 1upx solid #5178ff;
					text-align: center;
					line-height: 48upx;
					border-radius: 10upx;
					margin-left: 20upx;
					margin-bottom: 10upx;
				}
				.bor {
					border: 1upx solid #c4c4c4;
				}
				.bors {
					border: 1px solid #ff7e33;
					color: #ff7e33;
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
					width: auto;
					height: 54upx;
					border: 1px solid #5178ff;
					align-items: center;
					text-align: center;
					padding-right: 30upx;
					box-sizing: border-box;
					background: #fff;
					view {
						flex-basis: 220upx;
						height: 68upx;
						text-align: center;
						line-height: 52upx;
						border-radius: 10upx;
						margin-left: 20upx;
						padding: 0 16upx;
						box-sizing: border-box;
					}
				}
				.bor {
					border: 1px solid #c4c4c4;
				}
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
			view {
				flex-basis: 170upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
			}
		}
	}
	.popupO {
	}
}
</style>
