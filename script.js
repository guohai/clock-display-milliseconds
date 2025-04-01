Number.prototype.padding = function (n) {
  for (var r = this.toString(); r.length < n; r = 0 + r);
  return r;
};

let currentFontSize = 60;

function changeFontSize(delta) {
  currentFontSize += delta;
  if (currentFontSize < 30) currentFontSize = 30;
  document.getElementById('time_panel').style.fontSize = currentFontSize + 'px';
}

const bgConfigs = [
  { bg: '#212020', color: '#ffffff', borderColor: '#ca1e1e', video: null }, // Black + White
  { bg: '#cc0000', color: '#a2c4f5', borderColor: '#212020', video: null }, // Red + Gray
  { bg: '#00cc00', color: '#000000', borderColor: '#ffffff', video: null }, // Green + Black
  { bg: '#0033cc', color: '#ffffff', borderColor: '#ff00ff', video: null }, // Blue + White
  {
    bg: '#000000',
    color: '#ffffff',
    borderColor: '#ff9900',
    video:
      'https://repo.jellyfin.org/test-videos/HDR/HDR10/HEVC/Test%20Jellyfin%204K%20HEVC%20HDR10%2050M.mp4',
  }, // Dynamic Background
];

let currentBgIndex = 0;

async function enterFullscreenAndWakeLock() {
  const el = document.documentElement;
  const rfs =
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen;
  if (rfs) {
    try {
      await rfs.call(el);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        const silentVideo = document.getElementById('ios_awake_hack');
        await silentVideo.play();
      } else {
        await requestWakeLock();
      }
    } catch (err) {
      console.warn('Fullscreen/WakeLock error:', err);
    }
  }
}

async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        console.log('Wake Lock was released');
      });
    } else {
      console.warn('Wake Lock API not supported.');
    }
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
  const isFullscreen =
    document.fullscreenElement || document.webkitFullscreenElement;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (!isFullscreen) {
    if (!isIOS && wakeLock !== null) {
      wakeLock.release().then(() => {
        console.log('Wake Lock released after exiting fullscreen');
        wakeLock = null;
      });
    } else if (isIOS) {
      const silentVideo = document.getElementById('ios_awake_hack');
      silentVideo.pause();
      silentVideo.currentTime = 0;
    }
  }
}

function changeBackground() {
  currentBgIndex = (currentBgIndex + 1) % bgConfigs.length;
  const config = bgConfigs[currentBgIndex];
  const panel = document.getElementById('time_panel');
  const video = document.getElementById('dynamic_bg');

  // Apply colors
  document.body.style.backgroundColor = config.bg;
  panel.style.color = config.color;
  panel.style.borderBottomColor = config.borderColor;
  panel.style.borderLeftColor = config.borderColor;

  // Apply dynamic background when available
  if (config.video) {
    video.src = config.video;
    video.style.display = 'block';
  } else {
    video.style.display = 'none';
    video.src = ''; // Optional: stop video if not needed
  }
}

function updateClock() {
  var now = new Date();
  var milli = now.getMilliseconds(),
    sec = now.getSeconds(),
    min = now.getMinutes(),
    hou = now.getHours(),
    mo = now.getMonth(),
    dy = now.getDate(),
    yr = now.getFullYear();
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  var tags = ['mon', 'd', 'y', 'h', 'm', 's', 'mi'],
    corr = [
      (mo + 1).padding(2),
      dy.padding(2),
      yr,
      hou.padding(2),
      min.padding(2),
      sec.padding(2),
      milli.padding(3),
    ];
  for (var i = 0; i < tags.length; i++)
    document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
}

function initClock() {
  updateClock();
  window.setInterval('updateClock()', 1);
}
