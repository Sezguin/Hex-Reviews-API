var gameImages = [];

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

setTimeout(function displayGame(game) {

    $("#successfulPostModal").hide();

    console.log("DATA: " + gameImages.length);

    var number = Math.floor(Math.random() * gameImages.length)

    $("#gameCoverImage").attr("src", gameImages[number]);

}, 500);