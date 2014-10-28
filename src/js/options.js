(function() {
  var navigBtn = null;
  var playerBtn = null;
  var navigPage = null;
  var isDirty = false;

  /* Navigation variables */
  var removePlaylistToggle = null;
  var removePlaylist = false;
  var saveBtn = null;
  var saveNotify = null;

  function initGlobalNavToggle() {
    $('.navbar-nav li').click(function(){
      $('.navbar-nav li.active').removeClass('active');
      var currNav = $(this);
      if (!currNav.hasClass('active')) {
        currNav.addClass('active');
      }
    });
  }

  function globalSettingToggle(panel) {
    var selectedPanel = $('.panel.visible');
    if (!panel.hasClass('visible')) {
      if (selectedPanel.length) {
        selectedPanel.fadeTo('fast', 0, function(){
          selectedPanel.removeClass('visible');
          panel.addClass('visible');
          panel.fadeTo('fast', 1);
        });
      }
    }
  }

  function dirty(flag) {
    if (flag) {
      saveBtn.removeClass('disabled');
    }
    else {
      saveBtn.addClass('disabled');
    }
    isDirty = flag;
  }

  function qDirty() {
    return isDirty;
  }

  function initNavPage() {
    removePlaylistToggle = $('#rm-playlist');
    removePlaylistToggle.change(function(){
      if ($(this).is(':checked')) {
        removePlaylist = true;
      }
      else {
        removePlaylist = false;
      }
      dirty(true);
    });

    saveBtn = $('.navig-settings .save');
    saveNotify = $('.navig-settings .save-notify');

    saveBtn.click(function(){
      chrome.storage.sync.set({
        'nav_rmPL': removePlaylist
      }, function(){
        saveNotify.show();
        dirty(false);
        setTimeout(function(){
          saveNotify.hide();
        }, 1500); 
      }); 
    });
  }

  function reloadSettings() {
    chrome.storage.sync.get('nav_rmPL', function(result){
      removePlaylistToggle[0].checked = result['nav_rmPL'];
    });
  }

  function init() {
    navigBtn = $('.navig-btn');
    playerBtn = $('.player-btn');
    navigPage = $('.navig-settings');
    playerPage = $('.player-settings');

    $('#rm-playlist-icon').tooltip({placement: 'top'});

    // Default nav settings for now
    navigBtn.parent().addClass('active');
    navigPage.css('opacity', '1');

    initGlobalNavToggle();
    
    initNavPage();

    reloadSettings();

    navigBtn.click(function(e){
      globalSettingToggle(navigPage);
    });
    
    playerBtn.click(function(e){
      globalSettingToggle(playerPage);
    });
  }

  init();
})();