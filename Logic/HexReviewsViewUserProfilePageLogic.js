//  Globally get cookies.
var cookies = getCookies();
var globalUserID = cookies.user_id;

$(document).ready(function () {
    
    getUserData(globalUserID);

    $('#addCommentButton').click(function () {
        addComment();
    });
    $('#myReviewsButton').click(function () {
        window.location.href = "/UserReviewPage";
    });
    $('#mySubscriptionsButton').click(function () {
        window.location.href = "/UserSubscriptionsPage";
    });
    $('#editProfileButton').click(function () {
        goToUserEditProfilePage(globalUserID)
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

    if(user.user_subscribers === undefined || user.user_subscribers.length == 0) {
        $('#totalFollowers').append("None :(");
    } else {
        $('#totalFollowers').append(user.user_subscribers.length);
    }

    if(user.user_reviews === undefined || user.user_reviews.length == 0) {
        $('#totalReviews').append("None :(");
    } else {
        $('#totalReviews').append(user.user_reviews.length);
    }


}