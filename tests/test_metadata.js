// Tests for parse.js
const assert = require('chai').assert;
const jsdom = require('jsdom');

const {metadataRules, getMetadata} = require('../parser.js');


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

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRules.title, pageTitle, testTag));
});


describe('Canonical URL Rule Tests', function() {
  const pageUrl = 'http://www.example.com/';

  const ruleTests = [
    ['og:url', `<meta property="og:url" content="${pageUrl}" />`],
    ['rel=canonical', `<link rel="canonical" href="${pageUrl}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRules.url, pageUrl, testTag));
});


describe('Icon Rule Tests', function() {
  const pageIcon = 'http://www.example.com/favicon.ico';

  const ruleTests = [
    ['apple-touch-icon', `<link rel="apple-touch-icon" href="${pageIcon}" />`],
    ['apple-touch-icon-precomposed', `<link rel="apple-touch-icon-precomposed" href="${pageIcon}" />`],
    ['icon', `<link rel="icon" href="${pageIcon}" />`],
    ['fluid-icon', `<link rel="fluid-icon" href="${pageIcon}" />`],
    ['shortcut icon', `<link rel="shortcut icon" href="${pageIcon}" />`],
    ['Shortcut Icon', `<link rel="Shortcut Icon" href="${pageIcon}" />`],
    ['mask-icon', `<link rel="mask-icon" href="${pageIcon}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRules.icon_url, pageIcon, testTag));
});


describe('Image Rule Tests', function() {
  const pageImage = 'http://www.example.com/image.png';

  const ruleTests = [
    ['og:image', `<meta property="og:image" content="${pageImage}" />`],
    ['twitter:image', `<meta property="twitter:image" content="${pageImage}" />`],
    ['thumbnail', `<meta name="thumbnail" content="${pageImage}" />`],
    ['img', `<img src="${pageImage}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRules.image_url, pageImage, testTag));
});


describe('Description Rule Tests', function() {
  const pageDescription = 'Example page description.';

  const ruleTests = [
    ['og:description', `<meta property="og:description" content="${pageDescription}" />`],
    ['description', `<meta name="description" content="${pageDescription}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRules.description, pageDescription, testTag));
});


describe('Type Rule Tests', function() {
  const pageType = 'article';

  const ruleTests = [
    ['og:type', `<meta property="og:type" content="${pageType}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRules.type, pageType, testTag));
});
