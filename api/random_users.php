<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$servername = "localhost";
$username = "gootweet_data";
$password = "gootweet_data";
$dbname = "gootweet_data";
$conn = new mysqli($servername, $username, $password,$dbname);
mysqli_set_charset($conn,"utf8");

$table="users";
$response;
$data;

$randoms = "SELECT * FROM users ORDER BY RAND() LIMIT 15";
if($queryResult = $conn->query($randoms)){
    if(mysqli_num_rows($queryResult)>0){
        while ($row = $queryResult->fetch_assoc()){
            $data[]= $row;
        }
        $response['status']="ok";
        $response['success']="true";
        $response['data']=$data;
    }else{
        $response['status']="ok";
        $response['success']="true";
        $response['created_query']=$randoms;
        $response['data']="No results found.";
    }


}else{
    $response['status']="failed";
    $response['success']="false";
    $response['created_query']=$randoms;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
