var globalGamesList = null;
var globalCount = 0;
var globalScrollEnable = true;

//  Globally get cookies.
var cookies = getCookies();

$(document).ready(function() {

    setMiniAvatar($('#miniAv'), cookies.username);

    $('#searchButton').click(function() {
        getSearchedGameList();
    });

    $('#requestGameButton').click(function() {
        window.location.href = "/UserGameRequestPage";
    });

    $("#dropDownMostRecent").click(function () {
        getGameList("date");
    });

    $("#dropDownRating").click(function () {
        getGameList("rating");
    });

    $("#dropDownName").click(function () {
        getGameList("name");
    });
    
    $("#dropDownPopular").click(function () {
        getGameList("popular");
    });

    document.getElementById("searchBox").addEventListener("keyup", function(event) {
        if(event.keyCode === 13) {
            getSearchedGameList();
        }
    });

    $('#resetButton').click(function() {
        $('#searchBox').val("");
        getGameList();
    });

    getGameList();
});

$(window).scroll(function() {
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
        globalCount = globalCount + 1;
        var arrayIndex = globalCount * 4;

        appendGames(globalGamesList, arrayIndex);
    };
});

function getGameList(sortType) {

    //  Clear results container.
    document.getElementById("gameResultsContainer").innerHTML = "";

    //  Reset global count.
    globalCount = 0;
    
    //  Re-enable scrolling.
    globalScrollEnable = true;

    $.get(GlobalURL + "/games/", function(data) {
        globalGamesList = data;
        sortArray(sortType, data, displayGames)
    });    
}

function sortArray(sortType, games, callback) {

    switch (sortType) {
        case "date":
            games.sort(function(a, b) {
                var dateA = new Date(a.game_creation_date);
                var dateB = new Date(b.game_creation_date);
                return dateB - dateA;
            });
            break;

        case "rating":
            games.sort(function(a, b) {
                var ratingA = new Date(a.game_rating);
                var ratingB = new Date(b.game_rating);
                return ratingB - ratingA;
            });
            break;

        case "name":
            games.sort(function(a, b) {
                var nameA = a.game_title.toLowerCase();
                var nameB = b.game_title.toLowerCase();
                if (nameA < nameB) {
                    return -1;
                }
            });
            break;

        case "popular":
            games.sort(function(a, b) {
                var popularA = a.game_reviews.length;
                var popularB = b.game_reviews.length;
                return popularB - popularA;
            });

        default:
    }

    callback(games);
}

function appendGames(games, arrayIndex) {

    for(var i = arrayIndex; i < arrayIndex + 4; i++) {
        try {
            buildGameCard(games[i]);
        } catch(err) {

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
    for(var i = 0; i < 4; i++) {
        buildGameCard(games[i]);
    }
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
    gameJumbotron.id = "gameJumbotronUserGames";
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
    gameTitleElement.id = "gameTitleElement";
    gameTitleElement.className = "display-4";
    gameTitleElement.textContent = gameTitle;

    GTDiv.appendChild(gameTitleElement);

    //  Game review count area.
    var gameReviewCountArea = document.createElement("div");
    gameReviewCountArea.id = "gameReviewCountArea";

    //  Game review count text.
    var GRCText = document.createElement("h2");
    GRCText.textContent = reviewCount.toString() + " total reviews"

    //  Button container.
    var buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";

    // Game review view button.
    var GRVButton = document.createElement("button");
    GRVButton.id = "viewReviews";
    GRVButton.setAttribute("onclick", "viewReviews(this)");
    GRVButton.textContent = "View";
    GRVButton.className = "btn btn-lg hexButtons";

    //  Game write review button.
    var GWRButton = document.createElement("button");
    GWRButton.id = "writeReview";
    GWRButton.setAttribute("onclick", "writeReview(this)");
    GWRButton.textContent = "Write Review";
    GWRButton.className = "btn btn-lg hexButtons";

    //  View game button properties.
    var viewGameButton = document.createElement("button");
    viewGameButton.className = "btn btn-lg hexButtons";
    viewGameButton.id="viewGameButton";
    viewGameButton.setAttribute("onclick", "viewGame(this)");
    viewGameButton.textContent = "View Game";

    //  Configure button container.
    buttonContainer.appendChild(viewGameButton);
    buttonContainer.appendChild(GWRButton);

    //  Configure review count div.
    gameReviewCountArea.appendChild(GRCText);
    gameReviewCountArea.appendChild(GRVButton);

    //  Game description area.
    var gameDescriptionElement = document.createElement("h5");
    gameDescriptionElement.id = "gameDescriptionElement";
    gameDescriptionElement.textContent = gameDescription;

    //  Line separator.
    var lineSeparator = document.createElement("hr");
    lineSeparator.className = "my-4";

    //  Configure game entry to be added.
    gameJumbotron.appendChild(gameIdElement);
    gameJumbotron.appendChild(gameReviewCountArea);
    gameJumbotron.appendChild(GTDiv);
    gameJumbotron.appendChild(lineSeparator);

    gameJumbotron.appendChild(gameDescriptionElement);
    gameJumbotron.appendChild(buttonContainer);

    //  Add game entry to results container.
    resultsContainer.appendChild(gameJumbotron);

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

    if(query != "") {
        $.ajax({
            url: GlobalURL + '/games/search/' + query,
            type: 'GET',
            success: function(result) {
                if(result.length == 0) {
                    document.getElementById("gameResultsContainer").innerHTML = "<br><br>";
                } else {
                    displayGames(result);
                }
            }
        });
    }
}

function viewGame(button) {
    var id = button.parentNode.parentNode.childNodes[0].innerHTML;

    goToUserViewSingleGamePage(id);
}

function viewReviews(button) {
    var id = button.parentNode.parentNode.childNodes[0].innerHTML;
    goToViewGameReviewsPage(id);
}

function writeReview(button) {
    var id = button.parentNode.parentNode.childNodes[0].innerHTML;
    goToWriteReviewPage(id);
}
