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

    document.getElementById("usernameHeading").textContent = user.user_username;
    getUserRank(user._id, $('#userRank'));

    if(user.user_subscribed_to === undefined || user.user_subscribed_to.length == 0) {
        $('#totalSubscriptions').append("None :(");
    } else {
        $('#totalSubscriptions').append(user.user_subscribed_to.length);
    }


}