<?php
    $imagePath = getcwd() . "/images/" . $_POST["image-id"];


//    $debug_path = "/home/weanoob/Documents/ocr.moe/images/". $_POST["image-id"];
//    $raw_path = "/home/weanoob/Documents/ocr.moe/images/XBrjdA";

//    echo $debug_path . ":" . strlen($debug_path) . "\n";
//    echo $raw_path . ":" . strlen($raw_path) . "\n";
    if (!file_exists($imagePath)) {
        echo "File does not exist.";
        return;
    }

    $imageInfo = getimagesize($imagePath);
    $width = $imageInfo[0];
    $height = $imageInfo[1];
    
    // since the canvas is always a square, get the longer edge
    $longestEdge = max($width, $height);
    // calculate the coefficient to correct the crop
    $correction = $longestEdge / $_POST["canvas-width"];
    
    // calculate actual crop area from canvas crop area (which is probably smaller)
    $cropWidth = round($_POST["crop-width"] * $correction);
    $cropHeight = round($_POST["crop-height"] * $correction);
    $cropX = round($_POST["crop-x"] * $correction);
    $cropY = round($_POST["crop-y"] * $correction);

    // adjust crop starting point if image is not perfectly square
    if ($width > $height) {
        // gap is the gap where there's no image
        $gap = ($width - $height) / 2;
        $cropY -= $gap;
        
        // other gap adjust is used to adjust the bottom or left
        $otherGapAdjust = min(0, $cropY);
        $cropY = max(0, $cropY);        
        
        $cropHeight += $otherGapAdjust;
        $cropHeight = min($height, $cropHeight);
    } else {
        // gap is the gap where there's no image
        $gap = ($height - $width) / 2;
        $cropX -= $gap;
        
        // other gap adjust is used to adjust the bottom or left
        $otherGapAdjust = min(0, $cropX);
        $cropX = max(0, $cropX);        
        
        $cropWidth += $otherGapAdjust;
        $cropWidth = min($width, $cropWidth);
    }
    
    $command = "convert-im6 " . $imagePath . " -crop " . $cropWidth . "x" . $cropHeight . "+" . $cropX . "+" . $cropY . " - | tesseract - -";
    $result = null;
    $retcode = null;
    
    exec($command, $result, $retcode);
    
    //print_r("width: " . $cropWidth . "\nheight: " . $cropHeight . "\nx: " . $cropX . "\ny: " . $cropY);

    if ($retcode == 127) {
        print_r("ERROR: Tesseract not installed on host.");
    } elseif ($retcode != 0) {
        print_r("Error code: " . $retcode . "\n");
        print_r($result);
    } else {
        foreach ($result as $line) {
            echo $line."\n";
        }
    }
?>
