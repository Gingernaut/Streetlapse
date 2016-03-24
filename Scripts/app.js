$('.close-button').click(function(e) {
	e.preventDefault();
	$('#scrim').css("display","none");
	$('#panopresentation').css("display","none");

});

$('#Generate').click(function() {
	$('#scrim').css("display","block");
	$('#panopresentation').css("display","block");
})
