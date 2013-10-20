function saveOptions () {
	var select = document.getElementById('alwaysEnabled'),
	alwaysEnabled = false,
	code = 'window.location.reload();';

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
		var parsedUri = parseUri(tabs[0].url);
		if(select.checked){
			alwaysEnabled = true;
			localStorage.setItem(parsedUri.hostname, true);
		}else{
			localStorage.removeItem(parsedUri.hostname);
		}
		chrome.tabs.executeScript(tabs[0].id, {code: code});

		var status = document.getElementById('status');
		status.innerHTML = 'Options Saved.';
		setTimeout(function () {
			status.innerHTML = '';
		}, 750);
	});
}

/**
* Restores select box state to saved value from localStorage.
*/
function restoreOptions () {
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
		var enabled = false;
		var parsedUri = parseUri(tabs[0].url);
		if (localStorage.getItem(parsedUri.hostname)){
			enabled = true;
		}
		var select = document.getElementById('alwaysEnabled');
		select.checked = enabled;
	});
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#save').addEventListener('click', saveOptions);

/** Parse a URL. Based upon http://blog.stevenlevithan.com/archives/parseuri
* Inputs: url: the URL you want to parse
* Outputs: object containing all parts of |url| as attributes
*/
parseUri = function(url) {
	var matches = /^(([^:]+(?::|$))(?:(?:\w+:)?\/\/)?(?:[^:@\/]*(?::[^:@\/]*)?@)?(([^:\/?#]*)(?::(\d*))?))((?:[^?#\/]*\/)*[^?#]*)(\?[^#]*)?(\#.*)?/.exec(url);
	// The key values are identical to the JS location object values for that key
	var keys = ['href', 'origin', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'];
	var uri = {};
	for (var i = 0; i < keys.length; i++)
		uri[keys[i]] = matches[i] || '';
	return uri;
};