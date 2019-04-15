//  Globally get cookies.
var cookies = getCookies();
var globalUserID;

$(document).ready(function () {

    //  Grab ID from URL parameter.
    var url_string = window.location.href;
    var url = new URL(url_string);
    var userID = url.searchParams.get("id");
    globalUserID = userID;

    getUserData(userID);

    $('#addCommentButton').click(function () {
        addComment();
    });
});

function getUserData(userID) {

    console.log("Getting user data for: " + userID);

    $.ajax({
        url: GlobalURL + '/users/' + userID,
        type: 'GET',
        success: function (user) {
            buildProfile(user);
        }
    });
}

function buildProfile(user) {
    $('#userAvatar').attr("src", user.user_avatar);

}