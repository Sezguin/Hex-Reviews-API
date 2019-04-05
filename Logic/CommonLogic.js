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

    $("#navUserViewGames").click(function() {
        window.location.href = "/UserViewGamesPage"
    });

    $("#navViewGames").click(function() {
        window.location.href = "/ViewGamesPage"
    });

    $("#navLogin").click(function() {
        window.location.href = "/LoginPage"
    });

    $("#navCreateAccount").click(function() {
        window.location.href = "/CreateAccountPage"
    });

    $("#navTitle").click(function() {
        window.location.href = "/"
    });

    $("#navUserHome").click(function() {
        window.location.href = "/UserHomePage";
    });

    $("#navWriteReview").click(function() {
        window.location.href = "/UserReviewPage";
    });

    $("#navLogout").click(function() {
        logoutUser();
    });

    $("#createAccountButton").click(function() {
        window.location.href = "/CreateAccountPage"
    });

    $("#successfulModalCloseButton").click(function() {
        location.reload();
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

function logoutUser() {

    //  Forcefully expiring the cookie.
    document.cookie = "username= ; id= ;";

    //  Redirecting to title page.
    window.location.href = "/";
}


function readCookies(request) {

    //  Grab all cookie information.
    var cookieChunk = document.cookie;

    console.log("Cookie chunk: " + cookieChunk);
    
    //  Get each individual key value pair.
    cookieInformation = cookieChunk.split(';');
    
    //  Extract each element.
    for(var i=0; i < cookieInformation.length; i++) {
       name = cookieInformation[i].split('=')[0];
       value = cookieInformation[i].split('=')[1];

       if(request == "username" && name =="username") {
           console.log("Returning user session name of " + value + "...");

           return value;
       }
    }
}