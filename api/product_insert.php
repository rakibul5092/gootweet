
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


$addProduct = "insert into $table (objectID, catId, subCatId, uid, title, innerCatId, image, price, product_id ) values( '$product->objectID', '$product->catId', '$product->subCatId' , '$product->uid', '$product->title', '$product->innerCatId', '$product->image', '$product->price', '$product->product_id')";
if($conn->query($addProduct)){
    $response['status']="ok";
    $response['success']="true";
    $response['data']=$product;

}else{
    $response['status']="failed"; 
    $response['success']="false";
    $response['data']=$product;
    $response['created_query']=$addProduct;
    $response['error']=mysqli_error($conn);
}

echo json_encode($response);
?>
