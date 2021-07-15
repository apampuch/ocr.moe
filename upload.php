
<?php
if ( 0 < $_FILES['image']['error'] ) {
    echo 'Error: ' . $_FILES['image']['error'] . '<br>';
}
else {
    // get a hopefully unique name for the image
    $temp_name = str_replace("/tmp/php", "", $_FILES['image']['tmp_name']);
    
    // TODO when we have a database, add mime type and timestamps and stuff
    
    // move the file to the images folder
    move_uploaded_file($_FILES['image']['tmp_name'], 'images/' . $temp_name);
    $command = "tesseract images/" . $temp_name . " -";
    $result = null;
    
    exec($command, $result);

    print_r($result);
}
?>


