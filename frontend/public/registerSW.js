// Uninstaller script for legacy Vite PWA
(function () {
  if (typeof window === 'undefined') return;

  var hadSwOrCache = false;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      if (registrations && registrations.length > 0) {
        hadSwOrCache = true;
        return Promise.all(
          registrations.map(function (reg) {
            return reg.unregister();
          })
        );
      }
    }).then(function () {
      if ('caches' in window) {
        return caches.keys().then(function (keys) {
          if (keys && keys.length > 0) {
            hadSwOrCache = true;
            return Promise.all(
              keys.map(function (key) {
                return caches.delete(key);
              })
            );
          }
        });
      }
    }).then(function () {
      // If legacy service worker or cache was actively present, reload once cleanly
      if (hadSwOrCache && !sessionStorage.getItem('__sw_purged__')) {
        sessionStorage.setItem('__sw_purged__', '1');
        window.location.reload();
      }
    }).catch(function (err) {
      console.warn('Failed unregistering service worker:', err);
    });
  } else if ('caches' in window) {
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (key) {
          return caches.delete(key);
        })
      );
    });
  }
})();
