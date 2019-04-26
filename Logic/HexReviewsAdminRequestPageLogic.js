var rejectID;

$(document).ready(function () {
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

function completeRequest(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;

    $.post(GlobalURL + "/requests/complete",
    {
        request_id: id
    },
    function (data) {
        if (data) {
            getRequestList();
        } else {
            alert("There was an error.");
        }
    });
}

function rejectModal(button) {
    id = button.parentNode.parentNode.childNodes[0].innerHTML;

    rejectID = id;

    $('#rejectRequestModal').modal("show");
}

function rejectRequest() {

    var rejectReason = $('#rejectReason').val();

    $.post(GlobalURL + "/requests/reject",
    {
        request_id: rejectID,
        rejection_reason: rejectReason
    },
    function (data) {
        if (data) {
            $('#rejectRequestModal').modal("hide");
            getRequestList();
        } else {
            alert("There was an error.");
        }
    });
}

function getRequestList() {

    document.getElementById("openRequestList").innerHTML = "";
    document.getElementById("closedRequestList").innerHTML = "";
    document.getElementById("rejectedRequestList").innerHTML = "";

    $.ajax({
        url: GlobalURL + '/requests/',
        type: 'GET',
        success: function (data) {

            if (!data) {
                console.log("No requests found.");
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

    var requestIdElement = document.createElement("p");
    requestIdElement.id = "requestIdElement";
    requestIdElement.textContent = request._id;
    requestIdElement.setAttribute("hidden", true);

    var textDiv = document.createElement("div");
    textDiv.id = "textDiv";

    var buttonDiv = document.createElement("div");
    buttonDiv.id = "buttonDiv";

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


    //  Complete request button.
    var completeButton = document.createElement("button");
    completeButton.className = "btn hexButtons";
    completeButton.textContent = "Complete";
    completeButton.id = "completeButton";
    completeButton.setAttribute("onclick", "completeRequest(this)");

    //  Reject request button.
    var rejectButton = document.createElement("button");
    rejectButton.className = "btn btn-danger";
    rejectButton.textContent = "Reject";
    rejectButton.id = "rejectButton";
    rejectButton.setAttribute("onclick", "rejectModal(this)");

    //  Configure title text.
    titleTextDiv.appendChild(titleText);

    textDiv.appendChild(titleTextDiv);
    textDiv.appendChild(descriptionText);

    
    buttonDiv.appendChild(completeButton);
    buttonDiv.appendChild(rejectButton);

    //  Configure game list item.
    listItem.appendChild(requestIdElement);
    listItem.appendChild(textDiv);
    if(request.request_state == "OPEN") {
        listItem.appendChild(buttonDiv);
    }


    //  Add item to results container.
    resultsContainer.appendChild(listItem);
}

function solveRequest() {
    $("#gameTitleInput").removeClass("bad");
    $("#gameTitleInput").removeClass("good");
    document.getElementById("gameTitleLabel").style.color = "black";

    var gameTitle = $('#gameTitleInput').val();
    var gameAdditionInfo = $('#additionInformationInput').val();

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