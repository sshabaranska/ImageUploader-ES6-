(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FileStorage = exports.FileStorage = function () {
    function FileStorage() {
        _classCallCheck(this, FileStorage);
    }

    _createClass(FileStorage, [{
        key: 'getImages',
        value: function getImages() {
            return new Promise(function (resolve, reject) {
                window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;

                window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, function (dir) {

                    dir.getFile('images.txt', { create: false }, function (fileEntry) {

                        fileEntry.file(function (file) {
                            var reader = new window.FileReader();

                            reader.onloadend = function () {
                                resolve(this.result);
                            };

                            reader.onerror = function (err) {
                                reject(err);
                            };

                            reader.readAsText(file);
                        }, function (err) {
                            reject(err);
                        });
                    }, function (err) {
                        reject(err);
                    });
                }, function (err) {
                    reject(err);
                });
            });
        }
    }, {
        key: 'saveImage',
        value: function saveImage(value) {

            return new Promise(function (resolve, reject) {
                function onInitFs(fs) {

                    fs.getFile('images.txt', { create: true }, function (fileEntry) {
                        // Create a FileWriter object for FileEntry.
                        fileEntry.createWriter(function (fileWriter) {

                            fileWriter.onwriteend = function (response) {
                                resolve(response);
                            };

                            fileWriter.onerror = function (err) {
                                reject(err);
                            };

                            // Create a new Blob and write it to images.txt.
                            var blob = new window.Blob([value], { type: 'text/plain' });
                            fileWriter.write(blob);
                        }, function (err) {
                            reject(err);
                        });
                    }, function (err) {
                        reject(err);
                    });
                }

                window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;

                window.resolveLocalFileSystemURL(window.cordova.file.dataDirectory, onInitFs);
            });
        }
    }]);

    return FileStorage;
}();

;

},{}],2:[function(require,module,exports){
'use strict';

var _fileStorage = require('./fileStorage');

var _restService = require('./restService');

var app = {
    images: [],
    initialize: function initialize() {
        this.bindEvents();
    },
    bindEvents: function bindEvents() {
        window.addEventListener('load', this.onReady, false);

        var form = document.getElementById('form');
        form.addEventListener('submit', this.saveImage, false);
    },
    onReady: function onReady() {
        var fileStorage = new _fileStorage.FileStorage();
        fileStorage.getImages().then(function (res) {
            if (res && res.length > 0) {
                app.images = res.split(',');

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = app.images[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var img = _step.value;

                        app.displayImage(img);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }, function (err) {
            return console.log('file storage error');
        });
    },
    saveImage: function saveImage(e) {
        if (e.target[0].files[0]) {
            var readSuccess = function readSuccess(evt) {
                var fileStorage = new _fileStorage.FileStorage();
                var restService = new _restService.RestService();
                app.images.push(evt.target.result);

                var valueToSave = app.images.join(',');

                fileStorage.saveImage(valueToSave).then(function (res) {
                    return restService.post(evt.target.result);
                }, function (err) {
                    return console.log('file storage error');
                }).then(function (res) {
                    app.displayImage(evt.target.result);
                    document.getElementById('image').value = '';
                    document.getElementById('load').style.display = 'none';
                }, function (err) {
                    return console.log('file storage error');
                });
            };

            document.getElementById('load').style.display = 'block';

            var FR = new FileReader();
            FR.onload = readSuccess;

            ;

            FR.readAsDataURL(e.target[0].files[0]);
        }
    },
    displayImage: function displayImage(image) {
        var ul = document.getElementById('imgList');
        var li = document.createElement('LI');
        var img = document.createElement('IMG');
        img.src = image;
        li.appendChild(img);
        ul.appendChild(li);
    }
};

app.initialize();

},{"./fileStorage":1,"./restService":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RestService = exports.RestService = function () {
    function RestService() {
        _classCallCheck(this, RestService);
    }

    _createClass(RestService, [{
        key: 'post',
        value: function post(image) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'http://posttestserver.com/', true);
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

                xhr.onload = function () {
                    resolve(xhr.response);
                };

                xhr.onerror = function () {
                    reject(new Error('Network Error'));
                };
                xhr.send(image);
            });
        }
    }]);

    return RestService;
}();

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvanMvZmlsZVN0b3JhZ2UuanMiLCJ3d3cvanMvaW5kZXguanMiLCJ3d3cvanMvcmVzdFNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7OztJQUVhLFcsV0FBQSxXO0FBQ1QsMkJBQWM7QUFBQTtBQUNiOzs7O29DQUVXO0FBQ1IsbUJBQU8sSUFBSSxPQUFKLENBQVksVUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCO0FBQ3pDLHVCQUFPLHlCQUFQLEdBQW1DLE9BQU8seUJBQVAsSUFDL0IsT0FBTywrQkFEWDs7QUFHQSx1QkFBTyx5QkFBUCxDQUFpQyxPQUFPLE9BQVAsQ0FBZSxJQUFmLENBQW9CLGFBQXJELEVBQW9FLFVBQVMsR0FBVCxFQUFjOztBQUU5RSx3QkFBSSxPQUFKLENBQVksWUFBWixFQUEwQixFQUFDLFFBQVEsS0FBVCxFQUExQixFQUEyQyxVQUFTLFNBQVQsRUFBb0I7O0FBRTNELGtDQUFVLElBQVYsQ0FBZSxVQUFTLElBQVQsRUFBZTtBQUMxQixnQ0FBSSxTQUFTLElBQUksT0FBTyxVQUFYLEVBQWI7O0FBRUEsbUNBQU8sU0FBUCxHQUFtQixZQUFXO0FBQzFCLHdDQUFRLEtBQUssTUFBYjtBQUNILDZCQUZEOztBQUlBLG1DQUFPLE9BQVAsR0FBaUIsVUFBUyxHQUFULEVBQWM7QUFDM0IsdUNBQU8sR0FBUDtBQUNILDZCQUZEOztBQUlBLG1DQUFPLFVBQVAsQ0FBa0IsSUFBbEI7QUFDSCx5QkFaRCxFQVlHLFVBQVMsR0FBVCxFQUFjO0FBQ2IsbUNBQU8sR0FBUDtBQUNILHlCQWREO0FBZUgscUJBakJELEVBaUJHLFVBQVMsR0FBVCxFQUFjO0FBQ2IsK0JBQU8sR0FBUDtBQUNILHFCQW5CRDtBQW9CSCxpQkF0QkQsRUFzQkcsVUFBUyxHQUFULEVBQWM7QUFDYiwyQkFBTyxHQUFQ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Ozs7O0lBRWEsVyxXQUFBLFc7QUFDVCwyQkFBYztBQUFBO0FBQ2I7Ozs7NkJBRUksSyxFQUFPO0FBQ1IsbUJBQU8sSUFBSSxPQUFKLENBQVksVUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCO0FBQ3pDLG9CQUFJLE1BQU0sSUFBSSxjQUFKLEVBQVY7QUFDQSxvQkFBSSxJQUFKLENBQVMsTUFBVCxFQUFpQiw0QkFBakIsRUFBK0MsSUFBL0M7QUFDQSxvQkFBSSxnQkFBSixDQUFxQixjQUFyQixFQUFxQyxtQ0FBckM7O0FBRUEsb0JBQUksTUFBSixHQUFhLFlBQVc7QUFDcEIsNEJBQVEsSUFBSSxRQUFaO0FBQ0gsaUJBRkQ7O0FBSUEsb0JBQUksT0FBSixHQUFjLFlBQVc7QUFDckIsMkJBQU8sSUFBSSxLQUFKLENBQVUsZUFBVixDQUFQO0FBQ0gsaUJBRkQ7QUFHQSxvQkFBSSxJQUFKLENBQVMsS0FBVDtBQUNILGFBYk0sQ0FBUDtBQWNIIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbGVTdG9yYWdlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBnZXRJbWFnZXMoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMID0gd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgfHxcbiAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTDtcblxuICAgICAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwod2luZG93LmNvcmRvdmEuZmlsZS5kYXRhRGlyZWN0b3J5LCBmdW5jdGlvbihkaXIpIHtcblxuICAgICAgICAgICAgICAgIGRpci5nZXRGaWxlKCdpbWFnZXMudHh0Jywge2NyZWF0ZTogZmFsc2V9LCBmdW5jdGlvbihmaWxlRW50cnkpIHtcblxuICAgICAgICAgICAgICAgICAgICBmaWxlRW50cnkuZmlsZShmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVhZGVyID0gbmV3IHdpbmRvdy5GaWxlUmVhZGVyKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRoaXMucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2F2ZUltYWdlKHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgZnVuY3Rpb24gb25Jbml0RnMoZnMpIHtcblxuICAgICAgICAgICAgICAgIGZzLmdldEZpbGUoJ2ltYWdlcy50eHQnLCB7Y3JlYXRlOiB0cnVlfSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIEZpbGVXcml0ZXIgb2JqZWN0IGZvciBGaWxlRW50cnkuXG4gICAgICAgICAgICAgICAgICAgIGZpbGVFbnRyeS5jcmVhdGVXcml0ZXIoZnVuY3Rpb24oZmlsZVdyaXRlcikge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlV3JpdGVyLm9ud3JpdGVlbmQgPSBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVdyaXRlci5vbmVycm9yID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgQmxvYiBhbmQgd3JpdGUgaXQgdG8gaW1hZ2VzLnR4dC5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBibG9iID0gbmV3IHdpbmRvdy5CbG9iKFt2YWx1ZV0sIHt0eXBlOiAndGV4dC9wbGFpbid9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVXcml0ZXIud3JpdGUoYmxvYik7XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgPSB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMO1xuXG4gICAgICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCh3aW5kb3cuY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIG9uSW5pdEZzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7RmlsZVN0b3JhZ2V9IGZyb20gJy4vZmlsZVN0b3JhZ2UnO1xuaW1wb3J0IHtSZXN0U2VydmljZX0gZnJvbSAnLi9yZXN0U2VydmljZSc7XG5cbnZhciBhcHAgPSB7XG4gICAgaW1hZ2VzOiBbXSxcbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9LFxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLm9uUmVhZHksIGZhbHNlKTtcblxuICAgICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtJyk7XG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5zYXZlSW1hZ2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgb25SZWFkeSgpIHtcbiAgICBcdGxldCBmaWxlU3RvcmFnZSA9IG5ldyBGaWxlU3RvcmFnZSgpO1xuICAgICBcdGZpbGVTdG9yYWdlLmdldEltYWdlcygpLnRoZW4oXG4gICAgIFx0XHRyZXMgPT4ge1xuICAgICBcdFx0XHRpZiAocmVzICYmIHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5pbWFnZXMgPSByZXMuc3BsaXQoJywnKTtcblxuICAgICBcdFx0XHRcdGZvciAobGV0IGltZyBvZiBhcHAuaW1hZ2VzKSB7XG4gICAgIFx0XHRcdFx0XHRhcHAuZGlzcGxheUltYWdlKGltZyk7XG4gICAgIFx0XHRcdFx0fVxuICAgICBcdFx0XHR9XG4gICAgIFx0XHR9LFxuICAgICBcdFx0ZXJyID0+IGNvbnNvbGUubG9nKCdmaWxlIHN0b3JhZ2UgZXJyb3InKVxuICAgICBcdFx0KVxuICAgIH0sXG5cbiAgICBzYXZlSW1hZ2UoZSkge1xuICAgICAgICBpZiAoZS50YXJnZXRbMF0uZmlsZXNbMF0pIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBGUiA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgICBGUi5vbmxvYWQgPSByZWFkU3VjY2VzczsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmdW5jdGlvbiByZWFkU3VjY2VzcyhldnQpIHsgXG4gICAgICAgICAgICBsZXQgZmlsZVN0b3JhZ2UgPSBuZXcgRmlsZVN0b3JhZ2UoKTtcbiAgICAgICAgICAgIGxldCByZXN0U2VydmljZSA9IG5ldyBSZXN0U2VydmljZSgpO1xuICAgICAgICAgICAgYXBwLmltYWdlcy5wdXNoKGV2dC50YXJnZXQucmVzdWx0KTtcblxuICAgICAgICAgICAgbGV0IHZhbHVlVG9TYXZlID0gYXBwLmltYWdlcy5qb2luKCcsJyk7XG5cbiAgICAgICAgICAgIGZpbGVTdG9yYWdlLnNhdmVJbWFnZSh2YWx1ZVRvU2F2ZSlcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgICAgcmVzID0+IHJlc3RTZXJ2aWNlLnBvc3QoZXZ0LnRhcmdldC5yZXN1bHQpLFxuICAgICAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coJ2ZpbGUgc3RvcmFnZSBlcnJvcicpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICByZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLmRpc3BsYXlJbWFnZShldnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1hZ2UnKS52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWQnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coJ2ZpbGUgc3RvcmFnZSBlcnJvcicpXG4gICAgICAgICAgICAgICAgKSAgICAgICAgICAgIFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgRlIucmVhZEFzRGF0YVVSTCggZS50YXJnZXRbMF0uZmlsZXNbMF0gKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBkaXNwbGF5SW1hZ2UoaW1hZ2UpIHtcbiAgICBcdGxldCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWdMaXN0Jyk7XG4gICAgICAgIGxldCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0xJJyk7XG4gICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdJTUcnKTtcbiAgICAgICAgaW1nLnNyYyA9IGltYWdlO1xuICAgICAgICBsaS5hcHBlbmRDaGlsZChpbWcpO1xuICAgICAgICB1bC5hcHBlbmRDaGlsZChsaSk7XG4gICAgfVxufTtcblxuYXBwLmluaXRpYWxpemUoKTsiLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBSZXN0U2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgfVxuXG4gICAgcG9zdChpbWFnZSkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICB4aHIub3BlbignUE9TVCcsICdodHRwOi8vcG9zdHRlc3RzZXJ2ZXIuY29tLycsIHRydWUpO1xuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcblxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcignTmV0d29yayBFcnJvcicpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIuc2VuZChpbWFnZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=
