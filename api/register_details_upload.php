<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$encodedImage = $_POST['image'];
$imageName = $_POST['image_name'];

// $encodedDoc = $_POST['doc'];
// $docName = $_POST['doc_name']; && $docName!=null && $encodedDoc!= null

if($imageName != null && $encodedImage != null ){
    $folder_logo = "../brand_logos";
    // $folder_signed_doc = "../signed_doc";
    $imageData = base64_decode($encodedImage);
    // $docData = base64_decode($encodedDoc);
    if(!is_dir($folder_logo)){
        mkdir($folder_logo);
    }
    // if(!is_dir($folder_signed_doc)){
    //     mkdir($folder_signed_doc);
    // }
    $fileImage = $folder_logo."/".$imageName;
    // $fileDoc = $folder_signed_doc."/".$docName;
    $success1 = file_put_contents($fileImage, $imageData);
    // $success2 = file_put_contents($fileDoc, $docData);
        

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
