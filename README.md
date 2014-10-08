# micro-template loader for webpack
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/sirlancelot/micro-template-loader?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
