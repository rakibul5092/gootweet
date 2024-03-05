
<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$uid = $_POST['uid']; 

$servername = "localhost";
$username = "LiveProjekts_fn";
$password = "LiveProjekts_fn";
$dbname = "LiveProjekts_fn";
$conn = new mysqli($servername, $username, $password,$dbname);
mysqli_set_charset($conn,"utf8");

$table="users";
$response;

$deleteQuery = "delete from $table where uid = '$uid'";
if($conn->query($deleteQuery)){
    $response['status']="ok";
    $response['success']="true";

}else{
    $response['status']="failed"; 
    $response['success']="false";
    $response['created_query']=$deleteQuery;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
