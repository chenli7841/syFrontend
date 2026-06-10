<template>
	<view class="index bgColor">
		<view class="top">
			<view class="title cfff f26" v-if="item.batchGroupType == 40">
				<text>批次号：{{ item.batchname }}</text>
				<!-- <text>未入库</text> -->
			</view>
			<view class="count">
				<text class="cfff f26">总重量：{{ talWeightkg ? talWeightkg : '-' }}</text>
				<text style="display: none;" class="cfff f26">总费用：${{ order.shippingcost ? order.shippingcost : '-' }}</text>
				<text class="cfff f26">包裹数：{{ info.length || 0 }}</text>
			</view>
			<view class="count">
				<text class="cfff f26">线路：{{ order.route ? order.route : '-' }}</text>
			</view>
		</view>
		<!-- 信息 -->
		<view class="main">
			<view class="cardOne">
				<view class="title c333 f26 fb">内件信息</view>
				<view class="content" v-for="(sonItem, index) in info" :key="index">
					<view class="info">
						<view class="f26 c333">箱号{{ index + 1 }}</view>
						<view class="f24 c666">尺寸：{{ sonItem.length }}cm*{{ sonItem.width }}cm*{{ sonItem.height }}cm （长*宽*高）</view>
						<view class="f24 c666">实重：{{ sonItem.weightkg }}</view>
					</view>
					<view class="" v-if="sonItem.itemVoList">
						<view class="list" v-for="(dto, index) in sonItem.itemVoList" :key="index">
							<view class="li">
								<view class="item">
									<text class="c333 f24">内件名称</text>
									<text class="c666 f24">{{ dto.name }}</text>
								</view>
								<view class="item" v-if="order.isfromchina == 0">
									<text class="c333 f24">规格</text>
									<text class="c666 f24">{{ dto.format || '-' }}</text>
								</view>
							</view>
							<view class="li">
								<view class="item">
									<text class="c333 f24">申报价值</text>
									<text class="c666 f24">￥{{ dto.claimprice || '-' }}</text>
								</view>
								<view class="item">
									<text class="c333 f24">数量</text>
									<text class="c666 f24">{{ dto.count || '-' }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view style="display: none;" class="cardOne">
				<view class="title c333 f26 fb">重量及费用明细</view>
				<view class="content">
					<view class="">
						<view class="list border">
							<view class="li padding">
								<view class="item pad"><text class="c333 f24">总重量</text></view>
								<view class="item bfff pad">
									<text class="c333 f24">{{ talWeightkg ? talWeightkg :'-' }}</text>
								</view>
								<view class="item pad"><text class="c333 f24">运费</text></view>
								<view class="item pad bfff">
									<text class="c333 f24">{{ order.itemcost }}</text>
								</view>
							</view>
							<view class="li padding">
								<view class="item pad"><text class="c333 f24">超长费用</text></view>
								<view class="item bfff pad">
									<text class="c333 f24">{{ order.oversizecost }}</text>
								</view>
								<view class="item pad"><text class="c333 f24">仓库费用</text></view>
								<view class="item pad bfff">
									<text class="c333 f24">{{ order.storagecost }}</text>
								</view>
							</view>
							<view class="li padding">
								<view class="item pad"><text class="c333 f24">总体积</text></view>
								<view class="item bfff pad">
									<text class="c333 f24">{{talVolume.toFixed(2)}}kg</text>
								</view>
								<view class="item pad"><text class="c333 f24">保险</text></view>
								<view class="item pad bfff">
									<text class="c333 f24">{{ order.insurance }}</text>
								</view>
							</view>
							<view class="li padding">
								<view class="item pad"><text class="c333 f24">熏蒸费用</text></view>
								<view class="item bfff pad">
									<text class="c333 f24">{{ order.fumigationcost }}</text>
								</view>
								<view class="item pad"><text class="c333 f24">港杂费</text></view>
								<view class="item pad bfff">
									<text class="c333 f24">{{ order.portmiscost }}</text>
								</view>
							</view>
							<view class="li padding">
								<view class="item pad"><text class="c333 f24">箱数</text></view>
								<view class="item bfff pad">
									<text class="c333 f24">{{ order.baggagenum }}</text>
								</view>
								<view class="item pad"><text class="c333 f24">实收关税</text></view>
								<view class="item pad bfff">
									<text class="c333 f24">{{ order.tax }}</text>
								</view>
							</view>
							<view class="li padding">
								<view class="item pad"><text class="c333 f24">地区附加费</text></view>
								<view class="item bfff pad">
									<text class="c333 f24">{{ order.districtadditionalcost }}</text>
								</view>
								<view class="item pad"><text class="c333 f24">折扣</text></view>
								<view class="item pad bfff">
									<text class="c333 f24">{{ order.discount }}</text>
								</view>
							</view>
						</view>
						<view class="display_end c333 f26 fb" style="margin-top: 36upx;">总费用：${{ order.shippingcost }}</view>
					</view>
				</view>
			</view>
			<view class="cardOne">
				<view class="title c333 f26 fb">运单信息</view>
				<view class="order">
					<view class="order-li">
						<text class="f24 c666">国内单号：{{ order.domesticnumber ? order.domesticnumber : '-' }}</text>
						<text class="f24 c666">国际单号：{{ order.secondtracknumber ? order.secondtracknumber : '-' }}</text>
					</view>
					<view class="order-li">
						<text class="f24 c666">国内快递公司：{{ order.domesticcarrier ? order.domesticcarrier : '-' }}</text>
						<text class="f24 c666">国际快递公司：{{ order.secondcarrier ? order.secondcarrier : '-' }}</text>
					</view>
				</view>
			</view>
			<view style="display: none;" class="cardOne">
				<view class="title c333 f26 fb">收件信息</view>
				<view class="order" v-if="addressData != ''">
					<view class="order-li">
						<text class="f24 c666">{{ addressData.consignee }} {{ addressData.mobile }}</text>
					</view>
					<view class="order-li">
						<text class="f24 c666">{{ addressData.province }} {{ addressData.city }} {{ addressData.district }} {{ addressData.detailArea }}</text>
					</view>
				</view>
			</view>
			<view style="display: none;" class="cardOne">
				<view class="title c333 f26 fb">客户备注</view>
				<view class="order f24 c666">{{ order.memo }}</view>
			</view>
		</view>
	</view>
</template>

<script>
import AWS from 'aws-sdk';
export default {
	data() {
		return {
			enclosureNme: '',
			list: [{}, {}],
			item: '',
			info: [],
			order: {
				itemcost:0,
			},
			money: '',
			volume: '',
			addressData: '',
			res: '',
			talWeightkg:'',
			talVolume:0,
		};
	},
	onLoad(op) {
		this.item = JSON.parse(op.item);
		this.getOrder();
		this.orderInfo();
	},
	onShow() {},
	methods: {
		chooseMessageFile() {
			var that = this;
			uni.chooseFile({
				count: 1,
				type: 'file',
				success: res => {
					//console.log(res);
					that.uploadHttpRequestsFile(res.tempFiles[0]);
					that.fileName = res.tempFiles[0].name;
				}
			});
		},
		uploadHttpRequestsFile(param) {
			var that = this;
			var credentials = {
				accessKeyId: 'AKIAJEPDGNAK3LSG4D7Q',
				secretAccessKey: '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'
			};
			AWS.config.update(credentials);
			AWS.config.region = 'us-east-1'; //设置区域
			var bucket = new AWS.S3({ params: { Bucket: 'eplus-ex' } }); //选择桶
			var ksy =
				Number(new Date()) +
				Math.random()
					.toString(36)
					.substr(2);
			var params = {
				methods: 'put',
				Body: param,
				Key: 'order/' + ksy + '/' + param.name,
				ContentType: param.type,
				'Access-Control-Allow-Credentials': '*',
				ACL: 'public-read'
			};
			////console.log(params);
			bucket.upload(params, function(err, data) {
				if (err) {
					uni.hideLoading();
					that.$toast('上传失败');
					that.order.enclosure = '';
				}
				if (data) {
					//console.log(data.Location);
					uni.hideLoading();
					that.datas = data;
					that.order.enclosure = data.Location;
					//console.log(that.order);
					that.updateOrder();
				}
			});
		},
		download() {
			window.location.href = this.order.enclosure;
		},
		updateOrder() {
			var that = this;
			var data = {
				id: this.order.id,
				enclosure: this.order.enclosure
			};
			this.request
				.myRequest({
					url: '/api/order/updateOrder',
					method: 'put',
					data: data
				})
				.then(res => {
					//console.log(res);
					if (res.statusCode == 200 || res.statusCode == 201) {
						this.$toast('修改成功');

						setTimeout(() => {
							that.orderInfo();
						}, 1500);
					}
				});
		},
		orderInfo() {
			var data = {
				orderId: this.item.id
			};
			this.request
				.myRequest({
					url: '/api/order/queryOrder',
					data: data
				})
				.then(res => {
					//console.log(res);
					this.order = res.data;
					//console.log(this.order);
					this.volume = res.data.length * res.data.width * res.data.height;
					if (this.order.enclosure) {
						this.enclosureNme = this.order.enclosure.split('/').slice(-1)[0];
					}
					  this.money =
					          this.order.fumigationcost +
					          this.order.portmiscost +
					          this.order.storagecost +
					          this.order.oversizecost +
					          this.order.itemcost +
					          this.order.insurance+this.order.districtadditionalcost+this.order.tax;
					// this.money =
					// 	res.data.fumigationcost +
					// 	res.data.portmiscost +
					// 	res.data.remotecost +
					// 	res.data.storagecost +
					// 	res.data.oversizecost +
					// 	res.data.itemcost -
					// 	res.data.discount;
					this.address(res.data.recipientaddressid);
				});
		},
		address(id) {
			var data = {
				id: id
			};
			this.request
				.myRequest({
					url: '/api/sysShippingAddress',
					data: data
				})
				.then(res => {
					if(res.data.content != ''){
							this.addressData = res.data.content[0];
					}
				
				});
		},
		getOrder() {
			var data = {
				orderid: this.item.id
			};
			this.request
				.myRequest({
					url: '/api/orderbaggage',
					data: data
				})
				.then(res => {
					//console.log(res);
					this.info = res.data.content;
					   this.info.forEach(e => {
					          this.talWeightkg+=e.weightkg*1;
					          this.talVolume+=(e.height*1 *e.width*1*e.length*1)/5000;
					
					        });
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
		height: 220upx;
		background: #5178ff;
		padding: 40upx 30upx;
		box-sizing: border-box;
		.title {
			display: flex;
			justify-content: space-between;
		}
		.count {
			margin-top: 15upx;
			text:nth-child(2) {
				margin: 0 30upx;
			}
		}
	}
	.main {
		width: 100%;
		.cardOne {
			width: 100%;
			padding: 30upx;
			box-sizing: border-box;
			background: #ffffff;
			margin-top: 16upx;
			.btns {
				display: flex;
				justify-content: center;
				view {
					flex-basis: 202upx;
					height: 60upx;
					text-align: center;
					line-height: 60upx;
					border-radius: 44upx;
					display: flex;
					justify-content: center;
					align-items: center;
					image {
						width: 20upx;
						height: 24upx;
					}
				}
				.cbtn {
					border: 1px solid #5178ff;
					margin-right: 48upx;
				}
				.bbtn {
				}
			}
			.imgs {
				display: flex;
				image {
					flex-basis: 160upx;
					height: 160upx;
					margin-right: 16upx;
				}
			}
			.title {
				height: 100upx;
				line-height: 100upx;
			}
			.order {
				width: 100%;
				.order-li {
					display: flex;
					justify-content: space-between;
					margin-bottom: 16upx;
				}
			}
			.content {
				margin-top: 50upx;
				.title {
					height: 100upx;
					line-height: 100upx;
				}

				.info {
					margin-top: 20upx;
					view {
						text-align: center;
					}
					view:nth-child(2) {
						margin: 10upx 0;
					}
				}
				.border {
					border: 2upx solid #e7edf6;
					border-radius: 20upx;
				}
				.list {
					border-radius: 10upx;
					background: #f6f9fc;
					width: 100%;
					margin-top: 20upx;
					.padding {
						padding: 0 !important;
						margin-bottom: 1upx !important;
					}
					.li {
						width: 100%;
						display: flex;
						padding: 30upx 0;
						margin-bottom: 20upx;
						.item {
							flex: 1;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
						}
						.pad {
							padding: 30upx 0;
							box-sizing: border-box;
						}
					}
				}
			}
		}
	}
}
</style>
