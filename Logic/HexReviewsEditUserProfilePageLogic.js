//  Globally get cookies.
var cookies = getCookies();
var globalUserID = cookies.user_id;
var globalUser;
var tempPassword = "";

$(document).ready(function () {

    setMiniAvatar($('#miniAv'), cookies.username);
    
    getUserData(globalUserID);

    $('#confirmChangesButton').click(function() {
        $("#successfulPostModal").modal("show");
        updateUser();
    });

    $('#successfulModalCloseButton').click(function() {
        window.location.href = "/ViewUserProfilePage";
    });

    //  Hide certain elements on page load.
    document.getElementById("successIcon").style.display = 'none';
    document.getElementById("failureIcon").style.display = 'none';
    document.getElementById("successfulModalCloseButton").style.display = 'none';
});

$(document).on('click', "#changeEmailButton", function () {
    editEmail();
}).on('click', "#doneEmailButton", function () {
    doneEditEmail();
}).on('click', "#changePasswordButton", function () {
    editPassword();
}).on('click', "#donePasswordButton", function () {
    doneEditPassword();
}).on('click', "#cancelChangeButton", function () {
    cancelPasswordChange();
});

//  Change the avatar and preview.
$(function () {
    $("#avatarUpload").change(function () {
        if (typeof (FileReader) != "undefined") {
            var dvPreview = $("#avatarPreview");
            dvPreview.html("");

            //  Regular expression for ensuring files have corrent extensions.
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

            $($(this)[0].files).each(function () {
                var file = $(this);
                if (regex.test(file[0].name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = $("<img />");
                        $('#userAvatar').attr("src", e.target.result);
                    }

                    reader.readAsDataURL(file[0]);
                } else {
                    alert(file[0].name + " is not a valid image file.");
                    dvPreview.html("");
                    return false;
                }
            });
        } else {
            alert("This browser does not support HTML5 FileReader.");
        }
    });
});

function getUserData(userID) {
    $.ajax({
        url: GlobalURL + '/users/' + userID,
        type: 'GET',
        success: function (user) {
            globalUser = user;
            buildProfile(user);
        }
    });
}

function buildProfile(user) {
    $('#userAvatar').attr("src", user.user_avatar);

    document.getElementById("usernameHeading").textContent = user.user_username;
    $('#userEmailAddress').val(user.user_email);
    getUserRank(user._id, $('#userRank'));

}

function editEmail() {
    $('#userEmailAddress').attr("readonly", false);
    $('#changeEmailButton').text("Done");
    $('#changeEmailButton').attr('id', 'doneEmailButton');
}

function doneEditEmail() {
    $('#userEmailAddress').attr("readonly", true);
    $('#doneEmailButton').text("Edit");
    $('#doneEmailButton').attr('id', 'changeEmailButton');
}

function editPassword() {
    $('#userOldPassword').attr("readonly", false);
    $('#userNewPassword1').attr("readonly", false);
    $('#userNewPassword2').attr("readonly", false);
    $('#changePasswordButton').text("Done");
    $('#changePasswordButton').attr('id', 'donePasswordButton');
    $('#cancelChangeButton').attr('hidden', false);

}

function doneEditPassword() {
    if ($('#userOldPassword').val() == globalUser.user_password) {
        if ($('#userNewPassword1').val() == "") {
            alert("Your new password cannot be blank.");
        } else if ($('#userNewPassword1').val() == $('#userNewPassword2').val()) {
            $('#userOldPassword').attr("readonly", true);
            $('#userNewPassword1').attr("readonly", true);
            $('#userNewPassword2').attr("readonly", true);
            $('#donePasswordButton').text("Edit Password");
            $('#donePasswordButton').attr('id', 'changePasswordButton');
            $('#cancelChangeButton').attr('hidden', true);

            tempPassword = $('#userNewPassword1').val();
        } else {
            alert("Your new passwords do not match.");
        }
    } else {
        alert("Your old password is incorrect.");
    }
}

function cancelPasswordChange() {
    $('#userOldPassword').attr("readonly", true);
    $('#userNewPassword1').attr("readonly", true);
    $('#userNewPassword2').attr("readonly", true);
    $('#donePasswordButton').text("Edit Password");
    $('#donePasswordButton').attr('id', 'changePasswordButton');
    $('#cancelChangeButton').attr('hidden', true);
    $('#userOldPassword').val("");
    $('#userNewPassword1').val("");
    $('#userNewPassword2').val("");
}

function updateUser() {
    if(tempPassword == "") {
        tempPassword = globalUser.user_password;
    }
    $.ajax({
        url: GlobalURL + '/users/' + globalUserID,
        type: 'PUT',
        data: 
            {"user_email":"" + $('#userEmailAddress').val() + "",
            "user_password":"" + tempPassword + "",
            "user_avatar":"" + document.getElementById("userAvatar").src + ""},
            
        success: function (data) {
            if (!data) {
                console.log("There was an error.");0
                $("#successModalTitle").text("Error :/");
                $("#successfulPostModalSpinner").hide();
                document.getElementById("failureIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButton").style.display = 'block';
            } else if (data) {
                console.log("Successful update.");
                $("#successModalTitle").text("Details updated!");
                $("#successfulPostModalSpinner").hide();
                document.getElementById("successIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButton").style.display = 'block';
            }
        }
    });
}