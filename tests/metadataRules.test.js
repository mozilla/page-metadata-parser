// Tests for parse.js
const {assert} = require('chai');
const {buildRuleSet, metadataRuleSets} = require('../parser');
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
    const rule = buildRuleSet(testRule);
    const found = rule(doc, {
      url: 'http://www.example.com/'
    });
    assert.deepEqual(found, expected, `Unable to find ${testName} in ${html}`);
  });
}


describe('Title Rule Tests', function() {
  const pageTitle = 'Page Title';

  const ruleTests = [
    ['og:title', `<meta property="og:title" content="${pageTitle}" />`],
    ['twitter:title', `<meta name="twitter:title" content="${pageTitle}" />`],
    ['twitter:title', `<meta property="twitter:title" content="${pageTitle}" />`],
    ['hdl', `<meta name="hdl" content="${pageTitle}" />`],
    ['title', `<title>${pageTitle}</title>`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.title, pageTitle, testTag));
});


describe('Canonical URL Rule Tests', function() {
  const pageUrl = 'http://www.example.com/page.html';
  const relativeUrl = '/page.html';

  const ruleTests = [
    ['og:url', `<meta property="og:url" content="${pageUrl}" />`],
    ['rel=canonical', `<link rel="canonical" href="${pageUrl}" />`],
    ['relative canonical', `<link rel="canonical" href="${relativeUrl}" />`],
    ['amp-canurl', `<a class="amp-canurl" href="${pageUrl}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.url, pageUrl, testTag));

  const wrongPageUrl = 'http://example.com/incorrect-page.html';
  const ruleOrderingTests = [
    ['rel=canonical before og:url', `
      <link rel="canonical" href="${pageUrl}"/>
      <meta property="og:url" content="${wrongPageUrl}" />
    `],
    ['amp-canurl before rel=canonical', `
      <a class="amp-canurl" href="${pageUrl}" />
      <link rel="canonical" href=${wrongPageUrl}/>
    `],
  ];
  ruleOrderingTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.url, pageUrl, testTag));
});


describe('Icon Rule Tests', function() {
  const pageIcon = 'http://www.example.com/favicon.ico';
  const relativeIcon = '/favicon.ico';

  const ruleTests = [
    ['apple-touch-icon', `<link rel="apple-touch-icon" href="${pageIcon}" />`],
    ['apple-touch-icon-precomposed', `<link rel="apple-touch-icon-precomposed" href="${pageIcon}" />`],
    ['icon', `<link rel="icon" href="${pageIcon}" />`],
    ['fluid-icon', `<link rel="fluid-icon" href="${pageIcon}" />`],
    ['shortcut icon', `<link rel="shortcut icon" href="${pageIcon}" />`],
    ['Shortcut Icon', `<link rel="Shortcut Icon" href="${pageIcon}" />`],
    ['mask-icon', `<link rel="mask-icon" href="${pageIcon}" />`],
    ['relative icon', `<link rel="icon" href="${relativeIcon}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.icon, pageIcon, testTag));

  it('prefers higher resolution icons', () => {
    const html = `
      <html>
        <head>
          <link rel="icon" href="small.png" sizes="16x16">
          <link rel="icon" href="large.png" sizes="32x32">
          <link rel="icon" href="any.png" sizes="any">
        </head>
      </html>
    `;
    const doc = stringToDom(html);
    const rule = buildRuleSet(metadataRuleSets.icon);
    const found = rule(doc, {
      url: 'http://www.example.com/'
    });
    assert.deepEqual(found, 'http://www.example.com/large.png', 'icon_rules did not prefer the largest icon');
  });
});


describe('Image Rule Tests', function() {
  const pageImage = 'http://www.example.com/image.png';
  const relativeImage = '/image.png';

  const ruleTests = [
    ['og:image', `<meta property="og:image" content="${pageImage}" />`],
    ['og:image:url', `<meta property="og:image:url" content="${pageImage}" /> `],
    ['og:image:secure_url', `<meta property="og:image:secure_url" content="${pageImage}" /> `],
    ['twitter:image', `<meta name="twitter:image" content="${pageImage}" />`],
    ['twitter:image', `<meta property="twitter:image" content="${pageImage}" />`],
    ['thumbnail', `<meta name="thumbnail" content="${pageImage}" />`],
    ['relative image', `<meta name="thumbnail" content="${relativeImage}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.image, pageImage, testTag));
});


describe('Description Rule Tests', function() {
  const pageDescription = 'Example page description.';

  const ruleTests = [
    ['og:description', `<meta property="og:description" content="${pageDescription}" />`],
    ['description', `<meta name="description" content="${pageDescription}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.description, pageDescription, testTag));
});


describe('Type Rule Tests', function() {
  const pageType = 'article';

  const ruleTests = [
    ['og:type', `<meta property="og:type" content="${pageType}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.type, pageType, testTag));
});


describe('Keywords Rule Tests', function() {
  const keywords = ['Cats', 'Kitties', 'Meow'];

  const ruleTests = [
    ['keywords', `<meta name="keywords" content="${keywords.join(', ')}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.keywords, keywords, testTag));
});

describe('Provider Rule Tests', function() {
  const provider = 'Example provider';

  const ruleTests = [
    ['og:type', `<meta property="og:site_name" content="${provider}" />`],
  ];

  ruleTests.map(([testName, testTag]) => ruleTest(testName, metadataRuleSets.provider, provider, testTag));

  it('falls back to parsing the URL to find the provider', () => {
    const html = `
      <html>
        <head>
        </head>
      </html>
    `;
    const doc = stringToDom(html);
    const rule = buildRuleSet(metadataRuleSets.provider);
    const found = rule(doc, {
      url: 'http://www.example.com/'
    });
    assert.deepEqual(found, 'example', 'Failed to parse the URl to find the default provider');
  });
});
