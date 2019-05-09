var globalGamesList = null;
var globalCount = 0;
var globalScrollEnable = true;

$(document).ready(function () {
    getGameList();

    $('#searchButton').click(function () {
        getSearchedGameList();
    });

    $('#resetButton').click(function () {
        $('#searchBox').val("");
        getGameList();
    });
});

function getGameList() {

    //  Clear results container.
    document.getElementById("gameResultsContainer").innerHTML = "";

    //  Reset global count.
    globalCount = 0;

    //  Re-enable scrolling.
    globalScrollEnable = true;

    $.get(GlobalURL + "/games/", function (data) {
        globalGamesList = data;
        displayGames(data);
    });
}

//  Retrieve list of games searched for.
function getSearchedGameList() {

    var query = $('#searchBox').val();

    //  Clear results container.
    document.getElementById("gameResultsContainer").innerHTML = "";

    //  Reset global count.
    globalCount = 0;

    //  Re-enable scrolling.
    globalScrollEnable = true;

    if (query != "") {
        $.ajax({
            url: GlobalURL + '/games/search/' + query,
            type: 'GET',
            success: function (result) {
                if (result.length == 0) {
                    document.getElementById("gameResultsContainer").innerHTML = "<br><br>";
                } else {
                    displayGames(result);
                }
            }
        });
    }
}

function appendGames(games, arrayIndex) {

    for (var i = arrayIndex; i < arrayIndex + 4; i++) {
        try {
            buildGameCard(games[i]);
        } catch (err) {

            console.log(err);
            //  Create text to indicate no more results.
            var endText = document.createElement("h2");
            endText.className = "noResultsText";
            var endTextDiv = document.createElement("div");
            endTextDiv.appendChild(endText);


            if (globalScrollEnable) {
                endText.textContent = "No more results!";
                globalScrollEnable = false;
            }

            document.getElementById("gameResultsContainer").appendChild(endText);
        }
    }
}

function displayGames(games) {
    try {
        for (var i = 0; i < 8; i++) {
            buildGameCard(games[i]);
        }
    } catch (err) {
        console.log("No more games.")
    }
}

$(window).scroll(function () {
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        globalCount = globalCount + 1;
        var arrayIndex = globalCount * 4;

        appendGames(globalGamesList, arrayIndex);
    };
});

function buildGameCard(data) {
    console.log("Game card is being created...");

    var gameData = data;

    //  Data collected from database split into individual values.
    var gameId = gameData._id
    var gameTitle = gameData.game_title;
    var gameDescription = gameData.game_description;
    var gameGenres = gameData.game_genre_tags;

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
    var gameDescriptionElement = document.createElement("h5");
    gameDescriptionElement.textContent = gameDescription;

    //  Configure game entry to be added.
    gameJumbotron.appendChild(gameIdElement);
    gameJumbotron.appendChild(gameTitleElement);
    gameJumbotron.appendChild(gameDescriptionElement);

    //  Add game entry to results container.
    resultsContainer.appendChild(gameJumbotron);
}
