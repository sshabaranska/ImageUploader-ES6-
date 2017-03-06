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

var _fileStorage = require("./fileStorage");

var _restService = require("./restService");

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
      /*FR.onload(function(e) {
         let fileStorage = new FileStorage();
        let restService = new RestService();
        app.images.push(e.target.result);
         let valueToSave = app.images.join(',');
         fileStorage.saveImage(valueToSave)
          .then(
            res => restService.post(e.target.result),
            err => console.log('file storage error')
          )
          .then(
            res => {
              app.displayImage(e.target.result);
              document.getElementById('image').value = '';
            },
            err => console.log('file storage error')
          )
      }); */

      FR.readAsDataURL(e.target[0].files[0]);
    }
  },
  displayImage: function displayImage(image) {
    var ul = document.getElementById('imgList');
    var li = document.createElement("LI");
    var img = document.createElement("IMG");
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
                    reject(new Error("Network Error"));
                };
                xhr.send(image);
            });
        }
    }]);

    return RestService;
}();

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvanMvZmlsZVN0b3JhZ2UuanMiLCJ3d3cvanMvaW5kZXguanMiLCJ3d3cvanMvcmVzdFNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7Ozs7Ozs7OztJQUVhLFcsV0FBQSxXO0FBQ1QsMkJBQWM7QUFBQTtBQUNiOzs7O29DQUVXO0FBQ1IsbUJBQU8sSUFBSSxPQUFKLENBQVksVUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCO0FBQ3pDLHVCQUFPLHlCQUFQLEdBQW1DLE9BQU8seUJBQVAsSUFDL0IsT0FBTywrQkFEWDs7QUFHQSx1QkFBTyx5QkFBUCxDQUFpQyxPQUFPLE9BQVAsQ0FBZSxJQUFmLENBQW9CLGFBQXJELEVBQW9FLFVBQVMsR0FBVCxFQUFjOztBQUU5RSx3QkFBSSxPQUFKLENBQVksWUFBWixFQUEwQixFQUFDLFFBQVEsS0FBVCxFQUExQixFQUEyQyxVQUFTLFNBQVQsRUFBb0I7O0FBRTNELGtDQUFVLElBQVYsQ0FBZSxVQUFTLElBQVQsRUFBZTtBQUMxQixnQ0FBSSxTQUFTLElBQUksT0FBTyxVQUFYLEVBQWI7O0FBRUEsbUNBQU8sU0FBUCxHQUFtQixZQUFXO0FBQzFCLHdDQUFRLEtBQUssTUFBYjtBQUNILDZCQUZEOztBQUlBLG1DQUFPLE9BQVAsR0FBaUIsVUFBUyxHQUFULEVBQWM7QUFDM0IsdUNBQU8sR0FBUDtBQUNILDZCQUZEOztBQUlBLG1DQUFPLFVBQVAsQ0FBa0IsSUFBbEI7QUFDSCx5QkFaRCxFQVlHLFVBQVMsR0FBVCxFQUFjO0FBQ2IsbUNBQU8sR0FBUDtBQUNILHlCQWREO0FBZUgscUJBakJELEVBaUJHLFVBQVMsR0FBVCxFQUFjO0FBQ2IsK0JBQU8sR0FBUDtBQUNILHFCQW5CRDtBQW9CSCxpQkF0QkQsRUFzQkcsVUFBUyxHQUFULEVBQWM7QUFDYiwyQkFBTyxHQUFQ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R0E7Ozs7Ozs7Ozs7SUFFYSxXLFdBQUEsVztBQUNULDJCQUFjO0FBQUE7QUFDYjs7Ozs2QkFFSSxLLEVBQU87QUFDUixtQkFBTyxJQUFJLE9BQUosQ0FBWSxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEI7QUFDekMsb0JBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLG9CQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLDRCQUFqQixFQUErQyxJQUEvQztBQUNBLG9CQUFJLGdCQUFKLENBQXFCLGNBQXJCLEVBQXFDLG1DQUFyQzs7QUFFQSxvQkFBSSxNQUFKLEdBQWEsWUFBVztBQUNwQiw0QkFBUSxJQUFJLFFBQVo7QUFDSCxpQkFGRDs7QUFJQSxvQkFBSSxPQUFKLEdBQWMsWUFBVztBQUNyQiwyQkFBTyxJQUFJLEtBQUosQ0FBVSxlQUFWLENBQVA7QUFDSCxpQkFGRDtBQUdBLG9CQUFJLElBQUosQ0FBUyxLQUFUO0FBQ0gsYUFiTSxDQUFQO0FBY0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsZVN0b3JhZ2Uge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgIH1cblxuICAgIGdldEltYWdlcygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwgPSB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCB8fFxuICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMO1xuXG4gICAgICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCh3aW5kb3cuY29yZG92YS5maWxlLmRhdGFEaXJlY3RvcnksIGZ1bmN0aW9uKGRpcikge1xuXG4gICAgICAgICAgICAgICAgZGlyLmdldEZpbGUoJ2ltYWdlcy50eHQnLCB7Y3JlYXRlOiBmYWxzZX0sIGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGZpbGVFbnRyeS5maWxlKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZWFkZXIgPSBuZXcgd2luZG93LkZpbGVSZWFkZXIoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhpcy5yZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzYXZlSW1hZ2UodmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBmdW5jdGlvbiBvbkluaXRGcyhmcykge1xuXG4gICAgICAgICAgICAgICAgZnMuZ2V0RmlsZSgnaW1hZ2VzLnR4dCcsIHtjcmVhdGU6IHRydWV9LCBmdW5jdGlvbihmaWxlRW50cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgRmlsZVdyaXRlciBvYmplY3QgZm9yIEZpbGVFbnRyeS5cbiAgICAgICAgICAgICAgICAgICAgZmlsZUVudHJ5LmNyZWF0ZVdyaXRlcihmdW5jdGlvbihmaWxlV3JpdGVyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVXcml0ZXIub253cml0ZWVuZCA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlV3JpdGVyLm9uZXJyb3IgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBCbG9iIGFuZCB3cml0ZSBpdCB0byBpbWFnZXMudHh0LlxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJsb2IgPSBuZXcgd2luZG93LkJsb2IoW3ZhbHVlXSwge3R5cGU6ICd0ZXh0L3BsYWluJ30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZVdyaXRlci53cml0ZShibG9iKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aW5kb3cucmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTCA9IHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMIHx8XG4gICAgICAgICAgICAgICAgd2luZG93LndlYmtpdFJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkw7XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKHdpbmRvdy5jb3Jkb3ZhLmZpbGUuZGF0YURpcmVjdG9yeSwgb25Jbml0RnMpO1xuICAgICAgICB9KTtcbiAgICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtGaWxlU3RvcmFnZX0gZnJvbSBcIi4vZmlsZVN0b3JhZ2VcIjtcbmltcG9ydCB7UmVzdFNlcnZpY2V9IGZyb20gXCIuL3Jlc3RTZXJ2aWNlXCI7XG5cbnZhciBhcHAgPSB7XG4gICAgaW1hZ2VzOiBbXSxcbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICB0aGlzLmJpbmRFdmVudHMoKTtcbiAgICB9LFxuXG4gICAgYmluZEV2ZW50cygpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLm9uUmVhZHksIGZhbHNlKTtcblxuICAgICAgICB2YXIgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtJyk7XG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5zYXZlSW1hZ2UsIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgb25SZWFkeSgpIHtcbiAgICBcdGxldCBmaWxlU3RvcmFnZSA9IG5ldyBGaWxlU3RvcmFnZSgpO1xuICAgICAgIFx0ZmlsZVN0b3JhZ2UuZ2V0SW1hZ2VzKCkudGhlbihcbiAgICAgICBcdFx0cmVzID0+IHtcbiAgICAgICBcdFx0XHRpZiAocmVzICYmIHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGFwcC5pbWFnZXMgPSByZXMuc3BsaXQoJywnKTtcblxuICAgICAgIFx0XHRcdFx0Zm9yIChsZXQgaW1nIG9mIGFwcC5pbWFnZXMpIHtcbiAgICAgICBcdFx0XHRcdFx0YXBwLmRpc3BsYXlJbWFnZShpbWcpO1xuICAgICAgIFx0XHRcdFx0fVxuICAgICAgIFx0XHRcdH1cbiAgICAgICBcdFx0fSxcbiAgICAgICBcdFx0ZXJyID0+IGNvbnNvbGUubG9nKCdmaWxlIHN0b3JhZ2UgZXJyb3InKVxuICAgICAgIFx0XHQpXG4gICAgfSxcblxuICAgIHNhdmVJbWFnZShlKSB7XG4gICAgICBpZiAoZS50YXJnZXRbMF0uZmlsZXNbMF0pIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWQnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgdmFyIEZSID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgRlIub25sb2FkID0gcmVhZFN1Y2Nlc3M7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gcmVhZFN1Y2Nlc3MoZXZ0KSB7IFxuXG4gICAgICAgICAgbGV0IGZpbGVTdG9yYWdlID0gbmV3IEZpbGVTdG9yYWdlKCk7XG4gICAgICAgICAgbGV0IHJlc3RTZXJ2aWNlID0gbmV3IFJlc3RTZXJ2aWNlKCk7XG4gICAgICAgICAgYXBwLmltYWdlcy5wdXNoKGV2dC50YXJnZXQucmVzdWx0KTtcblxuICAgICAgICAgIGxldCB2YWx1ZVRvU2F2ZSA9IGFwcC5pbWFnZXMuam9pbignLCcpO1xuXG4gICAgICAgICAgZmlsZVN0b3JhZ2Uuc2F2ZUltYWdlKHZhbHVlVG9TYXZlKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgIHJlcyA9PiByZXN0U2VydmljZS5wb3N0KGV2dC50YXJnZXQucmVzdWx0KSxcbiAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKCdmaWxlIHN0b3JhZ2UgZXJyb3InKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgYXBwLmRpc3BsYXlJbWFnZShldnQudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGVyciA9PiBjb25zb2xlLmxvZygnZmlsZSBzdG9yYWdlIGVycm9yJylcbiAgICAgICAgICAgICkgICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICAgICAgLypGUi5vbmxvYWQoZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgbGV0IGZpbGVTdG9yYWdlID0gbmV3IEZpbGVTdG9yYWdlKCk7XG4gICAgICAgICAgbGV0IHJlc3RTZXJ2aWNlID0gbmV3IFJlc3RTZXJ2aWNlKCk7XG4gICAgICAgICAgYXBwLmltYWdlcy5wdXNoKGUudGFyZ2V0LnJlc3VsdCk7XG5cbiAgICAgICAgICBsZXQgdmFsdWVUb1NhdmUgPSBhcHAuaW1hZ2VzLmpvaW4oJywnKTtcblxuICAgICAgICAgIGZpbGVTdG9yYWdlLnNhdmVJbWFnZSh2YWx1ZVRvU2F2ZSlcbiAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICByZXMgPT4gcmVzdFNlcnZpY2UucG9zdChlLnRhcmdldC5yZXN1bHQpLFxuICAgICAgICAgICAgICBlcnIgPT4gY29uc29sZS5sb2coJ2ZpbGUgc3RvcmFnZSBlcnJvcicpXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgcmVzID0+IHtcbiAgICAgICAgICAgICAgICBhcHAuZGlzcGxheUltYWdlKGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlJykudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXJyID0+IGNvbnNvbGUubG9nKCdmaWxlIHN0b3JhZ2UgZXJyb3InKVxuICAgICAgICAgICAgKVxuICAgICAgICB9KTsgKi9cbiAgICAgICAgXG4gICAgICAgIEZSLnJlYWRBc0RhdGFVUkwoIGUudGFyZ2V0WzBdLmZpbGVzWzBdICk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIGRpc3BsYXlJbWFnZShpbWFnZSkge1xuICAgIFx0bGV0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltZ0xpc3QnKTtcbiAgICAgIGxldCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJMSVwiKTtcbiAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiSU1HXCIpO1xuICAgICAgaW1nLnNyYyA9IGltYWdlO1xuICAgICAgbGkuYXBwZW5kQ2hpbGQoaW1nKTtcbiAgICBcdHVsLmFwcGVuZENoaWxkKGxpKTtcbiAgICB9XG59O1xuXG5hcHAuaW5pdGlhbGl6ZSgpOyIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIFJlc3RTZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICB9XG5cbiAgICBwb3N0KGltYWdlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgJ2h0dHA6Ly9wb3N0dGVzdHNlcnZlci5jb20vJywgdHJ1ZSk7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh4aHIucmVzcG9uc2UpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFwiTmV0d29yayBFcnJvclwiKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgeGhyLnNlbmQoaW1hZ2UpO1xuICAgICAgICB9KTtcbiAgICB9XG59Il19
