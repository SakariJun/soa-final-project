<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (!isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID'])) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đăng nhập trước khi thực hiện chức năng này')));
}

if ($_SESSION['activated'] == 0) {
    die(json_encode(array('status' => false, 'errorMessage' => 'Vui lòng đổi mật khẩu trước khi thực hiện chức năng này')));
}

if ($_SESSION['role'] != 'Giám đốc') {
    die(json_encode(array('status' => false, 'errorMessage' => 'Chỉ giám đốc có thể truy cập')));
}

if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    http_response_code(405);
    die(json_encode(array('status' => false, 'errorMessage' => 'API chỉ hỗ trợ phương thức GET')));
};

require_once '../../DAO/UserDAO.php';
require_once '../../DAO/TaskDAO.php';

$users = getAllUsers();

if (!$users['status']) {
    return $users['errorMessage'];
}
?>

<!-- Hiển thị danh sách lương nhân viên -->
<?php

foreach ($users['result'] as $user) {
    $salary = $user['Salary'];
    $tasks = showTaskByOfficer($user['UserID']);
    $tasks_completed = 0;
    if($tasks['status']) {
        $tasks_completed = count($tasks['result']);
    }

    // Tính lương thưởng -> Công thức tính Thưởng = 1% * số công việc làm
    // Quy định thêm nhiều mốc thưởng
    // Trưởng phòng thêm 20% lương Trách nhiệm
    $bonus = $tasks_completed * 1;
    if($user['Role']=='Trưởng phòng') {
        $bonus = $bonus + 20;
    }

    // Lương thưởng
    $bonus = $salary * $bonus/100;
?>
    <!-- Item User -->
    <tr>
        <td class="text-center"><?= $user['UserID'] ?></td>
        <td class="text-center"><?= $user['FullName'] ?></td>
        <td class="text-center"><?= $user['Role'] ?></td>
        <td class="text-center"><?= number_format($salary, 0, ',', '.').' VNĐ' ?></td>
        <td class="text-center"><?= $tasks_completed ?></td>
        <td class="text-center"><?= number_format($bonus, 0, ',', '.') .' VNĐ'?></td>
        <td class="text-center">
            <button onclick="editSalary('<?= $user['UserID'] ?>')" class="btn btn-sm btn-primary">Điều chỉnh</button>
        </td>
    </tr>
<?php } ?>