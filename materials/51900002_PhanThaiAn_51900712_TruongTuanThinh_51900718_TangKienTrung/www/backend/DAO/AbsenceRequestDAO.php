<?php
    require_once 'databaseConnection.php';

    #region Chức năng quản lý ngày phép CODED BY 51900718

    // [ĐÃ TEST BY 51900718] Tạo yêu cầu nghỉ phép
    // Nhận vào ngày bắt đầu, ngầy kết thúc , lí do nghỉ, và thời gian gửi yêu cầu
    function createAbsenceRequest($userID ,$date_Begin, $date_End, $reason, $requestTime){
        $sql_Statement = 'INSERT INTO absence_request(UserID, DateBegin, DateEnd, Reason, RequestTime) VALUES(?, ?, ? ,?, ?)';
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('sssss',$userID, $date_Begin, $date_End, $reason, $requestTime);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        if ( $statement->affected_rows == 0 ){
            return array('status'=>false,'errorMessage'=>"Gửi yêu cầu xin nghỉ phép thất bại !");
        }

        return array('status' => true, 'message' => "Gửi yêu cầu xin nghỉ phép thành công !!!");
    }
    
    // [ĐÃ TEST BY 51900718] Duyệt yêu cầu nghỉ phép [Rejected Hoặc Approved] 
    // và có thể thêm lí do chấp nhận hoặc từ chối yêu cầu [nếu có]
    function setAbsenceRequestStatus($absenceRequestID ,$status, $responseMessage, $responseTime){
        $sql_Statement = 'UPDATE absence_request SET Status = ?, ResponseMessage = ?, ResponseTime = ? WHERE RequestID = ?'; 
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('ssss',$status, $responseMessage, $responseTime, $absenceRequestID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        if ( $statement->affected_rows == 0){
            return array('status'=>false,'errorMessage'=>"Không duyệt được đơn hoặc đơn đã được duyệt !");
        }

        return array('status'=>true,'message'=>"Duyệt đơn thành công !");
    }

    // [ĐÃ TEST BY 51900718] 
    // Xem danh sách các yêu cầu nghỉ phép của Nhân viên mình quản lý [Function này dành cho trưởng phòng]
    // Nhận vào tham số là Mã phòng ban
    function showAbsenceRequestByLeader($departmentID){
        $sql_Statement = 'SELECT * FROM absence_request, user WHERE user.UserID = absence_request.UserID 
        AND user.DepartmentID = ? AND user.Role = "Nhân viên" ORDER BY absence_request.RequestTime DESC';
        $connection = createConnection(); 

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('s',$departmentID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=>"Không tìm thấy đơn xin nghỉ phép nào !");
        }

        $absenceRequestList = array();

        while($row = $result->fetch_assoc()) {
            array_push($absenceRequestList ,$row);
        }

        return array('status' => true, 'result' => $absenceRequestList );
    }

    // [ĐÃ TEST BY 51900718] 
    // Xem danh sách yêu cầu nghỉ phép của các trưởng phòng [Function này dành cho Giám đốc]
    function showAbsenceRequestByDirector(){
        $sql_Statement = 'SELECT * FROM absence_request, user WHERE user.UserID = absence_request.UserID 
        AND user.Role = "Trưởng phòng" ORDER BY absence_request.RequestTime DESC'; 
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=>"Không tìm thấy đơn xin nghỉ phép nào !");
        }

        $absenceRequestList = array();

        while($row = $result->fetch_assoc()) {
            array_push($absenceRequestList ,$row);
        }

        return array('status' => true, 'result' => $absenceRequestList );
    }

    // Lấy mã yêu cầu nghỉ phép cao nhất + 1 => Mã yêu cầu nghỉ phép tiếp theo
    function getNewAbsenceRequestId(){
        $sql_Statement = 'SELECT MAX(RequestID) AS "MAXRequestID" FROM absence_request'; 
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=>"Không tìm thấy đơn xin nghỉ phép nào !" , 'result' => 1);
        }

        $result = $result->fetch_assoc();

        return array('status' => true, 'result' => intval($result['MAXRequestID']) + 1 );
    }

    // Xem danh sách các yêu cầu nghỉ phép mà Người lao động [Trưởng phòng hoặc Nhân viên] đã gửi
    function showAbsenceRequestByOfficer($officerID){
        $sql_Statement = 'SELECT * FROM absence_request WHERE absence_request.UserID = ?';
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('s', $officerID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=>"Không tìm thấy đơn xin nghỉ phép nào !");
        }

        $absenceRequestList = array();

        while($row = $result->fetch_assoc()) {
            array_push($absenceRequestList ,$row);
        }

        return array('status' => true, 'result' => $absenceRequestList );
    }

    // Xem chi tiết yêu cầu nghỉ phép
    // Thông tin trả về gồm Thông tin nhân viên,
    // Thông tin nghỉ phép, Thông tin phòng ban, Thông tin yêu cầu nghỉ phép
    function showDetailAbsenceRequest($absenceRequestID){
        $sql_Statement = 'SELECT * FROM absence_request, user, absence, department WHERE RequestID = ? 
        AND absence_request.UserID = user.UserID AND absence.UserID = user.UserID AND user.DepartmentID = department.DepartmentID';
        
        $connection = createConnection(); 

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('s',$absenceRequestID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=>"Không tìm thấy đơn xin nghỉ phép nào !");
        }

        return array('status' => true, 'result' => $result->fetch_assoc() );
    }
    #endregion
?>