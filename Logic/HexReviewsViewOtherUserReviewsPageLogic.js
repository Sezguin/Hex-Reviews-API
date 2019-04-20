//  Globally get cookies.
var cookies = getCookies();
var globalUserID;

$(document).ready(function () {

    //  Grab ID from URL parameter.
    var url_string = window.location.href;
    var url = new URL(url_string);
    var userID = url.searchParams.get("id");
    globalUserID = userID;

    console.log("UserID: " + userID);

    getUserData(userID);
});

function getUserData(userID) {
    $.ajax({
        url: GlobalURL + '/users/' + userID,
        type: 'GET',
        success: function (user) {
            getReviewList(user);
        }
    });
}

//  Fetch the list of reviews by the user.
function getReviewList(user) {

    $.ajax({
        url: GlobalURL + '/reviews/' + user._id,
        type: 'GET',
        success: function (data) {

            if (!data) {
                console.log("No reviews found.");
            } else {
                Object.keys(data).forEach(function (k) {
                    console.log(JSON.stringify(data[k]));

                    buildReviewCard(data[k]);
                });
            }
        }
    });
}

function buildReviewCard(data) {

    console.log("Review card is being created...");

    //  Data collected from database split into individual values.
    var reviewID = data._id
    var reviewTitle = data.review_title;
    var reviewSubtitle = data.review_subtitle;
    var reviewContent = data.review_content;
    var reviewRating;

    // Set up review rating.
    switch (data.review_rating) {
        case 5:
            reviewRating = "/Images/5Star.png";
            break;
        case 4:
            reviewRating = "/Images/4Star.png";
            break;
        case 3:
            reviewRating = "/Images/3Star.png";
            break;
        case 2:
            reviewRating = "/Images/2Star.png";
            break;
        case 1:
            reviewRating = "/Images/1Star.png";
            break;
    }

    //  Results container to add game entries to.
    var resultsContainer = document.getElementById("userReviewsContainer");

    //  Main jumbotron container.
    var reviewJumbotron = document.createElement("div");
    reviewJumbotron.className = "jumbotron reviewJumbotron";

    //  Review ID are properties.
    var reviewIdElement = document.createElement("p");
    reviewIdElement.id = "reviewIdElement";
    reviewIdElement.textContent = reviewID;
    reviewIdElement.setAttribute("hidden", true);

    //  Review title area properties.
    var reviewTitleElement = document.createElement("h1");
    reviewTitleElement.id = "reviewTitleElement";
    reviewTitleElement.className = "display-4";
    reviewTitleElement.textContent = reviewTitle;

    //  Review subtitle area.
    var reviewSubtitleElement = document.createElement("h3");
    reviewSubtitleElement.id = "reviewSubtitleElement";
    reviewSubtitleElement.textContent = "\"" + reviewSubtitle + "\"";

    //  Review rating.
    var reviewRatingElement = document.createElement("img");
    reviewRatingElement.id = "reviewRatingElement";
    reviewRatingElement.src = reviewRating;

    //  Review user area.
    var reviewUserArea = document.createElement("div");
    reviewUserArea.id = "reviewUserArea";

    //  View review button properties.
    var viewReviewButton = document.createElement("button");
    viewReviewButton.className = "btn btn-primary btn-lg hexButtons";
    viewReviewButton.id = "viewReviewButton";
    viewReviewButton.setAttribute("onclick", "viewReview(this)");
    viewReviewButton.textContent = "View";

    //  Configure user area.
    reviewUserArea.appendChild(reviewRatingElement);
    reviewUserArea.appendChild(viewReviewButton);

    //  Configure review entry to be added.
    reviewJumbotron.appendChild(reviewIdElement);
    reviewJumbotron.appendChild(reviewUserArea);
    reviewJumbotron.appendChild(reviewTitleElement);
    reviewJumbotron.appendChild(reviewSubtitleElement);

    //  Add game entry to results container.
    resultsContainer.appendChild(reviewJumbotron);

}