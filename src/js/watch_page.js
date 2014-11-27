(function(){
  "use strict";

  var matchURL = /.+:\/\/www\.youtube\.com\/watch.*/;
  var player = null;

  function init() {
    player = $('#movie_player');
  }

  function initPlayerSize(size) {
    var playerContainer = $('#player');
    var contentContainer = $('#watch7-container');
    var theater = $('#theater-background');
    if (size === 'small') {
      playerContainer.removeClass('watch-medium').addClass('watch-small');
      contentContainer.removeClass('watch-wide');
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
      theater.css('background-color', '#1b1b1b');
    }
  }

  function injectPlayerScript(settings) {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('src/js/player.js');
    s.onload = function() {
      this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
    document.addEventListener('YTools_PlayerLoaded_V1', function(event){
      if (event.detail === 'playerLoaded') {
        document.dispatchEvent(new CustomEvent('YTools_PlayerSettingsEvent_V1', {detail: settings}));
      }
    });

    init();

    initPlayerSize(settings['player_size']);
  }

  function init() {
    chrome.storage.sync.get(['player_quality',
                             'player_volume',
                             'player_pauseOnStart',
                             'player_size'], function(result){
      injectPlayerScript(result);
    });
  }

  if (matchURL.test(window.location.href)) {
    init();
  }
})();