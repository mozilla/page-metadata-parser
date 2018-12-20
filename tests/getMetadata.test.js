// Tests for parse.js
const {assert} = require('chai');
const {getProvider, getMetadata, metadataRuleSets} = require('../parser');
const {stringToDom} = require('./test-utils');
const {parseUrl} = require('../url-utils');

describe('Get Provider Tests', function() {
  it('gets a provider with no subdomain', function() {
    assert.equal(getProvider(parseUrl('https://example.com/this/?id=that')), 'example');
  });

  it('removes www as a subdomain', function() {
    assert.equal(getProvider(parseUrl('https://www.example.com/this/?id=that')), 'example');
  });

  it('removes www1 as a subdomain', function() {
    assert.equal(getProvider(parseUrl('https://www1.example.com/this/?id=that')), 'example');
  });

  it('preserves non-www subdomains', function() {
    assert.equal(getProvider(parseUrl('https://things.example.com/this/?id=that')), 'things example');
  });

  it('removes secondary TLDs', function() {
    assert.equal(getProvider(parseUrl('https://things.example.co.uk/this/?id=that')), 'things example');
  });
});

describe('Get Metadata Tests', function() {
  const sampleDescription = 'A test page.';
  const sampleIcon = 'http://www.example.com/favicon.ico';
  const sampleImageHTTP = 'http://www.example.com/image.png';
  const sampleImageHTTPS = 'https://www.example.com/secure_image.png';
  const sampleTitle = 'Page Title';
  const sampleType = 'article';
  const sampleUrl = 'http://www.example.com/';
  const sampleProviderName = 'Example Provider';
  const sampleLanguage = 'en';


  const sampleHtml = `
    <html lang="en-CA">
    <head>
      <meta property="og:description" content="${sampleDescription}" />
      <link rel="icon" href="${sampleIcon}" />
      <meta property="og:image" content="${sampleImageHTTP}" />
      <meta property="og:image:url" content="${sampleImageHTTP}" />
      <meta property="og:image:secure_url" content="${sampleImageHTTPS}" />
      <meta property="og:title" content="${sampleTitle}" />
      <meta property="og:type" content="${sampleType}" />
      <meta property="og:url" content="${sampleUrl}" />
      <meta property="og:site_name" content="${sampleProviderName}" />
    </head>
    </html>
  `;

  it('parses metadata', () => {
    const doc = stringToDom(sampleHtml);
    const metadata = getMetadata(doc, sampleUrl, metadataRuleSets);

    assert.equal(metadata.description, sampleDescription, `Unable to find ${sampleDescription} in ${sampleHtml}`);
    assert.equal(metadata.icon, sampleIcon, `Unable to find ${sampleIcon} in ${sampleHtml}`);
    assert.equal(metadata.image, sampleImageHTTPS, `Unable to find ${sampleImageHTTPS} in ${sampleHtml}`);
    assert.equal(metadata.title, sampleTitle, `Unable to find ${sampleTitle} in ${sampleHtml}`);
    assert.equal(metadata.type, sampleType, `Unable to find ${sampleType} in ${sampleHtml}`);
    assert.equal(metadata.url, sampleUrl, `Unable to find ${sampleUrl} in ${sampleHtml}`);
    assert.equal(metadata.provider, sampleProviderName, `Unable to find ${sampleProviderName} in ${sampleHtml}`);
    assert.equal(metadata.language, sampleLanguage, `Unable to find ${sampleLanguage} in ${sampleHtml}`);

  });

  it('uses absolute URLs when url parameter passed in', () => {
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
    const metadata = getMetadata(doc, sampleUrl, metadataRuleSets);

    assert.equal(metadata.icon, sampleIcon, `Unable to find ${sampleIcon} in ${relativeHtml}`);
    assert.equal(metadata.image, sampleImageHTTP, `Unable to find ${sampleImageHTTP} in ${relativeHtml}`);
  });

  it('adds a provider when URL passed in', () => {
      const emptyHtml = `
        <html>
        <head>
        </head>
        </html>
    `;

    const sampleProvider = 'example';
    const doc = stringToDom(emptyHtml);
    const metadata = getMetadata(doc, sampleUrl, metadataRuleSets);

    assert.equal(metadata.provider, sampleProvider, `Unable to find ${sampleProvider} in ${sampleUrl}`);
  });

  it('prefers open graph site name over URL based provider', () => {
      const sampleProvider = 'OpenGraph Site Name';
      const providerHtml = `
        <html>
        <head>
          <meta property="og:site_name" content="${sampleProvider}" />
        </head>
        </html>
    `;

    const doc = stringToDom(providerHtml);
    const metadata = getMetadata(doc, sampleUrl, metadataRuleSets);

    assert.equal(metadata.provider, sampleProvider, `Unable to find ${sampleProvider} in ${providerHtml}`);
  });

  it('uses default favicon when no favicon is found', () => {
    const noIconHtml = `
      <html>
      <head>
      </head>
      </html>
    `;

    const doc = stringToDom(noIconHtml);
    const metadata = getMetadata(doc, sampleUrl, metadataRuleSets);

    assert.equal(metadata.icon, sampleIcon, `Unable to find ${sampleIcon} in ${metadata.icon}`);
  });
  it('falls back on provided url when no canonical url found', () => {
    const html = `
      <html>
      <head>
      </head>
      </html>
    `;

    const doc = stringToDom(html);
    const metadata = getMetadata(doc, sampleUrl, metadataRuleSets);

    assert.equal(metadata.url, sampleUrl, `Unable to find ${sampleUrl} in ${JSON.stringify(metadata)}`);
  });

  it('it fetches keywords, icon and description from uppercased metadata property titles', () => {
    const relativeHtml = `
      <html>
      <head>
        <meta name="Description" content="${sampleDescription}" />
        <meta name="Keywords" content="${sampleTitle}" />
        <link rel="Icon" href="/favicon.ico" />
      </head>
      </html>
    `;

    const doc = stringToDom(relativeHtml);
    const metadata = getMetadata(doc, sampleUrl, metadataRuleSets);

    assert.equal(metadata.icon, sampleIcon, `Unable to find ${sampleIcon} in ${relativeHtml}`);
    assert.equal(metadata.description, sampleDescription, `Unable to find ${sampleDescription} in ${relativeHtml}`);
    assert.equal(metadata.keywords, sampleTitle, `Unable to find ${sampleTitle} in ${relativeHtml}`);

  });

  it('finds language in metadata', () => {
    const html = `
      <html>
      <head>
        <meta name="language" content="en-CA" />
      </head>
      </html>
    `;

    const doc = stringToDom(html);
    const metadata = getMetadata(doc, sampleUrl, metadataRuleSets);

    assert.equal(metadata.language, sampleLanguage, `Unable to find ${sampleLanguage} in ${html}`);
  });

  it('allows custom rules', () => {
    const doc = stringToDom(sampleHtml);
    const rules = {
      url: metadataRuleSets.url,
      title: metadataRuleSets.title,
      description: metadataRuleSets.description
    };

    const metadata = getMetadata(doc, sampleUrl, rules);

    assert.equal(metadata.url, sampleUrl, 'Error finding URL');
    assert.equal(metadata.title, sampleTitle, 'Error finding title');
    assert.equal(metadata.description, sampleDescription, 'Error finding description');
  });
});
