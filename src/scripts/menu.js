const toggleButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');

const setMenuState = (isOpen) => {
  toggleButton?.setAttribute('aria-expanded', String(isOpen));
  toggleButton?.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Toggle navigation');

  menu?.classList.toggle('hidden', !isOpen);
  menu?.classList.toggle('flex', isOpen);
};

toggleButton?.addEventListener('click', () => {
  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  setMenuState(!isExpanded);
});

document.querySelectorAll('[data-menu] a').forEach((link) => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 640) {
      setMenuState(false);
    }
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 640) {
    setMenuState(true);
  } else {
    setMenuState(false);
  }
});

setMenuState(window.innerWidth >= 640);
