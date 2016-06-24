const parser = new DOMParser();

module.exports = {
  stringToDom(str) {
    return parser.parseFromString(str, 'text/html');
  }
};
