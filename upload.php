
<?php
if ( 0 < $_FILES['image']['error'] ) {
    echo 'Error: ' . $_FILES['image']['error'] . '<br>';
}
else {
    // get a hopefully unique name for the image
    $temp_name = str_replace("/tmp/php", "", $_FILES['image']['tmp_name']);
    
    // since the canvas is always a square, get the longer edge
    $longestEdge = max($_POST["image-width"], $_POST["image-height"]);
    // calculate the coefficient to correct the crop
    $correction = $longestEdge / $_POST["canvas-width"];
    
    // calculate actual crop area from canvas crop area (which is probably smaller)
    $cropWidth = round($_POST["crop-width"] * $correction);
    $cropHeight = round($_POST["crop-height"] * $correction);
    $cropX = round($_POST["crop-x"] * $correction);
    $cropY = round($_POST["crop-y"] * $correction);
    


    
    // adjust crop starting point if image is not perfectly square
    if ($_POST["image-width"] > $_POST["image-height"]) {
        // gap is the gap where there's no image
        $gap = ($_POST["image-width"] - $_POST["image-height"]) / 2;
        $cropY -= $gap;
        
        // other gap adjust is used to adjust the bottom or left
        $otherGapAdjust = min(0, $cropY);
        $cropY = max(0, $cropY);        
        
        $cropHeight += $otherGapAdjust;
        $cropHeight = min($_POST["image-height"], $cropHeight);
    } else {
        // gap is the gap where there's no image
        $gap = ($_POST["image-height"] - $_POST["image-width"]) / 2;
        $cropX -= $gap;
        
        // other gap adjust is used to adjust the bottom or left
        $otherGapAdjust = min(0, $cropX);
        $cropX = max(0, $cropX);        
        
        $cropWidth += $otherGapAdjust;
        $cropWidth = min($_POST["image-width"], $cropWidth);
    }
    
    //print_r("width: " . $cropWidth . "\nheight: " . $cropHeight . "\nx: " . $cropX . "\ny: " . $cropY);
    
    
    // move the file to the images folder
    move_uploaded_file($_FILES['image']['tmp_name'], 'images/' . $temp_name);
    //$command = "convert-im6 images/" . $temp_name . " -crop " . $cropWidth . "x" . $cropHeight . "+" . $cropX . "+" . $cropY . " - | tesseract - -";
    $command = "convert-im6 images/" . $temp_name . " -crop " . $cropWidth . "x" . $cropHeight . "+" . $cropX . "+" . $cropY . " images/crops/" . $temp_name . " | tesseract images/crops/" . $temp_name . " -";
    $result = null;
    $retcode = null;
    
    exec($command, $result, $retcode);

    if ($retcode == 127) {
        print_r("ERROR: Tesseract not installed on host.");
    } elseif ($retcode != 0) {
        print_r("Error code: " . $retcode . "\n");
        print_r($result);
    // on success
    } else {
        print_r($result);
    }
    
}
?>


