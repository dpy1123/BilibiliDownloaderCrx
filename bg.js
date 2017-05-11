(function(){
	console.log('init');

	var _watchUrls = ['bilibili.com/video','bilibili.com/anime'];

	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
		if(changeInfo.status == 'loading'){
			var urlPattern = new RegExp("("+_watchUrls.join('|')+")");
			if(urlPattern.test(tab.url)){
				chrome.tabs.executeScript(tabId, {file : "main.js"});
			}
		}
	});
}());
