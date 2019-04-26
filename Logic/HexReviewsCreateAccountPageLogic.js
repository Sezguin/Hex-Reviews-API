var avatarData = "";
var goodPass = false;
var goodUser = false;

$(document).ready(function() {
    $("#createUserButton").click(function() {
        addUser();
    });

    $("#successfulModalLoginButton").click(function() {
        window.location.href = "/LoginPage"
    });

    $("#userUsername").keyup(function(){
        validateUsername();
    });

    $("#userPassword").keyup(function(){
        validatePassword();
    });

    $("#userPasswordConfirm").keyup(function(){
        confirmPassword();
    });

    //  Hide certain elements on page load.
    document.getElementById("successIcon").style.display = 'none';
    document.getElementById("failureIcon").style.display = 'none';
    document.getElementById("successfulModalCloseButton").style.display = 'none';
    document.getElementById("successfulModalLoginButton").style.display = 'none';
});

//  Preview uploaded avatar.
$(function () {
    $("#avatarUpload").change(function () {
        if (typeof (FileReader) != "undefined") {
            var dvPreview = $("#avatarPreview");
            dvPreview.html("");

            //  Regular expression for ensuring files have corrent extensions.
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

            $($(this)[0].files).each(function() {
                var file = $(this);
                if (regex.test(file[0].name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = $("<img />");
                        img.attr("style", "width: 200px");
                        img.attr("id", "avatarImage");
                        img.attr("src", e.target.result);
                        dvPreview.append(img);
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

function addUser() {
    if((goodUser) && (goodPass)) {
        collectAvatar(postUser);
    }
}

function postUser() {

    //  All game attributes from form.
    var userEmail       = $('#userEmailAddress').val();
    var userPassword    = $('#userPassword').val();
    var userUsername    = $('#userUsername').val();


    $.post( GlobalURL + "/users/", 
    {   
        user_email: userEmail,
        user_password: userPassword,
        user_username: userUsername,
        user_avatar: avatarData
    },
    function(data) {
        if(data == "success") {
            $("#successModalTitle").text("Account created!");
            $("#successfulPostModalSpinner").hide();
            $("#pleaseLogin").text("Please login to continue...");
            document.getElementById("successIcon").style.display = 'block';
            document.getElementById("successfulModalLoginButton").style.display = 'block';
        } else {
            $("#successModalTitle").text("Error :/");
            $("#successfulPostModalSpinner").hide();
            document.getElementById("failureIcon").style.display = 'block';
            document.getElementById("successfulModalCloseButton").style.display = 'block';
        }
    });
}

function collectAvatar(callback) {

    //  All image attributes from form.
    var imageInput  = $('#avatarUpload').get(0);

    $($(imageInput)[0].files).each(function() {
        var file = $(this);
        var reader = new FileReader();

        reader.onload = function(event) {
            receivedText(event.target.result);
        }
        reader.readAsDataURL(file[0]);
    });

    function receivedText(imageData) {

        avatarData = imageData;
    }

    //  Calling the callback function to post user with a 2 second delay.
    $("#successfulPostModal").modal("show");
    window.setTimeout(callback, 2000);
}

function validateUsername() {

    $("#userUsername").removeClass("bad");
    $("#userUsername").removeClass("good");
    document.getElementById("invalidUsername").style.color = "red";

    var value = $("#userUsername").val();

    if(value == "") {
        $("#userUsername").addClass("bad");
        document.getElementById("invalidUsername").innerHTML = "Please enter a username!";
        document.getElementById("invalidUsername").style.color = "red";
        goodUser = false;
    } else if(value.length < 3) {
        $("#userUsername").addClass("bad");
        document.getElementById("invalidUsername").innerHTML = "Username is too short!";
        document.getElementById("invalidUsername").style.color = "red";
        goodUser = false;
    } else if (value.length > 15) {
        $("#userUsername").addClass("bad");
        document.getElementById("invalidUsername").innerHTML = "Username is too long!";
        document.getElementById("invalidUsername").style.color = "red";
        goodUser = false;
    } else {
        $.ajax({
            url: GlobalURL + '/username/login/' + value,
            type: 'GET',
            success: function(result) {
                if(result) {
                    $("#userUsername").addClass("bad");
                    document.getElementById("invalidUsername").innerHTML = "Username already exists...";
                    document.getElementById("invalidUsername").style.color = "red";
                    goodUser = false;

                } else {
                    $("#userUsername").addClass("good");
                    document.getElementById("invalidUsername").innerHTML =  value + " is available!";
                    document.getElementById("invalidUsername").style.color = "green";
                    goodUser = true;
                }
            }
        });
    }
}

function validatePassword() {

    $("#userPassword").removeClass("bad");
    $("#userPassword").removeClass("good");
    document.getElementById("invalidPassword").style.color = "red";

    var value = $("#userPassword").val();

    if(value == "") {
        $("#userPassword").addClass("bad");
        document.getElementById("invalidPassword").innerHTML = "Please enter a password!";
        document.getElementById("invalidPassword").style.color = "red";
        $("#userPasswordConfirm").attr("disabled", true);
        goodPass = false;
    } else if(value.length < 5) {
        $("#userPassword").addClass("bad");
        document.getElementById("invalidPassword").innerHTML = "Your password must be more than 5 characters.";
        document.getElementById("invalidPassword").style.color = "red";
        $("#userPasswordConfirm").attr("disabled", true);
        goodPass = false;
    } else {
        $("#userPassword").removeClass("bad");
        $("#userPassword").addClass("good");
        $("#userPasswordConfirm").attr("disabled", false);
        document.getElementById("invalidPassword").innerHTML = "";
        goodPass = false;
    }
}

function confirmPassword() {
    $("#userPasswordConfirm").removeClass("bad");
    $("#userPasswordConfirm").removeClass("good");
    document.getElementById("invalidPasswordConfirm").style.color = "red";

    var pass1 = $("#userPassword").val();
    var pass2 = $("#userPasswordConfirm").val();

    if (pass1 == pass2) {
        document.getElementById("invalidPassword").innerHTML = "";
        document.getElementById("invalidPasswordConfirm").innerHTML = "";
        $("#userPasswordConfirm").addClass("good");
        goodPass = true;
    } else {
        document.getElementById("invalidPasswordConfirm").innerHTML = "Passwords do not match!";
        $("#userPasswordConfirm").addClass("bad");
        goodPass = false;
    }
}