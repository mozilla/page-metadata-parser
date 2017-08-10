if (global.DOMParser !== undefined) {
  // We're in Firefox
  module.exports = {
    stringToDom(str) {
      const parser = new DOMParser();
      return parser.parseFromString(str, 'text/html');
    }
  };
} else {
  // We're in Node.js
  const domino = require('domino');
  module.exports = {
    stringToDom(str) {
      return domino.createWindow(str).document;
    }
  };
}

