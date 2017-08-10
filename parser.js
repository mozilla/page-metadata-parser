const {makeUrlAbsolute, parseUrl} = require('./url-utils');

function getProvider(host) {
  return host
    .replace(/www[a-zA-Z0-9]*\./, '')
    .replace('.co.', '.')
    .split('.')
    .slice(0, -1)
    .join(' ');
}

function buildRuleset(name, rules, processors, scorers) {
  return (doc, context) => {
    let maxScore = 0;
    let maxValue;

    for (let currRule = 0; currRule < rules.length; currRule++) {
      const [query, handler] = rules[currRule];

      const elements = Array.from(doc.querySelectorAll(query));

      if(elements.length) {
        for (const element of elements) {
          let score = rules.length - currRule;

          if (scorers) {
            for (const scorer of scorers) {
              const newScore = scorer(element, score);

              if (newScore) {
                score = newScore;
              }
            }
          }

          if (score > maxScore) {
            maxScore = score;
            maxValue = handler(element);
          }
        }
      }
    }

    if (maxValue) {
      if (processors) {
        for (const processor of processors) {
          maxValue = processor(maxValue, context);
        }
      }

      if (maxValue.trim) {
        return maxValue.trim();
      }

      return maxValue;
    }
  };
}

const metadataRules = {
  description: {
    rules: [
      ['meta[property="og:description"]', element => element.getAttribute('content')],
      ['meta[name="description"]', element => element.getAttribute('content')],
    ],
  },

  icon_url: {
    rules: [
      ['link[rel="apple-touch-icon"]', element => element.getAttribute('href')],
      ['link[rel="apple-touch-icon-precomposed"]', element => element.getAttribute('href')],
      ['link[rel="icon"]', element => element.getAttribute('href')],
      ['link[rel="fluid-icon"]', element => element.getAttribute('href')],
      ['link[rel="shortcut icon"]', element => element.getAttribute('href')],
      ['link[rel="Shortcut Icon"]', element => element.getAttribute('href')],
      ['link[rel="mask-icon"]', element => element.getAttribute('href')],
    ],
    scorers: [
      // Handles the case where multiple icons are listed with specific sizes ie
      // <link rel="icon" href="small.png" sizes="16x16">
      // <link rel="icon" href="large.png" sizes="32x32">
      (element, score) => {
        const sizes = element.getAttribute('sizes');

        if (sizes) {
          const sizeMatches = sizes.match(/\d+/g);

          if (sizeMatches) {
            return sizeMatches.reduce((a, b) => a * b);
          }
        }
      }
    ],
    processors: [
      (icon_url, context) => makeUrlAbsolute(context.url, icon_url)
    ]
  },

  image_url: {
    rules: [
      ['meta[property="og:image:secure_url"]', element => element.getAttribute('content')],
      ['meta[property="og:image:url"]', element => element.getAttribute('content')],
      ['meta[property="og:image"]', element => element.getAttribute('content')],
      ['meta[name="twitter:image"]', element => element.getAttribute('content')],
      ['meta[property="twitter:image"]', element => element.getAttribute('content')],
      ['meta[name="thumbnail"]', element => element.getAttribute('content')],
    ],
    processors: [
      (image_url, context) => makeUrlAbsolute(context.url, image_url)
    ],
  },

  keywords: {
    rules: [
      ['meta[name="keywords"]', element => element.getAttribute('content')],
    ],
    processors: [
      (keywords) => keywords.split(',').map((keyword) => keyword.trim()),
    ]
  },

  title: {
    rules: [
      ['meta[property="og:title"]', element => element.getAttribute('content')],
      ['meta[name="twitter:title"]', element => element.getAttribute('content')],
      ['meta[property="twitter:title"]', element => element.getAttribute('content')],
      ['meta[name="hdl"]', element => element.getAttribute('content')],
      ['title', element => element.text],
    ],
  },

  type: {
    rules: [
      ['meta[property="og:type"]', element => element.getAttribute('content')],
    ],
  },

  url: {
    rules: [
      ['meta[property="og:url"]', element => element.getAttribute('content')],
      ['link[rel="canonical"]', element => element.getAttribute('href')],
    ],
    processors: [
      (url, context) => makeUrlAbsolute(context.url, url)
    ]
  },

  provider: {
    rules: [
      ['meta[property="og:site_name"]', element => element.getAttribute('content')]
    ]
  },
};

function getMetadata(doc, url, rules) {
  const metadata = {};
  const context = {
    url,
  };

  const ruleSet = rules || metadataRules;

  Object.keys(ruleSet).map(metadataKey => {
    const metadataRule = ruleSet[metadataKey];

    if(Array.isArray(metadataRule.rules)) {
      const builtRule = buildRuleset(
        metadataKey,
        metadataRule.rules,
        metadataRule.processors,
        metadataRule.scorers
      );

      metadata[metadataKey] = builtRule(doc, context);
    } else {
      metadata[metadataKey] = getMetadata(doc, url, metadataRule);
    }
  });

  if(!metadata.url) {
    metadata.url = url;
  }

  if(url && !metadata.provider) {
    metadata.provider = getProvider(parseUrl(url));
  }

  metadata.icon_found = !!metadata.icon_url;
  if(url && !metadata.icon_url) {
    metadata.icon_url = makeUrlAbsolute(url, '/favicon.ico');
  }

  return metadata;
}

module.exports = {
  buildRuleset,
  getMetadata,
  getProvider,
  metadataRules
};
