var gameGenres      = [];
var gameAgeRatings  = [];
var gamePlatforms   = [];

$(document).ready(function() {

    //  All form related buttons.
    $("#gameGenreButton").click(function() {
        $('#genreTagModal').modal("show");
    });
   
    $("#submitGenresButton").click(function() {
        submitGenres();
    });

    $("#gameAgeRatingButton").click(function() {
        $('#ageRatingTagModal').modal("show");
    });

    $("#submitAgeRatingsButton").click(function() {
        submitAgeRatings();
    });

    $("#gamePlatformsButton").click(function() {
        $('#platformTagModal').modal("show");
    });

    $("#submitPlatformsButton").click(function() {
        submitPlatforms();
    });

    //  All navigation related buttons.
    $("#addGameButton").click(function() {
        addGame();
    });

    $("#viewImageButton").click(function() {
        getGameImage();
    });
});

//  Preview uploaded images.
$(function () {
    $("#imageUpload").change(function () {
        if (typeof (FileReader) != "undefined") {
            var dvPreview = $("#imagePreview");
            dvPreview.html("");

            //  Regular expression for ensuring files have corrent extensions.
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

            $($(this)[0].files).each(function() {
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

function getGameImage() {
    $.ajax({
        url: 'http://localhost:4500/images/game',
        type: 'GET',
        success: function(result) {
            console.log("Information from API: " + JSON.stringify(result.game_title));
            displayImage(result);
        }
    });
}

function displayImage(result) {
    console.log("000000 " + result.game_image);

    var output = document.getElementById("imageOutput");
        output.src = result.game_image;
}

function addGame() {
    console.log("Add game button has been clicked.");

    //  All game attributes from form.
    var gameTitle   = $('#game_title').val();
    var gameDesc    = $('#game_description').val();
    var gameDev     = $('#game_developer').val();
    var gamePub     = $('#game_publisher').val();
    var gameRelease = $('#game_release_date').val();
    var gameOnline  = null;
    var gameLaunch  = $('#game_launch_price').val();

    //  All image attributes from form.
    var imageInput  = $('#imageUpload').get(0);
    var imageArray  = [];

    //  Check whether the online checkbox is selected.
    if($('#onlineCheckbox').prop("checked") == true) {
        gameOnline = true;
    } else if($('#onlineCheckbox').prop("checked") == false) {
        gameOnline = false;
    }

    $($(imageInput)[0].files).each(function() {
        var file = $(this);
        var reader = new FileReader();

        reader.onload = function() {

            imageArray.push(reader.result);

            // console.log("---------------" + reader.result);

            console.log("The array is: " + imageArray);


        }
        reader.readAsDataURL(file[0]);
    });

    console.log("THe array outside is: " + imageArray);



    file = imageInput.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsDataURL(file);

    function receivedText() {
        $.post("http://localhost:4500/images/game", {
            game_title: gameTitle,
            game_image: fr.result
        },
        function(data, status) {
            alert("Data: " + data + "\nStatus: " + status);
        });
    }  

    $.post("http://localhost:4500/games/", 
    {   
        game_title: gameTitle,
        game_description: gameDesc,
        game_genre_tags: gameGenres,
        game_developer: gameDev,
        game_publisher: gamePub,
        game_age_rating_tags: gameAgeRatings,
        game_release_date: gameRelease,
        game_platform_tags: gamePlatforms,
        game_online: gameOnline,
        game_launch_price: gameLaunch,
    });
}

function submitGenres() {
    gameGenres = [];
    document.getElementById("game_genre_tags").value = null;
    

    if($('#actionCheckbox').prop("checked") == true) {
        gameGenres.push("Action");
        document.getElementById("game_genre_tags").value += "Action ";
    }
    if($('#adventureCheckbox').prop("checked") == true) {
        gameGenres.push("Adventure");
        document.getElementById("game_genre_tags").value += "Adventure ";
    }
    if($('#survivalCheckbox').prop("checked") == true) {
        gameGenres.push("Survival");
        document.getElementById("game_genre_tags").value += "Survival ";
    }
    if($('#horrorCheckbox').prop("checked") == true) {
        gameGenres.push("Horror");
        document.getElementById("game_genre_tags").value += "Horror ";
    }

    $('#genreTagModal').modal("hide");
}

function submitAgeRatings() {
    gameAgeRatings = [];
    document.getElementById("game_age_rating_tags").value = null;
    

    if($('#purchasesCheckbox').prop("checked") == true) {
        gameAgeRatings.push("Includes in-game purchases");
        document.getElementById("game_age_rating_tags").value += "Includes in-game purchases ";
    }
    if($('#gamblingCheckbox').prop("checked") == true) {
        gameAgeRatings.push("May encourage gambling");
        document.getElementById("game_age_rating_tags").value += "May encourage gambling ";
    }
    if($('#drugsCheckbox').prop("checked") == true) {
        gameAgeRatings.push("May be frightening to children");
        document.getElementById("game_age_rating_tags").value += "May be frightening to children ";
    }
    if($('#sexBox').prop("checked") == true) {
        gameAgeRatings.push("Nudity or sexual behaviour");
        document.getElementById("game_age_rating_tags").value += "Nudity or sexual behaviour ";
    }

    $('#ageRatingTagModal').modal("hide");
}

function submitPlatforms() {
    gamePlatforms = [];
    document.getElementById("game_platform_tags").value = null;
    

    if($('#pcCheckbox').prop("checked") == true) {
        gamePlatforms.push("PC");
        document.getElementById("game_platform_tags").value += "PC ";
    }
    if($('#xboxCheckbox').prop("checked") == true) {
        gamePlatforms.push("Xbox");
        document.getElementById("game_platform_tags").value += "Xbox ";
    }
    if($('#playstationCheckbox').prop("checked") == true) {
        gamePlatforms.push("PlayStation");
        document.getElementById("game_platform_tags").value += "PlayStation ";
    }
    if($('#switchCheckbox').prop("checked") == true) {
        gamePlatforms.push("Switch");
        document.getElementById("game_platform_tags").value += "Switch ";
    }

    $('#platformTagModal').modal("hide");
}

//  Conversion algorithm.
function hexToBase64(str) {
    return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}





