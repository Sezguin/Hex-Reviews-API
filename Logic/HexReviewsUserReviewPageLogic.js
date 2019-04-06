//  Globally get cookies.
var cookies = getCookies();

$(document).ready(function() {
    $("#addButton").click(function() {
        window.location.href = "/AddReviewPage"
    });

    getReviewList();
});

//  Fetch the list of reviews by the user.
function getReviewList() {

    $.ajax({
        url: 'https://hex-reviews.herokuapp.com/reviews/' + cookies.user_id,
        type: 'GET',
        success: function(data) {

            if(data == false) {
                console.log("No reviews found.");
            } else {
                Object.keys(data).forEach(function(k) {
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
    var reviewID        = data._id
    var reviewTitle     = data.review_title;
    var reviewSubtitle  = data.review_subtitle;
    var reviewContent   = data.review_content;
    var reviewRating    = data.review_rating;

    //  Results container to add game entries to.
    var resultsContainer = document.getElementById("userReviewsContainer");

    //  Main jumbotron container.
    var reviewJumbotron = document.createElement("div");
    reviewJumbotron.className = "jumbotron reviewJumbotron";

    //  Review ID are properties.
    var reviewIdElement = document.createElement("p");
    reviewIdElement.id = "reviewIdElement";
    reviewIdElement.textContent = reviewID;

    //  Review title area properties.
    var reviewTitleElement = document.createElement("h1");
    reviewTitleElement.className = "display-4";
    reviewTitleElement.textContent = reviewTitle;

    //  Review subtitle area.
    var reviewSubtitleElement = document.createElement("h3");
    reviewSubtitleElement.textContent = reviewSubtitle;

    //  Review content area.
    var reviewContentElement = document.createElement("h5");
    reviewContentElement.textContent = reviewContent;

    //  Line separator.
    var lineSeparator = document.createElement("hr");
    lineSeparator.className = "my-4";

    //  Delete review button properties.
    var deleteButton = document.createElement("a");
    deleteButton.className = "btn btn-danger btn-lg";
    deleteButton.id="deleteButton";
    deleteButton.setAttribute("onclick", "deleteReview(this)");
    deleteButton.textContent = "Delete";

    //  View review button properties.
    var viewReviewButton = document.createElement("a");
    viewReviewButton.className = "btn btn-primary btn-lg";
    viewReviewButton.id="viewReviewButton";
    viewReviewButton.setAttribute("onclick", "viewReview(this)");
    viewReviewButton.textContent = "View";
    
    //  Configure game entry to be added.
    reviewJumbotron.appendChild(reviewIdElement);
    reviewJumbotron.appendChild(reviewTitleElement);
    reviewJumbotron.appendChild(lineSeparator);    
    reviewJumbotron.appendChild(reviewSubtitleElement);
    reviewJumbotron.appendChild(reviewContentElement);
    reviewJumbotron.appendChild(deleteButton);
    reviewJumbotron.appendChild(viewReviewButton);


    //  Add game entry to results container.
    resultsContainer.appendChild(reviewJumbotron);

}

function viewReview(button) {
    var id = button.parentNode.childNodes[0].innerHTML;

    goToViewSingleReviewPage(id);
}