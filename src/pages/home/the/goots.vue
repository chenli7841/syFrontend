<template>
	<view class="index bgColor">
		<u-tabs :list="lists" :is-scroll="false" :current="current" @change="changeCurrent"></u-tabs>
		<!-- <view class="nav bfff">
			<view class="nav-li" @click="changeCurrent(1)">
				<text class="f26" :class="current === 1 ? 'bor-bottom  capp' : 'c333'">国内收货地址</text>
			</view>
			<view class="nav-li" @click="changeCurrent(2)">
				<text class="f26" :class="current === 2 ? 'bor-bottom  capp' : 'c333'">国外收货地址</text>
			</view>
		</view> -->
		<view v-if="list.length > 0">
			<!-- <radio-group name=""  @change="radioChange"> -->
			<view class="" @click.stop="radioChange">
				<view class="item" v-for="(item, index) in list" :key="index">
					<view class="itemleft" @click.stop="toAdd(item)">
						<view class="name">
							<text class="f28 c333">{{ item.consignee }}</text>
							<!-- <text class="f28 c333">{{ item.mobile.substr(0,3) }} **** {{ item.mobile.substr(-4) }}</text> -->
							<text class="f28 c333">{{ item.mobile.substr(0, 3) }}****{{ item.mobile.substr(-4) }}</text>
						</view>
						<view class="address f24 c333">
							<view v-if="item.isDefault == '1'">默认</view>
							<!-- {{ item.address}} -->

							{{item.province}}{{item.city}}{{item.district}}{{ item.detailArea }}
						</view>
					</view>
					<view class="itemBot">
						<view class="radio">
							<radio
								@change="radioChange()"
								:data-id="item.id"
								v-if="item.isDefault != '1'"
								:value="toString(item.id)"
								color="#5178FF"
								:checked="item.isDefault === '1'"
							/>
							<text v-if="item.isDefault != '1'" class="f24 c999">默认地址</text>
						</view>
						<view class="delImg" @click.stop="delAddress(item.id)">
							<text class="f24 c999">删除</text>
							<image src="../../../static/home/del.png" mode=""></image>
						</view>
					</view>
					<!-- <view class="edit" @click="toDetail(2, item)">编辑</view> -->
				</view>
			</view>
			<!-- </radio-group> -->
		</view>
		<view class="botbtn"><view class="viewbtn btnColor f30 cfff" @click="navto()">新增地址</view></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			lists: [
				//{ name: '中国收货地址' }, 
				//{ name: '外国收货地址' }
			],
			current: 1,
			list: [],
			page: 1,
			size: 10,
			isMore: false
		};
	},
	onLoad() {
	
	},
	onShow() {
		this.list = [];
		this.page = 1;
		this.isMore = false;
		this.getList();
	},
	onReachBottom() {
		if (this.isMore) {
			this.getList();
		}
	},
	methods: {
		//设为默认地址
		radioChange(item) {
			//console.log(item);
			var id = item.target.dataset.id;
			var data = {
				id: id,
				isDefault: 1
			};
			this.request
				.myRequest({
					url: '/api/sysShippingAddress',
					method: 'put',
					data:data
				})
				.then(res => {
					this.$toast('操作成功');
					this.list = [];
					this.page = 1;
					this.getList();
				})
				.catch(error => {});
		},
		//获取收货地址
		getList() {
			var data = {
				addresstype: this.current,
				page: this.page,
				size: this.size
			};
			this.request
				.myRequest({
					url: '/api/sysShippingAddress',
					method: 'GET',
					data: data
				})
				.then(res => {
					//console.log(res);
					var list = res.data.content;
					this.list = this.list.concat(list);
					this.isMore = list.length < res.data.totalElements ? true : false;
					if (this.isMore) {
						this.page = this.page + 1;
					}
				})
				.catch(error => {});
		},
		// 删除
		delAddress(id) {
			this.request
				.myRequest({
					url: '/api/sysShippingAddress/' + id,
					method: 'DELETE'
				})
				.then(res => {
					this.$toast('删除成功');
					this.list.map((item, idx) => {
						if (item.id == id) {
							this.list.splice(idx, 1);
						}
					});
				})
				.catch(error => {});
		},
		changeCurrent(index) {
			if (index !== this.current) {
				this.current = index;
				this.list = [];
				this.page = 1;
				this.isMore = false;
				this.getList();
			}
		},
		toAdd(item) {
			var that = this;
			uni.setStorageSync('areaType', that.current);
			uni.setStorageSync('addressInfo', item);
			areaType: uni.getStorageSync('areaType');
			uni.navigateTo({
				url: '/pages/home/the/add?type=' + this.current + '&item=' + JSON.stringify(item)
			});
		},
		navto() {
			var that = this;
			console.log("----------area type: ", that.current);
			uni.setStorageSync('areaType', that.current);
			uni.removeStorageSync('addressInfo');
			uni.navigateTo({
				url: '/pages/home/the/add?type=' + this.current
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	position: relative;
	width: 100%;
	min-height: 100vh;
	// padding-top: 108upx;
	.nav {
		position: fixed;
		width: 100%;
		top: 88upx;
		left: 0;
		height: 88upx;
		padding: 18upx 40upx;
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
	.item {
		padding: 30upx 0;
		align-items: center;
		background-color: #ffffff;
		margin: 20upx 0;
		.itemleft {
			// flex-basis: 74%;

			padding: 20upx 30upx 20upx 40upx;
		}
		.itemleft:not(:last-child) {
			border-bottom: 2upx solid #f1f1f1;
		}
		.name {
			margin-bottom: 14upx;
			display: flex;
			justify-content: space-between;
			text:first-child {
				margin-right: 20upx;
			}
		}
		.itemBot {
			width: 100%;
			display: flex;
			align-items: center;
			padding: 0 30upx 0 40upx;
			box-sizing: border-box;
			height: 50upx;
			justify-content: space-between;
			margin-top: 20upx;
			.radio {
				flex: 1;
			}
			.delImg {
				flex-basis: 180upx;
				height: 50upx;
				display: flex;
				align-items: center;
				flex-direction: row-reverse;
				image {
					width: 38upx;
					height: 38upx;
					margin-left: 15upx;
				}
				text {
				}
			}
		}

		.address {
			color: #666666;
			view {
				width: 80upx;
				height: 36upx;
				text-align: center;
				line-height: 36upx;
				font-size: 24upx;
				border-radius: 40upx;
				background: #fc341e;
				color: #ffffff;
				margin-right: 14upx;
				float: left;
			}
		}
		.edit {
			display: flex;
			justify-content: center;
			align-items: center;
			color: #666666;
			border-left: 2upx solid #f5f5f5;
			padding: 32upx 0;
			flex: 1;
		}
	}
}
</style>
