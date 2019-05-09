$(document).ready(function () {

    $("#deleteGameButton").click(function () {
        prepareGame();
        $('#successfulPostModal').modal("show");
    });

    $("#deleteReviewButton").click(function () {
        prepareReview();
        $('#successfulPostModal').modal("show");
    });

    $("#deleteUserButton").click(function () {
        prepareUser();
        $('#successfulPostModal').modal("show");
    });

    $('#successfulModalCloseButton').click(function () {
        location.reload();
    });

    //  Hide certain elements on page load.
    document.getElementById("successIcon").style.display = 'none';
    document.getElementById("failureIcon").style.display = 'none';
    document.getElementById("successfulModalCloseButton").style.display = 'none';

});

//  Grab the review.
function prepareReview() {
    var reviewID = $('#deleteReviewInput').val();

    $.ajax({
        url: GlobalURL + '/reviews/single/' + reviewID,
        type: 'GET',
        success: function (review) {
            window.setTimeout(function () {
                deleteReview(review._id, review.user_id);

                $("#successModalTitle").text("Success!");
                $("#successfulPostModalSpinner").hide();
                document.getElementById("successIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButton").style.display = 'block';
            }, 500);
        }
    });
}

//  Grab the user.
function prepareUser() {
    var userID = $('#deleteUserInput').val();

    $.ajax({
        url: GlobalURL + '/users/' + userID,
        type: 'GET',
        success: function (user) {
            deleteUserReviews(user.user_reviews);

            window.setTimeout(function () {
                deleteUser(user._id);

                $("#successModalTitle").text("Success!");
                $("#successfulPostModalSpinner").hide();
                document.getElementById("successIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButton").style.display = 'block';

            }, 500);
        }
    });
}

// Remove the user's reviews.
function deleteUserReviews(reviews) {
    Object.keys(reviews).forEach(function (k) {
        deleteReview(reviews[k]);
    });
}

//  Grab the game.
function prepareGame() {

    var gameID = $('#deleteGameInput').val();

    $.ajax({
        url: GlobalURL + '/games/' + gameID,
        type: 'GET',
        success: function (game) {
            getGameReviews(game.game_reviews);
            prepareGameImages(game.game_images_id);

            window.setTimeout(function () {
                deleteGame(game._id);

                $("#successModalTitle").text("Success!");
                $("#successfulPostModalSpinner").hide();
                document.getElementById("successIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButton").style.display = 'block';
            }, 500);
        }
    });
}

// Remove the images from a game.
function prepareGameImages(images) {
    Object.keys(images).forEach(function (k) {
        deleteGameImages(images[k]);
    });
}

//  Remove users and reviews respectively.
function getGameReviews(reviews) {
    for (var i = 0; i < reviews.length; i++) {
        $.ajax({
            url: GlobalURL + '/reviews/single/' + reviews[i],
            type: 'GET',
            success: function (review) {
                deleteReview(review._id, review.user_id);
            }
        });
    }
}