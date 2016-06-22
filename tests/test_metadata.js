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


function ruleTest(testName, testRule, expected, testTag) {
  it(`finds ${testName}`, () => {
    const html = buildHTML(testTag);
    const document = jsdom.jsdom(html);
    const found = testRule(document);
    assert.equal(found, expected, `Unable to find ${testName} in ${html}`);
  });
}


describe('Title Rule Tests', function() {
  const pageTitle = 'Page Title';

  const ruleTests = [
    ['og:title', `<meta property="og:title" content="${pageTitle}" />`],
    ['twitter:title', `<meta property="twitter:title" content="${pageTitle}" />`],
    ['hdl', `<meta name="hdl" content="${pageTitle}" />`],
    ['title', `<title>${pageTitle}</title>`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, rules.title, pageTitle, testTag));
});


describe('Canonical URL Rule Tests', function() {
  const pageUrl = 'http://www.example.com/';

  const ruleTests = [
    ['og:url', `<meta property="og:url" content="${pageUrl}" />`],
    ['rel=canonical', `<link rel="canonical" href="${pageUrl}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, rules.url, pageUrl, testTag));
});
