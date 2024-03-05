<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$inputJSON = file_get_contents('php://input');
$category= json_decode( $inputJSON );

$servername = "localhost";
$username = "LiveProjekts_fn";
$password = "LiveProjekts_fn";
$dbname = "LiveProjekts_fn";
$conn = new mysqli($servername, $username, $password,$dbname);
mysqli_set_charset($conn,"utf8");

$table="categories";
$response;

$addCategory = "insert into $table (objectID, category) values( '$category->objectID', '$category->category' )";
if($conn->query($addCategory)){
    $response['status']="ok";
    $response['success']="true";
    $response['data']=$category;

}else{
    $response['status']="failed";
    $response['success']="false";
    $response['data']=$category;
    $response['created_query']=$addCategory;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
