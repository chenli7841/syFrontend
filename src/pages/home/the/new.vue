<template>
	<view class="index bgColor">
		<view class="top bgColor">
			<view class="tbtn capp f26" @click="toadd">
				+新增收货人信息
			</view>
		</view>
		<view class="list">
			<view class="item bfff" @click="clickAddress(item)" v-for="(item, index) in list" :key="index" >
				<view class="left">
					<image class="imgO" v-if="item.id == address" src="../../../static/order/yes.png" mode=""></image>
					<image  class="imgO" v-else src="../../../static/order/no.png" mode=""></image>
				</view>
				<view class="center">
					<view class="cenO">
						<text class="f28 c333">{{item.consignee}}</text>
						<text class="f28 c333">{{item.mobile.substr(0,3)}}****{{item.mobile.substr(-4)}}</text>
					</view>
					<view class="cenT">
						<text  v-if="item.isDefault == '1'" class="txtO cfff f18 btnColor">默认</text>
						<text class="f24 c333 ">{{item.detailArea}}</text>
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
				address:'',
				list:[],
				page:1,
				size:10,
				isMore:false,
				addresstype:'',
			}
		},
		onLoad(e) {
			this.addresstype=e.type;
		
			
		},
		onShow() {
			this.list=[];
			this.page=1;
				this.getList();
		},
		onReachBottom() {
			if(this.isMore){
				this.getList();
			}
		},
		methods:{
			//去新增地址
			toadd(){
				uni.setStorageSync('areaType',this.addresstype)
				uni.navigateTo({
					url:'/pages/home/the/add?type='+this.addresstype
				})
				},
			//选中地址
			clickAddress(e){
				//console.log(e)
				this.address=e.id;
				uni.setStorageSync('address',e);
				uni.navigateBack({
					delta:1
				})
			},
			//获取收货地址
			getList(){
				var data = {
					addresstype:this.addresstype,
					page:this.page,
					size:this.size,
					isDefault:''
				}
				this.request
					.myRequest({
						url: '/api/sysShippingAddress',
						method: 'GET',
						data: data
					})
					.then(res => {
						//console.log(res)
						var list = res.data.content
						this.list = this.list.concat(list)
						this.isMore = list.length < res.data.totalElements ? true :false
						if(this.isMore){
							this.page = this.page + 1
						}
					})
					.catch(error => {});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		min-height: 100vh;
		.top{
			width: 100%;
			height: 120upx;
			padding: 0 30upx;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			flex-direction: row-reverse;
			.tbtn{
				flex-basis: 246upx;
				height: 52upx;
				text-align: center;
				line-height: 52upx;
				border-radius: 10upx;
				border: 1px solid #5178FF;
			}
		}
		.list{
			width: 100%;
			.item{
				margin-bottom: 16upx;
				padding: 30upx;
				box-sizing: border-box;
				width: 100%;
				display: flex;
				align-items: center;
				.left{
					flex-basis: 32upx;
					height: auto;
					display: flex;
					align-items: center;
					.imgO{
						width: 32upx;
						height: 32upx;
					}
				}
				.center{
					flex: 1;
					padding-left: 30upx;
					box-sizing: border-box;
					.cenO{
						display: flex;
						justify-content: space-between;
						height: 60upx;
						align-items: center;
					}
					.cenT{
						width: 100%;
						text{
						
						}
						.txtO{
							display: inline-block;	
							padding: 0 10upx;
							border-radius: 20upx;
							margin-right: 20upx;
						}
					}
				}
			}
		}
	}
</style>
