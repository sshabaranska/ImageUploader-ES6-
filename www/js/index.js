'use strict';

import {FileStorage} from './fileStorage';
import {RestService} from './restService';

var app = {
    images: [],
    initialize() {
        this.bindEvents();
    },

    bindEvents() {
        window.addEventListener('load', this.onReady, false);

        var form = document.getElementById('form');
        form.addEventListener('submit', this.saveImage, false);
    },

    onReady() {
    	let fileStorage = new FileStorage();
     	fileStorage.getImages().then(
     		res => {
     			if (res && res.length > 0) {
                    app.images = res.split(',');

     				for (let img of app.images) {
     					app.displayImage(img);
     				}
     			}
     		},
     		err => console.log('file storage error')
     		)
    },

    saveImage(e) {
        if (e.target[0].files[0]) {
            document.getElementById('load').style.display = 'block';
            
            var FR = new FileReader();
            FR.onload = readSuccess;                                            
            
            function readSuccess(evt) { 
            let fileStorage = new FileStorage();
            let restService = new RestService();
            app.images.push(evt.target.result);

            let valueToSave = app.images.join(',');

            fileStorage.saveImage(valueToSave)
                .then(
                    res => restService.post(evt.target.result),
                    err => console.log('file storage error')
                )
                .then(
                    res => {
                        app.displayImage(evt.target.result);
                        document.getElementById('image').value = '';
                        document.getElementById('load').style.display = 'none';
                    },
                    err => console.log('file storage error')
                )            
            };

            FR.readAsDataURL( e.target[0].files[0] );
        }
    },

    displayImage(image) {
    	let ul = document.getElementById('imgList');
        let li = document.createElement('LI');
        let img = document.createElement('IMG');
        img.src = image;
        li.appendChild(img);
        ul.appendChild(li);
    }
};

app.initialize();