<?php
if ( 0 < $_FILES['image']['error'] ) {
    echo 'Error: ' . $_FILES['image']['error'] . '<br>';
}
else {
    // get a hopefully unique name for the image
    $temp_name = str_replace("/tmp/php", "", $_FILES['image']['tmp_name']);
    
    // move the file to the images folder
    move_uploaded_file($_FILES['image']['tmp_name'], 'images/' . $temp_name);
    
    echo $temp_name;

    //$command = "convert-im6 images/" . $temp_name . " -crop " . $cropWidth . "x" . $cropHeight . "+" . $cropX . "+" . $cropY . " - | tesseract - -";    
}
?>

