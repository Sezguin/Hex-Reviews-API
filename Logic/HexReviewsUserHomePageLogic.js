var cookies;

$(document).ready(function() {

    //  Grab session name from cookie.
    cookies = getCookies();

    $("#userWelcome").text("Welcome, " + cookies.username);

    //  Grab user's avatar.
    collectAvatar(displayAvatar);
});

function collectAvatar(callback) {

    $.ajax({
        url: 'https://hex-reviews.herokuapp.com/images/avatar/' + cookies.username,
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
