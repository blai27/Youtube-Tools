(function(){

  "use strict";

  var matchURL = /.+:\/\/www\.youtube\.com\/watch.*/;
  var player = '#movie_player';
  var content = '#content';
  var scriptLoaded = false;
  var isCurrentScriptLoaded = false;

  function initSubsequentCallListener() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.watch) {
        setTimeout(function() {
          init(true);
        }, 1000); // Temporary detection

        $(document).off().on('DOMNodeInserted', function(event) {
          //TODO: Determine exactly when the player is dynamically loaded
        });

      } else if (request.watch === undefined || request.watch === false) {
        
      }
    });
  }

  function initPlayerSize(size) {
    var playerContainer = $('#player');
    var contentContainer = $('#watch7-container');
    var pageContainer = $('#page');
    var theater = $('#theater-background');
    var originalTheaterColor = '#1b1b1b';
    if (size === 'small') {
      playerContainer.removeClass('watch-medium').addClass('watch-small');
      contentContainer.removeClass('watch-wide');
      pageContainer.removeClass('watch-stage-mode');
      pageContainer.addClass('watch-non-stage-mode');
      theater.css('background-color', 'transparent');
    } 
    else if (size === 'large') {
      if (!playerContainer.hasClass('watch-medium')) {
        playerContainer.removeClass('watch-small');
        playerContainer.addClass(' watch-medium ');
      }
      if (!contentContainer.hasClass('watch-wide')) {
        contentContainer.addClass(' watch-wide ');
      }
      pageContainer.removeClass('watch-non-stage-mode');
      pageContainer.addClass('watch-stage-mode');
      theater.css('background-color', originalTheaterColor); // This color is the original color when the video screen is enlarged
    }
  }

  function initMiscOptions(settings) {
    initPlayerSize(settings['player_size']);

    if (settings['player_annotation']) {
      if (!  ($('.ytp-segmented-control-deselected').prop('aria-checked') == true) ) {
        $('.ytp-segmented-control-deselected').click(); // Not pleasant but only solution for HTML5 players  
      }
    }
  }

  function injectPlayerScript(settings, isSubsequent) {
    if (!scriptLoaded) {
      var s = document.createElement('script');
      s.src = chrome.extension.getURL('src/js/player.js');
      s.onload = function() {
        this.parentNode.removeChild(this);
      };
      (document.head || document.documentElement).appendChild(s);

      if (!isSubsequent) {
        console.log('not subsequent');
        document.addEventListener('YTools_PlayerLoaded_V1', function(event){
          if (event.detail === 'playerLoaded') {
            document.dispatchEvent(new CustomEvent('YTools_PlayerSettingsEvent_V1', {detail: settings}));
          }
          document.removeEventListener('YTools_PlayerLoaded_V1');
          initMiscOptions(settings);
        });
      }
      scriptLoaded = true;
    }

    if (isSubsequent) {
      document.dispatchEvent(new CustomEvent('YTools_PlayerSettingsEvent_V1', {detail: settings}));
      initMiscOptions(settings);
    }

    
  }

  function init(isSubsequent) {
    chrome.storage.sync.get(['player_quality',
                             'player_volume',
                             'player_pauseOnStart',
                             'player_size',
                             'player_annotation'], function(result){
      injectPlayerScript(result, isSubsequent);
    });
  }

  initSubsequentCallListener();

  if (matchURL.test(window.location.href)) {
    init(false);
    isCurrentScriptLoaded = true;
  }

})();