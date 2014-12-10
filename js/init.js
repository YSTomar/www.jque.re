

$(document).ready(function () {

    $("#container").css("height", $(window).height());
    $(window).resize(function () {
        $("#container").css("height", $(window).height())
    });
    $("#receiver").css("width", $(window).width() - 400);
    $(window).resize(function () {
        $("#receiver").css("width", $(window).width() - 400)
    });

    $('details').details();
})