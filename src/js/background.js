(function(){
  
  /* Declarations for all URL regex matching patterns */

  var YT_URLs = {
    nav: {
      channel_video_list: /.+:\/\/www\.youtube\.com\/user\/.*\/videos/
    },
    player: {

    }
  };

  var msg_params = {};

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status === 'loading') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.storage.sync.get('nav_rmPL', function(result){
          var rmPLtoggle = result['nav_rmPL'];
          if (rmPLtoggle) {
            if (YT_URLs.nav.channel_video_list.test(tab.url)) {
              msg_params = {nav_rmPL: true};    
              chrome.tabs.sendMessage(tabs[0].id, msg_params, function(response) {
                // TODO: may be useful later on with a response handler
              });      
            }
          }
        });
      }); 
    }
  });
})();