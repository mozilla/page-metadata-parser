// Tests for parse.js

const assert = require('chai').assert;
const jsdom = require('jsdom');

const {rules, getMetadata} = require('../parser.js');

//const titleRules = buildRuleset('title', [
//  ['meta[property="og:title"]', node => node.element.content],
//  ['meta[property="twitter:title"]', node => node.element.content],
//  ['meta[name="hdl"]', node => node.element.content],
//  ['title', node => node.element.text],
//]);


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
