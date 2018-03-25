# epub-cover-extractor

[![npm](https://img.shields.io/npm/v/office-document-properties.svg?style=flat)](https://www.npmjs.com/package/epub-cover-extractor)
[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/swestmoreland/epub-cover-extractor/blob/master/LICENSE)
[![GitHub](https://img.shields.io/github/stars/swestmoreland/office-document-properties.svg?style=social&logo=github&label=Stars)](https://github.com/swestmoreland/epub-cover-extractor/)
[![Twitter](https://img.shields.io/twitter/follow/swestmoreland.svg?style=social&logo=twitter&label=Follow)](https://twitter.com/intent/follow?screen_name=swestmoreland)

Use this node module to extract cover images from ePub documents.

## Installation

```sh
npm install epub-cover-extractor
```

## Usage

### Import

```js
var extractCover = require('epub-cover-extractor');
```

### Extract Cover Image from File

```js
extractCover.fromFilePath(filePath, './', function(err, filePath){
  if (err) throw err;
  console.log(filePath);
  /*
  cover-image-filename.jpg
  */
});
```

### Extract Cover Image from Buffer

```js
extractCover.fromBuffer(buffer, './', function(err, filePath){
  if (err) throw err;
  console.log(filePath);
  /*
  cover-image-filename.jpg
  */
});
```
