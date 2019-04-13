//  Globally get cookies.
var cookies = getCookies();

$(document).ready(function() {
    getSubscriptions(cookies.user_id);
});

//  Fetch the list of reviews for a specific game.
function getSubscriptions(userID) {  
    $.ajax({
        url: GlobalURL + '/users/subscriptions/' + userID,
        type: 'GET',
        success: function(data) {

            if(!data) {
                $('#titleElement').text("You don't have any subscriptions...");
            } else {
                $('#titleElement').text("Subscriptions for " + cookies.username);

                Object.keys(data).forEach(function(k) {    
                    getUserInformation((data[k]), checkSubscriptionList);
                });
            }
        }
    });
}

function getUserInformation(subscribeeUser, callback) {    
    $.ajax({
        url: GlobalURL + '/users/' + subscribeeUser,
        type: 'GET',
        success: function(user) {
            if(!user) {
                console.log("No user found with that ID.");
            } else {
                callback(user);
            }
        }
    });
}

//  Check if user is on current subscription list.
function checkSubscriptionList(user) {

    console.log("Checking subscription to: " + user.user_username);

    var subscriberData = cookies.user_id;
    var subscribeeData = user._id;

    $.post(GlobalURL + "/users/subscribe/check", 
    {   
        subscriber: subscriberData,
        subscribee: subscribeeData,
    },
    function(subbed) {
        console.log("Posted from " + user.user_username);
        if(user.user_avatar != "") {
            displayUser(user, user.user_avatar, subbed);
        } else {
            displayUser(user, "/Images/DefaultAvatar.jpg", subbed);
        }
    });
}

function displayUser(user, avatar, subbed) {

    console.log("Displaying review for: " + user.user_username);

    //  Data collected from database split into individual values.
    var userID          = user._id
    var userUsername    = user.user_username;
    var userSubscribers = user.user_subscribers.length;
    var userFollowing   = user.user_subscribed_to.length;
    var userReviews     = user.user_reviews.length;
    var userRank        = user.user_rank;
    var userAvatar      = avatar;
    var userSubbed      = subbed;

    console.log("UserID: " + userID);

    //  Results container to add user entries to.
    var resultsContainer = document.getElementById("subscriptionsResultsContainer");

    //  Main jumbotron container.
    var reviewJumbotron = document.createElement("div");
    reviewJumbotron.className = "jumbotron userJumbotron";

    //  User ID area properties.
    var userIdElement = document.createElement("p");
    userIdElement.id = "userIdElement";
    userIdElement.textContent = userID;
    userIdElement.setAttribute("hidden", true);

    //  User username area properties.
    var usernameElement = document.createElement("h1");
    usernameElement.id = "usernameElement";
    usernameElement.className = "display-4";
    usernameElement.textContent = userUsername;

    //  Total user reviews.
    var totalReviewsText = document.createElement("h5");
    totalReviewsText.id = "totalReviewsText";
    if (userReviews === undefined || userReviews.length == 0) {
        totalReviewsText.textContent = "No reviews.";
    }
    totalReviewsText.textContent = userReviews + " reviews.";

    //  User avatar.
    var RUAvatar = document.createElement("img");
    RUAvatar.id = "userReviewAvatar";
    RUAvatar.src = userAvatar;

    //  User rank.
    var RURank = document.createElement("h3");
    RURank.id = "userReviewRank";
    RURank.textContent = userRank;

    //  Subscribe button.
    var subscribeButton = document.createElement("button");
    subscribeButton.className = "btn btn-lg hexButtons userDivButtons";
    subscribeButton.id = "subscribeButton";

    //  Check if user is on subscriptin list already.    
    if(userSubbed) {
        subscribeButton.textContent = "Unsubscribe";
        subscribeButton.setAttribute("onclick", "unsubscribeToUser(\"" + userID + "\", this)");
    } else {
        subscribeButton.textContent = "Subscribe";
        subscribeButton.setAttribute("onclick", "subscribeToUser(\"" + userID + "\", this)");
    }

    //  View profile button.
    var viewProfileButton = document.createElement("button");
    viewProfileButton.className = "btn btn-lg hexButtons userDivButtons";
    viewProfileButton.id = "viewProfileButton";
    viewProfileButton.textContent = "View Profile";

    //  View reviews button properties.
    var viewReviewsButton = document.createElement("button");
    viewReviewsButton.className = "btn btn-primary btn-lg hexButtons";
    viewReviewsButton.id="viewReviewButton";
    viewReviewsButton.setAttribute("onclick", "viewReview(this)");
    viewReviewsButton.textContent = "View";

    //  Total user reviews.
    var totalReviewsText = document.createElement("h5");
    totalReviewsText.id = "totalReviewsText";
    if (userReviews === undefined || userReviews.length == 0) {
        totalReviewsText.textContent = "No reviews.";
        viewReviewsButton.setAttribute("hidden", true);

    } else if (userReviews.length === 1) {
        totalReviewsText.textContent = userReviews + " review";
    } else {
        totalReviewsText.textContent = userReviews + " reviews";
    }

    //  Side button div.
    var sideButtonDiv = document.createElement("div");
    sideButtonDiv.id = "sideButtonDiv";

    //  User information div.
    var userInformationDiv = document.createElement("div");
    userInformationDiv.id = "userInformationDiv";

    //  View review div.
    var viewReviewsDiv = document.createElement("div");
    viewReviewsDiv.id = "viewReviewsDiv";

    //  Configure view reviews div.
    viewReviewsDiv.appendChild(totalReviewsText);
    viewReviewsDiv.appendChild(viewReviewsButton);

    //  Configure side button div.
    sideButtonDiv.appendChild(viewProfileButton);
    sideButtonDiv.appendChild(subscribeButton);

    //  Configure user information div.
    userInformationDiv.appendChild(usernameElement);
    userInformationDiv.appendChild(RURank);
    userInformationDiv.appendChild(viewReviewsDiv);

    //  Configure review entry to be added.
    reviewJumbotron.appendChild(userIdElement)
    reviewJumbotron.appendChild(RUAvatar);
    reviewJumbotron.appendChild(userInformationDiv);
    reviewJumbotron.appendChild(sideButtonDiv);


    //  Add game entry to results container.
    resultsContainer.appendChild(reviewJumbotron);
}

function unsubscribeToUser(subscribee, button) {
    var subscriber = cookies.user_id;
    var subscribee = button.parentNode.parentNode.childNodes[0].innerHTML;

    unsubscribe(subscriber, subscribee);

    console.log("Subscribee: " + subscribee);

    subscribeButton = button;
    subscribeButton.textContent = "Subscribe";
    subscribeButton.setAttribute("onclick", "subscribeToUser(\"" + subscribee + "\", this)");

    location.reload();
}