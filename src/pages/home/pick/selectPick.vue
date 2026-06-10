<template>
	<view class="index bfff">
		<view class="top f28 c333 fb">自提地址选择</view>
		<view class="top f28 c333 fb" @click="areaShow = true">地区筛选</view>
		<u-picker mode="selector" @confirm="confirm" range-key="realName" v-model="areaShow"  :range="areaList"></u-picker>
		<view class="main">
			<radio-group class="radio" name="" @change="select">
				<view class="item" v-for="(item, index) in address" :key="index">
					<radio class="radioSon" color="#5178FF" :value="String(index)" />
					<view class="info">
						<view class="f28 c333">{{ item.name }} {{ item.phone }}</view>
						<view class="f28 c333 hid">{{ item.detailArea }}</view>
					</view>
				</view>
			</radio-group>
			<view class="pickBtn f28 cfff btnColor" @click="submit">确认</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			areaList: [
				{ realName: 'BC-British columbia', id: 1 },
				{ realName: 'MB-Manitoba', id: 2 },
				{ realName: 'ON-Ontario', id: 3 },
				{ realName: 'QC-Quebec', id: 4 },
				{ realName: 'SK-Saskatchewan', id: 5 },
				{ realName: 'AB-Alberta', id: 6 },
				{ realName: 'NL-Newfoundland', id: 7 },
				{ realName: 'NB-New Brunswick', id: 8 },
				{ realName: 'NS-Nova Scotia', id: 9 },
				{ realName: 'PEI-PEI', id: 10 },
				{ realName: 'NV-Nunavut', id: 11 },
				{ realName: 'NT-Northwest Territories', id: 12 },
				{ realName: 'YK-Yukon', id: 13 }
			],
			areaShow: false,
			id: '',
			fid: '',
			address: [],
			pickUpLocationId: '',
			areaid:"",
		};
	},
	onLoad(r) {
		if (r.id) {
			this.id = r.id;
			this.fid = r.fid;
			this.pickUpLocations();
		}
	},
	onShow() {},
	methods: {
		confirm(e){
			console.log(e);
			this.areaid=this.areaList[e[0]].id;
			this.pickUpLocations();
		},
		editUserInfo(payload) {
			this.request
				.myRequest({
					url: '/api/user/updateUser',
					method: 'PUT',
					data: payload
				})
				.then(res => {
					uni.showToast({
						title: '修改成功',
						duration: 2000,
						icon: 'none'
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1500);
				})
				.catch(error => {});
		},
		submit() {
			if (this.pickUpLocationId == '') {
				this.$toast('请选择自提点');
				return false;
			}
			this.editUserInfo({ id: this.id, pickUpLocationId: this.pickUpLocationId, pickuplocation: this.pickuplocation });
		},
		select(e) {
			//console.log(e)
			this.pickUpLocationId = this.address[e.detail.value].id;
			this.pickuplocation = this.address[e.detail.value].name;
		},
		//自提点列表

		pickUpLocations() {
			this.address = [];
			var data = {
				category: 0,
				sort: 'number,asc',
				areaid: this.areaid,
				visible: true,
				companyId:2,
			};
			this.request
				.myRequest({
					url: '/api/pickUpLocation',
					data: data
				})
				.then(res => {
					this.address = res.data.content;
					this.pickUpLocationss(this.fid);
				});
		},

		pickUpLocationss(belongsToId) {
			var data = {
				belongsToId: belongsToId,
				category: 1,
				sort: 'number,asc',
				areaid: this.areaid,
				visible: true,
				companyId:2,
			};
			this.request
				.myRequest({
					url: '/api/pickUpLocation',
					data: data
				})
				.then(res => {
					for (var i = 0; i < res.data.content.length; i++) {
						if (!this.address.includes(res.data.content[i])) {
							this.address.push(res.data.content[i]);
						}
					}
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	.top {
		padding: 0 20upx;
		box-sizing: border-box;
		height: 116upx;
		line-height: 116upx;
	}
	.main {
		width: 100%;
		padding: 0 20upx;
		box-sizing: border-box;
		margin-bottom: 200upx;
		.radio {
			width: 100%;

			.item {
				// height: 188upx;
				padding: 26upx 18upx;
				box-sizing: border-box;
				display: flex;
				margin: 18upx 0;
				background: #f8fafe;
				.radioSon {
					flex-basis: 32upx;
				}
				.info {
					flex: 1;
				}
			}
		}
		.pickBtn {
			border-radius: 40upx;
			text-align: center;
			line-height: 68upx;
			height: 68upx;
			width: 94%;
			margin: 50upx auto 0;
			position: fixed;
			bottom: 80upx;
			left: 3%;
		}
	}
}
</style>
