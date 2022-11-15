<?php

    require_once 'databaseConnection.php';

    #region CODED BY 51900718
    // [ĐÃ TEST BY 51900718] Check xem mã nhân viên có thuộc về phòng ban và là trưởng phòng hay không
    function isLeader($leaderID){
        $sql_Statement = 'SELECT DepartmentID FROM user WHERE UserID = ?';
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('s',$leaderID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=> "Mã nhân viên không tồn tại");
        }

        $result = $result->fetch_assoc();
        $departmentID = $result['DepartmentID'];

        $sql_Statement = 'SELECT * FROM department WHERE DepartmentID = ? AND LeaderID = ?';
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('ss',$departmentID, $leaderID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=>  $leaderID . " không phải trưởng phòng của phòng ban ". $departmentID ." !");
        }

        return array('status'=>true,'result'=> $result->fetch_assoc() );
    }

    // [ĐÃ TEST BY 51900718] Check xem nhân viên có thuộc về phòng ban mà trưởng phòng đang quản lý hay không
    function isOfficerManagedByLeader($officerID, $departmentID){
        $sql_Statement = 'SELECT * FROM user WHERE UserID = ? AND DepartmentID = ?';
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('ss',$officerID, $departmentID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Can't execute command !");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>false,'errorMessage'=> "Nhân viên ".$officerID." không thuộc phòng ban ".$departmentID." !");
        }

        return array('status'=>true,'result'=> $result->fetch_assoc() );
    } 
    #endregion
    function LoadAllDepartments(){
        $sql = 'select * from department order by department.DepartmentName';
        $conn = createConnection();
    
        $result = $conn->query($sql);
        if(!$result){
            return json_encode(array('status' => 0,'message'=> $conn->error));
        }
        $data = $result->fetch_all();
        return json_encode(array('status'=>1,'message'=> 'Success.', 'data'=>$data));
    }

    function loadAllLeaderDepartments(){
        $sql = 'select department.DepartmentID, department.DepartmentName, department.DepartmentDescription, user.UserID, user.FullName from user, department where user.UserID = department.LeaderID order by department.DepartmentName';
        $conn = createConnection();
    
        $result = $conn->query($sql);
        if(!$result){
            return json_encode(array('status' => 0,'message'=> $conn->error));
        }
        $data = $result->fetch_all();
        return json_encode(array('status'=>1,'message'=> 'Success.', 'data'=>$data));
    }
    
    function loadAllDepartmentNonLeader(){
        $sql = 'select distinct department.DepartmentID, department.DepartmentName, department.DepartmentDescription from  department where department.LeaderID IS NULL order by department.DepartmentName';
        $conn = createConnection();
    
        $result = $conn->query($sql);
        if(!$result){
            return json_encode(array('status' => 0,'message'=> $conn->error));
        }
        $data = $result->fetch_all();
        return json_encode(array('status'=>1,'message'=> 'Success.', 'data'=>$data));
    }

    function getDepartmentByID($id){
        $sql = 'select * from department where DepartmentID = ?';
        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('s',$id);
        if(!$stm->execute()){
            return json_encode(array('status'=>0,'message'=> 'Can not execute command.'));
        }
        $result = $stm->get_result();
        if($result -> num_rows == 0){
            return json_encode(array('status'=>0 ,'message'=> 'This department does not exist.'));
        }
        $data = $result->fetch_all();
        return json_encode(array('status'=>1,'message'=> 'Success.', 'data'=>$data));
    }

    function generateDepartmentID($name){
        $prefix = '';
        $name = strtolower($name);
        switch ($name) {
            case 'phòng kế toán':
                $prefix = 'KT';
                break;
            case 'phòng hành chính':
                $prefix = 'HC';
                break;
            case 'phòng chăm sóc khách hàng':
                $prefix = 'CSKH';
                break;
            case 'phòng nhân sự':
                $prefix = 'NS';
                break;
            case 'phòng marketing':
                $prefix = 'MKT';
                break;
            case 'phòng quản trị':
                $prefix = 'QT';
                break;
            case 'phòng công nghệ thông tin':
                $prefix = 'IT';
                break;
            case 'phòng kinh doanh':
                $prefix = 'KD';
                break;
            default:
                $prefix = 'PH';
                break;
        }
        $prefixLike = $prefix .'%';
        $sql = "SELECT * FROM department WHERE DepartmentID LIKE '". $prefixLike ."' ORDER BY DepartmentID DESC LIMIT 1";
        $conn = createConnection();
        $result = $conn->query($sql);
        if(!$result){

            return json_encode(array('code' => 0,'message'=> $conn->error));
        }
        $data = $result->fetch_all();
        if(count($data) > 0){
            $id = $data[0][0];
            $id =  substr($id, -3);
            $id = (int)$id; 
        }else{
            $id = 0;
        }
        $id = $id + 1;
        if($id< 10){
            $body = "00"."$id";
        }else if($id < 100){
            $body = "0"."$id";
        }else{
            $body = "$id";
        }
        $newDepartmentID = $prefix . $body;

        return $newDepartmentID;
    }

    function createNewDepartment($name, $room, $desc){
        $departmentID = generateDepartmentID($name);
        
        $sql = 'select * from department where DepartmentName = ?';
        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('s',$name);
        if(!$stm->execute()){
            return json_encode(array('status'=>0,'message'=> 'Can not execute command.'));
        }
        $result = $stm->get_result();
        if($result -> num_rows > 0){
            return json_encode(array('status'=> 7 ,'message'=> 'This department name has existed.'));
        }

        $sql = 'select * from department where DepartmentRoomID = ?';
        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('s',$name);
        if(!$stm->execute()){
            return json_encode(array('status'=>0,'message'=> 'Can not execute command.'));
        }
        $result = $stm->get_result();
        if($result -> num_rows > 0){
            return json_encode(array('status'=> 10 ,'message'=> 'This department room has existed.'));
        }

        $sql = 'insert into department(DepartmentID, DepartmentName, DepartmentRoomID, DepartmentDescription) values (?,?,?,?)';

        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('ssss',$departmentID, $name, $room, $desc);
        
        if(!$stm->execute())
        {
            return json_encode(array('status'=> 3,'message'=> 'Can not execute command.'));
        }
        return json_encode(array('status' => 6, 'message' => 'Added successfully.'));
    }

    function appointLeader($leader, $department){

        $sql = "update user set Role = 'Trưởng phòng' where UserID = ? and DepartmentID = ?";
        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('ss',$leader,$department);
        if(!$stm->execute())
            {
                return json_encode(array('status'=>0,'message'=> 'Can not execute command on user.'));
            }

        $sql = 'update department set LeaderID = ? where DepartmentID = ?';
        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('ss',$leader,$department);
        if(!$stm->execute())
            {
                return json_encode(array('status'=>0,'message'=> 'Can not execute command on department.'));
            }

        $sql_Statement = 'UPDATE absence SET MaxAbsenceDay = ? WHERE UserID = ?';
        $connection = createConnection();   

        $maxAbsenceDay = 15;

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('ss',$maxAbsenceDay,$leader);

        if ( !$statement->execute() ){
            return json_encode(array('status'=>false,'errorMessage'=>"Xảy ra lỗi khi thêm thông tin nghỉ phép hoặc mã nhân viên đã có thông tin nghỉ phép !"));
        };

        if ( $statement->affected_rows == 0 ){
            return json_encode(array('status'=>false,'errorMessage'=> "Thêm thông tin nghỉ phép không thành công !!!"));
        };

        return json_encode(array('status'=>1, 'message' => 'Updated'));
    }

    function removeLeader($departmentID){
        $sql = 'select * from department where DepartmentID = ?';

        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('s',$departmentID);
        if(!$stm->execute()){
            return json_encode(array('status'=>0,'message'=> 'Can not execute command1.'));
        }
        $result = $stm->get_result();
        $data = $result->fetch_all();
        $leader = $data[0][3];
 
        $sql = "update user set Role = 'Nhân viên' where DepartmentID = ? and UserID = ?";
        $conn = createConnection();
        $stm = $conn ->prepare($sql);
        $stm->bind_param('ss', $departmentID, $leader);
        if(!$stm->execute())
        {
            return json_encode(array('status'=> 3,'message'=> 'Can not execute command2.'));
        }

        $sql1 = "update department set LeaderID = Null where DepartmentID = ?";
        $conn1 = createConnection();
        $stm1 = $conn1 ->prepare($sql1);
        $stm1->bind_param('s', $departmentID);
        if(!$stm1->execute())
        {
            return json_encode(array('status'=> 3,'message'=> 'Can not execute command3.'));
        }

        $sql_Statement = 'UPDATE absence SET MaxAbsenceDay = ? WHERE UserID = ?';
        $connection = createConnection();   

        $maxAbsenceDay = 12;

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('ss',$maxAbsenceDay,$leader);

        if ( !$statement->execute() ){
            return json_encode(array('status'=>false,'errorMessage'=>"Xảy ra lỗi khi thêm thông tin nghỉ phép hoặc mã nhân viên đã có thông tin nghỉ phép !"));
        };

        if ( $statement->affected_rows == 0 ){
            return json_encode(array('status'=>false,'errorMessage'=> "Thêm thông tin nghỉ phép không thành công !!!"));
        };

        return json_encode(array('status' => 6, 'message' => 'Removed successfully.'));
    }

    function loadUserByDepartment($departmentID){
        $sql = 'select * from user where DepartmentID = ?';
        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('s',$departmentID);
        if(!$stm->execute()){
            return json_encode(array('status'=>0,'message'=> 'Can not execute command.'));
        }
        $result = $stm->get_result();
        if($result -> num_rows == 0){
            return json_encode(array('status'=>0 ,'message'=> 'This department does not exist.'));
        }
        $data = $result->fetch_all();
        return json_encode(array('status'=>1,'message'=> 'Success.', 'data'=>$data));
    }

    function loadStaffByDepartment($departmentID){
        $sql = "select * from user where DepartmentID = ? and Role = 'Nhân viên'";
        $conn = createConnection();
        $stm = $conn->prepare($sql);
        $stm->bind_param('s',$departmentID);
        if(!$stm->execute()){
            return json_encode(array('status'=>0,'message'=> 'Can not execute command.'));
        }
        $result = $stm->get_result();
        if($result -> num_rows == 0){
            return json_encode(array('status'=> 7 ,'message'=> 'This department does not have any staff.'));
        }
        $data = $result->fetch_all();
        return json_encode(array('status'=>6,'message'=> 'Success.', 'result'=>$data));
    }

    function updateDepartment($departmentID, $name, $room, $desc){
        $sql = "update department set DepartmentName = ?, DepartmentRoomID = ?, DepartmentDescription = ? where DepartmentID = ?";
        $conn = createConnection();
        $stm = $conn ->prepare($sql);
        $stm->bind_param('ssss', $name, $room, $desc, $departmentID);
        if(!$stm->execute())
        {
            return json_encode(array('status'=> 3,'message'=> 'Can not execute command.'));
        }
        return json_encode(array('status' => 6, 'message' => 'Updated successfully.'));
    }
    
    function getLeaderDepartmentID($id){
        $sql_Statement = "SELECT * FROM user WHERE user.DepartmentID = ? and user.Role = 'Trưởng phòng'";

        $connection = createConnection();

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('s', $id);

        if ( !$statement->execute() ){
            return json_encode(array('status'=>0,'errorMessage'=>"Can't execute command !"));
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return json_encode(array('status'=> 5,'result'=> "Nhân viên không tồn tại."));
        };

        $data = $result->fetch_assoc();

        return json_encode(array('status' => 6, 'result' => $data));
    }
?>