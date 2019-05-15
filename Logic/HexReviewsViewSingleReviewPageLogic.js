//  Globally get cookies.
var cookies = getCookies();
var globalReviewId;
var globalReviewerId;

$(document).ready(function () {

    setMiniAvatar($('#miniAv'), cookies.username);

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
            globalReviewerId = result.user_id;
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
            if (globalReviewerId == cookies.user_id) {
                document.getElementById("viewProfileButton").textContent = "My Profile";
                document.getElementById("viewProfileButton").setAttribute("onclick", "viewMyProfile()");
            } else {
                document.getElementById("viewProfileButton").textContent = "View Profile";
                document.getElementById("viewProfileButton").setAttribute("onclick", "viewProfile()");
            }
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
                displayCommentsAndSort(review._id);
            } else {
                displayReview(review, user, "/Images/DefaultAvatar.jpg", subbed);
                displayCommentsAndSort(review._id);
            }
        });
}

function displayReview(review, user, avatar, subbed) {

    var reviewRating;
    var textArea = document.getElementById("reviewContentTextArea");
    var subscribee = review.user_id;

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
    $('#reviewTitle').attr("href", "/UserViewSingleGamePage?id=" + review.game_id);
    $('#reviewSubtitle').text("\"" + review.review_subtitle + "\"");
    $('#reviewUsername').text("Reviewed by " + user.user_username);
    $('#userAvatar').attr("src", avatar);
    $('#ratingImage').attr("src", reviewRating);
    textArea.textContent = review.review_content;
    textArea.style.height = (5 + textArea.scrollHeight) + "px";

    if (review.user_id == cookies.user_id) {
        $('#subscribeButton').attr("hidden", true);

    }
    if (subbed) {
        $('#subscribeButton').text("Unsubsribe");
        subscribeButton.setAttribute("onclick", "unsubscribeToUser(\"" + subscribee + "\", this)");
    } else {
        $('#subscribeButton').text("Subscribe");
        subscribeButton.setAttribute("onclick", "subscribeToUser(\"" + subscribee + "\", this)");
    }
}

function subscribeToUser(subscribee, button) {
    var subscriber = cookies.user_id;

    subscribe(subscriber, subscribee);

    subscribeButton = button;
    subscribeButton.textContent = "Unsubscribe";
    subscribeButton.setAttribute("onclick", "unsubscribeToUser(\"" + subscribee + "\", this)");
}

function unsubscribeToUser(subscribee, button) {
    var subscriber = cookies.user_id;

    unsubscribe(subscriber, subscribee);

    subscribeButton = button;
    subscribeButton.textContent = "Subscribe";
    subscribeButton.setAttribute("onclick", "subscribeToUser(\"" + subscribee + "\", this)");
}

function addComment() {
    var commentContent = $('#commentTextArea').val();
    $.post(GlobalURL + "/reviews/comment",
        {
            review_id: globalReviewId,
            comment_user_id: cookies.user_id,
            comment_content: commentContent,
        },
        function (data) {
            if (!data) {
                console.log("There was an error when posting the comment.");
            } else {
                displayCommentsAndSort(globalReviewId);
                document.getElementById("commentTextArea").value = "";
            }
        });
}

function displayCommentsAndSort(reviewID) {

    //  Clear any previous comments.
    document.getElementById("commentsDiv").innerHTML = "";

    $.ajax({
        url: GlobalURL + '/reviews/comment/' + reviewID,
        type: 'GET',
        success: function (comments) {
            sortArray(comments, displayCommments);
        }
    });
}

function sortArray(comments, callback) {

    //  Sort comments by most recent date.
    comments.sort(function (a, b) {
        var dateA = new Date(a.comment_creation_date);
        var dateB = new Date(b.comment_creation_date);
        return dateB - dateA;
    });

    callback(comments);
}

function displayCommments(comments) {
    Object.keys(comments).forEach(function (k) {
        getUserInformationComment(comments[k]);
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

    var commentLikeArray = comment.comment_likes;
    var commentLiked = commentLikeArray.includes(cookies.user_id);
    var commentLikes = commentLikeArray.length
    var resultsContainer = document.getElementById("commentsDiv");

    //  Comment ID area properties.
    var commentIdElement = document.createElement("p");
    commentIdElement.id = "commentIdElement";
    commentIdElement.setAttribute("hidden", true);
    commentIdElement.textContent = comment._id;

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

    //  Like button.
    var likeButton = document.createElement("button");
    likeButton.id = "likeButton";
    if (commentLiked) {
        likeButton.setAttribute("onclick", "unlikeComment(this)");
        likeButton.className = "btn hexButtons";
    } else {
        likeButton.setAttribute("onclick", "likeComment(this)");
        likeButton.className = "btn btn-secondary";
    }

    if(comment.comment_user_id == cookies.user_id) {
        var deleteCommentButton = document.createElement("button");
        deleteCommentButton.textContent = "X";
        deleteCommentButton.id="deleteCommentButton";
        deleteCommentButton.className = "btn btn-danger";
        deleteCommentButton.setAttribute("onclick", "deleteComment(\"" + comment._id + "\")");
    }

    //  Like amount.
    var likeAmount = document.createElement("h5");
    likeAmount.id = "likeAmount";
    likeAmount.textContent = commentLikes;

    //  Like icon.
    var likeIcon = document.createElement("i");
    likeIcon.className = "material-icons commentIcons";
    likeIcon.textContent = "thumb_up_alt";

    //  Configure like button.
    likeButton.appendChild(likeIcon);

    //  Comment content element.
    var commentContent = document.createElement("textarea");
    commentContent.id = "commentContent";
    commentContent.className = "form-control";
    commentContent.setAttribute("readonly", true);
    commentContent.textContent = comment.comment_content;

    //  User area div.
    var userDiv = document.createElement("div");
    userDiv.id = "userDiv";

    //  Like and dislike div.
    var likeDiv = document.createElement("div");
    likeDiv.id = "likeDiv";

    //  Comment content div.
    var commentContentDiv = document.createElement("div");
    commentContentDiv.id = "commentContentDiv";

    //  Configure comment content div.
    commentContentDiv.appendChild(commentContent);

    //  Configure like/dislike div.
    likeDiv.appendChild(likeButton);
    likeDiv.appendChild(likeAmount);


    //  Configure user div.
    userDiv.appendChild(usernameElement);
    userDiv.appendChild(userAvatarElement);
    userDiv.appendChild(userRankElement);

    //  Build comment container.
    singleCommentDiv.appendChild(commentIdElement);
    singleCommentDiv.appendChild(userDiv);
    singleCommentDiv.appendChild(commentContentDiv);
    if(comment.comment_user_id == cookies.user_id) {
        singleCommentDiv.appendChild(deleteCommentButton);
    }
    singleCommentDiv.appendChild(likeDiv);

    //  Append all items to results container.
    resultsContainer.appendChild(singleCommentDiv);
}

function likeComment(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;
    button.className = "btn hexButtons";
    button.setAttribute("onclick", "unlikeComment(this)");

    likeValue = parseInt(button.parentNode.childNodes[1].innerHTML);
    likeValue = likeValue + 1;
    button.parentNode.childNodes[1].innerHTML = likeValue;

    $.post(GlobalURL + "/reviews/comment/like",
        {
            user_id: cookies.user_id,
            review_id: globalReviewId,
            comment_id: id
        },
        function (data) {
            if (!data) {
                console.log("There was an error when liking the comment.");
            } else {
                console.log("The comment was liked successfully.");
            }
        });

    button.className = "btn hexButtons";
}

function unlikeComment(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;
    button.className = "btn btn-secondary";
    button.setAttribute("onclick", "likeComment(this)");

    dislikeValue = parseInt(button.parentNode.childNodes[1].innerHTML);
    dislikeValue = dislikeValue - 1;
    button.parentNode.childNodes[1].innerHTML = dislikeValue;

    $.post(GlobalURL + "/reviews/comment/unlike",
        {
            user_id: cookies.user_id,
            review_id: globalReviewId,
            comment_id: id
        },
        function (data) {
            if (!data) {
                console.log("There was an error when unliking the comment.");
            } else {
                console.log("The comment was unliked successfully.");
            }
        });
}

function deleteComment(commentId) {
    console.log("ID: " + commentId);

    $.post(GlobalURL + "/reviews/delete/comment",
    {
        comment_id: commentId,
        review_id: globalReviewId,
    },
    function (data) {
        if (data) {
            displayCommentsAndSort(globalReviewId);
        } else {
            console.log("Error when removing comment.");
        }
    });
}

function viewProfile() {
    goToViewOtherUserProfilePage(globalReviewerId);
}

function viewMyProfile() {
    window.location.href = "/ViewUserProfilePage";
}