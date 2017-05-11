var BilibiliDownloader = {
	_httpGet: function (url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === xhr.DONE) {
				if (xhr.status === 200 || xhr.status === 0) {
					if (xhr.response) {
						callback(xhr.response);
					} else {
						console.warn("[" + url + "] seems to be unreachable or file there is empty");
					}
				} else {
					console.error("Couldn't load [" + url + "] [" + xhr.status + "]");
				}
			}
		};
		xhr.open("GET", url, true);
		xhr.responseType = "json";
		xhr.send(null);
	},
	_jsonPost: function (url, data, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === xhr.DONE) {
				if (xhr.status === 200 || xhr.status === 0) {
					callback(xhr.response);
				} else {
					console.error("jsonPost err [" + url + "] [" + xhr.status + "]");
				}
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.responseType = "json";
		xhr.send(JSON.stringify(data));
	},
	_formPost: function (url, data, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === xhr.DONE) {
				if (xhr.status === 200 || xhr.status === 0) {
					callback(xhr.response);
				} else {
					console.error("jsonPost err [" + url + "] [" + xhr.status + "]");
				}
			}
		};
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.responseType = "json";
		xhr.send(data);
	},

	getPlay: function (aid, page) {
		let url = "http://api.bilibili.com/playurl?type=json&platform=html5&aid=" + aid + "&page=" + page;
		this._httpGet(url, function (resp) {
			if (resp.code == 40002) {
				console.log('gg.此视频需要appkey和secret才行.')
			} else if (resp.result == 'suee') {
				console.log('[p' + page + ']...' + resp.durl[0].url)
			}
		})
	},

	getAnimeAid: function (expId, callback) {
		this._formPost("http://bangumi.bilibili.com/web_api/get_source", "episode_id=" + expId, function (resp) {
			if (resp.code == 0)
				callback(resp.result.aid)
			else
				console.log(resp.message)
		})
	}
};

(function () {
	console.log('inject')

	document.onreadystatechange = function () {
		if (document.readyState == "interactive" || document.readyState == "complete"){
			if (/anime\/(\d*)/.test(location.href)) {// anmie/XXX/play#XXXXX
				var expId = /play\#(\d*)/.exec(location.href)[1]
				BilibiliDownloader.getAnimeAid(expId, function (aid) {
					var totalPages = document.querySelector('ul > div > div > div.slider-list-content > div > ul').childElementCount;
					for (let i = 1; i <= totalPages; i++)
						BilibiliDownloader.getPlay(aid, i);
				})
			} else {// video/avXXXX
				var aid = /av(\d*)/.exec(location.href)[1],
					totalPages = document.querySelector('#plist').childElementCount;
				let i = 1;
				do {
					BilibiliDownloader.getPlay(aid, i);
					i++;
				} while (i <= totalPages)
			}
		}
	};

}())
