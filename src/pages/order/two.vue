<template>
	<view class="index bgColor">
		<view class="top">
			<text class="c333 fb f40">03</text>
			<text class="c333  f28">填写运单包裹物品信息</text>
			<text class="c999  f24">(必填)</text>
		</view>
		<view class="operation">
			<view class="oBtn" @click="delBox">
				<image src="../../static/order/jian.png" mode=""></image>
				<text class="f22 capp">删除箱号</text>
			</view>
			<view class="tBtn btnColor" @click="addBox">
				<image src="../../static/order/jia.png" mode=""></image>
				<text class="f22 cfff ">添加箱号</text>
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
							<view class="select-btn" @click="addParts(index)">
								<image src="../../static/order/add.png" mode=""></image>
								<!-- <image src="../../static/order/no" mode=""></image> -->
								<text class="f22 cfff ">添加内件</text>
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
			<!-- <u-checkbox-group width="100%" @change="checkboxGroupChange">
						<u-checkbox 
						width="100%"
						wrap='true'
						shape="circle"
						:label-disabled="false"
						active-color="#5178FF"
							@change="checkboxChange" 
							v-model="item.checked" 
							 
							:name="item.item"
						>
						
						</u-checkbox>
					</u-checkbox-group> -->
		</view>
		<view class="oneBtn" v-if="put == false">
			<view @click="navto()" class="lbtn f28 cfff btnColor">下一步</view>
			<view @click="navBack()" class="ubtn f28 c999 ">上一步</view>
		</view>
		<view class="oneBtn" v-if="put == 1"><view @click="submitOrder()" class="lbtn f28 cfff btnColor">确认修改</view></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			put: false,
			orderId: '',
			checkedCities: [],
			boxData: [],
			isfromchina: '',
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
			routeId: '',
			putType: ''
		};
	},
	onLoad(e) {
		//console.log(e);
		this.isfromchina = e.isfromchina;
		if (e.put == 1) {
			this.put = true;
			this.orderId = e.id;
			this.routeId = e.routeId;
			this.orderbaggage(this.orderId);
		}else{
			this.routeId=this.$parcelInfo.order.routeid
		}
		if (e.putType == 2) {
			this.putType = 2;
		}
	},
	onShow() {
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
		//获取箱子数据
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
		//添加箱号
		addBox() {
			var data = {
				itemVoList: []
			};
			//console.log(this.boxData);
			this.orderbaggageVoList = this.orderbaggageVoList.concat(data);
		},
		//删除内件
		delParts(idx, index) {
			var data = this.orderbaggageVoList[index].itemVoList;
			data.splice(idx, 1);
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
			//console.log(this.$parcelInfo.Partsinfo);
			var routeId=this.routeId;
			uni.navigateTo({
				url: './parts?isfromchina=' + isfromchina+'&routeId='+routeId
			});
		},
		navto() {
			for (var i = 0; i < this.orderbaggageVoList.length; i++) {
				if (this.orderbaggageVoList[i].itemVoList == '') {
					this.$toast('箱号不能为空');
					return false;
				}
			}
			this.$parcelInfo.orderbaggageVoList = this.orderbaggageVoList;
			uni.navigateTo({
				url: './three'
			});
		},
		navBack() {
			this.$parcelInfo.isAdd = 4;
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	position: relative;
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
		width: 100%;
		margin-top: 30upx;
		margin-bottom: 300upx;

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
	.oneBtn {
		position: fixed;
		bottom: 0;
		left: 0;
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
}
.index >>> .u-checkbox__label {
	flex: 1 !important;
}
</style>
