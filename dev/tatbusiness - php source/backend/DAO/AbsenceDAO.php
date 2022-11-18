<?php
    require_once 'databaseConnection.php';

    // Lấy thông tin nghỉ phép của nhân viên bằng mã nhân viên
    function getAbsenceInfo($userID){
        $sql_Statement = 'SELECT * FROM absence WHERE UserID = ?';
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('s',$userID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=> "Không tìm được thông tin ngày nghỉ của nhân viên !!!");
        };

        return array('status'=> true,'result'=> $result->fetch_assoc());
    }

    // Đặt lại số ngày đã nghỉ của nhân viên bằng mã nhân viên Nếu đơn xin nghỉ phép được giám đốc duyệt
    function setDayAbsence($userID, $dayAbsence){
        $sql_Statement = 'UPDATE absence SET DayAbsence = ? WHERE UserID = ?'; 
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('ss',$dayAbsence, $userID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        if ( $statement->affected_rows == 0){
            return array('status'=>false,'errorMessage'=>"Cập nhật số ngày đã nghỉ không thành công !");
        }

        return array('status'=>true,'message'=>"Cập nhật số ngày đã nghỉ thành công !");
    }

    // Tạo thông tin ngày nghỉ của nhân viên bằng mã nhân viên và chức vụ
    function createUserAbsence($userID, $role){
        $sql_Statement = 'INSERT INTO absence(UserID, MaxAbsenceDay) VALUES(?, ?)';
        $connection = createConnection();   

        $maxAbsenceDay = 0;
        if ( $role == 'Nhân viên' ){
            $maxAbsenceDay = 12;
        } else if ($role == 'Trưởng phòng'){
            $maxAbsenceDay = 15;
        } else {
            return array('status'=>false,'errorMessage'=>"Sai chức vụ !");
        }

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('ss',$userID,$maxAbsenceDay);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Xảy ra lỗi khi thêm thông tin nghỉ phép hoặc mã nhân viên đã có thông tin nghỉ phép !");
        };

        if ( $statement->affected_rows == 0 ){
            return array('status'=>false,'errorMessage'=> "Thêm thông tin nghỉ phép không thành công !!!");
        };

        return array('status'=>true,'message'=> 'Thêm thông tin nghỉ phép thành công !!!');
    }

    // Cập nhật lại lần gửi yêu cầu gần nhất khi nhân viên gửi yêu cầu xin nghỉ phép thành Công
    // lần gửi yêu cầu gần nhất = ngày tháng năm và thời gian hiện tại.
    function updateLastRequest($lastRequest, $userID){
        $sql_Statement = 'UPDATE absence SET LastRequest = ? WHERE UserID = ?'; 
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('ss',$lastRequest, $userID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        if ( $statement->affected_rows == 0){
            return array('status'=>false,'errorMessage'=>"Cập nhật lần gửi yêu cầu gần nhất không thành công !");
        }

        return array('status'=>true,'message'=>"Cập nhật lần gửi yêu cầu gần nhất thành công !");
    }
?>