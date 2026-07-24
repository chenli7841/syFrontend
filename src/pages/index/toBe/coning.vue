<template>
	<view class="index bgColor">
		<u-tabs :list="houseData" style="margin-top: 16upx;" :is-scroll="true" :current="current" @change="changeCurrent"></u-tabs>
		<!-- <view class="nav">
			<scroll-view class="scoll bfff" :scroll-x="true" @scroll="scroll">
				<view class="typea" v-for="(item, index) in houseData" :key="index">
					<view class="nav-li" @click="changeCurrent(item.id)"><text class="f26" :class="current === item.id ? 'bor-bottom  capp' : 'c333'">{{item.name}}</text></view>
				</view>
			</scroll-view>
		</view> -->
		<view class="list">
			<view class="list-li bfff" v-for="(item,index) in orderList" :key="index">
				<view class="num">
					<view class="num-left c333 f26">
						<text>{{item.ordernumber ? item.ordernumber :'-'}}</text>
						|
						<text>{{item.recipientname ?item.recipientname :'-'}}</text>
					</view>
					<!-- <view class="num-status f24">正在派送</view> -->
				</view>
				<view class="count">
					<view class="countO">
						<text class="textO f24 c666">国内单号：{{item.domesticnumber ? item.domesticnumber.replace(/^(.{4}).*(.{3})$/,"$1***$2") :'-'}}</text>
						<text class="textT f24 c666">创建时间：{{item.datecreated ?item.datecreated:'-'}}</text>
					</view>
					<view class="countO">
						<text class="textO f24 c666">线路：{{item.route?item.route :'-'}}</text>
						<text class="textT f24 c666">包裹状态：未匹配</text>
					</view>
				</view>

				<view class="btn"><text @click="toChange(item)" class="f24 capp">填写包裹信息</text></view>
				<!-- <view class="btn" v-if="type == 4">
					<text @click="navto()" class="f24 capp">包裹详情</text>
				</view> -->
			</view>
		</view>
		<!-- pop层 -->
		<u-popup v-model="isMask" mode="center" :border-radius="20" :closeable="true" :mask-close-able="false" width="632" height="450">
			<view class="popup">
				<view class="title c333 f30">确认单号</view>
				<view class="info c333 f28 fb">单号：{{domesticnumbers}}</view>
				<view class="log">
					<view class="item ">
						<view class="label f28 c333">国内快递单号</view>
						<input
							class="ipt f28 c333"
							type=""
							v-model="orderd.domesticnumber"
							placeholder="请输入国内快递单号"
							placeholder-class="placeholder"
						/>
					</view>
					<view class="gtn"><view @click="toOrder()" class="lbtn f28 cfff btnColor">确认</view></view>
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
						<input class="ipt f28 c333" type="text" v-model="screen.ordernumber" placeholder="请输入运单号" placeholder-class="placeholder" />
					</view>		
					<view class="item">
						<view class="label f28 c333">国内单号</view>
						<input class="ipt f28 c333" v-model="screen.domesticnumber" placeholder="请输入国内单号" placeholder-class="placeholder" />
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
<u-loadmore :status="status" style="margin-top: 50upx;" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderd:{
				
			},
			domesticnumbers:"",
			true:true,
			// currents:0,
			isPopup:false,
			show:false,
			iconType:'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			current: 0,
			isMask: false,
			screen: {
				page: 1,
				size: 10,
				state: 0,
				batchname: '',
				secondtracknumber: '',
				ordernumber: '',
				domesticnumber: '',
				routeid: '',
				recipientname: '',
				warehouseid: ''
			},
			orderList:[],
			houseData:[],
			circuitData:[],
			routeName:'',
			selectOrder:'',
		};
	},
	onNavigationBarButtonTap() {
		this.isPopup = true;
	},
	onLoad(e) {
	this.screen.warehouseid=e.warehouseid;
	},
	onShow() {
		this.screen.page=1;
		this.orderList=[];
	this.order();
		this.circuit();
		
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			this.order();
		}
	},
	methods: {
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
		//选择线路
		confirmRote(e) {
			this.screen.routeid = e[0].value;
			this.routeName = e[0].label;
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
		//仓库
		house() {
			var data = {
				page: 1,
				size: 100
			};
			this.request
				.myRequest({
					url: '/api/warehouse',
					data: {}
				})
				.then(res => {
					this.houseData = res.data.content;
					this.screen.warehouseid=res.data.content[0].id;
					this.current=0;
					
				});
		},
		//订单列表
		order() {
			this.status='loading'
			this.request
				.myRequest({
					url: '/api/order/selectOrderWareAll',
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
		toOrder() {
			
			      if(this.selectOrder.domesticnumber != this.orderd.domesticnumber){
			         this.$toast('快递单号不匹配，请重新输入')
			         return false
			      }
				  var item=this.selectOrder;
				  //console.log(item)
				  // url: '../../order/two?isfromchina='+item.isfromchina+'&id='+item.id+'&put=1'
				  uni.setStorageSync('upDateOrder',item);
				  uni.setStorageSync('put',true);
			uni.switchTab({
				url: '/pages/order/order'
			});
		},
		toChange(e) {
			if(e.isfromchina == 0){
				uni.setStorageSync('upDateOrder',e);
					  uni.setStorageSync('put',true);
				uni.switchTab({
					url: '/pages/order/order'
				});
			}else{
				this.selectOrder=e;
				this.domesticnumbers=e.domesticnumber? e.domesticnumber.replace(/^(.{4}).*(.{3})$/,"$1***$2"):""
				this.isMask = true;
			}
			
		},
		scroll() {},
		toLuggage() {
			uni.navigateTo({
				url: '../parcel/luggage'
			});
		},
		changeCurrent(index) {
			this.current = index;
			this.screen.warehouseid=this.houseData[index].id;
			this.screen.page=1;
			this.orderList=[];
			this.order();
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	// min-height: 100vh;
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
				width: 160upx;
				margin-right: 40upx;
				.nav-li {
					width: 160upx;
					height: 120upx;
					position: relative;

					text:first-child {
						display: inline-block;
						text-align: center;
						width: 160upx;
						height: 60upx;
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						margin: auto;
					}
					text:nth-child(2) {
						position: absolute;
						right: 0;
						top: -13upx;
						display: inline-block;
						border-radius: 50%;
						width: 26upx;
						height: 26upx;
						text-align: center;
						line-height: 26upx;
					}
				}
			}
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
					color: #ff7e33;
				}
			}
			.count {
				width: 100%;
				.countO {
					display: flex;
					// height: 50upx;
					// align-items: center;
					flex-wrap: wrap;
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
					width: 200upx;
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
}
</style>
