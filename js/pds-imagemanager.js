this.pds = this.pds || {};

(function (window) {
    var imageManager = function (imageData) {
        this.initialize(imageData);
    };

    var p = imageManager.prototype;

    p.initialize = function (imageData) {
        this.imageData = imageData;
    };

    p.getImage = function (key) {
        var imgElement = null;
        if (this.imageData != undefined && this.imageData != null) {
            for (var i = 0; i < this.imageData.length; i++) {
                if (this.imageData[i].id == key) {
                    imgElement = document.createElement("img");
                    if (imageData[i].url != undefined) {
                        imgElement.src = imageData[i].url;
                    } else {
                        imgElement.src = imageData[i].src;
                    }
                    imgElement.height = imageData[i].height;
                    imgElement.width = imageData[i].width;
                    break;
                }
            }
        }
        return imgElement;
    };

    pds.ImageManager = imageManager;
} (window));

imageData = [];
$(document).ready(function() {
    ImageManager = new pds.ImageManager(imageData);
});