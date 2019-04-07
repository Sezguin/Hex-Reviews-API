//  Globally grab cookies.
var cookies = getCookies();

$(document).ready(function() {
    $("#showChooseGameModal").click(function() {
        $("#chooseGameModal").modal("show");
    });

    $("#modalGameSearchButton").click(function() {
        getGameList();
    });

    $("#submitReviewButton").click(function() {

        $("#successfulPostModal").modal("show");

        window.setTimeout(postReview, 1000);
    });

    //  Hide certain elements on page load.
    document.getElementById("successIcon").style.display = 'none';
    document.getElementById("failureIcon").style.display = 'none';
    document.getElementById("successfulModalCloseButton").style.display = 'none';
});

function getGameList() {
    var query = $('#gameSearchBox').val();

    console.log("Query to be searched: " + query);

    $.ajax({
        url: 'https://hex-reviews.herokuapp.com//games/search/' + query,
        type: 'GET',
        success: function(result) {
            console.log("Information from API: " + JSON.stringify(result));

            document.getElementById("searchedGamesContainer").innerHTML = "";

            result.forEach(function(element) {
                console.log("Individual game: " + JSON.stringify(element));

                var gameTitle = element.game_title;
                var gameDescription = element.game_description;
                var gameId = element._id;

                addListItem(gameId, gameTitle, gameDescription);
            });

        }
    });
}

function addListItem(gameId, gameTitle , gameDescription) {
    
    //  Results container to add returned games from search.
    var resultsContainer = document.getElementById("searchedGamesContainer");

    //  Game ID area properties.
    // var gameIdElement = document.createElement("p");
    // gameIdElement.id = "gameIdElement";
    // gameIdElement.textContent = gameId;

    //  Main list item button.
    var gameListItemButton = document.createElement("button");
    gameListItemButton.className = "list-group-item list-group-item-action flex-column align-items-start";
    gameListItemButton.setAttribute("onclick", "selectGame(this)");
    gameListItemButton.id = gameTitle;
    gameListItemButton.setAttribute("aria-label", gameId);
    
    //  Title text div.
    var titleTextDiv = document.createElement("div");
    titleTextDiv.className = "d-flex w-100 justify-content-between";

    //  Title text heading.
    var titleText = document.createElement("h5");
    titleText.className = "mb-1";
    titleText.textContent = gameTitle;

    //  Decription text.
    var descriptionText = document.createElement("p");
    descriptionText.className = "mb-1";
    descriptionText.textContent = gameDescription;

    //  Configure title text.
    titleTextDiv.appendChild(titleText);

    //  Configure game list item.
    gameListItemButton.appendChild(titleTextDiv);
    gameListItemButton.appendChild(descriptionText);

    //  Add item to results container.
    resultsContainer.appendChild(gameListItemButton);
}

function selectGame(button) {

    console.log("Adding game elements to form...");

    var gameID = $(button).attr('aria-label');
    var gameTitle = button.id;

    $("#chooseGameModal").modal("hide");

    $("#reviewGameId").val(gameID);
    $("#reviewTitle").val(gameTitle);
}

function postReview() {

    //  All review elements.
    var reviewTitle     = $('#reviewTitle').val();
    var reviewSubtitle  = $('#reviewSubtitle').val();
    var reviewContent   = $('#reviewContent').val();
    var reviewRating    = $('#reviewRating').val();
    
    var userID = cookies.user_id;
    var gameID = $('#reviewGameId').val();

    //  Post review.
    $.post("https://hex-reviews.herokuapp.com//reviews/", 
    {   
        review_title: reviewTitle,
        review_subtitle: reviewSubtitle,
        review_content: reviewContent,
        review_rating: reviewRating,
        game_id: gameID,
        user_id: userID       
    },
    function(data, status) {
        if(data == "failure") {
            $("#successModalTitle").text("Error :/");
            $("#successfulPostModalSpinner").hide();
            document.getElementById("failureIcon").style.display = 'block';
            document.getElementById("successfulModalCloseButton").style.display = 'block';

        } else {
            $("#successModalTitle").text("Success!");
            $("#successfulPostModalSpinner").hide();
            document.getElementById("successIcon").style.display = 'block';
            document.getElementById("successfulModalCloseButton").style.display = 'block';

            postReviewIds(data);
        }
        console.log("Message from API: " + JSON.stringify(data));
    });
}

function postReviewIds(data) {

        console.log("Posting IDs to update games and users...");

        var userID = cookies.user_id;
        var gameID = $("#reviewGameId").val();
        var reviewID = data;

        //  Post review IDs to games and users.
        $.post("https://hex-reviews.herokuapp.com//reviews/add/ids", 
        {   
            review_id: reviewID,
            game_id: gameID,
            user_id: userID
        },
        function(data, status) {
            if(data == "failure") {
                console.log("Nope");
            } else {
                console.log("Yup");
            }
            console.log("Message from API: " + JSON.stringify(data));
        });
}