<template>
	<view class="index f28">
		<view class="main">
			<view class="card bfff">
				<view class="title f28 fb c333">基本信息</view>
				<view class="item">
					<view class="label" style="flex: 1;">
						国内快递单号*
					</view>
					<input  style="flex: 3;" class="ipt" type="text" v-model="order.domesticnumber" placeholder="请输入国内快递单号" placeholder-class="placeholder" />
				</view>

				<radio-group class="item" v-model="order.warehouseid" name="" @change="selectTransportation">
					<view style="display: flex; align-items: center;" v-for="(item, index) in houseData" :key="index">
						<radio class="radioSon" color="#5178FF" :value="item.id" />
						<view class="info">
							<view class="f28 c333">{{ item.name }}</view>
						</view>
					</view>
				</radio-group>
				<view class="item" @click="openRouteSelect">
					<view class="label" style="flex: 1;">物品类型*</view>
					<view style="flex: 3;">
						{{ allRouteData.find(r => r.id === order.routeid) ? allRouteData.find(r => r.id === order.routeid).name : '' }}						
					</view>
				</view>
				<u-select
					@confirm="selectRoute2"
					data-id="id"
					value-name="id"
					label-name="name"
					v-model="showRouteList"
					mode="single-column"
					:list="allRouteData.filter(r => r.warehouseid === order.warehouseid)"
				></u-select>
			</view>
			<view class="card bfff">
				<view class="title f28 fb c333">填写新物品</view>
				<view v-for="(innerItem, index) in order.orderbaggageVoList[0].itemVoList" :key="index">
					<view class="item borDb">
						<view class="label f28 c333" style="flex: none; width: 180upx;">{{index+1}}. 内件名称*</view>
						<input style="flex: 2;" class="ipt f28 c333" v-model="innerItem.name" placeholder="请输入物品中文名称" placeholder-class="placeholder" />
						<view style="flex: 1;" class="select-btn" @click="removeInnerItem(index)">
							<image src="../../static/order/add.png" mode=""></image>
							<text class="f22 cfff ">删除物品</text>
						</view>
					</view>
					<view class="item borDb">
						<view class="label f28 c333" style="flex: none; width: 180upx;">数量*</view>
						<input style="flex: 3;" class="ipt f28 c333" min='1' type="number" v-model="innerItem.count" placeholder="请输入数量" placeholder-class="placeholder" />
					</view>
					<view class="item">
						<view class="label f28 c333" style="flex: none; width: 180upx;">总价值(RMB)*</view>
						<input style="flex: 3;" class="ipt f28 c333" min='1' type="number" v-model="innerItem.claimprice" placeholder="请输入申报价值" placeholder-class="placeholder" />
					</view>
				</view>
				<view class="btn-row">
					<view class="select-btn" @click="addInnerItem">
						<image src="../../static/order/add.png" mode=""></image>
						<text class="f22 cfff ">添加物品</text>
					</view>
				</view>
			</view>
			<view class="card bfff">
				<view class="item">
					<view class="label">
						保险金额(RMB)(选填)
					</view>
					<input class="ipt" min='0' type="digit" v-model="order.insurance" placeholder="请输入保险金额(选填)" placeholder-class="placeholder" />
				</view>
				<view @click="submitOrder()" class="submit lbtn f28 cfff btnColor">保存订单</view>
			</view>
		</view>
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
				nomore: ''
			},
			order: {
				isfromchina: 1, //是否从中国到加拿大
				memo: "", //备注
				domesticnumber: "", //国内快递单号
				routeid: -1, //线路id
				warehouseid: -1, //仓库id
				insurance: "",
				warehouse: "",
				route: "",
				routetype: 1,

				domesticcarrier:"",
				ordernumber: "",
				recipientaddressid: "",
				photourl: "",
				enclosure: "",

				orderbaggageVoList: [{
					itemVoList: [{
						brand: "",
						category: "生活用品",
						claimprice: "",
						count: "",
						englishname: "",
						format: "",
						name: "",
						photoUrl: "",
						material: "",
					}]
				}],
			},
			newItemInfo: {
				name: "",
				count: "",
				claimprice: "",
			},
			status: 'loading',
			orderId: '',
			houseData: [],
			allRouteData: [],
			current: 0,
			userInfo: {},
			showRouteList: false,
		};
	},
	onLoad(e) {

		
		
	},
	onShow() {
		this.current=0;
		this.house();
		this.getUserInfo();
	},
	methods: {
		removeInnerItem(index) {
			let data = this.order.orderbaggageVoList[0].itemVoList;
			let before = data.splice(0, index);
			let after = data.splice(index, data.length);
			this.order.orderbaggageVoList[0].itemVoList = [
				...before,
				...after,
			];
		},
		openRouteSelect() {
			this.showRouteList = true;
		},
		addInnerItem() {
			this.order.orderbaggageVoList[0].itemVoList = [
				...this.order.orderbaggageVoList[0].itemVoList,
				{
					brand: "",
					category: "生活用品",
					claimprice: "",
					count: "",
					englishname: "",
					format: "",
					name: "",
					photoUrl: "",
					material: "",
				}
			];
		},
		selectTransportation(e) {
			this.order.warehouseid = e.target.value;
			if (!this.allRouteData.find(r => r.warehouseid === this.order.warehouseid)) {
				this.loadRoutes(this.order.warehouseid);
			}
		},
		selectRoute(e) {
			this.order.routeid = e.target.value;
		},
		selectRoute2(e) {
			this.order.routeid = e[0].value;
		},
		
		submitOrder() {
			this.request
				.myRequest({
					url: '/api/order/selectOrderAllAccuracy',
					data: {
						domesticnumber: this.order.domesticnumber,
						size: 1,
						page: 1
					}
				})
				.then(res => {
					if (res.data.content != '') {
						this.$toast('快递单号重复，请重新输入');

						return false;
					}
					let code = this.allRouteData.find(r => r.id === this.order.routeid).code;
					let orderstartnumber = this.userInfo.orderstartnumber;
					let time = "2018-01-01 00:00:00";
					time = time.replace(/\-/g, "/");
					let d = new Date(time) / 1000;
					let dd = Math.round(Date.parse(new Date()) / 1000 - d);
					this.order.ordernumber = code + orderstartnumber + dd.toString();

					this.order.warehouse = this.houseData.find(h => h.id === this.order.warehouseid).name;
					this.order.route = this.allRouteData.find(r => r.id === this.order.routeid).name;
					this.loading = true;
					this.request
						.myRequest({
							url: '/api/order/createOrder',
							data: this.order,
							method: 'post'
						})
						.then(res => {
							this.$toast('创建成功');
							this.loading = false;
							setTimeout(() => {
								uni.navigateBack({
									delta: 3
								});
							}, 1500);
						})
						.catch(error => {
							this.loading = false;
						});


				});
		},
		//仓库
		house() {
			if (this.houseData.length > 0) {
				return;
			}
			var data = {
				page: 1,
				size: 100
			};
			this.request
				.myRequest({
					url: '/api/warehouse',
					data: data
				})
				.then(res => {
					this.houseData = res.data.content;
					if (this.houseData.length > 0) {
						this.order.warehouseid = this.houseData[0].id;
						this.loadRoutes(this.order.warehouseid);
					}
					this.status='nomore'
				})
				.catch(() => {
					this.status = 'nomore';
				});
		},
		loadRoutes(warehouseid) {
			var data = {
				page: 1,
				size: 999999,
				warehouseid: warehouseid,
			};
			this.request
				.myRequest({
					url: '/api/route',
					data: data
				})
				.then(res => {
					this.allRouteData = [...this.allRouteData, ...res.data.content];					
				});
		},
		getUserInfo() {
			if (this.userInfo.orderstartnumber) {
				return;
			}
			this.request
				.myRequest({
					url: '/api/user/getUser',
					data: ''
				})
				.then(res => {
					this.userInfo = res.data;
				})
				.catch(error => {});
		},
		toZero(id) {
			uni.navigateTo({
				url: './zero?warehouseId=' + id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.select-btn {
	width: 154upx;
	height: 52upx;
	text-align: center;
	line-height: 52upx;
	border-radius: 6upx;
	display: flex;
	justify-content: center;
	align-items: center;
	border: 1px solid #ff7e33;
	image {
		width: 16upx;
		height: 16upx;
		margin-right: 10upx;
	}
	text {
		color: #ff7e33;
	}
}
.index {
	display: flex;
	flex-direction: column;
	.main {
		flex: 1;
		.item-title {
			padding: 0 30upx;
		}
		.item {
			height: 120upx;
			display: flex;
			gap: 32upx;
			align-items: center;
			
			.label {
				flex: none;
			}
		}
		.item:not(:last-child) {
			border-bottom: 2upx solid rgba(230, 239, 242, 0.6);
		}
		.card {
			width: 94%;
			margin: 20upx auto;
			border-radius: 20upx;
			padding: 30upx;
		}
		.btn-row {
			margin: 20upx 0;
			display: flex;
			justify-content: end;
		}
		.submit {
			flex-basis: 170upx;
			height: 68upx;
			text-align: center;
			line-height: 68upx;
			border-radius: 34upx;
		}
	}

	// min-height: 100vh;
	.top {
		width: 100%;
		height: 120upx;
		line-height: 120upx;
		padding: 0 30upx;
		box-sizing: border-box;
		text:nth-child(2) {
			margin: 0 15upx;
		}
	}
	.nav {
		width: 100%;
		// height: 1upx;
		margin: 20upx 0;
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
					line-height: 120upx;
					position: relative;

					text:first-child {
						display: inline-block;
						text-align: center;
						width: 160upx;
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
		}
	}
	.list {
		width: 100%;
		.list-li {
			margin: 16upx 0;
			padding: 24upx 30upx;
			box-sizing: border-box;
			background: #fff;
			.info {
				width: 100%;
				height: 172upx;
				display: flex;
				align-items: center;
				.image {
					width: 240upx;
					height: 172upx;
					border-radius: 20upx;

					img {
						object-fit: cover;
					}
				}
				.info-name {
					flex: 1;
					height: 100%;
					padding: 10upx 20upx;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					view:last-child {
						margin-top: 10upx;
						white-space: pre-line;
					}
				}
			}
			.add {
				width: 100%;
				display: flex;
				flex-direction: row-reverse;
				margin-top: 14upx;
				image {
					width: 96upx;
					height: 52upx;
				}
			}
		}
	}
}
</style>
