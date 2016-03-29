$('.close-button').click(function(e) {
    e.preventDefault();
    $('#scrim').css("display", "none");
    $('.modal').css("display", "none");
    $('#aboutme').css("display","none");
    window.location.reload();
});

$('#Generate').click(function() {
    $('#scrim').css("display", "inline-block");
    $('#mapmodal').css("display", "inline-block");
});


$('.svg-wrapper').click(function(e) {
	e.preventDefault();
    $('#scrim').css("display", "inline-block");
    $('#aboutme').css("display","inline-block");
});