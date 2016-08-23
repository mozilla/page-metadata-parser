// Tests for parse.js
const {assert} = require('chai');
const {metadataRules} = require('../parser');
const {stringToDom} = require('./test-utils');

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
    const doc = stringToDom(html);
    const found = testRule(doc);
    assert.deepEqual(found, expected, `Unable to find ${testName} in ${html}`);
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
    ['og:image:url', `<meta property="og:image:url" content="${pageImage}" /> `],
    ['og:image:secure_url', `<meta property="og:image:secure_url" content="${pageImage}" /> `],
    ['twitter:image', `<meta property="twitter:image" content="${pageImage}" />`],
    ['thumbnail', `<meta name="thumbnail" content="${pageImage}" />`],
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


describe('Keywords Rule Tests', function() {
  const keywords = ['Cats', 'Kitties', 'Meow'];

  const ruleTests = [
    ['keywords', `<meta name="keywords" content="${keywords.join(', ')}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRules.keywords, keywords, testTag));
});
