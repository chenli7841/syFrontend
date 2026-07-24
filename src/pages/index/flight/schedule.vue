<template>
	<view class="index bgColor">
		<u-tabs :list="houseData" :is-scroll="false" :current="current" @change="changeHouse"></u-tabs>
		<view class="list">
			<view class="list-li bfff" @click="toBath(item)" v-for="(item, index) in filteredList" :key="index">
				<view class="num-left c333 f26">
					<text>批次号：{{ item.name }}</text>
				</view>
				<view class="num-left c666 f24">
					<text>运单数量：{{ orderCounts[item.id] !== undefined ? orderCounts[item.id] : '-' }}</text>
				</view>
				<view class="num-left c666 f24">
					<text>预计到港时间：{{ item.arrivaltime ? item.arrivaltime : '-' }}</text>
				</view>
				<u-steps active-color="#85A0FF" un-active-color="#A5B8FC" mode="number" :list="numList" :current="item.stage - 1"></u-steps>
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
			numList: [
				{ name: '集货中' },
				{ name: '装车发货' },
				{ name: '已起航' },
				{ name: '清关中' },
				{ name: '分拣中' },
				{ name: '等待取货' },
				{ name: '完成' }
			],
			list: [],
			houseData: [],
			orderCounts: {},
			current: 0,
			screen: {
				page: 1,
				size: 100,
				grouptype: 40
			}
		};
	},
	computed: {
		// 只展示当前选中仓库（海运/空运）筛选下的批次，按创建时间从旧到新排列
		filteredList() {
			var house = this.houseData[this.current];
			if (!house) {
				return [];
			}
			return this.list
				.filter(item => item.warehouseid === house.id)
				.slice()
				.sort((a, b) => {
					var timeA = a.datecreated ? new Date(a.datecreated.replace(/-/g, '/')).getTime() : 0;
					var timeB = b.datecreated ? new Date(b.datecreated.replace(/-/g, '/')).getTime() : 0;
					return timeA - timeB;
				});
		}
	},
	onLoad() {
		this.house();
		this.getList();
	},
	methods: {
		//仓库列表（海运/空运分类，作为筛选tab）
		house() {
			this.request
				.myRequest({
					url: '/api/warehouse',
					data: { page: 1, size: 100 }
				})
				.then(res => {
					this.houseData = res.data.content;
				});
		},
		changeHouse(index) {
			this.current = index;
		},
		getList() {
			this.status = 'loading';
			this.request
				.myRequest({
					url: '/api/batch/getBatchsAndExpress',
					method: 'GET',
					data: this.screen
				})
				.then(res => {
					// stage为7表示"进行到完成这一步"，大于7才是真正结束的批次，需要隐藏
					this.list = res.data.content.filter(item => item.stage <= 7);
					this.status = 'nomore';
					this.loadOrderCounts();
				})
				.catch(() => {
					this.status = 'nomore';
				});
		},
		//该用户在每个批次内的运单数量（/api/order已按登录用户自动限定范围，用batchId筛出属于本批次的部分再取总数）
		loadOrderCounts() {
			this.list.forEach(item => {
				this.request
					.myRequest({
						url: '/api/order',
						data: { batchId: item.id, page: 1, size: 1 }
					})
					.then(res => {
						this.$set(this.orderCounts, item.id, res.data.totalElements);
					})
					.catch(() => {});
			});
		},
		toBath(item) {
			uni.setStorageSync('yjitem', item);
			uni.navigateTo({
				url: '/pages/index/parcel/batch'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	.list {
		width: 100%;
		.list-li {
			width: 100%;
			margin: 16upx 0;
			padding: 30upx 30upx;
			box-sizing: border-box;
			.num-left {
				margin-bottom: 24upx;
			}
		}
	}
}
</style>
