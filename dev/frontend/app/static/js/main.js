
$(document).ready(function () {
    $("body").removeClass("sidebar-main");
    var urlPath = window.location.pathname;
    updateNavMenu(urlPath);
    loadRedirect(urlPath)
})

// Update sidebar active state
function updateNavMenu(urlPath) {
    $(".active").removeClass('active');
    let menuItem = $('.sidebar-menu a[data-path="' + urlPath + '"]')

    if (menuItem == undefined) {
        urlPath = urlPath.split("/")[1]
        menuItem = $('.sidebar-menu a[data-path="/' + urlPath + '"]')
    }
    // Add active class to parent li menu
    $(menuItem).parent('li').addClass('active');
    let menuLabel = $(menuItem).parent('li').parent('ul')
    if (menuLabel.hasClass('submenu')) {
        menuLabel.parent('li').addClass('active');
    }
}

// Back history
$(window).on("popstate", function (e) {
    if (e.originalEvent.state) {
        var state = e.originalEvent.state;
        loadComponent(state);
    }
});


// Push history - change urlPath
$(document).on("click", "a[data-path]", function (e) {
    e.preventDefault();

    var urlPath = $(this).data("path");
    $('body').removeClass("sidebar-main")

    // Logout không pushState
    if (!urlPath.includes("logout")) {
        window.history.pushState(urlPath, null, urlPath);
    }

    loadComponent(urlPath);
});

// Load thêm tasks
$(document).on("click", "#load-tasks", function (e) {
    e.preventDefault();
    $(this).text('Loading...')
    $(this).click(false);

    fetch("/tasks/" + $(this).data('page') + "?load=1")
        .then((response) => response.text())
        .then(html => {
            $(this).remove()
            $("#task-list").append(html)
        })
        .catch(function (err) {
            showToast("Có lỗi xảy ra. Vui lòng thử lại sau." + err.message)
        });
});

// Toggle sidebar
$(document).on("click", ".wrapper-menu", function () {
    $("body").toggleClass("sidebar-main");
});

// Toast message
const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        timerProgressBar: 'gradient-progress-bar',
    },
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        toast.addEventListener('click', Swal.close)
    }
})

function showToast(comment) {
    Toast.fire({
        text: comment
    })
}

// function load content from redirect url
function loadRedirect(urlPath) {
    // Clear header cho 1 số pages
    if (urlPath.includes("login") || urlPath.includes("activate") || urlPath.includes("activate")) {
        window.history.replaceState(urlPath, null, urlPath);
    } else {
        // Load header
        if ($('header').html() == '') {
            loadHeader()
        }
    }
    window.history.replaceState(urlPath, null, urlPath);
    loadComponent(urlPath)
}

// #region Ajax page-content
function loadComponent(urlPath) {
    // fadein loading animation
    $("#loading").fadeIn("slow")
    $("body").css("overflow-y", "hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });

    const baseUrl = window.location.origin

    if (urlPath.includes("login") || urlPath.includes("activate") || urlPath.includes("reset-password")) {
        $('body').removeClass("sidebar-main")
        $('header').html('')
        $("#page-content").removeClass('content-page');
    }

    fetch(baseUrl + urlPath + "?load=1")
        .then((response) => {
            // Redirect
            if (response.status == 303) {
                return response.json()
            }
            return response.text();
        })
        .then((html) => {
            // Check redirect
            if (html.redirect && html.redirect != 'undefined') {
                if (html.message) {
                    showToast(html.message)
                }
                loadRedirect(html.redirect)
                return;
            }
            $("#loading").fadeOut(500);
            $("#page-content").html(html);
            $("body").css("overflow-y", "scroll");

            // change navbar menu
            updateNavMenu(urlPath);
            let title = "Trang chủ"
            if (urlPath.includes('login')) {
                title = "Đăng nhập"
            }
            if (urlPath.includes('department')) {
                title = "Quản lý Phòng ban"
                loadDepartmentList()
            }
            if (urlPath.includes('task')) {
                title = "Quản lý Công việc"
            }
            if (urlPath.includes('user')) {
                title = "Quản lý nhân viên"
            }
            if (urlPath.includes('salary')) {
                title = "Quản lý Lương nhân viên"
            }
            if (urlPath.includes('absents')) {
                title = "Quản lý nghỉ phép"
            }
            if (urlPath.includes('change-password')) {
                title = "Đổi mật khẩu"
            }

            document.title = "Hệ thống quản lý nội bộ - " + title;
        })
        .catch(function (err) {
            showToast("Có lỗi xảy ra. Vui lòng thử lại sau." + err.message)
        });
}

async function loadHeader() {
    fetch('/header' + "?load=1")
        .then((response) => {
            // Redirect
            if (response.status == 303) {
                return response.json()
            }
            return response.text();
        })
        .then((html) => {
            // Check redirect
            if (html.redirect && html.redirect != 'undefined') {
                loadRedirect(html.redirect)
                return false;
            }
            $("header").html(html);
            $("#page-content").addClass('content-page');
            return true
        })
        .catch(function (err) {
            showToast("Có lỗi xảy ra. Vui lòng thử lại sau." + err.message)
            return false
        });
}

// add fixed top navbar
$(window).on("scroll", function () {
    if ($(window).scrollTop() > 0) {
        $(".top-navbar").addClass("fixed");
        $(".scroll-top").addClass("show");
    } else {
        $(".top-navbar").removeClass("fixed");
        $(".scroll-top").removeClass("show");
    }
});

$(document).on("click", ".scroll-top", function () {
    // $(window).scrollTop(0);
    $('html, body').animate({
        scrollTop: 0
    }, 500)
})

function userDetail(userID) {
    $("#loading").fadeIn();
    fetch('/users/' + userID + "?load=1")
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            $("#loading").fadeOut(500);
            $("#page-content").html(html);
            $("body").css("overflow-y", "scroll");
            window.history.pushState('/users/' + userID, null, '/users/' + userID);
        })
        .catch(function (err) {
            showToast("Có lỗi xảy ra. Vui lòng thử lại sau." + err.message)
        });
}

// DONE - Chức năng đăng nhập
// Xác thực input lúc đăng nhập
function validateLogin() {
    let username = $('#username')
    let password = $('#password')

    let usernameValue = username.val().trim();
    let passwordValue = password.val().trim();


    if ($('#remember').is(":checked")) {
        $.cookie('username', usernameValue);
    } else {
        $.removeCookie('username')
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
        url: '/auth/login',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userData,
        success: async function (result) {
            if (!result['status']) {
                fadeError(result['message'])
                return false;
            }
            showToast(result['message'])
            const header = await loadHeader()
            window.history.pushState('/', null, '/');
            loadComponent('/')
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showToast(errorThrown + "\n" + textStatus)
        }
    });

    $("#responseMessage").hide();
    return false;
}


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
    let userData = JSON.stringify({ new_password: passwordValue, new_password_confirm: password_confirmValue });

    $.ajax({
        url: '/auth/change-password',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userData,
        success: function (result) {
            if (!result['status']) {
                fadeError(result['message'])
                return false;
            }
            showToast(result['message'])
            loadRedirect(result['redirect'])
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
    let userData = JSON.stringify({ old_password: oldPasswordValue, new_password: newPasswordValue, new_password_confirm: newPassword_confirmValue });

    $.ajax({
        url: '/auth/change-password',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userData,
        success: function (result) {
            if (!result['status']) {
                fadeError(result['message'])
                return false;
            }

            showToast(result['message'])
            loadRedirect('/auth/logout')
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
    let email = $('#email');
    let phoneNumber = $('#phoneNumber');

    let emailValue = email.val().trim();
    let phoneNumberValue = phoneNumber.val().trim();

    if (emailValue.length == 0) {
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
    let userData = JSON.stringify({ email: emailValue, phone_number: phoneNumberValue });

    $.ajax({
        url: '/auth/reset-password',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userData,
        success: function (result) {
            if (!result['status']) {
                fadeError(result['message']);
                return false;
            } else {
                $("form")[0].reset();
                showToast(result['message']);
                return false;
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(errorThrown + "\n" + textStatus);
        }
    });

    $("#responseMessage").hide();
    return false;
}
// #endregion

//#region Chức năng đổi ảnh đại diện của người dùng
// Bật tắt button đổi avatar
$(document).on("change", "#avatarUploaded", function () {
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

    reader.onload = function () {
        document.getElementById("userAvatar").setAttribute('src', reader.result);
    }

    reader.readAsDataURL($('#avatarUploaded')[0].files[0]);
})

// Xong chức năng change ảnh đại diện
$(document).on("click", "#setNewAvatar", function () {
    let avatarUploaded = $('#avatarUploaded').prop('files')[0];

    let avatarUploadedExtension = avatarUploaded.type;

    const supportedExtension = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

    if (supportedExtension.includes(avatarUploadedExtension)) {

        var form_data = new FormData();
        form_data.append('avatar', avatarUploaded);

        $.ajax({
            url: '/auth/change-avatar',
            type: 'PUT',
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            success: function (result) {
                if (result['status']) {
                    showToast(result['message']);
                    $("#navbar-avatar").prop("src", result['data']['avatar_url']);
                    $('#avatarUploaded').val('')
                    $("#setNewAvatar").prop('disabled', true);
                } else {
                    showToast(result['message']);
                };
            }
        });
    } else {
        showToast('Không hỗ trợ dịnh dạng ảnh này !!!');
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
// #endregion

$(document).on('hidden.bs.modal', '#edit-salary-modal', function () {
    $("#edit-salary-error").removeClass('alert-warning').html('')
    $("#salary").val('')
})

function editSalary(e, userID) {
    $("#salary-old").val(e.parentNode.parentNode.dataset.salary);
    $("#confirm-edit-salary").data('id', userID);
    $("#edit-salary-modal").modal('show');
}

$(document).on('click', '#confirm-edit-salary', function () {
    let salary = $("#salary").val()

    if (!parseInt(salary) || parseInt(salary) < 1) {
        error = 'Vui lòng nhập Lương là số nguyên dương'
        $("#edit-salary-error").removeClass('alert-warning').addClass('alert-warning').html(error)
        return
    }
    salary = parseInt(salary)
    if (salary % 1000 != 0) {
        error = 'Tiền lương phải là bội số của 1000.'
        $("#edit-salary-error").removeClass('alert-warning').addClass('alert-warning').html(error)
        return
    }

    let formData = JSON.stringify({ salary: salary });
    $.ajax({
        url: '/users/salary/' + $("#confirm-edit-salary").data('id'),
        type: 'PUT',
        dataType: "json",
        contentType: "application/json",
        data: formData,
        success: function (result) {
            if (!result['status']) {
                $("#edit-salary-error").removeClass('alert-warning').addClass('alert-warning').html(result['errorMessage'])
                return
            }
            showToast(result['message']);
            $("#edit-salary-modal").modal('hide');
            loadComponent('/users/salary')
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    })
})

function showResetPasswordForUser(userID, name) {
    let inf = document.getElementById('inf');
    inf.innerHTML = userID + ' - ' + name;
    let confirm = document.getElementById('confirm-reset')
    confirm.setAttribute('onclick', 'resetPasswordForUser("' + userID + '")');
}

function resetPasswordForUser(userID) {
    $.ajax({
        url: '/auth/admin-reset-password',
        type: 'PUT',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({ user_id: userID }),
        success: function (result) {
            showToast(result['message']);
            if (!result['status']) {
                return
            }
            loadComponent('/users')
        },
        error: function (result) {
            console.log(result);
        }
    })
}

function loadDepartmentList() {
    // clear table
    let tbody = document.getElementById('department-table-body');
    if (tbody != null) {
        tbody.innerHTML = '';
    }
    let ajax = new XMLHttpRequest();
    ajax.open('GET', '/departments?api=1', 'true');
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
                h6.innerHTML = i['department_id'];
                let departmentID = i['department_id'];
                div1.appendChild(h6);
                id.append(div1)
                let tr = document.createElement('tr');
                id.classList.add('py-4')
                tr.appendChild(id);

                name.id = "department-name";
                name.innerHTML = i['name'];
                let departmentName = i['name'];
                name.classList.add('py-4')
                tr.appendChild(name);

                desc.id = "desc";
                desc.innerHTML = i['description'];
                let departmentDesc = i['description'];
                desc.classList.add('py-4')
                tr.appendChild(desc);

                leader.id = "leader";
                leader.innerHTML = "Chưa có trưởng phòng";
                if (i['leader_id'] != null) {
                    leader.innerHTML = i['leader_id'];
                }

                let departmentLeader = i['leader_id'];
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

                view.setAttribute('onclick', 'departmentDetail("' + i['department_id'] + '")')
                let div3 = document.createElement('div');
                div3.appendChild(view);
                action.appendChild(div3);
                tr.appendChild(action);

                tbody.appendChild(tr);
            })
        }
    })
}

function editDepartment() {
    $('#edit-bt').html('Xác nhận');
    $('#edit-bt').addClass('text-success');
    $('#edit-icon').removeClass('fa-wrench').addClass('fa-check text-success');
    $('#department-name-detail').html('<input id="department-name-edit" name="deparment-name" class="form-control w-75" type="text" value="' + $.trim($('#department-name-detail').html()) + '"/>');
    $('#department-desc-detail').html('<textarea rows="3" class="form-control w-75" id="department-desc-edit" name="deparment-desc">' + $.trim($('#department-desc-detail').html()) + '</textarea>');
    $('#department-room-detail').html('<input id="department-room-edit" name="deparment-room" class="form-control w-75" type="text" value="' + $.trim($('#department-room-detail').html()) + '"/>');

    $('#edit-department').attr('onclick', "validateEditDepartment()");
}

function validateEditDepartment() {
    //validate

    let id = document.getElementById('department-id-detail').innerHTML.trim();
    let name = document.getElementById('department-name-edit').value.trim();
    let desc = document.getElementById('department-desc-edit').value.trim();
    let room = document.getElementById('department-room-edit').value.trim();

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
    } else {
        message.innerHTML = "";
        message.setAttribute("hidden", "true");

        $('#editDepartmentModal').modal();
        $('#confirm-edit').click(function () {
            let departmentEditData = JSON.stringify({ department_id: id, name: name, description: desc, room: room });
            $.ajax({
                url: '/departments/update-department',
                type: 'PUT',
                dataType: "json",
                contentType: "application/json",
                data: departmentEditData,
                success: function (result) {
                    if (!result['status']) {
                        showToast(result['message'])
                        return
                    }
                    showToast(result['message'])
                    departmentDetail(id)
                },
                error: function (result) {
                    showToast("Có lỗi xảy ra. Vui lòng thử lại sau.")
                }
            })
        })
    }
}

function departmentDetail(departmentID) {
    $("#loading").fadeIn();
    fetch('/departments/' + departmentID + "?load=1")
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            $("#loading").fadeOut(500);
            $("#page-content").html(html);
            $("body").css("overflow-y", "scroll");
            window.history.pushState('/departments/' + departmentID, null, '/departments/' + departmentID);
        })
        .catch(function (err) {
            showToast("Có lỗi xảy ra. Vui lòng thử lại sau." + err.message)
        });
}

function fadeError(errorMessage) {
    let errorDiv = $("#responseMessage");
    if (errorDiv.hasClass('alert alert-success')) {
        errorDiv.removeClass('alert alert-success').addClass('alert alert-danger');
    } else {
        errorDiv.addClass('alert alert-danger');
    }

    errorDiv.html(errorMessage).fadeIn('slow')
}

function fadeResult(resultMessage) {
    let resultDiv = $("#responseMessage");

    if (resultDiv.hasClass('alert alert-danger')) {
        resultDiv.removeClass('alert-danger').addClass('alert alert-success');
    } else {
        resultDiv.addClass('alert alert-success');
    }

    resultDiv.html(resultMessage).fadeIn(1500);
}


// Done - chức năng add user mới
// Add user
function validateAddUser() {
    let fullname = document.forms["addUserForm"]["fullname-add"].value;
    let email = document.forms["addUserForm"]["email-add"].value;
    let dob = document.forms["addUserForm"]["dob-add"].value;
    let phone = document.forms["addUserForm"]["phone-add"].value;
    let salary = document.forms["addUserForm"]["salary-add"].value;
    let gender = document.forms["addUserForm"]["gender-add"].value;
    let department = document.forms["addUserForm"]["department-add"].value;

    let namebox = document.getElementById('fullname-add');
    let emailbox = document.getElementById('email-add');
    let dobbox = document.getElementById('dob-add');
    let phonebox = document.getElementById('phone-add');
    let salarybox = document.getElementById('salary-add');
    let malebox = document.getElementById('male-add');
    let femalebox = document.getElementById('female-add');
    let departmentbox = document.getElementById('department-add');
    let message = document.getElementById('message-add');

    const remail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const rephone = /^0\d{9,10}$/

    if (fullname == "") {
        message.innerHTML = "Hãy nhập tên nhân viên.";
        namebox.focus();
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

    if (!parseInt(salary) || parseInt(salary) < 1) {
        message.innerHTML = "Tiền lương phải là số nguyên dương";
        salarybox.focus();
        message.removeAttribute("hidden");
        return false;
    }

    salary = parseInt(salary)

    if (salary % 1000 != 0) {
        message.innerHTML = "Tiền lương phải là bội số của 1000";
        salarybox.focus();
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
    showAddDialog(fullname, email, dob, phone, salary, gender, department, departmentname);
    return false;
}

function showAddDialog(fullname, email, dob, phone, salary, gender, department, departmentname) {
    $("#addUserModal").modal();
    document.getElementById('add-name').innerHTML = fullname;
    let cf = document.getElementById('confirm-add');
    cf.setAttribute("onclick", "addUser('" + fullname + "','" + email + "','" + dob + "','" + phone + "'," + salary + ",'" + gender + "','" + department + "')");
}

function addUser(fullname, email, dob, phone, salary, gender, department) {
    let userAddData = JSON.stringify({ 'full_name': fullname, 'email': email, 'day_of_birth': dob, 'phone_number': phone, 'salary': salary, 'gender': gender, 'department_id': department });

    $.ajax({
        url: '/users/add',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userAddData,
        success: function (result) {
            if (result.status) {
                $("form[name='addUserForm'")[0].reset();
            }

            showToast(result.message)
        },
        error: function (result) {
            showToast("Có lỗi xảy ra. Vui lòng thử lại sau.")
        }
    });
}
// End add user

// Add Phòng ban mới
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
    $('#add-department-modal').modal('show');
    document.getElementById('add-name').innerHTML = depName;
    document.getElementById('add-room').innerHTML = depRoom;
    document.getElementById('add-desc').innerHTML = depDesc.substring(0, 12) + '...';
    let cf = document.getElementById('confirm-add');
    cf.setAttribute("onclick", "addDepartment('" + depName + "','" + depRoom + "','" + depDesc + "')");
}

function addDepartment(depName, depRoom, depDesc) {
    let userAddData = JSON.stringify({ name: depName, room: depRoom, description: depDesc });
    $.ajax({
        url: '/departments/add',
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: userAddData,
        success: function (result) {
            // console.log(result)
            if (!result['status']) {
                let message = document.getElementById('message-add');
                message.innerHTML = result['message']
                message.removeAttribute("hidden");
            }
            document.getElementById('message-add').innerHTML = "";
            document.getElementById('message-add').setAttribute("hidden", "true");
            $('#add-department-modal').modal('hide');

            showToast(result['message'])
            // return to list of departments
            urlPath = '/departments'
            loadComponent(urlPath)
            window.history.pushState(urlPath, null, urlPath)
        },
        error: function (result) {
            console.log(result);
            console.log("Không thể thêm vào CSDL");
        }
    });
}
// End add phòng ban

// Thăng chức trưởng phòng
function appointLeader(e, department, name) {
    this.event.stopPropagation()
    $('#appoint-leader').modal('show');

    $('#message-appoint').html('');
    $('#message-appoint').attr('hidden', 'true');
    $('#btn-appoint').click(function () {
        $('#message-appoint').html('');
        $('#message-appoint').attr('hidden', 'true');

        let action = $(e).data('action')
        let select = document.getElementById('choose-leader')
        if (select.value == "-1") {
            $('#message-appoint').html('Vui lòng chọn 1 nhân viên để bổ nhiệm');
            $('#message-appoint').removeAttr('hidden');
            $('#choose-leader').focus()
        } else {
            // All api update
            $.ajax({
                url: '/departments/appoint-leader',
                method: 'PUT',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify({ department_id: department, leader_id: select.value, action: action }),
                success: function (result) {
                    if (!result['status']) {
                        $('#message-appoint').html(result['message']);
                        $('#message-appoint').removeAttr('hidden');
                        return;
                    }
                    $('#message-appoint').html('');
                    $('#message-appoint').attr('hidden', 'true');
                    $('#appoint-leader').modal('hide')
                    loadComponent(window.location.pathname)
                    showToast(result['message'])
                },
                error: function (result) {
                    console.log(result)
                }
            })
        }
    })
}

// Phần TASK$
// Load nhân viên trong phòng ban
// List file - thêm files
$(document).on("change", "#attachment", function () {
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
$(document).on("click", ".custom-file-remove", function () {
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

// Reset create task form
$(document).on("click", "#reset", function () {
    resetTaskInfo();
})

$(document).on('hidden.bs.modal', "#new-task", function () {
    $("#reset").click();
})

function resetTaskInfo() {
    $("#attachment").removeData();
    $("#file-placeholder").show();
    $("#custom-file-list").empty();
    $("#attachment").val('');
}

// Done
// Submit tạo task
$(document).on("click", "#create-task", function () {
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

    if (Date.parse(deadline) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
        fadeError("Thời hạn phải sau thời điểm hiện tại");
        return;
    }

    files = []
    if ($("#attachment").data("files") != null) {
        files = $("#attachment").data("files");
    }

    var formData = new FormData();
    formData.append("title", title)
    formData.append("officer_id", employee)
    formData.append("description", desc)
    formData.append("deadline", deadline)
    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i])
    }

    $("#upload-complete").attr("disabled", true);
    $.ajax({
        url: '/tasks/create-task',
        type: 'POST',
        dataType: "json",
        caches: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (result) {
            $("#progress").hide();
            if (!result['status']) {
                $("#upload-complete").attr("disabled", false);
                $("#message").html(result['message']);
                return;
            }
            $("#message-dialog").modal('hide')
            $("#new-task").modal('hide')
            loadComponent('/tasks')
            showToast(result['message'])
        },
        error: function (error) {
            console.log(error);
            $("#upload-complete").attr("disabled", false);
            $("#progress").hide();
        },
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#message").html("Chờ chút nha...");
            $("#progress").show();
            // Upload progress
            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    let percent = (e.loaded / e.total) * 100
                    $("#progress-bar").width(percent + '%')
                }
            }
            return xhr
        }
    });
})

// Cancel Task - Leader function
$(document).on("click", "#task-cancel", function () {
    $("#confirm-task-cancel").modal({ backdrop: 'static', keyboard: false });
    $("#task-name").html($(this).data("task-name"));
    $("#staff-name").html($(this).data("staff-name"));
    $("#confirm").data("id", $(this).data("id"));
})

// Confirm cancel task
$(document).on("click", "#confirm", function () {

    $("#confirm-task-cancel").modal('hide');
    $.ajax({
        url: '/tasks/cancel-task',
        method: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ 'task_id': $(this).data("id") }),
        success: function (result) {
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#upload-complete").attr("disabled", false);
            $("#progress").hide();
            if (!result['status']) {
                $("#message").html(result['message']);
                return;
            }
            $("#message-dialog").modal('hide')
            loadComponent('/tasks')
            showToast(result['message'])
        },
        error: function (result) {
            console.log(result)
        }
    })
})

$(document).on('hidden.bs.modal', "#form-submit-task", function () {
    resetSubmitForm();
    $("#task-submit-title").val('');
    $("#submit-deadline").val('');
    $("#task-submit-desc").val('');
    $("#submit-task").data("id", undefined);
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

// Done
// Accept Task - Staff function
$(document).on("click", "#task-accept", function () {
    $.ajax({
        url: '/tasks/accept-task',
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify({
            'task_id': $(this).data('id')
        }),
        success: function (result) {
            if (!result['status']) {
                showToast(result['message'])
                return;
            }
            loadComponent('/tasks')
            showToast(result['message'])
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus + errorThrown)
        }
    })
})

// Submit Task - Staff function
$(document).on("click", "#submit", function () {
    let id = $(this).data('id')
    let action = $(this).data('action')

    $.ajax({
        url: '/tasks/task/' + id + '?api=1',
        method: 'GET',
        dataType: 'json',
        success: function (result) {
            if (!result['status']) {
                fadeErrorSubmit(result['message']);
                return;
            }
            result = result['data'];
            console.log(result)
            $("#task-submit-title").val(result['title']);
            $("#submit-deadline").val(result['deadline'].split(" ")[0]);
            $("#task-submit-desc").val(result['description']);
            $("#submit-task").data("id", id);
            $("#submit-task").data("action", action);

            if (result['status'] == 1) {
                $("#submit-deadline").attr("readonly", true);
            }

            if (result['status'] == 3) {
                $("#submit-deadline").attr("readonly", false);
            }
            $("#submit-deadline").data("deadline", $("#submit-deadline").val());
        },
        error: function (err, textStatus) {
            console.log(err + ": " + textStatus)
        }
    })
})

$(document).on("click", "#submit-task", function () {
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
    formData.append("content", msg);
    formData.append("deadline", deadline);

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i])
    }

    $("#upload-complete").attr("disabled", true);
    $.ajax({
        url: '/tasks/' + $(this).data("action") + '-task/' + $(this).data("id"),
        type: 'PUT',
        dataType: "json",
        caches: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (result) {
            $("#upload-complete").attr("disabled", false);

            if (!result['status']) {
                $("#message").html(result['message']);
                $("#progress").hide();
                return;
            }
            $("#message-dialog").modal("hide");
            $("#form-submit-task").modal("hide");
            loadComponent('/tasks')
            showToast(result['message'])
        },
        error: function (error) {
            console.log(error);
            $("#upload-complete").attr("disabled", false);
        },
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#message").html("Chờ chút nha...");
            $("#progress").show();
            // Upload progress
            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    let percent = (e.loaded / e.total) * 100
                    $("#progress-bar").width(percent + '%')
                }
            }
            return xhr
        }
    });
})

$(document).on("change", "#submit-attachment", function () {
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
$(document).on("click", ".submit-custom-file-remove", function () {
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
$(document).on("click", "#completed", function () {

    let id = $(this).data('id');

    // reset rate
    $("#task-rate").empty();
    $("#task-rate").val('');

    $.ajax({
        url: '/tasks/task/' + id + '?api=1',
        method: 'GET',
        dataType: 'json',
        success: function (result) {
            if (!result['status']) {
                fadeRateError(result['message']);
                return;
            }
            result = result['data'];
            $("#rate-task-title").val(result['title']);
            let deadline = result['deadline'].split(" ")[0];
            let submit = result['updated_at'].split(" ")[0];

            $("#rate-deadline").val(deadline);
            $("#rate-submit-time").val(submit);

            if (Date.parse(deadline) < Date.parse(submit)) {
                $("#feedback").removeClass().addClass("badge badge-warning").html("Late");
                var option = [{ 0: "Bad" }, { 1: "OK" }];
            } else {
                $("#feedback").removeClass().addClass("badge badge-success").html("On Time");
                var option = [{ 0: "Bad" }, { 1: "OK" }, { 2: "Good" }];
            }

            let taskRate = document.getElementById("task-rate");
            option.forEach((rate, id) => {
                let option = document.createElement("option");
                option.textContent = rate[id];
                option.value = id;
                taskRate.appendChild(option);
            });

            $("#rateTask").data("id", result['_id']);
        },
        error: function (err, text) {
            console.log(err + ": " + text);
        }
    })
})

$(document).on("click", "#rateTask", function () {
    let rate = $("#task-rate").val();

    if (rate == "") {
        fadeRateError("Vui lòng chọn mức độ đánh giá");
        return;
    }

    $.ajax({
        url: '/tasks/approve-task',
        method: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            'task_id': $(this).data("id"),
            'rate': rate
        }),
        success: function (result) {
            $("#message-dialog").modal({ backdrop: 'static', keyboard: false })
            $("#upload-complete").attr("disabled", false);
            $("#progress").hide();
            if (!result['status']) {
                $("#message").html(result['message']);
                return;
            }
            $("#rate-task").modal("hide");
            $("#message-dialog").modal("hide")
            loadComponent('/tasks')
            showToast(result['message'])
        },
        error: function (result) {
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

    errorDiv.html(errorMessage).fadeIn(1500);
}

// Click to download file
$(document).on("click", "div .custom-file-item", function (e) {
    e.preventDefault();
    if ($(this).attr("href") != undefined) {
        //Download file
        let url = $(this).attr("href");
        var link = document.createElement("a");

        fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
                link.href = window.URL.createObjectURL(blob);
                if (url.indexOf("?") > 0) {
                    link.download = url.substring(
                        url.lastIndexOf("/") + 1,
                        url.indexOf("?")
                    );
                } else {
                    link.download = url.substring(url.lastIndexOf("/") + 1);
                }

                link.click();
            })
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