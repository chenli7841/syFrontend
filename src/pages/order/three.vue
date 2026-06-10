<template>
	<view class="index bgColor">
		<view class="top">
			<text class="c333 fb f40">04</text>
			<text class="c333  f28">填写备注和图片</text>
			<text class="c333 fb f24">(选填)</text>
		</view>
		<view class="card bfff">
			<view class="title f28 fb c333">上传照片</view>
			<view class="log">
				<view class="main" @click="show = true">
					<image v-if="order.photourl != ''" :src="order.photourl" mode=""></image>
					<image v-else src="../../static/order/fadd.png" mode=""></image>
					<view class="">
						{{fileName}}
					</view>
					<text class="f24 c999">上传包裹外包装照片/文件</text>
				</view>
				<u-select v-model="show" @confirm="confirm" :list="list"></u-select>
			</view>
		</view>
		<view class="card bfff">
			<view class="title f28 fb c333">保险金额</view>
			<view class="log log_lp" >
				
				<input
					style="flex:1"
					@input="insuranceInput"
					class="ipt f28 c333"
					type="number"
					v-model="order.insurance"
					placeholder="请输入保险金额"
					placeholder-class="placeholder"
				/>
				<text style="color:#999;font-size:15px">CA$</text>
			</view>
			<view class="title f28 fb c333" v-if="order.insurance > 0" style="margin-top:20px">保费</view>
			<view class="log log_lp" v-if="order.insurance > 0">
				
				<input
					class="ipt f28 c333"
				style="flex:1"
					disabled="true"
					v-model="InsuranceFee"
					placeholder="请输入保险金额"
					placeholder-class="placeholder"
				/>
				<text style="color:#999;font-size:15px">CA$</text>
			</view>
		</view>
		<view class="card bfff">
			<view class="title f28 fb c333">填写运单备注</view>
			<view class="log"><textarea v-model="order.memo" class="area f26 c333" placeholder="请输入备注" /></view>
		</view>
		<view class=" oneBtn">
			<u-button type="primary" :loading="loading" shape="circle" @click="submit" class="lbtn f28 cfff btnColor">保存订单</u-button>
			<view @click="navBack()" class="ubtn f28 c999 ">上一步</view>
		</view>
	</view>
</template>

<script>
	import AWS from 'aws-sdk';
export default {
	data() {
		return {
			InsuranceFee:'',
			fileName:'',
			datas:'',
			show: false,
			datas: '',
			order: {},
			loading: false,
			list: [
				{
					value: '1',
					label: '图片'
				},
				{
					value: '2',
					label: '文件'
				}
			],
			insurance:'',
		};
	},
	onLoad() {},
	onShow() {
		this.order = this.$parcelInfo.order;
		console.log(this.order);
		console.log(this.$parcelInfo.orderbaggageVoList);
	},
	methods: {
		//输入保险金额
		insuranceInput(e){
			console.log(e)
			this.order.insurance=Number(this.order.insurance)
			this.InsuranceFee=e.detail.value*1/10;
		},
		//选择上传文件或图片
		confirm(e) {
			console.log(e);
			if (e[0].value == 1) {
				this.selectFile();
			} else {
				this.chooseMessageFile();
			}
		},
		chooseMessageFile() {
			var that=this;
			uni.chooseFile({
				count: 1,
				type: 'file',
				success: res => {
					console.log(res);
					that.uploadHttpRequestsFile( res.tempFiles[0]);
					that.fileName=res.tempFiles[0].name;
					
				}
			});
		},
		//提交
		submit() {
			console.log(this.$parcelInfo);
			var order = this.order;
			order.orderbaggageVoList = this.$parcelInfo.orderbaggageVoList;
			for (var i = 0; i < this.order.orderbaggageVoList.length; i++) {
				if (this.order.orderbaggageVoList[i].itemVoList == '') {
					this.$toast('箱号不能为空');
					return false;
				}
			}
			console.log(order);
			this.loading = true;
			this.request
				.myRequest({
					url: '/api/order/createOrder',
					data: order,
					method: 'post'
				})
				.then(res => {
					this.$toast('创建成功');
					this.loading = false;

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

					setTimeout(() => {
						uni.navigateBack({
							delta: 3
						});
					}, 1500);
				})
				.catch(error => {
					this.loading = false;
				});
		},
		navBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		selectFile() {
			var that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'],
				success(res) {
					uni.showLoading({
						title: '上传中',
						mask: true
					});
					// tempFilePath可以作为img标签的src属性显示图片
					const tempFilePaths = res.tempFiles[0];

					that.order.photourl = res.tempFilePaths[0];
					that.uploadHttpRequests(tempFilePaths);
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
			//console.log(params);
			bucket.upload(params, function(err, data) {
				if (err) {
					uni.hideLoading();
					that.$toast('上传失败');
					that.order.enclosure = '';
				}
				if (data) {
					console.log(data.Location);
					uni.hideLoading();
					that.datas = data;
					that.order.enclosure = data.Location;
					console.log(that.order);
				}
			});
		},
		// 上传图片
		uploadHttpRequests(param) {
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
			//console.log(params);
			bucket.upload(params, function(err, data) {
				if (err) {
					uni.hideLoading();
					that.$toast('上传失败');
					that.order.photourl = '';
				}
				if (data) {
			
					uni.hideLoading();
					that.datas = data;
					that.order.photourl = data.Location;
					console.log(that.order);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	position: relative;
	margin-bottom: 300px;
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
	.card {
		width: 94%;
		margin: 20upx auto;
		border-radius: 20upx;
		padding: 30upx 0;
		.title {
			padding-left: 36upx;
			box-sizing: border-box;
			height: 60upx;
			line-height: 60upx;
		}
		.log_lp{
			display: flex;
			align-items: baseline;
		}
		.log {
			width: 90%;
			margin: 0 auto 0 auto;
			.main {
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				image {
					width: 164upx;
					height: 164upx;
					margin-bottom: 20upx;
				}
			}
			.area {
				width: 100%;
				height: 320upx;
				background: #f5f5f5;
				border-radius: 20upx;
				padding: 20upx;
				box-sizing: border-box;
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
			margin-right: 20upx;
			border: 1px solid #d1d1d1;
		}
		.lbtn {
			margin: 0 !important;
			padding: 0 !important;
			flex-basis: 170upx !important;
			height: 68upx !important;
			text-align: center;
			line-height: 68upx !important;
			border-radius: 34upx;
		}
	}
}
</style>
