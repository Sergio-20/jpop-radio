let song = new Audio;
let muted = false;
let volume = 1;

song.type = "audio/mp3";
song.src = "https://listen.moe/stream";


function skip( time )
{
  if( time == "back" )
  {
    song.currentTime -= - 5;
  }
  else if( time == "fwd" )
  {
    song.currentTime += 5;
  }
}


function playPause()
{
  if( !song.paused )
  {
    song.pause();
  }
  else
  {
    song.play();
  }
}


function stop()
{
  song.pause();
  song.currentTime = 0;
  document.querySelector("#sp-pos").value = 0;
}


function setPos( pos )
{
  song.currentTime = pos;
}


function mute()
{
  if( muted )
  {
    song.volume = volume;
    muted = false;
    document.getElementById("mute").innerHTML = "<i class='fa fa-volume-up'></i>";
  }
  else
  {
    song.volume = 0;
    muted = true;
    document.getElementById("mute").innerHTML = "<i class='fa fa-volume-off'></i>";
  }
}


function setVolume( vol )
{
  song.volume = vol;
  volume = vol;
}


song.addEventListener( 'timeupdate', () => {
	curtime = parseInt( song.currentTime, 10 );
	document.getElementById( 'sp-pos' ).max = song.duration;
	document.getElementById( 'sp-pos' ).value = curtime;
})