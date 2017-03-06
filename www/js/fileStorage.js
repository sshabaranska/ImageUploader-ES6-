'use strict';

export class FileStorage {
    constructor() {
    }

    getImages() {
        return new Promise(function(resolve, reject) {
            window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL ||
                window.webkitResolveLocalFileSystemURL;

            window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, function(dir) {

                dir.getFile('images.txt', {create: false}, function(fileEntry) {

                    fileEntry.file(function(file) {
                        var reader = new window.FileReader();

                        reader.onloadend = function() {
                            resolve(this.result);
                        };

                        reader.onerror = function(err) {
                            reject(err);
                        };

                        reader.readAsText(file);
                    }, function(err) {
                        reject(err);
                    });
                }, function(err) {
                    reject(err);
                });
            }, function(err) {
                reject(err);
            });
        });
    }

    saveImage(value) {

        return new Promise(function(resolve, reject) {
            function onInitFs(fs) {

                fs.getFile('images.txt', {create: true}, function(fileEntry) {
                    // Create a FileWriter object for FileEntry.
                    fileEntry.createWriter(function(fileWriter) {

                        fileWriter.onwriteend = function(response) {
                            resolve(response);
                        };

                        fileWriter.onerror = function(err) {
                            reject(err);
                        };

                        // Create a new Blob and write it to images.txt.
                        var blob = new window.Blob([value], {type: 'text/plain'});
                        fileWriter.write(blob);
                    }, function(err) {
                        reject(err);
                    });
                }, function(err) {
                    reject(err);
                });
            }

            window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL ||
                window.webkitResolveLocalFileSystemURL;

            window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, onInitFs);
        });
    }
};