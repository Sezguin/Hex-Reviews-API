//  Globally get cookies.
var cookies = getCookies();

$(document).ready(function () {
    $("#addButton").click(function () {
        window.location.href = "/AddReviewPage"
    });

    getReviewList();
});

//  Fetch the list of reviews by the user.
function getReviewList() {

    $.ajax({
        url: GlobalURL + '/reviews/' + cookies.user_id,
        type: 'GET',
        success: function (data) {

            if (data == false) {
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
    reviewJumbotron.appendChild(reviewContentElement);


    //  Add game entry to results container.
    resultsContainer.appendChild(reviewJumbotron);

}

function viewReview(button) {
    var id = button.parentNode.childNodes[0].innerHTML;

    goToViewSingleReviewPage(id);
}

function deleteUserReview(button) {
    var id = button.parentNode.parentNode.childNodes[0].innerHTML;

    deleteReview(id);
}