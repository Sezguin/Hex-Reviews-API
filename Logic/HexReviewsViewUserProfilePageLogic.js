//  Globally get cookies.
var cookies = getCookies();
var globalUserID = cookies.user_id;

$(document).ready(function () {
    
    getUserData(globalUserID);

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