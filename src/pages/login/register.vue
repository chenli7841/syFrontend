<template>
	<view class="bfff" style="padding: 50upx;">
		<view class="index bfff">
			<view style="display: flex; justify-content: center;">
				<image class="img" style="width: 60%;" src="../../static/login-logo.png" mode="widthFix"></image>
			</view>
			<view class="log">
				<view class="item borDb">
					<input
						class="ipt f28 c333"
						type="text"
						@input="changeUsername($event)"
						:value="registration.userName"
						placeholder="新用户名(必填)"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="item borDb" style="display: flex; align-items: center; justify-content: space-between;">
					<input
					    style="flex: 1"
						class="ipt f28 c333"
						:type="showPassword ? 'text' : 'password'"
						:value="registration.password"
						@input="changePassword($event)"
						placeholder="新用户密码(必填)"
						placeholder-class="placeholder"
					/>
					<image @click="showPassword = !showPassword" style="height: 24px; width: 24px; cursor: pointer;" src="https://eplusfile.blob.core.windows.net/shuyu/showpasswordicon.png" />
				</view>
				<view class="item borDb">
					<input
					    class="ipt f28 c333"
						:type="showPassword ? 'text' : 'password'"
						:value="confirmpassword"
						@input="changePasswordConfirm($event)"
						placeholder="确认新用户密码(必填)"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="item" style="color: red;" v-if="registration.password !== confirmpassword">
					密码不匹配
				</view>
				<view class="item borDb">
					<input
					    class="ipt f28 c333"
						type="text"
						:value="registration.fullName"
						@input="changeFullName($event)"
						placeholder="新用户邮箱(必填)"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="item borDb">
					<input
					    class="ipt f28 c333"
						type="text"
						:value="registration.canadaPhoneNumber"
						@input="changeCanadaPhoneNumber($event)"
						placeholder="新用户电话(必填)"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="item" @click="showPickupLocationSelect = true" style="display: flex; align-items: center; gap: 40upx;">
					<view class="label" style="flex: 1;">取货点(必选)</view>
					<view>
						{{ allPickupLocationData.find(p => p.id === registration.pickUpLocationId) ? allPickupLocationData.find(p => p.id === registration.pickUpLocationId).name : '' }}						
					</view>
				</view>
				<u-select
					@confirm="selectPickupLocation"
					data-id="id"
					value-name="id"
					label-name="name"
					v-model="showPickupLocationSelect"
					mode="single-column"
					:list="allPickupLocationData"
				></u-select>
				<view class="item" style="display: flex; justify-content: center;">
					<u-button :loading="loading" :disabled="loading" type="primary" @click="submit()" shape="circle" class="logBtn  cfff f30">注册</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			registration: {
				userName: '',
				password: '',
				canadaPhoneNumber: '',
				fullName: '',
				pickUpLocationId: -1,
			},
			confirmpassword: '',
			showPassword: false,
			allPickupLocationData: [],
			showPickupLocationSelect: false,
		};
	},
	onLoad() {
		uni.setStorageSync('YjaccessToken', '');
	},
	onShow() {
		this.pickData();
	},
	methods: {
		submit() {
			var data = this.registration;
			data.pickUpLocationId = parseInt(data.pickUpLocationId);
			if (!data.userName) {
				this.$toast('请填写用户名');
				return false;
			}
			if (!data.password) {
				this.$toast('请填写密码');
				return false;
			}
			if (!data.fullName) {
				this.$toast('请填写邮箱');
				return false;
			}
			if (!data.canadaPhoneNumber) {
				this.$toast('请填写电话');
				return false;
			}
			if (!(data.pickUpLocationId > 0)) {
				this.$toast('请选择取货点');
				return false;
			}
			this.send();
		},
		pickData(){
			this.request.myRequest({
				url:"/goapi/pickUpLocation",
				data:{
					companyId:2,
				}
			}, 3, 'https://mobile.shuyu-global.com').then(res=>{
				this.allPickupLocationData= [
					{
						id: -1,
						name: '请选择取货点',
					},
					...res.data.content
				];
				//this.registration.pickUpLocationId = this.allPickupLocationData[0].id;
			})
		},
		send() {
			var that = this;
			uni.showLoading();
			this.request
				.myRequest({
					url: '/api/registerNativeUser',
					method: 'POST',
					data: {
						userName: this.registration.userName,
						password: this.registration.password,
						companyCode: 'SY',
						companyId: 2,
						mailbox: this.registration.fullName,
						canadaPhoneNumber: this.registration.canadaPhoneNumber,
						pickUpLocationId: this.registration.pickUpLocationId,
					}
				})
				.then(res => {
					//console.log(res)
					if (res.statusCode == 200 || res.statusCode == 201) {
						that.loading = false;
						uni.setStorageSync('YjaccessToken', res.data.accessToken);
						uni.setStorageSync('YjrefreshToken', res.data.refreshToken);
						uni.setStorageSync('YjuserInfo', res.data.user);
						uni.switchTab({
							url:"/pages/index/index"
						})
					}else{
						uni.hideLoading();
					}
				})
				.catch(error => {
					//console.log(error)
					uni.hideLoading();
				});
		},
		changeUsername(e) {
			this.registration.userName = e.detail.value;
		},
		changePassword(e) {
			this.registration.password = e.detail.value;
		},
		changePasswordConfirm(e) {
			this.confirmpassword = e.detail.value;
		},
		changeCanadaPhoneNumber(e) {
			this.registration.canadaPhoneNumber = e.detail.value;
		},
		changeFullName(e) {
			this.registration.fullName = e.detail.value;
		},
		selectPickupLocation(e) {
			console.log(e[0].value);
			this.registration.pickUpLocationId = e[0].value;
		},
	}
};
</script>

<style lang="scss" scoped>
.index {
	width: 100%;
	border: #9C27B0 2upx solid;
	border-radius: 12upx;
	.title {
		padding-left: 46upx;
		box-sizing: border-box;
		height: 140upx;
		line-height: 140upx;
	}

	.log {
		width: 88%;
		margin: 40upx auto 90upx auto;

		.item {
			width: 100%;
			margin-bottom: 60upx;
			.label {
				margin: 20upx 0;
				position: relative;

				.text {
					margin-left: 15upx;
					color: #ff0303;
				}
			}

			.ipt {
				height: 60upx;
				line-height: 60upx;
				.uni-input-input {
					padding-left: 24upx;
				}
			}
		}
	}
	
	.logBtn {
		margin: 0 auto;
		width: 70%;
		height: 80upx;
		line-height: 80upx;
		border-radius: 40upx;
		text-align: center;
		background-color: #BA68C8;
	}

	.rister {
		padding-right: 46upx;
		box-sizing: border-box;
		text-align: right;
		margin-top: 38upx;
	}
}
</style>
