<template>
	<view class="">
		结果：
		{{datas}}
	</view>
</template>

<script>
	export default{
		data(){
			return {
				datas:'ss',
			}
		},
		onLoad(e) {
			this.datas=e;
			console.log(e);
			console.log(e,'ll');
		}
		
	}
	
</script>

<style>
</style>
