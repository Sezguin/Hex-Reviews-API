//  Globally get cookies.
var cookies = getCookies();
var globalReviews = [];

$(document).ready(function () {

    setMiniAvatar($('#miniAv'), cookies.username);

    $("#dropDownMostRecent").click(function () {
        getReviews("latest");
    });

    $("#dropDownRating").click(function () {
        getReviews("rating");
    });

    $("#dropDownPopular").click(function () {
        getReviews("popular");
    });

    $("#dropDownName").click(function () {
        getReviews("name");
    });

    $('#searchButton').click(function () {
        getSearchedReviewList();
    });

    $('#resetButton').click(function () {
        $('#searchBox').val("");
        getReviews("latest");
    });

    document.getElementById("searchBox").addEventListener("keyup", function(event) {
        if(event.keyCode === 13) {
            getSearchedReviewList();
        }
    });

    getReviews("latest");
});

//  Get a list of all reviews.
function getReviews(sortType) {

    //  Clear containers.
    document.getElementById("reviewsContainer").innerHTML = "";
    document.getElementById("latestReviewsDiv").innerHTML = "";

    //  Clear global reviews.
    globalReviews = [];

    //  Show loading modal.
    $('#loadingModal').modal("show");

    $.ajax({
        url: GlobalURL + '/reviews',
        type: 'GET',
        success: function (reviews) {
            if (!reviews) {
                console.log("No reviews found.");
            } else {
                console.log("Array length: " + reviews.length);
                for (var i = 0; i < reviews.length; i++) {

                    console.log(i);
                    console.log("Review before: " + JSON.stringify(reviews[i]));

                    // reviews[i] = addUserData(reviews[i]);

                    if (i + 1 == reviews.length) {
                        reviews[i] = addUserData(reviews[i], true, sortType);
                    } else {
                        reviews[i] = addUserData(reviews[i], false, sortType);
                    }
                }
                // callback(reviews, sortType, displayEach);
                // latestThreeReviews(reviews);
            }
        }
    });
}

function addUserData(review, done, sortType) {
    $.ajax({
        url: GlobalURL + '/users/' + review.user_id,
        type: 'GET',
        success: function (user) {
            if (!user) {
                console.log("No user found with that ID.");
            } else {
                var avatar;

                if (user.user_avatar != "") {
                    avatar = user.user_avatar
                } else {
                    avatar = "/Images/DefaultAvatar.jpg"
                }

                review.user_username = user.user_username;
                review.user_avatar = avatar;
                review.user_rank = user.user_rank;

                globalReviews.push(review);

                if (done) {
                    window.setTimeout(function () {
                        sortGlobalReviewArray(sortType);
                        latestThreeReviews();
                    }, 1000);
                }
            }
        }
    });
}

function sortGlobalReviewArray(sorting) {

    //  Hide the loading modal.
    $('#loadingModal').modal("hide");

    if (sorting == "latest") {

        //  Sort recieved reviews by date.
        globalReviews.sort(function (a, b) {
            var dateA = new Date(a.review_creation_date);
            var dateB = new Date(b.review_creation_date);
            return dateB - dateA;
        });

        for (var i = 0; i < globalReviews.length; i++) {
            displayMassReview(globalReviews[i]);
        }
    }

    if (sorting == "popular") {

        //  Sort recieved reviews by popularity.
        globalReviews.sort(function (a, b) {
            var numA = a.review_comments.length;
            var numB = b.review_comments.length;
            return numB - numA;
        });

        for (var i = 0; i < globalReviews.length; i++) {
            displayMassReview(globalReviews[i]);
        }

    }

    if (sorting == "rating") {

        //  Sort recieved reviews by rating.
        globalReviews.sort(function (a, b) {
            var numA = a.review_rating;
            var numB = b.review_rating;
            return numB - numA;
        });

        for (var i = 0; i < globalReviews.length; i++) {
            displayMassReview(globalReviews[i]);
        }
    }

    if (sorting == "name") {
        globalReviews.sort(function (a, b) {
            var nameA = a.review_title.toLowerCase();
            var nameB = b.review_title.toLowerCase();
            if (nameA < nameB) {
                return -1;
            }
        });

        for (var i = 0; i < globalReviews.length; i++) {
            displayMassReview(globalReviews[i]);
        }
    }
}

function latestThreeReviews() {
    globalReviews.sort(function (a, b) {
        var dateA = new Date(a.review_creation_date);
        var dateB = new Date(b.review_creation_date);
        return dateB - dateA;
    });

    for (var i = 0; i < 3; i++) {
        try {
            displayReviews(globalReviews[i]);
        } catch (err) {
            console.log("No more reviews.")
        }
    }
}

function getUserForLatest(review) {
    $.ajax({
        url: GlobalURL + '/users/' + review.user_id,
        type: 'GET',
        success: function (user) {
            if (!user) {
                console.log("No user found with that ID.");
            } else {
                if (user.user_avatar != "") {
                    displayReviews(review, user.user_avatar, user.user_username);
                } else {
                    displayReviews(review, "/Images/DefaultAvatar.jpg", user.user_username);
                }
            }
        }
    });
}

function displayMassReview(data) {

    //  Data collected from database split into individual values.
    var reviewID = data._id
    var reviewTitle = data.review_title;
    var reviewSubtitle = data.review_subtitle;
    var reviewUserId = data.user_id;
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

    //  User information.
    var reviewUser = data.user_username;
    var userAvatar = data.user_avatar;
    var userRank = data.user_rank;

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

    //  View profile button.
    var viewProfileButton = document.createElement("button");
    viewProfileButton.className = "btn btn-lg hexButtons";
    viewProfileButton.id = "viewProfileButton";
    if (cookies.user_id == reviewUserId) {
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
    viewReviewButton.id = "viewReviewButton";
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
    reviewUserArea.appendChild(RURankDiv);
    reviewUserArea.appendChild(viewProfileButton);

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

function displayReviews(review) {

    var avatar = review.user_avatar;
    var otherUser = review.user_username;

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

//  Retrieve list of reviews searched for.
function getSearchedReviewList() {

    //  Clear containers.
    document.getElementById("reviewsContainer").innerHTML = "";
    document.getElementById("latestReviewsDiv").innerHTML = "";

    //  Clear global reviews.
    globalReviews = [];

    //  Show loading modal.
    $('#loadingModal').modal("show");

    var query = $('#searchBox').val();

    if (query != "") {
        $.ajax({
            url: GlobalURL + '/reviews/search/' + query,
            type: 'GET',
            success: function (reviews) {

                //  Clear out container.
                document.getElementById("reviewsContainer").innerHTML = "";

                if(reviews.length == 0) {
                    $('#resultsText').text("No Results!");
                    $('#loadingModal').modal("hide");


                } else {
                    for (var i = 0; i < reviews.length; i++) {

                        if (i + 1 == reviews.length) {
                            reviews[i] = addUserData(reviews[i], true, "latest");
                        } else {
                            reviews[i] = addUserData(reviews[i], false, "latest");
                        }
                    }
                }
            }
        });
    }
}

function viewReview(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;

    goToViewSingleReviewPage(id);
}

function myProfile() {
    window.location.href = "/ViewUserProfilePage"
}