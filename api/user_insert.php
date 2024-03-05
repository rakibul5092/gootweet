
<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$inputJSON = file_get_contents('php://input');
$user= json_decode( $inputJSON ); 

$servername = "localhost";
$username = "LiveProjekts_fn";
$password = "LiveProjekts_fn";
$dbname = "LiveProjekts_fn";
$conn = new mysqli($servername, $username, $password,$dbname);
mysqli_set_charset($conn,"utf8");

$table="users";
$response;

$addUser = "insert into $table (uid , cover_photo, email, first_name, last_name,  phone, profile_photo, rule, status) values( '$user->uid', '$user->cover_photo', '$user->email',  '$user->first_name',  '$user->last_name', '$user->phone','$user->profile_photo', '$user->rule', '$user->status' )";
if($conn->query($addUser)){
    $response['status']="ok";
    $response['success']="true";
    $response['data']=$user;

}else{
    $response['status']="failed"; 
    $response['success']="false";
    $response['data']=$user;
    $response['created_query']=$addUser;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
