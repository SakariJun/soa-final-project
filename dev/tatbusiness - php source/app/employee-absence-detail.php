<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
    if ( !isset($_POST['action']) ){
        header('Location: forbidden.php');
        exit();
    }

    // Nếu chưa đăng nhập thì về trang login
    if (!isset($_SESSION['username'])) {
        header('Location: login.php');
        exit();
    }

    // Nếu chưa đổi mật khẩu khi đăng nhập lần đầu thì không cho vào trang này
    if ($_SESSION['activated'] == 0) {
        header('Location: set-new-password.php');
        exit();
    }
?>

<div class="container">
    <div class="card">
        <div class="card-body">
            <h1 class="text-center text-uppercase" >Thông tin nghỉ phép</h1>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            <label class="col-12 mb-3 card-title">
                <h5 >THÔNG TIN NGHỈ PHÉP</h5>
            </label>

            <div class="row">
                <div class="col-md-4 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_maxAbsenceDay" class="font-weight-bold" style="color : #605C8D !important;">Số ngày nghỉ phép tối đa</label>
                        <input readonly value="" id="detailAbsenceRequest_maxAbsenceDay" class="form-control">
                    </div>
                </div>

                <div class="col-md-4 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_absenceDay" class="font-weight-bold" style="color : #605C8D !important;">Tổng số ngày đã nghỉ</label>
                        <input readonly value="" id="detailAbsenceRequest_absenceDay" class="form-control">
                    </div>
                </div>

                <div class="col-md-4 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_absenceDayLeft" class="font-weight-bold" style="color : #605C8D !important;">Số ngày nghỉ còn lại</label>
                        <input readonly value="" id="detailAbsenceRequest_absenceDayLeft" class="form-control">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_lastRequest" class="font-weight-bold" style="color : #605C8D !important;">Lần gửi yêu cầu gần nhất</label>
                        <input readonly value="" id="detailAbsenceRequest_lastRequest" class="form-control">
                    </div>
                </div>

                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_nextAvailableRequest" class="font-weight-bold" style="color : #605C8D !important;">Thời gian để gửi yêu cầu tiếp theo</label>
                        <input readonly value="" id="detailAbsenceRequest_nextAvailableRequest" class="form-control">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12 d-flex justify-content-center align-items-center">
                    <button onclick="checkIsAbleToCreateAbsenceRequest()" class="btn btn-success text-uppercase" type="button">
                        Tạo đơn yêu cầu nghỉ phép
                    </button>
                </div>    
            </div>

            <label class="col-12 mt-3 mb-3 card-title">
                <h5 >DANH SÁCH YÊU CẦU NGHỈ PHÉP ĐÃ TẠO</h5>
            </label>

            <div class="card">
                <table class="table rounded table-hover mt-3 mb-0" id="absence-request-table">
                    <thead>
                        <tr>
                            <th style="border-top: None;" class="text-center text-uppercase">Mã yêu cầu</th>
                            <th style="border-top: None;" class="text-center text-uppercase">Ngày bắt đầu</th>
                            <th style="border-top: None;" class="text-center text-uppercase">Ngày kết thúc</th>
                            <th style="border-top: None;" class="text-center text-uppercase">Trạng thái xử lý</th>
                            <th style="border-top: None;" class="text-center text-uppercase">Ngày gửi yêu cầu</th>
                            <th style="border-top: None;" class="text-center text-uppercase">Ngày duyệt</th>
                        </tr>
                    </thead>
                    <tbody id="absence-request-table-body" onload=''>
                        <!-- let js do its job -->
                    <tbody>
                </table>
            </div>
        </div>  
    </div>   
</div>

<!-- Modal Dialog -->
<div id="createAbsenceRequest-modal-dialog" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <form method="POST" onsubmit="return createAbsenceRequest()" id="create_absence_request_form">
                <div class="modal-header">
                    <h4 class="modal-title text-center text-uppercase">Tạo yêu cầu xin nghỉ phép</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-2">
                            <div class="form-group">
                                <label class="h5" for="create_absence_request_dateBegin">Ngày bắt đầu</label>
                                <input class="form-control" id="create_absence_request_dateBegin" name="create_absence_request_dateBegin" type="date" placeholder="" onfocusout="validateDateBegin(this)">
                            </div>
                        </div>

                        <div class="col-md-6 mb-2">
                            <div class="form-group">
                                <label class="h5" for="create_absence_request_dateEnd">Ngày kết thúc</label>
                                <input class="form-control" id="create_absence_request_dateEnd" name="create_absence_request_dateEnd" type="date" placeholder="" onfocusout="validateDateEnd(this)">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12 mb-2">
                            <div class="form-group">
                                <label class="h5" for="create_absence_request_totalAbsenceDay">Tổng số ngày muốn nghỉ</label>
                                <input readonly value="" class="form-control" id="create_absence_request_totalAbsenceDay" name="create_absence_request_totalAbsenceDay" type="text" placeholder="Tổng số ngày muốn nghỉ">
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-12 mb-2">
                            <div class="form-group">
                                <label class="h5" for="create_absence_request_absenceReason">Lí do</label>
                                <textarea class="form-control" id="create_absence_request_absenceReason" name="create_absence_request_absenceReason" placeholder="Lí do xin nghỉ phép"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12 mb-2">
                            <div class="form-group">
                                <h5>Tệp đính kèm</h5>
                                <div class="col-10">
                                    <input id="file-placeholder" class="form-control float-left" readonly placeholder="Chưa có tập tin đính kèm nào">
                                    <!-- File list ở đây -->
                                    <div id="custom-file-list" class="custom-file-list">

                                    </div>
                                </div>
                                <div class="col-2 float-right">
                                    <label class="btn btn-primary" for="attachment">
                                        <i class="fas fa-plus"></i>
                                    </label>
                                    <input hidden type="file" name="attachment[]" multiple id="attachment">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div class="col-12">
                        <div id="responseMessage" role="alert">
                        </div>
                    </div>
                    
                    <div class="col-12">
                        <div class="form-group text-center justify-content-between">
                            <button type="submit" class="btn btn-primary mt-3">Gửi yêu cầu</button>
                            <button id="reset" type="reset" class="btn btn-danger mt-3">Làm mới</button>
                        </div>
                    </div>
                </div>         
            </form> 
        </div>
    </div>
</div>

<div id="createAbsenceRequestResponse-modal-dialog" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">

            <div class="modal-header">
                <h4 class="modal-title text-center">Thông báo</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <p id="createAbsenceRequestResponseMessage"></p>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Hủy</button>
                <button class="btn btn-danger" data-dismiss="modal">Xác nhận</button>
            </div>
        </div>
    </div>
</div>