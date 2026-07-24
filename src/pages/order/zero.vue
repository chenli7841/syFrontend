<template>
	<view class="index bgColor">
		<view class="top">
			<text class="c333 fb f40">02</text>
			<text class="c333  f28">选择线路</text>
			<text class="c999  f24">(必填)</text>
		</view>
		<view class="list">
			<view class="list-li"  @click="toOne(item.id, item.code, item.type,item.name)" v-if="item.isShow" v-for="(item, index) in circuitData" :key="index">
				<view class="info">
					<image class="image" :src="item.photo" mode=""></image>
					<view class="info-name">
						<view class="f26 c333">{{ item.name }}</view>
						<view class="f24 c999 ">{{ item.description }}</view>
					</view>
				</view>
				<view class="add"><image src="../../static/order/ri.png" mode=""></image></view>
			</view>
		</view>
        <view class=" oneBtn">
			<view @click="navBack()" class="ubtn f28 c999 ">上一步</view>
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
				nomore: '--------'
			},
			status: 'loading',
			put: false,
			orderId: '',
			circuitData: [],
            warehouseId: 0,
		};
	},
	// data(){
	// 	return {
	//
	// 	}
	// },
	onLoad(e) {
		this.warehouseId = e.warehouseId;		
	},
	onShow() {
		if(uni.getStorageSync('put') == true){
			var data=uni.getStorageSync('upDateOrder');
			this.put = true;
			
			this.orderId = data.id;
			// uni.removeStorage('put');
			// uni.removeStorage('upDateOrder');
		}else{
			this.put = false;
		}
		this.house();
	},
	methods: {
		//线路权限
		bannedUserRoute(id) {
			if (typeof uni.getStorageSync('YjuserInfo') == 'string') {
				var logistics_user = JSON.parse(uni.getStorageSync('YjuserInfo'));
			} else {
				var logistics_user = uni.getStorageSync('YjuserInfo');
			}
			var data = {
				userid: logistics_user.id
			};
			this.request
				.myRequest({
					url: '/api/bannedUserRoute',
					data: data
				})
				.then(res => {
					var consoles = [
						{
							routeid: 19
						},
						{
							routeid: 34
						},
						{
							routeid: 33
						}
					];
					this.circuit(id, res.data.content);
				})
				.catch(() => {
					this.status = 'nomore';
				});
		},
		//仓库
		house() {
            this.bannedUserRoute(this.warehouseId);
		},
		// 线路
		circuit(warehouseid, contents) {
				this.status='loading'
			var data = {
				page: 1,
				size: 100,
				warehouseid: warehouseid
			};
			this.request
				.myRequest({
					url: '/api/route',
					data: data
				})
				.then(res => {
					
					if(contents.length > 0 && res.data.content.length > 0){
						res.data.content.forEach((item, index) => {
							const matched = contents.find(({ routeid }) => routeid === item.id);
						
							if (matched) {
								item.isShow=false;
								// res.data.content.splice(index, 1);
							}else{
								item.isShow=true;
							}
							this.status='nomore'
						});
					}else{
						if(res.data.content.length > 0){
							res.data.content.forEach((item, index) => {
								item.isShow=true;
								this.status='nomore'
							});
						}
						
					}
				
					this.status='nomore'
					this.circuitData = res.data.content;
					console.log(res.data.content);
				})
				.catch(() => {
					this.status = 'nomore';
				});
		},
		toOne(e, code, isfromchina,route) {
			uni.removeStorageSync('address');
			uni.removeStorageSync('address');

			if(this.put){
							var isfromchina=isfromchina == 4 ? 0 :1;
				uni.navigateTo({
					url: './two?routeId=' + e + '&code=' + code + '&isfromchina=' + isfromchina+'&orderId='+this.orderId+'&put=1'+'&putType=2'+'&route='+route
				});
			}else{
				uni.navigateTo({
					url: './one?routeId=' + e + '&code=' + code + '&isfromchina=' + isfromchina+'&route='+route
				});
			}
		},
        navBack() {
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
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
</style>
