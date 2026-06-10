<template>
	<view class="index bgColor">
		<view class="top" v-if="bannerData.length>0">
						<swiper class="swiper"autoplay circular
							duration="3000">
							<swiper-item v-for="item in bannerData" :key="item.id">
								<image class="swiperImg" style="width:100%;height:100%" :src="item.adPictureKey" mode="aspectFit"></image>
						</swiper-item>
							
						</swiper>
						
		</view>
		
		<view class="card">
			<view class="types">
				<view style="flex: 2" class="typea-li-small liR">
					<view class="li-info">
						<text style="font-weight: 800; font-size: 52upx;" class="f32 userInfo">{{ orderStartNumber ? `${orderStartNumber}` :'' }}</text>
					</view>
				</view>
				<view style="flex: 1" class="typea-li-small liP"  @click="copyAddressToClipboard">
					<view class="li-info">
						<text style="font-weight: 800; font-size: 27upx;" class="f32 userInfo">
							<view>复制国内</view>
							<view>收货地址</view>
						</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 常用服务 -->
		<view class="service">
			<view class="title f28 c333 fb">
				常用服务
			</view>
			<view class="items">
				<!--<view class="items-li bfff" @click="navto('/pages/index/parcel/parcel')">-->
				<view class="items-li-big bfff" @click="navto('/pages/index/parcel/inParcels?type=&name=全部')">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-myparcel.svg" mode=""></image>
					<view class="li-name f48 c333">
						我的包裹
					</view>
				</view>
				<view class="items-li-big bfff" @click="addOrder">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-createorder.svg" mode=""></image>
					<view class="li-name f48 c333">
						创建运单
					</view>
				</view>
			</view>
			<view class="items">
				<view class="items-li-big bfff" @click="navto('/pages/index/extractGoods/extractGoods')">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-payment.svg" mode=""></image>
					<view class="li-name f48 c333">
						支付
					</view>
				</view>
				<view class="items-li-big bfff" @click="navto('/pages/chinaaddress/chinaaddress')">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-warehouseaddress.svg" mode=""></image>
					<view class="li-name f48 c333">
						国内仓库地址
					</view>
				</view>
			</view>
		</view>
		<!-- 常用服务 -->
		<view class="service">
			<view class="items">
				<view class="items-li bfff" @click="toPolicy()">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-transportpolicy.svg" mode=""></image>
					<view class="li-name f24 c333">
						运输细则
					</view>
				</view>
				<view class="items-li bfff" @click="toAnnouncement()">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-announcement.svg" mode=""></image>
					
					<view class="li-name f24 c333">
						公告
					</view>
				</view>
				<view class="items-li bfff" @click="navto('/pages/index/parcel/search?type=&name=全部')">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-searchorder.svg" mode=""></image>
					
					<view class="li-name f24 c333">
						查询运单
					</view>
				</view>			
				<view class="items-li bfff" @click="navto('/pages/customerservice/customerservice')">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-customerservice.svg" mode=""></image>
					<view class="li-name f24 c333">
						客服
					</view>
				</view>
			</view>
		</view>
		<view class="card bfff">
			<view class="title c333 f28 fb">
				待处理事项
			</view>
			<view class="types">
				<view class="typea-li" @click="toUpcomingParcel()">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-notinwarehouse.svg" mode=""></image>
					<view class="li-info">
						<text class="f24">未入库包裹</text>
						<text class="fb f36">{{orderNumbers.createdCount ? orderNumbers.createdCount:0}}</text>
					</view>
				</view>
				<view class="typea-li" @click="toStorageParcel()">
					<image src="https://eplusfile.blob.core.windows.net/shuyu/homeicon-inwarehouse.svg" mode=""></image>
					<view class="li-info">
						<text class="f24">已入库包裹</text>
						<text class="fb f36">{{orderNumbers.inWarehouseCount ? orderNumbers.inWarehouseCount:0}}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 高级用户管理 -->
		<!--<view class="service" v-if="account">
			<view class="title f28 c333 fb">
				高级用户管理
			</view>
			<view class="items">
				<view class="items-li bfff item" @click="navto('/pages/index/check/checklist')">
					<image src="../../static/index/g1.png" mode=""></image>
					<view class="li-name f24 c333">
						查单管理
					</view>
				</view>
				<view class="items-li bfff item" @click="navto('/pages/index/check/picksearch')">
					<image src="../../static/index/g2.png" mode=""></image>
					<view class="li-name f24 c333">
						提货管理
					</view>
				</view>
				<view class="items-li bfff item"@click="navto('/pages/index/check/take')">
					<image src="../../static/index/g3.png" mode=""></image>
					<view class="li-name f24 c333">
						待派送管理
					</view>
				</view>
				<view class="items-li bfff item"@click="navto('/pages/index/bill/bill')">
					<image src="../../static/index/g4.png" mode=""></image>
					<view class="li-name f24 c333">
						账单系统
					</view>
				</view>
			</view>
		</view>-->
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				bannerData:[],
				title: 'Hello',
				orderNumbers:'',
				account:false,
				orderStartNumber: '',
			}
		},
		onLoad(e) {
			this.getUserInfo();
			if(e.token){
					uni.setStorageSync('YjaccessToken', e.token);
					uni.setStorageSync('YjuserInfo', {id:e.id});
					
			}
		},
		onShow() {
			this.getUserInfo();
			this.orderNumber();
			this.banner();
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
					//console.log(this.$parcelInfo)
		},
		methods: {
			async copyAddressToClipboard() {
				await navigator.clipboard.writeText(`收货地址：浙江省金华市义乌市廿三里开元北街96号2栋102室 （加仓${this.orderStartNumber}）
收货电话：13960801318 
收货人：舒誉国际-加仓-${this.orderStartNumber}`);
				this.$toast('复制成功');
			},
			//轮播图
			banner(){				
				this.request.myRequest({
					data:{
						adType:26,
						page:1,
						size:100,
					},
					url:'/api/baseAdvert'					
				}).then((res)=>{
					this.bannerData=res.data.content;
				})
			},
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
							if (this.userInfo.role == 3) {
								this.account = false;
							} else {
								this.account = true;
							}
						}
							
							
						})
						.catch(error => {});
				} catch(e) {
					window.location.href='https://mobile.shuyu-global.com/#/pages/login/login'
				}
			},
			to(){
				//console.log('000')
				window.location.href='https://www.everfast.ca'
			},
			toSend(type,title,state){
				uni.navigateTo({
					url:'/pages/index/toBe/route?type=' + type+'&title='+title+'&state='+state
				})
			},
			toPolicy(){
				uni.navigateTo({
					url:'/pages/policy/policy'
				})
			},
			toAnnouncement(){
				uni.navigateTo({
					url:'/pages/announcement/announcement'
				})
			},

			toUpcomingParcel(){
				uni.navigateTo({
					url:'/pages/index/parcel/inParcels?type=1&name=未入库'
				})
			},
			toStorageParcel(){
				uni.navigateTo({
					url:'/pages/index/parcel/inParcels?type=5&name=已入库'
				})
			},
			extractGoods(){
				uni.navigateTo({
					url:'/pages/index/extractGoods/extractGoods'
				})
			},
			
			//订单数量
			orderNumber() {
				var data = {
					
				};
				this.request
					.myRequest({
						url: '/api/order/selectHomePage',
						data: data
					})
					.then(res => {
						this.orderNumbers=res.data;
					});
			},
            navto(url){
				uni.navigateTo({
					url:url
					
				})
			},
			addOrder(){
				uni.switchTab({
				url:'/pages/order/order'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.index{
	// min-height: 100vh;
	position: relative;
	.swiper{
		width: 100%;
		height: 100%;
		z-index: 1;
		border-radius: 20upx;
		.swiperImg{
				height: 100%;
			display: block;
			z-index: -1 !important;
			border-radius: 20upx;
		}
	}
	.swiper-item{
		height: 100%;
		// background-color: #fff;
		z-index: 1;
		image{
			
		}
	}
	.top{
		width:100%;
		height: 526upx;
		margin: 0 auto;
		border-radius: 40upx;
		// background: url(../../static/index/tbj.png) no-repeat;
		background-size: 100% 100%;
		.nameO{
			position: absolute;
			z-index: 5;
			left: 100upx;
			top: 160upx;
		}
		.nameT{
			position: absolute;
			z-index: 5;
			left: 100upx;
			top: 210upx;
		}
	}
	.card{
		width: 94%;
		margin: 36upx auto 0;
		border-radius: 40upx;
		z-index: 22;
		.title{
			text-align: center;
			height: 104upx;
			line-height: 104upx;
		}
		.types{
			width: 100%;
			padding: 0 0 30upx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			gap: 16upx;
			.typea-li-small {
				height: 94upx;
				border-radius: 20upx;
				display: flex;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				.li-info{
					flex: 1;
					display: flex;
					flex-direction: column;
					
					.textO{
						color: #6789FF;
					}
					.textT{
					  color: #FF9317;	
					}
					.userInfo {
						font-size: 32upx;
						font-weight: 600;
						text-align: center;
					}
					.textF{
					  color: #6789FF;	
					}
				}

			}
			.typea-li{
				flex: 1;
				height: 140upx;
				border-radius: 20upx;
				display: flex;
				align-items: center;
				justify-content: center;
				padding-left: 34upx;
				box-sizing: border-box;
				margin-bottom: 16upx;
				image{
					width: 120upx;
					height: 120upx;
					margin-right: 34upx;
				}
				.li-info{
					flex: 1;
					display: flex;
					flex-direction: column;
					
					.textF{
					  color: #6789FF;	
					}
				}
			}
			.liR{
				background: #FFB300;
			}
			.liP{
				background: #CE93D8;
			}
		}
	}
	.service{
		width: 94%;
		margin-left: auto;
		margin-right: auto;
		.title{
			text-align: center;
			height: 94upx;
			line-height: 94upx;
		}
		.items{
			width: 100%;
			gap: 16upx;
			box-sizing: border-box;
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
			.items-li{
				flex: 1;
				aspect-ratio: 1/1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				margin-bottom: 16upx;
				border-radius: 20upx;
				// display: flex;
				// flex-direction: column;
				image{
					width: 56upx;
					height: 52upx;
					margin-bottom: 10upx;
				}
			}
			.items-li-big {
				flex: 1;
				aspect-ratio: 1/1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				box-sizing: border-box;
				margin-bottom: 16upx;
				border-radius: 20upx;
				// display: flex;
				// flex-direction: column;
				image{
					width: 132upx;
					height: 132upx;
					margin-bottom: 10upx;
				}
				.f48 {
					font-size: 44upx;
				}
			}
			.item{
				display: flex;
				justify-content: center;
				flex-direction: column;
				align-items: center;
				image{
					
				}
			}
		}
	}
}
</style>
