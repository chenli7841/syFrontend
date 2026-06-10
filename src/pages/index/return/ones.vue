<template>
	<view class="index bgColor">
		<view class="list" v-if="type == 1">
			<view class="list-li bfff" v-for="(item, index) in orderList" :key="index">
				<view class="num">
					<view class="num-left c333 f26">
						<text>{{ item.ordernumber ? item.ordernumber : '-' }}</text>
						|
						<text>{{ item.recipientname ? item.recipientname : '-' }}</text>
					</view>
					<view class="num-status f24">未入库</view>
				</view>
				<view class="count">
					<view class="countO">
						<text class="textO f24 c666">收费重量：{{ item.weightkg ? item.weightkg : '0' }}</text>
						<text class="textT f24 c666">国内单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
					</view>
					<view class="countO">
						<text class="textO f24 c666">总运费：{{ item.shippingcost ? item.shippingcost : '0' }}</text>
						<text class="textT f24 c666">创建时间：{{ item.datecreated ? item.datecreated : '-' }}</text>
					</view>
					<!-- <view class="countO">
						<text class="textO f24 c666">转运状态：未入库</text>
						
					</view> -->
				</view>
				<view class="btn">
					<text @click="toWhy(item)" class="f24 cfff btnColor">申请退运</text>
					<text @click="toLoistics(item)" class="f24 c666 bor">物流详情</text>
					<text @click="toLuggage(item)" class="f24 capp">查看详情</text>
				</view>
			</view>
		</view>
		<view class="list" v-if="type == 70">
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
						<text class="textO f24 c666">总运费：{{ item.shippingcost ? item.shippingcost : '-' }}</text>
						<text class="textT f24 c666">国内单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
					</view>
					<view class="countO">
						<text class="textO f24 c666">转运状态：待退回</text>
						<text class="textT f24 c666">创建时间：{{ item.datecreated ? item.datecreated : '-' }}</text>
					</view>
				</view>
				<view class="btn"><text @click="toLoistics(item)" class="f24 c666 bor">物流详情</text><text @click="toLuggage(item)" class="f24 capp">包裹详情</text></view>
			</view>
		</view>
		<view class="list" v-if="type == 75">
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
						<text class="textO f24 c666">总运费：{{ item.shippingcost ? item.shippingcost : '-' }}</text>
						<text class="textT f24 c666">国内单号：{{ item.domesticnumber ? item.domesticnumber : '-' }}</text>
					</view>
					<view class="countO">
						<text class="textO f24 c666">转运状态：已退回</text>
						<text class="textT f24 c666">退运单号：{{item.returnNumber}}</text>
					</view>
					<view class="countO">
						<text class="textO f24 c666">退运收件人：{{item.returnUserName}}</text>
						<text class="textT f24 c666">退运快递公司：{{item.returnCarrier}}</text>
					</view>
					<view class="countO">
						<text class="textT f24 c666">创建时间：{{ item.datecreated ? item.datecreated : '-' }}</text>
					</view>
				</view>
				<view class="btn"><text @click="toLoistics(item)" class="f24 c666 bor">物流详情</text><text @click="toLuggage(item)" class="f24 capp">包裹详情</text></view>
			</view>
		</view>
		<!-- pop层 -->
		<u-popup v-model="isPopup" mode="bottom" :closeable="true">
			<view class="popup">
				<view class="title">筛选查询</view>
				<view class="log">
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
		<tabbar></tabbar>
	</view>
	
</template>

<script>
	import tabbar from '@/components/tabbar/tabbar.vue';
export default {
components:{
	tabbar,
},
	data() {
		return {
			iconType:'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			load: true,
			isMore: false,
			orderList: [],
			type: null,
			isPopup: false,
			isMask: false,
			screen: {
				size: 10,
				page: 1,
				ordernumber: '',
				domesticnumber: '',
				state: ''
			}
		};
	},
	onLoad(op) {
		this.type = op.type;
		this.screen.state = op.type;
		uni.setNavigationBarTitle({
			title: op.title
		});
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			this.order();
		}
	},
	onShow() {
		this.orderList=[];
		this.screen.page=1;
		if(this.type != 0){
			if(this.type != 1){
				this.order();
			}else{
				this.status='nomore'
			}
			
		}else{
			this.status='nomore'
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
		//筛查
		search() {
			this.screen.page=1;
			this.orderList = [];
			this.order();
			this.isPopup = false;
		},
		//重置
		reset() {
			this.screen = {
				size: 10,
				page: 1,
				ordernumber: '',
				domesticnumber: ''
			};
			this.orderList = [];
			this.order();
			this.isPopup = false;
		},
		//订单列表
		order() {
			this.status='loading';
			this.request
				.myRequest({
					url: '/api/order',
					data: this.screen
				})
				.then(res => {
					var list = this.orderList.concat(res.data.content);
					this.orderList = list;
					if(this.orderList == ''){
						this.status='nomore'
						}
					this.isMore = list.length < res.data.totalElements ? true : false;
					if (this.isMore) {
						this.status='loadmore'
						this.screen.page = this.screen.page + 1;
					}else{
						this.status='nomore';
					}
				});
		},
		toWhy(item) {
			uni.removeStorageSync('address')
		
			uni.navigateTo({
				url: './why?id=' + item.id
			});
		},
		toLuggage(id) {
			uni.navigateTo({
				url: '/pages/index/parcel/luggage?item=' + JSON.stringify(id)
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	// min-height: 100vh;
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
	.popupO {
	}
}
</style>
