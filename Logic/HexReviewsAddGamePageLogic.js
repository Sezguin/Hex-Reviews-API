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
});

function addGame() {
    console.log("Add game button has been clicked.");

    var gameTitle   = $('#game_title').val();
    var gameDesc    = $('#game_description').val();
    var gameDev     = $('#game_developer').val();
    var gamePub     = $('#game_publisher').val();
    var gameRelease = $('#game_release_date').val();
    var gameOnline  = null;
    var gameLaunch  = $('#game_launch_price').val();

    if($('#onlineCheckbox').prop("checked") == true) {
        gameOnline = true;
    } else if($('#onlineCheckbox').prop("checked") == false) {
        gameOnline = false;
    }

    //  Post collected information to API.
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
        game_launch_price: gameLaunch
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





