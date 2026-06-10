<template>
	<view class="container">
		<form action="">
			<view class="content">
				<view class="item">
					<label for="">收货人</label>
					<input type="text" @input="inputChange($event, 'consignee')" placeholder="请填写真实姓名" name="consignee" :value="item && item.consignee" />
				</view>
				<view class="item">
					<label for="">手机号码</label>
					<input type="number" @input="inputChange($event, 'mobile')" placeholder="请填写电话" name="mobile" maxlength="11" :value="item && item.mobile" />
				</view>
				<view class="item">
					<label for="">{{type == 0 ? '省市区':'省市'}}</label>
					<uniManypicker @getArea="trigger" :id="item.id"></uniManypicker>
				</view>
				<view class="item" v-if="type != 0">
					<label for="">详细地址</label>
					<input v-model="item.detailArea" type="text" placeholder="请输入收货地址" />
					<view class="searchBtn btnColor" @click="searchCannada">搜索</view>
				</view>

				<gmap-map v-if="type != 0" id="mapa" :center="centers" :zoom="11" map-type-id="terrain" style="width:100%; height: 400px"></gmap-map>

				<view class="item" v-if="type == 0">
					<label for="">详细地址</label>
					<input type="text" @input="inputChange($event, 'detailArea')" name="detailArea" placeholder="请填写详细地址" :value="item && item.detailArea" />
				</view>
				<view class="item" v-if="type == 0">
					<label for="">身份证号</label>
					<input
						type="number"
						@input="inputChange($event, 'idcardnumber')"
						placeholder="请填写姓名对应的身份证号"
						name="idcardnumber"
						:value="item && item.idcardnumber"
					/>
				</view>

				<!-- <view class="items item" v-if="item.id"><label for="" class="del" @click="del">删除收货地址</label></view>
				<view class="footer">
					<view><button formType="submit" type="primary">保存</button></view>
				</view> -->
			</view>
		</form>
		<view class="code bfff" v-if="type == 0">
			<view class="title f26 c666">上传身份证照片</view>
			<view class="imgs">
				<view class="img" @click="selectFile(1)">
					<image v-if="item.idcardfronturl != ''" :src="item.idcardfronturl" mode=""></image>
					<image v-else src="../../../static/home/f.png" mode=""></image>
				</view>
				<view class="img" @click="selectFile(2)">
					<image v-if="item.idcardbackurl != ''" :src="item.idcardbackurl" mode=""></image>
					<image v-else src="../../../static/home/z.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="botbtn"><view class="viewbtn btnColor f30 cfff" @click="formSubmit">保存</view></view>
		<!-- <u-picker mode="region" v-model="isshow"  @confirm="confirmRegion" >
			
		</u-picker> -->
	</view>
</template>

<script>
import AWS from 'aws-sdk';
import uniManypicker from '../../../components/uni-manypicker/uni-manyPicker.vue';
export default {
	components: {
		uniManypicker
	},
	data() {
		return {
			centers: {
				lat: 45.4215296,
				lng: -75.69719309999999
			},
			idcardbackurl: '',
			idcardfronturl: '',
			imgType: '',
			areaId: null,
			address: null,
			isDefault: 1,
			isshow: false,
			phoneTest: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
			item: {
				idcardbackurl: '',
				idcardfronturl: ''
			},
			type: 1,
			params: {
				province: true,
				city: true,
				area: true
			},
			province: '',
			city: ''
		};
	},
	onLoad(op) {
		this.type = op.type;
		if (op.item) {
			this.item = JSON.parse(op.item);
			//console.log(this.item)
			
			if (this.item.latAndLng) {
				var center = this.item.latAndLng.split(',');
				var that = this;
				this.province=this.item.detailArea.split(',')[2];
				this.city=this.item.detailArea.split(',')[1];
				that.centers = {
					lat: Number(center[0]),
					lng: Number(center[1])
				};
				setTimeout(() => {
					const map = new google.maps.Map(document.getElementById('mapa'), {
						zoom: 8,
						center: that.centers
					});
					new google.maps.Marker({
						map: map,
						position: that.centers
					});
				}, 2000);
			}
			this.address = this.item.province + this.item.city + this.item.district;
			uni.setNavigationBarTitle({
				title: '编辑收货地址'
			});
		}
	},
	methods: {
		searchCannada() {
			const map = new google.maps.Map(document.getElementById('mapa'), {
				zoom: 8,
				center: { lat: 45.421, lng: -75.697 }
			});
			const address =this.item.detailArea + ',' + this.city + ',' + this.province;
			this.$axios({
				//接口地址  api-代理+接口端口号之后的其余地址
				url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyAlx_o5RTm4wEEgnxe8v3s_9T7KOEj3C4k' + '&language=en'
			}).then(response => {
				//验证数据是否获取到
				//console.log(response.data);

				var data = response.data.results[0].formatted_address.split(',');

				if (data.length < 3) {
					this.$message({
						showClose: true,
						message: '请输入详细的地理位置',
						type: 'warning'
					});
					return false;
				}
				this.item.detailArea = response.data.results[0].formatted_address.split(',')[0] + ',' + this.city + ',' + this.province;
				this.item.latAndLng = response.data.results[0].geometry.location.lat + ',' + response.data.results[0].geometry.location.lng;

				var arar = data[data.length - 3];
				//console.log(this.item);
				var code = response.data.results[0].address_components[response.data.results[0].address_components.length - 1].types[0];
				if (code == 'postal_code') {
					this.item.postalcode = response.data.results[0].address_components[response.data.results[0].address_components.length - 1].long_name;
				}
				// this.canadaArea(arar)
				map.setCenter(response.data.results[0].geometry.location);
				new google.maps.Marker({
					map: map,
					position: response.data.results[0].geometry.location
				});
			});

			//  this.geocodeAddress(geocoder, map);
		},
		//选择图片
		selectFile(e) {
			var that = this;
			this.imgType = e;
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
					var tempFilePaths = res.tempFiles[0];
					//console.log(res);
					if (that.imgType == 1) {
						that.item.idcardfronturl = res.tempFilePaths[0];
					} else {
						that.item.idcardbackurl = res.tempFilePaths[0];
					}

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
			var ksy =
				Number(new Date()) +
				Math.random()
					.toString(36)
					.substr(2);
			var bucket = new AWS.S3({ params: { Bucket: 'eplus-ex' } }); //选择桶
			var params = {
				methods: 'put',
				Body: param,
				Key: 'address/' + ksy + '/' + param.name,
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
					if (that.imgType == 1) {
						that.item.idcardfronturl = data.Location;
					} else {
						that.item.idcardbackurl = data.Location;
					}
					//console.log(that.item)
				}
			});
		},
		confirmRegion(e) {
			this.item.province = e.province.label;
			this.item.city = e.city.label;
			this.item.district = e.area.label;
			this.address = this.item.province + this.item.city + this.item.district;
		},
		show() {
			this.isshow = true;
		},
		inputChange(e, name) {
			this.item[name] = e.detail.value;
		},
		onchange(e) {
			const value = e.detail.value;
			const areaId = e.detail.code[2];
			this.item.areaId = areaId;
			this.address = value[0] + value[1] + value[2];
		},
		onnodeclick(node) {},
		// 获取区的id
		trigger(e) {
			console.log(e, this.type,'asd');
			if (this.type == 0) {
				if (e.area.length == 2) {
					this.item.province = e.area[0];
					this.item.city = e.area[1];
					this.item.district = '';
				} else {
					this.item.province = e.area[0];
					this.item.city = e.area[1];
					this.item.district = e.area[2];
				}
				this.item.areaId = e.id;
			} else {
				this.province = e.area[0];
				this.city = e.area[1];
				this.item.district = '';
				this.item.areaId = e.id;
			}
		},
		switchChange(e) {
			this.isDefault = e.target.value == true ? 1 : 0;
		},
		formSubmit(e) {
			var data = this.item;
			//console.log(data);
			if (!data.consignee) {
				this.$toast('请填写收货人');
				return false;
			}
			if (!data.mobile) {
				this.$toast('请填写手机号');
				return false;
			}
			// if (data.mobile.length < 11) {
			// 	this.$toast('手机号长度错误')
			// 	return false;
			// }
			// if (!this.phoneTest.test(data.mobile)) {
			// 	this.$toast('手机号格式错误')
			// }
			if (!data.areaId && data.addresstype == 0) {
				this.$toast('请选择省市区');
				return false;
			}
			if (!data.detailArea) {
				this.$toast('请填写详细地址');
				return false;
			}
			if (this.type == 0) {
				if (!data.idcardnumber) {
					this.$toast('请填写身份证号');
					return false;
				}
				if (data.idcardbackurl == '' || data.idcardfronturl == '') {
					this.$toast('请上传身份证照片');
					return false;
				}
			}

			// var userInfo = uni.getStorageSync('userInfo');
			var params = {
				consignee: data.consignee,
				addresstype: this.type,
				mobile: data.mobile,
				detailArea: data.detailArea,
				province: data.province,
				city: data.city,
				district: data.district,
				idcardnumber: data.idcardnumber,
				idcardbackurl: data.idcardbackurl,
				idcardfronturl: data.idcardfronturl,
				areaId: data.areaId,
				latAndLng: data.latAndLng
			};
			if (!this.item.id) {
				params.isDefault = false;
				this.request
					.myRequest({
						url: '/api/sysShippingAddress',
						data: params,
						method: 'POST'
					})
					.then(ress => {
						//console.log(ress)
						this.$toast('新增成功');
						setTimeout(() => {
							uni.$emit('add');

							uni.navigateBack();
						}, 1000);
					})
					.catch(error => {
						//console.log(error)
					});
			} else {
				params.id = this.item.id;
				params.isDefault = this.item.isDefault;
				this.request
					.myRequest({
						url: '/api/sysShippingAddress',
						data: params,
						method: 'PUT'
					})
					.then(res => {
						this.$toast('修改成功');
						setTimeout(() => {
							uni.navigateBack();
						}, 1000);
					})
					.catch(error => {});
			}
		},
		del() {
			this.request
				.myRequest({
					url: '/api/sysShippingAddress/' + this.item.id,
					method: 'DELETE'
				})
				.then(res => {
					uni.showToast({
						title: '删除成功',
						duration: 1000,
						icon: 'none'
					});
					setTimeout(function() {
						uni.navigateBack();
					}, 1000);
				})
				.catch(error => {});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f5f5f5 !important;
}

.container {
	font-size: 28upx;
	border-top: 6upx solid #f5f5f5;
	margin-bottom: 300upx;
}
.code {
	width: 100%;
	padding: 0 32upx 80upx;
	box-sizing: border-box;
	margin-top: 16upx;

	.title {
		height: 120upx;
		line-height: 120upx;
	}
	.imgs {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.img {
			width: 320upx;
			height: 192upx;
			image {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}
	}
}
.content {
	.item {
		display: flex;
		align-items: center;
		border-bottom: 2upx solid #f5f5f5;
		padding: 40upx 20upx;
		background-color: #fff;

		label {
			margin-right: 30upx;
			color: #333333;
			display: block;
			width: 18%;
			// flex: 1;
		}

		input {
			color: #999;
			flex: 1;
			font-size: 28upx;
			padding: 0 20upx 0 0;
			box-sizing: border-box;
		}
	}

	.items {
		justify-content: space-between;
		margin-top: 10upx;
	}

	.del {
		color: #fe1a2a !important;
	}
}

.footer {
	position: fixed;
	bottom: 0;
	left: 0;
	display: flex;
	width: 100%;
	height: 140upx;
	background-color: #fff;
	align-items: center;
	justify-content: center;
	z-index: 99;

	view {
		width: 90%;
		display: flex;
		align-items: center;
	}

	button {
		height: 80upx;
		width: 100%;
		font-size: 28upx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fc341e;
		border-radius: 40upx;
		color: #fff;
	}

	button::after {
		border: none;
	}
}
.searchBtn {
	padding: 15upx 30upx;
	box-sizing: border-box;
	color: #fff;
	border-radius: 10upx;
	// flex: 1;
}
::v-deep .picker {
	color: #999;
}
</style>
