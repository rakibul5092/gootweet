<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

$inputJSON = file_get_contents('php://input');
$product= json_decode( $inputJSON );

$servername = "localhost";
$username = "LiveProjekts_fn";
$password = "LiveProjekts_fn";
$dbname = "LiveProjekts_fn";
$conn = new mysqli($servername, $username, $password,$dbname);
mysqli_set_charset($conn,"utf8");

$table="products";
$response;


$updateProduct = "update $table set objectID = '$product->objectID', catId ='$product->catId', subCatId='$product->subCatId', uid='$product->uid', title='$product->title', innerCatId='$product->innerCatId', image='$product->image', price='$product->price', product_id='$product->product_id' where objectID = '$product->objectID'";
if($conn->query($updateProduct)){
    $response['status']="ok";
    $response['success']="true";
    $response['data']=$product;

}else{
    $response['status']="failed";
    $response['success']="false";
    $response['data']=$product;
    $response['created_query']=$updateProduct;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
