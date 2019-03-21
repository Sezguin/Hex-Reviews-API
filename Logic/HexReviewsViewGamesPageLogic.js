var gameList = null

$(document).ready(function() {
    getGameList();

    $("#deleteButton").click(function() {
        console.log("Delete game button clicked.");
    });
});

function getGameList() {
    $.get("http://localhost:4500/games/", function(data) {
        Object.keys(data).forEach(function(k) {
            console.log(JSON.stringify(data[k]));

            buildGameCard(data[k]);
        });
    });    
}

function buildGameCard(data) {
    console.log("Game card is being created...");

    var gameData = data;

    //  Data collected from database split into individual values.
    var gameId              = gameData._id
    var gameTitle           = gameData.game_title;
    var gameDescription     = gameData.game_description;
    var gameGenres          = gameData.game_genre_tags;

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

    //  Line separator.
    var lineSeparator = document.createElement("hr");
    lineSeparator.className = "my-4";

    //  Delete game button properties.
    var deleteButton = document.createElement("a");
    deleteButton.className = "btn btn-danger btn-lg";
    deleteButton.id="deleteButton";
    deleteButton.setAttribute("onclick", "deleteGame(this)");
    deleteButton.textContent = "Delete";

    //  View game button properties.
    var viewGameButton = document.createElement("a");
    viewGameButton.className = "btn btn-primary btn-lg";
    viewGameButton.id="viewGameButton";
    viewGameButton.setAttribute("onclick", "viewGame(this)");
    viewGameButton.textContent = "View";

    //  Configure game entry to be added.
    gameJumbotron.appendChild(gameIdElement);
    gameJumbotron.appendChild(gameTitleElement);
    gameJumbotron.appendChild(gameDescriptionElement);
    gameJumbotron.appendChild(lineSeparator);
    gameJumbotron.appendChild(deleteButton);
    gameJumbotron.appendChild(viewGameButton);


    //  Add game entry to results container.
    resultsContainer.appendChild(gameJumbotron);

}

function viewGame(button) {
    var id = button.parentNode.childNodes[0].innerHTML;

    goToViewSingleGamePage(id);
}
