<template>
	<view class="index bfff">
		<view class="mian bgColor">
			<view class="item">
				<view class="left">
					<image class="img" src="../../../static/home/shdz.png" mode=""></image>
				</view>
				<view class="right">
					<view class="f24 c333">
						{{pickUpLocation.name}} {{pickUpLocation.phone}}
					</view>
					<view class=" f24 c333">
						{{pickUpLocation.detailArea}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				pid:'',
				id:'',
				fid:'',
				pickUpLocation:'',
				userInfo:'',
			}
		},
		onLoad(e) {
			//console.log(e)
			if(e.pid){
				this.pid=e.pid;//取货点id
				this.id=e.id;//用户id
				this.fid=e.fid;//群主id
				
			}
			
		},
		onShow() {
			// this.pickData(this.pid)
			this.getUserInfo()
		},
		onNavigationBarButtonTap() {
			var that=this;
			uni.navigateTo({
				url:'./selectPick?fid='+that.fid+'&id='+that.id
			})
		},
		methods:{
			getUserInfo() {
				//console.log(uni.getStorageSync('YjuserInfo'));
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
						this.userInfo = res.data.content[0];
						this.fid=this.userInfo.belongstoid;
						this.pickData(this.userInfo.pickUpLocationId)
					})
					.catch(error => {});
			},
			pickData(id){
				this.request.myRequest({
					url:"/api/pickUpLocation",
					data:{
						id:id,
						companyId:2,
					}
				}).then(res=>{
					//console.log(res)
					this.pickUpLocation=res.data.content[0];
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	body{
		background-color: #fff;
	}
	.index{
		min-height: 100vh;
		
		.mian{
			width: 94%;
			margin:  0 auto;
			box-sizing: border-box;
			border-radius: 22upx;
			.item{
				width: 100%;
				height: 158upx;
				display: flex;
				align-items: center;				
background: #F8FAFE;
				.left{
					flex-basis: 100upx;
					display: flex;
					justify-content: center;
					align-items: center;
					.img{
						width: 36upx;
						height: 44upx;
					}
				}
				.right{
					flex: 1;
					
				}
			}
		}
	}
</style>
