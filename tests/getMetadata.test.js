// Tests for parse.js
const {assert} = require('chai');
const {getMetadata, metadataRules} = require('../parser');
const {stringToDom} = require('./test-utils');

describe('Get Metadata Tests', function() {
  const sampleDescription = 'A test page.';
  const sampleIcon = 'http://www.example.com/favicon.ico';
  const sampleImageHTTP = 'http://www.example.com/image.png';
  const sampleImageHTTPS = 'https://www.example.com/secure_image.png';
  const sampleTitle = 'Page Title';
  const sampleType = 'article';
  const sampleUrl = 'http://www.example.com/';

  const sampleHtml = `
    <html>
    <head>
      <meta property="og:description" content="${sampleDescription}" />
      <link rel="icon" href="${sampleIcon}" />
      <meta property="og:image" content="${sampleImageHTTP}" />
      <meta property="og:image:url" content="${sampleImageHTTP}" />
      <meta property="og:image:secure_url" content="${sampleImageHTTPS}" />
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
    assert.equal(metadata.image_url, sampleImageHTTPS, `Unable to find ${sampleImageHTTPS} in ${sampleHtml}`);
    assert.equal(metadata.title, sampleTitle, `Unable to find ${sampleTitle} in ${sampleHtml}`);
    assert.equal(metadata.type, sampleType, `Unable to find ${sampleType} in ${sampleHtml}`);
    assert.equal(metadata.url, sampleUrl, `Unable to find ${sampleUrl} in ${sampleHtml}`);
  });

  it('uses absolute URLs when url parameter passed in through context', () => {
    const relativeHtml = `
      <html>
      <head>
        <meta property="og:description" content="${sampleDescription}" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/image.png" />
        <meta property="og:title" content="${sampleTitle}" />
        <meta property="og:type" content="${sampleType}" />
        <meta property="og:url" content="${sampleUrl}" />
      </head>
      </html>
    `;

    const doc = stringToDom(relativeHtml);
    const metadata = getMetadata(doc, metadataRules, {url: 'http://www.example.com/'});

    assert.equal(metadata.icon_url, sampleIcon, `Unable to find ${sampleIcon} in ${sampleHtml}`);
    assert.equal(metadata.image_url, sampleImageHTTP, `Unable to find ${sampleImageHTTP} in ${sampleHtml}`);
  });

  it('allows custom rules', () => {
    const doc = stringToDom(sampleHtml);
    const rules = {
      title: metadataRules.title,
      description: metadataRules.description
    };

    const metadata = getMetadata(doc, rules);
    assert.equal(metadata.title, sampleTitle, 'Error finding title');
    assert.equal(metadata.description, sampleDescription, 'Error finding description');
    assert.equal(Object.keys(metadata).length, 2);
  });

  it('allows to create groups of rules', () => {
    const doc = stringToDom(sampleHtml);
    const rules = {
      openGraph: {
        title: metadataRules.title,
        description: metadataRules.description,
        type: metadataRules.type,
        url: metadataRules.url
      },
      media: {
        icon: metadataRules.icon_url,
        image: metadataRules.image_url
      }
    };

    const metadata = getMetadata(doc, rules);
    assert.isObject(metadata.openGraph);
    assert.isObject(metadata.media);

    assert.equal(metadata.openGraph.title, sampleTitle, 'Error finding title');
    assert.equal(metadata.openGraph.description, sampleDescription, 'Error finding description');
    assert.equal(metadata.openGraph.type, sampleType, 'Error finding type');
    assert.equal(metadata.openGraph.url, sampleUrl, 'Error finding url');

    assert.equal(metadata.media.icon, sampleIcon, 'Error finding icon');
    assert.equal(metadata.media.image, sampleImageHTTPS, 'Error finding image');
  });

});
