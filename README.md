# Page Metadata Parser
A Javascript library for parsing metadata in web pages.

[![CircleCI](https://circleci.com/gh/mozilla/page-metadata-parser.svg?style=svg)](https://circleci.com/gh/mozilla/page-metadata-parser)

[![Coverage Status](https://coveralls.io/repos/github/mozilla/page-metadata-parser/badge.svg?branch=master)](https://coveralls.io/github/mozilla/page-metadata-parser?branch=master)


## Installation

    npm install --save page-metadata-parser

## Overview

### Requirements

This library is meant to be used either in the browser (embedded directly in a website or into a browser addon/extension) or on a server (node.js).

Each function expects to be passed a [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) object, which may be created either directly by a browser or on the server using a [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) compatible object, such as that provided by [jsdom](https://github.com/tmpvar/jsdom).

You may use each rule individually, or together to parse all of the metadata provided by this library.

### Supported schemas

This library employs parsers for the following formats:

[opengraph](http://ogp.me/)

[twitter](https://dev.twitter.com/cards/markup)

[meta tags](https://developer.mozilla.org/en/docs/Web/HTML/Element/meta)

### Rules

This library is based on the work of [Mozilla Fathom](https://github.com/mozilla/fathom), a framework for using rules to parse content on web pages.

A single rule instructs the parser on a possible DOM node to locate a specific piece of content.  For instance, a rule to parse the title of a page might look like

     ['meta[property="og:title"]', node => node.element.content]

A rule consists of two parts, a [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) compatible string which is used to look up the target content, and a callable which receives a Node (a wrapper around a DOM element) and returns the desired content from that Node.

This rule would be able to successfully find a page's title from the following HTML sample:

    <meta property="og:title" content="A Sample Page" />

This library includes many rules for a single desired piece of metadata which should allow it to consistently find metadata across many types of pages.  This library is meant to be a community driven effort, and so if there is no rule to find a piece of information from a particular website, contributors are encouraged to add new rules!

## Usage

### Using a single rule

This library provides rules to find the following forms of metadata in a page:

Field | Description
--- | ---
type | The type of content as defined by [opengraph](http://ogp.me/#types).
url | A canonical URL for the page.
title | A user displayable title for the page.
description | A user displayable description for the page.
icon_url | A URL which contains an icon for the page.
image_url | A URL which contains a preview image for the page.
keywords | The meta keywords for the page.

To use a single rule to find a particular piece of metadata within a page, simply pass that rule  and a [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document) object to getMetadata and it will apply each possible selector for that rule until it finds a matching piece of information and return it.

Example:

    const {getMetadata, metadataRules} = require('page-metadata-parser');

    const pageTitle = getMetadata(doc, {title: metadataRules.title});


### Extending a single rule

To add your own additional custom parser to an existing rule, you can simply push it into that rule's array.

Example:


    const {getMetadata, metadataRules} = require('page-metadata-parser');

    const customDescriptionRules = metadataRules.description;

    customDescriptionRules.push([
      ['meta[name="customDescription"]', node => node.element.content]
    ]);

    const pageDescription = getMetadata(doc, {description: customDescriptionRules});


### Using all rules

To parse all of the available metadata on a page using all of the rules provided in this library, simply call getMetadata on the [Document](https://developer.mozilla.org/en-US/docs/Web/API/Document).

    const {getMetadata, metadataRules} = require('page-metadata-parser');

    const pageMetadata = getMetadata(doc, metadataRules);


### Nesting rules

You can nest rules into arbitrarily deep object structures which will mirror the structure of the returned metadata payload.

Example:

    const {getMetadata, metadataRules} = require('page-metadata-parser');

    const nestedMetadataRules = {
      images: {
        preview: metadataRules.image_url,
        icon: metadataRules.icon_url,
      },
      text: {
        title: metadataRules.title,
        description: metadataRules.description,
      }
    };

    const nestedMetadata = getMetadata(doc, nestedMetadataRules); 
