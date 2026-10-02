/*
 * Light / dark theme.
 * Starts from the device setting. Once the visitor picks a theme with the
 * header toggle, that choice is stored and becomes their default.
 * Loaded as a blocking script in <head> so the right theme paints first.
 */
(function () {
  var KEY = 'kitovo-theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) {
      return null;
    }
  }

  function system() {
    return media && media.matches ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0c14' : '#d3daeb');
  }

  function label(button) {
    var dark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('title', dark ? 'Light mode' : 'Dark mode');
  }

  apply(stored() || system());

  if (media && media.addEventListener) {
    media.addEventListener('change', function () {
      if (!stored()) apply(system());
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      var b = buttons[i];
      b.hidden = false;
      label(b);
      b.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(KEY, next);
        } catch (e) {}
        apply(next);
        for (var j = 0; j < buttons.length; j++) label(buttons[j]);
      });
    }
  });
})();
