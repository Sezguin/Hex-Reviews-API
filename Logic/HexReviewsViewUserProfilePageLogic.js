//  Globally get cookies.
var cookies = getCookies();
var globalUserID = cookies.user_id;

$(document).ready(function () {

    setMiniAvatar($('#miniAv'), cookies.username);
    
    getUserData(globalUserID);

    $('#successfulPostModal').show();

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

    //  Display user's latest reviews.
    getReviews(sortReviewArray);
});

function getUserData(userID) {
    $.ajax({
        url: GlobalURL + '/users/' + userID,
        type: 'GET',
        success: function (user) {
            buildProfile(user);
        }
    });
}

function getReviews(callback) {
    $.ajax({
        url: GlobalURL + '/reviews/' + cookies.user_id,
        type: 'GET',
        success: function(result) {
            if(!result) {
                console.log("User has no reviews.");
                document.getElementById("yourLatestReviews").innerHTML = "You have no reviews...";
            } else {
                callback(result, displayReviews, "latest");
                callback(result, displayReviews, "popular");
                document.getElementById("yourLatestReviews").innerHTML = "Your Latest Reviews";
                document.getElementById("mostPopularReviews").innerHTML = "Your Most Popular Reviews";
            }
        }
    });
}

function sortReviewArray(reviews, callback, sorting) {

    if(sorting == "latest") {
        //  Sort recieved reviews by date.
        reviews.sort(function(a, b) {
            var dateA = new Date(a.review_creation_date);
            var dateB = new Date(b.review_creation_date);
            return dateB - dateA;
        });

        for(var i = 0; i < 3; i++) {
            try {
                callback(reviews[i], "latestReviewsDiv");
            } catch (err) {
                console.log("Ran out of reviews to display...");
            }  
        }
    }

    if(sorting == "popular") {
        //  Sort recieved reviews by date.
        reviews.sort(function(a, b) {
            var numA = a.review_comments.length;
            var numB = b.review_comments.length;
            return numB - numA;
        });

        for(var i = 0; i < 3; i++) {
            try {
                callback(reviews[i], "mostPopularReviewsDiv");
            } catch (err) {
                console.log("Ran out of reviews to display...");
            }  
        }
    }

}

function displayReviews(review, container) {

    //  Create a hidden review ID element.
    var reviewIdElement = document.createElement("p");
    reviewIdElement.id = "reviewIdElement";
    reviewIdElement.textContent = review._id;
    reviewIdElement.setAttribute("hidden", true);

    //  Grab results container for the latest reviews.
    var resultsContainer = document.getElementById(container);

    //  Create card element.
    var reviewCard = document.createElement("div");

    reviewCard.id = "latestReviewCard";
    reviewCard.className = "card col-md-4";

    //  Create card body.
    var reviewCardBody = document.createElement("div");
    reviewCardBody.className = "card-body";

    //  Create card title.
    var reviewCardTitle = document.createElement("h5");
    reviewCardTitle.id = "reviewCardTitle";
    reviewCardTitle.className = "card-title";
    reviewCardTitle.textContent = review.review_title;

    //  Create card content.
    var reviewCardContent = document.createElement("p");
    reviewCardContent.id = "reviewCardContent";
    reviewCardContent.className = "card-text";
    reviewCardContent.textContent = review.review_content;

    //  Create card footer.
    var reviewCardFooter = document.createElement("div");
    reviewCardFooter.id = "reviewCardFooter";
    reviewCardFooter.className = "card-footer";

    //  Create view review button on card.
    var viewReviewButton = document.createElement("button");
    viewReviewButton.id = "viewReviewButton";
    viewReviewButton.className = "btn hexButtons";
    viewReviewButton.setAttribute("onclick", "viewReview(this)");
    viewReviewButton.textContent = "View";

    //  Build review card footer.
    reviewCardFooter.appendChild(viewReviewButton);

    //  Build review card body.
    reviewCardBody.appendChild(reviewCardTitle);
    reviewCardBody.appendChild(reviewCardContent);

    //  Build review card.
    reviewCard.appendChild(reviewIdElement);
    reviewCard.appendChild(reviewCardBody);
    reviewCard.appendChild(reviewCardFooter);

    //  Append build cart to the results container.
    resultsContainer.appendChild(reviewCard);
}

function buildProfile(user) {
    if(user.user_avatar != "") {
        $('#userAvatar').attr("src", user.user_avatar);
    } else {
        $('#userAvatar').attr("src", "/Images/DefaultAvatar.jpg");
    }

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

    $('#successfulPostModal').hide();

}

function viewReview(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;

    goToViewSingleReviewPage(id);
}