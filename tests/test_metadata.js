// Tests for parse.js

const assert = require('chai').assert;
const jsdom = require('jsdom');

const {getMetadata} = require('../parser.js');


describe('Metadata tests', function() {
  it('extracts metadata', function() {
      const document = jsdom.jsdom(`
        <html>
          <head>
            <title>Test Page</title>
          </head>
        </html>
      `);
      const metadata = getMetadata(document);
      assert.equal(metadata.title, 'Test Page');
  });
});
