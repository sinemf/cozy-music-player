let audio = document.getElementById('audio-player');
let title = document.getElementById('song-title');
let progress = document.getElementById('progress');
let albumArt = document.querySelector('.album-art');
let trackInfo = document.getElementById('track-info');
let playIcon = document.getElementById('play-icon');
let shuffle = false;
let repeatOne = false;
let repeatAll = false;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let songs = [
 {
    title: "Dreamy Vibes",
    name: "Dreamy Vibes",
    file: "music/song1.mp3",
    cover: "cover1.jpg"
 },
 {
    title: "Lo-fi Chill Mix",
    name: "Lo-fi Chill",
    file: "music/song2.mp3",
    cover: "cover2.jpg"
 },
 {
    title: "Soft Beats - Mellow",
    name: "Soft Beats",
    file: "music/song3.mp3",
    cover: "cover3.jpg"
 }
];
let currentIndex = 0;
function loadSong(index) {
  audio.src = songs[index].file;
  albumArt.src = songs[index].cover;
  trackInfo.textContent = songs[index].title;
  audio.play();
  updatePlayIcon(true);
}
function playPause() {
  if (audio.paused) {
    audio.play();
    updatePlayIcon(true);
  } else {
    audio.pause();
    updatePlayIcon(false);
  }
}
function updatePlayIcon(isPlaying) {
  playIcon.innerHTML = isPlaying
    ? '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>'
    : '<path d="M8 5v14l11-7z"/>';
}
function nextSong() {
  if (shuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (songs.length > 1 && newIndex === currentIndex);
    currentIndex = newIndex;
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(currentIndex);
}
function prevSong() {
  if (shuffle) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (songs.length > 1 && newIndex === currentIndex);
    currentIndex = newIndex;
  } else {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  }
  loadSong(currentIndex);
}
audio.ontimeupdate = () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
};
audio.onended = () => {
  if (repeatOne) {
    audio.currentTime = 0;
    audio.play();
  } else if (repeatAll || currentIndex < songs.length - 1) {
    nextSong();
  } else {
    updatePlayIcon(false);
  }
};
function toggleShuffle() {
  shuffle = !shuffle;
  document.getElementById('shuffle-btn').classList.toggle('active', shuffle);
}
function toggleRepeatOne() {
  repeatOne = !repeatOne;
  repeatAll = false;
  document.getElementById('repeat-one-btn').classList.toggle('active', repeatOne);
  document.getElementById('repeat-all-btn').classList.remove('active');
}
function toggleRepeatAll() {
  repeatAll = !repeatAll;
  repeatOne = false;
  document.getElementById('repeat-all-btn').classList.toggle('active', repeatAll);
  document.getElementById('repeat-one-btn').classList.remove('active');
}
progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

let menuBtn = document.querySelector('.menu-btn');
let songListMenu = null;

function toggleSongMenu() {
  if (songListMenu) {
    songListMenu.remove();
    songListMenu = null;
  } else {
    songListMenu = document.createElement('div');
    songListMenu.className = 'song-list-menu';
    
    const songList = document.createElement('ul');
    songList.className = 'song-list';
    
    songs.forEach((song, index) => {
      const songItem = document.createElement('li');
      songItem.className = 'song-item';
      if (index === currentIndex) {
        songItem.classList.add('active');
      }
      
      songItem.textContent = song.name;
      songItem.onclick = () => {
        currentIndex = index;
        loadSong(index);
        toggleSongMenu(); 
      };
      
      songList.appendChild(songItem);
    });
    
    songListMenu.appendChild(songList);
    
    const player = document.querySelector('.player');
    player.appendChild(songListMenu);
  }
}

menuBtn.addEventListener('click', toggleSongMenu);

document.addEventListener('click', (event) => {
  if (songListMenu && !songListMenu.contains(event.target) && event.target !== menuBtn) {
    songListMenu.remove();
    songListMenu = null;
  }
});

let isMinimized = false;
let miniButton = document.createElement('button');
let player = document.querySelector('.player');
let originalHeight, originalWidth, originalPosition, originalTop, originalLeft, originalMargin;
let originalDisplay = {};

function captureOriginalState() {
  originalHeight = player.style.height || getComputedStyle(player).height;
  originalWidth = player.style.width || getComputedStyle(player).width;
  originalPosition = player.style.position || getComputedStyle(player).position;
  originalTop = player.style.top || getComputedStyle(player).top;
  originalLeft = player.style.left || getComputedStyle(player).left;
  originalMargin = player.style.margin || getComputedStyle(player).margin;

  const elementsToTrack = [
    '.album-container',
    '#progress',
    '.footer-control-panel'
  ];
  
  elementsToTrack.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, i) => {
      const key = `${selector}_${i}`;
      originalDisplay[key] = el.style.display || getComputedStyle(el).display;
    });
  });
}

function makeDraggable() {
  const header = document.querySelector('.header');
  
  header.style.cursor = 'grab';
  
  header.addEventListener('mousedown', function(e) {
    if (e.target === miniButton || e.target === menuBtn || 
        e.target.closest('button') === miniButton || e.target.closest('button') === menuBtn) {
      return;
    }
    
    isDragging = true;
   
    const playerRect = player.getBoundingClientRect();
    dragOffsetX = e.clientX - playerRect.left;
    dragOffsetY = e.clientY - playerRect.top;
    
    header.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffsetX;
    const newY = e.clientY - dragOffsetY;
   
    const maxX = window.innerWidth - player.offsetWidth;
    const maxY = window.innerHeight - player.offsetHeight;
    
    player.style.position = 'fixed';
    player.style.left = Math.max(0, Math.min(maxX, newX)) + 'px';
    player.style.top = Math.max(0, Math.min(maxY, newY)) + 'px';
    player.style.margin = '0';
  });
  
  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = 'grab';
    }
  });
}

function createMiniButton() {
  miniButton.className = 'mini-button';
  miniButton.setAttribute('aria-label', 'Toggle mini mode');
  miniButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path d="M14 8.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0 0 1h13a.5.5 0 0 0 .5-.5Z"/>
    </svg>
  `;
  miniButton.onclick = toggleMiniMode;
  
  const header = document.querySelector('.header');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.appendChild(miniButton);
  
  captureOriginalState();

  makeDraggable();
}

function toggleMiniMode() {
  if (!isMinimized) {
    captureOriginalState();

    const elementsToHide = [
      '.album-container',
      '#progress',
      '.footer-control-panel'
    ];
    
    elementsToHide.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = 'none';
      });
    });

    player.style.height = 'auto';
    player.style.width = '280px';
    player.style.padding = '0.3rem';
    
    if (player.style.position !== 'fixed') {
      player.style.position = 'fixed';
      player.style.top = '0px';
      player.style.right = '20px';
      player.style.margin = '0';
    }

    miniButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M.172 15.828a.5.5 0 0 0 .707 0l4.096-4.096V14.5a.5.5 0 1 0 1 0v-3.975a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1h2.768L.172 15.121a.5.5 0 0 0 0 .707zM15.828.172a.5.5 0 0 0-.707 0l-4.096 4.096V1.5a.5.5 0 1 0-1 0v3.975a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 0-1h-2.768L15.828.879a.5.5 0 0 0 0-.707z"/>
      </svg>
    `;
    
    isMinimized = true;
  } else {
    player.style.width = originalWidth;
    player.style.height = originalHeight;
    player.style.padding = '0.6rem';
    
    if (originalPosition && originalPosition !== 'fixed') {
      player.style.position = originalPosition;
      player.style.top = originalTop;
      player.style.left = originalLeft;
      player.style.margin = originalMargin;
    }

    const elementsToShow = [
      '.album-container',
      '#progress',
      '.footer-control-panel'
    ];
    
    elementsToShow.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el, i) => {
        const key = `${selector}_${i}`;
        if (originalDisplay[key] && originalDisplay[key] !== 'none') {
          el.style.display = originalDisplay[key];
        } else {
          el.style.display = '';
        }
      });
    });

    miniButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M14 8.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0 0 1h13a.5.5 0 0 0 .5-.5Z"/>
      </svg>
    `;
    
    isMinimized = false;
    
    void player.offsetWidth;
  }
}

function addTransitionStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .player {
      transition: width 0.5s, height 0.5s, padding 0.5s;
    }
  `;
  document.head.appendChild(style);
}

loadSong(currentIndex);
addTransitionStyles();
createMiniButton();