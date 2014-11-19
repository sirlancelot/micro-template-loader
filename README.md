# micro-template loader [![](http://img.shields.io/npm/v/micro-template-loader.svg?style=flat-square)][npm]

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

### Simple API

``` javascript
require("micro-template!./file.html");
```

## Recommended configuration

You should be able to safely pass all your HTML files through micro-template
even if your templates don't have any `<% %>` tags.

``` javascript
{
  module: {
    loaders: [
      { test: /\.html$/, loader: "micro-template" }
    ]
  }
}
```

  [npm]: https://www.npmjs.org/package/micro-template-loader
