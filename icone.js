const burger = document.querySelector('.burger-menu');
const menu = document.querySelector('.menu');
const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  const savedTheme = localStorage.getItem('ostrich-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('theme-light');
  }

  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('theme-light');
    localStorage.setItem('ostrich-theme', isLight ? 'light' : 'dark');
  });
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