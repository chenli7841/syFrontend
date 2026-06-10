<template>
	<view class="index bgColor">
		<view class="top">
			<image v-if="!user.avatar"  class="logo" src="../../static/user.png" mode=""></image>
			<image v-if="user.avatar"  class="logo" :src="user.avatar" mode=""></image>
			<view class="name">
				<view class="">
						{{user.orderstartnumber}}
				</view>
			<!-- <view class="">
			
			</view> -->
			</view>
		</view>
		<view class="list">
			<view class="item" @click="toMy()">
				<image src="../../static/home/wdzl.png" mode=""></image>
				<text class="f24 c333">我的资料</text>
			</view>
			<view class="item"@click="toPick()">
				<image src="../../static/home/shdz.png" mode=""></image>
				<text class="f24 c333">取货地址</text>
			</view>			
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				user:'',
			}
		},
		onLoad() {
	
		},
		onShow(){
		this.userInfo();
	this.$parcelInfo.orderbaggageVoList = [
		{
			itemVoList: []
		}
	];
		this.$parcelInfo.Partsinfo = '';
		this.$parcelInfo.isAdd = '';
		this.$parcelInfo.boxindex = '';
		this.$parcelInfo.order = '';
		this.$parcelInfo.boxindex = '';
		uni.removeStorageSync('put');
		},
		methods:{
			//账户充值
			navto(e){
				uni.navigateTo({
					url:e
				})
			},
			//用户信息
			userInfo(){
				var user=uni.getStorageSync('YjuserInfo')
				this.request.myRequest({
					url:"/api/user",
					data:{
						id:user.id
					}
				}).then((res)=>{
					this.user=res.data.content[0];
				})
			},
			//我的资料
			toMy(){
				this.$u.route('/pages/home/my/info')
			},
			//取货点
			toPick(){
				var id=this.user.id;
				var fid=this.user.belongstoid;
				var pid=this.user.pickUpLocationId;
				//console.log(id,fid)
				this.$u.route('/pages/home/pick/pick?id='+id+'&fid='+fid+'&pid='+pid)
			},
			//收货点
			toGoots(){
				this.$u.route('/pages/home/the/goots')
			},
			//我的二维码
			toCode(){
				var code=this.user.qrPath;
				this.$u.route('/pages/home/code/code?code='+code)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		position: relative;
		// min-height: 100vh;
	
		.top{
			width: 100%;
			height: 342upx;
			padding: 30upx 66upx;
			box-sizing: border-box;
			background: #ECF4FF;
			display: flex;
		
			.logo{
				width: 108upx;
				height: 108upx;
				border-radius: 50%;
			}
			.name{
				flex: 1;
				height: 108upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-left: 10upx;
				view{
					padding-left: 20upx;
					box-sizing: border-box;
					// margin-bottom: 30upx;
				}
				image{
					width: 52upx;
					height: 52upx;
				}
			}
		}
		.list{
			width: 94%;
			margin: -170upx auto 0;
			border-radius: 20upx;
			background: #fff;
			padding: 0 34upx;
			box-sizing: border-box;
			
			.item{
				width: 100%;
				height: 120upx;
				border-bottom: 1px solid #E3E5E8;
				display: flex;
				align-items: center;
				image{
					width: 52upx;
					height: 52upx;
				}
				text{
					flex: 1;
					padding-left: 15upx;
					box-sizing: border-box;
				}
			}
			view:last-child{
				border-bottom: none;
			}
		}
	}
</style>
