<h3 align="center">epub-cover-extractor</h3>

<p align="center">Extract cover images from ePub documents.</p>

<p align="center">
  <a href="https://badge.fury.io/js/epub-cover-extracgtor">
    <img src="https://badge.fury.io/js/epub-cover-extracgtor.svg" alt="npm version badge">
  </a>
</p>

## Installation

To install via npm:

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
