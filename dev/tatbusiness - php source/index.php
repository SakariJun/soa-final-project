<?php
session_start();

// Nếu chưa đăng nhập thì về trang login
if (!isset($_SESSION['username'])) {
	header('Location: app/login.php');
	exit();
}

// Nếu đã đăng nhập nhưng chưa đổi mật khẩu lần đầu thì về trang đổi mật khẩu
if ($_SESSION['activated'] == 0) {
	header('Location: app/set-new-password.php');
	exit();
}

define('isRequire', TRUE);

?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
		<link rel="shortcut icon" href="./assets/images/favicon.ico">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous">
		<link rel="stylesheet" href="./style.css"> <!-- Sử dụng link tuyệt đối tính từ root, vì vậy có dấu / đầu tiên -->
		<title>Trang chủ</title>
	</head>

	<body>
		<div id="loading">
			<img src=./assets/images/logo.png>
		</div>

		<?php
			require_once "./app/header.php";
		?>

		<div class="content-page">

		</div>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
		<script src="./main.js"></script> <!-- Sử dụng link tuyệt đối tính từ root, vì vậy có dấu / đầu tiên -->
	</body>
</html>