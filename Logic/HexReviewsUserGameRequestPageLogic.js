//  Globally get cookies.
var cookies = getCookies();


$(document).ready(function () {
    $('#addRequestButton').click(function () {
        $('#addRequestModal').modal("show");
    });

    $('#successfulModalCloseButton').click(function () {
        location.reload();
    });

    getRequestList();

    //  Hide certain elements on page load.
    document.getElementById("successIcon").style.display = 'none';
    document.getElementById("failureIcon").style.display = 'none';
    document.getElementById("successfulModalCloseButton").style.display = 'none';
    document.getElementById("successfulModalCloseButtonError").style.display = 'none';
});

//  Fetch the list of reviews by the user.
function getRequestList() {
    $.ajax({
        url: GlobalURL + '/requests/' + cookies.user_id,
        type: 'GET',
        success: function (data) {

            if (!data) {
                console.log("No requests found.");
                document.getElementById("openRequestList").innerHTML = "None!";
                document.getElementById("closedRequestList").innerHTML = "None!";
                document.getElementById("rejectedRequestList").innerHTML = "None!";
            } else {
                data.forEach(element => {
                    addListItem(element);
                });
            }
        }
    });
}

function addListItem(request) {

    var resultsContainer;

    if (request.request_state == "OPEN") {
        resultsContainer = document.getElementById("openRequestList");

    } else if (request.request_state == "COMPLETE") {
        resultsContainer = document.getElementById("closedRequestList");

    } else if (request.request_state == "REJECTED") {
        resultsContainer = document.getElementById("rejectedRequestList");

    } else {
        console.log("No state!");
    }

    //  Main list item button.
    var listItem = document.createElement("a");

    if (request.request_state == "COMPLETE") {
        listItem.className = "list-group-item list-group-item-action flex-column align-items-start complete";

    } else if (request.request_state == "REJECTED") {
        listItem.className = "list-group-item list-group-item-action flex-column align-items-start reject";

    } else {
        listItem.className = "list-group-item list-group-item-action flex-column align-items-start";
    }

    //  Title text div.
    var titleTextDiv = document.createElement("div");
    titleTextDiv.className = "d-flex w-100 justify-content-between";

    //  Title text heading.
    var titleText = document.createElement("h5");
    titleText.className = "mb-1";
    titleText.textContent = request.request_game_title;

    //  Decription text.
    var descriptionText = document.createElement("p");
    descriptionText.className = "mb-1";
    if(request.request_state == "OPEN" || request.request_state == "COMPLETE") {
        if (request.request_game_info == "") {
            descriptionText.textContent = "No information provided.";
        } else {
            descriptionText.textContent = request.request_game_info;
        }
    } else {
        descriptionText.textContent = request.request_reject_reason;
    }

    //  Configure title text.
    titleTextDiv.appendChild(titleText);

    //  Configure game list item.
    listItem.appendChild(titleTextDiv);
    listItem.appendChild(descriptionText);

    //  Add item to results container.
    resultsContainer.appendChild(listItem);
}

function submitRequest() {
    $("#gameTitleInput").removeClass("bad");
    $("#gameTitleInput").removeClass("good");
    document.getElementById("gameTitleLabel").style.color = "black";

    var gameTitle = $('#gameTitleInput').val();
    var gameAdditionInfo = $('#additionInformationInput').val();

    console.log("Game Title: " + gameTitle + " Additional: " + gameAdditionInfo);

    if ($("#gameTitleInput").val() == "") {
        document.getElementById("gameTitleLabel").style.color = "red";
        document.getElementById("gameTitleLabel").innerHTML = "A game title is required...";

        $("#gameTitleInput").addClass("bad");
        $("#gameTitleInput").addClass("shake");
        setTimeout(resetInputFields, 900);
    } else {

        $('#successfulPostModal').modal("show");
        $('#addRequestModal').modal("hide");

        $.post(GlobalURL + "/requests/",
        {
            request_game_title: gameTitle,
            request_game_info: gameAdditionInfo,
            request_user_id: cookies.user_id,
        },
        function (data, status) {
            if (data) {
                $("#successModalTitle").text("Success!");
                $("#successfulPostModalSpinner").hide();
                document.getElementById("successIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButton").style.display = 'block';
            } else {
                $("#successModalTitle").text("Error :/");
                $("#successfulPostModalSpinner").hide();
                document.getElementById("failureIcon").style.display = 'block';
                document.getElementById("successfulModalCloseButton").style.display = 'block';
            }
        });
    }
}

function resetInputFields() {
    $("#gameTitleInput").removeClass("shake");
}