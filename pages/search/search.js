// 查询结果页
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		url: "https://www.biduo.cc",
		content: "",				// 搜索参数
		message: "",				// 消息
		books: new Array(),			// 结果集
		page: 1,					// 当前页数
		pages: 1					// 总页数
	},
	// 显示错误信息
	getMessage: function() {
		this.setData({
			message: "未搜索到任何结果"
		})
	},
	// 获取html，写入books
	getBooks: function () {
		wx.showNavigationBarLoading()	// 显示加载的圈圈
		var url = this.data.url + "/search.php?q=" + this.data.content + "&p=" + this.data.page
		var that = this
		wx.request({
			url: url,
			method: "GET",
			success: function (res) {
				var result = that.getBooksSearch(res.data)
				that.setData({
					books: result
				})
				that.getMessage()
			},
			fail: function () {
				that.getMessage()
			},
			complete: function() {
				wx.hideNavigationBarLoading()
			}
		})
	},
	// 分析出页数，写入pages（顺便拿一页）
	getBookPages: function () {
		wx.showNavigationBarLoading()	// 显示加载的圈圈
		var url = this.data.url + "/search.php?q=" + this.data.content + "&p=" + this.data.page
		var that = this
		wx.request({
			url: url,
			method: "GET",
			success: function (res) {
				// 分析页数
				var reg = /<a\s+href=".*?p=(\d+)">末页<\/a>/im
				var datalist = res.data.match(reg)
				if (datalist && datalist.length >= 2)
					that.setData({
						pages: Number(datalist[1])
					})
				// 分析第一页
				var result = that.getBooksSearch(res.data)
				that.setData({
					books: result
				})
				that.getMessage()
			},
			fail: function () {
				that.getMessage()
			},
			complete: function() {
				wx.hideNavigationBarLoading()
			}
		})
	},
	// 分析一页html
	getBooksSearch: function (data) {
		var reg1 = /<div\s+class="result-item\s+result-game-item">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/img
		var reg2 = /<div\s+class="result-game-item-pic">[\s\S]*?<img\s+src="([\s\S]*?)"[\s\S]*?<div\s+class="result-game-item-detail">[\s\S]*?<a[\s\S]*?href="([\s\S]*?)"[\s\S]*?<span>([\s\S]*?)<[\s\S]*?<p\s+class="result-game-item-desc">([\s\S]*?)<[\s\S]*?<p\s+class="result-game-item-info-tag">[\s\S]*?<span>([\s\S]*?)<[\s\S]*?<span\s+class="result-game-item-info-tag-title">([\s\S]*?)<[\s\S]*?<span\s+class="result-game-item-info-tag-title">([\s\S]*?)<[\s\S]*?<a\s+cpos="newchapter"[\s\S]*?href="([\s\S]*?)"[\s\S]*?>([\s\S]*?)</im
		var result = new Array()
		// 获取分组
		var datalist = data.match(reg1)
		if (datalist)
		{
			for (var i = 0; i < datalist.length; i++) 
			{
				result[i] = new Array()
				var da = datalist[i]
				var dalist = da.match(reg2)
				if(dalist)
				{
					for (var j = 1; j < dalist.length; j++) 
					{
						result[i][j - 1] = dalist[j]
					}
				}
			}
		}
		
		return result
		
	},
	// 左翻页
	page_left: function (event) {
		var tap = this.data.page - 1
		if(tap>0)
		{
			var data = new Object()
			data.page = tap
			data.content = this.data.content
			wx.setStorage({
				key: 'search',
				data: data,
				success: function() {
					wx.redirectTo({
						url: '/pages/search/search'
					})
				}
			})
		}
	},
	// 右翻页
	page_right: function (event) {
		var tap = this.data.page + 1
		if (tap <= this.data.pages)
		{
			var data = new Object()
			data.page = tap
			data.content = this.data.content
			wx.setStorage({
				key: 'search',
				data: data,
				success: function () {
					wx.redirectTo({
						url: '/pages/search/search'
					})
				}
			})
		}
	},
	// 进入book详情（章节）页
	bookDetail: function(event) {
		var data = new Object()
		data.url = event.currentTarget.dataset.bookurl
		data.content = event.currentTarget.dataset.bookcontent
		data.title = event.currentTarget.dataset.booktitle
		data.image = event.currentTarget.dataset.bookimage
		data.author = event.currentTarget.dataset.bookauthor
		wx.setStorage({
			key: 'detail',
			data: data,
			success: function() {
				wx.navigateTo({
					url: '/pages/detail/detail'
				})
			}
		})
	},
	// 进入章节
	bookCapter: function(event) {
		var data = new Object()
		data.chapterurl = event.currentTarget.dataset.newurl
		data.title = event.currentTarget.dataset.booktitle
		// data.chaptername = event.currentTarget.dataset.chaptername
		data.bookurl = event.currentTarget.dataset.bookurl
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
			key: 'search',
			success: function(res) {
				that.setData({
					content: res.data.content,
					page: Number(res.data.page)
				})
				that.getBookPages(that.data.url + '/search.php?q=' + that.data.content)
				wx.setNavigationBarTitle({
					title: that.data.content
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