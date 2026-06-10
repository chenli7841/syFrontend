<template>
	<view class="index bfff">
		<view class="code">
			<image :src="code" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				code:''
			}
		},
		onLoad(e) {
			if(e.code){
				this.code=e.code
			}
		},
		onShow() {
			
		},
		methods:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		min-height: 100vh;
		.code{
			width: 100%;
			padding-top: 200upx;
			display: flex;
			justify-content: center;
			image{
				width: 352upx;
				height: 352upx;
			}
		}
	}
</style>
