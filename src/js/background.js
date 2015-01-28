(function(){
  
  /* Declarations for all URL regex matching patterns */

  var YT_URLs = {
    nav: {
      channel_video_list: /.+:\/\/www\.youtube\.com\/user\/.*\/videos/,
      general: /.+:\/\/www\.youtube\.com*/
    },
    player: {
      watch: /.+:\/\/www\.youtube\.com\/watch.*/
    }
  };

  var msg_params = {};
  var prevURL = null;

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status === 'loading') {
      console.log(tab);
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (prevURL !== null) {
          if (YT_URLs.player.watch.test(tab.url) && YT_URLs.nav.general.test(prevURL)) {
            msg_params = {watch: true};
            chrome.tabs.sendMessage(tabs[0].id, msg_params, function(response) {
              // Placeholder
            });
          }
        }
        prevURL = tab.url;
      }); 
    }
  });
})();