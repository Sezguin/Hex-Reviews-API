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
        url: GlobalURL + '/images/avatar/' + cookies.username,
        type: 'GET',
        success: function(result) {
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
