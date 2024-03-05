<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$encodedImage = $_POST['image'];
$imageName = $_POST['image_name'];
$oldName = $_POST['old_name'];

if($imageName != null && $encodedImage != null ){
    $folder_logo = "../cover_photos";
    $imageData = base64_decode($encodedImage);
    if(!is_dir($folder_logo)){
        mkdir($folder_logo);
    }
    $fileImage = $folder_logo."/".$imageName;
    $oldFile = $folder_logo."/".$oldName;

    if($oldName && is_file($oldFile)){
        unlink($oldFile);
    }
    $success1 = file_put_contents($fileImage, $imageData);
        
    if($success1){
        $dbdata['status'] = true;
        $dbdata['image_url']= "https://furniin.s3.eu-west-2.amazonaws.com/brand_logos/".$imageName;
        // $dbdata['doc_url']= "https://furniin.s3.eu-west-2.amazonaws.com/signed_doc/".$docName;
    }else{
        unlink($fileImage);
        // unlink($fileDoc);
        $dbdata['status'] = false;
    }
}else{
    $dbdata['status'] = false;
}
echo json_encode($dbdata);
?>
