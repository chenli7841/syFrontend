import request from './request.js'
// 单张上传
//获取订单
function order(data) {
	request.myRequest({
			url: '/api/order',
			data: data
		})
		.then((res) => {
			//console.log(res)
			return res
		})

}
export default {
	order,
	Partsinfo: '',
	Partsindex: '',
	boxindex: '',
	isAdd: 2,
	orderbaggageVoList: [{
		itemVoList: [
	
		]
	}],
	 setparcelInfo(data){
	       this.orderbaggageVoList=[];
	    },
	order:'',
	categoryPriceList: [],
}