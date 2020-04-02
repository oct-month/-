var encoding = require("/libs/encoding.js")

App({
	decodeGbk: function (bytes) {
		var unit8Arr = new Uint8Array(bytes)
		var string = new encoding.TextDecoder('gbk').decode(unit8Arr)
		return string
	},
})
