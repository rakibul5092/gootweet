<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$searchText = $_POST['search_text'];

$servername = "localhost";
$username = "LiveProjekts_fn";
$password = "LiveProjekts_fn";
$dbname = "LiveProjekts_fn";
$conn = new mysqli($servername, $username, $password,$dbname);
mysqli_set_charset($conn,"utf8");

$table="users";
$response;
$data;

$searchProduct = "SELECT * FROM $table WHERE SOUNDEX(first_name) = SOUNDEX('".$searchText."') ";
if($queryResult = $conn->query($searchProduct)){
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
        $response['created_query']=$searchProduct;
        $response['data']="No results found.";
    }


}else{
    $response['status']="failed";
    $response['success']="false";
    $response['created_query']=$searchProduct;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
