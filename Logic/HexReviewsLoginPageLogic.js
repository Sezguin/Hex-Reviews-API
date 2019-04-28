$(document).ready(function() {
    $("#loginButton").click(function() {
        loginUser(checkPassword);
    });

    document.getElementById("usernameField").addEventListener("keyup", function(event) {
        if(event.keyCode === 13) {
            loginUser(checkPassword);
        }
    });

    document.getElementById("passwordField").addEventListener("keyup", function(event) {
        if(event.keyCode === 13) {
            loginUser(checkPassword);
        }
    });
});

function loginUser(callback) {
    
    document.getElementById("invalidUsername").innerHTML = "";
    document.getElementById("invalidPassword").innerHTML = "";
    $('#successfulPostModal').show();
    $("#usernameField").removeClass("bad");
    $("#usernameField").removeClass("good");
    $("#passwordField").removeClass("bad");
    $("#passwordField").removeClass("good");


    var username = $('#usernameField').val();
    var password = $('#passwordField').val();

    if(username == "") {
        document.getElementById("invalidUsername").innerHTML = "Please enter a username...";
        $('#successfulPostModal').hide();
        $("#usernameField").addClass("shake");
        $("#usernameField").addClass("bad");
        setTimeout(resetInputFields, 900);

    } else {
        $.ajax({
            url: GlobalURL + '/username/login/' + username,
            type: 'GET',
            success: function(result) {    
                if(result) {
                    console.log("Username exists in the database.");

                    $("#usernameField").addClass("good");

                    if(password == "") {
                        document.getElementById("invalidPassword").innerHTML = "Please enter a password...";
                        $('#successfulPostModal').hide();
                        $("#passwordField").addClass("shake");
                        $("#passwordField").addClass("bad");
                        setTimeout(resetInputFields, 900);
                    } else {
                        //  Continue to check user's password.
                        callback();
                    }
                } else {
                    console.log("Username does not exist in the database.");

                    document.getElementById("invalidUsername").innerHTML = "Username does not exist!";
                    $('#successfulPostModal').hide();
                    $("#usernameField").addClass("shake");
                    $("#usernameField").addClass("bad");
                    setTimeout(resetInputFields, 900);
                }
            }
        });
    }
}

function checkPassword() {

    var username = $('#usernameField').val();
    var password = $('#passwordField').val();

    $.post(GlobalURL + "/username/login/", 
    {   
        user_username: username,
        user_password: password,
    },
    function(data) {
        if(data) {            
            $("#usernameField").addClass("good");
            $("#passwordField").addClass("good");
            goToUserHomePage(username);

        } else if (!data) {
            document.getElementById("invalidPassword").innerHTML = "Your password was incorrect.";
            $('#successfulPostModal').hide();
            $("#passwordField").addClass("shake");
            $("#passwordField").addClass("bad");
            setTimeout(resetInputFields, 900);

        } else if (data == "err") {
            console.log("An unexpected error has occured.")
        }
    });
}

function goToUserHomePage(username) {

    //  Get ID of user.
    $.ajax({
        url: GlobalURL + '/users/id/' + username,
        type: 'GET',
        success: function(result) {
            if(result == "failure") {
                console.log("Username does not exist in the database.");
            } else {                
                getUserInformation(result);
            }
        }
    });
}

function getUserInformation(id) {

    //  Get ID of user.
    $.ajax({
        url: GlobalURL + '/users/' + id,
        type: 'GET',
        success: function(result) {
            if(!result) {
                console.log("Username does not exist in the database.");
            } else {                
                configureCookie(result);
            }
        }
    });
}

function configureCookie(user) {

    //  Setting cookie value for username.
    document.cookie = "username=" + user.user_username;
    document.cookie = "user_id=" + user._id;

    if(user.user_admin) {
        console.log("User is an admin.");
        document.cookie = "user_admin=" + true;
        window.location.href = "/AdminHomePage";


    } else if (!user.user_admin) {
        console.log("User is not an admin.");
        document.cookie = "user_admin=" + false;
        window.location.href = "/UserHomePage";

    }
}

function resetInputFields() {
    $("#usernameField").removeClass("shake");
    $("#passwordField").removeClass("shake");

}