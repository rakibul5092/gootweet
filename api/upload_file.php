<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$encodedFile = $_POST['file'];
$fileName = $_POST['file_name'];
// $mime = $_POST['mime'];


if($fileName != null && $encodedFile != null ){
    // if(strtolower($mime) == strtolower('jpg') || strtolower($mime) == strtolower('jpeg') || strtolower($mime) == strtolower('png')){

    // }else if(strtolower($mime) == strtolower('mp3') || strtolower($mime) == strtolower('wav') || strtolower($mime) == strtolower('aac')){

    // }else if(strtolower($mime) == strtolower('doc') || strtolower($mime) == strtolower('pdf') || strtolower($mime) == strtolower('docx')){

    // }
    $folder = "../files";
    $fileData = base64_decode($encodedFile);
    if(!is_dir($folder)){
        mkdir($folder);
    }
    $file = $folder."/".$fileName;
    $success = file_put_contents($file, $fileData);
        

    if($success){
        $dbdata['status'] = true;
        $dbdata['file_url']= "https://furniin.s3.eu-west-2.amazonaws.com/files/".$fileName;
    }else{
        unlink($file);
        $dbdata['status'] = false;
    }
}else{
    $dbdata['status'] = false;
}
echo json_encode($dbdata);
?>
