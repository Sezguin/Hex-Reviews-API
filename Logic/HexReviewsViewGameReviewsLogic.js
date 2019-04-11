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
                $('#titleElement').text("Reviews for " + data[0].review_title);

                Object.keys(data).forEach(function(k) {
                    console.log(JSON.stringify(data[k]));
    
                    getUserInformation((data[k]));
                });
            }
        }
    });
}

function getUserInformation(data) {
    $.ajax({
        url: GlobalURL + '/users/' + data.user_id,
        type: 'GET',
        success: function(result) {
            if(result == false) {
                console.log("No user found with that ID.");
            } else {
                if(result.user_avatar != "") {
                    displayReview(data, result.user_username, result.user_avatar, result.user_rank);
                } else {
                    displayReview(data, result.user_username, "/Images/DefaultAvatar.jpg", result.user_rank);
                }
                
            }
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

function displayReview(data, username, avatar, rank) {

    //  Data collected from database split into individual values.
    var reviewID        = data._id
    var reviewTitle     = data.review_title;
    var reviewSubtitle  = data.review_subtitle;
    var reviewContent   = data.review_content;
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

    //  Results container to add game entries to.
    var resultsContainer = document.getElementById("reviewResultsContainer");

    //  Main jumbotron container.
    var reviewJumbotron = document.createElement("div");
    reviewJumbotron.className = "jumbotron reviewJumbotron";

    //  Review ID area properties.
    var reviewIdElement = document.createElement("p");
    reviewIdElement.id = "reviewIdElement";
    reviewIdElement.textContent = reviewID;
    reviewIdElement.setAttribute("hidden", true);

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
    RUText.textContent = "Reviewed by " + reviewUser;

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
    if(cookies.user_id == reviewUserId) {
        subscribeButton.setAttribute("disabled", true);
    }
    subscribeButton.setAttribute("onclick", "subscribeToUser(\"" + reviewUserId + "\")");
    subscribeButton.textContent = "Subscribe";

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
    var reviewSubtitleElement = document.createElement("I");
    reviewSubtitleElement.id = "reviewSubtitleElement";
    reviewSubtitleElement.textContent = "\"" + reviewSubtitle + "\"";

    //  Review content area.
    var reviewContentElement = document.createElement("textArea");
    reviewContentElement.id = "reviewContentElement";
    reviewContentElement.className = "form-control";
    reviewContentElement.setAttribute("readonly", true);
    reviewContentElement.setAttribute("style", "resize: none");
    reviewContentElement.textContent = reviewContent;

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

    var sideDiv = document.createElement("div");
    sideDiv.id = "sideDiv";

    //  Configure user rank container.
    RURankDiv.appendChild(RUAvatar);
    RURankDiv.appendChild(RURank);

    //  Configure user area.
    reviewUserArea.appendChild(reviewRatingElement);
    reviewUserArea.appendChild(RUText);
    reviewUserArea.appendChild(RURankDiv);
    reviewUserArea.appendChild(viewProfileButton);
    reviewUserArea.appendChild(subscribeButton);

    //  Configure side div.
    sideDiv.appendChild(reviewUserArea);
    sideDiv.appendChild(viewReviewButton);
    
    //  Configure review entry to be added.
    reviewJumbotron.appendChild(reviewIdElement);
    reviewJumbotron.appendChild(sideDiv);
    reviewJumbotron.appendChild(reviewTitleElement);
    reviewJumbotron.appendChild(reviewSubtitleElement);
    reviewJumbotron.appendChild(reviewContentElement);

    //  Add game entry to results container.
    resultsContainer.appendChild(reviewJumbotron);
}

function subscribeToUser(subscribee) {
    var subscriber = cookies.user_id;
    console.log("Subsciber: " + subscriber + " Subscribee: " + subscribee);

    subscribe(subscriber, subscribee);
}