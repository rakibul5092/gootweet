<?php

//this will show error if any error happens
error_reporting(E_ALL);
ini_set('display_errors', 1);

//enable cors
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

//check post request
if($_SERVER['REQUEST_METHOD']=="POST")
{

//get the file
$ori_fname=$_FILES['file']['name'];

//get file extension
$ext = pathinfo($ori_fname, PATHINFO_EXTENSION);

//target folder
$target_path = "../videos/";
$actual_fname=$_POST["name"];

//set target file path
$target_path = $target_path . basename($actual_fname).".".$ext;

$result=array();

//move the file to target folder
if (move_uploaded_file($_FILES['file']['tmp_name'], $target_path)) {

$result["status"]=1;
$result["message"]="Uploaded file successfully.";

}else{

$result["status"]=0;
$result["message"]="File upload failed. Please try again.";

}

echo json_encode($result);




}// end of post request

?>
