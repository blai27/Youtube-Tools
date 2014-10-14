chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("Injected successfully");
});

document.addEventListener('DOMContentLoaded', function() {
	console.log("background script");
});