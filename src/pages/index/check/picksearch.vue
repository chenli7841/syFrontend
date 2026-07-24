<template>
	<view class="index bgColor">
		<view class="top bfff">
			<view class="info">
				<view class="info-name c333 f28">用户代码</view>
				<view class="info-ipt">
					<view @click="resolveQR(1)" class="img"><image src="../../../static/index/sao.png" mode=""></image></view>
					<input class="ipt f24 c333" type="text" v-model="screen.orderstartnumber" placeholder="用户代码" />
					<text class="search f28 cfff" @click="search">搜索</text>
				</view>
			</view>
			<view class="info" v-if="userInfo">
				<view class="info-name c333 f28">运单号</view>
				<view class="info-ipt">
					<view @click="resolveQR(2)" class="img"><image src="../../../static/index/sao.png" mode=""></image></view>
					<input style="border:none" class="ipt f24 c333" type="text" v-model="screen.ordernumber" placeholder="请输入运单号" />
					<text class="search f28 cfff" @click="search">搜索</text>
				</view>
			</view>
			<view class="count" v-if="userInfo != ''">
				<view class="countO">
					<text class="textO f24 c666">用户余额：{{ userInfo.balance }}</text>
					<text class="textT f24 c666">群主：{{ userInfo.aeniorName }}</text>
				</view>
				<view class="countO">
					<text class="textO f24 c666">电话：{{ userInfo.canadaphonenumber }}</text>
					<text class="textT f24 c666">取货地址：{{ userInfo.pickuplocation }}</text>
				</view>
			</view>
		</view>
		<view class="" v-if="userInfo != ''">
			<u-tabs :list="tabs" :is-scroll="false" :current="current" @change="changeCurrent"></u-tabs>
			<!-- <view class="bfff"> -->

			<!-- <view class="nav-li" @click="changeCurrent(1)">
					<text class="f26" :class="current === 1 ? 'bor-bottom  capp fb' : 'c333'">货运提货({{ orderList.length }})</text>
				</view>
				<view class="nav-li" @click="changeCurrent(2)">
					<text class="f26" :class="current === 2 ? 'bor-bottom  capp fb' : 'c333'">商城团购提货({{ orderList.length }})</text>
				</view>
				<view class="nav-li" @click="changeCurrent(3)">
					<text class="f26" :class="current === 3 ? 'bor-bottom  capp fb' : 'c333'">团购线到货({{ orderList.length }})</text>
				</view> -->
			<!-- </view> -->
			<!-- 列表主体 -->
			<view class="main">
				<!-- 货运提货 -->
				<view class="list" v-if="current == 0">
					<checkbox-group @change="checkboxChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in orderList" :key="index">
							<view><checkbox style="transform:scale(0.7)" :checked="orderIds.includes(String(item.id))" :value="String(item.id)" /></view>
							<view class="list-li bfff">
								<view class="num">
									<!-- <image class="numImg" src="../../../static/order/yes.png" mode=""></image> -->
									<!-- <image src="../../../static/order/no.png" mode=""></image> -->
									<view class="num-left c333 f26">
										<text>{{ item.ordernumber }}</text>
										|
										<text>{{ item.recipientname }}</text>
									</view>
									<view class="num-status f24">货运提货</view>
								</view>
								<view class="count">
									<view class="countO">
										<text class="textO f24 c666">收费重量：{{ item.weightkg }}</text>
										<text class="textT f24 c666">国内单号：{{ item.domesticnumber }}</text>
									</view>
									<view class="countO">
										<text class="textO f24 c666">运费：{{ item.shippingcost }}</text>
										<text class="textT f24 c666">创建时间：{{ item.datecreated }}</text>
									</view>
									<view class="countO">
										<text class="textO f24 c666">取货点：{{ item.pickUpLocationName }}</text>
									</view>
								</view>
								<view class="btn"><text @click="navto(item)" class="f24 capp">包裹详情</text></view>
							</view>
						</label>
					</checkbox-group>
				</view>
				<!-- 商城团购提货 -->
				<!-- <view class="list" v-if="current == 2">
					<view class="list-li bfff">
						<view class="num">
							<image class="numImg" src="../../../static/order/yes.png" mode=""></image>
							
							<view class="num-left c333 f26"><text>H03460099283674</text></view>
							<view class="num-status f24">商城团购提货</view>
						</view>
						<view class="count">
							<view class="countO">
								<text class="textO f24 c666">仓储费：$500</text>
								<text class="textT f24 c666">价格：$0</text>
								<text class="textT f24 c666">数量：2</text>
							</view>
							<view class="countO"><text class=" f24 c666">货号：2-541485403202312</text></view>
							<view class="countO"><text class=" f24 c666">订单号：26516516521626</text></view>
						</view>
						<view class="btn"><text @click="navto()" class="f24 capp">包裹详情</text></view>
					</view>
				</view> -->
				<!-- 团购线到货(20) -->
				<!-- <view class="list" v-if="current == 3">
					<view class="list-li bfff">
						<view class="num">
							<image class="numImg" src="../../../static/order/yes.png" mode=""></image>
						
							<view class="num-left c333 f26"><text>批次号：0214-1-14多伦多到货-20210203</text></view>
						</view>
						<view class="count">
							<view class="countO">
								<text class="textO f24 c666">包裹数：7</text>
								<text class="textT f24 c666">总重量：50kg</text>
								<text class="textT f24 c666">总费用：$500</text>
							</view>
						</view>
						<view class="btn"><text @click="navto()" class="f24 capp">包裹详情</text></view>
					</view>
				</view> -->
			</view>
			<!-- 底部操按钮 -->
			<view class="footer">
				<view class="select">
					<!-- <view class="select-left">
						<image class="numImg" src="../../../static/order/yes.png" mode=""></image>
				
						<text class="f24 c666">全选</text>
					</view> -->
					<checkbox-group @change="allChoose">
						<label>
							<checkbox value="all" style="transform:scale(0.7)" :class="{ checked: allChecked }" :checked="allChecked ? true : false"></checkbox>
							<text class="f24 c666">全选</text>
						</label>
					</checkbox-group>
					<view class="select-right f24 capp">已选{{ orderIds.length }}单</view>
				</view>
				<view class="fotbtn">
					<view class="item">
						<text class="f20 c666">${{ shippingcost }}</text>
						<text class="f20 c666">总运费</text>
					</view>
					<view class="item">
						<text class="f20 c666">${{ storagecost }}</text>
						<text class="f20 c666">总仓储费</text>
					</view>
					<view class="item">
						<text class="f20 c666">${{ cost }}</text>
						<text class="f20 c666">总费用</text>
					</view>
					<view class="ibtn f28 cfff" @click="submit(0)">余额付款</view>
					<view class="xbtn f28 cfff" @click="submit(3)">现金付款</view>
				</view>
			</view>
		</view>
		<u-modal title="确认付款" @confirm="submitData" show-cancel-button v-model="submitShow" :title-style="{ color: 'red' }">
			<view class="codeView">
				<view class="f26 c333 mb20">优惠券码</view>
				<view class="info-ipt">
					<view class="img"><image @click="barCode()" src="../../../static/index/sao.png" mode=""></image></view>
					<input class="ipt f24 c333" v-model="couponNumber" placeholder="优惠券码(选填)" />
				</view>
			</view>
		</u-modal>
		<u-loadmore v-if="userInfo" :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
var Qrcode = require('../../../utils/qrCode.js');
var Quagga = require('@/components/barCode/components/quagga.min.js');
import Base64 from '../../../utils/base64';
export default {
	data() {
		return {
			submitShow: false,
			isMore: false,
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'nomore',
			tabs: [
				{
					name: '货运提货'
				},
				{
					name: '商城团购提货'
				},
				{
					name: '团购线到货'
				}
			],
			allChecked: false, //是否全选
			orderList: [],
			current: 0,
			codeNum: '',
			res1: '',
			screen: {
				page: 1,
				size: 1000,
				orderstartnumber: '',
				state: 30,
				ordernumber: '',
				queryType: 1,
				picktype: 1
			},
			orderIds: [],
			selectorder: [],
			storagecost: 0,
			shippingcost: 0,
			cost: 0,
			userInfo: '',
			isWeChat: false,
			payType: '',
			couponNumber:'',
		};
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			this.order();
		}
	},
	onLoad() {},
	onShow() {
		let status = navigator.userAgent.toLowerCase();
		if (status.match(/MicroMessenger/i) == 'micromessenger') {
			this.isWeChat = true;
		} else {
			this.isWeChat = false;
		}
	},
	methods: {
		barCode() {
			let that=this;
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['camera'], //从相册选择
				success: res => {
					var filePath = res.tempFilePaths[0];
					Quagga.decodeSingle(
						{
							//解码方式，与条形码的编码方式有关
							decoder: {
								readers: [
									'code_128_reader',
									'ean_reader',
									'ean_8_reader',
									'code_39_reader',
									'code_39_vin_reader',
									'codabar_reader',
									'upc_reader',
									'upc_e_reader',
									'i2of5_reader'
								] // List of active readers
							},
							locate: true, // try to locate the barcode in the image
							src: filePath
			  	},
						function(result) {
							if(result){
								that.couponNumber=result.codeResult.code;
							}else{
								uni.showToast({
									title:'识别失败',
									icon:'none',
									duration:2000
								})
							}
							
							// me.SN = result.codeResult.code;
			  	}
					);
				}
			});
		},
		//根据用户代码搜索用户信息

		getUserInfo() {
			var data = {
				userNumber: this.screen.orderstartnumber
			};
			this.request
				.myRequest({
					url: '/api/user/getUserInfo',
					data: data
				})
				.then(res => {
					this.userInfo = res.data;
					if (res.data) {
						this.order();
					} else {
						this.$toast('未搜索到用户');
					}

					console.log(res);
				});
		},
		//余额付款提交
		submit(e) {
			var that = this;
			this.payType = e;
			if (this.orderIds == '') {
				this.$toast('请勾选提货订单');
				return false;
			}
			this.submitShow = true;
			// uni.showModal({
			// 	title: '提示',
			// 	content: '确认提货付款？',
			// 	success: function(res) {
			// 		if (res.confirm) {
			// 			that.submitData();
			// 		} else if (res.cancel) {
			// 			console.log('用户点击取消');
			// 		}
			// 	}
			// });
		},
		//确认提交
		submitData() {
			var that = this;
			var data = {
				orderIds: that.orderIds,
				orderType: 0,
				payType: this.payType,
				totalShippingCost: that.shippingcost,
				totalStorageCost: that.storagecost,
				couponNumber:that.couponNumber,
			};
			console.log(data)
			// return false
			this.request
				.myRequest({
					url: '/api/pay/payOrder',
					data: data,
					method: 'post'
				})
				.then(res => {
					uni.showToast({
						title:'操作成功',
						duration:2000
					})
					this.orderIds = [];
					this.screen.page = 1;
					this.orderList = [];
					that.shippingcost = 0;
					that.storagecost = 0;
					this.couponNumber='';
					this.getUserInfo();
				});
		},
		//搜索
		search() {
			this.screen.page = 1;
			this.orderList = [];
			this.getUserInfo();
		},
		//全选
		allChoose(e) {
			console.log(e);
			let chooseItem = e.detail.value;
			// 全选
			if (this.orderList != '') {
				if (chooseItem[0] == 'all') {
					this.allChecked = true;
					var shippingcost = 0; //派送费
					var storagecost = 0; //仓储费
					for (let item of this.orderList) {
						let itemVal = String(item.id);
						shippingcost += item.shippingcost * 1;
						storagecost += item.storagecost * 1;
						if (!this.orderIds.includes(itemVal)) {
							this.orderIds.push(itemVal);
						}
					}
					this.storagecost = (storagecost * 1).toFixed(2);
					this.shippingcost = (shippingcost * 1).toFixed(2);
					this.cost = storagecost + shippingcost;
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
						shippingcost += this.orderList[i].shippingcost * 1;
						storagecost += this.orderList[i].storagecost * 1;
					}
				}
			}
			this.storagecost = (storagecost * 1).toFixed(2);
			this.shippingcost = (shippingcost * 1).toFixed(2);
			this.cost = (storagecost * 1 + shippingcost * 1).toFixed(2);
			this.selectorder = list;
			console.log(this.selectorder);
		},
		getObjectURL(file) {
			var url = null;
			if (window.createObjectURL !== undefined) {
				// basic
				url = window.createObjectURL(file);
			} else if (window.URL !== undefined) {
				// mozilla(firefox)
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL !== undefined) {
				// webkit or chrome
				url = window.webkitURL.createObjectURL(file);
			}
			console.log(url, 'url');
			console.log('ooo');
			return url;
		},
		resolveQR(event) {
			var that = this;
			if (event == 1) {
				uni.chooseImage({
					count: 1, //默认9 上传数量
					success: res => {
						Qrcode.qrcode.decode(this.getObjectURL(res.tempFiles[0]));
						Qrcode.qrcode.callback = function(res1) {
							console.log(res1, '.............');
							console.log(res1.length);
							let base64 = new Base64();
							let num1 = base64.decode(res1); //解码 '123:456'

							console.log(num1, '64');
							// 		console.log(res1.indexOf(":"))
							var dd = num1.substring(num1.indexOf(':') + 1, num1.length);
							console.log(dd);
							that.res1 = dd;

							if (dd.indexOf('error') >= 0) {
							} else {
								if (event == 1) {
									that.screen.orderstartnumber = dd;
									that.screen.ordernumber = '';
									that.getUserInfo();
								}
								that.codeNum = dd;
							}
						};
					}
				});
			} else {
				uni.chooseImage({
					count: 1, //默认9 上传数量
					success: res => {
						Qrcode.qrcode.decode(this.getObjectURL(res.tempFiles[0]));
						Qrcode.qrcode.callback = function(res2) {
							console.log(res2, '.............');
							if (res2) {
								that.screen.ordernumber = res2;

								that.getUserInfo();
							}
						};
					}
				});
			}
		},

		navto(item) {
			uni.navigateTo({
				url: '../parcel/luggage?item=' + JSON.stringify(item)
			});
		},
		changeCurrent(index) {
			if (index !== this.current) {
				this.current = index;
			}
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
	position: relative;
	.codeView {
		padding: 25upx;
		box-sizing: border-box;
		.mb20{
			margin-bottom: 20upx;
		}
		.info-ipt {
			width: 100%;
			height: 68upx;
			display: flex;
			align-items: center;
			border: 1px solid #dedede;
		
			.img {
				width: 88upx;
				height: 68upx;
				display: flex;
				justify-content: center;
				align-items: center;
				image {
					width: 34upx;
					height: 34upx;
				}
			}
			.ipt {
				flex: 1;
				height: 36upx;
				padding-left: 10upx;
				box-sizing: border-box;
				border-left: 1px solid #d6d6d6;
			}
			.search {
				flex-basis: 128upx;
				height: 68upx;
				background: #5178ff;
				border-radius: 10upx;
				text-align: center;
				line-height: 68upx;
			}
		}
	}
	
	.top {
		width: 100%;
		padding: 30upx;
		box-sizing: border-box;
		.info {
			width: 100%;
			.info-name {
				margin: 20upx 0;
			}
			.info-ipt {
				width: 100%;
				height: 68upx;
				display: flex;
				align-items: center;
				border: 1px solid #dedede;

				.img {
					width: 88upx;
					height: 68upx;
					display: flex;
					justify-content: center;
					align-items: center;
					image {
						width: 34upx;
						height: 34upx;
					}
				}
				.ipt {
					flex: 1;
					height: 36upx;
					padding-left: 10upx;
					box-sizing: border-box;
					border-left: 1px solid #d6d6d6;
				}
				.search {
					flex-basis: 128upx;
					height: 68upx;
					background: #5178ff;
					border-radius: 10upx;
					text-align: center;
					line-height: 68upx;
				}
			}
		}
		.count {
			width: 100%;
			margin-top: 30upx;
			.countO {
				display: flex;
				height: 50upx;
				align-items: center;
				.textO {
					flex: 1;
				}
				.textT {
					flex: 1;
				}
			}
		}
	}
	.nav {
		width: 100%;
		height: 88upx;
		margin-top: 16upx;
		padding: 18upx 30upx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.nav-li {
			flex: 1;
			height: 52upx;
			line-height: 52upx;
			position: relative;

			text:first-child {
				display: inline-block;
				text-align: center;
				width: 100%;
				height: 100%;
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
	.main {
		width: 100%;
		margin-top: 16upx;
		margin-bottom: 500upx;
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
		.select {
			background: #f1f3f6;
			height: 94upx;
			display: flex;
			justify-content: space-between;
			padding: 0 30upx;
			box-sizing: border-box;
			align-items: center;
			.select-left {
				flex: 1;
				.numImg {
					width: 32upx;
					height: 32upx;
					position: relative;
					top: 5upx;
					margin-right: 15upx;
				}
			}
			.select-right {
				flex: 1;
				text-align: right;
			}
		}
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
				flex-direction: column;
				justify-content: center;
			}
			.ibtn {
				flex-basis: 164upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
				background: #ffa401;
				margin-right: 12upx;
			}
			.xbtn {
				flex-basis: 164upx;
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
