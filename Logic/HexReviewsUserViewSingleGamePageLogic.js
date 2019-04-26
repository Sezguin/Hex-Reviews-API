var gameImages = [];
var globalGame;

$(document).ready(function() {

    var url_string = window.location.href;
    var url = new URL(url_string);
    var gameID = url.searchParams.get("id");

    getGame(gameID);
});

function getGame(gameID) {

    $("#successfulPostModal").show();

    $.ajax({
        url: GlobalURL + '/games/' + gameID,
        type: 'GET',
        success: function(result) {
            globalGame = result;
            getGameImages(result);
        }
    });
}

function getGameImages(game) {

    var gameImageArray = game.game_images_id;

    for(var i = 0; i < gameImageArray.length; i++) {
        console.log("Image ID: " + gameImageArray[i]);

        $.ajax({
            url: GlobalURL + '/images/game/' + gameImageArray[i],
            type: 'GET',
            success: function(result) {
                gameImages.push(result.game_image_data);
            }
        });
    }
}

setTimeout(function displayGame() {

    $("#successfulPostModal").hide();

    var reviewsAmount;
    var cutReleaseDate;
    var developer;
    var publisher;

    var rating = 0;
    var total = 0;

    for (var i = 0; i < globalGame.game_rating.length; i++) {
        total = total + parseInt(globalGame.game_rating[i]);
        console.log("Total: " + total);
    }

    rating = total / parseInt(globalGame.game_rating.length);

    if(0 <= rating && rating < 1) {
        console.log("dsggdsf");
        $('#ratingRank').addClass("terrible");
    }

    if(1 <= rating && rating < 2) {
        console.log("dsggdsf");
        $('#ratingRank').addClass("bad");
    }

    if(2 <= rating && rating < 3) {
        console.log("dsggdsf");
        $('#ratingRank').addClass("okay");
    }

    if(3 <= rating && rating < 4) {
        console.log("dsggdsf");
        $('#ratingRank').addClass("good");
    }

    if(4 <= rating && rating < 5) {
        console.log("dsggdsf");
        $('#ratingRank').addClass("excellent");
    }

    if(rating == 5) {
        console.log("dsggdsf");
        $('#ratingRank').addClass("perfect");
    }

    if(globalGame.game_reviews === undefined || globalGame.game_reviews.length == 0) {
        reviewsAmount = "None!"
    } else {
        reviewsAmount = globalGame.game_reviews.length;
    }

    if(globalGame.game_release_date === null) {
        cutReleaseDate = "N/A"
    } else {
        cutReleaseDate = globalGame.game_release_date.split('T')[0];
    }

    if(globalGame.game_developer == "") {
        developer = "N/A";
    } else {
        developer = globalGame.game_developer;
    }

    if(globalGame.game_publisher == "") {
        publisher = "N/A";
    } else {
        publisher = globalGame.game_publisher;
    }

    genreResults = document.getElementById("genreDiv");

    for(var i = 0; i < globalGame.game_genre_tags.length; i++) {
        var genreButton = document.createElement("a");
        genreButton.id = "genreButton";
        genreButton.className = "btn hexButtons";
        genreButton.textContent = globalGame.game_genre_tags[i];
        genreResults.appendChild(genreButton);
    }

    ageResults = document.getElementById("ageDiv");

    for(var i = 0; i < globalGame.game_age_rating_tags.length; i++) {
        var ageButton = document.createElement("a");
        ageButton.id = "ageButton";
        ageButton.className = "btn hexButtons";
        ageButton.textContent = globalGame.game_age_rating_tags[i];
        ageResults.appendChild(ageButton);
    }

    platformResults = document.getElementById("platformDiv");

    for(var i = 0; i < globalGame.game_platform_tags.length; i++) {
        var platformButton = document.createElement("a");
        platformButton.id = "platformButton";
        platformButton.className = "btn hexButtons";
        platformButton.textContent = globalGame.game_platform_tags[i];
        platformResults.appendChild(platformButton);
    }

    var number = Math.floor(Math.random() * gameImages.length)
    $("#gameCoverImage").attr("src", gameImages[number]);

    $('#gameTitle').text(globalGame.game_title);
    $('#gameDescription').text(globalGame.game_description);
    $('#totalReviews').text(reviewsAmount);
    $('#releaseDate').text(cutReleaseDate);
    $('#developer').text(developer);
    $('#publisher').text(publisher);
    if(0 < rating) {
        $('#rating').text(rating.toFixed(2) + " / 5");
    } else {
        $('#rating').text( "Unranked");
    }



}, 500);

function viewReviews() {
    goToViewGameReviewsPage(globalGame._id);
}

function writeReview() {
    goToWriteReviewPage(globalGame._id);
}