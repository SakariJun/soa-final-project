<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
      session_start();
    }
    
    // Nếu chưa đăng nhập thì về trang login
    if (!isset($_SESSION['username'])) {
      header('Location: login.php');
      exit();
    }

    session_destroy();
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Đăng xuất</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="shortcut icon" href="/assets/images/favicon.ico">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  <script src="/main.js"></script>
</head>

<body onload="logout()">
  <div class="container vh-100">
    <div class="row align-items-center justify-content-center h-100">
      <div class="d-none d-md-block position-absolute sticky-top mt-5">
        <img class="mt-5" src="../assets/images/logo_title.png">
      </div>
      <div class="col-md-8 col-lg-6">
        <div class="card p-4">
          <div class="card-title mb-3">
            <h4>Đăng xuất thành công</h4>
          </div>
          <p>Tài khoản của bạn đã được đăng xuất khỏi hệ thống.</p>
          <p>Nhấn <a href="./login.php">vào đây</a> để trở về trang đăng nhập, hoặc trang web sẽ tự động chuyển hướng sau <span id="counter" class="text-danger">5</span> giây nữa.</p>
          <a class="btn btn-primary px-5" href="login.php">Đăng nhập</a>
        </div>
      </div>

    </div>
  </div>

  <?php
  include_once('footer.php');
  ?>
</body>

</html>