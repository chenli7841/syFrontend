<template>
	<view class="index">
		<view class="card bfff" v-if="link == ''">
			<u-form :model="form" ref="uForm">
				<u-form-item label-width="80px" label="充值类型：" prop="name">
					<u-radio-group style="margin-left: 20upx;" v-model="form.rechargeType" @change="radioGroupChange">
						<u-radio @change="radioChange" v-for="(item, index) in list" :key="index" :name="item.value" :disabled="item.disabled">{{ item.name }}</u-radio>
					</u-radio-group>
				</u-form-item>

				<u-form-item v-if="form.rechargeType == 0" label-width="80px" label="充值账户：">
					<u-input class="input" placeholder-style="color:#999999" disabled placeholder="" v-model="number" />
				</u-form-item>

				<u-form-item label-width="80px" label="充值金额：" prop="rechargeMoney">
					<u-input @input="rechargeMoneyInput" placeholder-style="color:#999999" type="number" placeholder="请输入充值金额" class="input" v-model="form.rechargeMoney" />
				</u-form-item>
				<u-form-item v-if="form.rechargeType == 1" label-width="80px" label="用户代码：" prop="userNumber">
					<u-input class="input" placeholder-style="color:#999999" placeholder="请输入用户代码" v-model="form.userNumber" />
				</u-form-item>

				<u-form-item v-if="form.rechargeType == 1" label-width="80px" label="手机号：" prop="canadaPhoneNumber">
					<u-input placeholder-style="color:#999999" type="number" placeholder="请输入手机号" class="input" v-model="form.canadaPhoneNumber" />
				</u-form-item>
				<u-form-item label-width="80px" label="充值方式："></u-form-item>
			</u-form>
			<u-radio-group :wrap="wrap" v-model="form.payTypes">
				<u-radio @change="ClickPayType" :name="item.type" v-if="item.isshow" class="radio" v-for="(item, index) in payList" :key="index">
					<view class="upList display_between">
						<image class="upListIocm" src="../../../static/index/c14.png" mode="widthFix"></image>
						<view class="">
							<view class="f28 c333">{{ item.name }}</view>
							<view class="f24 cplor">手续费{{ item.serviceCharge }}%</view>
						</view>
						<view class="">
							<view class="f24 cplor">预计支付金额</view>
							<view class="f26 capp">CA${{ item.service ? item.service : 0 }}</view>
						</view>
						<view class=""></view>
					</view>
				</u-radio>
			</u-radio-group>
			<u-button @click="submit('uForm')" type="success" :loading="loading" class="btn">确认充值</u-button>
		</view>
		
		<iframes v-if="link != ''" :link="link"></iframes>
	</view>
</template>

<script>
import iframes from './pay.vue';
export default {
	components: {
		iframes
	},
	data() {
		return {
			accessToken:'',
			href:'',
			isWx:'',
			loading: false,
			link: '',
			rules: {
				rechargeType: [
					{
						required: true,
						message: '请选择充值类型'
					}
				],
				rechargeMoney: [
					{
						required: true,
						message: '请输入充值金额'
					}
				],
				canadaPhoneNumber: [
					{
						required: true,
						message: '请输入加拿大手机号'
					}
				],
				userNumber: [
					{
						required: true,
						message: '请输入用户代码'
					}
				]
			},
			payList: [],
			wrap: true,
			list: [
				{
					name: '本人充值',
					disabled: false,
					value: 0
				},
				{
					name: '代他人充值',
					disabled: false,
					value: 1
				}
			],
			// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
			value: 'orange',
			number: '',
			form: {
				rechargeType: 0,
				payTypes: ''
			},
			token:'',
		};
	},
	onHide() {
		this.loading = false;
	},
	onLoad(e) {
		this.token=e.token;
		
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	onShow() {
		var t=this;
		uni.setStorageSync('YjaccessToken',t.token)
		this.payType();
		this.user();
		
		
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == 'micromessenger') { 
		      this.isWx=true;
			  
		}else{
		   this.isWx=false;
		}
		
		
	},
	methods: {
		user() {
			var logistics_user = uni.getStorageSync('YjuserInfo');

			var data = {
				id: logistics_user.id
			};
			this.request
				.myRequest({
					url: '/api/user',
					data: data
				})
				.then(res => {
			
					this.number = res.data.content[0].canadaphonenumber;
				});
		},
		submit(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.form.payTypes == '') {
						uni.showToast({
							title: '请选择充值方式',
							icon: 'none'
						});
						return false;
					}
					if(this.form.payTypes == 1 || this.form.payTypes == 2){
						if(this.isWx && this.form.payTypes == 2){
							uni.showToast({
								title: "请点击右上角'...'，选择打开浏览器付款",
								icon: 'none',
								duration:6000
							});
							return false;
						}
						if(this.form.payTypes == 1){
							this.form.payType=3;
						}else if(this.form.payTypes == 2){
							this.form.payType=4;
						}
						delete this.form.payTypes;
						
						this.form.rechargeMoney = Number(this.form.rechargeMoney);
						// delete this.form.number;
						this.loading = true;
						this.request
							.myRequest({
								url: '/api/pay/toPayForRecharge',
								data: this.form,
								method: 'post'
							})
							.then(res => {
								console.log(res);
								// this.href=res.data.url;
								location.href = res.data.url;
								
							})
							   .catch((err) => {
							            console.log('ffffff')
							            uni.showToast({
							            	title: err.data.message,
							            	icon: 'none'
							            });
							            this.loading=false;
							            });
					}else if(this.form.payTypes == 3){
						this.form.payType=6;
						delete this.form.payTypes;
						this.form.rechargeMoney = Number(this.form.rechargeMoney);
						// delete this.form.number;
						this.loading = true;
						this.request
							.myRequest({
								url: '/api/pay/toUnionPayPayForRecharge',
								data: this.form,
								method: 'post'
							})
							.then(res => {
								console.log(res);
								// this.href=res.data.url;
								window.location.href=res.data
								// document.write(res.data)
								// location.href = res.data.url;
								
							})
							   .catch((err) => {
							            console.log('ffffff')
							            uni.showToast({
							            	title: err.data.message,
							            	icon: 'none'
							            });
							            this.loading=false;
							            });
					}
					
					
				} else {
					//console.log('验证失败');
				}
			});
		},
		rechargeMoneyInput() {
			console.log(this.form.rechargeMoney * 1);
			if (this.form.rechargeMoney * 1 < 0) {
				this.$message.error('充值金额不能小于0');
				this.form.rechargeMoney = '';
				return false;
			}
			this.payList.forEach(item => {
				item.service =Math.ceil((  this.form.rechargeMoney * 1 * (item.serviceCharge / 100) +this.form.rechargeMoney * 1)* 100) / 100;
				// item.service = (this.form.rechargeMoney * 1 * (item.serviceCharge / 100) + this.form.rechargeMoney * 1).toFixed(2);
			});
			this.form.payType = '';
			console.log(this.payList);
			this.$forceUpdate();
		},
		//选择充值支付
		ClickPayType(e) {
			console.log(e);
			
			for (var i = 0; i < this.payList.length; i++) {
				if (e == this.payList[i].type) {
					this.form.rechargeMoneyWithCharge = Number(this.payList[i].service);
					break;
				}
			}
		},
		radioChange(e) {
			console.log(e);
		},
		radioGroupChange(e) {
			// console.log(e)
		},
		//支付方式
		payType() {
			this.request
				.myRequest({
					url: '/api/payMethod',
					data: {}
				})
				.then(res => {
					res.data.content.forEach((item, index) => {
						// if (item.type == 1) {
						// 	item.type = 3;
						// }
						// if (item.type == 2) {
						// 	item.type = 4;
						// }
						// if (item.type == 3) {
						// 	item.type = 5;
						// }
						if (item.type == 0) {
							item.isshow = false;
						} else {
							item.isshow = true;
						}
						item.service = 0;
					});
					this.payList = res.data.content;
					console.log(this.payList);
					this.$forceUpdate();
					// console.log()
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	position: relative;
	.cplor {
		color: #7480a5;
	}
	.card {
		width: 100%;
		// margin: 20upx auto;
		padding: 52upx 30upx;
		box-sizing: border-box;
		// border-top: 16upx solid #F3F3F3;

		.text {
			color: #ff0303;
		}

		.input {
			border: 2upx solid #dbdbdb;
			margin-left: 20upx;
			padding: 0 28upx !important;
			box-sizing: border-box;
			// text-align: right !important;
		}

		.btn {
			width: 80% !important;
			height: 68upx !important;
			line-height: 68upx;
			background: #5178ff !important;
			opacity: 1 !important;
			border-radius: 34upx !important;
			border: none !important;
			// float: right;
			margin-top: 80upx;
			margin-bottom: 80upx;
		}
		.radio {
			width: 100%;
			margin-bottom: 24upx;
			position: relative !important;
			::v-deep .u-radio__icon-wrap {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 20upx;
			}
			::v-deep .u-radio__label {
				// flex: 1 !important;
				margin: 0 !important;
			}
		}

		.upList {
			width: 690upx;
			flex-basis: 690upx;
			// flex: 1;
			// width: 100%;
			border: 2upx solid #dbdbdb;
			opacity: 1;
			border-radius: 16upx;
			padding: 26upx 70upx 26upx 30upx;
			box-sizing: border-box;
			.upListIocm {
				width: 50upx;
			}
		}
	}
}
</style>
