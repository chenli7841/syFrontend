<template>
	<view class="index bgColor">
		<view class="item">
			<input v-model='newValue' class="ipt c333 f32 bfff" type="text" :placeholder="`请输入${label}`" />
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				id:'',
				label: '',
				property: '',
				newValue: '',
			}
		},
		onLoad(e) {
			//console.log(null == false)
			this.id=e.id;
			this.newValue=e.oldvalue != null ? e.oldvalue : '';
			this.label=e.label != null ? e.label : ''
			this.property=e.property != null ? e.property : ''
		},
		onNavigationBarButtonTap() {
			this.editUserInfo();
		},
		methods:{
			editUserInfo() {
				if(this.newValue == ''){
					this.$toast(`${this.label}不能为空`)
					return false
				}
				let data = {
					id:this.id,
				};
				data[this.property] = this.newValue;
				this.request
					.myRequest({
						url: '/api/user/updateUser',
						method: 'PUT',
						data: data
					})
					.then(res => {
						uni.showToast({
							title: '修改成功',
							duration: 2000,
							icon: 'none'
						});
						uni.navigateBack({
							delta:1
						})
					})
					.catch(error => {});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		min-height: 100vh;
		.item{
			width: 94%;
			height: 120upx;
			margin: 0 auto;
			padding-top: 20upx;
			.ipt{
				width: 100%;
				height: 100%;
				line-height: 120upx;
				padding-left: 20upx;
				border-radius: 20upx;
				box-sizing: border-box;
			}
		}
	}
</style>
