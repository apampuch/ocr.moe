
<?php
if ( 0 < $_FILES['image']['error'] ) {
    echo 'Error: ' . $_FILES['image']['error'] . '<br>';
}
else {
    move_uploaded_file($_FILES['image']['tmp_name'], 'images/' . $_FILES['image']['name']);

}
?>


