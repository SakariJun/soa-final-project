// Loading Effect
$(window).on("load", function() {
    $("#loading").fadeOut("slow");
    $(".container").delay().fadeIn("slow");
})

// BEgin
$(document).ready(function() {
    if (window.location.href.indexOf("index.php") > -1) {
        $.ajax({
            url: './app/home-page.php',
            type: 'POST',
            data: {
                'action': "after-login"
            },
            success: function(result) {
                if (!result) {
                    $("#tasks").click();
                    return;
                }
                $(".content-page").html(result);
                $("body").removeClass("sidebar-main");
                $(".container").fadeIn();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown + "\n" + textStatus);
            }
        });
    }
})

// Toggle sidebar 
$(document).on("click", ".wrapper-menu", function() {
    $("body").toggleClass("sidebar-main");
});

// #region Ajax page-content
$(document).on("click", "#home", function() {
    $.ajax({
        url: './app/home-page.php',
        type: 'POST',
        data: {
            'action': "home"
        },
        success: function(result) {
            $(".content-page").html(result);
            $("body").removeClass("sidebar-main");
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

$(document).on("click", "#tasks", function() {
    $(".active").removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).parent('li').parent().parent('li').addClass('active');
    $.ajax({
        url: './app/task-page.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);
            $("body").removeClass("sidebar-main");

            loadAllTask();
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

$(document).on("click", "#all-user", function() {
    $(".active").removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).parent('li').parent().parent('li').addClass('active');
    $.ajax({
        url: './app/account-management.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);

            $("body").removeClass("sidebar-main");
            loadAccountList();
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

$(document).on("click", "#promoting", function() {
    $(".active").removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).parent('li').parent().parent('li').addClass('active');
    $.ajax({
        url: './app/appoint-remove.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);

            $("body").removeClass("sidebar-main");
            LoadLeadedDepartment();
            LoadNonLeadedDepartment();
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

$(document).on("click", "#list-department", function() {
    $(".active").removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).parent('li').parent().parent('li').addClass('active');
    $.ajax({
        url: './app/department-management.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);

            $("body").removeClass("sidebar-main");
            loadDepartmentList();
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

$(document).on("click", "#add-user", function() {
    $(".active").removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).parent('li').parent().parent('li').addClass('active');
    $.ajax({
        url: './app/add-account.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);
            $("body").removeClass("sidebar-main");
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

$(document).on("click", "#add-department", function() {
    $(".active").removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).parent('li').parent().parent('li').addClass('active');
    $.ajax({
        url: './app/add-department.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);

            $("body").removeClass("sidebar-main");

            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

// add fixed top navbar
$(window).on("scroll", function() {
    if ($(window).scrollTop() > 0) {
        $(".top-navbar").addClass("fixed");
        $(".scroll-top").addClass("show");
    } else {
        $(".top-navbar").removeClass("fixed");
        $(".scroll-top").removeClass("show");
    }
});

$(document).on("click", ".scroll-top", function() {
    // $(window).scrollTop(0);
    $('html, body').animate({
        scrollTop: 0
    }, 500)
})

// #endregion

// #region Chức năng xem danh sách yêu cầu nghỉ phép và duyệt yêu cầu DÀNH CHO Trưởng phòng và Giám đốc
$(document).on("click", "#list-absence", function() {
    $(".active").removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).parent('li').parent().parent('li').addClass('active');

    $.ajax({
        url: './app/absence-request-management.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);

            $("body").removeClass("sidebar-main");
            loadAbsenceRequestList();
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

// Load danh sách yêu cầu nghỉ phép
function loadAbsenceRequestList() {
    $.ajax({
        url: '../backend/API/ManagerAbsence/show-absence-request.php',
        type: 'GET',
        dataType: "json",
        contentType: "application/json",
        async: true,
        success: function(result) {

            if (!result['status']) {
                $("#absenceRequestResponseMessage").html(result['errorMessage']);
                $('#absenceRequestResponse-modal-dialog').modal('show');
                return;
            }

            let tbody = document.getElementById('absence-request-table-body');

            if (tbody != null) {
                tbody.innerHTML = '';
            }

            let absenceRequestResults = result['result'];

            for (let i = 0; i < absenceRequestResults.length; i++) {
                let absenceRequestResult = absenceRequestResults[i];

                let tr = document.createElement('tr');

                let absenceRequestID_td = document.createElement('td');
                let userID_td = document.createElement('td');
                let dateBegin_td = document.createElement('td');
                let dateEnd_td = document.createElement('td');
                let status_td = document.createElement('td');
                let dateRequest_td = document.createElement('td');
                let detailsButton_td = document.createElement('td');

                absenceRequestID_td.classList.add('py-4');
                absenceRequestID_td.classList.add('text-center');
                let div_absenceRequestID = document.createElement('div');
                div_absenceRequestID.classList.add('text-center');

                let h6_absenceRequestID = document.createElement('h6');
                h6_absenceRequestID.innerHTML = absenceRequestResult['RequestID'];

                div_absenceRequestID.appendChild(h6_absenceRequestID);
                absenceRequestID_td.appendChild(div_absenceRequestID);

                userID_td.classList.add('py-4');
                userID_td.classList.add('text-center');
                userID_td.innerHTML = absenceRequestResult['UserID'];

                dateBegin_td.classList.add('py-4');
                dateBegin_td.classList.add('text-center');
                dateBegin_td.innerHTML = formatVNDate(absenceRequestResult['DateBegin']);

                dateEnd_td.classList.add('py-4');
                dateEnd_td.classList.add('text-center');
                dateEnd_td.innerHTML = formatVNDate(absenceRequestResult['DateEnd']);

                status_td.classList.add('py-4');
                status_td.classList.add('text-center');

                let div_iconStatus = document.createElement('div');
                div_iconStatus.classList.add('small');
                div_iconStatus.classList.add('d-line');

                let i_iconStatus = document.createElement('i');
                let strongStatus = document.createElement('strong');
                strongStatus.innerHTML = " " + absenceRequestResult['Status'];

                if (absenceRequestResult['Status'] == 'Approved') {
                    i_iconStatus.classList.add('fa');
                    i_iconStatus.classList.add('fa-circle');
                    i_iconStatus.classList.add('text-success');
                } else if (absenceRequestResult['Status'] == 'Refused') {
                    i_iconStatus.classList.add('fa');
                    i_iconStatus.classList.add('fa-circle');
                    i_iconStatus.classList.add('text-danger');
                } else if (absenceRequestResult['Status'] == 'Waiting') {
                    i_iconStatus.classList.add('fa');
                    i_iconStatus.classList.add('fa-circle');
                    i_iconStatus.classList.add('text-primary');
                }

                div_iconStatus.appendChild(i_iconStatus);
                div_iconStatus.appendChild(strongStatus);
                status_td.appendChild(div_iconStatus);

                dateRequest_td.classList.add('py-4');
                dateRequest_td.classList.add('text-center');
                dateRequest_td.innerHTML = absenceRequestResult['RequestTime'];

                let div_detailsButton = document.createElement('div');
                let detailsButton = document.createElement('button');

                detailsButton.classList.add('btn');
                detailsButton.classList.add('btn-primary');
                detailsButton.classList.add('btn-sm');
                detailsButton.classList.add('d-block');
                detailsButton.classList.add('mt-1');
                detailsButton.classList.add('w-100');


                // detailsButton.setAttribute('onclick', 'showDetailAbsenceRequest('+JSON.stringify(absenceRequestResult)+')');
                detailsButton.setAttribute('onclick', 'showDetailAbsenceRequest(' + absenceRequestResult.RequestID + ')');

                detailsButton.innerHTML = 'Xem chi tiết';

                div_detailsButton.appendChild(detailsButton);
                detailsButton_td.appendChild(div_detailsButton);

                tr.appendChild(absenceRequestID_td);
                tr.appendChild(userID_td);
                tr.appendChild(dateBegin_td);
                tr.appendChild(dateEnd_td);
                tr.appendChild(status_td);
                tr.appendChild(dateRequest_td);
                tr.appendChild(detailsButton_td);

                tbody.appendChild(tr);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

// Hiện chi tiết yêu cầu nghỉ phép và thực hiện chức năng duyệt hoặc từ chối yêu cầu nghỉ phép
function showDetailAbsenceRequest(absenceRequestID) {
    $(".content-page").load("./app/detail-absence-request.php", function() {
        $("body").removeClass("sidebar-main");

        $.ajax({
            url: '../backend/API/ManagerAbsence/show-detail-absence-request.php?absenceRequestID=' + absenceRequestID,
            type: 'GET',
            dataType: "json",
            contentType: "application/json",

            success: function(result) {
                if (!result['status']) {
                    $("#absenceRequestResponseMessage").html(result['errorMessage']);
                    $('#absenceRequestResponse-modal-dialog').modal('show');
                    return;
                };

                absenceRequestDetail = result['result'];
                $("#detailAbsenceRequest_requestID").val(absenceRequestDetail.RequestID);
                $("#detailAbsenceRequest_requestTime").val(formatVNDatetime(absenceRequestDetail.RequestTime));
                $("#detailAbsenceRequest_dateBegin").val(formatVNDate(absenceRequestDetail.DateBegin));
                $("#detailAbsenceRequest_dateEnd").val(formatVNDate(absenceRequestDetail.DateEnd));

                let date1 = new Date(absenceRequestDetail.DateBegin);
                let date2 = new Date(absenceRequestDetail.DateEnd);
                let diffTime = Math.abs(date2 - date1);
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                diffDays = diffDays + 1;

                $("#detailAbsenceRequest_absenceDays").val(diffDays);
                $("#detailAbsenceRequest_absenceReason").html(absenceRequestDetail.Reason);
                $("#detailAbsenceRequest_absenceRequestStatus").val(absenceRequestDetail.Status);

                if (absenceRequestDetail.Status != "Waiting") {
                    $("#refusedAbsenceRequest").prop('disabled', true);
                    $("#approvedAbsenceRequest").prop('disabled', true);
                }

                $("#detailAbsenceRequest_userID").val(absenceRequestDetail.UserID);
                $("#detailAbsenceRequest_fullName").val(absenceRequestDetail.FullName);
                $("#detailAbsenceRequest_gender").val(absenceRequestDetail.Gender);
                $("#detailAbsenceRequest_DOB").val(formatVNDate(absenceRequestDetail.DOB));
                $("#detailAbsenceRequest_phoneNumber").val(absenceRequestDetail.PhoneNumber);
                $("#detailAbsenceRequest_email").val(absenceRequestDetail.Email);
                $("#detailAbsenceRequest_departmentID").val(absenceRequestDetail.DepartmentID);
                $("#detailAbsenceRequest_departmentRoomID").val(absenceRequestDetail.DepartmentRoomID);
                $("#detailAbsenceRequest_departmentName").val(absenceRequestDetail.DepartmentName);
                $("#detailAbsenceRequest_role").val(absenceRequestDetail.Role);

                // Load danh sách tập tin đính kèm [nếu có]
                if (result["listFile"] !== undefined) {
                    listFiles = result['listFile'];

                    let tbody = document.getElementById('absence_request_attachment_table');

                    for (let i = 0; i < listFiles.length; i++) {
                        let tr = document.createElement("tr");
                        let file = listFiles[i];

                        let td_File = document.createElement("td");
                        td_File.classList.add("text-center");
                        td_File.innerHTML = file['FileIcon'] + " " + file['FileName'];

                        let td_TYPE = document.createElement("td");
                        td_TYPE.classList.add("text-center");
                        td_TYPE.innerHTML = file['FileType'];

                        let td_SIZE = document.createElement("td");
                        td_SIZE.classList.add("text-center");
                        td_SIZE.innerHTML = file['FileSize'];

                        let td_BUTTON = document.createElement("td");
                        td_BUTTON.classList.add("text-center");

                        let download_a = document.createElement("a");
                        download_a.classList.add("btn");
                        download_a.setAttribute('href', file['FilePath']);
                        download_a.setAttribute('download', '');
                        download_a.innerHTML = '<i class="fa fa-download action"></i>';

                        td_BUTTON.appendChild(download_a);

                        tr.appendChild(td_File);
                        tr.appendChild(td_TYPE);
                        tr.appendChild(td_SIZE);
                        tr.appendChild(td_BUTTON);

                        tbody.appendChild(tr);
                    };
                }

                // Add event click xử lý 2 button duyệt và từ chối yêu cầu nghỉ phép
                $("#confirm-refusedAbsenceRequest").click(function() {
                    let sendingData =
                        JSON.stringify({ status: "Refused", absenceRequestID: absenceRequestDetail.RequestID, responseMessage: $("#detailAbsenceRequest_responseMessage").val() });

                    $.ajax({
                        url: './backend/API/ManagerAbsence/set-absence-request-status.php',
                        type: 'PUT',
                        dataType: "json",
                        contentType: "application/json",
                        data: sendingData,
                        success: function(result) {
                            if (result['status']) {
                                $("#absenceRequestResponseMessage").html(result['message']);
                                $('#absenceRequestResponse-modal-dialog').modal('show');

                                $("#refusedAbsenceRequest").prop('disabled', true);
                                $("#approvedAbsenceRequest").prop('disabled', true);

                                $("#detailAbsenceRequest_absenceRequestStatus").val("Refused");
                            } else {
                                $("#absenceRequestResponseMessage").html(result['errorMessage']);
                                $('#absenceRequestResponse-modal-dialog').modal('show');
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown + "\n" + textStatus);
                        }
                    });
                });

                $("#confirm-approvedAbsenceRequest").click(function() {
                    let sendingData =
                        JSON.stringify({ status: "Approved", absenceRequestID: absenceRequestDetail.RequestID, responseMessage: $("#detailAbsenceRequest_responseMessage").val() });

                    $.ajax({
                        url: './backend/API/ManagerAbsence/set-absence-request-status.php',
                        type: 'PUT',
                        dataType: "json",
                        contentType: "application/json",
                        data: sendingData,
                        success: function(result) {
                            if (result['status']) {
                                $("#absenceRequestResponseMessage").html(result['message']);
                                $('#absenceRequestResponse-modal-dialog').modal('show');

                                $("#refusedAbsenceRequest").prop('disabled', true);
                                $("#approvedAbsenceRequest").prop('disabled', true);

                                $("#detailAbsenceRequest_absenceRequestStatus").val("Approved");
                            } else {
                                $("#absenceRequestResponseMessage").html(result['errorMessage']);
                                $('#absenceRequestResponse-modal-dialog').modal('show');
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown + "\n" + textStatus);
                        }
                    });
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });

        $(".container").fadeIn()
    })
}
// #endregion

// #region Chức năng xem thông tin cá nhân
$(document).on("click", "#userProfile", function() {
    $(".active").removeClass('active');
    $.ajax({
        url: './app/user-profile.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);

            $("body").removeClass("sidebar-main");
            userProfile();
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

// Lấy thông tin người dùng và gán vào user profile
function userProfile() {
    $.ajax({
        url: '../backend/API/BaseFunction/get-user-detail-profile.php',
        type: 'GET',
        dataType: "json",
        contentType: "application/json",
        async: true,
        success: function(result) {
            if (result['status']) {
                let userProfile = result['result'];

                let avatar = $("#userAvatar");

                if (userProfile.Avatar == null) {
                    if (userProfile.Gender == 'Nam') {
                        avatar.attr('src', '../assets/images/users/DefaultAvatar/Male_Default.png');
                    } else if (userProfile.Gender == 'Nữ') {
                        avatar.attr('src', '../assets/images/users/DefaultAvatar/Female_Default.png');
                    }
                } else {
                    let srcToUserAvatar = '../app/users/' + userProfile.UserID + '/' + userProfile.Avatar;
                    avatar.attr('src', srcToUserAvatar);
                }

                avatar.data('src', avatar.attr('src'));
                $('#userprofile_username').val(userProfile.Username);
                $('#userprofile_userID').val(userProfile.UserID);
                $('#userprofile_fullName').val(userProfile.FullName);
                $('#userprofile_gender').val(userProfile.Gender);
                $('#userprofile_DOB').val(formatVNDate(userProfile.DOB));
                $('#userprofile_phoneNumber').val(userProfile.PhoneNumber);
                $('#userprofile_email').val(userProfile.Email);
                $('#userprofile_role').val(userProfile.Role);

                if (userProfile.Role != 'Giám đốc') {
                    $('#userprofile_departmentID').val(userProfile.DepartmentID);
                    $('#userprofile_departmentRoomID').val(userProfile.DepartmentRoomID);
                    $('#userprofile_departmentName').val(userProfile.DepartmentName);

                    if (userProfile.Role != 'Trưởng phòng') {
                        $('#userprofile_leaderID').val(userProfile.LeaderID);
                        $('#userprofile_leaderName').val(userProfile.LeaderName);
                        $('#userprofile_leaderPhone').val(userProfile.LeaderPhone);
                        $('#userprofile_leaderEmail').val(userProfile.LeaderEmail);
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
}
// #endregion

// #region Chức năng xem chi tiết yêu cầu nghỉ phép của người lao động và danh sách các yêu cầu nghỉ phép đã gửi
$(document).on("click", "#employee-absence-detail", function() {
    $(".active").removeClass('active');
    $(this).parent('li').addClass('active');
    $(this).parent('li').parent().parent('li').addClass('active');
    $.ajax({
        url: './app/employee-absence-detail.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);

            $("body").removeClass("sidebar-main");
            loadEmployeeAbsenceDetail();
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
})

// Xem thông tin nghỉ phép của Người lao động [Trưởng phòng hoặc Nhân viên]
function loadEmployeeAbsenceDetail() {
    $.ajax({
        url: '../backend/API/ManagerAbsence/get-absence-information.php',
        type: 'GET',
        dataType: "json",
        contentType: "application/json",
        success: function(result) {
            if (result['status']) {

                let employeeAbsenceDetail = result['result'];

                $("#detailAbsenceRequest_maxAbsenceDay").val(employeeAbsenceDetail.MaxAbsenceDay);
                $("#detailAbsenceRequest_absenceDay").val(employeeAbsenceDetail.DayAbsence);
                $("#detailAbsenceRequest_absenceDayLeft").val(parseInt(employeeAbsenceDetail.MaxAbsenceDay) - parseInt(employeeAbsenceDetail.DayAbsence));

                let lastRequest = employeeAbsenceDetail.LastRequest == null ? 'Chưa gửi yêu cầu nghỉ phép' : formatVNDatetime(employeeAbsenceDetail.LastRequest);

                if (employeeAbsenceDetail.LastRequest != null) {
                    let nextRequestDate = new Date(employeeAbsenceDetail.LastRequest);
                    nextRequestDate.setDate(nextRequestDate.getDate() + 7);
                    $("#detailAbsenceRequest_nextAvailableRequest").data("nextRequestDate", nextRequestDate);

                    nextRequestDate = convertJSDateToVNDateTime(nextRequestDate)
                    $("#detailAbsenceRequest_nextAvailableRequest").val(nextRequestDate);
                }

                $("#detailAbsenceRequest_lastRequest").val(lastRequest);

                // load danh sách các yêu cầu nghỉ phép người lao động đã gửi
                $.ajax({
                    url: '../backend/API/ManagerAbsence/get-employee-absence-request.php',
                    type: 'GET',
                    dataType: "json",
                    contentType: "application/json",
                    success: function(result) {
                        if (result['status']) {
                            let tbody = document.getElementById('absence-request-table-body');

                            if (tbody != null) {
                                tbody.innerHTML = '';
                            }

                            let absenceRequestResults = result['result'];

                            for (let i = 0; i < absenceRequestResults.length; i++) {
                                let absenceRequestResult = absenceRequestResults[i];

                                let tr = document.createElement('tr');

                                let absenceRequestID_td = document.createElement('td');
                                let dateBegin_td = document.createElement('td');
                                let dateEnd_td = document.createElement('td');
                                let status_td = document.createElement('td');
                                let dateRequest_td = document.createElement('td');
                                let detailsButton_td = document.createElement('td');

                                let responseTime_td = document.createElement('td');

                                responseTime_td.classList.add('py-4');
                                responseTime_td.classList.add('text-center');
                                responseTime_td.innerHTML = absenceRequestResult['ResponseTime'] == null ? 'Chưa được duyệt' : formatVNDatetime(absenceRequestResult['ResponseTime']);

                                absenceRequestID_td.classList.add('py-4');
                                absenceRequestID_td.classList.add('text-center');
                                let div_absenceRequestID = document.createElement('div');
                                div_absenceRequestID.classList.add('text-center');

                                let h6_absenceRequestID = document.createElement('h6');
                                h6_absenceRequestID.innerHTML = absenceRequestResult['RequestID'];

                                div_absenceRequestID.appendChild(h6_absenceRequestID);
                                absenceRequestID_td.appendChild(div_absenceRequestID);

                                dateBegin_td.classList.add('py-4');
                                dateBegin_td.classList.add('text-center');
                                dateBegin_td.innerHTML = formatVNDate(absenceRequestResult['DateBegin']);

                                dateEnd_td.classList.add('py-4');
                                dateEnd_td.classList.add('text-center');
                                dateEnd_td.innerHTML = formatVNDate(absenceRequestResult['DateEnd']);

                                status_td.classList.add('py-4');
                                status_td.classList.add('text-center');

                                let div_iconStatus = document.createElement('div');
                                div_iconStatus.classList.add('small');
                                div_iconStatus.classList.add('d-line');

                                let i_iconStatus = document.createElement('i');
                                let strongStatus = document.createElement('strong');
                                strongStatus.innerHTML = " " + absenceRequestResult['Status'];

                                if (absenceRequestResult['Status'] == 'Approved') {
                                    i_iconStatus.classList.add('fa');
                                    i_iconStatus.classList.add('fa-circle');
                                    i_iconStatus.classList.add('text-success');
                                } else if (absenceRequestResult['Status'] == 'Refused') {
                                    i_iconStatus.classList.add('fa');
                                    i_iconStatus.classList.add('fa-circle');
                                    i_iconStatus.classList.add('text-danger');
                                } else if (absenceRequestResult['Status'] == 'Waiting') {
                                    i_iconStatus.classList.add('fa');
                                    i_iconStatus.classList.add('fa-circle');
                                    i_iconStatus.classList.add('text-primary');
                                }

                                div_iconStatus.appendChild(i_iconStatus);
                                div_iconStatus.appendChild(strongStatus);
                                status_td.appendChild(div_iconStatus);

                                dateRequest_td.classList.add('py-4');
                                dateRequest_td.classList.add('text-center');
                                dateRequest_td.innerHTML = formatVNDatetime(absenceRequestResult['RequestTime']);

                                let div_detailsButton = document.createElement('div');
                                let detailsButton = document.createElement('button');

                                detailsButton.classList.add('btn');
                                detailsButton.classList.add('btn-primary');
                                detailsButton.classList.add('btn-sm');
                                detailsButton.classList.add('d-block');
                                detailsButton.classList.add('mt-1');
                                detailsButton.classList.add('w-100');

                                // detailsButton.setAttribute('onclick', 'showDetailAbsenceRequest('+JSON.stringify(absenceRequestResult)+')');
                                detailsButton.setAttribute('onclick', 'showDetailEmployeeAbsenceRequest(' + absenceRequestResult.RequestID + ')');

                                detailsButton.innerHTML = 'Xem chi tiết';

                                div_detailsButton.appendChild(detailsButton);
                                detailsButton_td.appendChild(div_detailsButton);

                                tr.appendChild(absenceRequestID_td);
                                tr.appendChild(dateBegin_td);
                                tr.appendChild(dateEnd_td);
                                tr.appendChild(status_td);
                                tr.appendChild(dateRequest_td);
                                tr.appendChild(responseTime_td);
                                tr.appendChild(detailsButton_td);

                                tbody.appendChild(tr);
                            }
                        } else {
                            // không có yêu cầu nghỉ phép
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        alert(errorThrown);
                    }
                });
            } else {

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

// Hiện chi tiết yêu cầu nghỉ phép và nhưng không thể thực hiện chức năng duyệt hoặc từ chối yêu cầu nghỉ phép
function showDetailEmployeeAbsenceRequest(absenceRequestID) {
    $.ajax({
        url: './app/detail-employee-absence-request.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);
            $("body").removeClass("sidebar-main");

            $.ajax({
                url: '../backend/API/ManagerAbsence/show-detail-absence-request.php?absenceRequestID=' + absenceRequestID,
                type: 'GET',
                dataType: "json",
                contentType: "application/json",

                success: function(result) {
                    if (result['status']) {
                        absenceRequestDetail = result['result'];

                        $("#detailAbsenceRequest_status").val(absenceRequestDetail.Status);

                        if (absenceRequestDetail.ResponseTime == null || absenceRequestDetail.ResponseTime == "") {
                            $("#detailAbsenceRequest_responseTime").val("Chưa được duyệt");
                        } else {
                            $("#detailAbsenceRequest_responseTime").val(formatVNDatetime(absenceRequestDetail.ResponseTime));
                        }

                        $("#detailAbsenceRequest_responseMessage").val(absenceRequestDetail.ResponseMessage);

                        $("#detailAbsenceRequest_requestID").val(absenceRequestDetail.RequestID);
                        $("#detailAbsenceRequest_requestTime").val(formatVNDatetime(absenceRequestDetail.RequestTime));
                        $("#detailAbsenceRequest_dateBegin").val(formatVNDate(absenceRequestDetail.DateBegin));
                        $("#detailAbsenceRequest_dateEnd").val(formatVNDate(absenceRequestDetail.DateEnd));

                        let date1 = new Date(absenceRequestDetail.DateBegin);
                        let date2 = new Date(absenceRequestDetail.DateEnd);
                        let diffTime = Math.abs(date2 - date1);
                        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        diffDays = diffDays == 0 ? 1 : diffDays + 1;

                        $("#detailAbsenceRequest_absenceDays").val(diffDays);
                        $("#detailAbsenceRequest_absenceReason").html(absenceRequestDetail.Reason);
                        $("#detailAbsenceRequest_userID").val(absenceRequestDetail.UserID);
                        $("#detailAbsenceRequest_fullName").val(absenceRequestDetail.FullName);
                        $("#detailAbsenceRequest_gender").val(absenceRequestDetail.Gender);
                        $("#detailAbsenceRequest_DOB").val(formatVNDate(absenceRequestDetail.DOB));
                        $("#detailAbsenceRequest_phoneNumber").val(absenceRequestDetail.PhoneNumber);
                        $("#detailAbsenceRequest_email").val(absenceRequestDetail.Email);
                        $("#detailAbsenceRequest_departmentID").val(absenceRequestDetail.DepartmentID);
                        $("#detailAbsenceRequest_departmentRoomID").val(absenceRequestDetail.DepartmentRoomID);
                        $("#detailAbsenceRequest_departmentName").val(absenceRequestDetail.DepartmentName);
                        $("#detailAbsenceRequest_role").val(absenceRequestDetail.Role);

                        if (result["listFile"] !== undefined) {
                            listFiles = result['listFile'];
                            let tbody = document.getElementById('absence_request_attachment_table');

                            for (let i = 0; i < listFiles.length; i++) {
                                let tr = document.createElement("tr");
                                let file = listFiles[i];

                                let td_File = document.createElement("td");
                                td_File.classList.add("text-center");
                                td_File.innerHTML = file['FileIcon'] + " " + file['FileName'];

                                let td_TYPE = document.createElement("td");
                                td_TYPE.classList.add("text-center");
                                td_TYPE.innerHTML = file['FileType'];

                                let td_SIZE = document.createElement("td");
                                td_SIZE.classList.add("text-center");
                                td_SIZE.innerHTML = file['FileSize'];

                                let td_BUTTON = document.createElement("td");
                                td_BUTTON.classList.add("text-center");

                                let download_a = document.createElement("a");
                                download_a.classList.add("btn");
                                download_a.setAttribute('href', file['FilePath']);
                                download_a.setAttribute('download', '');
                                download_a.innerHTML = '<i class="fa fa-download action"></i>';

                                td_BUTTON.appendChild(download_a);

                                tr.appendChild(td_File);
                                tr.appendChild(td_TYPE);
                                tr.appendChild(td_SIZE);
                                tr.appendChild(td_BUTTON);

                                tbody.appendChild(tr);
                            };
                        }
                    } else {
                        // Fail..
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown);
                }
            });

            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
}

// #endregion

// #region Chức năng gửi yêu cầu xin nghỉ phép của người lao động
function validateDateBegin(dateBegin) {
    validateInputTypeDatePastValue(dateBegin);
    checkDayLeft();
}

function validateDateEnd(dateEnd) {
    validateInputTypeDatePastValue(dateEnd);
    checkDayLeft();
}

// Đặt lại value của input type="date" là ngày mai
function setDefaultInputTypeDateValueTomorrow(inputTypeDate) {
    let today = new Date();
    today.setDate(today.getDate() + 1);
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    inputTypeDate.value = today;
}

// Kiểm tra xem value của input type="date" có phải là ngày trong quá khứ hay không
function validateInputTypeDatePastValue(inputTypeDate) {
    let tomorrow = new Date();
    tomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate() + 1);

    if (new Date(inputTypeDate.value) < tomorrow) {
        fadeError("Không thể chọn ngày trong quá khứ hoặc hôm nay. Vui lòng chọn ngày nghỉ phép ít nhất sau ngày hôm nay !!!");
        setDefaultInputTypeDateValueTomorrow(inputTypeDate);
    }
}

// Sau khi đã chọn ngày bắt đầu - ngày kết thúc => Check xem số ngày nghỉ còn lại có đáp ứng được không
function checkDayLeft() {
    let dayLeft = $("#detailAbsenceRequest_absenceDayLeft").val().trim();
    let dateBegin = $("#create_absence_request_dateBegin");
    let dateEnd = $("#create_absence_request_dateEnd");

    if (dateBegin.val().trim() == "") {
        return;
    }

    if (dateEnd.val().trim() == "") {
        return;
    }

    let date1 = new Date(dateBegin.val().trim());
    let date2 = new Date(dateEnd.val().trim());

    if (date2 < date1) {
        fadeError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
        dateEnd.val(dateBegin.val());
        return;
    }

    let diffTime = Math.abs(date2 - date1);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Set lại ngày kết thúc = Ngày bắt đầu + số ngày nghỉ còn lại
    if (diffDays + 1 > dayLeft) {
        date1.setDate(parseInt(date1.getDate()) + parseInt(dayLeft) - 1);

        let dd = String(date1.getDate()).padStart(2, '0');
        let mm = String(date1.getMonth() + 1).padStart(2, '0');
        let yyyy = date1.getFullYear();

        let maximumAbsenceDay = yyyy + '-' + mm + '-' + dd;
        fadeError("Số ngày nghỉ còn lại không đủ. Chỉ có thể nghỉ đến hết ngày " + formatVNDate(maximumAbsenceDay));
        dateEnd.val(maximumAbsenceDay);

        $("#create_absence_request_totalAbsenceDay").val(dayLeft);
    } else {
        $("#create_absence_request_totalAbsenceDay").val(diffDays + 1);
    }
}

// Check xem có đủ điều kiện để gửi yêu cầu không? Số ngày nghỉ còn lại = 0, chưa tới lượt gửi request tiếp theo
function checkIsAbleToCreateAbsenceRequest() {
    let dayLeft = $("#detailAbsenceRequest_absenceDayLeft").val().trim();

    if (dayLeft == 0) {
        $("#createAbsenceRequestResponse-modal-dialog").modal("show");
        $("#createAbsenceRequestResponseMessage").html("Bạn đã dùng hết số ngày nghỉ phép trong năm !!!");
        return;
    }

    let nextRequestDate = new Date($("#detailAbsenceRequest_nextAvailableRequest").data("nextRequestDate"));

    if (nextRequestDate > new Date()) {
        $("#createAbsenceRequestResponse-modal-dialog").modal("show");
        $("#createAbsenceRequestResponseMessage").html("Vui lòng đợi đến " + $("#detailAbsenceRequest_nextAvailableRequest").val() + " để có thể gửi yêu cầu tiếp theo !!!");
        return;
    }

    $("#createAbsenceRequest-modal-dialog").modal("show");
}

// Tạo yêu cầu nghỉ phép
function createAbsenceRequest() {
    let dateBegin = $("#create_absence_request_dateBegin").val().trim();
    let dateEnd = $("#create_absence_request_dateEnd").val().trim();
    let reason = $("#create_absence_request_absenceReason").val().trim();

    if (dateBegin == "") {
        fadeError("Vui lòng chọn ngày bắt đầu nghỉ.");
        return false;
    }

    if (dateEnd == "") {
        fadeError("Vui lòng chọn ngày kết thúc nghỉ.");
        return false;
    }

    if (reason == "") {
        fadeError("Vui lòng thêm lí do xin nghỉ phép.");
        return false;
    }

    files = []
    if ($("#attachment").data("files") != null) {
        files = $("#attachment").data("files");
    }

    files = []
    if ($("#attachment").data("files") != null) {
        files = $("#attachment").data("files");
    }

    var formData = new FormData();
    formData.append("date_Begin", dateBegin)
    formData.append("date_End", dateEnd)
    formData.append("reason", reason)

    for (let i = 0; i < files.length; i++) {
        formData.append("absenceAttachment[]", files[i])
    }

    $.ajax({
        url: './backend/API/ManagerAbsence/create-absence-request.php',
        type: 'POST',
        dataType: "json",
        caches: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function(result) {
            if (!result['status']) {
                fadeError(result['errorMessage']);
                return;
            }

            fadeResult(result['message']);
            loadEmployeeAbsenceDetail();
        },
        error: function(error) {
            console.log(error);
        },
        xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#message").html("Chờ chút nha...");
            // Upload progress
            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    let percent = (e.loaded / e.total) * 100
                    $("#progress-bar").width(percent + '%')
                }
            }
            return xhr
        }
    });

    return false;
}
// #endregion

//#region Chức năng đăng nhập
// Xác thực input lúc đăng nhập và AJAX đăng nhập
function validateLogin() {
    let username = $('#username')
    let password = $('#password')

    let usernameValue = username.val().trim();
    let passwordValue = password.val().trim();

    if ( $('#remember').is(":checked") ){
        let userData = JSON.stringify({ username: usernameValue});

        $.ajax({
            url: '../backend/SupportedFunction/SetCookie.php',
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: userData,
            success: function(result) {
                console.log(result);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown + "\n" + textStatus);
            }
        });
    }

    if (usernameValue.length == 0) {
        fadeError("Vui lòng nhập tên tài khoản !!!");
        username.focus();
        return false;
    } else if (passwordValue.length == 0) {
        fadeError("Vui lòng nhập mật khẩu !!!");
        password.focus();
        return false;
    } else if (passwordValue.length < 6) {
        fadeError("Mật khẩu phải có ít nhất 6 ký tự !!!");
        password.focus();
        return false;
    }

    

    // GỌI AJAX VALIDATE 
    let userData = JSON.stringify({ username: usernameValue, password: passwordValue });

    $.ajax({
        url: '../backend/API/BaseFunction/validate-login.php',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userData,
        success: function(result) {
            if (!result['status']) {
                fadeError(result['errorMessage'])
                return false;
            } else if (result['code'] == '300') {
                // Đăng nhập thành công nhưng chưa đổi mật khẩu lần đầu
                window.location.href = 'set-new-password.php';
                return false;
            } else {
                // Đăng nhập thành công + đã đổi mật khẩu
                window.location.href = '../index.php';
                return false;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });

    $("#responseMessage").hide();
    return false;
}
// #endregion

//#region Chức năng đổi mật khẩu khi đăng nhập lần đầu hoặc sau khi reset password
// Xác thực input lúc đổi mật khẩu và AJAX đổi mật khẩu không cần nhập mật khẩu cũ
function changePassword() {
    let password = $('#password')
    let password_confirm = $('#password_confirm')

    let passwordValue = password.val().trim();
    let password_confirmValue = password_confirm.val().trim();

    if (passwordValue.length == 0) {
        fadeError("Vui lòng điền mật khẩu mới !!!");
        password.focus();
        return false;
    } else if (password_confirmValue.length == 0) {
        fadeError("Vui lòng điền mật khẩu xác nhận !!!");
        password_confirm.focus();
        return false;
    } else if (passwordValue.length < 6) {
        fadeError("Mật khẩu phải có ít nhất 6 ký tự !!!");
        password.focus();
        return false;
    } else if (passwordValue != password_confirmValue) {
        fadeError("Mật khẩu không khớp vui lòng nhập lại !!!");
        password_confirm.focus();
        return false;
    } else if (passwordValue == $("#username").val().trim()) {
        fadeError("Mật khẩu mới phải khác mật khẩu mặc định !!!");
        password.focus();
        return false;
    }

    // GỌI AJAX VALIDATE 
    let userData = JSON.stringify({ password: passwordValue, password_confirm: password_confirmValue });

    $.ajax({
        url: '../backend/API/BaseFunction/require-change-password.php',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userData,
        success: function(result) {
            if (!result['status']) {
                fadeError(result['errorMessage'])
                return false;
            }

            window.location.href = '../index.php';
            return false;
        }
    });

    $("#responseMessage").hide();
    return false;
}
// #endregion

// #region Chức năng người dùng đổi mật khẩu
// Xác thực input lúc đổi mật khẩu và AJAX đổi mật khẩu cần nhập mật khẩu cũ
function userChangePassword() {
    let oldPassword = $('#oldPassword');
    let newPassword = $('#newPassword')
    let newPassword_confirm = $('#newPassword_confirm')

    let oldPasswordValue = oldPassword.val().trim();
    let newPasswordValue = newPassword.val().trim();
    let newPassword_confirmValue = newPassword_confirm.val().trim();

    if (oldPasswordValue.length == 0) {
        fadeError("Vui lòng điền mật khẩu cũ !!!");
        oldPassword.focus();
        return false;
    } else if (newPasswordValue.length == 0) {
        fadeError("Vui lòng điền mật khẩu mới !!!");
        newPassword.focus();
        return false;
    } else if (newPassword_confirmValue.length == 0) {
        fadeError("Vui lòng xác nhận mật khẩu mới !!!");
        newPassword_confirm.focus();
        return false;
    } else if (oldPasswordValue.length < 6) {
        fadeError("Mật khẩu cũ phải có ít nhất 6 ký tự !!!");
        oldPassword.focus();
        return false;
    } else if (newPasswordValue.length < 6) {
        fadeError("Mật khẩu mới phải có ít nhất 6 ký tự !!!");
        newPassword.focus();
        return false;
    } else if (newPassword_confirmValue.length < 6) {
        fadeError("Mật khẩu mới phải có ít nhất 6 ký tự !!!");
        newPassword_confirm.focus();
        return false;
    } else if (newPasswordValue != newPassword_confirmValue) {
        fadeError("Mật khẩu mới không khớp vui lòng nhập lại !!!");
        newPassword_confirm.focus();
        return false;
    } else if (oldPasswordValue == newPasswordValue) {
        fadeError("Mật khẩu mới phải khác mật khẩu cũ !!!");
        newPassword.focus();
        return false;
    }

    // GỌI AJAX Đổi mật khẩu user
    let userData = JSON.stringify({ oldPassword: oldPasswordValue, newPassword: newPasswordValue, newPassword_confirm: newPassword_confirmValue });

    $.ajax({
        url: '../backend/API/BaseFunction/user-change-password.php',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userData,
        success: function(result) {
            if (!result['status']) {
                fadeError(result['errorMessage'])
                return false;
            }

            fadeResult(result['message'])
            return false;
        }
    });

    $("#responseMessage").hide();
    return false;
}
// #endregion

// #region Chức năng gửi yêu cầu đặt lại mật khẩu
// Gửi yêu cầu đặt lại mật khẩu bằng tên đăng nhập + email + số điện thoại nhân viên
function sendResetPasswordRequest() {
    let username = $('#username');
    let email = $('#email');
    let phoneNumber = $('#phoneNumber');

    let usernameValue = username.val().trim();
    let emailValue = email.val().trim();
    let phoneNumberValue = phoneNumber.val().trim();

    if (usernameValue.length == 0) {
        fadeError("Vui lòng nhập tên tài khoản !!!");
        username.focus();
        return false;
    } else if (emailValue.length == 0) {
        fadeError("Vui lòng nhập email nhân viên !!!");
        email.focus();
        return false;
    } else if (phoneNumberValue.length == 0) {
        fadeError("Vui lòng nhập số điện thoại nhân viên !!!");
        phoneNumber.focus();
        return false;
    } else if (!validateEmail(emailValue)) {
        fadeError("Email không hợp lệ vui lòng nhập lại !!!");
        email.focus();
        return false;
    }

    // GỌI AJAX
    let userData = JSON.stringify({ username: usernameValue, email: emailValue, phoneNumber: phoneNumberValue });

    $.ajax({
        url: '../backend/API/BaseFunction/send-reset-password-request.php',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        async: true,
        data: userData,
        success: function(result) {
            if (!result['status']) {
                fadeError(result['errorMessage']);
                return false;
            } else {
                $("form")[0].reset();
                fadeResult(result['message']);
                return false;
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown + "\n" + textStatus);
        }
    });

    $("#responseMessage").hide();
    return false;
}
// #endregion

//#region Chức năng đổi ảnh đại diện của người dùng
// Bật tắt button đổi avatar
$(document).on("change", "#avatarUploaded", function() {
    if ($('#avatarUploaded')[0].files.length < 1) {
        $("#setNewAvatar").prop('disabled', true);
        $("#userAvatar").attr("src", $("#userAvatar").data('src'));
        return;
    }
    if ($('#avatarUploaded')[0].files[0].size > 1024 * 1024 * 5) {
        fadeError("Vui lòng chọn file ảnh nhỏ hơn 5MB");
        return;
    }
    $("#setNewAvatar").prop('disabled', false);
    var reader = new FileReader();

    reader.onload = function() {
        document.getElementById("userAvatar").setAttribute('src', reader.result);
        // $("#userAvatar").attr("src", reader.result);
    }

    reader.readAsDataURL($('#avatarUploaded')[0].files[0]);
})


$(document).on("click", "#setNewAvatar", function() {
    let avatarUploaded = $('#avatarUploaded').prop('files')[0];

    let avatarUploadedExtension = avatarUploaded.type;

    const supportedExtension = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

    if (supportedExtension.includes(avatarUploadedExtension)) {

        var form_data = new FormData();
        form_data.append('avatarUploaded', avatarUploaded);

        $.ajax({
            url: '../backend/API/BaseFunction/change-user-avatar.php',
            type: 'POST',
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            success: function(result) {
                if (result['status']) {
                    fadeResult(result['message']);
                    $("#navbar-avatar").prop("src", $("#userAvatar").attr("src"));
                    $('#avatarUploaded').val('')
                    $("#setNewAvatar").prop('disabled', true);
                } else {
                    fadeError(result['errorMessage']);
                };
            }
        });
    } else {
        fadeError('Không hỗ trợ dịnh dạng ảnh này !!!');
    }
});

// #endregion

//#region FUNCTION Hỗ trợ
function formatVNDate(date) {
    let dd = date.split('-')[2];
    let mm = date.split('-')[1];
    let yyyy = date.split('-')[0];

    return dd + '/' + mm + '/' + yyyy;
}

function formatVNDatetime(dateTime) {
    let date = dateTime.split(' ')[0];

    return formatVNDate(date) + " " + dateTime.split(' ')[1];
}

function convertJSDateToVNDateTime(jsDate) {
    let date = jsDate.getDate();
    let month = jsDate.getMonth() + 1;
    let year = jsDate.getFullYear();

    let hour = jsDate.getHours().toString().length == 1 ? "0" + jsDate.getHours().toString() : jsDate.getHours();
    let minute = jsDate.getMinutes().toString().length == 1 ? "0" + jsDate.getMinutes().toString() : jsDate.getMinutes();
    let second = jsDate.getSeconds().toString().length == 1 ? "0" + jsDate.getSeconds().toString() : jsDate.getSeconds();

    return date + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + second;
}

function validateEmail(email) { //Validates the email address
    let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email);
}
//#endregion

//#region CODED BY 51900002
function loadAccountList() {
    // clear table

    let tbody = document.getElementById('user-account-table-body');
    if (tbody != null) {
        tbody.innerHTML = '';
    }
    let ajax = new XMLHttpRequest();
    ajax.open('GET', './backend/API/AdminManagerAccount/get-forgot-account-first.php', 'true');
    ajax.send();
    ajax.reponseType = 'json';
    ajax.addEventListener('readystatechange', () => {
        if (ajax.readyState === 4 && ajax.status === 200) {
            let json = JSON.parse(ajax.response);
            json.data.forEach((i) => {
                // console.log(i)

                let id = document.createElement('td');
                let name = document.createElement('td');
                let username = document.createElement('td');
                let role = document.createElement('td');
                let gmail = document.createElement('td')
                let active = document.createElement('td');

                //id
                let div1 = document.createElement('div');
                div1.classList.add('text-center');
                let h6 = document.createElement('h6');
                h6.id = "userID";
                h6.innerHTML = i[0];
                let userID = i[0];
                div1.appendChild(h6);
                id.append(div1)
                let tr = document.createElement('tr');
                id.classList.add('py-4')
                tr.appendChild(id);


                //name
                name.id = "user-name";
                name.innerHTML = i[1];
                let userName = i[1];
                name.classList.add('py-4')
                name.classList.add('text-center');
                tr.appendChild(name);

                username.id = "username";
                username.innerHTML = i[2];
                username.classList.add('py-4');
                username.classList.add('text-center');
                tr.appendChild(username);

                role.id = "role";
                role.innerHTML = i[3];
                role.classList.add('py-4');
                role.classList.add('text-center');
                tr.appendChild(role);

                gmail.id = "user-gmail";
                gmail.innerHTML = i[4];
                gmail.classList.add('py-4')
                gmail.classList.add('text-center');
                tr.appendChild(gmail)

                let div2 = document.createElement('div');
                let i2 = document.createElement('i');
                let strong = document.createElement('strong');
                i2.setAttribute("aria-hidden", "true");
                div2.classList.add('small')
                div2.classList.add('d-inline');

                if (i[5] == "0") {
                    i2.classList.add('fa');
                    i2.classList.add('fa-circle');
                    i2.classList.add('text-danger');
                    strong.innerHTML = ' Inactive';
                } else {
                    i2.classList.add('fa');
                    i2.classList.add('fa-circle');
                    i2.classList.add('text-info');
                    strong.innerHTML = ' Activated';
                }
                div2.appendChild(i2);
                active.appendChild(div2);
                active.appendChild(strong);
                active.classList.add('text-center');
                active.classList.add('py-4');
                tr.appendChild(active);


                let actions = document.createElement('td');

                if (i[5] == "0") {
                    i2.classList.add('fa');
                    i2.classList.add('fa-circle');
                    i2.classList.add('text-danger');
                    strong.innerHTML = ' Non-activated';
                } else {
                    i2.classList.add('fa');
                    i2.classList.add('fa-circle');
                    i2.classList.add('text-info');
                    strong.innerHTML = ' Activated';
                }
                div2.appendChild(i2);
                active.appendChild(div2);
                active.appendChild(strong);
                tr.appendChild(active);


                let view = document.createElement('button');
                let reset = document.createElement('button');

                view.classList.add('btn');
                view.classList.add('btn-primary');
                view.classList.add('btn-sm');
                view.classList.add('w-100');
                view.innerHTML = "Xem chi tiết";
                view.setAttribute('onclick', 'userDetail("' + userID + '")');


                reset.innerHTML = "Đặt lại mật khẩu";
                if (i[6] == "0") {
                    reset.classList.add('btn');
                    reset.classList.add('btn-sm');
                    reset.classList.add('btn-outline-danger');
                    reset.removeAttribute("enabled", "");
                    reset.setAttribute("disabled", "");
                } else {
                    reset.classList.add('btn');
                    reset.classList.add('btn-sm');
                    reset.classList.add('btn-danger');
                    reset.removeAttribute("disabled", "");
                    reset.setAttribute("enabled", "");
                    reset.setAttribute('onclick', 'showResetPasswordForUser("' + userID + '", "' + userName + '")');
                    reset.setAttribute('data-toggle', 'modal');
                    reset.setAttribute('data-target', "#resetPasswordModal")

                }

                view.classList.add('d-block')
                view.classList.add('mb-2')
                view.setAttribute('onclick', 'userDetail("' + i[0] + '")');
                let div3 = document.createElement('div');
                div3.appendChild(view);
                div3.appendChild(reset);
                actions.appendChild(div3);

                // console.log(tr);
                tr.appendChild(actions);
                tbody.appendChild(tr);
            })
        }
    })
}

function showResetPasswordForUser(userID, name) {
    let inf = document.getElementById('inf');
    inf.innerHTML = userID + ' - ' + name;
    let confirm = document.getElementById('confirm-reset')
    confirm.setAttribute('onclick', 'resetPasswordForUser("' + userID + '")');
}

function resetPasswordForUser(userID) {
    $.ajax({
        url: './backend/API/AdminManagerAccount/reset-password.php?id=' + userID,
        type: 'GET',
        async: true,
        success: function(results) {
            $("#password-reset-success-alert").fadeTo(2000, 500).slideUp(500, function() {
                $("#password-reset-success-alert").slideUp(500);
            });
            loadAccountList();
        },
        error: function(result) {
            console.log(result);
        }
    })
}

function userDetail(userID) {
    $.ajax({
        url: './app/user-detail-manager.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);

            $("body").removeClass("sidebar-main");
            $.ajax({
                url: './backend/API/AdminManagerAccount/get-account.php?id=' + userID,
                type: 'GET',
                async: true,
                success: function(results) {
                    let userName = document.getElementById('name-detail');
                    let username = document.getElementById('username-detail');
                    let role = document.getElementById('role-detail');
                    let id = document.getElementById('id-detail');
                    let activated = document.getElementById('activated-detail');
                    let gender = document.getElementById('gender-detail');
                    let email = document.getElementById('email-detail');
                    let dob = document.getElementById('dob-detail');
                    let phone = document.getElementById('phone-number-detail');
                    let avatar = document.getElementById('avatar-detail');
                    let department = document.getElementById('department-detail');
                    user = results.data[0];

                    id.innerHTML = user[0];

                    userName.innerHTML = user[1];
                    role.innerHTML = user[2];
                    email.innerHTML = user[3];
                    dob.innerHTML = formatVNDate(user[4]);
                    phone.innerHTML = user[5];


                    let dir = './assets/images/users/' + user[0];

                    if (user[10] == null) {
                        let defaultAvatar = 'Female_Default.png';
                        if (user[9] == 'Nam') {
                            defaultAvatar = 'Male_Default.png';
                        }
                        dir = './assets/images/users/DefaultAvatar/' + defaultAvatar;
                    } else {
                        dir = './app/users/' + user[0] + '/' + user[10];
                    }
                    avatar.setAttribute('src', dir);
                    avatar.setAttribute('alt', 'Avatar của user' + user[0]);
                    department.innerHTML = user[6];
                    let i2 = document.createElement('i')

                    let strong = document.createElement('strong')
                    let status = document.getElementById('account-status-detail')
                    if (user[8] == 0) {
                        i2.classList.add('fa');
                        i2.classList.add('fa-circle');
                        i2.classList.add('text-danger');
                        status.classList.add('fa-toggle-off')
                        strong.innerHTML = ' Non-activated';
                    } else {
                        i2.classList.add('fa');
                        i2.classList.add('fa-circle');
                        i2.classList.add('text-info');
                        status.classList.add('fa-toggle-on')
                        strong.innerHTML = ' Activated';
                    }
                    username.innerHTML = user[7];
                    activated.appendChild(i2);
                    activated.appendChild(strong);
                    gender.innerHTML = user[9];
                },
                error: function(results) {
                    console.log(results)
                }
            })
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
}

function loadDepartmentList() {
    // clear table
    let tbody = document.getElementById('department-table-body');
    if (tbody != null) {
        tbody.innerHTML = '';
    }
    let ajax = new XMLHttpRequest();
    ajax.open('GET', './backend/API/AdminManagerDepartment/get-departments.php', 'true');
    ajax.send();
    ajax.reponseType = 'json';
    ajax.addEventListener('readystatechange', () => {
        if (ajax.readyState === 4 && ajax.status === 200) {

            let json = JSON.parse(ajax.response);

            json.data.forEach((i) => {

                let id = document.createElement('td');
                let name = document.createElement('td');
                let desc = document.createElement('td');
                let leader = document.createElement('td');
                let action = document.createElement('td');

                let div1 = document.createElement('div');
                div1.classList.add('text-center');
                let h6 = document.createElement('h6');
                h6.id = "departmentID";
                h6.innerHTML = i[0];
                let departmentID = i[0];
                div1.appendChild(h6);
                id.append(div1)
                let tr = document.createElement('tr');
                id.classList.add('py-4')
                tr.appendChild(id);

                name.id = "department-name";
                name.innerHTML = i[1];
                let departmentName = i[1];
                name.classList.add('py-4')
                tr.appendChild(name);

                desc.id = "desc";
                desc.innerHTML = i[2];
                let departmentDesc = i[2];
                desc.classList.add('py-4')
                tr.appendChild(desc);

                leader.id = "leader";
                leader.innerHTML = "Chưa có trưởng phòng";
                if (i[3] != null) {
                    leader.innerHTML = i[3] + " - " + i[4];
                }

                let departmentLeader = i[3];
                leader.classList.add('py-4')
                tr.appendChild(leader);


                let view = document.createElement('button');
                view.classList.add('btn');
                view.classList.add('btn-primary');
                view.classList.add('btn-sm');
                view.classList.add('w-100');
                view.classList.add('d-block')
                view.classList.add('mt-2')

                view.innerHTML = "Xem chi tiết";

                view.setAttribute('onclick', 'departmentDetail("' + i[0] + '")');
                let div3 = document.createElement('div');
                div3.appendChild(view);
                action.appendChild(div3);
                tr.appendChild(action);

                tbody.appendChild(tr);
            })
        }
    })
    LoadNonLeadedDepartmentForViewingPurpose()
}

function LoadNonLeadedDepartmentForViewingPurpose() {
    let tbody = document.getElementById('department-table-body');

    let ajax = new XMLHttpRequest();
    ajax.open('GET', './backend/API/AdminManagerDepartment/get-non-leader-departments.php', 'true');
    ajax.send();
    ajax.reponseType = 'json';
    ajax.addEventListener('readystatechange', () => {
        if (ajax.readyState === 4 && ajax.status === 200) {

            let json = JSON.parse(ajax.response);
            if (json.status == 1) {
                json.data.forEach((i) => {

                    let id = document.createElement('td');
                    let name = document.createElement('td');
                    let desc = document.createElement('td');
                    let leader = document.createElement('td');
                    let action = document.createElement('td');

                    let div1 = document.createElement('div');
                    div1.classList.add('text-center');
                    let h6 = document.createElement('h6');
                    h6.id = "departmentID";
                    h6.innerHTML = i[0];
                    let departmentID = i[0];
                    div1.appendChild(h6);
                    id.append(div1)
                    let tr = document.createElement('tr');
                    id.classList.add('py-4')
                    tr.appendChild(id);

                    name.id = "department-name";
                    name.innerHTML = i[1];
                    let departmentName = i[1];
                    name.classList.add('py-4')
                    tr.appendChild(name);

                    desc.id = "desc";
                    desc.innerHTML = i[2];
                    let departmentDesc = i[2];
                    desc.classList.add('py-4')
                    tr.appendChild(desc);

                    leader.id = "leader";
                    leader.innerHTML = "Chưa có trưởng phòng";


                    let departmentLeader = i[3];
                    leader.classList.add('py-4')
                    tr.appendChild(leader);


                    let view = document.createElement('button');
                    view.classList.add('btn');
                    view.classList.add('btn-primary');
                    view.classList.add('btn-sm');
                    view.classList.add('w-100');
                    view.classList.add('d-block')
                    view.classList.add('mt-2')

                    view.innerHTML = "Xem chi tiết";

                    view.setAttribute('onclick', 'departmentDetail("' + i[0] + '")');
                    let div3 = document.createElement('div');
                    div3.appendChild(view);
                    action.appendChild(div3);
                    tr.appendChild(action);

                    tbody.appendChild(tr);
                })
            } else {
                alert('Đã có lỗi xảy ra');
            }
        }
    })
}

function editDepartment(id, name, room, desc) {
    $('#edit-bt').html('Xác nhận');
    $('#edit-bt').addClass('text-success');
    $('#edit-icon').removeClass('fa-wrench').addClass('fa-check text-success');

    // console.log(id)

    $('#department-name-detail').html('<input onKeyUp="setAttrEdit()" id="department-name-edit" name="deparment-name" class="form-control w-75" type="text" value="' + name + '"/>');
    $('#department-desc-detail').html('<input onKeyUp="setAttrEdit()"  id="department-desc-edit" name="deparment-desc" class="form-control w-75" type="text" value="' + desc + '"/>');
    $('#department-room-detail').html('<input onKeyUp="setAttrEdit()"  id="department-room-edit" name="deparment-room" type="text" placeholder="P"  class="form-control w-75" value="' + room + '"/>');

    let editName = document.getElementById('department-name-edit')
    let editRoom = document.getElementById('department-room-edit')
    let editDesc = document.getElementById('department-desc-edit')
    $('#edit-department').attr('onclick', "validateEditDepartment('" + id + "','" + editName.value + "','" + editDesc.value + "','" + editRoom.value + "')");


}

function setAttrEdit() {
    // console.log("a")
    let editid = document.getElementById('department-id-detail').innerHTML
    let editName = document.getElementById('department-name-edit')
    let editRoom = document.getElementById('department-room-edit')
    let editDesc = document.getElementById('department-desc-edit')
    $('#edit-department').attr('onclick', "validateEditDepartment('" + editid + "','" + editName.value + "','" + editDesc.value + "','" + editRoom.value + "')");
}

function validateEditDepartment(id, name, desc, room) {
    //validate

    // console.log(desc);
    // console.log(room);

    let namebox = document.getElementById('department-name-edit');
    let descbox = document.getElementById('department-desc-edit');
    let roombox = document.getElementById('department-room-edit');

    let message = document.getElementById('message-edit');

    if (name == "") {

        message.innerHTML = "Hãy nhập tên phòng ban.";
        message.removeAttribute("hidden");
        namebox.focus();

    } else if (desc == "") {
        message.innerHTML = "Hãy nhập mô tả.";
        descbox.focus();
        message.removeAttribute("hidden");
    } else if (room == "") {
        message.innerHTML = "Hãy nhập số phòng";
        roombox.focus();
        message.removeAttribute("hidden");
    } else if (!room.startsWith('P')) {
        message.innerHTML = 'Số phòng không hợp lệ (bắt đầu bằng kí tự "P")';
        roombox.focus();
        message.removeAttribute("hidden");
    } else {
        message.innerHTML = "";
        message.setAttribute("hidden", "true");

        $('#editDepartmentModal').modal();
        $('#confirm-edit').click(function() {
            let departmentEditData = JSON.stringify({ name: name, desc: desc, room: room });
            $.ajax({
                url: './backend/API/AdminManagerDepartment/update-department.php?department=' + id,
                type: 'PUT',
                dataType: "json",
                contentType: "application/json",
                async: true,
                data: departmentEditData,
                success: function(result) {
                    $("#edit-department-success-alert").fadeTo(2000, 500).slideUp(500, function() {
                        $("#edit-department-success-alert").slideUp(500);
                    });
                    departmentDetail(id)
                },
                error: function(result) {
                    alert("Không thể cập nhật CSDL");
                }
            })
        })
    }
}

function departmentDetail(departmentID) {

    $.ajax({
        url: './app/department-detail-manager.php',
        type: 'POST',
        data: {
            'action': "LOAD"
        },
        success: function(result) {
            $(".content-page").html(result);
            // console.log(result)
            $('body').removeClass("sidebar-main");
            $.ajax({
                url: "./backend/API/AdminManagerDepartment/get-department.php?id=" + departmentID,
                type: 'GET',
                async: true,
                success: function(results) {
                    let department = results.data[0];

                    $('#department-id-detail').html(department[0]);
                    $('#department-name-detail').html(department[1]);
                    $('#department-desc-detail').html(department[4]);
                    $('#department-room-detail').html(department[2]);
                    let leaderID = department[3];
                    let editBt = document.getElementById('edit-department')
                    editBt.setAttribute('onclick', "editDepartment('" + department[0] + "','" + department[1] + "','" + department[2] + "','" + department[4] + "')")

                    loadLeader(department[0])
                    LoadStaff(department[0])
                }
            })
            $(".container").fadeIn();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });
}

function fadeError(errorMessage) {
    let errorDiv = $("#responseMessage");

    if (errorDiv.hasClass('alert alert-success')) {
        errorDiv.removeClass('alert alert-success').addClass('alert alert-danger');
    } else {
        errorDiv.addClass('alert alert-danger');
    }

    errorDiv.html(errorMessage).fadeIn(1500).fadeOut(3000);
}

function fadeResult(resultMessage) {
    let resultDiv = $("#responseMessage");

    if (resultDiv.hasClass('alert alert-danger')) {
        resultDiv.removeClass('alert-danger').addClass('alert alert-success');
    } else {
        resultDiv.addClass('alert alert-success');
    }

    resultDiv.html(resultMessage).fadeIn(1500).fadeOut(3000);
}

function validateAddUser() {
    let fullname = document.forms["addUserForm"]["fullname-add"].value;
    let username = document.forms["addUserForm"]["username-add"].value;
    let email = document.forms["addUserForm"]["email-add"].value;
    let dob = document.forms["addUserForm"]["dob-add"].value;
    let phone = document.forms["addUserForm"]["phone-add"].value;
    let gender = document.forms["addUserForm"]["gender-add"].value;
    let department = document.forms["addUserForm"]["department-add"].value;

    let namebox = document.getElementById('fullname-add');
    let usernamebox = document.getElementById('username-add');
    let emailbox = document.getElementById('email-add');
    let dobbox = document.getElementById('dob-add');
    let phonebox = document.getElementById('phone-add');
    let malebox = document.getElementById('male-add');
    let femalebox = document.getElementById('female-add');
    let departmentbox = document.getElementById('department-add');
    let message = document.getElementById('message-add');

    const remail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rephone = /^0\d{9,10}$/
    const reuser = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g
    if (fullname == "") {
        message.innerHTML = "Hãy nhập tên nhân viên.";
        namebox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    var accentArray = ["á", "à", "ã", "ả", "ạ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "é", "è", "ẻ", "ẽ", "ẹ", "ê", "ế", "ề", "ể", "ễ", "ệ", "í", "ì", "ỉ", "ĩ", "ị", "î", "õ", "ó", "ò", "ỏ", "ọ", "ô", "ố", "ổ", "ồ", "ỗ", "ộ", "ú", "ù", "ủ", "ũ", "ụ", "ư", "ứ", "ừ", "ử", "ữ", "ự", "ý", "ỳ", "ỷ", "ỹ", "ỵ", "û"]

    if (username == "") {
        message.innerHTML = "Hãy nhập tên đăng nhập (username).";
        usernamebox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (!reuser.test(username)) {
        message.innerHTML = "Tên đăng nhập (username) không được chứa ký tự đặc biệt.";
        usernamebox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    let testAccent = '';
    accentArray.forEach((i) => {
        if (username.includes(String(i))) {
            testAccent = i;
        }
    })
    if (testAccent != '') {
        message.innerHTML = "Tên đăng nhập (username) không thể chứa ký tự đặc biệt - <strong>" + testAccent + "</strong>";
        usernamebox.focus();
        message.removeAttribute("hidden");
        return false;
    }

    if (username.length < 6) {
        message.innerHTML = "Tên đăng nhập (username) bắt buộc phải dài hơn 6 ký tự.";
        usernamebox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (username.includes(" ")) {
        message.innerHTML = "Tên đăng nhập (username) không được chứa dấu cách.";
        usernamebox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (email == "") {
        message.innerHTML = "Hãy nhập email.";
        emailbox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (!remail.test(email)) {
        message.innerHTML = "Email không hợp lệ.";
        emailbox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (dob == "") {
        message.innerHTML = "Hãy chọn ngày sinh.";
        dobbox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (phone == "") {
        message.innerHTML = "Hãy nhập số điện thoại.";
        phonebox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (phone.length < 10 && phone.leng > 12) {
        message.innerHTML = "Độ dài số điện thoại không hợp lệ.";
        phonebox.focus();
        message.removeAttribute("hidden");
        return false;
    }

    if (!rephone.test(phone)) {
        message.innerHTML = "Số điện thoại không hợp lệ.";
        phonebox.focus();
        message.removeAttribute("hidden");
        return false;
    }

    if (malebox.checked == false && femalebox.checked == false) {
        message.innerHTML = "Hãy chọn giới tính.";
        malebox.focus();
        femalebox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (department == "Chọn phòng ban") {
        message.innerHTML = "Hãy chọn phòng ban.";
        departmentbox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    var departmentname = departmentbox.options[departmentbox.selectedIndex].text;
    message.innerHTML = "";
    message.setAttribute("hidden", "true");
    showAddDialog(fullname, username, email, dob, phone, gender, department, departmentname);
    return false;
}

function showAddDialog(fullname, username, email, dob, phone, gender, department, departmentname) {
    $("#addUserModal").modal();
    document.getElementById('add-name').innerHTML = fullname;
    document.getElementById('add-username').innerHTML = username;
    let cf = document.getElementById('confirm-add');
    cf.setAttribute("onclick", "addUser('" + fullname + "','" + username + "','" + email + "','" + dob + "','" + phone + "','" + gender + "','" + department + "')");
}

function addUser(fullname, username, email, dob, phone, gender, department) {
    $(".content-page").html = "";
    let userAddData = JSON.stringify({ username: username, fullname: fullname, email: email, dob: dob, phonenumber: phone, gender: gender, department: department });

    $.ajax({
        url: './backend/API/AdminManagerAccount/create-account.php',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        async: true,
        data: userAddData,

        success: function(result) {
            // console.log(result)
            if (result['status'] == 6) {
                document.getElementById('message-add').innerHTML = "";
                document.getElementById('message-add').setAttribute("hidden", "true");
                $.ajax({
                    url: './app/account-management.php',
                    type: 'POST',
                    data: {
                        'action': "LOAD"
                    },
                    success: function(result) {
                        $(".content-page").html(result);

                        $("body").removeClass("sidebar-main");
                        loadAccountList();
                        $("#add-success-alert").fadeTo(2000, 500).slideUp(500, function() {
                            $("#add-success-alert").slideUp(500);
                        });
                        $(".container").fadeIn();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown + "\n" + textStatus);
                    }
                });
            } else if (result['status'] == 7) {
                let message = document.getElementById('message-add');
                message.innerHTML = "Tên người dùng (username) này đã tồn tại. Vui lòng nhập lại tên người dùng (username) mới."
                document.getElementById('username-add').focus();
                message.removeAttribute("hidden");

            } else if (result['status'] == 9) {
                let message = document.getElementById('message-add');
                message.innerHTML = "Email này đã tồn tại. Vui lòng nhập lại email mới."
                document.getElementById('email-add').focus();
                message.removeAttribute("hidden");
            } else if (result['status'] == 10) {
                let message = document.getElementById('message-add');
                message.innerHTML = "Số điện thoại này đã tồn tại. Vui lòng nhập lại số điện thoại mới."
                document.getElementById('phone-add').focus();
                message.removeAttribute("hidden");
            }
        },
        error: function(result) {
            console.log(result);
            alert("Không thể thêm vào CSDL");
        }
    });
}

function loadLeader(department) {
    $.ajax({
        url: './backend/API/AdminManagerDepartment/get-leader.php?department=' + department,
        type: 'GET',
        async: true,
        success: function(result) {
            if (result.status == 6) {
                data = result.result
                let avatar = document.createElement('td')
                let id = document.createElement('td')
                let fullName = document.createElement('td')
                let email = document.createElement('td')
                let phone = document.createElement('td')
                let avatarSrc = '';
                if (data['Avatar'] == null) {

                    let defaultAvatar = 'Female_Default.png';
                    if (data['Gender'] == 'Nam') {
                        defaultAvatar = 'Male_Default.png';
                    }
                    avatarSrc = './assets/images/users/DefaultAvatar/' + defaultAvatar;
                } else {
                    avatarSrc = './app/users/' + data['UserID'] + '/' + data['Avatar'];
                }
                let img = document.createElement('img');

                let avadiv = document.createElement('div');

                avadiv.style.width = "5em";
                avadiv.style.height = "5em"
                avadiv.classList.add('mt-3')
                avadiv.classList.add('ml-3');

                img.style.width = "70%";
                img.style.height = "70%"
                img.style.borderRadius = "50%";
                img.style.objectFit = "cover"
                img.setAttribute('src', avatarSrc);

                avadiv.appendChild(img)
                avatar.appendChild(avadiv);
                avatar.style.width = "13%"
                id.innerHTML = data['UserID']
                fullName.innerHTML = data['FullName']
                email.innerHTML = data['Email']
                phone.innerHTML = data['PhoneNumber']
                let tr = document.createElement('tr');
                let leaderTable = document.getElementById('leader-table');
                id.classList.add("pt-5")
                fullName.classList.add("pt-5")
                email.classList.add("pt-5")
                phone.classList.add("pt-5")

                tr.appendChild(avatar);
                tr.appendChild(id);
                tr.appendChild(fullName);
                tr.appendChild(phone)
                tr.appendChild(email);
                leaderTable.appendChild(tr);
                tr.setAttribute("onclick", "userDetail('" + data['UserID'] + "')")
            } else if (result.status == 5) {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.colSpan = "5"
                td.innerHTML = '<h5>Chức vụ này tạm thời đang trống</h5>';
                let leaderTable = document.getElementById('leader-table');
                tr.appendChild(td);
                leaderTable.appendChild(tr);
            }
        },
        error: function(result) {
            console.log(result)
        }
    })
}

function LoadStaff(department) {
    let staffTable = document.getElementById('staff-table')
    staffTable.innerHTML = ''
    $.ajax({
        url: './backend/API/AdminManagerAccount/load-staff-by-department.php?department=' + department,
        type: 'GET',
        async: true,
        success: function(result) {

            if (result.status == 6) {
                data = result.result
                data.forEach((staff) => {
                    // console.log(data)
                    let avatar = document.createElement('td')
                    let id = document.createElement('td')
                    let fullName = document.createElement('td')
                    let email = document.createElement('td')
                    let phone = document.createElement('td')
                    let avatarSrc = '';
                    if (staff[7] == null) {

                        let defaultAvatar = 'Female_Default.png';
                        if (staff[2] == 'Nam') {
                            defaultAvatar = 'Male_Default.png';
                        }
                        avatarSrc = './assets/images/users/DefaultAvatar/' + defaultAvatar;
                    } else {
                        avatarSrc = './app/users/' + staff[0] + '/' + staff[7];
                    }
                    let img = document.createElement('img');

                    let avadiv = document.createElement('div');

                    avadiv.style.width = "5em";
                    avadiv.style.height = "5em"
                    avadiv.classList.add('mt-3')
                    avadiv.classList.add('ml-3');

                    img.style.width = "70%";
                    img.style.height = "70%"
                    img.style.borderRadius = "50%";
                    img.style.objectFit = "cover"
                    img.setAttribute('src', avatarSrc);

                    avadiv.appendChild(img)
                    avatar.appendChild(avadiv);
                    avatar.style.width = "13%"

                    id.innerHTML = staff[0]
                    fullName.innerHTML = staff[1]
                    email.innerHTML = staff[4]
                    phone.innerHTML = staff[6]
                    let tr = document.createElement('tr');

                    id.classList.add("py-5")
                    fullName.classList.add("py-5")
                    email.classList.add("py-5")
                    phone.classList.add("py-5")

                    tr.appendChild(avatar);
                    tr.appendChild(id);
                    tr.appendChild(fullName);
                    tr.appendChild(phone)
                    tr.appendChild(email);
                    staffTable.appendChild(tr);
                    tr.setAttribute("onclick", "userDetail('" + staff[0] + "')")
                })

            } else if (result.status == 5) {

            }
        },
        error: function(result) {
            console.log(result)
        }
    })
}

function validateAddDepartment() {
    let depName = document.forms["add-department-form"]["department-name-add"].value;
    let depDesc = document.forms["add-department-form"]["department-desc-add"].value;
    let depRoom = document.forms["add-department-form"]["department-room-add"].value;

    let nameBox = document.getElementById('department-name-add');
    let roomBox = document.getElementById('department-room-add');
    let descBox = document.getElementById('department-desc-add');
    let message = document.getElementById('message-add');
    if (depName == "") {
        message.innerHTML = "Hãy nhập tên phòng ban.";
        nameBox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    if (depRoom == "") {
        message.innerHTML = "Hãy nhập số phòng cho phòng ban";
        roomBox.focus();
        message.removeAttribute("hidden");
        return false;
    }

    if (depDesc == "") {
        message.innerHTML = "Hãy nhập mô tả cho phòng ban";
        descBox.focus();
        message.removeAttribute("hidden");
        return false;
    }
    message.innerHTML = "";
    message.setAttribute("hidden", "true");

    showAddDepartmentDialog(depName, depRoom, depDesc);
    return false;
}

function showAddDepartmentDialog(depName, depRoom, depDesc) {
    $('#add-department-modal').modal();
    document.getElementById('add-name').innerHTML = depName;
    document.getElementById('add-room').innerHTML = depRoom;
    document.getElementById('add-desc').innerHTML = depDesc.substring(0, 12) + '...';
    let cf = document.getElementById('confirm-add');
    cf.setAttribute("onclick", "addDepartment('" + depName + "','" + depRoom + "','" + depDesc + "')");
}

function addDepartment(depName, depRoom, depDesc) {
    $(".content-page").html = "";
    let userAddData = JSON.stringify({ name: depName, room: depRoom, desc: depDesc });
    $.ajax({
        url: './backend/API/AdminManagerDepartment/create-department.php',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        async: true,
        data: userAddData,

        success: function(result) {
            // console.log(result)
            if (result['status'] == 6) {
                document.getElementById('message-add').innerHTML = "";
                document.getElementById('message-add').setAttribute("hidden", "true");
                $.ajax({
                    url: './app/appoint-remove.php',
                    type: 'POST',
                    data: {
                        'action': "LOAD"
                    },
                    success: function(result) {
                        $(".content-page").html(result);

                        $("body").removeClass("sidebar-main");
                        LoadLeadedDepartment();
                        LoadNonLeadedDepartment();
                        $("#add-success-alert").fadeTo(2000, 500).slideUp(500, function() {
                            $("#add-success-alert").slideUp(500);
                        });
                        $(".container").fadeIn();
                    },
                    error: function(jqXHR, textStatus, errorThrown) {
                        console.log(errorThrown + "\n" + textStatus);
                    }
                });
            } else if (result['status'] == 7) {
                let message = document.getElementById('message-add');
                message.innerHTML = "Tên phòng ban này đã tồn tại. Vui lòng nhập lại tên phòng ban mới."
                document.getElementById('department-name-add').focus();
                message.removeAttribute("hidden");
            } else if (result['status'] == 10) {
                let message = document.getElementById('message-add');
                message.innerHTML = "Phòng này hiện đang được phòng ban khác sử dụng. Vui lòng nhập lại số phòng mới."
                document.getElementById('department-room-add').focus();
                message.removeAttribute("hidden");
            }
        },
        error: function(result) {
            console.log(result);
            alert("Không thể thêm vào CSDL");
        }
    });
}

function LoadLeadedDepartment() {
    let tbody = document.getElementById('leader-department-table-body');
    if (tbody != null) {
        tbody.innerHTML = '';
    }
    let ajax = new XMLHttpRequest();
    ajax.open('GET', './backend/API/AdminManagerDepartment/get-departments.php', 'true');
    ajax.send();
    ajax.reponseType = 'json';
    ajax.addEventListener('readystatechange', () => {
        if (ajax.readyState === 4 && ajax.status === 200) {

            let json = JSON.parse(ajax.response);
            // console.log(json);
            json.data.forEach((i) => {
                // do something
                // console.log(i);

                let id = document.createElement('td');
                let name = document.createElement('td');

                let leader = document.createElement('td');
                let action = document.createElement('td');

                let tr = document.createElement('tr');
                leader.innerHTML = i[3] + " - " + i[4];
                let departmentLeader = i[3];
                leader.classList.add('py-4')
                tr.appendChild(leader);

                let div1 = document.createElement('div');
                div1.classList.add('text-center');
                let h6 = document.createElement('h6');
                h6.id = "departmentID";
                h6.innerHTML = i[0];
                let departmentID = i[0];
                div1.appendChild(h6);
                id.append(div1)

                id.classList.add('py-4')
                tr.appendChild(id);

                name.id = "department-name";
                name.innerHTML = i[1];
                let departmentName = i[1];
                name.classList.add('py-4')
                tr.appendChild(name);

                let remove = document.createElement('button');
                remove.classList.add('btn');
                remove.classList.add('btn-danger');
                remove.classList.add('btn-sm');
                remove.classList.add('w-100');
                remove.classList.add('d-block')
                remove.classList.add('mt-2')

                remove.innerHTML = "Cắt chức";
                remove.setAttribute('onclick', "removeLeader('" + i[0] + "','" + i[1] + "','" + i[4] + "')");

                let div3 = document.createElement('div');
                div3.appendChild(remove);
                action.appendChild(div3);
                tr.appendChild(action);

                tbody.appendChild(tr);
            })
        }
    })
}

function removeLeader(department, name, leader) {
    $('#leader-name').html(leader);
    $('#de-name').html(name);
    $('#remove-leader').modal();
    $('#confirm-remove').click(function() {

        $.ajax({
            url: './backend/API/AdminManagerDepartment/remove-leader.php?department=' + department,
            type: 'GET',
            async: true,
            success: function(result) {
                // console.log(result)
                if (result.status == 6) {
                    $.ajax({
                        url: './app/appoint-remove.php',
                        type: 'POST',
                        data: {
                            'action': "LOAD"
                        },
                        success: function(result) {
                            $(".content-page").html(result);

                            $("body").removeClass("sidebar-main");
                            LoadNonLeadedDepartment();
                            LoadLeadedDepartment();
                            $("#remove-success-alert").fadeTo(2000, 500).slideUp(500, function() {
                                $("#remove-success-alert").slideUp(500);
                            });
                            $(".container").fadeIn();
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                            console.log(errorThrown + "\n" + textStatus);
                        }
                    });
                }
            },
            error: function(res) {
                alert('Không thể cắt chức trưởng phòng này');
            }
        })
    })
}

function LoadNonLeadedDepartment() {
    let tbody = document.getElementById('non-leader-department-table-body');
    if (tbody != null) {
        tbody.innerHTML = '';
    }
    let ajax = new XMLHttpRequest();
    ajax.open('GET', './backend/API/AdminManagerDepartment/get-non-leader-departments.php', 'true');
    ajax.send();
    ajax.reponseType = 'json';
    ajax.addEventListener('readystatechange', () => {
        if (ajax.readyState === 4 && ajax.status === 200) {

            let json = JSON.parse(ajax.response);
            // console.log(json);
            json.data.forEach((i) => {
                // do something
                // console.log(i);

                let id = document.createElement('td');
                let name = document.createElement('td');
                let desc = document.createElement('td');
                let action = document.createElement('td');

                let h6 = document.createElement('h6');
                h6.id = "departmentID";
                h6.innerHTML = i[0];
                let departmentID = i[0];
                let div1 = document.createElement('div')
                div1.appendChild(h6);
                id.append(div1)
                let tr = document.createElement('tr');
                id.classList.add('py-4')
                tr.appendChild(id);

                name.id = "department-name";
                name.innerHTML = i[1];
                let departmentName = i[1];
                name.classList.add('py-4')
                tr.appendChild(name);

                desc.id = "desc";
                desc.innerHTML = i[2];
                let departmentDesc = i[2];
                desc.classList.add('py-4')
                tr.appendChild(desc);
                let appoint = document.createElement('button');
                appoint.classList.add('btn');
                appoint.classList.add('btn-success');
                appoint.classList.add('btn-sm');
                appoint.classList.add('w-100');
                appoint.classList.add('d-block')
                appoint.classList.add('mt-2')

                appoint.innerHTML = "Bổ nhiệm";

                appoint.setAttribute('onclick', "appointLeader('" + i[0] + "','" + i[1] + "')");
                let div3 = document.createElement('div');
                div3.appendChild(appoint);
                action.appendChild(div3);
                tr.appendChild(action);
                tbody.appendChild(tr);
            })
        }
    })
}

function appointLeader(department, name) {

    $('#dep-name').html(name);
    $('#appoint-leader').modal();
    document.getElementById('appoint-leader').style.removeProperty('z-index')

    $('#message-appoint').html('');
    $('#message-appoint').attr('hidden', 'true');
    $.ajax({
        url: './backend/API/AdminManagerAccount/load-staff-by-department.php?department=' + department,
        type: 'GET',
        async: true,
        success: function(result) {

            if (result.status == 6) {
                data = result.result
                let select = document.getElementById('choose-leader')
                select.innerHTML = ''
                select.innerHTML = '<option value="-1" selected disabled>Chọn trưởng phòng mới</option>'
                data.forEach((staff) => {
                    let opt = document.createElement('option');
                    opt.innerHTML = staff[0] + " - " + staff[1]
                    opt.setAttribute('value', staff[0])
                    select.appendChild(opt);
                })
                $('#btn-appoint').click(function() {
                    $('#message-appoint').html('');
                    $('#message-appoint').attr('hidden', 'true');

                    if (select.value == "-1") {

                        $('#message-appoint').html('Vui lòng chọn 1 nhân viên để bổ nhiệm');
                        $('#message-appoint').removeAttr('hidden');
                        $('#choose-leader').focus()
                    } else {
                        $('#confirm-leader').modal();
                        $('#appoint-leader').css('z-index', '0');
                        $('#message-appoint').html('');
                        $('#message-appoint').attr('hidden', 'true');



                        $('#cancel-appoint').on('click', function() {
                            $('#appoint-leader').removeProp('z-index')

                        })



                        $('#confirm-leader').on('hidden.bs.modal', function() {
                            $('#appoint-leader').modal('toggle')
                            $('#appoint-leader').removeProp('z-index')
                        })

                        $('#appoint-leader-name').html($('#choose-leader :selected').text());
                        $('#new-de-name').html(name);
                        $('#confirm-appoint').click(function() {
                            $.ajax({
                                url: './backend/API/AdminManagerDepartment/appoint-leader.php?leader=' + select.value + "&department=" + department,
                                type: 'GET',
                                async: true,
                                success: function(result) {

                                    if (result.status == 1) {

                                        $.ajax({
                                            url: './app/appoint-remove.php',
                                            type: 'POST',
                                            data: {
                                                'action': "LOAD"
                                            },
                                            success: function(result) {

                                                $(".content-page").html(result);
                                                $('#appoint-leader').removeProp('z-index')
                                                $("body").removeClass("sidebar-main");
                                                LoadNonLeadedDepartment();
                                                LoadLeadedDepartment();
                                                $('#new-leader-name').html($('#choose-leader :selected').text());
                                                $("#appoint-success-alert").fadeTo(2000, 500).slideUp(500, function() {
                                                    $("#appoint-success-alert").slideUp(500);
                                                });
                                                $(".container").fadeIn();
                                            },
                                            error: function(jqXHR, textStatus, errorThrown) {
                                                console.log(errorThrown + "\n" + textStatus);
                                            }
                                        });
                                    }
                                }
                            })
                        })
                    }
                })
            } else if (result.status == 7) {
                let select = document.getElementById('choose-leader')
                select.innerHTML = ''
                select.innerHTML = '<option selected disabled>Phòng ban này hiện chưa có nhân viên nào</option>'
                $('#switch-to-add-staff').removeAttr("hidden");
                $('#switch-to-add-staff').click(function() {
                    $('#appoint-leader').modal('hide');
                    $(".active").removeClass('active');
                    $(this).parent('li').addClass('active');
                    $(this).parent('li').parent().parent('li').addClass('active');
                    $.ajax({
                        url: './app/add-account.php',
                        type: 'POST',
                        data: {
                            'action': "LOAD"
                        },
                        success: function(result) {

                            $(".content-page").html(result);

                            $("body").removeClass("sidebar-main");

                            $('#department-add').val(department);

                            $(".container").fadeIn();
                        },
                        error: function(jqXHR, textStatus, errorThrown, result) {
                            console.log(errorThrown + "\n" + textStatus);

                        }
                    });
                })
            }
        }
    })
}

function logout() {
    let countDown = 5;
    let id = setInterval(() => {
        countDown--;
        if (countDown >= 0) {
            $('#counter').html(countDown);
        }
        if (countDown == -1) {
            clearInterval(id);
            window.location.href = 'login.php';
        }
    }, 1000);
}
//#endregion

// Phần TASK$
// Load nhân viên trong phòng ban
function loadEmployeeList() {
    $.ajax({
        url: './backend/API/AdminManagerTask/get-department-employee.php',
        method: 'GET',
        success: function(result) {

            result = JSON.parse(result)
            if (!result['status']) {
                fadeError(result['errorMessage']);
                return;
            }

            let employeeList = document.getElementById("employee");
            employeeList.innerHTML = '<option value="" selected>Chọn nhân viên</option>';

            $(result['result']).each(function(index, data) {
                var staff = document.createElement("option");
                staff.textContent = data['FullName'];
                staff.value = data['UserID'];

                employeeList.appendChild(staff);
            }, "json")
        },
        error: function(result) {
            console.log(result)
        }
    })
}

// List file - thêm files
$(document).on("change", "#attachment", function() {
    if ($("#attachment")[0].files.length < 1) {
        return;
    }

    if ($("#file-placeholder") != null) {
        $("#file-placeholder").hide();
    }

    files = [];
    // Lấy data files
    if ($("#attachment").data("files") != null) {
        files = $("#attachment").data("files");
    }

    for (let i = 0; i < $("#attachment")[0].files.length; i++) {
        let file = $("#attachment")[0].files[i];

        if (checkFileList(files, file) > -1) {
            continue;
        }

        if (file.size > 1024 * 1024 * 16) {
            fadeError("Vui lòng các chọn tập tin nhỏ hơn 16MB")
            $("#attachment").data("files", files);
            return;
        }

        let ext = file.name.split(".").at(-1).toLowerCase();
        if (extension_icons[ext] == undefined) {
            fadeError("Hệ thống không hỗ trợ upload tệp tin đuôi ." + ext);
            return;
        }

        // Lưu data
        files.push(file)

        // Update UI
        var item = document.createElement("div");
        item.classList.add("custom-file-item");


        var title = document.createElement("div");
        title.classList.add("custom-file-title");

        // Tạo icon từ file extension

        var icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(extension_icons[ext]);

        // Tên file
        filename = document.createElement("span");
        filename.innerHTML = file.name;

        type = document.createElement("p")
        type.innerHTML = file.type;
        title.appendChild(filename);
        title.appendChild(type);
        var remove = document.createElement("i");
        remove.classList.add("fas");
        remove.classList.add("fa-minus-circle");
        remove.classList.add("custom-file-remove");
        $(remove).data("file", file);
        item.appendChild(icon);
        item.appendChild(title);
        item.appendChild(remove);

        $("#custom-file-list").append(item);
    }
    $("#attachment").data("files", files);
})

// bỏ chọn file
$(document).on("click", ".custom-file-remove", function() {
    var file = $(this).data("file");
    $(this).parent().remove();
    files = $("#attachment").data("files");
    files.splice(checkFileList(files, file), 1)

    if (files.length < 1) {
        $("#file-placeholder").show();
    }

    $("#attachment").data("files", files);
})

function checkFileList(files, file) {
    for (let i = 0; i < files.length; i++) {
        if (files[i].name == file.name && files[i].size == file.size && files[i].type == file.type) {
            return i;
        }
    }
    return -1;
}
// Reset form
$(document).on("click", "#reset", function() {
    resetTaskInfo();
})

$('#new-task').on('hidden.bs.modal', function() {
    $("#reset").click();
})

function resetTaskInfo() {
    $("#attachment").removeData();
    $("#file-placeholder").show();
    $("#custom-file-list").empty();
    $("#attachment").val('');
}

// Submit tạo task
$(document).on("click", "#create-task", function() {
    let title = $("#task-title").val().trim();
    let employee = $("#employee").val().trim();
    let deadline = $("#deadline").val().trim();
    let desc = $("#task-desc").val().trim();

    if (title == "") {
        fadeError("Tiêu đề không được để trống.");
        return;
    }
    if (employee == "") {
        fadeError("Vui lòng chọn nhân viên đảm nhiệm.");
        return;
    }
    if (deadline == "") {
        fadeError("Vui lòng thêm thời hạn nhiệm vụ.");
        return;
    }
    if (desc == "") {
        fadeError("Vui lòng thêm Mô tả nhiệm vụ.");
        return;
    }

    if (Date.parse(deadline) < Date.now()) {
        fadeError("Thời hạn phải sau thời điểm hiện tại");
        return;
    }

    files = []
    if ($("#attachment").data("files") != null) {
        files = $("#attachment").data("files");
    }

    var formData = new FormData();
    formData.append("title", title)
    formData.append("userID", employee)
    formData.append("desc", desc)
    formData.append("deadline", deadline)
    for (let i = 0; i < files.length; i++) {
        formData.append("attachment[]", files[i])
    }

    $("#upload-complete").attr("disabled", true);
    $.ajax({
        url: './backend/API/AdminManagerTask/create-new-task.php',
        type: 'POST',
        dataType: "json",
        caches: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function(result) {
            $("#upload-complete").attr("disabled", false);

            if (!result['status']) {
                $("#message").html(result['errorMessage']);
                $("#progress").hide();
                return;
            }
            $("#message").html(result['message']);
            // reset form
            $("#reset").click();
            $("#new-task").modal("hide");
            loadAllTask();
        },
        error: function(error) {
            console.log(error);
            $("#upload-complete").attr("disabled", false);
        },
        xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#message").html("Chờ chút nha...");
            $("#progress").show();
            // Upload progress
            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    let percent = (e.loaded / e.total) * 100
                    $("#progress-bar").width(percent + '%')
                }
            }
            return xhr
        }
    });
})

// Load task list
function loadAllTask() {
    $.ajax({
        url: './backend/API/AdminManagerTask/get-tasks.php',
        method: 'GET',
        success: function(result) {
            $("#task-list").html(result);
        },
        error: function(result) {
            console.log(result)
        }
    })
}

// Cancel Task - Leader function
$(document).on("click", "#task-cancel", function() {
    $("#confirm-task-cancel").modal({ backdrop: 'static', keyboard: false });
    $("#task-name").html($(this).data("task-name"));
    $("#staff-name").html($(this).data("staff-name"));
    $("#confirm").data("id", $(this).data("id"));
})

// Confirm cancel task
$(document).on("click", "#confirm", function() {

    $("#confirm-task-cancel").modal('hide');
    $.ajax({
        url: './backend/API/AdminManagerTask/cancel-task.php',
        method: 'POST',
        dataType: 'json',
        data: {
            'action': "cancel-task",
            'TaskID': $(this).data("id")
        },
        success: function(result) {
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#upload-complete").attr("disabled", false);
            $("#progress").hide();
            if (!result['status']) {
                $("#message").html(result['errorMessage']);
                return;
            }
            loadAllTask();
            $("#message").html(result['message']);
        },
        error: function(result) {
            console.log(result)
        }
    })
})

$('#form-submit-task').on('hidden.bs.modal', function() {
    resetSubmitForm();
})

// reset form submit 
function resetSubmitForm() {
    $('#submit-msg').val('');
    if (!$('#submit-deadline').is('[readonly]')) {
        $('#submit-deadline').val('');
    }
    $("#submit-attachment").removeData();
    $("#submit-file-placeholder").show();
    $("#submit-custom-file-list").empty();
    $("#submit-attachment").val('');
}

// Accept Task - Staff function
$(document).on("click", "#task-accept", function() {
    $.ajax({
        url: './backend/API/AdminManagerTask/accept-task.php',
        method: 'POST',
        data: {
            'action': "accept-task",
            'TaskID': $(this).data('id')
        },
        success: function(result) {
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#upload-complete").attr("disabled", false);
            $("#progress").hide();
            if (!result['status']) {
                $("#message").html(result['errorMessage']);
                return;
            }
            loadAllTask();
            $("#message").html(result['message']);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus + errorThrown)
        }
    })
})

// Submit Task - Staff function

$(document).on("click", "#submit", function() {
    //Show dữ liệu về task sắp submit
    let id = $(this).data('id')
    $.ajax({
        url: './backend/API/AdminManagerTask/get-task.php?id=' + id,
        method: 'POST',
        data: {
            'action': "get-task"
        },
        dataType: 'json',
        success: function(result) {
            if (!result['status']) {
                fadeErrorSubmit(result['errorMessage']);
                return;
            }
            result = result['result'];
            $("#task-submit-title").val(result['TaskTitle']);
            $("#submit-deadline").val(result['Deadline'].split(" ")[0]);
            $("#task-submit-desc").val(result['TaskDescription']);
            $("#submit-task").data("id", id);

            if (result['Status'] == "In progress") {
                $("#submit-deadline").attr("readonly", true);
            }

            if (result['Status'] == "Waiting") {
                $("#submit-deadline").attr("readonly", false);
            }
            $("#submit-deadline").data("deadline", $("#submit-deadline").val());
        },
        error: function(result) {
            console.log(result)
        }
    })
})

$(document).on("click", "#submit-task", function() {
    let msg = $("#submit-msg").val().trim();
    let deadline = $("#submit-deadline").val();

    if (msg == "") {
        fadeErrorSubmit("Vui lòng thêm lời nhắn hoặc thông tin báo cáo.");
        return;
    }

    if (Date.parse(deadline) < Date.parse($("#submit-deadline").data("deadline"))) {
        fadeErrorSubmit("Thời gian gia hạn phải sau thời hạn cũ");
        return;
    }

    if (Date.parse(deadline) != Date.parse($("#submit-deadline").data("deadline")) && Date.parse(deadline) < Date.now()) {
        fadeErrorSubmit("Thời gian gia hạn phải sau thời hạn hiện tại");
        return;
    }

    if ($("#submit-deadline").attr("readonly")) {
        deadline = $("#submit-deadline").data("deadline");
    }

    files = []
    if ($("#submit-attachment").data("files") != null) {
        files = $("#submit-attachment").data("files");
    }

    var formData = new FormData();
    formData.append("message", msg);
    formData.append("deadline", deadline);

    for (let i = 0; i < files.length; i++) {
        formData.append("attachment[]", files[i])
    }

    $("#upload-complete").attr("disabled", true);
    $.ajax({
        url: './backend/API/AdminManagerTask/submit-task.php?id=' + $(this).data("id"),
        type: 'POST',
        dataType: "json",
        caches: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function(result) {
            $("#upload-complete").attr("disabled", false);

            if (!result['status']) {
                $("#message").html(result['errorMessage']);
                $("#progress").hide();
                return;
            }
            $("#message").html(result['message']);
            // reset form
            $("#reset").click();

            $("#form-submit-task").modal("hide");
            loadAllTask();
            resetSubmitForm()
        },
        error: function(error) {
            console.log(error);
            $("#upload-complete").attr("disabled", false);
        },
        xhr: function() {
            var xhr = $.ajaxSettings.xhr();
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#message").html("Chờ chút nha...");
            $("#progress").show();
            // Upload progress
            xhr.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    let percent = (e.loaded / e.total) * 100
                    $("#progress-bar").width(percent + '%')
                }
            }
            return xhr
        }
    });
})

$(document).on("change", "#submit-attachment", function() {
    if ($("#submit-attachment")[0].files.length < 1) {
        return;
    }

    if ($("#submit-file-placeholder") != null) {
        $("#submit-file-placeholder").hide();
    }

    files = [];
    // Lấy data files
    if ($("#submit-attachment").data("files") != null) {
        files = $("#submit-attachment").data("files");
    }

    for (let i = 0; i < $("#submit-attachment")[0].files.length; i++) {
        let file = $("#submit-attachment")[0].files[i];

        if (checkFileList(files, file) > -1) {
            continue;
        }

        if (file.size > 1024 * 1024 * 16) {
            fadeErrorSubmit("Vui lòng các chọn tập tin nhỏ hơn 16MB")
            $("#submit-attachment").data("files", files);
            return;
        }

        let ext = file.name.split(".").at(-1).toLowerCase();
        if (extension_icons[ext] == undefined) {
            fadeErrorSubmit("Hệ thống không hỗ trợ upload tệp tin đuôi ." + ext);
            return;
        }

        // Lưu data
        files.push(file)

        // Update UI
        var item = document.createElement("div");
        item.classList.add("custom-file-item");


        var title = document.createElement("div");
        title.classList.add("custom-file-title");

        // Tạo icon từ file extension

        var icon = document.createElement("i");
        icon.classList.add("fas");
        icon.classList.add(extension_icons[ext]);

        // Tên file
        filename = document.createElement("span");
        filename.innerHTML = file.name;

        type = document.createElement("p")
        type.innerHTML = file.type;
        title.appendChild(filename);
        title.appendChild(type);
        var remove = document.createElement("i");
        remove.classList.add("fas");
        remove.classList.add("fa-minus-circle");
        remove.classList.add("custom-file-remove");
        remove.classList.add("submit-custom-file-remove");
        $(remove).data("file", file);
        item.appendChild(icon);
        item.appendChild(title);
        item.appendChild(remove);

        $("#submit-custom-file-list").append(item);
    }
    $("#submit-attachment").data("files", files);
})

// bỏ chọn file - submit form
$(document).on("click", ".submit-custom-file-remove", function() {
    var file = $(this).data("file");
    $(this).parent().remove();
    files = $("#submit-attachment").data("files");
    files.splice(checkFileList(files, file), 1)

    if (files.length < 1) {
        $("#submit-file-placeholder").show();
    }

    $("#submit-attachment").data("files", files);
})

function fadeErrorSubmit(errorMessage) {
    let errorDiv = $("#submit-responseMessage");

    if (errorDiv.hasClass('alert alert-success')) {
        errorDiv.removeClass('alert alert-success').addClass('alert alert-danger');
    } else {
        errorDiv.addClass('alert alert-danger');
    }

    errorDiv.html(errorMessage).fadeIn(1500).fadeOut(3000);
}

// Duyệt task - TRưởng phòng
$(document).on("click", "#completed", function() {

    let id = $(this).data('id');

    // reset rate
    $("#task-rate").empty();
    $("#task-rate").val('');

    $.ajax({
        url: './backend/API/AdminManagerTask/get-task.php?id=' + id,
        method: 'POST',
        dataType: 'json',
        data: {
            'action': "rate-task"
        },
        success: function(result) {
            if (!result['status']) {
                fadeRateError(result['errorMessage']);
                return;
            }
            result = result['result'];
            $("#rate-task-title").val(result['TaskTitle']);
            let deadline = result['Deadline'].split(" ")[0];
            let submit = result['Time_Stamp'].split(" ")[0];

            $("#rate-deadline").val(deadline);
            $("#rate-submit-time").val(submit);

            if (Date.parse(deadline) < Date.parse(submit)) {
                $("#feedback").removeClass().addClass("badge badge-warning").html("Hoàn thành trễ hạn");
                var option = ["Bad", "OK"];
            } else {
                $("#feedback").removeClass().addClass("badge badge-success").html("Hoàn thành đúng hạn");
                var option = ["Bad", "OK", "Good"];
            }

            let taskRate = document.getElementById("task-rate");
            option.forEach(rate => {
                let option = document.createElement("option");
                option.textContent = rate;
                option.value = rate;

                taskRate.appendChild(option);
            });

            $("#rateTask").data("id", result['TaskID']);
        },
        error: function(result) {
            console.log(result)
        }
    })
})

$(document).on("click", "#rateTask", function() {
    let rate = $("#task-rate").val();

    if (rate == "") {
        fadeRateError("Vui lòng chọn mức độ đánh giá");
        return;
    }

    $.ajax({
        url: './backend/API/AdminManagerTask/rate-task.php',
        method: 'POST',
        dataType: 'json',
        data: {
            'action': "rate-task",
            'TaskID': $(this).data("id"),
            'rate': rate
        },
        success: function(result) {
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#upload-complete").attr("disabled", false);
            $("#progress").hide();
            if (!result['status']) {
                $("#message").html(result['errorMessage']);
                return;
            }
            $("#rate-task").modal("hide");
            loadAllTask();
            $("#message").html(result['message']);
        },
        error: function(result) {
            console.log(result)
        }
    })
})

function fadeRateError(errorMessage) {
    let errorDiv = $("#rate-responseMessage");

    if (errorDiv.hasClass('alert alert-success')) {
        errorDiv.removeClass('alert alert-success').addClass('alert alert-danger');
    } else {
        errorDiv.addClass('alert alert-danger');
    }

    errorDiv.html(errorMessage).fadeIn(1500).fadeOut(3000);
}

// Click to download file
$(document).on("click", "div .custom-file-item", function() {
    if ($(this).attr("href") != undefined) {

        //Download file
        let href = $(this).attr("href");
        var link = document.createElement('a');
        link.href = href;
        link.download = href.substring(href.lastIndexOf("/") + 1);
        link.dispatchEvent(new MouseEvent('click'));

        // Mở file
        // window.location.href = $(this).attr("href");
    }
})

// File extension
const extension_icons = {
    'zip': 'fa-file-archive',
    'rar': 'fa-file-archive',
    'gz': 'fa-file-archive',
    '7z': 'fa-file-archive',

    // image
    'jpg': 'fa-file-image',
    'png': 'fa-file-image',
    'bmp': 'fa-file-image',
    'gif': 'fa-file-image',

    // audio
    'mp3': 'fa-file-audio',
    'wav': 'fa-file-audio',
    'm4a': 'fa-file-audio',

    // video
    'mp4': 'fa-file-video',
    'mkv': 'fa-file-video',
    'mov': 'fa-file-video',

    // Document
    'doc': 'fa-file-word',
    'docx': 'fa-file-word',
    'txt': 'fa-file-alt',

    // pdf
    'pdf': 'fa-file-pdf',

    // powerpoint
    'ppt': 'fa-file-powerpoint',
    'pptx': 'fa-file-powerpoint',

    //Excel
    'xlsx': 'fa-file-excel',
    'xls': 'fa-file-excel',

    // code
    'html': 'fa-file-code',
    'css': 'fa-file-code',
    'php': 'fa-file-code',
    'js': 'fa-file-code',
    'c': 'fa-file-code',
    'cs': 'fa-file-code',
    'java': 'fa-file-code'
}