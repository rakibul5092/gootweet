<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$encodedFile = $_POST['image'];
$imageName = $_POST['image_name'];


if($imageName != null && $encodedFile != null ){
    
    $folder = "../portfolio_photos";
    $imageData = base64_decode($encodedFile);
    if(!is_dir($folder)){
        mkdir($folder);
    }
    $file = $folder."/".$imageName;
    $success = file_put_contents($file, $imageData);
        

    if($success){
        $dbdata['status'] = true;
        $dbdata['photo_url']= "https://furniin.s3.eu-west-2.amazonaws.com/portfolio_photos/".$imageName;
    }else{
        unlink($file);
        $dbdata['status'] = false;
    }
}else{
    $dbdata['status'] = false;
}
echo json_encode($dbdata);
?>
