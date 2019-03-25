$(document).ready(function() {
    $("#viewGamesPageButton").click(function() {
        window.location.href = "/ViewGamesPage"
    });

    $("#goToAddGamePageButton").click(function() {
        window.location.href = "/AddGamePage"
    });

    $("#navHome").click(function() {
        window.location.href = "/AdminHomePage"
    });

    $("#navAddGame").click(function() {
        window.location.href = "/AddGamePage"
    });

    $("#navViewGames").click(function() {
        window.location.href = "/ViewGamesPage"
    });
});

function goToViewSingleGamePage(gameId) {
    window.location.href = "/ViewSingleGamePage?id=" + gameId
}

function deleteGame(button) {

    var id = button.parentNode.childNodes[0].innerHTML;
    var name = button.parentNode.childNodes[1].innerHTML;

    $.ajax({
        url: 'http://localhost:4500/games/' + id,
        type: 'DELETE',
        success: function(result) {
            console.log(name + " has successfully been removed from the database.");
            console.log("Information from API: " + result.message);
        }
    });

    window.location.href = "/ViewGamesPage"
}
