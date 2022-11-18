<?php
    require_once 'databaseConnection.php';

    function showTaskConversation( $taskID ){
        $sql_Statement = 'SELECT * FROM task_conversation WHERE TaskID = ? ORDER BY TaskConversationID';
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('s',$taskID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Lỗi thực thi");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=> false,'errorMessage'=> "Chưa có phản hồi nào");
        };

        $taskConversationList = array();

        while($row = $result->fetch_assoc()) {
            array_push($taskConversationList ,$row);
        }

        return array('status'=> true,'result'=> $taskConversationList );
    }

    function createTaskConversation($id, $taskID, $userID, $conversationDetail){
        $sql_Statement = 'INSERT INTO task_conversation(TaskConversationID, TaskID, UserID, ConversationDetail) VALUES(?, ?, ?, ?)';
        $connection = createConnection();

        $statement = $connection->prepare($sql_Statement);
        $statement->bind_param('isss', $id, $taskID, $userID, $conversationDetail);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Lỗi thực thi");
        };

        if ( $statement->affected_rows == 0 ){
            return array('status'=> false, 'errorMessage'=> "Gửi phản hồi thất bại. Vui lòng thử lại sau.");
        }

        return array('status'=> true, 'message'=> "Gửi phản hồi thành công.");
    }

    function getNewTaskConversationID($taskID){
        $sql_Statement = 'SELECT MAX(TaskConversationID) AS "MAXTaskConversationID" FROM task_conversation WHERE TaskID = ?'; 
        $connection = createConnection();   

        $statement = $connection->prepare($sql_Statement);

        $statement->bind_param('s', $taskID);

        if ( !$statement->execute() ){
            return array('status'=>false,'errorMessage'=>"Lỗi thực thi");
        };

        $result = $statement->get_result();

        if ( $result->num_rows == 0 ){
            return array('status'=>true, 'result' => 1);
        }

        $newID = $result->fetch_assoc()['MAXTaskConversationID'];
        if(empty($newID)){
            return array('status'=>true, 'result' => 1);
        }

        return array('status' => true, 'result' => intval($newID) + 1 );
    }

?>