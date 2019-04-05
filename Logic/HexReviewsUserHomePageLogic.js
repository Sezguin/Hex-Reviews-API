var userID;

$(document).ready(function() {

    //  Grab session name from cookie.
    userID = readCookies("username");

    console.log("Cookie: " + userID);

    $("#userWelcome").text("Welcome, " + userID);

    //  Grab user's avatar.
    collectAvatar(displayAvatar);
});

function collectAvatar(callback) {

    $.ajax({
        url: 'http://localhost:4500/images/avatar/' + userID,
        type: 'GET',
        success: function(result) {
            console.log("Information from API: " + JSON.stringify(result));
            callback(result);
        }
    });
}

function displayAvatar(data) {
    var output = document.getElementById("userAvatar");

    if(data != "") {
        output.src = data;
    } else {
        output.src = "/Images/DefaultAvatar.jpg";
    }
}
