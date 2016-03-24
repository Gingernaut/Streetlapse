$('.close-button').click(function(e) {
    e.preventDefault();
    $('#scrim').css("display", "none");
    $('.modal').css("display", "none");
    $('#aboutme').css("display","none");
    window.location.reload();
});

$('#Generate').click(function() {
    $('#scrim').css("display", "block");
    $('#mapmodal').css("display", "block");
});


$('.svg-wrapper').click(function(e) {
	e.preventDefault();
    $('#scrim').css("display", "block");
    $('#aboutme').css("display","block");
});