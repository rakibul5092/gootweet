<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$encodedFile = $_POST['base64'];
$fileName = $_POST['fileName'];
$fileFolder = $_POST['folder'];
if($fileName != null && $encodedFile != null && $fileFolder != null ){

        $folder = "../".$fileFolder;
        if(!is_dir($folder)){
            mkdir($folder);
        }
        $file = $folder."/".$fileName;

        $fileData = base64_decode($encodedFile);



        $success = file_put_contents($file, $fileData);


    if($success){
        $dbdata['status'] = true;
        $dbdata['url']= $fileName;
    }else{
        unlink($file);
        $dbdata['status'] = false;
        $dbdata['error']="Photo save failed!";
    }
}else{
    $dbdata['status'] = false;
    $version = PHP_VERSION;
    $dbdata['error']="Unsupported data. result: ".$version;
}
echo json_encode($dbdata);
?>




  <!-- uploadImage(folder: string, fileName: string, data: any) {
    let base64 = data.split(",")[1];
    let postData = new FormData();
    postData.append("folder", folder);
    postData.append("fileName", fileName);
    postData.append("base64", base64);

    return this.http.post("https://www.furniin.com/api/upload_image.php", postData);
  } -->
