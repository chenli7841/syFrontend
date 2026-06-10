<template>
	<view class="bfff" style="padding: 50upx;">
		<view class="index">
			<view style="display: flex; justify-content: center;">
				<image class="img" style="width: 60%;" src="../../static/login-logo.png" mode="widthFix"></image>
			</view>
			<view class="log">
				<view class="item borDb">
					<input
						class="ipt f28 c333"
						type="text"
						@input="changeInput($event, 'username')"
						:value="login.username"
						placeholder="请输入用户名"
						placeholder-class="placeholder"
					/>
				</view>
				<view class="item borDb" style="display: flex; align-items: center; justify-content: space-between;">
					<input class="ipt f28 c333"
					    style="flex: 1"
						:type="showPassword ? 'text' : 'password'"
						@input="changeInput($event,'password')"  :value="login.password" placeholder="请输入密码" placeholder-class="placeholder" />
					<image @click="showPassword = !showPassword" style="height: 24px; width: 24px; cursor: pointer;" src="https://eplusfile.blob.core.windows.net/shuyu/showpasswordicon.png" />
				</view>
				<view class="item">
					<u-checkbox :name="rememberMe" v-model="rememberMe">记住我</u-checkbox>
				</view>
				<view class="item" style="display: flex; justify-content: center;">
					<u-button :loading="loading" :disabled="loading" type="primary" @click="clickLogin" shape="circle" class="logBtn  cfff f30">登录</u-button>
				</view>
				<view class="item" style="display: flex; justify-content: center;">
					<u-button type="primary" @click="register" shape="circle" class="logBtn  cfff f30">注册</u-button>
				</view>
						

			</view>
		</view>
		<!-- 	<view class="logBtn  cfff f30 btnColor">
			
		</view> -->
		<!-- <view class="rister f26 c999" @click="register">没有账号？立即注册</view> -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			login: {
				username: '',
				password: ''
			},
			rememberMe: false,
			showPassword: false,
		};
	},
	onLoad(e) {
		
	},
	methods: {
		//登录
		clickLogin() {
			var that = this;
			if (that.login.username == '' || that.login.password == '') {
				that.$toast('请完善登录信息')
				return false;
			}
			that.loading = true;
			// return false
			that.request
				.myRequestOne({
					method: 'post',
					url: '/api/login',
					data: {
						username: that.login.username,
						password: that.login.password,
						companyId: 2,
					}
				})
				.then(res => {
					//console.log(res);
					if (res.statusCode == 200 || res.statusCode == 201) {
						that.loading = false;
						uni.setStorageSync('YjaccessToken', res.data.accessToken);
						uni.setStorageSync('YjrefreshToken', res.data.refreshToken);
						uni.setStorageSync('YjuserInfo', res.data.user);
						uni.switchTab({
							url:"/pages/index/index"
						})
					}else{
						that.loading = false;
					}
				})
				.catch((err) => {
				         console.log(err,'fg');
						    that.loading = false;
				         uni.showToast({
				         	title: err.data.message,
				         	icon: 'none'
				         });
				     
				         });
				
				
		},
		changeInput(e, name) {
			this.login[name] = e.detail.value;
		},
		register() {
			this.$u.route('/pages/login/register');
		}
	}
};
</script>

<style lang="scss" scoped>
page{
	background-color: #fff;
}
.index {
	width: 100%;
	padding-bottom: 100upx;
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
