<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$jsonFiles = $_POST['files'];
$fileFolder = $_POST['folder'];
$files = json_decode($jsonFiles,true);



if ($files != null && sizeof($files)>0) {

    foreach ($files as $f) {

        $folder = "../$fileFolder";
        if (is_dir($folder)) {
            $file = $folder."/" . $f;
    
            $deleted = unlink($file);
    
            if ($deleted) {
                $dbdata['status'] = true;
            } else {
                $dbdata['status'] = false;
            }
        }
    }
   
    
} else {
    $dbdata['status'] = false;
}
echo json_encode($dbdata);
?>


<!-- removeImages(folder: string, files: string[]) {
    let postData = new FormData();
    postData.append("folder", folder);
    postData.append("files", JSON.stringify(files));
    return this.http.post("https://furniin.com/api/delete.php", postData);
  } -->