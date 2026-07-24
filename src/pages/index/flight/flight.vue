<template>
	<view class="index bgColor">
		<u-tabs :list="tabs" :is-scroll="false" :current="current" @change="change"></u-tabs>
		<view class="list">
			<view class="list-li bfff" @click="toBath(item)" v-if="current == 0" v-for="(item, index) in list" :key="index">
				<view class="num-left c333 f26">
					<text>批次号：{{ item.name }}</text>
				</view>
				<u-steps active-color="#85A0FF" un-active-color="#A5B8FC" mode="number" :list="numList" :current="item.stage-1"></u-steps>
				<!-- <view class="btn" @click="toBath(item)" >
					
				</view> -->
			</view>
			<view class="list-li bfff text_center" v-if="current == 1" v-for="(item, index) in list" :key="index">
				<view class="num-left c333 f26 text_center">
					<text>批次号：{{ item.name }}</text>
				</view>
				<u-circle-progress
					active-color="#FFD35A"
					border-width="20"
					:percent=" item.totalWeightKg > item.targetweightkg 
                            ? 100
                            : item.totalWeightKg / item.targetweightkg ? (item.totalWeightKg / item.targetweightkg).toFixed(
                                2
                              ) * 100 : 0"
				>
					<view class="u-progress-content">
						<view class="u-progress-dot"></view>
						<text class="u-progress-info">{{  item.totalWeightKg > item.targetweightkg 
                            ? 100+'%'
                            : item.totalWeightKg / item.targetweightkg ? (item.totalWeightKg / item.targetweightkg).toFixed(
                                2
                              ) * 100+'%' : 0}}</text>
					</view>
				</u-circle-progress>
				<!-- <view class="num-left c333 f26 text_center" style="margin-top: 20upx;"><text>预计3月初截单</text></view> -->
				<image @click="toBath(item)" src="../../../static/index/jt.png" class="arrows" mode=""></image>
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
				nomore: '--------'
			},
			status: 'loading',
			numList: [
				{
					name: '集货中'
				},
				{
					name: '装车发货'
				},
				{
					name: '已起航'
				},
				{
					name: '清关中'
				},
				{
					name: '分拣中'
				},
				{
					name: '等待取货'
				},
				{
					name: '完成'
				}
			],
			tabs: [
				{
					name: '运输中'
				},
				{
					name: '集货中'
				}
			],
			current: 0,
			list: [],
			page: 1,
			size: 10,
			isMore: false,
			screenB: {
				routetype: 1,
				grouptype: 40,
				stage: 1,
				page: 1,
				size: 100
			},
			screenA: {
				page: 1,
				size: 100,
				routetype: 1,
				grouptype: 40,
				stages: '2,3,4,5,6'
			}
		};
	},
	onLoad() {
		this.getList();
	},
	onShow() {},
	onReachBottom() {
		if (this.isMore) {
			this.getList();
		}
	},
	methods: {
		//批次详情
		toBath(item) {
			uni.setStorageSync('yjitem', item);
			uni.navigateTo({
				url: '/pages/index/parcel/batch'
			});
		},
		getList() {
				this.status='loading'
			if (this.current == 0) {
				var data = this.screenA;
				var YjuserInfo=uni.getStorageSync('YjuserInfo');
				data.createdbyid=YjuserInfo.id
			} else {
				var data = this.screenB;
			}
			this.request
				.myRequest({
					url: '/api/batch/getBatchsAndExpress',
					method: 'GET',
					data: data
				})
				.then(res => {
					//console.log(res);
					this.list = res.data.content;
					this.status='nomore'
				})
				.catch(() => {
					this.status = 'nomore';
				});
		},
		details() {
			uni.navigateTo({
				url: '/pages/index/flight/logisticsDetails'
			});
		},
		change(index) {
			this.list=[];
			this.current = index;
			this.getList();
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
			.num-left {
				margin-bottom: 24upx;
			}
			.btn {
				width: 208upx;
				height: 60upx;
				background: #85a0ff;
				opacity: 1;
				border-radius: 12upx;
				text-align: center;
				line-height: 60upx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 24upx;
				font-family: PingFang SC;
				font-weight: 400;

				color: #ffffff;
				margin: 42upx auto 0;
			}
			.arrows {
				width: 112upx;
				height: 52upx;
				display: block;
				margin: 0 auto;
			}
		}
	}
}
</style>
