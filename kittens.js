(function() {
	var kittenUrl = "http://placekitten.com/",
	extra = "";
	// If always enabled for this host.
	chrome.extension.sendRequest({method: "getOptions", hostname: window.location.hostname}, function(response) {
		if(response.enabledHost){
			findPotentialKittens(document);
			document.addEventListener("DOMNodeInserted", function (e) {
				findPotentialKittens(e.target);
			}, false);
		}else {
			listenForKonamiCode(findPotentialKittens);
		}
	});

	/**
	* Listen for konamicode
	*/
	function listenForKonamiCode (callback) {
		// Thanks to http://mattkirman.com/2009/05/11/how-to-recreate-the-konami-code-in-javascript/
		if (window.addEventListener) {
			// create the keys and konami variables
			var keys = [],
				konami = "38,38,40,40,37,39,37,39,66,65";
			// bind the keydown event to the Konami function
			window.addEventListener("keydown", function (e){
				// push the keycode to the 'keys' array
				keys.push(e.keyCode);
				// and check to see if the user has entered the Konami code
				if (keys.toString().indexOf(konami) >= 0) {
					callback();
					// and finally clean up the keys array
					keys = [];
				}
			}, true);
		}
	}

	/**
	* Loop through all the images and replace them with kittens.
	*/
	function findPotentialKittens () {
		if(document.getElementsByTagName){
			var imgs = document.getElementsByTagName('img');
			for(var i = 0; i < imgs.length; i++) {
				makeKitten(imgs[i])();
				imgs[i].onload = makeKitten(this); // To also change cached images
			}
		}
	}
	/**
	* Makes image into kitten if image is big enough and isn't already a kitten.
	*/
	function makeKitten (img) {
		console.log('executing1');
		return function () {
			console.log('executing2', img);
			if (img.width > 5 && img.height > 5 && img.src.slice(0, kittenUrl.length) !== kittenUrl) {
				img.src = kittenUrl+extra+img.width+"/"+img.height;
				extra = extra === "" ? "g/" : "";
			}
		};
	}
})();