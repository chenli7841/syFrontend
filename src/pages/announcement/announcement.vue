<template>
	<view class="index bgColor">
		<view class="item" v-for="(item,index) in transportation" :key="index" @click="toPolicy(item.link)">
			<text class="f28 c333">{{item.name}}</text>
			<image src="../../static/order/ri.png" mode=""></image>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				screen:{},
                transportation: [{
                    name: '常见问题',
                    link: '/pages/announcement/commonquestion',
                }, {
                    name: '保险条例',
                    link: '/pages/announcement/insurancepolicy',
                }, {
                    name: '创建包裹流程',
                    link: '/pages/announcement/createorderguideline',
                }, {
                    name: '系统简介',
                    link: '/pages/announcement/systemdescription',
                }]
			}
		},
		onLoad(op) {
			this.screen=op
			// uni.setNavigationBarTitle({
			// 	title: op.title
			// });
		},
		onShow() {
		},
		methods:{
			//查询包裹
			toPolicy(link){
				uni.navigateTo({
					url:link
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		// min-height: 100vh;
		padding-top: 1upx;
			margin-bottom: 200upx;
		.item{
			width: 94%;
			margin: 20upx auto;
			height: 140upx;
			background: #fff;
			border-radius: 20upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 26upx 0 36upx;
			box-sizing: border-box;
			text{
				
			}
			image{
				flex-basis: 96upx;
				height: 52upx;
			}
		}
	}
</style>
