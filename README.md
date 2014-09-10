# micro-template loader for webpack

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
