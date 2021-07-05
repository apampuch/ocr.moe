// get size of image area select elementFromPoint
var canvasWidth = document.getElementById("image-area-select").width
var canvasHeight = document.getElementById("image-area-select").height

// draw a line on the canvas
var c = document.getElementById("image-area-select");
var ctx = c.getContext("2d");

ctx.moveTo(0,0);
ctx.lineTo(200,200);
ctx.stroke();

function loadImage() {
    ctx.clearRect(0, 0, c.width, c.height);
    
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
            
            ctx.drawImage(img, 0, pad, canvasWidth, gappedEdge);
        } else {
            var divisor = img.height / canvasHeight;
            var gappedEdge = img.width / divisor;
            
            // center the image
            var pad = (canvasWidth - gappedEdge) / 2
            
            ctx.drawImage(img, pad, 0, gappedEdge, canvasHeight);
        }        
    }
    
    img.src = URL.createObjectURL(file)
}

