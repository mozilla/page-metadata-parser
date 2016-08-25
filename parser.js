const {dom, rule, ruleset} = require('fathom-web');

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

const metadataRules = {
  description: {
    rules: [
      ['meta[property="og:description"]', node => node.element.getAttribute('content')],
      ['meta[name="description"]', node => node.element.getAttribute('content')],
    ],
  },

  icon_url: {
    rules: [
      ['link[rel="apple-touch-icon"]', node => node.element.getAttribute('href')],
      ['link[rel="apple-touch-icon-precomposed"]', node => node.element.getAttribute('href')],
      ['link[rel="icon"]', node => node.element.getAttribute('href')],
      ['link[rel="fluid-icon"]', node => node.element.getAttribute('href')],
      ['link[rel="shortcut icon"]', node => node.element.getAttribute('href')],
      ['link[rel="Shortcut Icon"]', node => node.element.getAttribute('href')],
      ['link[rel="mask-icon"]', node => node.element.getAttribute('href')],
    ],
  },

  image_url: {
    rules: [
      ['meta[property="og:image:secure_url"]', node => node.element.getAttribute('content')],
      ['meta[property="og:image:url"]', node => node.element.getAttribute('content')],
      ['meta[property="og:image"]', node => node.element.getAttribute('content')],
      ['meta[property="twitter:image"]', node => node.element.getAttribute('content')],
      ['meta[name="thumbnail"]', node => node.element.getAttribute('content')],
    ],
  },

  keywords: {
    rules: [
      ['meta[name="keywords"]', node => node.element.getAttribute('content')],
    ],
  },

  title: {
    rules: [
      ['meta[property="og:title"]', node => node.element.getAttribute('content')],
      ['meta[property="twitter:title"]', node => node.element.getAttribute('content')],
      ['meta[name="hdl"]', node => node.element.getAttribute('content')],
      ['title', node => node.element.text],
    ],
  },

  type: {
    rules: [
      ['meta[property="og:type"]', node => node.element.getAttribute('content')],
    ],
  },

  url: {
    rules: [
      ['meta[property="og:url"]', node => node.element.getAttribute('content')],
      ['link[rel="canonical"]', node => node.element.getAttribute('href')],
    ],
  },
};

function getMetadata(doc, rules) {
  const metadata = {};
  const ruleSet = rules || metadataRules;

  Object.keys(ruleSet).map(metadataKey => {
    const metadataRule = ruleSet[metadataKey];

    if(Array.isArray(metadataRule.rules)) {
      metadata[metadataKey] = buildRuleset(metadataKey, metadataRule.rules)(doc);
    } else {
      metadata[metadataKey] = getMetadata(doc, metadataRule);
    }
  });

  return metadata;
}

module.exports = {
  buildRuleset,
  metadataRules,
  getMetadata
};
