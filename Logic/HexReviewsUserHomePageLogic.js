$(document).ready(function() {

    //  Grab session name from cookie.
    var username = readCookies("username");

    console.log("Cookie: " + username);

    $("#userWelcome").text("Welcome, " + username);

});