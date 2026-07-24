// const baseUrl = 'http://47.118.16.150:1001';
const baseUrl = 'https://epluscanada.com';
// const baseUrl = 'https://epluscanada.com';
// const baseUrl = 'http://192.168.0.172:1001';

// 本地开发时跳相对路径，避免整页跳到线上域名；生产环境仍跳线上登录页
const loginUrl = process.env.NODE_ENV === 'development'
	? '/#/pages/login/login'
	: 'https://mobile.shuyu-global.com/#/pages/login/login';

function redirectToLogin() {
	window.location.href = loginUrl;
}
// resolve函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去
// reject函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去
//.then() Promise 实例添加状态改变时的回调函数 then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejectedm,
// .catch()指定发生错误时的回调函数
// 带token请求
let isRefreshing = true;
function myRequest(options, retry=3, domain='https://epluscanada.com') {
	var accessToken = uni.getStorageSync('YjaccessToken');
	var refreshToken = uni.getStorageSync('YjrefreshToken');
	return new Promise((res, rej) => {
		uni.request({
			url: domain + options.url,
			method: options.method || 'GET',
			data: options.data,
			header: {
				'content-type': 'application/json',
				'Authorization': accessToken.replace(/\"/g, "")
			},
			success(data) {
			
				if (data.statusCode == 401) {
					uni.showToast({
						title: '您未登录，请先登录',
						duration: 1500,
						icon: 'none'
					})
					//setTimeout(function() {
						uni.setStorageSync('YjaccessToken', '');
						 redirectToLogin()
						// uni.navigateTo({
						// 	url: '/pages/login/login'
						// })

					//}, 1500);
					rej(data)
				} else if (data.statusCode == 402) {
					//uni.showToast({
					//	title: '您的登录状态已失效，请先登录',
					//	duration: 2000,
					//	icon: 'none'
					//})
					//setTimeout(function() {
						uni.setStorageSync('YjaccessToken', '');
						 redirectToLogin()
						// uni.redirectTo({
						// 	url: '/pages/login/login'
						// })
					//}, 2000);
					rej(data)
				} else if (data.statusCode == 420) {
					
					uni.showToast({
						title: data.data.message,
						duration: 2000,
						icon: 'none'
					})
					rej(data)
				} else if (data.statusCode == 403) {
					uni.showToast({
						title: '暂无权限',
						duration: 2000,
						icon: 'none'
					})
					uni.setStorageSync('YjaccessToken', '');
					redirectToLogin()
					// uni.navigateTo({
					// 	url:'/pages/login/login'
					// })
					rej(data)
				} else if (data.statusCode == 500) {
					console.error('接口500错误：', options.url, data.data)
					uni.showToast({
						title: '服务器打小报告啦',
						duration: 2000,
						icon: 'none'
					})
					rej(data)
				} else if (data.statusCode == 200 || data.statusCode == 201) {
					res(data)
				} else {
					uni.showToast({
						title: '请求失败，请稍后重试',
						duration: 2000,
						icon: 'none'
					})
					rej(data)
				}
			},
			fail(error) {
				if (retry > 0) {
					myRequest(options, retry - 1, domain).then(res).catch(rej);
				} else {
					uni.showToast({
						title: '网络异常，请检查网络后重试',
						duration: 2000,
						icon: 'none'
					})
					rej(error);
				}
			}
		})
	})
}
// 不带token请求
function myRequestOne(options, retry=3) {
	return new Promise((res, rej) => {
		uni.request({
			url: baseUrl + options.url,
			method: options.method || 'GET',
			data: options.data,
			header: {
				'content-type': 'application/json',
				'Authorization': ""
			},
			success(data) {
				if (data.statusCode == 401) {
					//uni.showToast({
					//	title: '您的登录状态已失效，请先登录',
					//	duration: 2000,
					//	icon: 'none'
					//})
					//setTimeout(function() {
						redirectToLogin()
						// uni.redirectTo({
						// 	url: '/pages/login/login'
						// })
					//}, 2000);
					rej(data)
				} else if (data.statusCode == 420) {
					uni.showToast({
						title: data.data.message,
						duration: 2000,
						icon: 'none'
					})
						rej(data)
				}else if(data.statusCode == 500){
					uni.showToast({
						title: '服务器打小报告啦',
						duration: 2000,
						icon: 'none'
					})
					rej(data)
				}else if (data.statusCode == 200 || data.statusCode == 201) {
					res(data)
				} else {
					uni.showToast({
						title: '请求失败，请稍后重试',
						duration: 2000,
						icon: 'none'
					})
					rej(data)
				}

			},
			fail(error) {
				if (retry > 0) {
					myRequestOne(options, retry - 1).then(res).catch(rej);
				} else {
					uni.showToast({
						title: '网络异常，请检查网络后重试',
						duration: 2000,
						icon: 'none'
					})
					rej(error)
				}
			}
		})
	})
}

function referToken() {
	if (uni.getStorageSync("YjrefreshToken")) {
		myRequestOne({
			url: `/auth/refreshToken`,
			data: {
				'refreshToken': uni.getStorageSync("YjrefreshToken").replace(/\"/g, "")
			}
		}).then(res => {
			uni.setStorageSync('YjaccessToken', JSON.stringify(res.data.accessToken));
			uni.setStorageSync('YjrefreshToken', JSON.stringify(res.data.refreshToken));
			uni.setStorageSync('YjuserInfo', JSON.stringify(res.data.user));
			//执行缓存中的请求
			onAccessTokenFetched()
			//延迟几秒再将刷新token的开关放开，不然偶尔还是会重复提交刷新token的请求
			setTimeout(() => {
				isRefreshing = true
			}, 1500)
		})
	}
}

function checkStatus(params) {
	//console.log('pppp')
	// 刷新token的函数,这需要添加一个开关，防止重复请求
	if (isRefreshing) {
		referToken()
		//console.log('pppp')
	}
	isRefreshing = false;
	// 将token刷新成功后的回调请求缓存 
	const retryOriginalRequest = new Promise((resolve) => {
		addSubscriber(() => {
			resolve(myRequest(params))
		})
	});
	return retryOriginalRequest;
}
// 缓存
let subscribers = [];

function onAccessTokenFetched() {
	subscribers.forEach((callback) => {
		callback()
	})
	subscribers = [];
}

function addSubscriber(callback) {
	subscribers.push(callback)
}

export default {

	baseUrl,
	myRequest,
	myRequestOne,
	redirectToLogin,
}
