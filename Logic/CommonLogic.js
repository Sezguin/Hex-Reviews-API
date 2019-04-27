//  For live:           https://hex-reviews.herokuapp.com
//  For Development:    http://localhost:4500

var GlobalURL = "http://localhost:4500"

$(document).ready(function () {
    $("#viewGamesPageButton").click(function () {
        window.location.href = "/ViewGamesPage"
    });

    $("#goToAddGamePageButton").click(function () {
        window.location.href = "/AddGamePage"
    });

    $("#navHome").click(function () {
        window.location.href = "/AdminHomePage"
    });

    $("#navViewUserProfile").click(function () {
        window.location.href = "/ViewUserProfilePage"
    });

    $("#navAddGame").click(function () {
        window.location.href = "/AddGamePage"
    });

    $("#navUserViewGames").click(function () {
        window.location.href = "/UserViewGamesPage"
    });

    $("#navViewGames").click(function () {
        window.location.href = "/ViewGamesPage"
    });

    $("#navUserViewReviews").click(function () {
        window.location.href = "/UserViewReviewsPage"
    });

    $("#navViewSubcriptions").click(function () {
        window.location.href = "/UserSubscriptionsPage"
    });

    $("#navLogin").click(function () {
        window.location.href = "/LoginPage"
    });

    $("#navCreateAccount").click(function () {
        window.location.href = "/CreateAccountPage"
    });

    $("#navTitle").click(function () {
        window.location.href = "/"
    });

    $("#navUserHome").click(function () {
        window.location.href = "/UserHomePage";
    });

    $("#navWriteReview").click(function () {
        window.location.href = "/UserReviewPage";
    });

    $("#navLogout").click(function () {
        logoutUser();
    });

    $("#createAccountButton").click(function () {
        window.location.href = "/CreateAccountPage"
    });
});

function goToViewSingleGamePage(gameID) {
    window.location.href = "/ViewSingleGamePage?id=" + gameID;
}

function goToViewGameReviewsPage(gameID) {
    window.location.href = "/ViewGameReviewsPage?id=" + gameID;
}

function goToViewSingleReviewPage(reviewID) {
    window.location.href = "/ViewSingleReviewPage?id=" + reviewID;
}

function goToViewOtherUserProfilePage(userID) {
    window.location.href = "/ViewOtherProfilePage?id=" + userID;
}

function goToViewOtherReviewsPage(userID) {
    window.location.href = "/ViewOtherUserReviewsPage?id=" + userID;
}
function goToWriteReviewPage(gameID) {
    window.location.href = "/AddReviewPage?id=" + gameID;
}

function goToUserViewSingleGamePage(gameID) {
    window.location.href = "/UserViewSingleGamePage?id=" + gameID;
}

function goToUserEditProfilePage(userID) {
    window.location.href = "/UserEditProfilePage?id=" + userID;
}



/*****  General functions for deleting from the database.   *****/

//  Delete a game by ID supplied.
function deleteGame(button) {

    var id = button.parentNode.childNodes[0].innerHTML;
    var name = button.parentNode.childNodes[1].innerHTML;

    $.ajax({
        url: GlobalURL + '/games/' + id,
        type: 'DELETE',
        success: function (result) {
            console.log(name + " has successfully been removed from the database.");
            console.log("Information from API: " + result.message);
        }
    });

    window.location.href = "/ViewGamesPage"
}

//  Delete a review by ID supplied.
function deleteReview(id) {

    $.ajax({
        url: GlobalURL + '/reviews/' + id,
        type: 'DELETE',
        success: function (result) {
            console.log("The review has successfully been removed from the database.");
            console.log("Information from API: " + result.message);
        }
    });

    location.reload();
}

//  A global function for retrieving the user ID.
function getUser(userID) {
    $.ajax({
        url: GlobalURL + '/users/' + userID,
        type: 'GET',
        success: function (user) {
            return user;
        }
    });
}

//  Log out user when button is clicked.
function logoutUser() {

    //  Forcefully expiring the cookie.
    document.cookie = "username= ; user_id= ;";

    //  Redirecting to title page.
    window.location.href = "/";
}

//  Get cookies stored on the machine.
var getCookies = function () {
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split("=");
        cookies[(pair[0] + '').trim()] = unescape(pair[1]);
    }
    return cookies;
}

//  Read cookies stored on the machine based on request.
function readCookies(request) {

    //  Grab all cookie information.
    var cookieChunk = document.cookie;

    console.log("Cookie chunk: " + cookieChunk);

    //  Get each individual key value pair.
    cookieInformation = cookieChunk.split(';');

    //  Extract each element.
    for (var i = 0; i < cookieInformation.length; i++) {

        name = cookieInformation[i].split('=')[0];
        value = cookieInformation[i].split('=')[1];

        if (request == "username" && name == "username") {
            console.log("Returning user session name of " + value + "...");

            return value;
        }

        if (request == "user_id" && name == "user_id") {
            console.log("Returning user id of " + value + "...");

            return value
        }
    }
}

//  Get the user's rank from a supplied ID.
function getUserRank(userID, item, append) {
    $.ajax({
        url: GlobalURL + '/users/rank/' + userID,
        type: 'GET',
        success: function(result) {
            console.log("Rank: " + result);
            if(append) {
                item.append(result);
            } else {
                item.text(result);
            }
        }
    });
}



/*****  All deprecated functionality.   *****/

//  DEPRECATED. General function for counting elements in array...
//  Because apparently 'array.length;' was too simple.
function countArrayElements(array) {
    var count = 0;

    console.log("Array: " + array);

    if (array === undefined || array.length == 0) {
        return 0;
    } else {
        for (var i = 0; i < array.length; i++) {
            count = count + 1;
        }

        console.log("Count: " + count);
        return count;
    }
}

//  DEPRECATED. Grab game name from supplied ID.
function getGameNameFromID(gameID) {
    $.ajax({
        url: GlobalURL + '/games/' + gameID,
        type: 'GET',
        success: function (result) {
            return result.game_title;
        }
    });
}

//  DEPRECATED. Grab username from supplied ID.
function getUsernameFromID(userID) {
    $.ajax({
        url: GlobalURL + '/users/username/' + userID,
        type: 'GET',
        success: function (result) {
            if (result == false) {
                console.log("No user found with that ID.");
                return result;
            } else {
                return result;
            }
        }
    });
}

//  DEPRECATED. General function for subscribing to a user.
function subscribe(subscriberData, subscribeeData) {

    //  Subscriber to user.
    $.post(GlobalURL + "/users/subscribe", 
    {   
        subscriber: subscriberData,
        subscribee: subscribeeData,
    },
    function(data, status) {
        if(data == "success") {
            console.log("User has subscribed.")
        } else {
            console.log("Error when subscribing to user.");
        }
    });

    //  Update subscribee's follower list.
    $.post(GlobalURL + "/users/follower", 
    {   
        subscriber: subscriberData,
        subscribee: subscribeeData,
    },
    function(data, status) {
        if(data == "success") {
            console.log("Follower has been added to subscribee's list.")
        } else {
            console.log("Error when updating subscribee's followers.");
        }
    });
}

//  DEPRECATED. General function for unsubscribing from a user.
function unsubscribe(subscriberData, subscribeeData) {

    //  Subscriber to user.
    $.post(GlobalURL + "/users/unsubscribe", 
    {   
        subscriber: subscriberData,
        subscribee: subscribeeData,
    },
    function(data, status) {
        if(data == "success") {
            console.log("User has unsubscribed.")
        } else {
            console.log("Error when subscribing to user.");
        }
    });

    //  Update subscribee's follower list.
    $.post(GlobalURL + "/users/unfollow", 
    {   
        subscriber: subscriberData,
        subscribee: subscribeeData,
    },
    function(data, status) {
        if(data == "success") {
            console.log("Follower has been removed from subscibee's list.")
        } else {
            console.log("Error when updating subscribee's followers.");
        }
    });
}