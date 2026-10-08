const burger = document.querySelector('.burger-menu');
const menu = document.querySelector('.menu');
const themeBtn = document.querySelector('.theme-btn');

if (themeBtn) {
  const syncThemeBtn = () => {
    const isLight = document.body.classList.contains('theme-light');
    themeBtn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  };

  themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('theme-light');
    document.body.dataset.theme = isLight ? 'light' : 'dark';
    try {
      localStorage.setItem('ostrich-theme', isLight ? 'light' : 'dark');
    } catch (e) {}
    syncThemeBtn();
  });

  syncThemeBtn();
}

if (burger && menu) {
  const setMenu = (open) => {
    menu.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  burger.addEventListener('click', () => setMenu(!menu.classList.contains('menu-open')));

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Закрываем меню по тапу мимо него и по Esc
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('menu-open')) {
      setMenu(false);
      burger.focus();
    }
  });
}
(function () {
  var root = document.getElementById('downloads');
  if (!root) return;

  /* Подсвечиваем карточку текущей ОС */
  var ua = navigator.userAgent;
  var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  var touch = navigator.maxTouchPoints > 1;

  var os = null;
  if (/Android|iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && touch)) os = 'mobile';
  else if (/Win/i.test(platform) || /Windows/i.test(ua)) os = 'windows';
  else if (/Mac/i.test(platform) || /Mac OS X/i.test(ua)) os = 'mac';
  else if (/Linux|X11|CrOS/i.test(platform + ua)) os = 'linux';

  if (os && os !== 'mobile') {
    root.querySelector('.download-card[data-os="' + os + '"]').classList.add('current-os');
  }

  /* Приложения ещё в разработке: кнопка только показывает уведомление */
  var toast = document.getElementById('toast');
  var toastTimer;

  root.addEventListener('click', function (e) {
    var el = e.target.closest('[data-platform]');
    if (!el) return;
    toast.textContent = 'Ostrich for ' + el.dataset.platform + ' is still in development.';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 4000);
  });
})();

(function () {
  var form = document.getElementById('ideas-form');
  if (!form) return;

  var status = document.getElementById('ideas-status');
  var submit = form.querySelector('button[type="submit"]');
  var message = document.getElementById('idea-message');
  var counter = document.getElementById('idea-counter');
  var preview = document.getElementById('idea-preview');
  var done = document.getElementById('ideas-done');
  var again = document.getElementById('ideas-again');
  var max = Number(message.getAttribute('maxlength'));
  var emptyText = preview.textContent;

  function setStatus(text, type) {
    status.textContent = text;
    status.className = 'form-status ' + type;
  }

  // Счётчик символов и пузырь-превью в чате слева
  function updateMessage() {
    var text = message.value.trim();
    counter.textContent = message.value.length + ' / ' + max;
    counter.classList.toggle('is-near', message.value.length > max * 0.9);
    preview.classList.toggle('is-empty', !text);
    preview.textContent = text ? (text.length > 220 ? text.slice(0, 220) + '…' : text) : emptyText;
  }

  message.addEventListener('input', updateMessage);

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* Адрес формы задаётся в атрибуте action в ideas.html */
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      setStatus('The form is not connected yet. Please try again later.', 'error');
      return;
    }

    submit.disabled = true;
    setStatus('Sending…', '');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error();
      form.reset();
      updateMessage();
      setStatus('', '');
      form.hidden = true;
      done.hidden = false;
    }).catch(function () {
      setStatus('Something went wrong. Please try again.', 'error');
    }).then(function () {
      submit.disabled = false;
    });
  });

  again.addEventListener('click', function () {
    done.hidden = true;
    form.hidden = false;
    message.focus();
  });
})();
