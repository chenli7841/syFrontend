import http from './http.js'
// 单张上传
function getToken(file, filePath, type) {
	return new Promise((resolve, reject) => {
		http
			.myRequest({
				url: '/api/qiNiuContent/getuploadtoken',
				data: {
					bucket: type == 1 ? "sjt-public" : "sjt-proprietary"
				}
			})
			.then(res => {
				wx.uploadFile({
					url: 'https://upload-z2.qiniup.com',
					filePath: filePath,
					name: 'file',
					file: file,
					formData: {
						token: res.data.token,
						key: Number(new Date()) +
							Math.random()
							.toString(36)
							.substr(2)
					},
					success: ress => {
						if (ress.statusCode == 200) {
							wx.showToast({
								title: '上传成功',
								duration: 1500,
								icon: 'none'
							});
						} else {
							wx.showToast({
								title: '上传失败',
								duration: 1500,
								icon: 'none'
							});
						}
						resolve(JSON.parse(ress.data).key)
					},
					fail: error => {
						wx.showToast({
							title: '网络连接不上啦',
							duration: 1500,
							icon: 'none'
						});
						reject(error)
					},
				});
			})
			.catch(error => {});
	})
}
module.exports = {
	getToken
}
