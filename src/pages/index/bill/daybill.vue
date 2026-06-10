<template>
	<view class="index bgColor">
		<view class="top">
			<view class="one">
				<text class="textO c333 f26 fb">按{{ type == 1 ? '月' : '日' }}统计</text>
				<picker v-if="type == 2"  value="YYYY-MM-dd" class="picker" mode="date" @change="dateChange">
					<view class="f22 c333">{{ date }}</view>
				</picker>
				<picker v-if="type == 1"  value="YYYY-MM" fields="month" class="picker" mode="date" @change="dateChange">
					<view class="f22 c333">{{ date }}</view>
				</picker>
				<text class="textT cfff btnColor f20" @click="searchBtn">搜索</text>
			</view>
		</view>
		<view class="list bfff">
			<view class="header">
				<text class="f24 c333">日期</text>
				<text class="f24 c333">现金进账</text>
				<text class="f24 c333">余额进账</text>
				<text class="f24 c333">出账</text>
				<text class="f24 c333">累计</text>
				<text class="f24 c333">确认</text>
			</view>
			<view class="main">
				<view class="types">
					<view class="types-li" v-for="(item, index) in orderList" :key="index">
						<text class="f22 c333">{{ item.date }}</text>
						<text class="f22 c333">{{ item.cashEntry }}</text>
						<text class="f22 c333">{{ item.balanceEntry }}</text>
						<text class="f22 c333">{{ item.accountOut }}</text>
						<text class="f22 c333">{{ item.cumulative }}</text>
						<text class="ybtn f22 cfff btnColor" v-if="!item.isConfirm" @click="handle(item)">确认</text>
						<text class="ybtn f22 cfff bC6CBDC" v-if="item.isConfirm">已核销</text>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			date: '请选择日期',
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			isMore: null,
			orderList: [],
			status: 'loading',
			list: [{}, {}, {}],
			screen: {
				recordType: 2,
				page: 1,
				size: 10
			}
		};
	},
	onLoad(e) {
		this.type = e.type;
		this.screen.recordType = e.type;
	},
	onShow() {
		this.orderList = [];
		this.screen.page = 1;
		this.orderLists();
	},
	//加载更多
	onReachBottom() {
		if (this.isMore) {
			this.orderLists();
		}
	},
	methods: {
		searchBtn() {
			this.orderList = [];
			this.screen.page = 1;
			this.orderLists();
		},
		dateChange(e) {
			var date = e.detail.value.split('-');
			if(date.length > 0){
				if (this.type == 1) {
				
					this.screen.date = date[0] + '年' + date[1]+'月';
				} else {
					this.screen.date = date[0] + '年' + date[1] + '月' + date[2] + '日';
				}
			}else{
				this.screen.date=''
			}
			
			console.log(this.screen.date)
			this.date = e.detail.value;
			// this.screen.date = e.detail.value;
		},
		orderLists() {
			this.status = 'loading';
			this.request
				.myRequest({
					url: '/api/recordBalanceHistory',
					data: this.screen
				})
				.then(res => {
					//console.log(res)
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
				});
		},
		handle(e) {
			this.request
				.myRequest({
					url: '/api/recordBalanceHistory',
					data: {
						id: e.id,
						isConfirm: true
					},
					method: 'put'
				})
				.then(res => {
					uni.showToast({
						title: '账单已确认核销',
						icon: 'success',
						duration: 1500
					});
					this.orderList = [];
					this.screen.page = 1;
					this.orderLists();
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	.top {
		width: 100%;
		background: #fff;
		.one {
			width: 100%;
			display: flex;
			height: 120upx;
			align-items: center;
			padding: 0 30upx;
			box-sizing: border-box;
			.textO {
				flex-basis: 144upx;
			}
			.picker {
				flex: 1;
				height: 56upx;
				line-height: 56upx;
				border: 1px solid #dedede;
				padding: 0 30upx;
				box-sizing: border-box;
				border-radius: 10upx;
			}
			.textT {
				flex-basis: 96upx;
				height: 54upx;
				text-align: center;
				line-height: 54upx;
				border-radius: 8upx;
				margin-left: 14upx;
			}
		}
	}
	.list {
		width: 100%;
		padding: 30upx 0;
		box-sizing: border-box;
		.header {
			width: 94%;
			margin: 0 auto;
			// padding: 0 30upx;
			box-sizing: border-box;
			background: #eff0f3;
			display: flex;
			justify-content: space-between;
			height: 64upx;
			align-items: center;
			text {
				flex: 1;
				text-align: center;
			}
		}
		.main {
			width: 100%;
			.types {
				width: 100%;
				box-sizing: border-box;
				padding: 0 20upx;
				.types-li {
					width: 100%;
					display: flex;
					justify-content: space-between;
					height: 64upx;
					align-items: center;
					margin: 20upx 0;
					text {
						flex: 1;
						text-align: center;
					}
					.ybtn {
						display: inline-block;
						padding: 10upx 0;
						border-radius: 6upx;
					}
				}
			}
		}
	}
}
</style>
