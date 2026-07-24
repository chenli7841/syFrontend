<template>
	<view class="index bgColor">
		<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view class="list" v-if="current == 0">
			<view class="list-li bfff" v-for="(item, index) in orderList" :key="index">
				<view class="num">
					<view class="c333 f26">
						<text>批次号：{{ item.name }}</text>
					</view>
				</view>
				<view class="count">
					<view class="countO">
						<text class="textO f24 c666">包裹数：{{ item.number }}</text>
						<text class="textT f24 c666">总重量：{{ item.totalWeightKg.toFixed(2) }}</text>
						<text class="textT f24 c666">总费用：{{ item.totalShippingCost.toFixed(2) }}</text>
					</view>
				</view>
				<view class="btn"><text @click="toBath(item)" class="f24 capp">批次详情</text></view>
			</view>
		</view>
		<u-loadmore :status="status" :icon-type="iconType" :load-text="loadText" />
	</view>
</template>

<script>

export default {
	data() {
		return {
			iconType: 'flower',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '正在加载',
				nomore: '--------'
			},
			status: 'loading',
			screenBatch: {
				name: '',
				aeronumber: '',
				ordernumber: '',
				page: 1,
				size: 10,
				grouptype: 60,
				routetype: 1
			},
			orderList: [],
			list: [
				{
					name: '货运提货'
				},
			],
			current: 0
		};
	},
	onLoad() {
		this.batch();
	},
	methods: {
		//批次详情
		toBath(item) {
			uni.setStorageSync('yjitem', item);
			uni.navigateTo({
				url: '/pages/index/parcel/batch'
			});
		},
		change(index) {
			this.current = index;
		},
		//批次列表
		batch() {
			this.request
				.myRequest({
					url: '/api/batch',
					data: this.screenBatch
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
						this.screenBatch.page = this.screenBatch.page + 1;
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
	.list {
		width: 100%;
		// padding-top: 16upx;
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
