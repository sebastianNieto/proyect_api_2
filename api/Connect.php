<?php 
include_once './Config.php';

class Connect {

    private $pdo;
    private $driver = DB_DRIVER;
    private $host = DB_HOST;
    private $port = DB_PORT;
    private $dbname = DB_NAME;
    private $username = DB_USERNAME;
    private $password = DB_PASSWORD;

    public function __construct() {
        try {
            $dsn = "$this->driver:host=$this->host;port=$this->port;dbname=$this->dbname;charset=UTF8";
            $this->pdo = new PDO($dsn, $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo $e->getMessage();
            die();
        }
    }

    public function getConnect() {
        return $this->pdo;
    }

    public function closeConnect() {
        $this->pdo = null;
    }
}