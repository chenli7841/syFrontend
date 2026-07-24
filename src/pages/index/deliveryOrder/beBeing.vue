<template>
	<view class="index bgColor">
		<view class="list">
			<view class="list-li bfff" v-for="(item, index) in orderList" :key="index">
				<view class="num">
					<view class="num-left c333 f26">
						<text>批次号：{{ item.name ? item.name : -'' }}</text>
					</view>
				</view>
				<view class="count">
					<view class="countO">
						<text class="textO f24 c666">包裹数：{{ item.number ? item.number : '-' }}</text>
						<text class="textT f24 c666">总重量：{{ item.totalWeightKg ? item.totalWeightKg : '-' }}</text>
						<text class="textT f24 c666">总费用：{{ item.totalShippingCost ? item.totalShippingCost : '-' }}</text>
					</view>
				</view>
				<view class="btn"><text @click="toBath(item)" class="f24 capp">批次详情</text></view>
			</view>
		</view>
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
		<!-- pop层 -->
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			iconType:'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			isMore:false,
			isPopup: false,
			orderList: [],
			screen: {
				domesticnumber: '',
				ordernumber: '',
				name: '',
				page: 1,
				size: 10,
				   grouptype: 66,
			},
			type:'',
		};
	},
	onLoad(e) {
		
		if (e.type == 1) {
			uni.setNavigationBarTitle({
				title: '正在派送订单'
			});
			this.screen.grouptype=66;
			this.type=66;
		} else {
			uni.setNavigationBarTitle({
				title: '已派送订单'
			});
			
			this.screen.grouptype=100;
			this.type=100;
		}
	},
	onShow() {
		this.screen.page=1;
		this.orderList=[];
		this.batch();
	},
	onNavigationBarButtonTap() {
		this.isPopup = true;
	},
	//加载更多
	onReachBottom() {
		if(this.isMore){
			this.batch();
		}
	},
	methods: {
		//批次详情
		toBath(item){
			uni.setStorageSync('yjitem',item)
			uni.navigateTo({
				url: '/pages/index/parcel/batch'
			});
		},
		//批次列表
		batch() {
			this.status='loading'
			this.request
				.myRequest({
					url: '/api/batch',
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
				})
				.catch(() => {
					this.status = 'nomore';
				});
		},
		//筛查
		search() {
			this.screen.page=1;
			
			this.orderList=[];
			this.batch();
			this.isPopup = false;
		},
		//重置
		reset() {
			this.screen = {
				domesticnumber: '',
				ordernumber: '',
				name: '',
				page: 1,
				size: 10,
				type:this.type
			};
					this.orderList=[];
			this.batch();
			this.isPopup = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	.list {
		width: 100%;
		padding-top: 16upx;
			// margin-bottom: 300upx;
		.list-li {
			width: 100%;
			margin: 0px 0 16upx;
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
}
</style>
