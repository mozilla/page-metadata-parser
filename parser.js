const {dom, rule, ruleset} = require('fathom-web');
const DEFAULT_RULESET = require('./lib/default-ruleset');

function buildRuleset(name, rules) {
  const reversedRules = Array.from(rules).reverse();
  const builtRuleset = ruleset(...reversedRules.map(([query, handler], order) => rule(
    dom(query),
    node => [{
      score: order,
      flavor: name,
      notes: handler(node),
    }]
  )));

  return doc => {
    const kb = builtRuleset.score(doc);
    const maxNode = kb.max(name);
    if (maxNode) {
      const value = maxNode.flavors.get(name);
      if (value) {
        return value.trim();
      }
    }
  };
}

function getMetadata(doc, rules) {
  return Object.keys(rules).reduce((metadata, key) => {
    metadata[key] = buildRuleset(key, rules[key])(doc);
    return metadata;
  }, {});
}

class MetadataParser {
  constructor(customRules = {}, options = {}) {
    if (options.replace) {
      this._rules = customRules;
    } else {
      this._rules = Object.assign({}, MetadataParser.metadataRules, customRules);
    }
  }
  get rules() {
    return this._rules;
  }
  extend(key, rules, prepend) {
    if (!this._rules[key]) this._rules[key] = [];
    if (prepend) {
      this._rules[key] = rules.concat(this._rules[key]);
    } else {
      this._rules[key] = this._rules[key].concat(rules);
    }
  }
  getMetadata(doc) {
    return getMetadata(doc, this._rules);
  }
}

MetadataParser.metadataRules = Object.assign({}, DEFAULT_RULESET);
MetadataParser.buildRuleset = buildRuleset;
MetadataParser.getMetadata = doc => getMetadata(doc, MetadataParser.metadataRules);
module.exports = MetadataParser;
