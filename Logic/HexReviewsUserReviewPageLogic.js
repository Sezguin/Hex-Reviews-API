//  Globally get cookies.
var cookies = getCookies();

//  Global variable for review to delete.
var reviewToDelete;

$(document).ready(function () {
    
    setMiniAvatar($('#miniAv'), cookies.username);

    $("#addButton").click(function () {
        window.location.href = "/AddReviewPage"
    });

    $("#dropDownMostRecent").click(function () {
        getReviewList("date");
    });

    $("#dropDownRating").click(function () {
        getReviewList("rating");
    });

    $("#dropDownName").click(function () {
        getReviewList("name");
    });

    $('#searchButton').click(function() {
        getSearchedReviewList();
    });

    $('#confirmDeleteReviewButton').click(function() {
        confirmDeleteReview();
        $('#confirmDeleteModal').modal("hide");
    });

    
    document.getElementById("searchBox").addEventListener("keyup", function(event) {
        if(event.keyCode === 13) {
            getSearchedReviewList();
        }
    });

    $('#resetButton').click(function() {
        $('#searchBox').val("");
        getReviewList();
    });

    getReviewList();
});

//  Fetch the list of reviews by the user.
function getReviewList(sortType) {

    //  Clear results container.
    document.getElementById("userReviewsContainer").innerHTML = "";

    $.ajax({
        url: GlobalURL + '/reviews/' + cookies.user_id,
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

    //  Delete review button properties.
    var deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger btn-lg";
    deleteButton.id = "deleteButton";
    deleteButton.setAttribute("onclick", "deleteUserReview(this)");
    deleteButton.textContent = "Delete";

    //  View review button properties.
    var viewReviewButton = document.createElement("button");
    viewReviewButton.className = "btn btn-primary btn-lg hexButtons";
    viewReviewButton.id = "viewReviewButton";
    viewReviewButton.setAttribute("onclick", "viewReview(this)");
    viewReviewButton.textContent = "View";

    //  Configure user area.
    reviewUserArea.appendChild(reviewRatingElement);
    reviewUserArea.appendChild(viewReviewButton);
    reviewUserArea.appendChild(deleteButton);

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
                    buildReviewCard(element);
                });
            }
        });
    }
}

function viewReview(button) {
    var id = button.parentNode.parentNode.childNodes[0].innerHTML;
    goToViewSingleReviewPage(id);
}

function deleteUserReview(button) {
    reviewToDelete = button.parentNode.parentNode.childNodes[0].innerHTML;

    $('#confirmDeleteModal').modal("show");
}

function confirmDeleteReview() {
    deleteReview(reviewToDelete, cookies.user_id);
}