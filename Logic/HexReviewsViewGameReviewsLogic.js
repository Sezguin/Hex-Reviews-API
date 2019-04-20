//  Globally get cookies.
var cookies = getCookies();

$(document).ready(function() {

    var url_string = window.location.href;
    var url = new URL(url_string);
    var gameID = url.searchParams.get("id");

    getReviews(gameID);
});

//  Fetch the list of reviews for a specific game.
function getReviews(gameID) {  
    $.ajax({
        url: GlobalURL + '/reviews/game/' + gameID,
        type: 'GET',
        success: function(data) {

            if(data == false) {
                console.log("No reviews found.");
                $('#titleElement').text("Nothing to show!");

            } else {
                $('#titleElement').text("Reviews for \"" + data[0].review_title + "\"");

                Object.keys(data).forEach(function(k) {
                    console.log("Review (datak) " + JSON.stringify(data[k]));
    
                    getUserInformation((data[k]), checkSubscriptionList);
                });
            }
        }
    });
}

function getUserInformation(review, callback) {
    console.log("Review: " + review);
    $.ajax({
        url: GlobalURL + '/users/' + review.user_id,
        type: 'GET',
        success: function(user) {
            if(!user) {
                console.log("No user found with that ID.");
            } else {
                callback(review, user);
            }
        }
    });
}

//  Check if user is on current subscription list.
function checkSubscriptionList(review, user) {

    console.log("Checking subscription to: " + user.user_username);

    var subscriberData = cookies.user_id;
    var subscribeeData = review.user_id;

    $.post(GlobalURL + "/users/subscribe/check", 
    {   
        subscriber: subscriberData,
        subscribee: subscribeeData,
    },
    function(subbed) {
        if(user.user_avatar != "") {
            displayReview(review, user.user_username, user.user_avatar, user.user_rank, subbed);
        } else {
            displayReview(review, user.user_username, "/Images/DefaultAvatar.jpg", user.user_rank, subbed);

        }
    });
}

function displayReview(data, username, avatar, rank, subbed) {

    console.log("Displaying review for: " + username);

    //  Data collected from database split into individual values.
    var reviewID        = data._id
    var reviewTitle     = data.review_title;
    var reviewSubtitle  = data.review_subtitle;
    var reviewUserId    = data.user_id;
    var reviewRating;

    // Set up review rating.
    switch (data.review_rating) {
        case 5:
            reviewRating    = "/Images/5Star.png";
            break;
        case 4:
            reviewRating    = "/Images/4Star.png";
            break;
        case 3:
            reviewRating    = "/Images/3Star.png";
            break;
        case 2:
            reviewRating    = "/Images/2Star.png";
            break;
        case 1:
            reviewRating    = "/Images/1Star.png";
            break;
    }

    //  User information.
    var reviewUser      = username;
    var userAvatar      = avatar;
    var userRank        = rank;
    var userSubbed      = subbed;

    //  Results container to add game entries to.
    var resultsContainer = document.getElementById("reviewResultsContainer");

    //  Main jumbotron container.
    var reviewJumbotron = document.createElement("div");
    reviewJumbotron.id = "viewGameReviewJumbotron";
    reviewJumbotron.className = "jumbotron reviewJumbotron";

    //  Review ID area properties.
    var reviewIdElement = document.createElement("p");
    reviewIdElement.id = "reviewIdElement";
    reviewIdElement.textContent = reviewID;
    reviewIdElement.setAttribute("hidden", true);

    //  Author ID area properties.
    var userIdElement = document.createElement("p");
    userIdElement.id = "userIdElement";
    userIdElement.textContent = reviewUserId;
    userIdElement.setAttribute("hidden", true);

    //  Review title area properties.
    var reviewTitleElement = document.createElement("h1");
    reviewTitleElement.id = "reviewTitleElement";
    reviewTitleElement.className = "display-4";
    reviewTitleElement.textContent = reviewTitle;

    //  Review user area.
    var reviewUserArea = document.createElement("div");
    reviewUserArea.id = "reviewUserArea";

    //  User information.
    var RUText = document.createElement("h4");
    RUText.id = "reviewUserText";
    RUText.textContent = reviewUser;

    //  User avatar.
    var RUAvatar = document.createElement("img");
    RUAvatar.id = "userReviewAvatar";
    RUAvatar.src = userAvatar;

    // User rank container.
    var RURankDiv = document.createElement("div");
    RURankDiv.id = "userReviewRankContainer";

    //  User rank.
    var RURank = document.createElement("h5");
    RURank.id = "userReviewRank";
    RURank.textContent = userRank;

    //  Review rating.
    var reviewRatingElement = document.createElement("img");
    reviewRatingElement.id = "reviewRatingElement";
    reviewRatingElement.src = reviewRating;

    //  Subscribe button.
    var subscribeButton = document.createElement("button");
    subscribeButton.className = "btn btn-lg hexButtons userDivButtons";
    subscribeButton.id = "subscribeButton";

    //  Disable subscribe button on self.
    if(cookies.user_id == reviewUserId) {
        subscribeButton.setAttribute("disabled", true);
    }

    //  Check if user is on subscriptin list already.    
    if(userSubbed) {
        subscribeButton.textContent = "Unsubscribe";
        subscribeButton.setAttribute("onclick", "unsubscribeToUser(\"" + reviewUserId + "\", this)");
    } else {
        subscribeButton.textContent = "Subscribe";
        subscribeButton.setAttribute("onclick", "subscribeToUser(\"" + reviewUserId + "\", this)");
    }

    //  View profile button.
    var viewProfileButton = document.createElement("button");
    viewProfileButton.className = "btn btn-lg hexButtons userDivButtons";
    viewProfileButton.id = "viewProfileButton";
    if(cookies.user_id == reviewUserId) {
        subscribeButton.setAttribute("disabled", true);
        viewProfileButton.textContent = "My Profile";
    } else {
        viewProfileButton.textContent = "View Profile";
    }

    //  Review subtitle area.
    var reviewSubtitleElement = document.createElement("h4");
    reviewSubtitleElement.id = "reviewSubtitleElement";
    reviewSubtitleElement.textContent = "\"" + reviewSubtitle + "\"";


    //  Review rating container.
    var reviewRatingDiv = document.createElement("div");
    reviewRatingDiv.id = "reviewRatingDiv";

    //  Line separator.
    var lineSeparator = document.createElement("hr");
    lineSeparator.className = "my-4";

    //  View review button properties.
    var viewReviewButton = document.createElement("button");
    viewReviewButton.className = "btn btn-primary btn-lg hexButtons";
    viewReviewButton.id="viewReviewButton";
    viewReviewButton.setAttribute("onclick", "viewReview(this)");
    viewReviewButton.textContent = "View Review";

    //  Create side div.
    var sideDiv = document.createElement("div");
    sideDiv.id = "sideDiv";

    //  Create button div.
    var buttonDiv = document.createElement("div");
    buttonDiv.id = "buttonDiv";

    //  Configure button div.
    buttonDiv.appendChild(viewReviewButton);

    //  Configure user rank container.
    RURankDiv.appendChild(RUAvatar);
    RURankDiv.appendChild(RURank);

    //  Configure user area.
    // reviewUserArea.appendChild(reviewRatingElement);
    // reviewUserArea.appendChild(RUText);
    reviewUserArea.appendChild(RURankDiv);
    reviewUserArea.appendChild(viewProfileButton);
    reviewUserArea.appendChild(subscribeButton);

    //  Configure side div.
    sideDiv.appendChild(reviewUserArea);
    sideDiv.appendChild(reviewRatingElement);
    sideDiv.appendChild(RUText);
    
    //  Configure review entry to be added.
    reviewJumbotron.appendChild(reviewIdElement);
    reviewJumbotron.appendChild(userIdElement);
    reviewJumbotron.appendChild(sideDiv);
    reviewJumbotron.appendChild(reviewTitleElement);
    reviewJumbotron.appendChild(reviewSubtitleElement);
    reviewJumbotron.appendChild(buttonDiv);

    //  Add game entry to results container.
    resultsContainer.appendChild(reviewJumbotron);
}

function subscribeToUser(subscribee, button) {
    var subscriber = cookies.user_id;
    var subscribee = button.parentNode.parentNode.parentNode.childNodes[1].innerHTML;

    subscribe(subscriber, subscribee);

    subscribeButton = button;
    subscribeButton.textContent = "Unsubscribe";
    subscribeButton.setAttribute("onclick", "unsubscribeToUser(\"" + subscribee + "\", this)");
}

function unsubscribeToUser(subscribee, button) {
    var subscriber = cookies.user_id;
    var subscribee = button.parentNode.parentNode.parentNode.childNodes[1].innerHTML;

    unsubscribe(subscriber, subscribee);

    subscribeButton = button;
    subscribeButton.textContent = "Subscribe";
    subscribeButton.setAttribute("onclick", "subscribeToUser(\"" + subscribee + "\", this)");
}

function viewReview(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;

    console.log("Review ID: " + id);

    goToViewSingleReviewPage(id);
}