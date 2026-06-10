<template>
	<view class="index bgColor">
		
	
		<view class="main bfff">
			<view class="items borDb" v-if="isfromchina == 0">
				<input style="flex:1" v-model="goods"  type="text" value="" placeholder="请输入物品中文名称" />
				<view @click="search" class="lbtn f28 cfff btnColor">搜索</view>
				<u-select @confirm="confirmRote" value-name="indexs" label-name="name" v-model="show" mode="single-column" :list="goodsData"></u-select>
			</view>
			<view class="item-footnote f24 c333 borDb">
				我们会默认购买申报价值1%的商业保险
			</view>
			<!--
			<view class="items borDb">
				<view class="label f28 c333">
					商品图片
				</view>
				<view class="ipts" @click="selectFile">
					<image class="iptImg" v-if="info.photoUrl" :src="info.photoUrl" mode=""></image>
					<image class="iptImg" v-else src="../../static/order/img.png" mode=""></image>
				</view>
			</view>
			-->
			<view class="item borDb">
				<view class="label f28 c333">
					内件名称
					<text class="text">*</text>
				</view>
				<input class="ipt f28 c333" v-model="info.name" placeholder="请输入物品中文名称" placeholder-class="placeholder" />
			</view>
			<!--
			<view class="item borDb">
				<view class="label f28 c333">
					品牌
					<text class="text">*</text>
				</view>
				<input class="ipt f28 c333" v-model="info.brand" placeholder="请输入品牌" placeholder-class="placeholder" />
			</view>
			-->
			<view class="item borDb" v-if="isfromchina == 0">
				<view class="label f28 c333">
					规格
					<text class="text">*</text>
				</view>
				<input class="ipt f28 c333" type="text" v-model="info.format" placeholder="请输入规格" placeholder-class="placeholder" />
			</view>
			<!--
			<view class="item borDb" v-if="isfromchina == 1" @click="show = true">
				<view class="label f28 c333">
					材质
					<text class="text">*</text>
				</view>
				<view class="picker_box">
					<view class="placeholder_text" v-if="!info.material">请选择材质</view>
					<picker class="ipt f28 c333" v-model="info.material" :range="cities" @change="selectMaterial">
						<view>{{ info.material }}</view>
					</picker>
				</view>
			</view>
			-->
			<view class="item borDb">
				<view class="label f28 c333">
					申报价值(RMB)
					<text class="text">*</text>
				</view>
				<input class="ipt f28 c333" min='0' type="digit" v-model="info.claimprice" placeholder="我们会默认购买申报价值1%的商业保险" placeholder-class="placeholder" />
				
			</view>
			<view class="item borDb">
				<view class="label f28 c333">
					数量
					<text class="text">*</text>
				</view>
				<input class="ipt f28 c333" min='1' type="number" v-model="info.count" placeholder="请输入数量" placeholder-class="placeholder" />
			</view>
			<view class="item">
				<view class="label f28 c333">
					种类
					<text class="text">*</text>
				</view>
				<view class="picker_box">
					<view class="placeholder_text" v-if="!info.category">请选择种类</view>
					<picker class="ipt f28 c333" mode="selector" value="1" range-key="Item" :range="categoryList" @change="selectCategory">
						<view>{{ info.category ? info.category : '' }}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class=" oneBtn">
			<view @click="navBack(1)" class="lbtn f28 cfff btnColor">保存</view>
			<view @click="navBack(2)" class="ubtn f28 c999 ">取消</view>
		</view>
	</view>
</template>

<script>
import AWS from 'aws-sdk';
export default {
	data() {
		return {
			datas: '',
			action: '*',
			show: false,
			cities: ['金属', '木质', '棉麻', '塑料', '玻璃', '针织', '皮革', '纤维', '液体', '纸质', '石质', '硅胶', '食品', '药品', '化学材料'],
			info: {
				brand: '',
				category: '',
				claimprice: '',
				count: '',
				format: '',
				name: '',
				photoUrl: '',
				material: ''
			},
			categoryList: [],
			isfromchina: '',
			routeId: '',
			goods:"",
			goodsData:[],
			show:false,
		};
	},
	onLoad(e) {
		this.routeId = e.routeId;
		this.circuit(e.routeId);
		this.isfromchina = e.isfromchina;
		if (this.$parcelInfo.isAdd == 3) {
			if (this.$parcelInfo.Partsinfo) {
				this.info = this.$parcelInfo.Partsinfo;
				this.$parcelInfo.isAdd == 5;
			}
		}
	},
	onShow() {},
	methods: {
		confirmRote(e){
			var index=e[0].value;
			var data=this.goodsData[index];
			//console.log(this.goodsData[index]);
			
			   
			        this.info.brand= data.brand;
			         this.info.category= data.details;
			 
			        this.info.format= data.format;
			        this.info.name= data.name;
	
		},
		//搜索回国物品
		search(){
			var data={
				   name: this.goods,
				        page: 1,
				        size: 100,
			}
			this.request.myRequest({
				url:"/api/item",
				data:data
			}).then(res=>{
				this.goodsData=res.data.content;
				this.goodsData.forEach((item,index)=>{
					item.indexs=index
				})
				this.show=true;
				//console.log(this.goodsData)
			})
		},
		// 线路	//种类
		circuit(id) {
			var data = {
				id: id
			};
			this.request
				.myRequest({
					url: '/api/route',
					data: data
				})
				.then(res => {
					this.categoryList = JSON.parse(res.data.content[0].price);
					//console.log(this.categoryList);
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
					//console.log(res);
					that.info.photoUrl = res.tempFilePaths[0];
					that.uploadHttpRequests(tempFilePaths);
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
			   var ksy = Number(new Date()) + Math.random().toString(36).substr(2);
			var params = {
				methods: 'put',
				Body: param,
				  Key: 'order/'+ksy+'/'+param.name,
				ContentType: param.type,
				'Access-Control-Allow-Credentials': '*',
				ACL: 'public-read'
			};
			////console.log(params);
			bucket.upload(params, function(err, data) {
				if (err) {
					uni.hideLoading();
					that.$toast('上传失败');
					that.info.photoUrl = '';
				}
				if (data) {
					//console.log(data);
					uni.hideLoading();
					that.datas = data;
					that.info.photoUrl = data.Location;
				}
			});
		},
		//选择材质
		selectMaterial(e) {
			//console.log(e);
			this.info.material = this.cities[e.detail.value];
		},
		//选择种类
		selectCategory(e) {
			//console.log(e)
			this.info.category = this.categoryList[e.detail.value].Item;
			//console.log(e);
		},

		navBack(e) {
			if (e == 1) {
				if (this.isfromchina == 0) {
					if (
						//this.info.brand == '' ||
						this.info.category == '' ||
						this.info.claimprice == '' ||
						this.info.count == '' ||
						this.info.format == '' ||
						this.info.name == ''
					) {
						this.$toast('请完善包裹信息');
						return false;
					}
				} else if (this.isfromchina == 1) {
					if (
						//this.info.brand == '' ||
						this.info.category == '' ||
						this.info.claimprice == '' ||
						this.info.count == '' ||
						//this.info.material == '' ||
						this.info.name == ''
					) {
						this.$toast('请完善包裹信息');
						return false;
					}
				}
				if(this.info.claimprice*1 < 0){
					this.$toast('价格不能小于0');
					return false;
				}
				if(this.info.count*1 < 1){
					this.$toast('数量不能小于1');
					return false;
				}
			
				this.$parcelInfo.Partsinfo = this.info;
				//console.log(this.$parcelInfo.Partsinfo);
			}
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	.main {
		width: 100%;
		padding: 0 30upx;
		box-sizing: border-box;
		.item {
			width: 100%;
			display: flex;
			height: 100upx;
			align-items: center;
			align-items: center;
			.picker_box {
				position: relative;
				width: 100%;
				flex: 1;
				.placeholder_text {
					position: absolute;
					right: 0upx;
					top: 50%;
					font-size: 26upx;
					transform: translateY(-50%);
					color: #999999;
					z-index: 0;
				}
			}
			.label {
				// flex-basis: 220upx;
				margin: 20upx 0;
				position: relative;

				.text {
					margin-left: 15upx;
					color: #ff0303;
				}
			}

			.ipt {
				flex: 1;
				height: 60upx;
				text-align: right;
				line-height: 60upx;
				// z-index: 9999;
			}
		}
		.item-footnote {
			width: 100%;
			display: flex;
			height: 83.3upx;
			align-items: center;
			align-items: center;
			justify-content: center;
		}
		.items {
			width: 100%;
			display: flex;
			height: 134upx;
			align-items: center;
			padding: 20upx 0;
			.lbtn {
				margin-left: 20upx;
				flex-basis: 170upx;
				height: 68upx;
				text-align: center;
				line-height: 68upx;
				border-radius: 34upx;
			}
			.label {
				flex-basis: 220upx;
				margin: 20upx 0;
				position: relative;

				.text {
					margin-left: 15upx;
					color: #ff0303;
				}
			}
			.ipts {
				flex: 1;
				height: 134upx;
				text-align: right;
				.iptImg {
					height: 120upx;
					width: 120upx;
					margin-top: 7upx;
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
