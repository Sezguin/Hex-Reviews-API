$(document).ready(function() {

    var url_string = window.location.href;
    var url = new URL(url_string);
    var gameId = url.searchParams.get("id");


    getGame(gameId);
});

function getGame(gameId) {
    $.ajax({
        url: 'http://localhost:4500/games/' + gameId,
        type: 'GET',
        success: function(result) {
            console.log("Information from API: " + JSON.stringify(result));
            displayGame(result);
        }
    });
}

function displayGame(result) {

    //  Data collected from database split into individual values.
    var gameId              = result._id
    var gameTitle           = result.game_title;
    var gameDescription     = result.game_description;
    var gameGenres          = result.game_genre_tags;

    //  Results container to add game entries to.
    var resultsContainer = document.getElementById("gameResultsContainer");

    //  Main jumbotron container.
    var gameJumbotron = document.createElement("div");
    gameJumbotron.className = "jumbotron gameJumbotron";

    //  Game ID are properties.
    var gameIdElement = document.createElement("p");
    gameIdElement.id = "gameIdElement";
    gameIdElement.textContent = gameId;

    //  Game title area properties.
    var gameTitleElement = document.createElement("h1");
    gameTitleElement.className = "display-4";
    gameTitleElement.textContent = gameTitle;

    //  Game description area.
    var gameDescriptionElement = document.createElement("p");
    gameDescriptionElement.textContent = gameDescription;

    //  Game genre tags.
    var gameGenreTagsElement = document.createElement("p");
    gameGenreTagsElement.textContent = gameGenres;

    //  Button area properties.
    var gameButtonSection = document.createElement("p");
    gameButtonSection.className = "lead";

    //  Delete game button properties.
    var deleteButton = document.createElement("a");
    deleteButton.className = "btn btn-primary btn-lg";
    deleteButton.id="deleteButton";
    deleteButton.setAttribute("onclick", "deleteGame(this)");
    deleteButton.textContent = "Delete";

    //  Configure game entry to be added.
    gameJumbotron.appendChild(gameIdElement);
    gameJumbotron.appendChild(gameTitleElement);
    gameJumbotron.appendChild(gameDescriptionElement);
    gameJumbotron.appendChild(gameGenreTagsElement);
    gameJumbotron.appendChild(gameButtonSection);
    gameJumbotron.appendChild(deleteButton);

    //  Add game entry to results container.
    resultsContainer.appendChild(gameJumbotron);
}