var gameGenres = [];
var gameAgeRatings = [];
var gamePlatforms = [];
var gameImageIds = [];


$(document).ready(function () {

    //  On change event to limit checkboxes.
    var limit = 6;
    var platformLimit = 10;

    //  For genres checkboxes.
    $('input.genresCheckbox').on('change', function (evt) {
        if ($('input[class=genresCheckbox]:checked').length >= limit) {
            this.checked = false;
        }
    });

    //  For game tags checkboxes.
    $('input.ageRatingCheckbox').on('change', function (evt) {
        if ($('input[class=ageRatingCheckbox]:checked').length >= limit) {
            this.checked = false;
        }
    });

    //  For platform checkboxes.
    $('input.platformCheckbox').on('change', function (evt) {
        if ($('input[class=platformCheckbox]:checked').length >= platformLimit) {
            this.checked = false;
        }
    });

    //  All form related buttons.
    $("#gameGenreButton").click(function () {
        $('#genreTagModal').modal("show");
    });

    $("#submitGenresButton").click(function () {
        submitGenres();
    });

    $("#gameAgeRatingButton").click(function () {
        $('#ageRatingTagModal').modal("show");
    });

    $("#submitAgeRatingsButton").click(function () {
        submitAgeRatings();
    });

    $("#gamePlatformsButton").click(function () {
        $('#platformTagModal').modal("show");
    });

    $("#submitPlatformsButton").click(function () {
        submitPlatforms();
    });

    //  All navigation related buttons.
    $("#addGameButton").click(function () {
        addGame();
    });

    $('#successfulModalCloseButton').click(function () {
        location.reload();
    });

    //  Hide certain elements on page load.
    document.getElementById("successIcon").style.display = 'none';
    document.getElementById("failureIcon").style.display = 'none';
    document.getElementById("successfulModalCloseButton").style.display = 'none';

});

//  Preview uploaded images.
$(function () {
    $("#imageUpload").change(function () {
        if (typeof (FileReader) != "undefined") {
            var dvPreview = $("#imagePreview");
            dvPreview.html("");

            //  Regular expression for ensuring files have corrent extensions.
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

            $($(this)[0].files).each(function () {
                var file = $(this);
                if (regex.test(file[0].name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = $("<img />");
                        img.attr("style", "width: 200px");
                        img.attr("src", e.target.result);
                        dvPreview.append(img);
                    }

                    reader.readAsDataURL(file[0]);
                } else {
                    alert(file[0].name + " is not a valid image file.");
                    dvPreview.html("");
                    return false;
                }
            });
        } else {
            alert("This browser does not support HTML5 FileReader.");
        }
    });
});

function addGame() {
    collectImages(postGame);
}

function postGame() {
    console.log("Game is being posted...");

    //  All game attributes from form.
    var gameTitle = $('#game_title').val();
    var gameDesc = $('#game_description').val();
    var gameDev = $('#game_developer').val();
    var gamePub = $('#game_publisher').val();
    var gameRelease = $('#game_release_date').val();
    var gameOnline = null;
    var gameLaunch = $('#game_launch_price').val();

    //  Check whether the online checkbox is selected.
    if ($('#onlineCheckbox').prop("checked") == true) {
        gameOnline = true;
    } else if ($('#onlineCheckbox').prop("checked") == false) {
        gameOnline = false;
    }

    $.post(GlobalURL + "/games/",
        {
            game_title: gameTitle,
            game_description: gameDesc,
            game_genre_tags: gameGenres,
            game_developer: gameDev,
            game_publisher: gamePub,
            game_master_rating: [],
            game_age_rating_tags: gameAgeRatings,
            game_release_date: gameRelease,
            game_platform_tags: gamePlatforms,
            game_online: gameOnline,
            game_launch_price: gameLaunch,
            game_images_id: gameImageIds
        },
        function (data, status) {
            if (data == "success") {
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

function collectImages(callback) {
    console.log("Images are being collected...");

    //  Reset the image ID array.
    gameImageIds = [];

    //  All game attributes from form.
    var gameTitle = $('#game_title').val();

    //  All image attributes from form.
    var imageInput = $('#imageUpload').get(0);

    $($(imageInput)[0].files).each(function () {
        var file = $(this);

        //  Regular expression for ensuring files have corrent extensions.
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

        if (regex.test(file[0].name.toLowerCase())) {
            var reader = new FileReader();
            reader.onload = function (event) {
                receivedText(event.target.result);
            }
        } 
        try {
            reader.readAsDataURL(file[0]);

        } catch (err) {
            console.log("No valid image provided.");
        }

    });

    function receivedText(imageData) {
        $.post(GlobalURL + "/images/game", {
            game_title: gameTitle,
            game_image_data: imageData
        },
            function (data, status) {
                console.log("Single image ID " + data);
                gameImageIds.push(data);
            });
    }

    //  Calling the callback function with a 2 second delay.
    $("#successfulPostModal").modal("show");
    window.setTimeout(callback, 2000);
}

function submitGenres() {
    gameGenres = [];

    badgeDiv = document.getElementById("genreBadges");
    badgeDiv.innerHTML = "";

    $('input[type=checkbox][class=genresCheckbox]').each(function () {
        if (this.checked) {
            elementValue = this.getAttribute("aria-label");
            gameGenres.push(elementValue);

            tempBadge = document.createElement("span");
            tempBadge.className = "badge badge-primary";
            tempBadge.textContent = elementValue;
            badgeDiv.appendChild(tempBadge);
        }
    });

    $('#genreTagModal').modal("hide");
}

function submitAgeRatings() {
    gameAgeRatings = [];

    badgeDiv = document.getElementById("ageRatingBadges");
    badgeDiv.innerHTML = "";

    $('input[type=checkbox][class=ageRatingCheckbox]').each(function () {
        if (this.checked) {
            elementValue = this.getAttribute("aria-label");
            gameAgeRatings.push(elementValue);

            tempBadge = document.createElement("span");
            tempBadge.className = "badge badge-primary";
            tempBadge.textContent = elementValue;
            badgeDiv.appendChild(tempBadge);
        }
    });

    $('#ageRatingTagModal').modal("hide");
}

function submitPlatforms() {
    gamePlatforms = [];

    badgeDiv = document.getElementById("platformBadges");
    badgeDiv.innerHTML = "";

    $('input[type=checkbox][class=platformCheckbox]').each(function () {
        if (this.checked) {
            elementValue = this.getAttribute("aria-label");
            gamePlatforms.push(elementValue);

            tempBadge = document.createElement("span");
            tempBadge.className = "badge badge-primary";
            tempBadge.textContent = elementValue;
            badgeDiv.appendChild(tempBadge);
        }
    });

    $('#platformTagModal').modal("hide");
}