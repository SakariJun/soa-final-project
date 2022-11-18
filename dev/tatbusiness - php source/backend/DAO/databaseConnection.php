<?php
    function createConnection() {
        // Database Configuration
        $hostName = 'localhost';
        $userName = 'root';
        $pass = '';

        $databaseName = 'company_management';
        
        $connection = new mysqli($hostName, $userName, $pass, $databaseName);
        $connection->set_charset("utf8");

        if ( $connection->connect_error ){
            die("Can't Connect to database !!! Error log : ".$connection->connect_error);
        }

        return $connection;
    }
?>
