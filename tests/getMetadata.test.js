// Tests for parse.js
const {assert} = require('chai');
const {getMetadata} = require('../parser');
const {stringToDom} = require('./test-utils');

describe('Get Metadata Tests', function() {
  const sampleDescription = 'A test page.';
  const sampleIcon = 'http://www.example.com/favicon.ico';
  const sampleImage = 'http://www.example.com/image.png';
  const sampleTitle = 'Page Title';
  const sampleType = 'article';
  const sampleUrl = 'http://www.example.com/';

  const sampleHtml = `
    <html>
    <head>
      <meta property="og:description" content="${sampleDescription}" />
      <link rel="icon" href="${sampleIcon}" />
      <meta property="og:image" content="${sampleImage}" />
      <meta property="og:title" content="${sampleTitle}" />
      <meta property="og:type" content="${sampleType}" />
      <meta property="og:url" content="${sampleUrl}" />
    </head>
    </html>
  `;

  it('parses metadata', () => {
    const doc = stringToDom(sampleHtml);
    const metadata = getMetadata(doc);

    assert.equal(metadata.description, sampleDescription, `Unable to find ${sampleDescription} in ${sampleHtml}`);
    assert.equal(metadata.icon_url, sampleIcon, `Unable to find ${sampleIcon} in ${sampleHtml}`);
    assert.equal(metadata.image_url, sampleImage, `Unable to find ${sampleImage} in ${sampleHtml}`);
    assert.equal(metadata.title, sampleTitle, `Unable to find ${sampleTitle} in ${sampleHtml}`);
    assert.equal(metadata.type, sampleType, `Unable to find ${sampleType} in ${sampleHtml}`);
    assert.equal(metadata.url, sampleUrl, `Unable to find ${sampleUrl} in ${sampleHtml}`);
  });

});
