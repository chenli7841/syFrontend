// import city from "@/utils/sys_district.js"
// 跳转方法
function navUrl(url) {
	uni.navigateTo({
		url: url
	})
}
//提示框
function toast(title) {
	uni.showToast({
		title: title,
		icon: 'none',
		duration: 2000
	})
}
//复制
function copy(str) {
	uni.setClipboardData({
		data: str,
		success: () => {
			uni.showToast({
				title: '复制成功',
				icon: 'none',
				duration: 2000
			});
		}
	});
}
// 地区ID 处理
// function cityFilter(num) {
// 	var num1 = num.slice(0, 2).toString() + '0000'
// 	var num2 = num.slice(0, 4).toString() + '00'
// 	var arr = [num1, num2, num]
// 	return citys(arr)
// }

// function citys(arr) {
// 	var str = ''
// 	arr.map((box) => {
// 		city.city.RECORDS.map((item) => {
// 			if (item.id == box) {
// 				str += item.name
// 			}
// 		})
// 	})
// 	return str
// }

export {
	navUrl,
	toast,
	copy,

}
