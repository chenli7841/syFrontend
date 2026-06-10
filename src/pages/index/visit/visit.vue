<template>
	<view class="index">
		<view class="card bfff">
			<view class="title f28 fb c333">
				填写收件人信息
			</view>
			<u-form :model="form" ref="uForm">
				<u-form-item label-style="color:#333" label-width='auto' label="姓名" prop="name"><text
						class="text">*</text>
					<u-input class='input' placeholder-style="color:#999999" placeholder='请输入联系人姓名'
						v-model="form.name" />
				</u-form-item>
				<u-line color="#DEDEDE"></u-line>
				<u-form-item label-style="color:#333" label-width='auto' label="电话" prop="phone"><text
						class="text">*</text>
					<u-input class='input' placeholder-style="color:#999999" placeholder='请输入联系人电话'
						v-model="form.phone" />
				</u-form-item>
				<u-line color="#DEDEDE"></u-line>
				<u-form-item label-style="color:#333" label-width='auto' label="取件地址" prop="address"><text
						style="margin: 0;" class="text">*</text>
					<u-input placeholder-style="color:#999999" placeholder='请输入取件地址' class='input'
						v-model="form.address" />
				</u-form-item>
				<u-line color="#DEDEDE"></u-line>
			</u-form>
			<u-button hair-line='false' @click="submit" type='success' class="btn">提交</u-button>
			<view class="">
				<view class="">
					预约上门说明：
				</view>
				<view class=""  style="color:#999;margin-top:20upx">
					{{messageDataS}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messageDataS:"",
				form: {
					name: '',
					phone: null,
					address:''
				},
				rules: {
					name: [{
						required: true,
						message: '请输入联系人姓名',
					}],
					phone: [{
						required: true,
						message: '请输入联系人电话',

					}],
					address: [{
						required: true,
						message: '请输入取件地址',

					}],
				}
			};
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		onLoad() {
			this.messageData()
		},
		methods: {
			
			messageData(){
				this.request.myRequest({
					url:'/api/systemSettings',
					data:{
						enableprofileupdate:0
					}
				}).then((res)=>{
					this.messageDataS=res.data.content[0].schedulepickuptext;
				})
			},
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						//console.log('验证通过');
						this.send()
					} else {
						//console.log('验证失败');
					}
				});
			},
			send() {
				this.request
					.myRequest({
						url: '/api/subscribeHistory',
						data: this.form,
						method: 'POST'
					})
					.then(ress => {
						this.$toast('预约上门信息已提交')
						this.form= {
							name: '',
							phone: null,
							address:''
						}
					})
					.catch(error => {});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.index {
		min-height: 100vh;
		position: relative;

		.card {
			width: 100%;
			// margin: 20upx auto;
			padding: 52upx 30upx;
			box-sizing: border-box;
			// border-top: 16upx solid #F3F3F3;

			.text {
				color: #FF0303;
			}

			.input {
				text-align: right !important;
			}

			.btn {
				width: 80% !important;
				height: 68upx !important;
				line-height: 68upx;
				background: #5178FF !important;
				opacity: 1 !important;
				border-radius: 34upx !important;
				border: none !important;
				// float: right;
				margin-top: 80upx;
				margin-bottom: 80upx;
			}
		}
	}
</style>
