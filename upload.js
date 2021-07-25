function remove_image() {
    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {
            document.getElementById("ocr-text").value = req.responseText; 
        }
    };
    
    var formData = new FormData();
    formData.append("image-id", sessionStorage.getItem("image-id"));
    
    req.open("POST", "delete.php", false);
    req.send(formData);
}

function submit() {

    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {
            document.getElementById("ocr-text").value = req.responseText;
        }
    };
    
    var formData = new FormData();
    formData.append("image-id", sessionStorage.getItem("image-id"));
    
    // add crop data
    formData.append("crop-width", bottomRight.x - topLeft.x);
    formData.append("crop-height", bottomRight.y - topLeft.y);
    formData.append("crop-x", topLeft.x);
    formData.append("crop-y", topLeft.y);
    
    // add canvas size in case it changes later in development
    formData.append("canvas-width", document.getElementById("crop-layer").width);
    formData.append("canvas-height", document.getElementById("crop-layer").height);
    
    req.open("POST", "ocr.php");
    req.send(formData);
}

function uploadImage() {
    // remove the old image first
    remove_image();

    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (req.status == 200) {
               // trim the response text because the newline at the end of a PHP file causes problems with echo
               sessionStorage.setItem("image-id", req.responseText.trim());
               document.getElementById("ocr-text").value = req.responseText.trim();
           }
           else if (req.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };  
    
    // make an image object from uploaded image to check dimensions
    var uploadedFile = document.getElementById("file-input").files[0];
    var reader = new FileReader();
    var img = new Image();
    
    // read the file we just uploaded, give it a url, then set an image's src to the 
    // url, all so we can read the dimensions of the image
    reader.onload = function(e) {
    
        img.onload = function() {
            // make the form data and add the image
            var formData = new FormData();
            formData.append("image", uploadedFile);
            formData.append("image-width", img.width);
            formData.append("image-height", img.height);
            
            // add crop data
            formData.append("crop-width", bottomRight.x - topLeft.x);
            formData.append("crop-height", bottomRight.y - topLeft.y);
            formData.append("crop-x", topLeft.x);
            formData.append("crop-y", topLeft.y);
            

            
            req.open("POST", "upload.php");
            req.send(formData);
        }
        
        img.src = e.target.result;
    }
    
    reader.readAsDataURL(uploadedFile);
}
