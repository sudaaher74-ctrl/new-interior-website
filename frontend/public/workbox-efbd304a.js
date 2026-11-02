// Fallback for legacy Workbox imports
if (typeof self !== 'undefined' && self.define) {
  self.define([], function () {
    return {
      clientsClaim: function () {},
      precacheAndRoute: function () {},
      cleanupOutdatedCaches: function () {},
      registerRoute: function () {},
      NavigationRoute: function () {},
      createHandlerBoundToURL: function () {},
      NetworkFirst: function () {},
      ExpirationPlugin: function () {},
      CacheableResponsePlugin: function () {},
    };
  });
}

