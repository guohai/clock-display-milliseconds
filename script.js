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
  { bg: '#212020', color: '#ffffff', borderColor: '#ca1e1e' }, // Black + White
  { bg: '#cc0000', color: '#a2c4f5', borderColor: '#212020' }, // Red + Gray
  { bg: '#00cc00', color: '#000000', borderColor: '#ffffff' }, // Green + Black
  { bg: '#0033cc', color: '#ffffff', borderColor: '#ff00ff' }, // Blue + White
];

let currentBgIndex = 0;

function requestFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn(`Failed to switch to Fullscreen: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

function changeBackground() {
  currentBgIndex = (currentBgIndex + 1) % bgConfigs.length;
  const config = bgConfigs[currentBgIndex];
  document.body.style.backgroundColor = config.bg;
  const panel = document.getElementById('time_panel');
  panel.style.color = config.color;
  panel.style.borderBottomColor = config.borderColor;
  panel.style.borderLeftColor = config.borderColor;
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
      dy,
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
