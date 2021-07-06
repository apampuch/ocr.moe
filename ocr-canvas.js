class Point {
    constructor (x,y) {
        this.x = x;
        this.y = y;
    }
}

// draw a line on the canvas
var imageCanvas = document.getElementById("image-layer");
var imageCtx = imageCanvas.getContext("2d");

// draw a line on the canvas
var cropCanvas = document.getElementById("crop-layer");
var cropCtx = cropCanvas.getContext("2d");

// get size of image area select elementFromPoint
// both canvases should be EXACTLY the same size
var canvasWidth = imageCanvas.width;
var canvasHeight = imageCanvas.height;

imageCtx.strokeStyle = "#0000FF";
imageCtx.moveTo(0,0);
imageCtx.lineTo(canvasWidth,canvasHeight);
imageCtx.stroke();

cropCtx.strokeStyle = "#FF0000";
cropCtx.moveTo(canvasWidth,0);
cropCtx.lineTo(0,canvasHeight);
cropCtx.stroke();

cropCanvas.onclick = cropClick

// setup points for crop
var topLeft     = new Point(0,0)
var bottomLeft  = new Point(0,canvasHeight)
var topRight    = new Point(canvasWidth,0)
var bottomRight = new Point(canvasWidth,canvasHeight)


function loadImage() {
    imageCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    
    // get the image from the upload
    var file = document.getElementById("file-input").files[0]
    
    var img = new Image;
    img.onload = function() {
      // scale the image and maintain aspect ratio
        
        if (img.width > img.height) {            
            var divisor = img.width / canvasWidth;
            var gappedEdge = img.height / divisor;
            
            // center the image
            var pad = (canvasHeight - gappedEdge) / 2
            
            imageCtx.drawImage(img, 0, pad, canvasWidth, gappedEdge);
        } else {
            var divisor = img.height / canvasHeight;
            var gappedEdge = img.width / divisor;
            
            // center the image
            var pad = (canvasWidth - gappedEdge) / 2
            
            imageCtx.drawImage(img, pad, 0, gappedEdge, canvasHeight);
        }        
    }
    
    img.src = URL.createObjectURL(file)
}

function cropClick(event) {
    alert("Crop clicked.");
}
