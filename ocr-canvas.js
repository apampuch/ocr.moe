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

var dragging = undefined; // the point or edge (array of two points) we're dragging
var draggingDir = undefined; // used only for dragging edges
var draggingType = undefined; // dragging a corner or an edge

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
            draggingType = "corner";
            return;
        }
    }
    
    // if we're not clicking near a point, check if we're near an edge
    // left
    if (edge_check(x, y, topLeft.y, bottomLeft.y, topLeft.x, "x", Math.abs(x - topLeft.x))) {
        dragging = [topLeft, bottomLeft];
        draggingDir = "x";
        draggingType = "edge";
    }
    // right
    else if (edge_check(x, y, topRight.y, bottomRight.y, bottomRight.x, "x", Math.abs(x - bottomRight.x))) {
        dragging = [topRight, bottomRight];
        draggingDir = "x";
        draggingType = "edge";
    }
    // top
    else if (edge_check(x, y, topLeft.x, topRight.x, topLeft.y, "y", Math.abs(y - topLeft.y))) {
        dragging = [topLeft, topRight];
        draggingDir = "y";
        draggingType = "edge";
    }
    // bottom
    else if (edge_check(x, y, bottomLeft.x, bottomRight.x, bottomRight.y, "y", Math.abs(y - bottomRight.y))) {
        dragging = [bottomLeft, bottomRight];
        draggingDir = "y";
        draggingType = "edge";
    } 
    // otherwise do nothing
    else {
        return;
    }
    

}

function cropMouseMove(event) {
    if (dragging != undefined) {
        // get click point
        var x = event.clientX - cropCanvas.getBoundingClientRect().left;
        var y = event.clientY - cropCanvas.getBoundingClientRect().top;
        
        if (draggingType == "corner") {
            // get the point we're dragging
            drag_point = points[dragging];
            
            // update point we're dragging
            drag_point.x = x;
            drag_point.y = y;
            
            // update adjacent points
            adjacentPoints[dragging][0].x = x;
            adjacentPoints[dragging][1].y = y;
        }
        else if (draggingType == "edge") {
            if (draggingDir == "x") {
                dragging[0].x = x;
                dragging[1].x = x;
            }
            else if (draggingDir == "y") {
                dragging[0].y = y;
                dragging[1].y = y;
            }
            else {
                throw "Dragging direction not set!";
            }
        } else {
            throw "Dragging type not set!";
        }
        
        cropCtx.clearRect(0,0,canvasWidth,canvasHeight);
        cropCtx.beginPath();
        cropCtx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
    }
}

function cropMouseUp(event) {
    dragging = undefined;
    draggingDir = undefined;
    draggingType = undefined;
}

function edge_check(x, y, lower_limit, upper_limit, line_location, dimension, dist) {
    const EDGE_RADIUS = 50;

    if (dimension == "x") {    
        // between the top and bottom corners
        return (lower_limit < y && y < upper_limit) && dist <= EDGE_RADIUS;
    } else if (dimension == "y") {
        // between the left and right corners
        return (lower_limit < x && x < upper_limit) && dist <= EDGE_RADIUS;
    } else {
        throw new Exception("Invalid dimension " + dimension + ".");
    }
}

function distance(x1,y1,x2,y2) {
    return Math.sqrt(Math.abs((x2-x1)**2 + (y2-y1)**2));
}

