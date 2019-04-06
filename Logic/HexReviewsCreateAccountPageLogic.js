var avatarData = "";

$(document).ready(function() {
    $("#createUserButton").click(function() {
        addUser();
    });

    $("#successfulModalLoginButton").click(function() {
        window.location.href = "/LoginPage"
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
    console.log("Create account button has been clicked.");
    collectAvatar(postUser);
}

function postUser() {
    console.log("User is being posted...");

    //  All game attributes from form.
    var userEmail       = $('#userEmailAddress').val();
    var userPassword    = $('#userPassword').val();
    var userUsername    = $('#userUsername').val();

    //  Check whether the online checkbox is selected.
    if($('#onlineCheckbox').prop("checked") == true) {
        gameOnline = true;
    } else if($('#onlineCheckbox').prop("checked") == false) {
        gameOnline = false;
    }

    $.post("https://hex-reviews.herokuapp.com/users/", 
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
        console.log("Message from API: " + JSON.stringify(data));
    });
}

function collectAvatar(callback) {
    console.log("Avatar is being collected...");

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