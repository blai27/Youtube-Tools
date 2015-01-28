
function changePlayerSettings(settings) {
  var player = document.getElementById('movie_player');
  if (settings['player_quality'] !== undefined) {
    player.setPlaybackQuality(settings['player_quality']);
  }
  if (settings['player_volume'] !== undefined) {
    player.setVolume(settings['player_volume']);
  }
  if (settings['player_pauseOnStart']) {
    player.seekTo(0, true);
    player.pauseVideo();
  }
}

function onYToolsSubsequentCall() {
  document.removeEventListener('YTools_PlayerSettingsEvent_V1');
  document.addEventListener('YTools_PlayerSettingsEvent_V1', function(event) {
    changePlayerSettings(event.detail);
  });
}

function onYouTubePlayerReady(playerId) {
  document.removeEventListener('YTools_PlayerSettingsEvent_V1');
  document.addEventListener('YTools_PlayerSettingsEvent_V1', function(event){
    changePlayerSettings(event.detail);
  });
  document.dispatchEvent(new CustomEvent('YTools_PlayerLoaded_V1', {detail: 'playerLoaded'}));  
}

onYToolsSubsequentCall();