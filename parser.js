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
        if (value instanceof String) {
          return value.trim();
        }
        return value;
      }
    }
  };
}

function keywordsToArray(str) {
  const keywords = str.toString().split(',');
  return keywords.map(keyword => keyword.trim());
}


const titleRules = buildRuleset('title', [
  ['meta[property="og:title"]', node => node.element.content],
  ['meta[property="twitter:title"]', node => node.element.content],
  ['meta[name="hdl"]', node => node.element.content],
  ['title', node => node.element.text],
]);

const canonicalUrlRules = buildRuleset('url', [
  ['meta[property="og:url"]', node => node.element.content],
  ['link[rel="canonical"]', node => node.element.href],
]);

const keywordsRules = buildRuleset('keywords', [
  ['meta[name="keywords"]', node => keywordsToArray(node.element.content)],
]);

const iconRules = buildRuleset('icon', [
  ['link[rel="apple-touch-icon"]', node => node.element.href],
  ['link[rel="apple-touch-icon-precomposed"]', node => node.element.href],
  ['link[rel="icon"]', node => node.element.href],
  ['link[rel="fluid-icon"]', node => node.element.href],
  ['link[rel="shortcut icon"]', node => node.element.href],
  ['link[rel="Shortcut Icon"]', node => node.element.href],
  ['link[rel="mask-icon"]', node => node.element.href],
]);

const imageRules = buildRuleset('image', [
  ['meta[property="og:image:secure_url"]', node => node.element.content],
  ['meta[property="og:image:url"]', node => node.element.content],
  ['meta[property="og:image"]', node => node.element.content],
  ['meta[property="twitter:image"]', node => node.element.content],
  ['meta[name="thumbnail"]', node => node.element.content],
]);

const descriptionRules = buildRuleset('description', [
  ['meta[property="og:description"]', node => node.element.content],
  ['meta[name="description"]', node => node.element.content],
]);

const typeRules = buildRuleset('type', [
  ['meta[property="og:type"]', node => node.element.content],
]);


const metadataRules = {
  description: descriptionRules,
  icon_url: iconRules,
  image_url: imageRules,
  keywords: keywordsRules,
  title: titleRules,
  type: typeRules,
  url: canonicalUrlRules
};


function getMetadata(doc, rules) {
  const metadata = {};
  const ruleSet = rules || metadataRules;

  Object.keys(ruleSet).map(metadataKey => {
    const metadataRule = ruleSet[metadataKey];
    metadata[metadataKey] = typeof metadataRule === 'function' ?
      metadataRule(doc) :
      getMetadata(doc, metadataRule);
  });

  return metadata;
}

module.exports = {
  metadataRules,
  getMetadata
};
