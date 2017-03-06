'use strict';

export class RestService {
    constructor() {
    }

    post(image) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://posttestserver.com/', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            xhr.onload = function() {
                resolve(xhr.response);
            };

            xhr.onerror = function() {
                reject(new Error("Network Error"));
            };
            xhr.send(image);
        });
    }
}