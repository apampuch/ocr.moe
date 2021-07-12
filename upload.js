function uploadImage() {
    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        if (req.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
           if (req.status == 200) {
               alert(req.responseText);
           }
           else if (req.status == 400) {
              alert('There was an error 400');
           }
           else {
               alert('something else other than 200 was returned');
           }
        }
    };
    
    
    
    var formData = new FormData();
    formData.append("image", document.getElementById("file-input").files[0]);
    
    req.open("POST", "upload.php");
    req.send(formData);
}
