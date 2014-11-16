(function(){
  
  var removedTag = 'list-href-removed';
  var content = '#content';
  var gridContainer = '#channels-browse-content-grid';
  var listContainer = '#browse-items-primary';
  var imgHrefTile = '.ux-thumb-wrap';
  var imgHrefRemoved = '.ux-thumb-wrap:not(.list-href-removed)';
  var titleHrefLink = '.yt-uix-tile-link';
  var titleHrefRemoved = '.yt-uix-tile-link:not(.list-href-removed)';
  var listInsertTarget = 'li.feed-item-container';
  var gridInsertTarget = 'li.channels-content-item';
  var matchURL = /.+:\/\/www\.youtube\.com\/user\/.*\/videos/;

  function removePlaylistHref(ytTile) {
    var hrefURL = ytTile.attr('href');
    var tokens = hrefURL.split(/&list/);
    console.log(hrefURL);
    console.log(tokens[0]);
    ytTile.addClass(removedTag);
    ytTile.attr('href', tokens[0]); 
  }

  // Attempt to find un-removed links with cached pages.
  // When the user clicks the back/forward action in browser, cached pages are loaded instanteniously.
  // Can only catch this scenario with a reasonable timeout.
  // TODO: Add browser action listener in background page and send a message to here whenever user goes forward or backward

  function cachedExecute() {
    setTimeout(function() {
      if ($(imgHrefRemoved).length) {
        init();
      }
    }, 1000);
  }

  function initSubsequentCallListener() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.nav_rmPL) {
        $(document).off().on('DOMNodeInserted', content, function(event) {

          if (($(event.target).find(gridContainer).length
                || $(event.target).find(listContainer).length) && matchURL.test(event.target.baseURI)) {
            $(document).off();
            removeListeners();
            init();
          }

          // If we catch one insertion event and the URL does not match, then disable all event handlers
          else if (!matchURL.test(event.target.baseURI)) {
            $(document).off();
          }
        });
        cachedExecute();
      }
    });
  }

  function execute(newTitles, newImgs, isGrid) {
    if (newTitles.length) {
      newTitles.each(function() {
        removePlaylistHref($(this));
      });
    }
    if (newImgs.length) {
      newImgs.each(function() {
        removePlaylistHref($(this));
      });
    }
  }

  function removeListeners() {
    $(gridContainer).off();
    $(listContainer).off();
  }

  function init() {
    execute($(titleHrefLink), $(imgHrefTile));

    $(gridContainer).on('DOMNodeInserted', gridInsertTarget,function(event) {
      execute($(event.target).find(titleHrefRemoved),
              $(event.target).find(imgHrefRemoved), 'grid');
    });

    $(listContainer).on('DOMNodeInserted', listInsertTarget, function(event) {
      execute($(event.target).find(titleHrefRemoved),
              $(event.target).find(imgHrefRemoved), 'list');
    });
  }

  removeListeners();

  // This URL matching test is for testing if the first Youtube site loaded is within any channel.
  // Since this content script is injected in any Youtube page (due to AJAX modifications on DOM + HTML5 pushState usage by Youtube pages),
  // We need to make sure that this script is ran immediately when the current tab lands on a [channel+videos] page

  chrome.storage.sync.get('nav_rmPL', function(result){
    var rmPLtoggle = result['nav_rmPL'];
    if (rmPLtoggle && matchURL.test(window.location.href)) {
      init();
    }
    initSubsequentCallListener();
  });

})();