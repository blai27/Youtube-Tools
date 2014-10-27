(function() {
	var navigBtn = null;
	var playerBtn = null;
	var navigPage = null;

	/* Navigation variables */
	var removePlaylistToggle = null;
	var removePlaylist = false;

	function initGlobalNavToggle() {
		$('.navbar-nav li').click(function(){
			$('.navbar-nav li.active').removeClass('active');
			var currNav = $(this);
			if (!currNav.hasClass('active')) {
				currNav.addClass('active');
			}
		});
	}

	function initGlobalSettingToggle(panel) {
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

	function initNavPage() {
		removePlaylist = $('rm-playlist');
		
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
		
		navigBtn.click(function(e){
			initGlobalSettingToggle(navigPage);
			initNavPage();
		});
		playerBtn.click(function(e){
			initGlobalSettingToggle(playerPage);
		});
	}

	init();
})();