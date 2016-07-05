module.exports = {
  description: [
    ['meta[property="og:description"]', node => node.element.content],
    ['meta[name="description"]', node => node.element.content],
  ],
  icon_url: [
    ['link[rel="apple-touch-icon"]', node => node.element.href],
    ['link[rel="apple-touch-icon-precomposed"]', node => node.element.href],
    ['link[rel="icon"]', node => node.element.href],
    ['link[rel="fluid-icon"]', node => node.element.href],
    ['link[rel="shortcut icon"]', node => node.element.href],
    ['link[rel="Shortcut Icon"]', node => node.element.href],
    ['link[rel="mask-icon"]', node => node.element.href],
  ],
  image_url: [
    ['meta[property="og:image"]', node => node.element.content],
    ['meta[property="twitter:image"]', node => node.element.content],
    ['meta[name="thumbnail"]', node => node.element.content],
    ['img', node => node.element.src],
  ],
  title: [
    ['meta[property="og:title"]', node => node.element.content],
    ['meta[property="twitter:title"]', node => node.element.content],
    ['meta[name="hdl"]', node => node.element.content],
    ['title', node => node.element.text],
  ],
  type: [
    ['meta[property="og:type"]', node => node.element.content],
  ],
  url: [
    ['meta[property="og:url"]', node => node.element.content],
    ['link[rel="canonical"]', node => node.element.href],
  ]
};
