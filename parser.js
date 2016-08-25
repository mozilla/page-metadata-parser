const urlparse = require('url');
const {dom, rule, ruleset} = require('fathom-web');

function makeUrlAbsolute(base, relative) {
  const relativeParsed = urlparse.parse(relative);

  if (relativeParsed.host === null) {
    return urlparse.resolve(base, relative);
  }

  return relative;
}

function buildRuleset(name, rules, processors) {
  const reversedRules = Array.from(rules).reverse();
  const builtRuleset = ruleset(...reversedRules.map(([query, handler], order) => rule(
    dom(query),
    node => [{
      score: order,
      flavor: name,
      notes: handler(node),
    }]
  )));

  return (doc, context) => {
    const kb = builtRuleset.score(doc);
    const maxNode = kb.max(name);

    if (maxNode) {
      let value = maxNode.flavors.get(name);

      if (processors) {
        processors.forEach(processor => {
          value = processor(value, context);
        });
      }

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
    processors: [
      (icon_url, context) => makeUrlAbsolute(context.url, icon_url)
    ]
  },

  image_url: {
    rules: [
      ['meta[property="og:image:secure_url"]', node => node.element.getAttribute('content')],
      ['meta[property="og:image:url"]', node => node.element.getAttribute('content')],
      ['meta[property="og:image"]', node => node.element.getAttribute('content')],
      ['meta[property="twitter:image"]', node => node.element.getAttribute('content')],
      ['meta[name="thumbnail"]', node => node.element.getAttribute('content')],
    ],
    processors: [
      (image_url, context) => makeUrlAbsolute(context.url, image_url)
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

function getMetadata(doc, rules, url) {
  const metadata = {};
  const ruleSet = rules || metadataRules;

  const context = {};

  if (url) {
    context.url = url;
  }

  Object.keys(ruleSet).map(metadataKey => {
    const metadataRule = ruleSet[metadataKey];

    if(Array.isArray(metadataRule.rules)) {
      metadata[metadataKey] = buildRuleset(metadataKey, metadataRule.rules, metadataRule.processors)(doc, context);
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
