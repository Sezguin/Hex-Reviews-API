$(document).ready(function() {
    $("#goToViewGamesPageButton").click(function() {
        window.location.href = "/ViewGamesPage"
    });

    $("#goToAddGamePageButton").click(function() {
        window.location.href = "/AddGamePage"
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
}
