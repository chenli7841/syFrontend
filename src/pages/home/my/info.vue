<template>
	<view class="container" v-if="userInfo">
		<view class="content">
			<form action="">
				<view class="item">
					<label for="">客户号：</label>
					<view class="itemleft">
						<text class="c_66 f_14">{{ userInfo && userInfo.orderstartnumber }}</text>
					</view>
				</view>
				<view class="item" @click="toEditName(userInfo && userInfo.username, 'username', '用户名')">
					<label for="">用户名：</label>
					<view class="itemleft">
						<input type="text" :value="userInfo && userInfo.username" placeholder="请填写" disabled="" />
						<view class="editText">修改</view>
					</view>
				</view>
				<view class="item" @click="toEditName(userInfo && userInfo.password, 'password', '密码')">
					<label for="">密码</label>
					<view class="itemleft">
						<view class="editText">修改</view>
					</view>
				</view>
				<view class="item" @click="toEditName(userInfo && userInfo.canadaphonenumber, 'canadaphonenumber', '加拿大电话')">
					<label for="">加拿大电话：</label>
					<view class="itemleft">
						<input type="text" :value="userInfo && userInfo.canadaphonenumber" placeholder="请填写" disabled="" />
						<view class="editText">修改</view>
					</view>
				</view>
				<view class="item" @click="toPick()">
					<label for="">取货地点：</label>
					<view class="itemleft">
						<input type="text" :value="userInfo && userInfo.pickuplocation" placeholder="请填写" disabled="" />
						<view class="editText">修改</view>
					</view>
				</view>
				<view class="item" @click="toEditName(userInfo && userInfo.mailbox, 'mailbox', '邮箱')">
					<label for="">邮箱：</label>
					<view class="itemleft">
						<input type="text" :value="userInfo && userInfo.mailbox" placeholder="请填写" disabled="" />
						<view class="editText">修改</view>
					</view>
				</view>
			</form>
		</view>
		<u-select @confirm="selectExpressage" data-id="label" value-name="label" label-name="label" v-model="selectShow" :list="expressageList"></u-select>
		<u-modal title="编辑" v-model="popupShow" @confirm="selectExpressage">
			<view class="checkbox">
				<u-checkbox-group @change="checkboxGroupChange">
					<u-checkbox :name="item.label" v-model="item.checked" v-for="(item, index) in checkboxlist" :key="index">{{ item.label }}</u-checkbox>
				</u-checkbox-group>
			</view>
		</u-modal>
		<u-modal title="编辑" v-model="popupOccupation" @confirm="selectExpressage">
			<view class="checkbox"><input v-model="occupation" class="ipt c333 f32 bfff" type="text" placeholder="请输入职业类型" /></view>
		</u-modal>

		<u-calendar v-model="dateShow" mode="date" @change="subBirthday"></u-calendar>
		<view class="logBtn f28 c333 bfff" @click="out">退出</view>
	</view>
</template>

<script>
import AWS from 'aws-sdk';
export default {
	data() {
		return {
			areaList:[
					{ realName: 'BC-British columbia', id: 1 },
					{ realName: 'MB-Manitoba', id: 2 },
					{ realName: 'ON-Ontario', id: 3 },
					{ realName: 'QC-Quebec', id: 4 },
					{ realName: 'SK-Saskatchewan', id: 5 },
					{ realName: 'AB-Alberta', id: 6 },
					{ realName: 'NL-Newfoundland', id: 7 },
					{ realName: 'NB-New Brunswick', id: 8 },
					{ realName: 'NS-Nova Scotia', id: 9 },
					{ realName: 'PEI-PEI', id: 10 },
					{ realName: 'NV-Nunavut', id: 11 },
					{ realName: 'NT-Northwest Territories', id: 12 },
					{ realName: 'YK-Yukon', id: 13 }
				],
			valuess: [],
			multiSelector: '',
			areaid: 1,
			belongsList: [
				[
					{ realName: 'BC-British columbia', id: 1 },
					{ realName: 'MB-Manitoba', id: 2 },
					{ realName: 'ON-Ontario', id: 3 },
					{ realName: 'QC-Quebec', id: 4 },
					{ realName: 'SK-Saskatchewan', id: 5 },
					{ realName: 'AB-Alberta', id: 6 },
					{ realName: 'NL-Newfoundland', id: 7 },
					{ realName: 'NB-New Brunswick', id: 8 },
					{ realName: 'NS-Nova Scotia', id: 9 },
					{ realName: 'PEI-PEI', id: 10 },
					{ realName: 'NV-Nunavut', id: 11 },
					{ realName: 'NT-Northwest Territories', id: 12 },
					{ realName: 'YK-Yukon', id: 13 }
				],
				[]
			],
			belongstoShow: false,
			birthday: '',
			dateShow: false,
			occupation: '',
			popupOccupation: false,
			seleValue: '',
			popupShow: false,
			checkboxlist: [],
			expressageList: [],
			selectShow: false,
			radiovalue: null,
			areaId: null,
			imageurl: null,
			keyUrl: null,
			userInfo: null,
			areaIndex: [],
			sex: [{ label: '男' }, { label: '女' }],
			age: [
				{
					label: '25以下'
				},
				{
					label: '25-35'
				},
				{
					label: '35-55'
				},
				{
					label: '55以上'
				}
			],
			wish: [
				{
					label: '运费优惠券',
					checked: false
				},
				{
					label: '折扣',
					checked: false
				},
				{
					label: '秒杀',
					checked: false
				},
				{
					label: '预售秒杀',
					checked: false
				},
				{
					label: '会员优惠',
					checked: false
				},
				{
					label: 'vip服务',
					checked: false
				}
			],
			hobby: [
				{
					label: '婴幼儿护理',
					checked: false
				},
				{
					label: '早教',
					checked: false
				},
				{
					label: '教育/考试/升学',
					checked: false
				},
				{
					label: '烹饪/美食',
					checked: false
				},
				{
					label: '美妆/护肤',
					checked: false
				},
				{
					label: '季节热门',
					checked: false
				},
				{
					label: '家居装饰',
					checked: false
				},
				{
					label: '电子产品',
					checked: false
				}
			],
			melDATA: ''
		};
	},
	watch: {
		belongstoShow(e) {
			console.log(e);
			if (e) {
				this.getOnelist()
			}
		},
		areaid(e){
			this.getOnelist()
		}
	},
	methods: {
		//确认修改销售代表
		submitBelongs(e){
			let index=e.detail.value[1];
			if(this.belongsList[1].length == 0){
				uni.showToast({
					title:'请选择销售代表',
					icon:"none",
				})
				return
			}
			let id=this.belongsList[1][index].id;
			if(!id){
				uni.showToast({
					title:'请选择销售代表',
					icon:"none",
				})
				return false
			}
			let data={
				belongstoid:id,
				id:this.userInfo.id,
			}
			this.editUserInfo(data);
		},
		columnchange(e) {
			if(e.detail.column == 0){
				this.areaid=this.areaList[e.detail.value].id;
			}			
		},
		getOnelist() {
			var data = {
				role: 2,
				page: 1,
				size: 1000,
				areaid: this.areaid,
				visible: true
			};
			this.request
				.myRequestOne({
					url: '/api/user',
					method: 'GET',
					data: data
				})
				.then(res => {
					var list = res.data.content;

					let lists=[]
					list.map(items => {
						let item={};
						item.id = items.id;
						item.realName = items.realName;
						lists.push(item)
					});
					this.belongsList[1] = lists;
					this.$forceUpdate();
					console
				})
				.catch(error => {});
		},
		subBirthday(e) {
			this.birthday = e.result;
			this.selectExpressage();
		},
		checkboxGroupChange(e) {
			this.melDATA = e.toString();
		},
		select(e) {
			this.submitType = e;
			if (e == 'sex') {
				this.expressageList = this.sex;
				this.selectShow = true;
			}
			if (e == 'age') {
				this.expressageList = this.age;
				this.selectShow = true;
			}
			if (e == 'wish') {
				this.popupShow = true;
				this.checkboxlist = this.wish;
			}
			if (e == 'preferenceChoice') {
				this.popupShow = true;
				this.checkboxlist = this.hobby;
			}
			if (e == 'occupation') {
				this.popupOccupation = true;
			}
			if (e == 'birthday') {
				this.dateShow = true;
			}
		},
		selectExpressage(e) {
			let data = {};
			if (this.submitType == 'sex') {
				data.sex = e[0].label;
			}
			if (this.submitType == 'age') {
				data.age = e[0].label;
			}
			if (this.submitType == 'wish') {
				data.wish = this.melDATA;
			}
			if (this.submitType == 'preferenceChoice') {
				data.preferenceChoice = this.melDATA;
			}
			if (this.submitType == 'occupation') {
				data.occupation = this.occupation;
			}
			if (this.submitType == 'birthday') {
				data.birthday = this.birthday;
			}
			data.id = this.userInfo.id;
			this.editUserInfo(data);
		},
		editUserInfo(data) {
			this.request
				.myRequest({
					url: '/api/user/updateUser',
					method: 'PUT',
					data: data
				})
				.then(res => {
					uni.showToast({
						title: '修改成功',
						duration: 2000,
						icon: 'none'
					});
				})
				.catch(error => {});
		},
		//退出
		out() {
			this.request
				.myRequest({
					url: '/api/logout',
					method: 'DELETE'
				})
				.then(res => {
					uni.showToast({
						title: '退出成功',
						duration: 2000,
						icon: 'none'
					});
					uni.clearStorage();
					window.location.href = 'https://mobile.shuyu-global.com/#/pages/login/login';
				})
				.catch(error => {});

			// uni.reLaunch({
			// 	url: '/pages/login/login'
			// });
		},
		//更换图像
		chooseImage() {
			uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				success: res => {
					this.uploadHttpRequests(res.tempFiles[0]);
				}
			});
		},
		// 上传图片
		uploadHttpRequests(param) {
			var that = this;
			var credentials = {
				accessKeyId: 'AKIAJEPDGNAK3LSG4D7Q',
				secretAccessKey: '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'
			};
			AWS.config.update(credentials);
			AWS.config.region = 'us-east-1'; //设置区域
			var bucket = new AWS.S3({ params: { Bucket: 'eplus-ex' } }); //选择桶
			var ksy =
				Number(new Date()) +
				Math.random()
					.toString(36)
					.substr(2);
			var params = {
				methods: 'put',
				Body: param,
				Key: 'user/' + ksy + '/' + param.name,
				ContentType: param.type,
				'Access-Control-Allow-Credentials': '*',
				ACL: 'public-read'
			};
			////console.log(params);
			bucket.upload(params, function(err, data) {
				if (err) {
					uni.hideLoading();
					that.$toast('上传失败');
				}
				if (data) {
					//console.log(data)
					uni.hideLoading();
					that.editUserInfo({ avatar: data.Location, id: that.userInfo.id });
					// that.datas=data;
					// that.info.photoUrl = data.Location;
				}
			});
		},
		editUserInfo(payload) {
			//console.log(payload);
			this.request
				.myRequest({
					url: '/api/user/updateUser',
					method: 'PUT',
					data: payload
				})
				.then(res => {
					uni.showToast({
						title: '修改成功',
						duration: 2000,
						icon: 'none'
					});
					this.getUserInfo();
				})
				.catch(error => {});
		},
		radioChange(e) {
			this.radiovalue = e.detail.value;
			var payload = {
				id: this.userInfo.id,
				sex: e.detail.value
			};

			this.editUserInfo(payload);
		},
		toPick(){
			var id=this.userInfo.id;
			var fid=this.userInfo.belongstoid;
			var pid=this.userInfo.pickUpLocationId;
			//console.log(id,fid)
			this.$u.route('/pages/home/pick/pick?id='+id+'&fid='+fid+'&pid='+pid)
		},
		toEditName(oldvalue, property, label) {
			var id = this.userInfo.id;
			var name = this.userInfo.nickName != null ? this.userInfo.nickName : '';

			uni.navigateTo({
				// url: '../editName?way=' + way + '&&value=' + value
				url: './name?id=' + id + '&property=' + property + '&label=' + label + '&oldvalue=' + oldvalue
			});
		},
		toIdentify() {
			uni.navigateTo({
				url: '../identify'
			});
		},
		getUserInfo() {
			this.request
				.myRequest({
					url: '/api/user/getUser',
					data: ''
				})
				.then(res => {
					this.userInfo = res.data;
				})
				.catch(error => {});
		}
	},
	onLoad() {},
	onShow() {
		this.getUserInfo();
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f5f5f5;
}
.container {
	font-size: 28upx;
}
.checkbox {
	padding: 20upx;
	box-sizing: border-box;
}
.mr10 {
	margin-right: 10upx;
}
.confrim-btn {
	.confrim-btns {
		width: 200upx !important;
		margin: 0 auto;
	}
}
.content {
	background-color: #fff;
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		padding: 20upx 20upx;
		margin: 0 auto;
		label {
			color: #333;
			font-size: 28upx;
		}
		.itemleft {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			height: 100upx;
			flex: 1;
			.editText {
				margin-left: 20upx;
				color: rgb(81, 120, 255);
			}
			.userhead {
				width: 90upx;
				height: 90upx;
				image {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					object-fit: cover;
				}
			}
			input {
				text-align: right;
				font-size: 28upx;
				color: #333;
			}
			.arrow {
				width: 32upx;
				height: 32upx;
				margin-left: 14upx;
			}
			.radiolist {
				display: flex;
				text {
					margin-left: 6upx;
				}
				.radioitem:first-child {
					margin-right: 40upx;
				}
			}
		}
	}
	.item:not(:last-child) {
		border-bottom: 2upx solid rgba(230, 239, 242, 0.6);
	}
	.line {
		height: 20upx;
		background-color: #f5f5f5;
	}
}
.logBtn {
	width: 100%;
	height: 88upx;
	text-align: center;
	line-height: 88upx;
	margin-top: 30upx;
}
</style>
