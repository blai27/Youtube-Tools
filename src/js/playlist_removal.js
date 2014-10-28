// chrome.browserAction.onClicked.addListener(function(tab) {
//   console.log("Injected successfully");
// });

(function(){

  function removePlaylistHref(ytTile) {
    var hrefURL = ytTile.attr('href');
    var tokens = hrefURL.split(/&list/);
    console.log(hrefURL);
    console.log(tokens[0]);
    ytTile.addClass('list-href-removed');
    ytTile.attr('href', tokens[0]);    
  }

  // Disable auto list link from channel/video -> viewer
  $('.yt-uix-tile-link').each(function(){
    removePlaylistHref($(this));
  });

  $('a.ux-thumb-wrap').each(function(){
    removePlaylistHref($(this));
  });

  // Bind click event to Load More button, listen for the videos container mutation event
  // and perform the same href list removal
  $('.yt-uix-load-more').click(function(){
    $('#channels-browse-content-grid').bind('DOMSubtreeModified', function(){
      $('.yt-uix-tile-link:not(.list-href-removed)').each(function(){
        removePlaylistHref($(this));
      });
      $('.ux-thumb-wrap:not(.list-href-remove)').each(function(){
        removePlaylistHref($(this));
      });
    });
  });
})();