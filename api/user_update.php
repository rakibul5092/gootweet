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

$updateUser = "update $table set cover_photo='$user->cover_photo', email='$user->email', first_name='$user->first_name', last_name='$user->last_name', phone='$user->phone', profile_photo='$user->profile_photo', rule='$user->rule', status='$user->status'";
if($conn->query($updateUser)){
    $response['status']="ok";
    $response['success']="true";
    $response['data']=$user;

}else{
    $response['status']="failed";
    $response['success']="false";
    $response['data']=$user;
    $response['created_query']=$updateUser;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
