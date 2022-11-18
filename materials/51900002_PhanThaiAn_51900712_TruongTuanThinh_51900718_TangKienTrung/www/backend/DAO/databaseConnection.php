<?php
	// Dùng cho docker
	#  https://www.w3schools.com/php/php_mysql_select.asp
 
    function createConnection() {
        $hostName = 'mysql-server';
        $userName = 'root';
        $pass = 'root';

        $databaseName = 'company_management';
        
        $connection = new mysqli($hostName, $userName, $pass, $databaseName);
        $connection->set_charset("utf8");

        if ( $connection->connect_error ){
            die("Can't Connect to database !!! Error log : ".$connection->connect_error);
        }

        return $connection;
    }
?>
