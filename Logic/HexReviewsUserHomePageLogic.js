//  Globally grab cookies.
var cookies = getCookies();

$(document).ready(function() {

    setMiniAvatar($('#miniAv'), cookies.username);

    checkCookieAccept();

    $("#browseGamesButton").click(function() {
        window.location.href = "/UserViewGamesPage";
    });

    $("#writeReviewButton").click(function() {
        window.location.href = "/UserReviewPage";
    });

    $("#subscriptionsButton").click(function() {
        window.location.href = "/UserSubscriptionsPage";
    });

    $("#requestGameButton").click(function() {
        window.location.href = "/UserGameRequestPage";
    });

    $("#myProfileButton").click(function() {
        window.location.href = "/ViewUserProfilePage";
    });

    $("#browseReviewsButton").click(function() {
        window.location.href = "/UserViewReviewsPage";
    });

    $("#acceptCookiesButton").click(function() {
        acceptCookies();
    });

    $("#rejectCookiesButton").click(function() {
        logoutUser();
        window.location.href = "/";
    });

    $("#userWelcome").text("Welcome, " + cookies.username);

    //  Grab user's avatar.
    collectAvatar(displayAvatar);

    //  Display user's latest reviews.
    getReviews(sortReviewArray);

    //  Retrieve the user's rank.
    getUserRank(cookies.user_id, $('#userRankStat'), true);

    //  Get user follower count.
    getUserFollowerCount(cookies.user_id);

    //  Grab user's subscriptions.
    getSubscriptions(cookies.user_id, getSubscriptionReviews)
});

function checkCookieAccept() {
    $.ajax({
        url: GlobalURL + '/users/cookies/check/' + cookies.user_id,
        type: 'GET',
        success: function(result) {
            if(result) {
                console.log("User has accepted cookies.")
            } else {
                $('#cookiesModal').modal("show");
            }
        }
    });
}

function acceptCookies() {
    $.ajax({
        url: GlobalURL + '/users/cookies/accept/' + cookies.user_id,
        type: 'GET',
        success: function(result) {
            if(result) {
                location.reload();
            } else {
                console.log("There was an error when accepting cookies.")
            }
        }
    });
}

function collectAvatar(callback) {
    $.ajax({
        url: GlobalURL + '/images/avatar/' + cookies.username,
        type: 'GET',
        success: function(result) {
            callback(result);
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
                displayReviewCount("None :(");
            } else {
                displayReviewCount(result.length);
                callback(result, displayReviews);
                document.getElementById("yourLatestReviews").innerHTML = "Your Latest Reviews";
            }
        }
    });
}

function displayReviewCount(length) {
    $("#totalReviews").append(length);
}

function getUserFollowerCount(userID) {
    $.ajax({
        url: GlobalURL + '/users/followers/' + userID,
        type: 'GET',
        success: function(result) {
            if(!result) {
                console.log("User has no followers.");
                $("#totalFollowers").append("None :(");
            } else {
                $("#totalFollowers").append(result.length);
            }
        }
    });
}

function displayAvatar(data) {
    var output = document.getElementById("userAvatar");
    // $('#miniAv').attr("src", data);

    if(data != "") {
        output.src = data;
    } else {
        output.src = "/Images/DefaultAvatar.jpg";
    }
}

function sortReviewArray(reviews, callback) {

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

function getSubscriptions(userID, callback) {
    $.ajax({
        url: GlobalURL + '/users/subscriptions/' + userID,
        type: 'GET',
        success: function(result) {
            if(!result) {
                console.log("User has no subscriptions.");
            } else {
                callback(result, getSubAvatar);
                document.getElementById("subscriptionReviewsText").innerHTML = "Latest from your Subscriptions";
            }
        }
    });
}

function getSubscriptionReviews(subscriptions, callback) {
    for(var i = 0; i < subscriptions.length; i++) {
        $.ajax({
            url: GlobalURL + '/reviews/user/latest/' + subscriptions[i],
            type: 'GET',
            success: function(result) {
                if(!result) {
                    console.log("Subscribee has no reviews.");
                } else {
                    callback(result, "subscribtionReviewsDiv", displayReviews);
                }
            }
        });
    }
}

function getSubAvatar(review, container, callback) {
    $.ajax({
        url: GlobalURL + '/users/' + review.user_id,
        type: 'GET',
        success: function(data) {
            if(data.user_avatar != "") {
                callback(review, container, data.user_avatar, data);
            } else {
                callback(review, container, "/Images/DefaultAvatar.jpg", data);
            }
        }
    });
}

function displayReviews(review, container, avatar, otherUser) {

    //  Create a hidden review ID element.
    var reviewIdElement = document.createElement("p");
    reviewIdElement.id = "reviewIdElement";
    reviewIdElement.textContent = review._id;
    reviewIdElement.setAttribute("hidden", true);

    //  Grab results container for the latest reviews.
    var resultsContainer = document.getElementById(container);

    //  Create card element.
    var reviewCard = document.createElement("div");
    if(container == "subscribtionReviewsDiv") {
        reviewCard.id = "latestReviewCardSub";
    } else {
        reviewCard.id = "latestReviewCard";
    }
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

    if(container == "subscribtionReviewsDiv") {

        //  Create card header.
        var reviewCardHeader = document.createElement("div");
        reviewCardHeader.id = "reviewCardHeader";
        reviewCardHeader.className = "card-header";

        //  Create other user avatar.
        var subUserAvatar = document.createElement("img");
        subUserAvatar.id = "subUserAvatar";
        subUserAvatar.src = avatar;

        //  Create other user name.
        var otherUserName = document.createElement("h5");
        otherUserName.id = "otherUserName";
        otherUserName.textContent = otherUser.user_username;

        //  Build other user div.
        reviewCardHeader.appendChild(subUserAvatar);
        reviewCardHeader.appendChild(otherUserName);
    }

    //  Build review card footer.
    reviewCardFooter.appendChild(viewReviewButton);

    //  Build review card body.
    reviewCardBody.appendChild(reviewCardTitle);
    reviewCardBody.appendChild(reviewCardContent);

    //  Build review card.
    reviewCard.appendChild(reviewIdElement);
    if(container == "subscribtionReviewsDiv") {
        reviewCard.appendChild(reviewCardHeader);
    }    
    reviewCard.appendChild(reviewCardBody);
    reviewCard.appendChild(reviewCardFooter);

    //  Append build cart to the results container.
    resultsContainer.appendChild(reviewCard);
}

function viewReview(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;

    goToViewSingleReviewPage(id);
}

function editProfile() {
    goToUserEditProfilePage(cookies.user_id);
}
