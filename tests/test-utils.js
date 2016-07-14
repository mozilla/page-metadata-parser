if (global.DOMParser !== undefined) {
  const parser = new DOMParser();
  module.exports = {
    stringToDom(str) {
      return parser.parseFromString(str, 'text/html');
    }
  };
} else {
  const domino = require('domino');
  module.exports = {
    stringToDom(str) {
      return domino.createWindow(str).document;
    }
  };
}

