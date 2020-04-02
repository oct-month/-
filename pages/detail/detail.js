// 书籍详情页
var decodeGbk = getApp().decodeGbk

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		url: "",
		content: "",		// 简介
		title: "",			// 书名
		image: "",			// 图片
		author: "",			// 作者
		chapters: new Array()	// 章节
	},
	// 分析一页html
	getChaptersSearch: function(html) {
		var reg1 = /<dd>[\s\S]*?<a\s+href=[\s\S]*?>[\s\S]*?<\/a>[\s\S]*?<\/dd>/img
		var chapts = html.match(reg1)
		var reg2 = /<dd>[\s\S]*?<a\s+href="(.*?)".*?>([\s\S+]*?)<\/a>/im
		var result = new Array()
		if (chapts)
		{
			for (var i = 0; i < chapts.length; i++) 
			{
				result[i] = new Array()
				var tap = chapts[i].match(reg2)
				if(tap)
				{
					for (var j = 1; j < tap.length; j++) 
					{
						result[i][j - 1] = tap[j]
					}
				}
			}
		}
		return result
	},
	// 获取所有章节
	getChapters: function() {
		wx.showNavigationBarLoading()	// 显示加载的圈圈
		var that = this
		wx.request({
			url: that.data.url,
			method: "GET",
			responseType: "arraybuffer",
			success: function (res) {
				var html = decodeGbk(res.data)
				var result = that.getChaptersSearch(html)
				that.setData({
					chapters: result
				})
			},
			fail: function () {
				
			},
			complete: function() {
				wx.hideNavigationBarLoading()
			}
		})
	},
	readChapter: function(event) {
		var url = event.currentTarget.dataset.chapterurl
		url = "https://www.biduo.cc" + url
		var data = new Object()
		data.chapterurl = url
		data.title = this.data.title
		// data.chaptername = event.currentTarget.dataset.chaptername
		data.bookurl = this.data.url
		wx.setStorage({
			key: 'chapter',
			data: data,
			success: function() {
				wx.navigateTo({
					url: '/pages/chapter/chapter',
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this
		wx.getStorage({
			key: 'detail',
			success: function(res) {
				that.setData({
					url: res.data.url,
					content: res.data.content,
					title: res.data.title,
					image: res.data.image,
					author: res.data.author
				})
				that.getChapters()
				wx.setNavigationBarTitle({
					title: that.data.title
				})
			},
		})
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