// 首页
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		url: "https://www.biduo.cc",
		content: "",
		message: "欢迎！"
	},
	// 记录查询框的输入
	getContent: function (event) {
		this.setData({
			content: event.detail.value
		})
	},
	// 提交查询
	toSearch: function (event) {
		if(this.data.content) {
			var data = new Object()
			data.content = this.data.content
			data.page = 1
			wx.setStorage({
				key: "search",
				data: data,
				success: function() {
					wx.navigateTo({
						url: '/pages/search/search'
					})
				}
			})
		}
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})