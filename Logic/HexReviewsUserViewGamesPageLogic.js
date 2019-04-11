var gameList = null

$(document).ready(function() {

    $('#searchButton').click(function() {
        getSearchedGameList();
    });

    getGameList();
});

function getGameList() {
    $.get(GlobalURL + "/games/", function(data) {
        Object.keys(data).forEach(function(k) {
            console.log(JSON.stringify(data[k]));

            buildGameCard(data[k]);
        });
    });    
}

function buildGameCard(data) {
    var gameData = data;

    //  Data collected from database split into individual values.
    var gameId              = gameData._id
    var gameTitle           = gameData.game_title;
    var gameDescription     = gameData.game_description;
    var reviewCount         = countArrayElements(gameData.game_reviews);

    //  Results container to add game entries to.
    var resultsContainer = document.getElementById("gameResultsContainer");

    //  Main jumbotron container.
    var gameJumbotron = document.createElement("div");
    gameJumbotron.className = "jumbotron gameJumbotron";

    //  Game ID are properties.
    var gameIdElement = document.createElement("p");
    gameIdElement.id = "gameIdElement";
    gameIdElement.textContent = gameId;

    //  Game title div.
    var GTDiv = document.createElement("div");
    GTDiv.id = "gameTitleDiv";

    //  Game title area properties.
    var gameTitleElement = document.createElement("h1");
    gameTitleElement.className = "display-4";
    gameTitleElement.textContent = gameTitle;

    GTDiv.appendChild(gameTitleElement);

    //  Game review count area.
    var gameReviewCountArea = document.createElement("div");
    gameReviewCountArea.id = "gameReviewCountArea";

    //  Game review count text.
    var GRCText = document.createElement("h2");
    GRCText.textContent = reviewCount.toString() + " total reviews"

    // Game review view button.
    var GRVButton = document.createElement("button");
    GRVButton.id = "viewReviews";
    GRVButton.setAttribute("onclick", "viewReviews(this)");
    GRVButton.textContent = "View";
    GRVButton.className = "btn btn-lg hexButtons";

    //  Configure review count div.
    gameReviewCountArea.appendChild(GRCText);
    gameReviewCountArea.appendChild(GRVButton);

    //  Game description area.
    var gameDescriptionElement = document.createElement("h5");
    gameDescriptionElement.textContent = gameDescription;

    //  Line separator.
    var lineSeparator = document.createElement("hr");
    lineSeparator.className = "my-4";

    //  View game button properties.
    var viewGameButton = document.createElement("a");
    viewGameButton.className = "btn btn-lg hexButtons";
    viewGameButton.id="viewGameButton";
    viewGameButton.setAttribute("onclick", "viewGame(this)");
    viewGameButton.textContent = "View Game";

    //  Configure game entry to be added.
    gameJumbotron.appendChild(gameIdElement);
    gameJumbotron.appendChild(gameReviewCountArea);
    gameJumbotron.appendChild(GTDiv);
    gameJumbotron.appendChild(gameDescriptionElement);
    gameJumbotron.appendChild(lineSeparator);
    gameJumbotron.appendChild(viewGameButton);

    //  Add game entry to results container.
    resultsContainer.appendChild(gameJumbotron);

}

//  Retrieve list of games searched for.
function getSearchedGameList() {

    var query = $('#seachBox').val();

    console.log("Query to be searched: " + query);

    $.ajax({
        url: GlobalURL + '/games/search/' + query,
        type: 'GET',
        success: function(result) {
            console.log("Information from API: " + JSON.stringify(result));

            document.getElementById("gameResultsContainer").innerHTML = "";


            result.forEach(function(element) {

                console.log("Individual game: " + JSON.stringify(element));

                var data = {};

                data._id = element.id;
                data.game_title = element.game_title;
                data.game_description = element.game_description;

                buildGameCard(data);
            });

        }
    });
}

function viewGame(button) {
    var id = button.parentNode.childNodes[0].innerHTML;

    goToViewSingleGamePage(id);
}

function viewReviews(button) {
    var id = button.parentNode.parentNode.childNodes[0].innerHTML;

    console.log("ID of GAME = " + id);

    goToViewGameReviewsPage(id);
}
