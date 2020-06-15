<?php
include_once './Connect.php';

Class Products {

    private $connect;
    private $result = [];

    public function __construct() {
        $connect = new Connect();
        $this->connect = $connect->getConnect();
    }

    public function getProducts($table, $fields, $filter) {
        $fields = implode(',', $fields);
        $sql = "SELECT $fields FROM $table";
        $this->result = array("status" => 0, 'message' => ' Error al consultar los registros');
        $sql = $this->executeSql($sql, $filter);
        if($sql){
            $this->result =  $sql->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function insertProduct($table, $data) {
        $columns = implode(',', array_keys($data));
        $values = implode(',', array_values($data));
        $sql = "INSERT INTO $table ($columns)  VALUES ($values)";
        $this->result = array("status" => 0, 'message' => ' No se insertó el registro');
        if($this->executeSql($sql)){
            $this->result = array("status" => 1, 'message' => ' Registro insertado exitosamente ');
        }
    }

    public function updateProduct($table, $data, $filter) {
        $setData = $this->setData($data);
        $sql = "UPDATE $table SET $setData";
        $this->result = array("status" => 0, 'message' => ' No se actualizó el registro');
        if($this->executeSql($sql, $filter)){
            $this->result = array("status" => 1, 'message' => ' Registro actualizado exitosamente ');
        }
    }

    public function deleteProduct($table, $filter) {
        $sql = "DELETE FROM $table";
        $this->result = array("status" => 0, 'message' => ' No se eliminó el registro');
        if($this->executeSql($sql, $filter)){
            $this->result = array("status" => 1, 'message' => ' Registro eliminado exitosamente ');
        }
    }


    private function executeSql($sql, $filter = '') {
        $condition = '';
        $bindParams = [];
        if(!empty($filter)){
            $condition = $this->addCondition($filter);
            $bindParams = ['id' => $filter];
        }
        try {
            $sql = $this->connect->prepare($sql.$condition);
            $sql->execute($bindParams);
            return $sql;
        } catch(PDOException $e) {
            echo $e->getMessage();
            return 0;
        }
    }

    private function setData($data) {
        $setData = '';
        foreach($data as $key => $value) {
            $setData .= "$key = '$value',";
        }
        return trim($setData, ',');
    }

    private function addCondition($filter) {
        $condition = '';
        if(!empty($filter)) {
            $condition .= ' WHERE id = :id';
        }

        return $condition;
    }

    public function getResult() {
        return $this->result;
    }

}
