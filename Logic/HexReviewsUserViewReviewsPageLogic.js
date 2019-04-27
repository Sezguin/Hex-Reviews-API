//  Globally get cookies.
var cookies = getCookies();

$(document).ready(function () {

    $("#dropDownMostRecent").click(function () {
        getReviews(sortReviewArray, "latest");
    });

    $("#dropDownRating").click(function () {
        getReviews(sortReviewArray, "rating");
    });

    $("#dropDownName").click(function () {
        getReviews(sortReviewArray, "popular");
    });

    $('#searchButton').click(function() {
        getSearchedReviewList();
    });

    $('#resetButton').click(function() {
        $('#searchBox').val("");
        getReviews(sortReviewArray);
    });

    getReviews(sortReviewArray);
});

//  Get a list of all reviews.
function getReviews(callback, sortType) {
    document.getElementById("reviewsContainer").innerHTML = "";
    document.getElementById("latestReviewsDiv").innerHTML = "";

    $.ajax({
        url: GlobalURL + '/reviews',
        type: 'GET',
        success: function(data) {
            if(!data) {
                console.log("No reviews found.");
            } else {
                callback(data, sortType, displayEach);
                latestThreeReviews(data);
            }
        }
    });
}

function sortReviewArray(reviews, sorting, callback) {

    if(sorting == "latest") {
        //  Sort recieved reviews by date.
        reviews.sort(function(a, b) {
            var dateA = new Date(a.review_creation_date);
            var dateB = new Date(b.review_creation_date);
            return dateB - dateA;
        });

        callback(reviews, checkSubscriptionList);

    }

    if(sorting == "popular") {
        //  Sort recieved reviews by date.
        reviews.sort(function(a, b) {
            var numA = a.review_comments.length;
            var numB = b.review_comments.length;
            return numB - numA;
        });
        window.setTimeout(callback(reviews, checkSubscriptionList), 2000);

    }

    if(sorting == "rating") {
        //  Sort recieved reviews by date.
        reviews.sort(function(a, b) {
            var numA = a.review_rating;
            var numB = b.review_rating;
            return numB - numA;
        });

        window.setTimeout(callback(reviews, checkSubscriptionList));
    }

    else {
        callback(reviews, checkSubscriptionList);
    }
}

function latestThreeReviews(reviews) {
    reviews.sort(function(a, b) {
        var dateA = new Date(a.review_creation_date);
        var dateB = new Date(b.review_creation_date);
        return dateB - dateA;
    });

    for(var i=0; i < 3; i++) {
        getUserForLatest(reviews[i]);
    }
}

function getUserForLatest(review) {
    $.ajax({
        url: GlobalURL + '/users/' + review.user_id,
        type: 'GET',
        success: function(user) {
            if(!user) {
                console.log("No user found with that ID.");
            } else {
                if(user.user_avatar != "") {
                    displayReviews(review, user.user_avatar, user.user_username);
                } else {
                    displayReviews(review, "/Images/DefaultAvatar.jpg", user.user_username);
                }
            }
        }
    });
}

function displayEach(reviews, callback) {
    Object.keys(reviews).forEach(function(k) {
        getUserInformation((reviews[k]), callback);
    });
}

function getUserInformation(review, callback) {
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
            displayMassReview(review, user.user_username, user.user_avatar, user.user_rank, subbed);
        } else {
            displayMassReview(review, user.user_username, "/Images/DefaultAvatar.jpg", user.user_rank, subbed);

        }
    });
}

function displayMassReview(data, username, avatar, rank, subbed) {

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
    var resultsContainer = document.getElementById("reviewsContainer");

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
        viewProfileButton.setAttribute("onclick", "myProfile()");
    } else {
        viewProfileButton.textContent = "View Profile";
        viewProfileButton.setAttribute("onclick", "goToViewOtherUserProfilePage(\"" + reviewUserId + "\")");
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

function displayReviews(review, avatar, otherUser) {

    //  Create a hidden review ID element.
    var reviewIdElement = document.createElement("p");
    reviewIdElement.id = "reviewIdElement";
    reviewIdElement.textContent = review._id;
    reviewIdElement.setAttribute("hidden", true);

    //  Grab results container for the latest reviews.
    var resultsContainer = document.getElementById("latestReviewsDiv");

    //  Create card element.
    var reviewCard = document.createElement("div");
        reviewCard.id = "latestReviewCardSub";
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
    otherUserName.textContent = otherUser;

    //  Build other user div.
    reviewCardHeader.appendChild(subUserAvatar);
    reviewCardHeader.appendChild(otherUserName);

    //  Build review card footer.
    reviewCardFooter.appendChild(viewReviewButton);

    //  Build review card body.
    reviewCardBody.appendChild(reviewCardTitle);
    reviewCardBody.appendChild(reviewCardContent);

    //  Build review card.
    reviewCard.appendChild(reviewIdElement);
    reviewCard.appendChild(reviewCardHeader);
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