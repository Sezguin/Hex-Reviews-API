$(document).ready(function() {
    $("#loginButton").click(function() {
        loginUser(checkPassword);
    });

    //  Hide certain elements on page load.
    document.getElementById("successIcon").style.display = 'none';
    document.getElementById("failureIcon").style.display = 'none';
    document.getElementById("successfulModalCloseButton").style.display = 'none';
    document.getElementById("successfulModalContinueButton").style.display = 'none';
});

function loginUser(callback) {

    console.log("Logging in...");

    var username   = $('#usernameField').val();

    $.ajax({
        url: 'http://localhost:4500/username/login/' + username,
        type: 'GET',
        success: function(result) {
            console.log("Information from API: " + JSON.stringify(result));

            if(result) {
                console.log("Username exists in the database.");

                //  Calling the callback function to check the password with a 2 second delay.
                $("#successfulPostModal").modal("show");
                window.setTimeout(callback, 1000);
            } else {
                console.log("Username does not exist in the database.");

                //  Displaying no username information.
                $("#successfulPostModal").modal("show");
                window.setTimeout(noUsernameExists, 2000);
            }
        }
    });
}

function checkPassword() {

    var username = $('#usernameField').val();
    var password = $('#passwordField').val();

    $.post("http://localhost:4500/username/login/", 
    {   
        user_username: username,
        user_password: password,
    },
    function(data) {
        if(data == true) {
            console.log("Password was correct.");

            $("#successModalTitle").text("Welcome, " + username);
            window.setTimeout(goToUserHomePage(username), 1000);

        } else if (data == false) {
            console.log("Password was incorrect.");

            $("#successModalTitle").text("Incorrect Password");
            $("#successfulPostModalSpinner").hide();
            document.getElementById("failureIcon").style.display = 'block';
            document.getElementById("successfulModalCloseButton").style.display = 'block';

        } else if (data == "err") {
            console.log("An unexpected error has occured.")
        }
    });
}

function noUsernameExists() {

    var username = $('#usernameField').val();

    $("#successModalTitle").text("User: " + username + " does not exist...");
    $("#successfulPostModalSpinner").hide();
    document.getElementById("failureIcon").style.display = 'block';
    document.getElementById("successfulModalCloseButton").style.display = 'block';
}

function goToUserHomePage(username) {

    console.log("Transferring " + username + " to user home page...");

    //  Setting cookie value for username.
    document.cookie = "username=" + username;

    var x = document.cookie;

    console.log("Login Page Cookie: " + x);

    window.location.href = "/UserHomePage";
}