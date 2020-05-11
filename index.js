const fs = require('fs'),
    path = require('path');

var _     = require('lodash'),
    parse = require('xml2js').parseString,
    yauzl = require('yauzl');

function fromBufferToFile(buffer, savePath, cb) {

    if (buffer && buffer instanceof Buffer && typeof savePath === 'string' && typeof cb === 'function') {

        yauzl.fromBuffer(buffer, {lazyEntries: true}, function(err, zipfile) {

            if (err) return cb(err, null);

            readEntriesForOPF(zipfile, function(err, coverPath) {

                if (err) return cb(err, null);

                yauzl.fromBuffer(buffer, {lazyEntries: true}, function(err, zipfile) {

                    if (err) return cb(err, null);

                    extractCoverToFile(zipfile, coverPath, savePath, cb);

                });

            });

        });

    } else {

        if( typeof cb === 'function' ) {
            cb( new Error('Incorrect parameters.'), null);
        } else {
            console.error('Incorrect parameters.');
        }

    }

}

function fromBufferToBuffer(buffer, cb) {

    if (buffer && buffer instanceof Buffer && typeof cb === 'function') {

        yauzl.fromBuffer(buffer, {lazyEntries: true}, function(err, zipfile) {

            if (err) return cb(err, null, null);

            readEntriesForOPF(zipfile, function(err, coverPath) {

                if (err) return cb(err, null, null);

                yauzl.fromBuffer(buffer, {lazyEntries: true}, function(err, zipfile) {

                    if (err) return cb(err, null, null);

                    extractCoverToBuffer(zipfile, coverPath, cb);

                });

            });

        });

    } else {

        if( typeof cb === 'function' ) {
            cb( new Error('Incorrect parameters.'), null);
        } else {
            console.error('Incorrect parameters.');
        }

    }

}

function fromFilePath(filePath, savePath, cb) {

    if (typeof filePath === 'string' && typeof savePath === 'string' && typeof cb === 'function') {

        yauzl.open(filePath, {lazyEntries: true}, function(err, zipfile) {

            if (err) return cb(err, null);

            readEntriesForOPF(zipfile, function(err, coverPath) {

                if (err) return cb(err, null);

                yauzl.open(filePath, {lazyEntries: true}, function(err, zipfile) {

                    if (err) return cb(err, null);

                    extractCoverToFile(zipfile, coverPath, savePath, cb);

                });

            });

        });

    } else {

        if( typeof cb === 'function' ) {
            cb( new Error('Incorrect parameters.'), null);
        } else {
            console.error('Incorrect parameters.');
        }

    }

}

function extractCoverToFile(zipfile, coverPath, savePath, cb) {
    zipfile.readEntry();

    zipfile.on('end', function() {
        cb( new Error('Cover image not found.'), null);
    });

    zipfile.on('entry', function(entry) {

        if (entry.fileName.match(coverPath)) {

            zipfile.openReadStream(entry, function(err, readStream) {

                var writePath   = path.join(savePath, path.basename(coverPath));
                var writeStream = fs.createWriteStream(writePath);

                readStream.on('end', function() {

                    cb(null, writePath);

                    zipfile.close();

                });

                readStream.pipe(writeStream);

            });

        } else {
            zipfile.readEntry();
        }

    });
}

function extractCoverToBuffer(zipfile, coverPath, cb) {

    zipfile.readEntry();

    zipfile.on('end', function() {
        cb( new Error('Cover image not found.'), null);
    });

    zipfile.on('entry', function(entry) {

        if (entry.fileName.match(coverPath)) {

            zipfile.openReadStream(entry, function(err, readStream) {


                var buffers =[];

                readStream.on("data", function(data) {
                    buffers.push(data);
                });

                readStream.on('end', function() {
                    var content = buffers.concat();
                    cb(null, concat, path.basename(coverPath));

                    zipfile.close();

                });

            });

        } else {
            zipfile.readEntry();
        }

    });

}

function readEntriesForOPF(zipfile, cb) {

    zipfile.readEntry();

    zipfile.on('end', function() {
        cb( new Error('Unable to locate Open Packaging Format (OPF) file.'), null);
    });

    zipfile.on('entry', function(entry) {

        if (entry.fileName.match(/\.opf$/i)) {

            readEntryStreamForOPF(zipfile, entry, function(err, data) {

                var cover,
                    coverPath,
                    manifest,
                    manifestPath = ["package","manifest", 0, "item"],
                    metadata,
                    metadataPath = ["package","metadata", 0, "meta"];

                if (_.has(data, metadataPath)) {

                    metadata = _.get(data, metadataPath);
                    metadata.forEach(function(element) {
                        if (element['$'].name === "cover") cover = element['$'].content;
                    });

                }

                if (_.has(data, manifestPath) && cover !== undefined) {

                    manifest = _.get(data, manifestPath);
                    manifest.forEach(function(element) {
                        if (element['$'].id === cover) coverPath = element['$'].href;
                    });

                    if (coverPath !== undefined) {
                        coverPath = `${entry.fileName.split("/").slice(0,-1).join("/")}/${coverPath}`;
                    }

                }

                zipfile.close();

                if (coverPath !== undefined) {
                    cb(null, coverPath);
                } else {
                    cb( new Error('Cover image metadata not found.'), null);
                }

            });

        } else {
            zipfile.readEntry();
        }

    });

}

function readEntryStreamForOPF(zipfile, entry, cb) {

    zipfile.openReadStream(entry, function(err, readStream) {

        var data = '';

        if (err) return cb(err, null);

        readStream.on('data', function(chunk) {
            data += chunk;
        });

        readStream.on('end', function() {

            parse(data, function(err, result) {

                if (err) return cb(err, null);

                cb(null, result);

            });

        });

    });

}

module.exports = {
    fromBuffertoFile: fromBufferToFile,
    fromBufferToBuffer: fromBufferToBuffer,
    fromFilePath: fromFilePath
}
