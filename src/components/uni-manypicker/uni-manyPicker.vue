<template>
	<view>
		<picker mode="multiSelector" @change="MultiChange" @columnchange="MultiColumnChange" :value="multiIndex" :range="multiArray">
			<!-- <view class="picker" v-if="myarea">{{myarea}}</view> -->
			<view class="picker">{{ str[0] }} {{ str[1] }} {{ str[2] }}</view>
		</picker>
	</view>
</template>

<script>
export default {
	name: 'UniManypicker',
	data() {
		return {
			multiArray: [[], [], []],
			multiIndex: [0, 0, 0],
			shenData: [],
			shiData: [],
			quData: [],
			areaid: '',
			myarea: '',
			str: ['省','市','区']
		};
	},
	// props: {
	// 	// 1:地区二级分类 2：工人二级分类 3：店铺二级分类
	// 	areaIndex: {
	// 		type: Array,
	// 		default: [0, 0, 0]
	// 	}
	// },
	watch: {},
	created() {},
	mounted() {
		var address = uni.getStorageSync('addressInfo');
		if(uni.getStorageSync('areaType') == '1'){
			this.str[2]=''
		}
		this.getShen();		
		if (address) {
			var str=[];
			if(address.province != '' && address.city != ''){
				str[0]=address.province;
				str[1]=address.city;
				str[2]=address.district;
				this.str=str;
			}
			if(address.addresstype == 1){
				str[0]=address.detailArea.split(',')[2];
				str[1]=address.detailArea.split(',')[1];
				str[1]='';
				this.str=str;				        
			}
		
		}else{
			// var that=this;
			// setTimeout(()=>{
				
			// },2000)
		}

		// mycode  是编辑是的  区位置的  地区code
		// let mycode = uni.getStorageSync('mycode');
		// uni.getStorage({
		// 	key: 'areacode',
		// 	success: v => {
		// 		let areacode = v.data;
		// 		let code = '';
		// 		if (mycode) {
		// 			code = mycode;
		// 			uni.setStorageSync('mycode', '');
		// 		} else {
		// 			code = areacode;
		// 		}
		// 		let location = '';
		// 		let pid = '';
		// 		if (code) {
		// this.request
		// 	.myRequest({
		// 		url: '/api/baseArea/queryAllArea',
		// 		data: {
		// 			code: code
		// 		}
		// 	})
		// 	.then(res => {

		// 		location = res.data[0].areaName;
		// 		pid = res.data[0].parentId;
		// 		//如果是省
		// 		if (res.data[0].level === 0) {
		// 			this.request
		// 				.myRequest({
		// 					url: '/api/baseArea/queryAllArea',
		// 					data: {
		// 						level: 0
		// 					}
		// 				})
		// 				.then(myres3 => {
		// 					for (let i in myres3.data) {
		// 						if (myres3.data[i].areaName === location) {
		// 							this.multiIndex[0] = i;
		// 							break;
		// 						}
		// 					}
		// 					this.getShen();
		// 				});
		// 			// 如果是市
		// 		} else if (res.data[0].level === 1) {
		// 			this.request
		// 				.myRequest({
		// 					url: '/api/baseArea/queryAllArea',
		// 					data: {
		// 						parentId: pid
		// 					}
		// 				})
		// 				.then(myres => {
		// 					for (let i in myres.data) {
		// 						if (myres.data[i].areaName === location) {
		// 							this.multiIndex[1] = i;

		// 							break;
		// 						}
		// 					}
		// 					return this.request.myRequest({
		// 						url: '/api/baseArea/queryAllArea',
		// 						data: {
		// 							id: pid
		// 						}
		// 					});
		// 				})
		// 				.then(myres2 => {
		// 					this.request
		// 						.myRequest({
		// 							url: '/api/baseArea/queryAllArea',
		// 							data: {
		// 								level: 0
		// 							}
		// 						})
		// 						.then(myres3 => {
		// 							for (let i in myres3.data) {
		// 								if (myres3.data[i].areaName === myres2.data[0].areaName) {
		// 									this.multiIndex[0] = i;
		// 									break;
		// 								}
		// 							}
		// 							this.getShen();
		// 						});
		// 				});

		// 			// 如果是区
		// 		} else if (res.data[0].level === 2) {
		// 			this.request
		// 				.myRequest({
		// 					url: '/api/baseArea/queryAllArea',
		// 					data: {
		// 						parentId: pid
		// 					}
		// 				})
		// 				.then(res => {
		// 					for (let i in res.data) {
		// 						if (res.data[i].areaName === location) {
		// 							this.multiIndex[2] = i;
		// 							break;
		// 						}
		// 					}

		// 					return this.request.myRequest({
		// 						url: '/api/baseArea/queryAllArea',
		// 						data: {
		// 							id: pid
		// 						}
		// 					});
		// 				})
		// 				.then(myres5 => {
		// 					location = myres5.data[0].areaName;
		// 					pid = myres5.data[0].parentId;

		// 					return this.request.myRequest({
		// 						url: '/api/baseArea/queryAllArea',
		// 						data: {
		// 							parentId: pid
		// 						}
		// 					});
		// 				})
		// 				.then(myres6 => {
		// 					for (let i in myres6.data) {
		// 						if (myres6.data[i].areaName === location) {
		// 							this.multiIndex[1] = i;
		// 							break;
		// 						}
		// 					}

		// 					return this.request.myRequest({
		// 						url: '/api/baseArea/queryAllArea',
		// 						data: {
		// 							id: pid
		// 						}
		// 					});
		// 				})
		// 				.then(myres7 => {
		// 					location = myres7.data[0].areaName;
		// 					pid = myres7.data[0].parentId;

		// 					return this.request.myRequest({
		// 						url: '/api/baseArea/queryAllArea',
		// 						data: {
		// 							level: 0
		// 						}
		// 					});
		// 				})
		// 				.then(myres8 => {
		// 					for (let i in myres8.data) {
		// 						if (myres8.data[i].areaName === location) {
		// 							this.multiIndex[0] = i;
		// 							break;
		// 						}
		// 					}
		// 					uni.setStorageSync('mycode', '');
		// 					this.getShen();
		// 				});
		// 		} else {
		// 			this.getShen();
		// 		}
		// 	});
		// }
		// }
		// });
	},
	methods: {
		// 三级联动
		MultiChange: function(e) {
			//console.log(this.multiArray)
			if (this.multiArray[2] != '') {
				var str=[];
				str[0] = this.multiArray[0][this.multiIndex[0]];
				str[1] = this.multiArray[1][this.multiIndex[1]];
				str[2] = this.multiArray[2][this.multiIndex[2]];
				this.str=str;
				this.$emit('getArea', { area: this.str, id: this.quData[this.multiIndex[2]].id });
			} else {
				var str=[];
				str[0] = this.multiArray[0][this.multiIndex[0]];
				str[1] = this.multiArray[1][this.multiIndex[1]];
				this.str=str;
				this.$emit('getArea', { area: this.str, id: this.shiData[this.multiIndex[1]].id });
			}
		},
		MultiColumnChange: function(e) {
			//console.log(e)
			var move = e.detail;
			var index = move.column;
			var value = move.value;
			if (index == 0) {
				this.multiIndex[0] = value;
				this.multiIndex[1] = 0;
				this.multiIndex[2] = 0;
			}
			if (index == 1) {
				this.multiIndex[1] = value;
				this.multiIndex[2] = 0;
			}
			if (index == 2) {
				this.multiIndex[2] = value;
			}
			this.getShen();
		},
		// 获取省
		getShen: function() {
			this.request
				.myRequest({
					url: '/api/baseArea/queryAllArea',
					data: {
						level: 0,
						areaType: uni.getStorageSync('areaType')
					}
				})
				.then(res => {
					var data = res.data;
					var shen = [];
					for (var i = 0; i < data.length; i++) {
						shen.push(data[i].areaName);
					}
					this.shenData = data;
					this.$set(this.multiArray, 0, shen);
					this.getShi();
				})
				.catch(error => {});
		},
		// 获取市
		getShi: function() {
			var num = this.multiIndex[0];
			var id = this.shenData[num].id;
			this.request
				.myRequest({
					url: '/api/baseArea/queryAllArea',
					data: {
						level: 1,
						parentId: id,
						areaType: uni.getStorageSync('areaType')
					}
				})
				.then(res => {
					var data = res.data;
					var shi = [];
					for (var i = 0; i < data.length; i++) {
						shi.push(data[i].areaName);
					}
					this.shiData = data;

					this.$set(this.multiArray, 1, shi);
					
					this.getQu();
				})
				.catch(error => {});
		},
		// 获取区
		getQu: function(e) {
			var num = this.multiIndex[1];
			var id = this.shiData[num].id;
			this.request
				.myRequest({
					url: '/api/baseArea/queryAllArea',
					data: {
						level: 2,
						parentId: id,
						areaType: uni.getStorageSync('areaType')
					}
				})
				.then(res => {
					var data = res.data;
					if (data != '') {
						var qu = [];
						for (var i = 0; i < data.length; i++) {
							qu.push(data[i].areaName);
						}
						this.quData = data;
						this.$set(this.multiArray, 2, qu);
						//console.log(this.multiArray)
						
					}
					if(!uni.getStorageSync('addressInfo')){
						this.MultiChange()
					}
					
				})
				.catch(error => {
					// //console.log(error);
				});
		}
	}
};
</script>
<style scoped>
	.picker{
		flex:1
	}
</style>
