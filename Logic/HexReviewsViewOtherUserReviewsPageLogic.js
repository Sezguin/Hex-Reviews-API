//  Globally get cookies.
var cookies = getCookies();
var globalUserID;

$(document).ready(function () {

    //  Grab ID from URL parameter.
    var url_string = window.location.href;
    var url = new URL(url_string);
    var userID = url.searchParams.get("id");
    globalUserID = userID;

    $("#dropDownMostRecent").click(function () {
        getUserData(userID, "date");
    });

    $("#dropDownRating").click(function () {
        getUserData(userID, "rating");
    });

    $("#dropDownName").click(function () {
        getUserData(userID, "name");
    });

    $('#searchButton').click(function() {
        getSearchedReviewList();
    });

    $('#resetButton').click(function() {
        $('#searchBox').val("");
        getUserData(userID);
    });

    getUserData(userID);
});

function getUserData(userID, sortType) {
    $.ajax({
        url: GlobalURL + '/users/' + userID,
        type: 'GET',
        success: function (user) {
            getReviewList(user, sortType);
        }
    });
}

//  Fetch the list of reviews by the user.
function getReviewList(user, sortType) {

    //  Clear results container.
    document.getElementById("userReviewsContainer").innerHTML = "";

    $.ajax({
        url: GlobalURL + '/reviews/' + user._id,
        type: 'GET',
        success: function (data) {

            if (!data) {
                console.log("No reviews found.");
            } else {
                sortArray(sortType, data, displayReviews);
            }
        }
    });
}

function sortArray(sortType, reviews, callback) {

    switch (sortType) {
        case "date":
            reviews.sort(function(a, b) {
                var dateA = new Date(a.review_creation_date);
                var dateB = new Date(b.review_creation_date);
                return dateB - dateA;
            });
            break;

        case "rating":
            reviews.sort(function(a, b) {
                var ratingA = a.review_rating;
                var ratingB = b.review_rating;
                return ratingB - ratingA;
            });
            break;

        case "name":
            reviews.sort(function(a, b) {
                var nameA = a.review_title.toLowerCase();
                var nameB = b.review_title.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                }
            });
            break;

        default:
    }

    callback(reviews);
}

function displayReviews(reviews) {
    Object.keys(reviews).forEach(function(k) {
        buildReviewCard(reviews[k]);
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

//  Retrieve list of reviews searched for.
function getSearchedReviewList() {

    var query = $('#searchBox').val();

    if(query != "") {
        $.ajax({
            url: GlobalURL + '/reviews/search/' + query,
            type: 'GET',
            success: function(result) {
    
                //  Clear out container.
                document.getElementById("userReviewsContainer").innerHTML = "";
    
                result.forEach(function(element) {
                    if(element.user_id == globalUserID) {
                        buildReviewCard(element);
                    }
                });
            }
        });
    }
}

function viewReview(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;
    goToViewSingleReviewPage(id);
}