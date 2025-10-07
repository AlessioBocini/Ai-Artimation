
<?php header('Access-Control-Allow-Origin: *'); ?>
<?php
    function create_connection(){
        $servername = "localhost";
        $username = "root";
        $password ="";
        $conn = new mysqli($servername,$username,$password);
        return $conn;
    }
?>