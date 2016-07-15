const {assert} = require('chai');
const MetadataParser = require('../parser');
const {stringToDom} = require('./test-utils');
const DEFAULT_RULESET = require("../lib/default-ruleset");

describe("MetadataParser", () => {
  it("should extend the normal rules", () => {
    const parser = new MetadataParser({
      site_name: [['meta[property="og:site_name"]', node => node.element.content]]
    });
    const result = parser.getMetadata(stringToDom('<head><meta property="og:site_name" content="foo" /></head>'));
    assert.equal(result.site_name, "foo");
  });

  it("should should replace the normal rules", () => {
    const newRules = {
      foo: [['meta[property="og:foo"]', node => node.element.content]]
    };
    const parser = new MetadataParser(newRules, {replace: true});
    const result = parser.getMetadata(stringToDom(`<head>
      <meta property="og:foo" content="bar" />
      <meta name="description" content="asdasd" />
    </head>`));
    assert.deepEqual(result, {foo: "bar"});
  });
});
