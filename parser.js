const {dom, rule, ruleset} = require('fathom-web');
const DEFAULT_RULESET = require('./lib/default-ruleset');

const MetadataParser = {
  metadataRules: Object.assign({}, DEFAULT_RULESET),
  buildRuleset(name, rules) {
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
  },
  getMetadata(doc) {
    const metadata = {};

    Object.keys(MetadataParser.metadataRules).forEach(metadataKey => {
      const metadataRule = MetadataParser.buildRuleset(metadataKey, MetadataParser.metadataRules[metadataKey]);
      metadata[metadataKey] = metadataRule(doc);
    });

    return metadata;
  }
};

module.exports = MetadataParser;
