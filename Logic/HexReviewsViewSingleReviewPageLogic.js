//  Globally get cookies.
var cookies = getCookies();
var globalReviewId;

$(document).ready(function () {

    //  Grab ID from URL parameter.
    var url_string = window.location.href;
    var url = new URL(url_string);
    var reviewID = url.searchParams.get("id");
    globalReviewId = reviewID;

    getReview(reviewID);

    $('#addCommentButton').click(function () {
        addComment();
    });
});

//  Get review information from supplied ID.
function getReview(reviewID) {
    $.ajax({
        url: GlobalURL + '/reviews/single/' + reviewID,
        type: 'GET',
        success: function (result) {
            console.log("Review: " + JSON.stringify(result));
            getUserInformation(result);
        }
    });
}

//  Get user information from ID attatched to reciew object.
function getUserInformation(review) {
    $.ajax({
        url: GlobalURL + '/users/' + review.user_id,
        type: 'GET',
        success: function (user) {
            checkSubscriptionList(review, user);
        }
    });
}

//  Check if user is on current subscription list.
function checkSubscriptionList(review, user) {

    var subscriberData = cookies.user_id;
    var subscribeeData = review.user_id;

    $.post(GlobalURL + "/users/subscribe/check",
        {
            subscriber: subscriberData,
            subscribee: subscribeeData,
        },
        function (subbed) {
            if (user.user_avatar != "") {
                displayReview(review, user, user.user_avatar, subbed);
                displayComments(review._id);
            } else {
                displayReview(review, user, "/Images/DefaultAvatar.jpg", subbed);
                displayComments(review._id);
            }
        });
}

function displayReview(review, user, avatar, subbed) {
    console.log("Displaying review for " + user.user_username);

    var reviewRating;
    var textArea = document.getElementById("reviewContentTextArea");

    // Set up review rating.
    switch (review.review_rating) {
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

    $('#reviewTitle').text(review.review_title);
    $('#reviewSubtitle').text("\"" + review.review_subtitle + "\"");
    $('#reviewUsername').text("Reviewed by " + user.user_username);
    $('#userAvatar').attr("src", avatar);
    $('#ratingImage').attr("src", reviewRating);
    textArea.textContent = review.review_content;
    textArea.style.height = (5 + textArea.scrollHeight) + "px";

    if (subbed) {
        $('#subscribeButton').text("Unsubsribe");
    } else {
        $('#subscribeButton').text("Subscribe");
    }
}

function addComment() {
    var commentContent = $('#commentTextArea').val();

    console.log("Comment to be sent: " + commentContent);
    console.log("Global review ID: " + globalReviewId)

    $.post(GlobalURL + "/reviews/comment", 
    {   
        review_id: globalReviewId,
        comment_user_id: cookies.user_id,
        comment_content: commentContent,
    },
    function(data) {
        if(!data) {
            console.log("Fail");
        } else {
            location.reload();
        }
    });
}

function displayComments(reviewID) {
    $.ajax({
        url: GlobalURL + '/reviews/comment/' + reviewID,
        type: 'GET',
        success: function (comments) {
            console.log("Comments: " + JSON.stringify(comments));
            Object.keys(comments).forEach(function(k) {
                getUserInformationComment(comments[k]);
            });
        }
    });
}

function getUserInformationComment(comment) {
    var userID = comment.comment_user_id;

    $.ajax({
        url: GlobalURL + '/users/' + userID,
        type: 'GET',
        success: function (user) {
            if (user.user_avatar != "") {
                createComment(comment, user, user.user_avatar);
            } else {
                createComment(comment, user, "/Images/DefaultAvatar.jpg");
            }
        }
    });
}

function createComment(comment, user, avatar) {
    console.log("create a comment..." + comment._id);

    var resultsContainer = document.getElementById("commentsDiv");

    var singleCommentDiv = document.createElement("div");
    singleCommentDiv.id = "singleCommentDiv";

    //  Create username element.
    var usernameElement = document.createElement("h5");
    usernameElement.id = "usernameElement";
    usernameElement.textContent = user.user_username;

    //  Create user rank element.
    var userRankElement = document.createElement("h5");
    userRankElement.id = "userRankElement";
    userRankElement.textContent = user.user_rank;

    //  Create user avatar element.
    var userAvatarElement = document.createElement("img");
    userAvatarElement.id = "userAvatarElement";
    userAvatarElement.src = avatar;

    //  User area div.
    var userDiv = document.createElement("div");
    userDiv.id = "userDiv";

    var commentContent = document.createElement("h5");
    commentContent.textContent = comment.comment_content;

    //  Configure user area.
    userDiv.appendChild(usernameElement);
    userDiv.appendChild(userAvatarElement);
    userDiv.appendChild(userRankElement);

    //  Build comment container.
    singleCommentDiv.appendChild(userDiv);
    singleCommentDiv.appendChild(commentContent);

    //  Append all items to results container.
    resultsContainer.appendChild(singleCommentDiv);
}