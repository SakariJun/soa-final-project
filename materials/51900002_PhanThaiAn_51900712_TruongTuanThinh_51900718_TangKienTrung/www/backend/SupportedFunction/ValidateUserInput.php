<?php

    // Function validateInput: các API nên gọi hàm này để xử lý các ký tự đặc biết từ input của user
    function validateInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    function isPhoneNumber($phoneNumber,$minDigits = 9, $maxDigits = 14){
        //remove white space, dots, hyphens and brackets
        $phoneNumber = str_replace([' ', '.', '-', '(', ')'], '', $phoneNumber); 

        return preg_match('/^[0-9]{'.$minDigits.','.$maxDigits.'}\z/', $phoneNumber);
    }
?>