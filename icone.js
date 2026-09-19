const burger = document.querySelector('.burger-menu');
const menu = document.querySelector('.menu');
const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  const savedTheme = localStorage.getItem('ostrich-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('theme-light');
    document.body.dataset.theme = 'light';
  }

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('theme-light');
    document.body.dataset.theme = isLight ? 'light' : 'dark';
    localStorage.setItem('ostrich-theme', isLight ? 'light' : 'dark');
    themeToggle.setAttribute('aria-checked', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  });

  const isLight = document.body.classList.contains('theme-light');
  themeToggle.setAttribute('aria-checked', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}

if (burger && menu) {
  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}
(function () {
  /* 1. Впишите сюда реальные ссылки на установщики.
        '#' = заглушка: клик только показывает уведомление. */
  var FILES = {
    'win-x64':        { name: 'Windows x64',        url: '#' },
    'win-arm64':      { name: 'Windows ARM64',      url: '#' },
    'mac-arm64':      { name: 'Mac Apple Silicon',  url: '#' },
    'mac-x64':        { name: 'Mac Intel',          url: '#' },
    'linux-deb':      { name: 'Debian / Ubuntu',    url: '#' },
    'linux-rpm':      { name: 'Red Hat / Fedora',   url: '#' },
    'linux-appimage': { name: 'AppImage',           url: '#' }
  };

  var root = document.getElementById('downloads');
  if (!root) return;

  /* 2. Определяем ОС и подсвечиваем нужную карточку */
  var ua = navigator.userAgent;
  var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  var touch = navigator.maxTouchPoints > 1;

  var os = null;
  if (/Android|iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && touch)) os = 'mobile';
  else if (/Win/i.test(platform) || /Windows/i.test(ua)) os = 'windows';
  else if (/Mac/i.test(platform) || /Mac OS X/i.test(ua)) os = 'mac';
  else if (/Linux|X11|CrOS/i.test(platform + ua)) os = 'linux';

  function setPrimary(card, key) {
    var btn = card.querySelector('.main-download');
    btn.dataset.file = key;
    btn.querySelector('.label').textContent = FILES[key].name;
  }

  if (os === 'mobile') {
    document.getElementById('mobile-note').classList.add('visible');
  } else if (os) {
    var card = root.querySelector('.download-card[data-os="' + os + '"]');
    card.classList.add('current-os');
    var main = card.querySelector('.main-download');
    if (main) main.classList.add('primary');

    // Уточняем архитектуру, если браузер её отдаёт (Chromium)
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues && main) {
      navigator.userAgentData.getHighEntropyValues(['architecture']).then(function (v) {
        var arm = v.architecture === 'arm';
        if (os === 'windows') setPrimary(card, arm ? 'win-arm64' : 'win-x64');
        if (os === 'mac')     setPrimary(card, arm ? 'mac-arm64' : 'mac-x64');
      }).catch(function () {});
    }
  }

  /* 3. Запуск загрузки: кнопки и выпадающие списки */
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }

  function startDownload(key) {
    var file = FILES[key];
    if (!file) return;
    showToast('Downloading Ostrich for ' + file.name + '…');
    if (file.url && file.url !== '#') window.location.href = file.url;
  }

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-file]');
    if (!el) return;
    e.preventDefault();
    startDownload(el.dataset.file);
  });

  root.querySelectorAll('.other select').forEach(function (select) {
    select.addEventListener('change', function () {
      if (select.value) startDownload(select.value);
      select.selectedIndex = 0;
    });
  });
})();