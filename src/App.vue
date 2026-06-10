<script>
	export default {
		onLaunch: function() {
			//console.log('App Launch')
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "../node_modules//uview-ui//theme.scss";
	page{
			padding-bottom: env(safe-area-inset-bottom);
	}
	body,html{
		height: auto !important;
		background-color: #F3F3F3;
		padding-bottom: env(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
	}
	.underline{
		text-decoration: underline;
	}
	/*每个页面公共css */
	/*每个页面公共css */
	.title_box{
		display: flex;
		width: 100%;
		height: 88upx;
		justify-content: flex-end;
		padding:0 30upx;
		box-sizing: border-box;
		align-items: center;
		background-color: #fff;
	}
	.bgColor{
		background: #F3F3F3 !important;
	}
	.f18{
		font-size: 18upx;
	}
	.f20{
		font-size: 20upx;
	}
	.f22{
		font-size: 22upx;
	}
	.f24{
		font-size: 24upx;
	}
	.f26{
		font-size: 26upx;
	}
	.f28{
		font-size: 28upx;
	}
	.f30{
		font-size: 30upx;
	}
	.f32{
		font-size: 32upx;
	}
	.f36{
		font-size: 36upx;
	}
	.f40{
		font-size: 40upx;
	}
	.c333{
		color: #333333;
	}
	.c666{
		color: #666666;
	}
	.cfff{
		color: #FFFFFF;
	}
	.c999{
		color: #999999;
	}
	.capp{
		color: #5178FF !important;
	}
	.fb{
		font-weight: bold;
	}
	.btnColor{
		background: #5178FF !important;
	}
	.appborder{
		border: 1upx solid #5178FF !important;
	}
	.hid{
		overflow:hidden; 
		text-overflow:ellipsis;
		display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
	}
	.hid1s{
		overflow:hidden; 
		text-overflow:ellipsis;
		display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:1;
	}
	.bfff{
		background: #FFFFFF;
	}
	.bf8{
		background: #F8F8F8;
	}
	.bC6CBDC{
		background-color: #C6CBDC;
	}
	::v-deep .placeholder{
		font-size: 26upx;
		line-height: 40upx;
		color: #999999;
	}
	::v-deep radio{
		scale: 0.7;
		color: #5178FF;
	}
	.bor-bottom{
		border-bottom: 1px solid  #5178FF;
	}
	.borDb{
		border-bottom: 1px solid  #DBDBDB !important;
	}
	.botbtn{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 130upx;
	    display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		
	}
	.margin_left{
		margin-left: 10upx;
	}
	.marginBottom10{
		margin-bottom: 10upx;
	}
	.margin_right{
		margin-right: 10upx;
	}
	.viewbtn{
		width: 710upx;
		height: 80upx;
		line-height: 80upx;
		border-radius: 40upx;
		margin: 0 auto;
	}
	.text_center{
		text-align: center;
	}
	.display_between{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.display_center{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.display_end{
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	uni-checkbox .uni-checkbox-input {
		border-radius: 50%;
		border: 1px solid #d1d1d1;
	/* 	width: 30upx;
		height: 30upx; */
	}
	
	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
		border: 1rpx solid #5178FF;
		background-color: #5178FF;
	}

	uni-checkbox .uni-checkbox-wrapper {
		width: 100%;
	}

	uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:before {
		color: #FFFFFF;
	}

	uni-checkbox:not([disabled]) .uni-checkbox-input:hover {
		border-color: transparent;
		border-color: #d1d1d1;
	}
	.uni-page-head-btn .uni-btn-icon{
		color: #000 !important;
	}

	.uni-tabbar > .uni-tabbar__item:nth-child(3) > .uni-tabbar__bd > .uni-tabbar__icon {
		margin-top: -30px;
		width: 64px !important;
		height: 64px !important;
	}

</style>
