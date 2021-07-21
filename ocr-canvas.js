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
cropCtx.strokeRect(0,0, canvasWidth, canvasHeight);
cropCtx.stroke();

var dragging = undefined;

cropCanvas.addEventListener('mousedown', cropMouseDown);
cropCanvas.addEventListener('mousemove', cropMouseMove);
cropCanvas.addEventListener('mouseup', cropMouseUp);

// setup points for crop
var topLeft     = new Point(0,0);
var bottomLeft  = new Point(0,canvasHeight);
var topRight    = new Point(canvasWidth,0);
var bottomRight = new Point(canvasWidth,canvasHeight);

// list of points
var points = [topLeft, topRight, bottomLeft, bottomRight];
// dict of points and the other point they should move when their X or Y is moved
var adjacentPoints = [[bottomLeft, topRight], [bottomRight, topLeft], [topLeft, bottomRight], [topRight, bottomLeft]]


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
            var pad = (canvasHeight - gappedEdge) / 2;
            
            imageCtx.drawImage(img, 0, pad, canvasWidth, gappedEdge);
        } else {
            var divisor = img.height / canvasHeight;
            var gappedEdge = img.width / divisor;
            
            // center the image
            var pad = (canvasWidth - gappedEdge) / 2;
            
            imageCtx.drawImage(img, pad, 0, gappedEdge, canvasHeight);
        }        
    }
    
    img.src = URL.createObjectURL(file);
}

function cropMouseDown(event) {
    // check if we're clicking near a point
    const POINT_RADIUS = 20;
    
    var x = event.clientX - cropCanvas.getBoundingClientRect().left;
    var y = event.clientY - cropCanvas.getBoundingClientRect().top;
    
    
    for (let i=0; i<points.length; i++) {
        // get distance
        var d = distance(x, y, points[i].x, points[i].y);
        
        //console.log(`$point index:${i}\nhandle pos: (${points[i].x}, ${points[i].y})\nclick pos: (${x}, ${y})\ndistance: ${d}`)
        
        // if distance is within POINT_RADIUS of the point
        // grab it
        if (d <= POINT_RADIUS) {
            dragging = i;
        }
    }
}

function cropMouseMove(event) {
    if (dragging != undefined) {
        // get click point
        var x = event.clientX - cropCanvas.getBoundingClientRect().left;
        var y = event.clientY - cropCanvas.getBoundingClientRect().top;
        
        // get the point we're dragging
        drag_point = points[dragging];
        
        // update point we're dragging
        drag_point.x = x;
        drag_point.y = y;
        
        // update adjacent points
        adjacentPoints[dragging][0].x = x;
        adjacentPoints[dragging][1].y = y;
        
        cropCtx.clearRect(0,0,canvasWidth,canvasHeight);
        cropCtx.beginPath();
        cropCtx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    }
}

function cropMouseUp(event) {
    dragging = undefined;
}

function distance(x1,y1,x2,y2) {
    return Math.sqrt(Math.abs((x2-x1)**2 + (y2-y1)**2));
}

