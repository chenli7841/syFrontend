<template>
	<view class="index bgColor">
		<view class="list">
			<view class="list-li bfff" :key="index" v-for="(item, index) in orderList">
				<view class="num">
					<view class="num-left c333 f26">
						<text>{{ item.ordernumber }}</text>
						|
						<text>{{ item.recipientname }}</text>
					</view>
					<!-- <view >正在派送</view> -->
					<view class="num-status f24" v-if="item.state == 0">未匹配</view>
					<view class="num-status f24" v-if="item.state == 1">未入库</view>
					<view class="num-status f24" v-if="item.state == 5">已入库</view>
					<view class="num-status f24" v-if="item.state == 10">待发货</view>
					<view class="num-status f24" v-if="item.state == 20">已发货</view>
					<view class="num-status f24" v-if="item.state == 25">仓库收</view>
					<view class="num-status f24" v-if="item.state == 26">已到货</view>
					<view class="num-status f24" v-if="item.state == 30">待取货</view>
					<view class="num-status f24" v-if="item.state == 35">正在派送</view>
					<view class="num-status f24" v-if="item.state == 40">已派送</view>
					<view class="num-status f24" v-if="item.state == 60">待确认</view>
					<view class="num-status f24" v-if="item.state == 65">已确认</view>
					<view class="num-status f24" v-if="item.state == 70">待退运</view>
					<view class="num-status f24" v-if="item.state == 75">已退运</view>
					<view class="num-status f24" v-if="item.state == 80">违禁品</view>
					<view class="num-status f24" v-if="item.state == 100">历史包裹</view>
				</view>
				<view class="count">
					<view class="countO">
						<text class="textO f24 c666">国内单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
						<text class="textT f24 c666">收费重量：{{ item.weightkg ? item.weightkg : '-' }}</text>
						
					</view>
					<view class="countO">
						<text class="textO f24 c666">总运费：{{ item.shippingcost ? item.shippingcost : '-' }}</text>
						<text class="textT f24 c666">创建时间：{{ item.datecreated ? item.datecreated : '-' }}</text>
					</view>
					<view class="countO num-left">
						<text class="textO f24 c666">线路：{{ item.route ? item.route : '-' }}</text>
					</view>
					<view class="countO num-left">
						<text class="textO f24 c666">包裹内件：{{ item.itemNames ? item.itemNames.toString() : '-' }}</text>
					
					</view>
					<view class="countO num-left">
						<text class="textO f24 c666">批次号：{{ item.batchname ? item.batchname : '' }}</text>
						
					</view>
					<view class="countO num-left">
						<text class="textO f24 c666">最新状态：{{ item.status ? item.status : '-' }}</text>
						
					</view>
					<view class="countO num-left">
						<text class="textO f24 c666">取货点：{{ item.pickUpLocationName ? item.pickUpLocationName : '-' }}</text>
					
					</view>
				</view>
				<view class="btn"><text @click="toLuggage(item)" class="f24  capp">包裹详情</text>
				<text @click="toLoistics(item)" class="f24 borsf c666 bor">物流详情</text>
				</view>
			</view>
		</view>
		<!-- pop层 -->
		<u-popup v-model="isPopup" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">筛选查询</view>
				<view class="log">
					<view class="item">
						<view class="label f28 c333">舒誉运单号</view>
						<input class="ipt f28 c333" type="text" v-model="screen.ordernumber" placeholder="请输入舒誉运单号" placeholder-class="placeholder" />
					</view>
	
		
					<view class="item">
						<view class="label f28 c333">国内快递单号</view>
						<input class="ipt f28 c333" v-model="screen.domesticnumber" placeholder="请输入国内快递单号" placeholder-class="placeholder" />
					</view>
					<view class="item">
						<view class="label f28 c333">国际运单号</view>
						<input class="ipt f28 c333" type="number" v-model="screen.secondtracknumber" placeholder="请输入国际运单号" placeholder-class="placeholder" />
					</view>
					<view class="item" @click="show = true">
						<view class="label f28 c333">选择线路</view>
						<!-- <view class="ipt f28 c333"> -->
						<input class="ipt f28 c333" disabled="true" v-model="routeName" type="text" placeholder="请选择线路" placeholder-class="placeholder" />
						<u-select @confirm="confirmRote" value-name="id" label-name="name" v-model="show" mode="single-column" :list="circuitData"></u-select>
					</view>

					<view class="item">
						<view class="label f28 c333">批次号</view>
						<input class="ipt f28 c333" v-model="screen.batchname" placeholder="请输入批次号" placeholder-class="placeholder" />
					</view>
					<view class="item">
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
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			show:false,
			orderList: [],
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			screen: {
				queryType: 2,
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
			circuitData:[],
			routeName:'',
			isPopup:false,
		};
	},
	onLoad() {},
	onShow() {
		this.resets();
		this.circuit()
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
		//查看物流
		toLoistics(item) {
			uni.navigateTo({
				url: '../flight/logisticsDetails?item=' + JSON.stringify(item)
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
		//选择线路
		confirmRote(e) {
			//console.log(e);
			this.screen.routeid = e[0].value;
			this.routeName = e[0].label;
		},
		//筛查
		search() {
		  this.resets()
		  this.isPopup = false;
		},
		//初始化数据
		resets(){
			this.screen.page=1;
			this.orderList=[];
			this.order();
		},
		//重置
		reset() {
			this.screen.page=1;
			this.screen.secondtracknumber = '';
			this.screen.ordernumber = '';
			this.screen.routeid = '';
			this.screen.recipientname = '';
			this.screen.batchname = '';
			this.screen.domesticnumber = '';
			this.routeName = '';
			this.orderList=[];
			this.order();
			this.isPopup = false;
		
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
				});
		},
		toLuggage(item) {
			uni.navigateTo({
				url: '/pages/index/parcel/luggage?item=' + JSON.stringify(item)
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
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
							flex: 1;
							margin-bottom: 5upx;
					}
					.textT {
						flex: 1;
						margin-bottom: 5upx;
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
					margin-left: 15upx;
				}
				.borsf{
				border: 1upx solid #c4c4c4 !important;
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
}
</style>
