<template>
	<view class="container">
			<text>条形码号</text>
			<input placeholder="请输入" name="input" :value="SN" />
			<button   @tap="ChooseImage">选择照片识别</button>
	</view>
</template>

<script>
	var Quagga = require('../../components/quagga.min.js');
	export default {
		data() {
			return {
				SN:'',
			}
		},
		methods: {
				ChooseImage() {
					var me = this;
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album'], //从相册选择
						success: res => {
							var filePath = res.tempFilePaths[0];
							Quagga.decodeSingle(
								{
									//解码方式，与条形码的编码方式有关
									decoder: {
										readers: [
											'code_128_reader',
											'ean_reader',
											'ean_8_reader',
											'code_39_reader',
											'code_39_vin_reader',
											'codabar_reader',
											'upc_reader',
											'upc_e_reader',
											'i2of5_reader'
										] // List of active readers
									},
									locate: true, // try to locate the barcode in the image
									src: filePath
								},
								function(result) {
									console.log('识别结果', result);
									me.SN = result.codeResult.code;
								}
							);
						}
					});
				},
			}
		}
</script>

<style>
	.intro {
		font-size: 14px;
		line-height: 24px;
	}
</style>
