var cookies;

$(document).ready(function() {

    $("#browseGamesButton").click(function() {
        window.location.href = "/UserViewGamesPage";
    });

    $("#writeReviewButton").click(function() {
        window.location.href = "/AddReviewPage";
    });

    $("#subscriptionsButton").click(function() {
        window.location.href = "/UserSubscriptionsPage";
    });

    $("#requestGameButton").click(function() {
        window.location.href = "/UserViewGamesPage";
    });

    $("#myProfileButton").click(function() {
        window.location.href = "/ViewUserProfilePage";
    });

    $("#helpButton").click(function() {
        window.location.href = "/UserViewGamesPage";
    });

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
