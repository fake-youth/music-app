const music = new Audio();
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('music-title');
const artist = document.getElementById('music-artist');
const image = document.getElementById('cover');
const background = document.getElementById('bg-img');
const progress = document.getElementById('progress');
const playerProgress = document.getElementById('player-progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');
const playlistContainer = document.getElementById('playlist');
const repeatBtn = document.getElementById('repeat');
const shuffleBtn = document.getElementById('shuffle');
const themeToggle = document.getElementById('theme-toggle');

const songs = [
  {
    path: 'assets/0.mp3',
    displayName: '33x',
    artist: 'Perunggu',
    cover: 'assets/0.jpg'
  },
  {
    path: 'assets/1.mp3',
    displayName: 'Pastikan Riuh Akhiri Malamu',
    artist: 'Perunggu',
    cover: 'assets/0.jpg'
  },
  {
    path: 'assets/2.mp3',
    displayName: 'Konsekuens',
    artist: '.Feast',
    cover: 'assets/2.jpg'
  },
  {
    path: 'assets/3.m4a',
    displayName: "O'Tuan",
    artist: '.Feast',
    cover: 'assets/3jpg'
  },
  {
    path: 'assets/4.mp3',
    displayName: "Kelelawar",
    artist: '.Feast',
    cover: 'assets/4.jpg'
  }
];

let musicIndex = 0;
let isPlaying = false;
let isRepeat = false;
let isShuffle = false;
let lastVolume = 1;

function loadMusic(song) {
  music.src = song.path;
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  image.src = song.cover;
  background.src = song.cover;
  renderPlaylist();
}

function togglePlay() {
  isPlaying ? pauseMusic() : playMusic();
}

function playMusic() {
  isPlaying = true;
  playBtn.classList.replace('fa-play', 'fa-pause');
  music.play();
}

function pauseMusic() {
  isPlaying = false;
  playBtn.classList.replace('fa-pause', 'fa-play');
  music.pause();
}

function changeMusic(direction) {
  if (isShuffle) {
    musicIndex = Math.floor(Math.random() * songs.length);
  } else {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
  }
  loadMusic(songs[musicIndex]);
  playMusic();
}

function updateProgressBar() {
  const { duration, currentTime } = music;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  const formatTime = (t) =>
    String(Math.floor(t / 60)).padStart(2, '0') + ':' +
    String(Math.floor(t % 60)).padStart(2, '0');

  durationEl.textContent = formatTime(duration);
  currentTimeEl.textContent = formatTime(currentTime);
}

function setProgressBar(e) {
  const width = playerProgress.clientWidth;
  const clickX = e.offsetX;
  music.currentTime = (clickX / width) * music.duration;
}

function updateVolumeIcon(vol) {
  if (vol == 0) {
    volumeIcon.className = 'fa-solid fa-volume-xmark';
  } else if (vol < 0.5) {
    volumeIcon.className = 'fa-solid fa-volume-low';
  } else {
    volumeIcon.className = 'fa-solid fa-volume-high';
  }
}

function renderPlaylist() {
  playlistContainer.innerHTML = '';
  songs.forEach((song, index) => {
    const div = document.createElement('div');
    div.classList.add('playlist-item');
    if (index === musicIndex) div.classList.add('active');
    div.textContent = `${song.displayName} - ${song.artist}`;
    div.onclick = () => {
      musicIndex = index;
      loadMusic(song);
      playMusic();
    };
    playlistContainer.appendChild(div);
  });
}

playBtn.onclick = togglePlay;
prevBtn.onclick = () => changeMusic(-1);
nextBtn.onclick = () => changeMusic(1);
repeatBtn.onclick = () => isRepeat = !isRepeat;
shuffleBtn.onclick = () => isShuffle = !isShuffle;

music.addEventListener('ended', () => {
  isRepeat ? music.play() : changeMusic(1);
});
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

volumeSlider.addEventListener('input', () => {
  music.volume = volumeSlider.value;
  lastVolume = music.volume;
  updateVolumeIcon(music.volume);
});

volumeIcon.addEventListener('click', () => {
  if (music.volume > 0) {
    lastVolume = music.volume;
    music.volume = 0;
    volumeSlider.value = 0;
  } else {
    music.volume = lastVolume || 1;
    volumeSlider.value = music.volume;
  }
  updateVolumeIcon(music.volume);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  loadMusic(songs[musicIndex]);
});
