<?php
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (!isset($_SESSION['username']) || !isset($_SESSION['role']) || !isset($_SESSION['userID'])) {
    header('Location: login.php');
    exit();
}

if ($_SESSION['activated'] == 0) {
    header('Location: set-new-password.php');
    exit();
}

if (!defined('isRequire')) {
    header('Location: forbidden.php');
    exit();
}

?>
<div class="wrapper">
    <div class="sidebar sidebar-default">
        <div class="sidebar-logo d-flex align-items-center">
            <a href="./index.php" class="header-logo">
                <img src="./assets/images/logo_title.png" alt="logo">
            </a>
            <div class="menu-btn-sidebar ml-0">
                <i class="fas fa-bars wrapper-menu"></i>
            </div>
        </div>
        <div>
            <nav class="sidebar-menu">
                <ul id="sidebar-toggle" class="menu">
                    <li class="active">
                        <a href="#" id="home">
                            <i class="fas fa-home"></i>
                            <span class="ml-4">Trang Chủ</span>
                        </a>
                    </li>
                    <?php
                    if ($_SESSION['role'] != "Giám đốc") {
                    ?>
                        <li class="">
                            <a href="#" id="tasks">
                                <i class="fas fa-tasks"></i>
                                <span class="ml-4">Công Việc</span>
                            </a>
                        </li>
                    <?php
                    }
                    ?>
                    <li>
                        <a href="#" data-toggle="collapse" data-target="#Staff">
                            <i class="fas fa-users"></i>
                            <span class="ml-4">Nhân Sự</span>
                            <i class="fas fa-angle-right menu-arrow"></i>
                        </a>
                        <ul id="Staff" class="submenu collapse">
                            <?php
                            if ($_SESSION['role'] == "Giám đốc") {
                            ?>
                                <li class="">
                                    <a href="#" id="add-user">
                                        <i class="fas fa-user-plus"></i>Thêm nhân viên mới
                                    </a>
                                </li>
                                <li class="">
                                    <a href='#' id="all-user">
                                        <i class="fas fa-user-friends"></i>Danh sách nhân sự
                                    </a>
                                </li>
                                <li class="">
                                    <a href='#' id="user-salary">
                                    <i class="fas fa-coins"></i>Quản lý lương
                                    </a>
                                </li>
                            <?php
                            }
                            ?>
                            <!-- Nhân viên không được sử dụng chức năng quản lý nghỉ phép -->
                            <?php
                            if ($_SESSION['role'] != "Nhân viên") {
                            ?>
                                <li class="">
                                    <a href='#' id="list-absence">
                                        <i class="fas fa-bed"></i>Quản lý nghỉ phép
                                    </a>
                                </li>
                            <?php
                            }
                            ?>
                            <!-- Chỉ có người lao động 'Trưởng phòng' hoặc 'Nhân viên' có thể xem thông tin nghỉ phép -->
                            <?php
                            if ($_SESSION['role'] != "Giám đốc") {
                            ?>
                                <li class="">
                                    <a href='#' id="employee-absence-detail">
                                        <i class="fas fa-house-user"></i>Thông tin nghỉ phép
                                    </a>
                                </li>
                            <?php
                            }
                            ?>
                        </ul>
                    </li>
                    <?php if ($_SESSION['role'] == "Giám đốc") {
                    ?>
                        <li class="">
                            <a href="#" data-toggle="collapse" data-target="#Department">
                                <i class="fas fa-cube"></i>
                                <span class="ml-4">Phòng Ban</span>
                                <i class="fas fa-angle-right menu-arrow"></i>
                            </a>
                            <ul id="Department" class="submenu collapse">
                                <li>
                                    <a href="#" id="add-department">
                                        <i class="fas fa-plus"></i>Thêm phòng ban mới
                                    </a>
                                </li>
                                <li>
                                    <a href='#' id="promoting">
                                        <i class="fas fa-people-arrows"></i>Bổ nhiệm/cắt chức
                                    </a>
                                </li>
                                <li>
                                    <a href='#' id="list-department">
                                        <i class="fas fa-cubes"></i>Danh sách phòng ban
                                    </a>
                                </li>
                            </ul>
                        </li>
                    <?php
                    } ?>
                </ul>
            </nav>
        </div>
    </div>

    <div class="top-navbar">
        <div class="navbar-custom">
            <nav class="navbar navbar-expand-md p-1">
                <div class="navbar-logo align-items-center justify-content-between">
                    <i class="fas fa-bars wrapper-menu"></i>
                    <a href="./backend/index.html" class="header-logo">
                        <span src="./assets/images/logo_title.png"></span>
                    </a>
                </div>
                <div class="navbar-breadcrumb">
                    <h5>Hệ Thống Thông tin Nội bộ</h5>
                </div>
                <div class="d-flex align-items-center">
                    <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#topNavbar" aria-controls="topNavbar">
                        <i class="fas fa-bars"></i>
                    </button> -->
                    <!-- <div class="collapse navbar-collapse pb-2" id="topNavbar"> -->
                        <ul class="navbar-nav navbar-list align-items-center">
                            <!-- Thông tin người dùng  -->
                            <li class="nav-item nav-icon dropdown caption-content">
                                <a href="#" class="search-toggle dropdown-toggle  d-flex align-items-center" id="" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <img id="navbar-avatar" src="<?= $_SESSION['avatar'] ?>" class="img-fluid rounded-circle" alt="user">
                                    <div class="caption ml-3">
                                        <h6 class="mb-0"><?= $_SESSION['user'] ?><i class="fas fa-chevron-down ml-2"></i></h6>
                                    </div>
                                </a>
                                <ul class="dropdown-menu border-none">
                                    <li class="dropdown-item d-flex">
                                        <a href="#" id="userProfile">
                                            <i class="fas fa-user-circle"></i>
                                            <span>Thông tin cá nhân</span>
                                        </a>
                                    </li>
                                    <!-- <li class="dropdown-item d-flex">
                                        <a href="#">
                                            <i class="fas fa-edit"></i>
                                            <span>Chỉnh sửa thông tin</span>
                                        </a>
                                    </li> -->
                                    <li class="dropdown-item d-flex">
                                        <a href="./app/change-password.php">
                                            <i class="fas fa-unlock"></i>
                                            <span>Thay đổi mật khẩu</span>
                                        </a>
                                    </li>
                                    <li class="dropdown-item  d-flex border-top">
                                        <a href="./app/logout.php">
                                            <i class="fas fa-sign-out-alt"></i>
                                            <span>Đăng xuất</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    <!-- </div> -->
                </div>
            </nav>
        </div>
    </div>
</div>
<div class="scroll-top">
    <i class="fas fa-arrow-up"></i>
</div>