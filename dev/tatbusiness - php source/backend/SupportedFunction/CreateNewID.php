<?php 
    const ID_DIGITS = 3;

    function createNewIDWithOutPrefix( $maxCurrentID ){
        // Hàm tạo ID mới 
        // Nhận vào tham số là: Mã ID cao nhất hiện tại của bảng đó 
        // Có thể lấy ra = câu query
        // Ví dụ lấy mã hóa đơn cao nhất : SELECT MAX(MaHoaDon) FROM hoadon
        // Kết quả trả về sẽ được truyền vào hàm này
        // 1 ID sẽ có format = 'Tên viết tắt'+ '000' 3 số 
        $len = strlen($maxCurrentID);
        $newMaxID = (int)substr($maxCurrentID,$len- ID_DIGITS ,$len); // Lấy ra 3 số parse về int

        $newMaxID += 1; // Tăng 1
        $newMaxID = strval($newMaxID); // Parse lại về string

        // Thêm số 0 vào bên trái
        $newMaxID = str_pad($newMaxID,ID_DIGITS,'0',STR_PAD_LEFT);

        // Trả về tiền tố + ID sau khi tăng 1
        return substr($maxCurrentID,0,strlen($maxCurrentID)-ID_DIGITS) . $newMaxID; //
    }

    function createNewIDWithPrefix( $prefix ,$maxCurrentID ){
        $len = strlen($maxCurrentID);
        $newMaxID = (int)substr($maxCurrentID,$len- ID_DIGITS ,$len);

        $newMaxID += 1;
        $newMaxID = strval($newMaxID); 

        $newMaxID = str_pad($newMaxID,ID_DIGITS,'0',STR_PAD_LEFT);

        return $prefix . $newMaxID;
    }
?>