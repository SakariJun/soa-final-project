<?php
require_once 'databaseConnection.php';

function showTaskByLeader($departmentID)
{
    $sql_Statement = 'SELECT task.TaskID, task.ManagerID, task.OfficerID, user.FullName, user.Email, task.TaskTitle, task.TaskDescription, task.Status, task.Deadline, task.DateCreate, task.TaskRate FROM task
        LEFT JOIN user ON user.userID = task.OfficerID
        LEFT JOIN task_conversation ON task.TaskID = task_conversation.TaskID and task_conversation.TaskConversationID = 
        ( SELECT TaskConversationID FROM task_conversation WHERE task_conversation.TaskID = task.TaskID ORDER BY Time_Stamp DESC LIMIT 1 )
        WHERE user.DepartmentID = ?
        ORDER BY task_conversation.Time_Stamp DESC, DateCreate DESC';

    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $departmentID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Không tìm thấy task được tạo bởi trưởng phòng");
    };

    $tasks = array();

    while ($row = $result->fetch_assoc()) {
        array_push($tasks, $row);
    }

    return array('status' => true, 'result' => $tasks);
}

// Nhân viên xem danh sách task mình được giao ngoại trừ những task bị trưởng phòng Canceled
function showTaskByOfficer($officerID)
{
    $sql_Statement = 'SELECT task.TaskID, user.UserID, user.FullName, user.Email, task.TaskTitle, task.TaskDescription, task.Status, task.Deadline, task.DateCreate, task.TaskRate FROM task
        LEFT JOIN user ON user.userID = task.ManagerID
        LEFT JOIN task_conversation ON task.TaskID = task_conversation.TaskID and task_conversation.TaskConversationID = 
        ( SELECT TaskConversationID FROM task_conversation WHERE task_conversation.TaskID = task.TaskID ORDER BY Time_Stamp DESC LIMIT 1 )
        WHERE Status != "Canceled" and task.OfficerID = ?
        ORDER BY task_conversation.Time_Stamp DESC, DateCreate DESC';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $officerID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Nhân viên chưa được giao nhiệm vụ nào");
    };

    $tasks = array();

    while ($row = $result->fetch_assoc()) {
        array_push($tasks, $row);
    }

    return array('status' => true, 'result' => $tasks);
}

function getTaskByTaskID($taskID)
{
    $sql_Statement = 'SELECT * FROM task WHERE TaskID = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Không tìm thấy Nhiệm vụ này");
    };

    return array('status' => true, 'result' => $result->fetch_assoc());
}

function getRateTaskByTaskID($taskID)
{
    $sql_Statement = 'SELECT task.TaskID, task.TaskTitle, task.Deadline, task_conversation.Time_Stamp FROM task, task_conversation 
        WHERE task.TaskID = task_conversation.TaskID and task.TaskID = ? and task.Status = "Waiting"
        ORDER BY task_conversation.Time_Stamp DESC LIMIT 1';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Không tìm thấy Nhiệm vụ cần đánh giá");
    };

    return array('status' => true, 'result' => $result->fetch_assoc());
}

function cancelTask($taskID)
{
    $sql_Statement = 'UPDATE task SET Status = "Canceled" WHERE TaskID = ? and Status = "New"';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Trạng thái Nhiệm vụ hiện tại không thể hủy");
    }

    return array('status' => true, 'message' => "Hủy Nhiệm vụ giao thành công");
}

function rejectTask($taskID, $deadline)
{
    $sql_Statement = 'UPDATE task SET Status = "Rejected", Deadline = ? WHERE TaskID = ? and Status = "Waiting"';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $deadline, $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Có lỗi khi gửi phản hồi.");
    }

    return array('status' => true, 'message' => "Gửi phản hồi thành công");
}

function acceptTask($taskID)
{
    $sql_Statement = 'UPDATE task SET Status = "In progress" WHERE TaskID = ? and ( Status = "New" or  Status = "Rejected" )';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }

    return array('status' => true, 'message' => "Nhận nhiệm vụ thành công");
}

function submitTask($taskID)
{
    $sql_Statement = 'UPDATE task SET Status = "Waiting" WHERE TaskID = ? and Status = "In progress"';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('s', $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Có lỗi khi gửi báo cáo.");
    }

    return array('status' => true, 'message' => "Gửi báo cáo thành công");
}

function createTask($leaderID, $officerID, $taskTitle, $taskDescription, $deadline)
{
    $sql_Statement = 'INSERT INTO task(TaskID, ManagerID, OfficerID, TaskTitle, TaskDescription, Deadline) VALUES(? ,?, ?, ?, ?, ?)';
    $connection = createConnection();

    $newTaskID = createNewTaskID();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ssssss', $newTaskID, $leaderID, $officerID, $taskTitle, $taskDescription, $deadline);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi" . $deadline);
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Tạo công việc thất bại !!!");
    }

    return array('status' => true, 'message' => "Công việc mới đã được gửi đến Nhân viên.");
}

function createNewTaskID()
{
    $sql_Statement = 'SELECT MAX(TaskID) AS "MaxTaskID" FROM task';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    $result = $statement->get_result();

    if ($result->num_rows < 1) {
        return "TASK001";
    };

    $newID = $result->fetch_assoc()['MaxTaskID'];
    if (empty($newID)) {
        return "TASK001";
    }

    require_once '../../SupportedFunction/CreateNewID.php';
    return createNewIDWithOutPrefix($newID);
}

function setTaskStatus($taskID, $status)
{
    $sql_Statement = 'UPDATE task SET Status = ? WHERE TaskID = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $status, $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Set status cho task thất bại !!!");
    }

    return array('status' => true, 'message' => "Set status thành công !!!");
}

function isTaskCreator($leaderID, $taskID)
{
    $sql_Statement = 'SELECT * FROM task WHERE LeaderID = ? AND TaskID = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $leaderID, $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Can't execute command !");
    };

    $result = $statement->get_result();

    if ($result->num_rows == 0) {
        return array('status' => false, 'errorMessage' => "Không tìm thấy task được tạo bởi trưởng phòng !!!");
    };

    return array('status' => true, 'message' => 'Task ' . $taskID . ' Được tạo bởi Trưởng phòng ' . $leaderID);
}

function rateTask($taskID, $taskRate)
{
    $sql_Statement = 'UPDATE task SET TaskRate = ?, Status = "Completed" WHERE TaskID = ?';
    $connection = createConnection();

    $statement = $connection->prepare($sql_Statement);
    $statement->bind_param('ss', $taskRate, $taskID);

    if (!$statement->execute()) {
        return array('status' => false, 'errorMessage' => "Lỗi thực thi");
    };

    if ($statement->affected_rows == 0) {
        return array('status' => false, 'errorMessage' => "Đánh giá nhiệm vụ thất bại.");
    }

    return array('status' => true, 'message' => "Đánh giá thành công. Nhiệm vụ hoàn thành.");
}
