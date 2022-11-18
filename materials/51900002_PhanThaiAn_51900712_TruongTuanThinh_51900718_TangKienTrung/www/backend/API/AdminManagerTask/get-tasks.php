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

if ($_SESSION['role'] == 'Giám đốc') {
    die(json_encode(array('status' => false, 'errorMessage' => 'Giám đốc không thể sử dụng chức năng này')));
}

if ($_SERVER['REQUEST_METHOD'] != 'GET') {
    http_response_code(405);
    die(json_encode(array('status' => false, 'errorMessage' => 'API chỉ hỗ trợ phương thức GET')));
};

require_once '../../DAO/TaskDAO.php';
require_once '../../DAO/DepartmentDAO.php';

if ($_SESSION['role'] == "Trưởng phòng") {
    $leader = isLeader($_SESSION['userID']);
    $tasks = showTaskByLeader($leader['result']['DepartmentID']);
} else if ($_SESSION['role'] == "Nhân viên") {
    $tasks = showTaskByOfficer($_SESSION['userID']);
}

if (!$tasks['status']) {
    return $tasks['errorMessage'];
}
?>

<!-- Hiển thị danh sách task -->
<?php
require_once '../../DAO/UserDAO.php';

foreach ($tasks['result'] as $task) {
    $badge = "badge-primary";
    $status = $task['Status'];
    if ($status == "New") {
        $status = "Mới";
    }
    if ($status == "Rejected") {
        $badge = "badge-danger";
        $status = "Từ chối";
    } else if ($status == "In progress") {
        $badge = "badge-info";
        $status = "Đang làm";
    } else if ($status == "Canceled") {
        $badge = "badge-default";
        $status = "Đã hủy";
    } else if ($status == "Waiting") {
        $badge = "badge-warning";
        $status = "Chờ duyệt";
    } else if ($status == "Completed") {
        $badge = "badge-success";
        $status = "Hoàn thành";
    }

?>
    <!-- Item task -->
    <div class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <?php
                        if ($task['Status'] == "Completed") {
                            $rate = $task['TaskRate'];
                            if ($rate == "Good") {
                                $rateBadge = "badge-success";
                            } else if ($rate == "Bad") {
                                $rateBadge = "badge-warning";
                            } else {
                                $rateBadge = "badge-info";
                            }
                        ?>
                            <h5 class="col-9"><?= $task['TaskTitle'] ?></h5>
                            <span class="col-1 badge <?= $rateBadge ?>"><?= $rate ?></span>
                        <?php
                        } else {
                        ?>
                            <h5 class="col-10"><?= $task['TaskTitle'] ?></h5>

                        <?php
                        }
                        ?>
                        <span class="col-2 badge <?= $badge ?>"><?= $status ?></span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span><i class="fas fa-user mr-2 ml-2"></i><?= $task['FullName'] ?></span>
                        <a class="col-2 btn badge-info collapsed" href="#menu-<?= $task['TaskID'] ?>" data-toggle="collapse" role="button" aria-expanded="false">Chi tiết</a>
                    </div>
                </div>
                <div class="border-top collapse" id="menu-<?= $task['TaskID'] ?>">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-2">
                                <div class="form-group">
                                    <label class="h5">Mã công việc</label>
                                    <input type="text" readonly class="form-control" value="<?= $task['TaskID'] ?>">
                                </div>
                            </div>
                            <?php
                            if (isset($leader)) {
                                $leader = getUserInfo($task['ManagerID']);
                                if (!$leader['status']) {
                                    die(json_encode($leader));
                                }
                                $leader = $leader['result'];
                            ?>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label class="h5">Mã Trưởng phòng tạo</label>
                                        <input type="text" readonly class="form-control" value="<?= $leader['UserID'] ?>">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label class="h5">Tên Trưởng phòng</label>
                                        <input type="text" readonly class="form-control" value="<?= $leader['FullName'] ?>">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label class="h5">Email Trưởng phòng</label>
                                        <input type="text" readonly class="form-control" value="<?= $leader['Email'] ?>">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label class="h5">Mã nhân viên đảm nhận</label>
                                        <input type="text" readonly class="form-control" value="<?= $task['OfficerID'] ?>">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label class="h5">Email nhân viên</label>
                                        <input type="text" readonly class="form-control" value="<?= $task['Email'] ?>">
                                    </div>
                                </div>
                            <?php
                            } else {
                            ?>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label class="h5">Mã Trưởng phòng</label>
                                        <input type="text" readonly class="form-control" value="<?= $task['UserID'] ?>">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label class="h5">Tên Trưởng phòng</label>
                                        <input type="text" readonly class="form-control" value="<?= $task['FullName'] ?>">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-2">
                                    <div class="form-group">
                                        <label class="h5">Email Trưởng phòng</label>
                                        <input type="text" readonly class="form-control" value="<?= $task['Email'] ?>">
                                    </div>
                                </div>
                            <?php
                            }
                            ?>
                            <div class="col-md-6 mb-2">
                                <div class="form-group">
                                    <label class="h5">Ngày khởi tạo</label>
                                    <input type="date" readonly class="form-control" value="<?= date("Y-m-d", strtotime($task['DateCreate'])) ?>">
                                </div>
                            </div>
                            <div class="col-md-6 mb-2">
                                <div class="form-group">
                                    <label class="h5">Thời hạn</label>
                                    <input type="date" readonly class="form-control" value="<?= date("Y-m-d", strtotime($task['Deadline'])) ?>">
                                </div>
                            </div>
                            <div class="col-12 mb-2">
                                <div class="form-group">
                                    <label class="h5">Mô tả</label>
                                    <textarea rows="3" type="text" class="form-control" readonly><?= $task['TaskDescription'] ?></textarea>
                                </div>
                            </div>
                            <div class="col-12 mb-2">
                                <div class="form-group">
                                    <h5>Tệp đính kèm</h5>
                                    <div class="col-12">
                                        <?php
                                        require_once '../../SupportedFunction/SupportedUploadExtension.php';
                                        $path = '../../../app/tasks/' . $task['TaskID'] . '/attachments/';
                                        $files = readFolder($path);

                                        if (empty($files)) {
                                            echo "<input class='form-control' readonly placeholder='Chưa có tập tin đính kèm nào'>";
                                        } else {
                                        ?>
                                            <div class="custom-file-list">
                                                <?php

                                                foreach ($files as $file) {
                                                ?>
                                                    <!-- File list ở đây -->
                                                    <div href="<?= $file['FilePath'] ?>" class="custom-file-item"><?= $file['FileIcon'] ?>
                                                        <div class="custom-file-title"><span><?= $file['FileName'] ?></span>
                                                            <p><?= $file['FileType'] ?></p>
                                                        </div>
                                                    </div>
                                                <?php
                                                }
                                                ?>
                                            </div>
                                        <?php
                                        }
                                        ?>
                                    </div>
                                </div>
                            </div>
                            <?php
                            require_once '../../DAO/TaskConversationDAO.php';
                            $conversations = showTaskConversation($task['TaskID']);
                            if ($conversations['status']) {
                                // Có phản hồi 
                            ?>
                                <div class="col-12 mb-3 pt-3 border-top border-bottom">
                                    <h5>Phản hồi</h5>
                                    <?php
                                    $conversations = $conversations['result'];
                                    foreach ($conversations as $conversation) {
                                        $path = '../../../app/tasks/' . $task['TaskID'] . '/conversations/' . $conversation['TaskConversationID'];
                                        $files = readFolder($path);

                                        $user = getUserInfo($conversation['UserID']);
                                        if (!$user['status']) {
                                            $user['FullName'] = $conversation['UserID'];
                                        } else {
                                            $user = $user['result'];
                                        }
                                    ?>
                                        <div class="form-group">
                                            <div class="col-12">
                                                <label class="h6"><?= $user['FullName'] ?></label>
                                                <?php
                                                // Trưởng phòng
                                                if (isset($leader)) {
                                                    if ($leader['UserID'] == $conversation['UserID']) {
                                                ?>
                                                        <p class="badge badge-warning d-block text-left font-weight-normal mb-0"><?= $conversation['ConversationDetail'] ?></p>
                                                    <?php
                                                    } else {
                                                    ?>
                                                        <p class="badge badge-info d-block text-left font-weight-normal mb-0"><?= $conversation['ConversationDetail'] ?></p>
                                                    <?php
                                                    }
                                                } else {
                                                    if ($task['UserID'] == $conversation['UserID']) {
                                                    ?>
                                                        <p class="badge badge-warning d-block text-left font-weight-normal mb-0"><?= $conversation['ConversationDetail'] ?></p>
                                                    <?php
                                                    } else {
                                                    ?>
                                                        <p class="badge badge-info d-block text-left font-weight-normal mb-0"><?= $conversation['ConversationDetail'] ?></p>
                                                    <?php
                                                    }
                                                }
                                                ?>
                                                <?php
                                                if (!empty($files)) {
                                                ?>
                                                    <div class="custom-file-list">
                                                        <?php
                                                        foreach ($files as $file) {
                                                        ?>
                                                            <!-- File list ở đây -->
                                                            <div href="<?= $file['FilePath'] ?>" class="custom-file-item"><?= $file['FileIcon'] ?>
                                                                <div class="custom-file-title"><span><?= $file['FileName'] ?></span>
                                                                    <p><?= $file['FileType'] ?></p>
                                                                </div>
                                                            </div>
                                                        <?php
                                                        }
                                                        ?>
                                                    </div>
                                                <?php
                                                }
                                                ?>
                                            </div>
                                        </div>
                                <?php
                                    }
                                }
                                ?>
                                </div>
                                <div class="col-12">
                                    <div class="form-group text-right">
                                        <?php
                                        if (isset($leader)) {
                                            if ($task['Status'] == "New") {
                                        ?>
                                                <button id="task-cancel" class="btn btn-danger" data-id="<?= $task['TaskID'] ?>" data-task-name="<?= $task['TaskTitle'] ?> " data-staff-name="<?= $task['FullName'] ?>">Hủy Nhiệm vụ</button>
                                            <?php
                                            }
                                            if ($task['Status'] == "Waiting") {
                                            ?>
                                                <button id="submit" data-toggle="modal" data-target="#form-submit-task" class="btn btn-danger" data-id="<?= $task['TaskID'] ?>">Phản hồi</button>
                                                <button id="completed" data-toggle="modal" data-target="#rate-task" class="btn btn-success" data-id="<?= $task['TaskID'] ?>">Duyệt kết quả</button>
                                            <?php
                                            }
                                        } else if ($task['Status'] == 'New' || $task['Status'] == 'Rejected') {
                                            ?>
                                            <button id="task-accept" class="btn btn-success" data-id="<?= $task['TaskID'] ?>"><?= $task['Status'] == 'Rejected' ? "Làm lại" : "Bắt đầu làm" ?></button>
                                        <?php
                                        } else if ($task['Status'] == 'In progress' || $task['Status'] == 'Rejected') {
                                        ?>
                                            <button id="submit" data-toggle="modal" data-target="#form-submit-task" class="btn btn-success" data-id="<?= $task['TaskID'] ?>">Nộp báo cáo</button>
                                        <?php
                                        }
                                        ?>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php } ?>