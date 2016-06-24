if (global.DOMParser !== undefined) {
  const parser = new DOMParser();
  module.exports = {
    stringToDom(str) {
      return parser.parseFromString(str, 'text/html');
    }
  };
} else {
  const jsdom = require('jsdom');
  module.exports = {
    stringToDom(str) {
      return jsdom.jsdom(str);
    }
  };
}

