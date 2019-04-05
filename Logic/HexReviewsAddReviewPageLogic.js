$(document).ready(function() {
    $("#showChooseGameModal").click(function() {
        $("#chooseGameModal").modal("show");
    });

    $("#modalGameSearchButton").click(function() {
        getGameList();
    });
});

function getGameList() {
    var query = $('#gameSearchBox').val();

    console.log("Query to be searched: " + query);

    $.ajax({
        url: 'http://localhost:4500/games/search/' + query,
        type: 'GET',
        success: function(result) {
            console.log("Information from API: " + JSON.stringify(result));
        }
    });
}