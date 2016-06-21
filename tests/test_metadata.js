// Tests for parse.js

const assert = require('chai').assert;
const jsdom = require('jsdom');

const {rules, getMetadata} = require('../parser.js');


describe('Title Rule Tests', function() {
  it('finds og:title', function() {
      const document = jsdom.jsdom(`
        <html>
          <head>
            <meta property="og:title" content="Title" />
          </head>
        </html>
      `);
      const title = rules.title(document);
      assert.equal(title, 'Title');
  });

  it('finds twitter:title', function() {
      const document = jsdom.jsdom(`
        <html>
          <head>
            <meta property="twitter:title" content="Title" />
          </head>
        </html>
      `);
      const title = rules.title(document);
      assert.equal(title, 'Title');
  });

  it('finds hdl', function() {
      const document = jsdom.jsdom(`
        <html>
          <head>
            <meta name="hdl" content="Title" />
          </head>
        </html>
      `);
      const title = rules.title(document);
      assert.equal(title, 'Title');
  });

  it('finds title', function() {
      const document = jsdom.jsdom(`
        <html>
          <head>
            <title>Title</title>
          </head>
        </html>
      `);
      const title = rules.title(document);
      assert.equal(title, 'Title');
  });
});


describe('Canonical URL Rule Tests', function() {
  it('finds og:url', function() {
      const document = jsdom.jsdom(`
        <html>
          <head>
            <meta property="og:url" content="http://www.example.com/" />
          </head>
        </html>
      `);
      const url = rules.url(document);
      assert.equal(url, 'http://www.example.com/');
  });

  it('finds rel=canonical', function() {
      const document = jsdom.jsdom(`
        <html>
          <head>
            <link rel="canonical" href="http://www.example.com/" />
          </head>
        </html>
      `);
      const url = rules.url(document);
      assert.equal(url, 'http://www.example.com/');
  });
});
