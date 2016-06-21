// Tests for parse.js

const assert = require('chai').assert;
const jsdom = require('jsdom');

const {rules, getMetadata} = require('../parser.js');


function buildHTML(tag) {
  return `
    <html>
      <head>
        ${tag}
      </head>
    </html>
  `;
}


describe('Title Rule Tests', function() {
  const pageTitle = 'Page Title';

  it('finds og:title', () => {
      const document = jsdom.jsdom(buildHTML(`<meta property="og:title" content="${pageTitle}" />`));
      const foundTitle = rules.title(document);
      assert.equal(foundTitle, pageTitle);
  });

  it('finds twitter:title', () => {
      const document = jsdom.jsdom(buildHTML(`<meta property="twitter:title" content="${pageTitle}" />`));
      const foundTitle = rules.title(document);
      assert.equal(foundTitle, pageTitle);
  });

  it('finds hdl', function() {
      const document = jsdom.jsdom(buildHTML(`<meta name="hdl" content="${pageTitle}" />`));
      const foundTitle = rules.title(document);
      assert.equal(foundTitle, pageTitle);
  });

  it('finds title', function() {
      const document = jsdom.jsdom(buildHTML(`<title>${pageTitle}</title>`));
      const foundTitle = rules.title(document);
      assert.equal(foundTitle, pageTitle);
  });
});


describe('Canonical URL Rule Tests', function() {
  const pageUrl = 'http://www.example.com/';

  it('finds og:url', () => {
      const document = jsdom.jsdom(buildHTML(`<meta property="og:url" content="${pageUrl}" />`));
      const foundUrl = rules.url(document);
      assert.equal(foundUrl, pageUrl);
  });

  it('finds rel=canonical', function() {
      const document = jsdom.jsdom(buildHTML(`<link rel="canonical" href="${pageUrl}" />`));
      const foundUrl = rules.url(document);
      assert.equal(foundUrl, pageUrl);
  });
});
