
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

$table="categories";
$response;
$data;

$searchCategory = "select * from $table where category like '%$searchText%'";
if($queryResult = $conn->query($searchCategory)){
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
        $response['data']="No results found.";
    }
    

}else{
    $response['status']="failed"; 
    $response['success']="false";
    $response['created_query']=$searchCategory;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
