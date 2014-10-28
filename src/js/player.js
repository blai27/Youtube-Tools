var player = null;
function getAllOptions() {
  console.log(player.getOptions());
  console.log(player.getOptions('iv-module'));
}
function onYouTubePlayerReady(playerId) {
  player = document.getElementById('movie_player');
  console.log(player);
  player.setVolume(75);
  console.log(player.getDuration());
  console.log(player.getAvailableQualityLevels());
  player.setPlaybackQuality('medium');
  console.log('API call success');
  console.log(player.getVideoLoadedFraction());
  player.addEventListener('onApiChange', 'getAllOptions');
}
console.log("injected successfully");