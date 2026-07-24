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
				<view class="item" style="display: flex; align-items: center;">
					<u-checkbox v-model="agreed">我已阅读并同意</u-checkbox>
					<text class="link" @click="showDisclaimer = true">《免责声明》</text>
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
		<u-modal
			v-model="showDisclaimer"
			title="免责声明"
			confirm-text="我知道了"
			width="640"
		>
			<scroll-view scroll-y class="disclaimerContent">
				<view class="f26 c333">
					<view>为保障双方权益，请您在发货前仔细阅读以下条款。一旦交货，即默认认可本规则：</view>
					<view class="disclaimerSection">一、运输风险说明</view>
					<view>1. 国际运输过程中受海关查验、天气、航班/船期调整等不可控因素影响，时效不作绝对保证。</view>
					<view>2. 集运过程中存在搬运、装卸等环节，默认仅保障"丢失"，不保障"破损"。</view>
					<view>3. 易碎品、贵重物品建议自行做好加固包装或购买保险，如未特别说明，均按普通货物处理。</view>
					<view class="disclaimerSection">二、赔付标准（仅限丢失）</view>
					<view>1. 空运货物：按 40元人民币 / 公斤 进行赔付</view>
					<view>2. 海运普货：按 运费的2倍 进行赔付</view>
					<view>3. 海运敏感货：按 运费1:1 进行赔付</view>
					<view>注：赔付仅针对丢失的该物品，不是整批货物。</view>
					<view class="disclaimerSection">三、不予赔付情况</view>
					<view>以下情况不在赔付范围内：</view>
					<view>1. 因包装不当导致的破损、变形、渗漏等问题</view>
					<view>2. 海关查验、扣关、没收或政策性退运</view>
					<view>3. 产品本身属性问题（如易碎、易融、易损等）</view>
					<view>4. 不可抗力因素（如天气、战争、港口拥堵等）</view>
					<view>5. 未如实申报或瞒报品名导致的风险</view>
					<view class="disclaimerSection">四、其他说明</view>
					<view>1. 如需提高保障，建议提前沟通加固包装或购买额外保险服务</view>
					<view>2. 一切赔付以实际收取运费为基准，不涉及货值赔偿</view>
					<view>3. 本条款最终解释权归本公司所有</view>
				</view>
			</scroll-view>
		</u-modal>
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
			agreed: false,
			showDisclaimer: false,
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
			if (!that.agreed) {
				that.$toast('请先阅读并勾选免责声明')
				that.showDisclaimer = true;
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
.link {
	color: #BA68C8;
}
.disclaimerContent {
	max-height: 500upx;
	line-height: 1.8;
	padding: 0 2mm;
	box-sizing: border-box;
	view {
		margin-bottom: 16upx;
	}
	.disclaimerSection {
		font-weight: bold;
		margin-top: 10upx;
	}
}
</style>
