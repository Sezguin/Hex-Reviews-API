//  Globally grab cookies.
var cookies = getCookies();

$(document).ready(function() {

    $("#adminViewGamesButton").click(function() {
        window.location.href = "/ViewGamesPage";
    });

    $("#adminAddGameButton").click(function() {
        window.location.href = "/AddGamePage";
    });

    $("#adminGameRequests").click(function() {
        window.location.href = "/AdminRequestPage";
    });

    $("#userWelcome").text("Welcome, " + cookies.username);

    //  Grab user's avatar.
    collectAvatar();

    getOpenRequests(displayRequests);

});

function collectAvatar() {
    var output = document.getElementById("userAvatar");

    $.ajax({
        url: GlobalURL + '/images/avatar/' + cookies.username,
        type: 'GET',
        success: function(data) {
            if(data != "") {
                output.src = data;
            } else {
                output.src = "/Images/DefaultAvatar.jpg";
            }        
        }
    });
}

function getOpenRequests(callback) {
    var amount = 0;
    $.ajax({
        url: GlobalURL + '/requests/',
        type: 'GET',
        success: function (data) {

            if (!data) {
                console.log("No requests found.");
            } else {
                data.forEach(element => {
                    if(element.request_state == "OPEN") {
                        amount = amount + 1;
                    }
                    displayRequests(amount);
                
                });
            }
        }
    });
}

function displayRequests(amount) {
    $("#adminOpenRequests").text("Open Requests: ");
    $("#adminOpenRequests").append(amount);
}