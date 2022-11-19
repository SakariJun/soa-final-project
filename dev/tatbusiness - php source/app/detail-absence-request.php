<?php
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
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
            <h1 class="text-center text-uppercase" >Chi tiết yêu cầu nghỉ phép</h3>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            <label class="col-12 mb-3 card-title">
                <h5 >THÔNG TIN NGHỈ PHÉP</h5>
            </label>

            <div class="row">
                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_requestID" class="font-weight-bold" style="color : #605C8D !important;">Mã yêu cầu</label>
                        <input readonly value="" id="detailAbsenceRequest_requestID" class="form-control">
                    </div>
                </div>

                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_requestTime" class="font-weight-bold" style="color : #605C8D !important;">Ngày gửi yêu cầu</label>
                        <input readonly value="" id="detailAbsenceRequest_requestTime" class="form-control">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-4 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_dateBegin" class="font-weight-bold" style="color : #605C8D !important;">Ngày bắt đầu</label>
                        <input readonly value="" id="detailAbsenceRequest_dateBegin" class="form-control">
                    </div>
                </div>

                <div class="col-md-4 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_dateEnd" class="font-weight-bold" style="color : #605C8D !important;">Ngày kết thúc</label>
                        <input readonly value="" id="detailAbsenceRequest_dateEnd" class="form-control">
                    </div>
                </div>

                <div class="col-md-4 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_absenceDays" class="font-weight-bold" style="color : #605C8D !important;">Số ngày xin nghỉ</label>
                        <input readonly value="" id="detailAbsenceRequest_absenceDays" class="form-control">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-12 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_absenceReason" class="font-weight-bold" style="color : #605C8D !important;">Lí do nghỉ phép</label>
                        <textarea readonly id="detailAbsenceRequest_absenceReason" class="form-control"></textarea>
                    </div>
                </div>
            </div>

            <div class="row">
                
            </div>

            <label class="col-12 mb-3 card-title">
                <h5 >TỆP ĐÍNH KÈM</h5>
            </label>

            <div class="row">
                <div class="col-md-12 mb-2">
                    <!-- Danh sách tệp đính kèm -->
                    <table class="table rounded table-hover mt-3 mb-0" id="absence-request-table">
                        <thead>
                            <tr>
                                <th style="border-top: None;" class="text-center text-uppercase">Tên tập tin</th>
                                <th style="border-top: None;" class="text-center text-uppercase">Kiểu tập tin</th>
                                <th style="border-top: None;" class="text-center text-uppercase">Kích thước</th>
                                <th style="border-top: None;" class="text-center text-uppercase">Download</th>
                            </tr>
                        </thead>

                        <tbody id="absence_request_attachment_table">
                            <!-- let js do its job -->
                        <tbody>
                    </table>
                </div>
            </div>

            <label class="col-12 mb-3 card-title mt-3">
                <h5 >PHÊ DUYỆT YÊU CẦU</h5>
            </label>

            <div class="row">
                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_responseMessage" class="font-weight-bold text-center" style="color : #605C8D !important;">Phản hồi</label>
                        <textarea id="detailAbsenceRequest_responseMessage" class="form-control" placeholder="Điền thông tin phản hồi kết quả phê duyệt yêu cầu 'nếu có'"></textarea>
                    </div>
                </div>

                <div class="col-md-3 mb-2 d-flex align-items-center">
                    <button class="btn btn-danger" type="button" id="refusedAbsenceRequest" data-toggle="modal" data-target="#refusedAbsenceRequest-modal-dialog">
                        Từ chối yêu cầu
                    </button>
                </div>

                <div class="col-md-3 mb-2 d-flex align-items-center">
                    <button class="btn btn-success" type="button" id="approvedAbsenceRequest" data-toggle="modal" data-target="#approvedAbsenceRequest-modal-dialog">
                        Duyệt yêu cầu
                    </button>
                </div>
            </div>

            <div class="row">
            <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_absenceRequestStatus" class="font-weight-bold" style="color : #605C8D !important;">Tình trạng</label>
                        <input readonly value="" id="detailAbsenceRequest_absenceRequestStatus" class="form-control">
                    </div>
                </div>
            </div>

            <label class="col-12 mb-3 card-title">
                <h5 >THÔNG TIN NHÂN VIÊN</h5>
            </label>

            <div class="row">
                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_userID" class="font-weight-bold" style="color : #605C8D !important;">Mã số nhân viên</label>
                        <input readonly value="" id="detailAbsenceRequest_userID" class="form-control">
                    </div>
                </div>

                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_fullName" class="font-weight-bold" style="color : #605C8D !important;">Họ và Tên</label>
                        <input readonly value="" id="detailAbsenceRequest_fullName" class="form-control">
                    </div>
                </div>                            
            </div>

            <div class="row">
                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_gender" class="font-weight-bold" style="color : #605C8D !important;">Giới tính</label>
                        <input readonly value="" id="detailAbsenceRequest_gender" class="form-control">
                    </div>
                </div>

                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_DOB" class="font-weight-bold" style="color : #605C8D !important;">Ngày sinh</label>
                        <input readonly value="" id="detailAbsenceRequest_DOB" class="form-control">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_phoneNumber" class="font-weight-bold" style="color : #605C8D !important;">Số điện thoại</label>
                        <input readonly value="" id="detailAbsenceRequest_phoneNumber" class="form-control">
                    </div>
                </div>

                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_email" class="font-weight-bold" style="color : #605C8D !important;">Email cá nhân</label>
                        <input readonly value="" id="detailAbsenceRequest_email" class="form-control">
                    </div>
                </div>
            </div>
                      
            <label class="col-12 mb-3 card-title">
                <h5 >THÔNG TIN PHÒNG BAN</h5>
            </label>

            <div class="row">
                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_departmentID" class="font-weight-bold" style="color : #605C8D !important;">Mã phòng ban</label>
                        <input readonly value="" id="detailAbsenceRequest_departmentID" class="form-control">
                    </div>
                </div>

                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_departmentRoomID" class="font-weight-bold" style="color : #605C8D !important;">Văn phòng</label>
                        <input readonly value="" id="detailAbsenceRequest_departmentRoomID" class="form-control">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_departmentName" class="font-weight-bold" style="color : #605C8D !important;">Tên phòng ban</label>
                        <input readonly value="" id="detailAbsenceRequest_departmentName" class="form-control">
                    </div>
                </div>

                <div class="col-md-6 mb-2">
                    <div class="form-group">
                        <label for="detailAbsenceRequest_role" class="font-weight-bold" style="color : #605C8D !important;">Chức vụ</label>
                        <input readonly value="" id="detailAbsenceRequest_role" class="form-control">
                    </div>
                </div>
            </div>                     
        </div>  
    </div>   
</div>


<!-- Modal Dialog -->
<div id="refusedAbsenceRequest-modal-dialog" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">

            <div class="modal-header">
                <h4 class="modal-title text-center">Xác nhận từ chối yêu cầu nghỉ phép</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <p>Xác nhận từ chối yêu cầu nghỉ phép của nhân viên</p>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button id="confirm-refusedAbsenceRequest" class="btn btn-danger"  data-dismiss="modal">Xác nhận</button>
            </div>
        </div>
    </div>
</div>

<div id="approvedAbsenceRequest-modal-dialog" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">

            <div class="modal-header">
                <h4 class="modal-title text-center">Xác nhận duyệt yêu cầu nghỉ phép</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <p>Xác nhận duyệt yêu cầu nghỉ phép của nhân viên</p>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                <button id="confirm-approvedAbsenceRequest" class="btn btn-info"  data-dismiss="modal">Xác nhận</button>
            </div>
        </div>
    </div>
</div>

<div id="absenceRequestResponse-modal-dialog" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">

            <div class="modal-header">
                <h4 class="modal-title text-center">Thông báo kết quả duyệt đơn nghỉ phép</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <div class="modal-body">
                <p id="absenceRequestResponseMessage"></p>
            </div>

            <div class="modal-footer">
                <button id="confirm-refusedAbsenceRequest" class="btn btn-info"  data-dismiss="modal">Xác nhận</button>
            </div>
        </div>
    </div>
</div>

<!-- message dialog -->
