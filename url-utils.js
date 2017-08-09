if (global.URL !== undefined) {
  // We're in Firefox
  module.exports = {
    makeUrlAbsolute(base, relative) {
      return new URL(relative, base).href;
    },
    parseUrl(url) {
      return new URL(url).host;
    }
  };
} else {
  // We're in Node.js
  const urlparse = require('url');
  module.exports = {
    makeUrlAbsolute(base, relative) {
      const relativeParsed = urlparse.parse(relative);

      if (relativeParsed.host === null) {
        return urlparse.resolve(base, relative);
      }

      return relative;
    },
    parseUrl(url) {
      return urlparse.parse(url).hostname;
    }
  };
}

