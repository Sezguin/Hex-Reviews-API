//  Globally grab cookies.
var cookies = getCookies();
var globalRating;

$(document).ready(function () {

    setMiniAvatar($('#miniAv'), cookies.username);
    
    $("#showChooseGameModal").click(function () {
        $("#chooseGameModal").modal("show");
        populateLatestGames();
        $("#loadingModal").show();
    });

    $("#modalGameSearchButton").click(function () {
        getGameList();
    });

    $("#successfulModalCloseButtonError").click(function () {
        $("#successModalTitle").text("Please wait...");
        $("#successfulPostModalSpinner").show();
        document.getElementById("successIcon").style.display = 'none';
        document.getElementById("failureIcon").style.display = 'none';
        document.getElementById("successfulModalCloseButtonError").style.display = 'none';
        document.getElementById("successfulModalCloseButton").style.display = 'none';

    });

    $("#successfulModalCloseButton").click(function () {
        window.location.href = "/UserReviewPage";
    });

    $("#rating1").click(function () {
        globalRating = 1;
        $(this).toggleClass("down");
        $("#rating5").removeClass("down");
        $("#rating4").removeClass("down");
        $("#rating3").removeClass("down");
        $("#rating2").removeClass("down");
    });
    $("#rating2").click(function () {
        globalRating = 2;
        $(this).toggleClass("down");
        $("#rating5").removeClass("down");
        $("#rating4").removeClass("down");
        $("#rating3").removeClass("down");
        $("#rating1").removeClass("down");
    });
    $("#rating3").click(function () {
        globalRating = 3;
        $(this).toggleClass("down");
        $("#rating5").removeClass("down");
        $("#rating4").removeClass("down");
        $("#rating2").removeClass("down");
        $("#rating1").removeClass("down");
    });
    $("#rating4").click(function () {
        globalRating = 4;
        $(this).toggleClass("down");
        $("#rating5").removeClass("down");
        $("#rating3").removeClass("down");
        $("#rating2").removeClass("down");
        $("#rating1").removeClass("down");
    });
    $("#rating5").click(function () {
        globalRating = 5;
        $(this).toggleClass("down");
        $("#rating4").removeClass("down");
        $("#rating3").removeClass("down");
        $("#rating2").removeClass("down");
        $("#rating1").removeClass("down");
    });

    $("#submitReviewButton").click(function () {
        $("#successfulPostModal").modal("show");
        window.setTimeout(postReview, 1000);
    });

    //  Grab ID from URL parameter.
    var url_string = window.location.href;
    var url = new URL(url_string);
    var gameID = url.searchParams.get("id");

    if (gameID != null) {
        $.ajax({
            url: GlobalURL + '/games/' + gameID,
            type: 'GET',
            success: function (result) {
                $("#reviewGameId").val(gameID);
                $("#reviewTitle").val(result.game_title);
            }
        });
    }

    //  Hide certain elements on page load.
    document.getElementById("successIcon").style.display = 'none';
    document.getElementById("failureIcon").style.display = 'none';
    document.getElementById("successfulModalCloseButton").style.display = 'none';
    document.getElementById("successfulModalCloseButtonError").style.display = 'none';

});

function getGameList() {
    var query = $('#gameSearchBox').val();

    if (query != "") {
        document.getElementById("resultsHeading").textContent = "Results:";
        $("#loadingModal").show();

        $.ajax({
            url: GlobalURL + '/games/search/' + query,
            type: 'GET',
            success: function (result) {
                
                if(result.length == 0) {
                    document.getElementById("resultsHeading").textContent = "No games found!";
                }

                document.getElementById("searchedGamesContainer").innerHTML = "";
                $("#loadingModal").hide();

                result.forEach(function (element) {
                    var gameTitle = element.game_title;
                    var gameDescription = element.game_description;
                    var gameId = element._id;

                    addListItem(gameId, gameTitle, gameDescription);
                });

            }
        });
    }
}

function populateLatestGames() {
    $.ajax({
        url: GlobalURL + '/games/',
        type: 'GET',
        success: function (result) {
            document.getElementById("searchedGamesContainer").innerHTML = "";
            $("#loadingModal").hide();


            result.sort(function (a, b) {
                var dateA = new Date(a.game_creation_date);
                var dateB = new Date(b.game_creation_date);
                return dateB - dateA;
            });

            for (var i = 0; i < 4; i++) {
                addListItem(result[i]._id, result[i].game_title, result[i].game_description);
            }

        }
    });
}

function addListItem(gameId, gameTitle, gameDescription) {

    //  Results container to add returned games from search.
    var resultsContainer = document.getElementById("searchedGamesContainer");

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
    var reviewTitle = $('#reviewTitle').val();
    var reviewSubtitle = $('#reviewSubtitle').val();
    var reviewContent = $('#reviewContent').val();
    var reviewRating = globalRating;

    var userID = cookies.user_id;
    var gameID = $('#reviewGameId').val();

    //  Post review.
    $.post(GlobalURL + "/reviews/",
        {
            review_title: reviewTitle,
            review_subtitle: reviewSubtitle,
            review_content: reviewContent,
            review_rating: reviewRating,
            game_id: gameID,
            user_id: userID
        },
        function (data, status) {
            if (!data) {
                if ($('#reviewTitle').val() == "") {
                    $("#successModalTitle").text("Please select a game!");
                } else if ($('#reviewSubtitle').val() == "") {
                    $("#successModalTitle").text("Please include a quote!");
                } else if ($('#reviewContent').val() == "") {
                    $("#successModalTitle").text("Please write something...");
                } else {
                    $("#successModalTitle").text("Please select a rating!");
                }
                $("#successfulPostModalSpinner").hide();
                document.getElementById("failureIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButtonError").style.display = 'block';

            } else {
                $("#successModalTitle").text("Success!");
                $("#successfulPostModalSpinner").hide();
                document.getElementById("successIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButton").style.display = 'block';

                postReviewIds(data);
                postRating(gameID, reviewRating);
            }
        });
}

function postReviewIds(data) {


    var userID = cookies.user_id;
    var gameID = $("#reviewGameId").val();
    var reviewID = data;

    //  Post review IDs to games and users.
    $.post(GlobalURL + "/reviews/add/ids",
        {
            review_id: reviewID,
            game_id: gameID,
            user_id: userID
        },
        function (data, status) {
            if (data == "failure") {
                console.log("Nope");
            } else {
                console.log("Yup");
            }
        });
}

function postRating(gameID, rating) {
    //  Post review IDs to games and users.
    $.post(GlobalURL + "/games/rating",
        {
            game_id: gameID,
            rating: rating
        },
        function (data) {
            if (!data) {
                console.log("There was an error adding the rating for that game.");
            } else {
                console.log("Rating added successfully.");
            }
        });
}

function requestGame() {
    window.location.href = '/UserGameRequestPage';
}

