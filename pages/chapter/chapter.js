// 章节页
var decodeGbk = getApp().decodeGbk

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		title: "",		// 书名
		bookurl: "",	// 书的链接
		url: "",
		name: "",		// 章节名
		text: "",		// 正文
		lasturl: "",	// 上一章的链接
		nexturl: ""		// 下一章的链接
	},
	// 解析正文
	getTextSearch: function(html) {
		var reg = /<div\s+id="content"[\s\S]*?>([\s\S]*?)<\/div>/im
		var tap = html.match(reg)
		if(tap && tap.length>=2)
		{
			var result = tap[1]
			result = result.replace(/&nbsp;/img, " ")
			result = result.replace(/<br\/?>/img, "\n")
			this.setData({
				text: result
			})
		}
	},
	// 解析章节名称
	getChapterName: function(html) {
		var reg = /<div\s+class="bookname">[\s\S]*?<h1>(.*?)<\/h1>/im
		var tap = html.match(reg)
		if(tap && tap.length >= 2)
		{
			this.setData({
				name: tap[1]
			})
		}
		else 
		{
			this.setData({
				name: "null"
			})
		}
	},
	// 解析上下章的链接
	getLastNext: function(html) {
		var reg1 = /<div\s+class="bottem1">[\s\S]*?<a\s+href="(.*?)"[\s\S]*?上一章</im
		var tap = html.match(reg1)
		
		if(tap && tap.length>=2 && tap[1].indexOf("html") != -1) {
			this.setData({
				lasturl: "https://www.biduo.cc" + tap[1]
			})
		}
		
		var reg2 = /<div\s+class="bottem1">[\s\S]*?章节列表[\s\S]*?<a\s+href="(.*?)"[\s\S]*?下一章</im
		tap = html.match(reg2)
		
		if (tap && tap.length >= 2 && tap[1].indexOf("html") != -1) {
			this.setData({
				nexturl: "https://www.biduo.cc" + tap[1]
			})
		}
	},
	// 获取正文 TODO
	getText: function() {
		wx.showNavigationBarLoading()	// 显示加载的圈圈
		var that = this
		wx.request({
			url: that.data.url,
			method: "GET",
			responseType: "arraybuffer",
			success: function (res) {
				var html = decodeGbk(res.data)
				that.getTextSearch(html)
				that.getChapterName(html)
				that.getLastNext(html)
				wx.setNavigationBarTitle({
					title: that.data.name
				})
			},
			fail: function () {

			},
			complete: function () {
				wx.hideNavigationBarLoading()
			}
		})
	},
	// 上一章
	lastChapter: function() {
		if(this.data.lasturl)	// 如果有上一章
		{
			var data = new Object()
			data.title = this.data.title
			data.chapterurl = this.data.lasturl
			// data.chaptername = this.data.name
			data.bookurl = this.data.bookurl
			wx.setStorage({
				key: 'chapter',
				data: data,
				success: function() {
					wx.redirectTo({
						url: '/pages/chapter/chapter',
					})
				}
			})
		}
		else
		{
			wx.showToast({
				title: '没有上一章',
				icon: "none",
				duration: 400,
				mask: true,
				success: function () {
					setTimeout(function () {
						wx.navigateBack()
					}, 400) //延迟时间
				},
			})
		}
	},
	// 下一章
	nextChapter: function () {
		if(this.data.nexturl)	// 如果有下一章
		{
			var data = new Object()
			data.title = this.data.title
			data.chapterurl = this.data.nexturl
			// data.chaptername = this.data.name
			data.bookurl = this.data.bookurl
			wx.setStorage({
				key: 'chapter',
				data: data,
				success: function () {
					wx.redirectTo({
						url: '/pages/chapter/chapter',
					})
				}
			})
		}
		else 
		{
			wx.showToast({
				title: '没有下一章',
				icon: "none",
				duration: 400,
				mask: true,
				success: function () {
					setTimeout(function () {
						wx.navigateBack()
					}, 400) //延迟时间
				},
			})	
		}
	},
	// 去目录详情页
	toCatalog: function() {
		var data = new Object()
		data.url = this.data.bookurl
		data.title = this.data.title
		wx.setStorage({
			key: 'detail',
			data: data,
			success: function () {
				wx.redirectTo({
					url: '/pages/detail/detail',
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
			key: 'chapter',
			success: function(res) {
				that.setData({
					title: res.data.title,
					url: res.data.chapterurl,
					// name: res.data.chaptername,
					bookurl: res.data.bookurl
				})
				that.getText()
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