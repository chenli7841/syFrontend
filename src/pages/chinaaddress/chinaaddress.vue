<template>
	<view style="padding: 40upx;">
        <view style="margin-bottom: 20upx; display: flex; align-items: center;">
			<view style="font-size: 40upx; font-weight: 600; flex: 1">收货地址:</view> 
			<view @click="copyAddressToClipboard" style="background-color: #ce93d8; height: 76upx; width: 212upx; border-radius: 20upx; display: flex; justify-content: center; align-items: center;">复制收货地址</view>
		</view>
        <view style="margin-bottom: 40upx;">浙江省金华市义乌市廿三里开元北街96号2栋102室 （加仓{{orderStartNumber}}）</view>
        <view style="margin-bottom: 20upx; display: flex; align-items: center;">
			<view style="font-size: 40upx; font-weight: 600; flex: 1">收货电话:</view> 
			<view @click="copyPhoneToClipboard" style="background-color: #ce93d8; height: 76upx; width: 212upx; border-radius: 20upx; display: flex; justify-content: center; align-items: center;">复制收货电话</view>
		</view>
        <view style="margin-bottom: 40upx;">13960801318</view>
        <view style="margin-bottom: 20upx; display: flex; align-items: center;">
			<view style="font-size: 40upx; font-weight: 600; flex: 1">收货人:</view> 
			<view @click="copyRecipientToClipboard" style="background-color: #ce93d8; height: 76upx; width: 212upx; border-radius: 20upx; display: flex; justify-content: center; align-items: center;">复制收货人</view>
		</view>
        <view style="margin-bottom: 40upx;">舒誉国际-加仓-{{orderStartNumber}}</view>
		<tabbar></tabbar>
	</view>





</template>

<script>
	export default{
		data(){
			return{
				screen:{},
				userInfo: {},
				orderStartNumber: '',
			}
		},
		onLoad(op) {
			this.screen=op
			// uni.setNavigationBarTitle({
			// 	title: op.title
			// });
			this.getUserInfo();
		},
		onShow() {
		},
		methods:{
			getUserInfo() {
				if (this.userInfo && this.userInfo.id > 0) {
					return;
				}
				try {
					if (typeof uni.getStorageSync('YjuserInfo') == 'string') {
						var logistics_user = JSON.parse(uni.getStorageSync('YjuserInfo'));
					} else {
						var logistics_user = uni.getStorageSync('YjuserInfo');
					}
					var data = {
						id: logistics_user.id
					};
					this.request
						.myRequest({
							url: '/api/user',
							data: data
						})
						.then(res => {
						if(res.data.content != ''){
							this.userInfo = res.data.content[0];
							this.orderStartNumber = this.userInfo.orderstartnumber;
							uni.setStorageSync('YjuserInfo',res.data.content[0])
						}
							
							
						})
						.catch(error => {});
				} catch(e) {
					window.location.href='https://mobile.shuyu-global.com/#/pages/login/login'
				}
			},
			async copyAddressToClipboard() {
				await navigator.clipboard.writeText(`浙江省金华市义乌市廿三里开元北街96号2栋102室 （加仓${this.orderStartNumber}）`);
				this.$toast('复制成功');
			},
			async copyPhoneToClipboard() {
				await navigator.clipboard.writeText(`13960801318`);
				this.$toast('复制成功');
			},
			async copyRecipientToClipboard() {
				await navigator.clipboard.writeText(`舒誉国际-加仓-${this.orderStartNumber}`);
				this.$toast('复制成功');
			},
		}
	}
</script>

<style lang="scss" scoped>
</style>
