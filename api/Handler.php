<?php
header('Content_type: application/json');
header("Access-Control-Allow-Origin: *");
include_once './Products.php';


Class Handler {
    public function route($type, $params) {
        $filter = isset($params[1]) ? $params[1] : '';
        $product = new Products();
        switch($type) {
            case 'GET':
                $filter = isset($_GET['id']) ? $_GET['id'] : $filter;
                $product->getProducts('product', ['*'], $filter);
                $result = $product->getResult();
                break;
            case 'POST':
                $result = 'Complete todos los campos';
                if(isset($_POST['descripcion'])){
                    $data = [
                        "descripcion" => strtoupper("'$_POST[descripcion]'"),
                        "marca" => strtoupper("'$_POST[marca]'"),
                        "presentacion" => strtoupper("'$_POST[presentacion]'"),
                        "precio" => "'$_POST[precio]'"
                    ];
                    $product->insertProduct('product', $data);
                    $result = $product->getResult();
                }
                break;

            case 'PUT':
                $filter = isset($_GET['id']) ? $_GET['id'] : $filter;
                $result = 'Especifique el id del producto';
                if(!empty($filter)){
                    $data = $_GET;
                    unset($data['params']);
                    unset($data['id']);
                    $product->updateProduct('product', $data, $filter);
                    $result = $product->getResult();
                }
                break;

            case 'DELETE':
                $filter = isset($_GET['id']) ? $_GET['id'] : $filter;
                $result = 'Especifique el id del producto';
                if(!empty($filter)) {
                  $product->deleteProduct('product', $filter);  
                  $result = $product->getResult(); 
                }
                break;
        }
        echo json_encode($result);
    }
}

$params = explode('/', $_GET['params']);
if (strtolower($params[0]) == 'products') {
    $handler = new Handler();
    $handler->route($_SERVER['REQUEST_METHOD'], $params);
} 
else {
    header("HTTP/1.1 400 Bad Request");
    exit();
}
