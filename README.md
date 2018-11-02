# Page Metadata Parser
A Javascript library for parsing metadata in web pages.

[![CircleCI](https://circleci.com/gh/mozilla/page-metadata-parser.svg?style=svg)](https://circleci.com/gh/mozilla/page-metadata-parser)

[![Coverage Status](https://coveralls.io/repos/github/mozilla/page-metadata-parser/badge.svg?branch=master)](https://coveralls.io/github/mozilla/page-metadata-parser?branch=master)

## Overview

### Purpose

The purpose of this library is to be able to find a consistent set of metadata for any given web page.  Each individual kind of metadata has many rules which define how it may be located.  For example, a description of a page could be found in any of the following DOM elements:

    <meta name="description" content="A page's description"/>

    <meta property="og:description" content="A page's description" />

Because different web pages represent their metadata in any number of possible DOM elements, the Page Metadata Parser collects rules for different ways a given kind of metadata may be represented and abstracts them away from the caller.

The output of the metadata parser for the above example would be

    {description: "A page's description"}

regardless of which particular kind of description tag was used.

### Supported schemas

This library employs parsers for the following formats:

[opengraph](http://ogp.me/)

[twitter](https://dev.twitter.com/cards/markup)

[meta tags](https://developer.mozilla.org/en/docs/Web/HTML/Element/meta)

### Requirements

This library is meant to be used either in the browser (embedded directly in a website or into a browser addon/extension) or on a server (node.js).

The parser depends only on the [Node URL library](https://nodejs.org/api/url.html) or the [Browser URL library](https://developer.mozilla.org/en-US/docs/Web/API/Document/URL). 

Each function expects to be passed a [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) object, which may be created either directly by a browser or on the server using a [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) compatible object, such as that provided by [domino](https://github.com/fgnass/domino).

## Usage

### Installation

    npm install --save page-metadata-parser

### Usage in the browser

The library can be built to be deployed directly to a modern browser by using

    npm run bundle

and embedding the resultant js file directly into a page like so:

    <script src="page-metadata-parser.bundle.js" type="text/javascript" />

    <script>

      const metadata = metadataparser.getMetadata(window.document, window.location);

      console.log("The page's title is ", metadata.title);

    </script>

### Usage in node

To use the library in node, you must first construct a DOM API compatible object from an HTML string, for example:

    const {getMetadata} = require('page-metadata-parser');
    const domino = require('domino');

    const url = 'https://github.com/mozilla/page-metadata-parser';
    const response = await fetch(url);
    const html = await response.text();
    const doc = domino.createWindow(html).document;
    const metadata = getMetadata(doc, url);

## Metadata Rules

### Rules

A single rule instructs the parser on a possible DOM node to locate a specific piece of content.  

For instance, a rule to parse the title of a page found in a DOM tag like this:

    <meta property="og:title" content="Page Title" />

Would be represented with the following rule:

    ['meta[property="og:title"]', element => element.getAttribute('content')]

A rule consists of two parts, a [query selector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) compatible string which is used to look up the target content, and a callable which receives an [element](https://developer.mozilla.org/en-US/docs/Web/API/Element) and returns the desired content from that element.

Many rules together form a Rule Set.  This library will apply each rule to a page and choose the 'best' result.  The order in which rules are defined indicate their preference, with the first rule being the most preferred.  A Rule Set can be defined like so:

    const titleRules = {
      rules: [
        ['meta[property="og:title"]', node => node.element.getAttribute('content')],
        ['title', node => node.element.text],
      ]
    };

In this case, the OpenGraph title will be preferred over the title tag.

This library includes many rules for a single desired piece of metadata which should allow it to consistently find metadata across many types of pages.  This library is meant to be a community driven effort, and so if there is no rule to find a piece of information from a particular website, contributors are encouraged to add new rules!

### Built-in Rule Sets 

This library provides rule sets to find the following forms of metadata in a page:

Field | Description
--- | ---
description | A user displayable description for the page.
icon | A URL which contains an icon for the page.
image | A URL which contains a preview image for the page.
keywords | The meta keywords for the page.
provider | A string representation of the sub and primary domains.
title | A user displayable title for the page.
type | The type of content as defined by [opengraph](http://ogp.me/#types).
url | A canonical URL for the page.

To use a single rule set to find a particular piece of metadata within a page, simply pass that rule set, a URL,  and a [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) object to getMetadata and it will apply each possible rule for that rule set until it finds a matching piece of information and return it.

Example:

    const {getMetadata, metadataRuleSets} = require('page-metadata-parser');

    const pageTitle = getMetadata(doc, url, {title: metadataRuleSets.title});


### Extending a single rule

To add your own additional custom rule to an existing rule set, you can simply push it into that rule sets's array.

Example:

    const {getMetadata, metadataRuleSets} = require('page-metadata-parser');

    const customDescriptionRuleSet = metadataRuleSets.description;

    customDescriptionRuleSet.rules.push([
      ['meta[name="customDescription"]', element => element.getAttribute('content')]
    ]);

    const pageDescription = getMetadata(doc, url, {description: customDescriptionRuleSet});


### Using all rules

To parse all of the available metadata on a page using all of the rule sets provided in this library, simply call getMetadata on the [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document).

    const {getMetadata, metadataRuleSets} = require('page-metadata-parser');

    const pageMetadata = getMetadata(doc, url);
