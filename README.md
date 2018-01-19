# epub-cover-extractor

Use this node module to extract cover images from ePub documents.

[![npm](https://img.shields.io/npm/v/epub-cover-extractor.svg?style=flat-square)](https://www.npmjs.com/package/epub-cover-extractor)

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
