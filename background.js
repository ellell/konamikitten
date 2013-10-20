chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	if (request.method == "getOptions")
		sendResponse({enabledHost: localStorage[request.hostname]});
	else
		sendResponse({});
});