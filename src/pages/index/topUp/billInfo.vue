<template>
	<view class="main">
		<view class="nav">
			<view class="nav-li" :class="current == 0 ? 'active' : ''" @click="changeCurrent(0)">全部</view>
			<view class="nav-li" :class="current == 1 ? 'active' : ''" @click="changeCurrent(1)">
				筛选
				<!-- <image v-if="current == 1" src="../../static/dropdown_red.png" class=""></image> -->
				<!-- <image v-if="current == 0" src="../../static/dropdown.png" class="arrimg"></image> -->
			</view>
		</view>
		<view class="pop" v-if="isSearch">
			<!-- <view class="pop-title">分类</view> -->
			<view class="pop-main">
				<view class="pop-li" @click="searchItem(item)" v-for="(item, index) in typeList" :key="index">{{ item.name }}</view>
			</view>
		</view>
		<view class="top" @click="showPicker">
			<picker mode="date" @change="getdate" fields="month" class="datepicker">
				<view class="text_l">
					<view class="f30 c333 fb">{{ time }}</view>
					<view class="scerp">
						
					</view>
					<!-- <image src="../../static/dropdown.png" class="arrimg"></image> -->
				</view>
			</picker>
			<!-- <view class="monycount">
				<text class="marginRight20">收入：{{inAmount}}</text>
				<text>支出：{{outAmount}}</text>
			</view> -->
		</view>
		<view>
			<view class="body">
				<view class="item" v-for="(item, index) in list" :key="index">
				
						
							<view class="f26 c333 display_between">
								<view class="fb">
									账单类型：{{ item.label }}
								</view>
								<view class="capp f26">
									{{ item.fromuserdisplayamount ? item.fromuserdisplayamount : item.amount }}
								</view>
								
							</view>
							<view class="countT" @click="toOrder(item)">
								<text class="textO f24 c333">运单号：</text>
								<text class="textT f24 capp underline">{{ item.orderNumber }}</text>
							</view>
							<view class="countT" @click="toBatch(item)">
								<text class="textO f24 c333">批次号：</text>
								<text class="textT f24 capp underline">{{ item.batchName }}</text>
							</view>
							<!-- <view class="f26 c333">
								批次号：{{item.batchName?item.batchName:'-'}}
							</view> -->
							<view class="f26 c333">
								支付方式：{{item.method}}
							</view>
							<view class="countT" v-if="item.couponnumber">
								<text class="textO f24 c333">优惠券码：</text>
								<text class="textT f24 c333">{{ item.couponnumber }}</text>
							</view>
							<view class="f26 c333">账单时间：{{ item.date }}</view>
					

						
					

					<!-- <view class="">
						<view class="f32">{{ item.amount }}</view>
						<view class="f24">{{ item.date }}</view>
					</view> -->
				</view>
			</view>
		</view>
		<view v-if="isSearch" @click="moveHandle" class="mask"></view>
	</view>
</template>

<script>
//交易记录
// import noMore from '../../index/components/noMore.vue';
// import { dateTime } from '@/utils/common.js';
export default {
	components: {
		// noMore
	},
	data() {
		return {
			time: '全部',
			allmony: 0,
			datestr: '',
			endstr: '',
			list: [],
			page: 1,
			size: 10,
			total: 0,
			startDate: '',
			endDate: '',
			mystr: '08:09:04',
			current: 0,
			isSearch: false,
			noMore: false,
			appInfo: {},
			dateList: [],
			businessType: '',
			typeList: [
				{
					code: 0,
					name: '运单支付'
				},

				{
					code: 1,
					name: '余额调整'
				},
				{
					code: 2,
					name: '活动充值'
				},
				{
					code: 3,
					name: '理赔款项'
				},
				{
					code: 5,
					name: '给自己充值'
				},
				{
					code: 6,
					name: '给他人充值'
				},
				{
					code: 7,
					name: '收取运费'
				},
				{
					code: 8,
					name: '运费返利'
				},
				{
					code: 9,
					name: '仓库使用费'
				},
				{
					code: 10,
					name: '批次扣款'
				},
				{
					code: 11,
					name: '结算调整'
				},
				{
					code: 12,
					name: '优惠券'
				}
			],
			screen: {
				current: 1,
				size: 20,
				queryType: 1,
			},
			inAmount: 0,
			outAmount: 0
		};
	},
	onLoad() {
		this.getThe();
	},
	methods: {
		//包裹详情
		toOrder(item) {
			if(!item.orderid){
				return false
			}
			var items={
				id:item.orderid,
				
			}
			uni.navigateTo({
				url: '../parcel/luggage?item=' + JSON.stringify(items)
			});
		},
		//批次详情
		toBatch(item) {
			if(!item.batchid){
				return false
			}
			let items={
				name:item.batchName,
				id:item.batchid
			}
			uni.setStorageSync('yjitem',items)
			uni.navigateTo({
				url: '../parcel/batch'
			});
		},
		moveHandle(){
			this.isSearch=false
		},
		//点击显示
		showPicker() {},
		//收入支出/

		//获取明细
		getThe() {
			this.request
				.myRequest({
					url: '/api/balancehistory',
					data: this.screen
				})
				.then(res => {
					let data = res.data.content;
					this.list = this.list.concat(data);
					this.list.forEach(element => {
						const matched = this.typeList.find(({ code }) => code === element.type);
						if (matched) {
							element.label = matched.name;
						}
					});
					this.noMore = this.list.length < res.data.totalElements;
					if (this.noMore) {
						this.screen.current = this.screen.current + 1;
					}
					console.log(this.list);
				})
				.catch(error => {});
		},
		//点击具体的筛选
		searchItem(item) {
			this.isSearch = false;
			this.screen.current = 1;
			this.list = [];
			this.screen.type = item.code;
			this.getThe();
		},
		//点击切换头部
		changeCurrent(index) {
			if (index === 0) {
				this.current = index;
				this.isSearch = false;
				this.screen = {
					current: 1,
					size: 20,
					queryType: 1,
				};
				this.list = [];
				this.getThe();
			}
			if (index === 1) {
				this.current = index;
				this.isSearch = !this.isSearch;
			}
		},
		formtime(s) {
			let t = new Date();
			t.setTime(s);
			return `${t.getFullYear()}-${t.getMonth() + 1}-${t.getDate()}`;
		},
		getdate(e) {
			this.datestr = e.detail.value;
			console.log(this.mystr);
			console.log(Number('08'));
			let t = new Date(this.datestr);
			let y = t.getFullYear();
			let m = t.getMonth() + 1;
			let y1 = m == 12 ? y + 1 : y;
			let d = t.getDate();
			let m1 = m == 12 ? 1 : m + 1;
			if (y < 10) y = '0' + y;
			if (m < 10) m = '0' + m;
			if (d < 10) d = '0' + d;
			if (m1 < 10) m1 = '0' + m1;
			this.time = `${y}-${m}`;
			this.screen.startDate = `${y}-${m}-${d}${' '}${'00:00:00'}`;
			this.screen.endDate = `${y1}-${m1}-${d}${' '}${'00:00:00'}`;
			this.screen.current = 1;
			this.list = [];
			this.getThe();
		}
	},
	mounted() {
		let t = new Date();
		let y = t.getFullYear();
		let m = t.getMonth();
		let d = t.getDate();
		let m1 = m + 1;
		if (y < 10) y = '0' + y;
		if (m < 10) m = '0' + m;
		if (d < 10) d = '0' + d;
		if (m1 < 10) m1 = '0' + m1;
		console.log(y, m, d, m1);

		this.datestr = `${y}-${m1}-${d}`;
		this.startDate = `${y}-${m}-${d}`;
		this.endDate = `${y}-${m1}-${d}`;
	},
	onReachBottom() {
		if (this.noMore) {
			this.getThe();
		}
	}
};
</script>

<style lang="scss" scoped>
.active {
	color: #5178FF !important;
}
.scerp{
	  width: 0;
	             height: 0;
	             border-width: 15upx;
	             border-style: solid;
	             border-color:  #000  transparent transparent transparent;
				 margin-bottom: -15upx;
				 margin-left: 10upx;
}
.main {
	color: #333333;
	font-family: PingFang SC;
	font-size: 32upx;
	position: relative;
	min-height: 100vh;
	.mask {
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 5;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.5;
	}

	.nav {
		width: 100%;
		height: 88upx;
		display: flex;
		align-items: center;
		position: fixed;
		z-index: 100;
		background: #fff !important;
		/* #ifdef APP-PLUS */
		top: 0;
		/* #endif */
		/* #ifdef H5 */
		top: 0upx;
		/* #endif */

		left: 0;

		.nav-li {
			flex: 1;
			text-align: center;
			line-height: 88upx;
			font-size: 30upx;
			color: #333;
		}

		view:nth-child(2) {
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				display: inline-block;
				width: 20upx;
				height: 14upx;
				margin-left: 10upx;
			}
		}
	}

	.pop {
		width: 100%;
		height: auto;
		position: fixed;
		z-index: 10;
		top: 80upx;
		left: 0;
		background: #fff;
		padding: 20upx 40upx;
		box-sizing: border-box;

		.pop-title {
			height: 60upx;
			line-height: 60upx;
			font-size: 30upx;
			color: #333;
		}

		.pop-main {
			width: 100%;
			display: flex;
			margin-top: 20upx;
			flex-wrap: wrap;
			// justify-content: space-between;
			padding-bottom: 20upx;

			.pop-li {
				width: 210upx;
				height: 68upx;
				margin: 0 5upx;
				text-align: center;
				line-height: 68upx;
				background: #f5f5f5;
				border-radius: 4upx;
				font-size: 28upx;
				color: #333;
				margin-bottom: 20upx;
			}
		}
	}

	.top {
		width: 100%;
		// height: 128upx;
		background-color: #eeeeee;
		padding: 28upx 40upx 16upx 40upx;
		box-sizing: border-box;
		position: relative;
		// top: 88upx;
		padding-top: 122upx;
		.text_l {
			display: flex;
			align-items: center;
		}

		picker {
			view {
			}

			position: relative;
			display: flex;
			align-items: center;
			.arrimg {
				width: 18upx;
				height: 14upx;
				margin-left: 20upx;
			}
		}

		.monycount {
			text {
				margin-top: 12upx;
				color: #999999;
				font-size: 28upx;
			}
		}
	}

	.body {
		background-color: #fff;
		.item {
			padding: 30upx 40upx;
			box-sizing: border-box;
		
			height: auto;
		
			border-bottom: 1px solid #eeeeee;
view{
	margin-bottom: 10upx;
}
			.item-s1 {
				display: flex;
				flex-direction: column;

				text:nth-child(1) {
					font-size: 28upx;
					font-weight: 600;
				}

				text:nth-child(2) {
					color: #707070;
					margin-top: 14upx;
					font-size: 24upx;
				}

				text:nth-child(3) {
					color: #666666;
					margin-top: 6upx;
					font-size: 24upx;
				}
			}

			.item-s2 {
				margin-left: 86upx;
				font-weight: 600;

				.money {
					color: #333;
				}

				text {
					color: #e2231a;
					font-size: 32upx;
				}
			}
		}
	}
}
</style>
