<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$imageName = $_POST['image_name'];


if ($imageName != null) {

    $folder = "../product_photos";
    if (!is_dir($folder)) {
        $dbdata['status'] = false;
    }
    $file = "https://furniin.s3.eu-west-2.amazonaws.com/product_photos/" . $imageName;

    $deleted = unlink($file);

    if ($deleted) {
        $dbdata['status'] = true;
    } else {
        $dbdata['status'] = false;
    }
} else {
    $dbdata['status'] = false;
}
echo json_encode($dbdata);
?>