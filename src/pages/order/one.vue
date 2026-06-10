<template>
	<view class="index bgColor">
		<view class="top">
			<text class="c333 fb f40">03</text>
			<text class="c333  f28">填写运单和包裹信息</text>
			<text class="c999  f24">(必填)</text>
		</view>
		<view class="middle">
			<view class="card bfff">
				<view class="title f28 fb c333">填写运单号</view>
				<view class="log">
					<view class="item borDb" v-if="isfromchina == 1">
						<view class="label f28 c333">
							国内快递单号
							<text class="text">*</text>
						</view>
						<input
							:auto-blur='blur'
							class="ipt f28 c333"
							type="text"
							v-model="order.domesticnumber"
							placeholder="请输入国内快递单号"
							placeholder-class="placeholder"
						/>
					</view>
				</view>
			</view>
			<view class="operation" style="display: none;">
				<view class="oBtn" @click="delBox">
					<image src="../../static/order/jian.png" mode=""></image>
					<text class="f22 capp">删除物品</text>
				</view>
				<view class="tBtn btnColor" @click="addBox">
					<image src="../../static/order/jia.png" mode=""></image>
					<text class="f22 cfff ">添加物品</text>
				</view>
			</view>

			<view class="list">
				<checkbox-group v-model="checkedCities" @change="checkboxChange" class="checkbox_group">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in orderbaggageVoList" :key="index">
						<view><checkbox :value="String(index)" /></view>
						<view class="list-li">
							<view class="select">
								<view class="select-img">
									<!-- <image src="../../static/order/yes.png" mode=""></image> -->
									<text class="f28 c333 fb">箱号{{ index + 1 }}</text>
								</view>
								<view class="select-btn" style="display: none;" @click="addParts(index)">
									<image src="../../static/order/add.png" mode=""></image>
									<!-- <image src="../../static/order/no" mode=""></image> -->
									<text class="f22 cfff ">添加物品</text>
								</view>
							</view>
							<view class="goots">
								<view class="goots-li" v-for="(info, idx) in item.itemVoList" :key="idx">
									<view class="li-num c333 f24 fb">内件{{ idx + 1 }}</view>
									<view class="li-info">
										<image v-if="info.photoUrl" :src="info.photoUrl" mode=""></image>
										<image v-else src="../../static/logo.png" mode=""></image>
										<text class="f24 c333">{{ info.name }}</text>
									</view>
									<view class="li-btns">
										<!-- <text class="f22 capp">查看</text> -->
										<text class="f22 capp" @click="compile(info, idx, index)">编辑</text>
										<text class="f22 capp" @click="delParts(idx, index)">删除</text>
									</view>
								</view>
							</view>
						</view>
					</label>
				</checkbox-group>
			</view>
			<view class="main bfff">
				<view class="title f28 fb c333">{{ operation === 'add' ? "填写新物品" : "修改物品" }}</view>
				<view class="item borDb">
					<view class="label f28 c333">
						内件名称
						<text class="text">*</text>
					</view>
					<input class="ipt f28 c333" v-model="newItemInfo.name" placeholder="请输入物品中文名称" placeholder-class="placeholder" />
				</view>
				<view class="item borDb" v-if="isfromchina == 0">
					<view class="label f28 c333">
						规格
						<text class="text">*</text>
					</view>
					<input class="ipt f28 c333" type="text" v-model="newItemInfo.format" placeholder="请输入规格" placeholder-class="placeholder" />
				</view>
				<view class="item borDb">
					<view class="label f28 c333">
						申报价值(RMB)
						<text class="text">*</text>
					</view>
					<input class="ipt f28 c333" min='0' type="digit" v-model="newItemInfo.claimprice" placeholder="我们购买申报价值1%的商业保险" placeholder-class="placeholder" />
				</view>
				<view class="item borDb">
					<view class="label f28 c333">
						数量
						<text class="text">*</text>
					</view>
					<input class="ipt f28 c333" min='1' type="number" v-model="newItemInfo.count" placeholder="请输入数量" placeholder-class="placeholder" />
				</view>
				<view class="item">
					<view class="label f28 c333">
						种类
						<text class="text">*</text>
					</view>
					<view class="picker_box">
						<view class="placeholder_text" v-if="!newItemInfo.category">请选择种类</view>
						<picker class="ipt f28 c333" mode="selector" value="1" range-key="Item" :range="categoryList" @change="selectCategory">
							<view>{{ newItemInfo.category ? newItemInfo.category : '' }}</view>
						</picker>
					</view>
				</view>
				<view class="btn-row">
					<view class="select-btn" @click="addItem">
						<image src="../../static/order/add.png" mode=""></image>
						<text class="f22 cfff ">{{operation === "add" ? "添加物品" : "更新物品"}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="oneBtn">
			<view @click="navto()" class="lbtn f28 cfff btnColor">下一步</view>
			<view @click="navBack()" class="ubtn f28 c999 ">上一步</view>
		</view>
		<view class="oneBtn" v-if="put == 1"><view @click="submitOrder()" class="lbtn f28 cfff btnColor">确认修改</view></view>
		<u-toast ref="uToast" :duration="3000" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			blur:true,
			show: false,
			routeId: '',
			parmes: {},
			box: [
				{
					itemVoList: [
						{
							brand: '',
							categoryDto: '',
							claimprice: '',
							count: '',
							englishname: '',
							format: '',
							name: '',
							photoUrl: '',
							material: ''
						}
					]
				}
			],
			order: {
				isfromchina: '', //是否从中国到加拿大
				memo: '', //备注
				domesticnumber: '', //国内快递单号
				routeid: '', //线路
				route:'',
				insurance:'',
				ordernumber: '', //运单号
				recipientaddressid: '', //地址id
				photourl: '',
				enclosure:''
			},
			isfromchina: '',
			addressInfo: '',
			put: false,
			orderId: '',
			codeData:"",
			checkedCities: [],
			boxData: [],
			orderbaggageVoList: [
				{
					itemVoList: [
						// {
						// 	brand: '',
						// 	categoryDto: '',
						// 	claimprice: '',
						// 	count: '',
						// 	englishname: '',
						// 	format: '',
						// 	name: '',
						// 	photoUrl: '',
						// 	material: ''
						// }
					]
				}
			],
			putType: '',
			newItemInfo: {
				brand: '',
				category: '',
				claimprice: '',
				count: '',
				format: '',
				name: '',
				photoUrl: '',
				material: ''
			},
			categoryList: [],
			operation: 'add',
		};
	},
	onLoad(e) {
		//console.log(e);

		this.routeId = e.routeId;
		this.order.routeid = e.routeId;
		this.order.route=e.route;
		this.codeData=e.code;
		var code = e.code;
		if (typeof uni.getStorageSync('YjuserInfo') == 'string') {
			var logistics_user = JSON.parse(uni.getStorageSync('YjuserInfo'));
		} else {
			var logistics_user = uni.getStorageSync('YjuserInfo');
		}

		//console.log(logistics_user);
	

		if (e.put == 1) {
			this.put = true;
			this.orderId = e.orderId;
			this.orderbaggage(this.orderId);
		}
		this.isfromchina = e.isfromchina == 4 ? 0 : 1;
		this.order.isfromchina = e.isfromchina == 4 ? 0 : 1;
		if (e.putType == 2) {
			this.putType = 2;
		}
		//console.log(this.order);
		this.circuit(e.routeId);
	},
	onShow() {
		if (uni.getStorageSync('address')) {
			this.addressInfo = uni.getStorageSync('address');
			this.order.recipientaddressid = uni.getStorageSync('address');
		} else {
			this.address();
		}
		this.getUserInfo(this.codeData);

		var that = this;
		//console.log(this.$parcelInfo);
		
		if (this.$parcelInfo.isAdd == 2) {
			if (that.$parcelInfo.Partsinfo) {
				var index = this.$parcelInfo.boxindex;
				if (!this.orderbaggageVoList[index].itemVoList.includes(that.$parcelInfo.Partsinfo)) {
					var data = this.orderbaggageVoList[index].itemVoList.concat(that.$parcelInfo.Partsinfo);
					this.orderbaggageVoList[index].itemVoList = data;
					this.$parcelInfo.orderbaggageVoList = this.orderbaggageVoList;
				}
			}
		} else if (this.$parcelInfo.isAdd == 3) {
			if (this.$parcelInfo.Partsinfo) {
				//console.log(this.$parcelInfo)
				var index = this.$parcelInfo.Partsindex;
				var boxindex = this.$parcelInfo.boxindex;
				var data = this.$parcelInfo.Partsinfo;
				//console.log(data)
				//console.log('pppp')
				if (!this.orderbaggageVoList[boxindex].itemVoList.includes(data)) {
					this.orderbaggageVoList[boxindex].itemVoList[index].name = data.name;
					this.orderbaggageVoList[boxindex].itemVoList[index].photoUrl = data.photoUrl;
					this.orderbaggageVoList[boxindex].itemVoList[index] = data;
					this.$parcelInfo.orderbaggageVoList = this.orderbaggageVoList;
				}
			}
		} else {
			this.orderbaggageVoList = this.$parcelInfo.orderbaggageVoList;
		}
	},
	methods: {
		// 线路	//种类
		circuit(id) {
			var data = {
				id: id
			};
			this.request
				.myRequest({
					url: '/api/route',
					data: data
				})
				.then(res => {
					this.categoryList = JSON.parse(res.data.content[0].price);
					this.$parcelInfo.categoryPriceList = this.categoryList;
					//console.log(this.categoryList);
				});
		},
		//选择种类
		selectCategory(e) {
			//console.log(e)
			this.newItemInfo.category = this.categoryList[e.detail.value].Item;
			//console.log(e);
		},
		//校验快递单号是否有重复

		selectOrderAllAccuracy() {
			var isfromchina = this.isfromchina;
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
					uni.navigateTo({
						//url: './two?isfromchina=' + isfromchina
						url: './three-cost-file'
					});
				});
		},
		//去选择地址
		selectAddress() {
			uni.navigateTo({
				url: '/pages/home/the/new?type=0'
			});
		},
		orderbaggage(orderid) {
			this.request
				.myRequest({
					url: '/api/orderbaggage',
					data: {
						orderid: orderid
					}
				})
				.then(res => {
					if (res.data.content != '') {
						this.orderbaggageVoList = res.data.content;
						this.$parcelInfo.orderbaggageVoList = res.data.content;
					} else {
						this.orderbaggageVoList = this.$parcelInfo.orderbaggageVoList;
					}
				});
		},
		//添加物品
		addItem() {
			if (this.isfromchina == 0) {
				if (
					//this.info.brand == '' ||
					this.newItemInfo.category == '' ||
					this.newItemInfo.claimprice == '' ||
					this.newItemInfo.count == '' ||
					this.newItemInfo.format == '' ||
					this.newItemInfo.name == ''
				) {
					this.$toast('请完善包裹信息');
					return false;
				}
			} else if (this.isfromchina == 1) {
				if (
					//this.info.brand == '' ||
					this.newItemInfo.category == '' ||
					this.newItemInfo.claimprice == '' ||
					this.newItemInfo.count == '' ||
					//this.info.material == '' ||
					this.newItemInfo.name == ''
				) {
					this.$toast('请完善包裹信息');
					return false;
				}
			}
			if(this.newItemInfo.claimprice*1 < 0){
				this.$toast('价格不能小于0');
				return false;
			}
			if(this.newItemInfo.count*1 < 1){
				this.$toast('数量不能小于1');
				return false;
			}
			this.$parcelInfo.Partsinfo = this.newItemInfo;
			if (this.$parcelInfo.Partsinfo) {
				var index = 0; //this.$parcelInfo.boxindex;
				if (!this.orderbaggageVoList[index].itemVoList.includes(this.$parcelInfo.Partsinfo)) {
					var data = this.orderbaggageVoList[index].itemVoList.concat({...this.$parcelInfo.Partsinfo});
					this.orderbaggageVoList[index].itemVoList = data;
					this.$parcelInfo.orderbaggageVoList = this.orderbaggageVoList;
					console.log("++++++++ ", this.$parcelInfo.orderbaggageVoList[0]);
				}
				this.newItemInfo = {
					brand: '',
					category: '',
					claimprice: '',
					count: '',
					format: '',
					name: '',
					photoUrl: '',
					material: ''
				}
				this.operation = "add";
			}
		},
		//确认修改订单包裹
		submitOrder() {
			if(this.orderbaggageVoList == ''){
				this.$toast('箱号不能为空');
				return false;
			}
			for (var i = 0; i < this.orderbaggageVoList.length; i++) {
				if (this.orderbaggageVoList[i].itemVoList == '') {
					this.$toast('箱号不能为空');
					return false;
				}
			}
			if (this.putType == 2) {
				var data={
					orderbaggageVoList: this.orderbaggageVoList,
					id: Number(this.orderId),
					routeid:Number(this.routeId)
				}
			}else{
				var data={
					orderbaggageVoList: this.orderbaggageVoList,
					id: Number(this.orderId)
				}
			}
			//console.log(data)
			// return false
			this.request
				.myRequest({
					url: '/api/order/updateOrder',
					method: 'put',
					data:data
				})
				.then(res => {
					//console.log(res);
					if (res.statusCode == 200 || res.statusCode == 201) {
						this.$toast('修改成功');
						this.$parcelInfo.orderbaggageVoList = [
							{
								itemVoList: []
							}
						];
						this.$parcelInfo.Partsinfo = '';
						this.$parcelInfo.isAdd = '';
						this.$parcelInfo.boxindex = '';
						this.$parcelInfo.order = '';
						this.$parcelInfo.boxindex = '';
						uni.removeStorageSync('put')
					
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500);
					}

					// this.expressageList = res.data;
				});
		},
		//箱号多选
		checkboxChange(e) {
			var index = e.detail.value;

			var data = this.orderbaggageVoList;
			var datas = [];
			for (var j = 0; j < index.length; j++) {
				datas.push(data[index[j]]);
			}
			this.boxData = datas;
		},
		//添加箱号
		addBox() {
			var data = {
				itemVoList: []
			};
			//console.log(this.boxData);
			this.orderbaggageVoList = this.orderbaggageVoList.concat(data);
		},
		//点击删除箱号
		delBox() {
			var data = this.orderbaggageVoList;
			//console.log(data);
			var checkedCities = this.boxData;
			//console.log(checkedCities);
			if (checkedCities.length > 0) {
				var leg = data.length;
				for (var i = 0; i < leg; i++) {
					for (var j = 0; j < checkedCities.length; j++) {
						if (data[i]) {
							if (data[i] == checkedCities[j]) {
								data.splice(i, 1);
							} else {
								data[i].checked = false;
							}
						}
					}
				}
				this.boxData = [];
				this.checkedCities = [];
			}
		},
		//添加内件
		addParts(index) {
			var isfromchina = this.isfromchina;
			this.$parcelInfo.boxindex = index;
			this.$parcelInfo.isAdd = 2;
			var routeId=this.routeId;
			uni.navigateTo({
				url: './parts?isfromchina=' + isfromchina+'&routeId='+routeId
			});
		},
		//编辑
		compile(item, index, indexs) {
			var isfromchina = this.isfromchina;
			this.$parcelInfo.isAdd = 3;
			this.$parcelInfo.boxindex = indexs;
			this.$parcelInfo.Partsindex = index;
			this.$parcelInfo.Partsinfo = item;
			this.newItemInfo = item;
			this.operation = "update";
			//console.log(this.$parcelInfo.Partsinfo);
			var routeId=this.routeId;
			//uni.navigateTo({
			//	url: './parts?isfromchina=' + isfromchina+'&routeId='+routeId
			//});
		},
		//删除内件
		delParts(idx, index) {
			var data = this.orderbaggageVoList[index].itemVoList;
			data.splice(idx, 1);
		},
		navto() {
			//console.log(this.order);
			if (this.isfromchina == 1) {
				if (this.order.domesticnumber == '' || this.order.recipientaddressid == '') {
					this.$toast('请完善运单信息');
					return false;
				}
			} else {
				if (this.order.recipientaddressid == '') {
					this.$toast('请完善运单信息');
					return false;
				}
			}
			if(this.order.ordernumber == ''){
				this.$toast('运单号有误');
				return false;
			}
			this.$parcelInfo.order = this.order;
			if (this.isfromchina == 1) {
				this.selectOrderAllAccuracy();
			} else {
				var isfromchina = this.isfromchina;
				uni.navigateTo({
					//url: './two?isfromchina=' + isfromchina
					url: './three-cost-file'
				});
			}
		},
		navBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		changeInput(e, name) {
			this.parmes[name] = e.detail.value;
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
						this.order.recipientaddressid = res.data.content[0].id;
					}

					//console.log(res.data.content);
				});
		},
		getUserInfo(code) {
		
			this.request
				.myRequest({
					url: '/api/user/getUser',
					data: ''
				})
				.then(res => {
					this.userInfo = res.data;
					var orderstartnumber = res.data.orderstartnumber;
					var time = "2018-01-01 00:00:00";
					     time = time.replace(/\-/g, "/");
					     var d = new Date(time) / 1000;
							
							var dd = Math.round(Date.parse(new Date()) / 1000 - d);
							this.order.ordernumber = code + orderstartnumber + dd.toString();
				})
				.catch(error => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	height: 100vh;
	position: relative;
	display: flex;
	flex-direction: column;
	.top {
		flex: none;
		width: 100%;
		height: 120upx;
		line-height: 120upx;
		padding: 0 30upx;
		box-sizing: border-box;
		text:nth-child(2) {
			margin: 0 15upx;
		}
	}
	.middle {
		flex: 1;
		overflow-y: auto;
	}
	.card {
		width: 94%;
		margin: 20upx auto;
		border-radius: 20upx;
		padding-top: 30upx;
		.title {
			padding-left: 36upx;
			box-sizing: border-box;
			height: 60upx;
			line-height: 60upx;
		}

		.log {
			width: 90%;
			margin: 0 auto 0 auto;

			.item {
				width: 100%;
				display: flex;
				min-height: 100upx;
				align-items: center;
				align-items: center;
				.label {
					flex-basis: 220upx;
					margin: 20upx 0;
					position: relative;

					.text {
						margin-left: 15upx;
						color: #ff0303;
					}
				}

				.ipt {
					flex: 1;
					min-height: 60upx;
					text-align: right;
					line-height: 60upx;
				}
			}
		}
	}
	.oneBtn {
		flex: none;
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
	.operation {
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		padding-right: 30upx;
		box-sizing: border-box;
		view {
			width: 154upx;
			height: 52upx;
			text-align: center;
			line-height: 52upx;
			border-radius: 6upx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.oBtn {
			margin-left: 28upx;
			border: 1px solid #5178ff;
			image {
				margin-right: 10upx;
				width: 16upx;
				height: 2upx;
			}
		}
		.tBtn {
			image {
				width: 16upx;
				height: 16upx;
				margin-right: 10upx;
			}
		}
	}
	.list {
		width: 94%;
		margin: 20upx auto;
		border-radius: 20upx;
		
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
			margin-bottom: 16upx;

			background: #fff;
			.select {
				display: flex;
				height: 60upx;
				justify-content: space-between;
				align-items: center;
				.select-img {
					flex: 1;
					height: 60upx;
					display: flex;
					align-items: center;
					image {
						width: 32upx;
						height: 32upx;
						margin-right: 14upx;
					}
				}
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
			}
			.goots {
				width: 100%;
				margin-top: 20upx;
				.goots-li {
					width: 100%;
					display: flex;
					align-items: center;
					margin-bottom: 28upx;
					.li-num {
						flex-basis: 100upx;
					}
					.li-info {
						flex: 1;
						display: flex;
						align-items: center;
						height: 100upx;
						image {
							width: 100upx;
							height: 100upx;
							border-radius: 10upx;
						}
						text {
							overflow: hidden;
							text-overflow: ellipsis;
							margin-left: 16upx;
							white-space: nowrap;
						}
					}
					.li-btns {
						flex-basis: 200upx;
						display: flex;
						height: 100upx;
						justify-content: space-between;
						align-items: center;
						text {
						}
					}
				}
			}
		}
	}
	.main {
		width: 94%;
		margin: 20upx auto;
		border-radius: 20upx;
		padding: 30upx;
		.title {
			box-sizing: border-box;
			height: 60upx;
			line-height: 60upx;
		}
		.item {
			width: 100%;
			display: flex;
			height: 100upx;
			align-items: center;
			align-items: center;
			.picker_box {
				position: relative;
				width: 100%;
				flex: 1;
				.placeholder_text {
					position: absolute;
					right: 0upx;
					top: 50%;
					font-size: 26upx;
					transform: translateY(-50%);
					color: #999999;
					z-index: 0;
				}
			}
			.label {
				// flex-basis: 220upx;
				margin: 20upx 0;
				position: relative;

				.text {
					margin-left: 15upx;
					color: #ff0303;
				}
			}

			.ipt {
				flex: 1;
				height: 60upx;
				text-align: right;
				line-height: 60upx;
				// z-index: 9999;
			}
		}
		.item-footnote {
			width: 100%;
			display: flex;
			height: 83.3upx;
			align-items: center;
			align-items: center;
			justify-content: center;
		}
		.items {
			width: 100%;
			display: flex;
			height: 134upx;
			align-items: center;
			padding: 20upx 0;
			.lbtn {
				margin-left: 20upx;
				flex-basis: 170upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
			}
			.label {
				flex-basis: 220upx;
				margin: 20upx 0;
				position: relative;

				.text {
					margin-left: 15upx;
					color: #ff0303;
				}
			}
			.ipts {
				flex: 1;
				height: 134upx;
				text-align: right;
				.iptImg {
					height: 120upx;
					width: 120upx;
					margin-top: 7upx;
				}
			}
		}
		.btn-row {
			display: flex;
			justify-content: end;
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
		}
	}
}
</style>
