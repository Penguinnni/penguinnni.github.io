let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let playlist_img = document.querySelector(".playlist-img");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let tracklist_right = document.querySelector(".right");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
let external_btn = document.querySelector(".external-link");
let random_btn = document.querySelector(".random-play");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let loadTrackk = JSON.parse(localStorage.getItem("loadTrackk"));

let track_index = 0;
let isPlaying = false;
let updateTimer;
let first = false;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played
let track_list = [];

let statusD = "disabled";
let statusL = "disabled";
var bar = "active";

window.addEventListener('load', (event) => {
  statusD = localStorage.getItem("RandomButtonStatus");
  statusL = localStorage.getItem("LoopButtonStatus");
  ChangeRandomButtonColor();
  ChangeLoopButtonColor();
  let v = localStorage.getItem("volume");
  if (v != undefined) {
    volume_slider.value = v * 500;
    curr_track.volume = v;
  }
  else {
    volume_slider.value = 0.25 * 500;
    curr_track.volume = 0.25;
  }
});
let lastPlaylist = JSON.parse(localStorage.getItem("lastPlaylist"));
if (lastPlaylist != undefined) {

  switch (lastPlaylist.playlistId) {
    case "slow": {
      getTracks2();
      break;
    }
    case "aot": {
      getTracks3();
      break;
    }
    default: {
      getTracksByPlaylistId(lastPlaylist.playlistId, lastPlaylist.playlistName);
    }
  }
}
else{
  getTracks2();
}

console.log(lastPlaylist);


function FillRandomTrackList(trackl) {
  var x = []
  for (let i = 0; i < trackl.length; i++) {
    x.push(i);
  }
  random_TrackList = x;
}

function fillTheMusicList(trackL, playlistName) {
  var str = "<div class=\"playlist\"><b class='marquee'><marquee>" + playlistName + "</marquee></b></div>";

  trackL.map((item, index) => {
    str = str + "<div><div id=" + index + " class=\"listelerR\" onclick=\"playMusic(" + index + ")\" >" + item.name + "</div><br><hr><br></div>";

  })

  tracklist_right.innerHTML = str;
}
function renk() {
  document.querySelectorAll(".listelerR").forEach(p => {
    p.style.color = "rgba(255, 255, 255, 0.63)";
  })
  document.getElementById(track_index).style = "color:red;"
}
function playMusic(track_indexx) {
  track_index = track_indexx;
  loadTrack(track_index)
  playTrack();
  renk();
}

function barClick(){
  if(bar=="active"){
    bar="disabled";

      $(".uc").css("display", "flex");
      $(".uc").css("flex-direction", "column-reverse;");
      $(".leftAna").css("display", "none");
      $(".right").css("display", "block");
  }
  else if(bar != "active"){
    bar="active";

      $(".uc").css("flex-direction", "column-reverse;");
      $(".uc").css("display", "inline");
      $(".right").css("display", "none");
      $(".leftAna").css("display", "block");
  }
}

function tikla(x) {
  if(screen.width > 768){
    if (track_index < 7) {
      x = 0;
      var konum = document.getElementById(x).getBoundingClientRect();
      tracklist_right.scrollBy(konum);
      tracklist_right.scrollBy(0, -1000);
    }
    else {
      x = track_index - 7;
      var konum = document.getElementById(x).getBoundingClientRect();
      tracklist_right.scrollBy(konum);
    }
  }
  else{
    if (track_index < 4) {
      x = 0;
      var konum = document.getElementById(x).getBoundingClientRect();
      tracklist_right.scrollBy(konum);
      tracklist_right.scrollBy(0, -1000);
    }
    else {
      x = track_index - 4;
      var konum = document.getElementById(x).getBoundingClientRect();
      tracklist_right.scrollBy(konum);
    }
  }

}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;


  if (track_list[track_index].name.length > 43) {
    track_name.style = " text-align:center; white-space: nowrap; width: 30vw; overflow: hidden; text-overflow: ellipsis; height: 2.5vw; padding-left: 5%; "
  }
  else {
    track_name.style = " "
    track_name.textContent = track_list[track_index].name;
  }
  if (track_list[track_index].artist.length > 100) {
    track_artist.style = " text-align:center; white-space: nowrap; width: 30vw; overflow: hidden; height: 1.6vw; text-overflow: clip;"
    var tA = "<marquee>" + track_list[track_index].artist + "</marquee>";
    track_artist.innerHTML = tA;
  }
  else {
    track_artist.style = " "
    track_artist.textContent = track_list[track_index].artist;
  }

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  localStorage.setItem("loadTrackk", JSON.stringify({ ix: track_index }));
}

var random_TrackList = []

function GetRandomMusic() {
  let randomTrack = Math.floor(Math.random() * random_TrackList.length);
  let randomTrackindex = random_TrackList[randomTrack];
  random_TrackList = arrayRemoveItemByValue(random_TrackList, randomTrackindex);

  return randomTrackindex;
}

function randomAktif() {
  if (statusD != "active") {
    localStorage.setItem("RandomButtonStatus", "active");
    statusD = "active";
    FillRandomTrackList(track_list);
    ChangeRandomButtonColor();
    if (statusL == "active") {
      loopAktif();
    }
  }
  else if (statusD == "active") {
    localStorage.setItem("RandomButtonStatus", "disabled");
    random_TrackList = [];
    statusD = "disabled";
    ChangeRandomButtonColor();
  }
}
function ChangeRandomButtonColor() {
  if (statusD != "active") {
    $(".random-play").css("color", "white");
  }
  else if (statusD == "active") {
    $(".random-play").css("color", "red");
  }
}

function loopAktif() {
  if (statusL != "active") {
    localStorage.setItem("LoopButtonStatus", "active");
    statusL = "active";
    ChangeLoopButtonColor();
    if (statusD == "active") {
      randomAktif();
    }
    localStorage.setItem("RandomButtonStatus", "disabled");
  }
  else if (statusL == "active") {
    localStorage.setItem("LoopButtonStatus", "disabled");
    statusL = "disabled";
    ChangeLoopButtonColor();
  }
}
function ChangeLoopButtonColor() {
  if (statusL != "active") {
    $(".loop-play").css("color", "white");
  }
  else if (statusL == "active") {
    $(".loop-play").css("color", "red");
  }
}

function openLink() {
  let url = track_list[track_index].spotify_url;
  window.open(url, '_blank');
}
function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) playTrack()
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fi fi-rr-pause icon-buyuk"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fi fi-rr-play icon-buyuk"></i>';;
}

function nextTrack() {
  if (statusD == "active") {
    let i = GetRandomMusic();
    if (i != undefined)
      console.log("index", i);
    else {
      FillRandomTrackList(track_list);
      i = GetRandomMusic();
    }
    track_index = i;
    loadTrack(i);
    renk();
  }

  else if (statusL == "active") {
    document.querySelector(".next-track").addEventListener("click", () => {
      statusL = "disable";
      ChangeLoopButtonColor();
      localStorage.setItem("LoopButtonStatus", "disable");
      nextTrack();
    },
    { once: true });
    let i = track_index;
    console.log("index", i);
    track_index = i;
    loadTrack(i);
    renk();
  }
  else {
    if (track_index < track_list.length - 1) {
      track_index += 1;
    }
    else track_index = 0; {
      loadTrack(track_index);
    }
    renk();
  }

  playTrack();
}

function prevTrack() {
  if (curr_track.currentTime > 5) {
    seek_slider.value = 0;
  }
  else if (statusL == "active") {
    let i = track_index;
    console.log("index", i);
    track_index = i;
    loadTrack(i);
    renk();
  }
  else if (track_index > 0) {
    track_index -= 1;
    renk();
  }
  else if (statusL == "active") {
    let i = track_index;
    console.log("index", i);
    track_index = i;
    loadTrack(i);
    renk();
  }
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();

}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 5000);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 500;
}
function setVolume2() {
  curr_track.volume = volume_slider.value / 500;
  localStorage.setItem("volume", curr_track.volume);
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration) && (isPlaying)) {
    seekPosition = curr_track.currentTime * (5000 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

async function GetBearerToken() {
  var ls_access_token = localStorage.getItem("access_token");
  var ls_token_expires_in = localStorage.getItem("token_expires_in");

  if (ls_access_token == null || ls_token_expires_in == null || new Date() > new Date(ls_token_expires_in)) {
    var TOKENURL = 'https://accounts.spotify.com/api/token';
    var options = {
      method: 'POST',
      headers: {
        Authorization: 'Basic NTU0YjEzNWU0MzFmNDQyZmFlOTc2ZmFjZDRlMjFkYmI6ZWQ2NjdmMDVmMzE4NDJmYjkyNGM0OWVkMzdmMWRlMGE=',
        host: 'accounts.spotify.com',
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json'
      },
      body: 'grant_type=client_credentials',
      host: 'accounts.spotify.com'
    }

    var t = await fetch(TOKENURL, options);
    var j = await t.json();
    console.log("Yeni Token Alındı", j);
    var expires_time = new Date();
    expires_time.setSeconds(expires_time.getSeconds() + j.expires_in);

    localStorage.setItem("token_expires_in", expires_time)
    localStorage.setItem("access_token", j.access_token)
    return j.access_token;
  }
  else {
    return ls_access_token;
  }
}
function getTracksByPlaylistId(id, playlistName) {

  getTracks(id).then(value => {
    track_list = value;
    FillRandomTrackList(value);
    curr_track.volume = volume_slider.value / 500;
    if (typeof loadTrackk === 'object' && first == false) {
      track_index = (loadTrackk?.ix);
      first = true;
    }
    else {
      track_index = 0;
    }
    loadTrack(track_index);
    fillTheMusicList(value, playlistName)
    renk();
    localStorage.setItem("lastPlaylist", JSON.stringify({ playlistName: playlistName, playlistId: id, PlaylistValue: track_index }));
  });
  pauseTrack();
  if(screen.width <= 768){
    barClick();
  }
}
function getTracks2() {
  playlist_img.style.backgroundImage = "url('resimler/nightCity.jpg')";
  var value = [{
    name: "Miss You",
    artist: "Oliver Tree, Robin Schulz",
    path: "music/slow/southstar-miss-you.m4a",
    image: "resimler/southstar-miss-you.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  },{
    name: "Daddy Issues",                // Müzik ismi
    artist: "The Neighbourhood",              // Sanatçı ismi
    path: "music/slow/DaddyIssues.mp3",                // Müziğin Konumu
    image: "resimler/sun.webp",               // Müziğin resmi
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",         // Müziğin url'i
  }, {
    name: "Heat Waves",
    artist: "Glass Animals",
    path: "music/slow/HeatWaves.mp3",
    image: "resimler/car.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Everything i wanted",
    artist: "Billie Eilish",
    path: "music/slow/EverythingIWanted.mp3",
    image: "resimler/light.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Just the Two of Us",
    artist: "Grover Washington, Jr.",
    path: "music/slow/JustTheTwoOfUs.mp3",
    image: "resimler/jr.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Another love",
    artist: "Tom Odell",
    path: "music/slow/AnotherLove.mp3",
    image: "resimler/wave.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Sweater Weather",
    artist: "The Neighbourhood",
    path: "music/slow/SweaterWeather.mp3",
    image: "resimler/bahce.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "J U D A S",
    artist: "Lady Gaga",
    path: "music/slow/judas.mp3",
    image: "resimler/devil.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Lost On You",
    artist: "LP",
    path: "music/slow/LostOnYou.mp3",
    image: "resimler/car2.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Where's My Love",
    artist: "SYML",
    path: "music/slow/WheresMyLove.mp3",
    image: "resimler/gul.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Habits Stay High",
    artist: "Tove Lo",
    path: "music/slow/HabitsStayHigh.mp3",
    image: "resimler/car3.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "No Lie",
    artist: "Sean Paul, Dua Lipa",
    path: "music/slow/NoLie.mp3",
    image: "resimler/sun2.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Love nwantiti",
    artist: "CKay, Dj Yo!, AX'EL",
    path: "music/slow/LoveNwantiti.mp3",
    image: "resimler/tren.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "S K Y F A L L",
    artist: "Adale",
    path: "music/slow/skyfall.mp3",
    image: "resimler/gun.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Streets",
    artist: "Doja Cat",
    path: "music/slow/streets.mp3",
    image: "resimler/hand.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Here Lucian Remix",
    artist: "Alessia Cara",
    path: "music/slow/HereLucianRemix.mp3",
    image: "resimler/slowed.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Space Song",
    artist: "Beach House",
    path: "music/slow/BeachHouse.mp3",
    image: "resimler/hand.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "i love you",
    artist: "Billie Eilish",
    path: "music/slow/iLoveYou.mp3",
    image: "resimler/grl.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Softcore",
    artist: "The Neighbourhood",
    path: "music/slow/Softcore.mp3",
    image: "resimler/Softcore.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Infinity",
    artist: "Jaymes Young",
    path: "music/slow/infinity.mp3",
    image: "resimler/bridge.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Y O U N G",
    artist: "VACATIONS",
    path: "music/slow/Young.mp3",
    image: "resimler/vase.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "In This Shirt",
    artist: "The Irrepressibles",
    path: "music/slow/InThisShirt.mp3",
    image: "resimler/handf.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Pop Style",
    artist: "Drake",
    path: "music/slow/pop-style.mp3",
    image: "resimler/car5.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Fantasy",
    artist: "Bazzi",
    path: "music/slow/fantasy.mp3",
    image: "resimler/black.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "Guilty Hero Slowed",
    artist: "Kohta Yamamoto",
    path: "music/slow/GuiltyHeroSlowed.m4a",
    image: "resimler/yelena.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "The Perfect Girl",
    artist: "Mareux",
    path: "music/slow/ThePerfectGirl.m4a",
    image: "resimler/ThePerfectGirl.webp",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  }, {
    name: "As The World Caves In",
    artist: "Matt Maltese",
    path: "music/slow/AsTheWorldCavesIn.opus",
    image: "resimler/rain.gif",
    spotify_url: "https://www.youtube.com/playlist?list=PLL_v5eo2j3xZfGvyfxSdetCnMWduY7i61",
  },]
  track_list = value;
  FillRandomTrackList(value);
  document.querySelectorAll(".listeler").forEach(p => {
    p.style.color = "rgba(255, 255, 255, 0.63)";
  })
  document.getElementById("slow").style = "color:red;"
  curr_track.volume = volume_slider.value / 500;
  if (typeof loadTrackk === 'object' && first == false) {
    track_index = (loadTrackk?.ix);
    first = true;
    console.log(track_index);
  }
  else {
    track_index = 0;
  }
  fillTheMusicList(value, "S L O W E D + R E V E R B")
  loadTrack(track_index);
  localStorage.setItem("lastPlaylist", JSON.stringify({ playlistName: "S L O W E D + R E V E R B", playlistId: "slow" }));
  pauseTrack();
  tracklist_right.scrollBy(0, -900000);
  renk();
  if(screen.width <= 768){
    barClick();
  }
}
function getTracks3() {
  playlist_img.style.backgroundImage = "url('resimler/aot.jpg')";
  var value = [{
    name: "Guren No Yumiya",
    artist: "Linked Horizon",
    path: "music/aot/GurenNoYumiy.opus",
    image: "resimler/aot-op1.webp",
    spotify_url: "https://youtu.be/8OkpRK2_gVs",
  }, {
    name: "The Rumbling",
    artist: "S I M",
    path: "music/aot/Rumbling.mp3",
    image: "resimler/aot2.webp",
    spotify_url: "https://youtu.be/KHCIO7a3jSI",
  }, {
    name: "Boku no Sensou",
    artist: "Shinsei Kamattechan",
    path: "music/aot/BokuNoSensou.mp3",
    image: "resimler/aot3.webp",
    spotify_url: "https://youtu.be/6TolbTZXDjI",
  },{
    name: "Marley",
    artist: "Hiroyuki Sawano",
    path: "music/aot/Marley.opus",
    image: "resimler/black.gif",
    spotify_url: "https://youtu.be/_nm_T0qjwjc",
  }, {
    name: "Shingeki no Kyojin Violin",
    artist: "Hiroyuki Sawano",
    path: "music/aot/ShingekiNoKyojinViolin.opus",
    image: "resimler/petra.webp",
    spotify_url: "https://youtu.be/nAV_zyhC4EE",
  }, {
    name: "Shingeki no Kyojin Piano",
    artist: "Hiroyuki Sawano",
    path: "music/aot/ShingekiNoKyojinPiano-part1.opus",
    image: "resimler/aot-eren2.webp",
    spotify_url: "https://youtu.be/nAV_zyhC4EE",
  }, {
    name: "Shingeki no Kyojin Piano 2",
    artist: "Hiroyuki Sawano",
    path: "music/aot/ShingekiNoKyojinPiano-part2.mp3",
    image: "resimler/aotK.webp",
    spotify_url: "https://youtu.be/IPWiiR5MVv4",
  }, {
    name: "Shingeki no Kyojin Major",
    artist: "Hiroyuki Sawano",
    path: "music/aot/ShingekiNoKyojinMajor.mp3",
    image: "resimler/at.gif",
    spotify_url: "https://youtu.be/0gf3o3bhbCE",
  }, {
    name: "Impact",
    artist: "Yuko Ando",
    path: "music/aot/Impact.mp3",
    image: "resimler/aot.gif",
    spotify_url: "https://youtu.be/oyuoCB-wolk",
  }, {
    name: "Guilty Hero",
    artist: "Kohta Yamamoto",
    path: "music/aot/GuiltyHero.m4a",
    image: "resimler/yelena.webp",
    spotify_url: "https://youtu.be/-q41OJu9fXM",
  }, {
    name: "Eye Water",
    artist: "Hiroyuki Sawano",
    path: "music/aot/eye-water.opus",
    image: "resimler/eren-mikasa.jpg",
    spotify_url: "https://youtu.be/YbJpH9to-9Y",
  }, {
    name: "Sasha",
    artist: "Hiroyuki Sawano",
    path: "music/aot/Sasha.ogg",
    image: "resimler/sasha.jpg",
    spotify_url: "https://youtu.be/eLYVoUl6Z1Q",
  }, {
    name: "Mikasa",
    artist: "Hiroyuki Sawano",
    path: "music/aot/mikasa.opus",
    image: "resimler/mikasa.webp",
    spotify_url: "https://youtu.be/47RK0qI2DiI",
  }, {
    name: "Historia",
    artist: "Hiroyuki Sawano",
    path: "music/aot/historia.opus",
    image: "resimler/historia.gif",
    spotify_url: "https://youtu.be/vtHUnElgkD8",
  }, {
    name: "AttackD",
    artist: "Hiroyuki Sawano",
    path: "music/aot/attackd.opus",
    image: "resimler/aot-eren.gif",
    spotify_url: "https://youtu.be/c7NMfDeIMHs",
  }, {
    name: "ThanksAT",
    artist: "Samuel Kim",
    path: "music/aot/ThanksAT.opus",
    image: "resimler/eren.gif",
    spotify_url: "https://youtu.be/hoJ4qxcXz5w",
  },
  ]
  track_list = value;
  FillRandomTrackList(value);
  curr_track.volume = volume_slider.value / 500;
  document.querySelectorAll(".listeler").forEach(p => {
    p.style.color = "rgba(255, 255, 255, 0.63)";
  })
  document.getElementById("aot").style = "color:red;"
  if (typeof loadTrackk === 'object' && first == false) {
    track_index = (loadTrackk?.ix);
    first = true;
  }
  else {
    track_index = 0;
  }
  loadTrack(track_index);
  fillTheMusicList(value, "Attack On Titan")
  localStorage.setItem("lastPlaylist", JSON.stringify({ playlistName: "Attack On Titan", playlistId: "aot", PlaylistValue: track_index }));
  pauseTrack();
  tracklist_right.scrollBy(0, -900000);
  renk();
  if(screen.width <= 768){
    barClick();
  }
}
function getTracksI() {
  playlist_img.style.backgroundImage = "url('https://i.scdn.co/image/ab67706c0000bebb37df9968650657305b022117')";
  var value = [{
    name: "Siyah Gözlere",
    artist: "Seyyan Hanım",
    path: "music/siyah-gozlere.mp3",
    image: "resimler/plak.gif",
    spotify_url: "https://youtu.be/WYiqqqm62Y4",
  },
  ]
  track_list = value;
  FillRandomTrackList(value);
  curr_track.volume = volume_slider.value / 500;
  document.querySelectorAll(".listeler").forEach(p => {
    p.style.color = "rgba(255, 255, 255, 0.63)";
  })
  if (typeof loadTrackk === 'object' && first == false) {
    track_index = (loadTrackk?.ix);
    first = true;
  }
  else {
    track_index = 0;
  }
  loadTrack(track_index);
  fillTheMusicList(value, "İlayza <i style='color:red;' class='fa-solid fa-heart'></i> Eren")
  playTrack();
  tracklist_right.scrollBy(0, -900000);
  renk();
}
async function getTracks(playlist_id) {
  var spotifytracks = [];
  let apiurl = "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?market=TR&fields=items(track(album(images)%2Cartists(name)%2Cname%2Cexternal_urls(spotify)%2Cpreview_url%2Chref))%2Cnext"
  let playlistimage_apiurl = "https://api.spotify.com/v1/playlists/" + playlist_id + "?market=TR&fields=images"
  document.querySelectorAll(".listeler").forEach(p => {
    p.style.color = "rgba(255, 255, 255, 0.63)";
  })
  document.getElementById(playlist_id).style = "color:red;"
  tracklist_right.scrollBy(0, -900000);
  let options = {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + await GetBearerToken(),
      "Content-Type": "application/json"
    }
  }

  var n = await fetch(playlistimage_apiurl, options)
  var m = await n.json();

  var next = true;
  var nexturl = apiurl;
  while (next) {
    var x = await fetch(nexturl, options)
    var y = await x.json();
    console.log(y)
    await y.items.map(item => {
      if (item.track != null && item.track.preview_url != null) {
        var arts = "";
        item.track.artists.map(a => {
          if (arts === "") {
            arts += a.name
          }
          else {
            arts += ", " + a.name
          }
        })

        var track = {
          name: item.track.name,
          artist: arts,
          path: item.track.preview_url,
          image: item.track.album.images[0].url,
          spotify_url: item.track.external_urls.spotify,

        }
        spotifytracks.push(track)
      }
    })
    if (y.next !== null) {
      nexturl = y.next;
    }
    else {
      next = false;
    }
  }
  playlist_img.style.backgroundImage = "url(" + m.images[0].url + ")";

  return spotifytracks;

}
function arrayRemoveItemByValue(arr, value) {

  return arr.filter(function (ele) {
    return ele != value;
  });
}
