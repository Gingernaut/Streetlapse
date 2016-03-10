var rendererOptions = {
  draggable: true
};

var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {


	

	hyper = {
			'start' : origin_place_id,
			'end'   : destination_place_id
			};	

			hyperlapse = new Hyperlapse(document.getElementById('pano'), { 
				lookat: hyper.start,
				width:925,
				zoom: 1,
				use_lookat: false,
				elevation: 20
			});
			hyperlapse.onError = function(e) { 
				console.log(e);
			};
			hyperlapse.onRouteComplete = function(e) {
				hyperlapse.load();
			};
			hyperlapse.onLoadComplete = function(e) {		
				hyperlapse.next();
			};		
			$( "#play" ).click(function(e) {
					hyperlapse.play();
				});
			$( "#stop" ).click(function(e) {
					hyperlapse.pause();
				});
			$( "#next" ).click(function(e) {
					hyperlapse.next();
				});
			$( "#load" ).click(function() {	
				calcRoute();
			});

  var mapOptions = {
	zoom: 15,
	center: new google.maps.LatLng(39.98320375131727, -75.15682697296143)
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));
  
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {

	google.maps.event.addListener(searchBox, 'places_changed', function () {
		var markers = [];
        var places = searchBox.getPlaces();
        for (var i = 0, marker; marker = markers[i]; i++) {
            marker.setMap(null);
        }
        markers = [];
        var bounds = new google.maps.LatLngBounds();

		var legs = directionsDisplay.getDirections().routes[0].legs[0];
		hyper.start = new google.maps.LatLng(places[0].geometry.location.H, places[0].geometry.location.L);//legs.start_location.H, legs.start_location.L);
		console.log(places[0].geometry.location)
		hyper.end = new google.maps.LatLng(legs.end_location.H, legs.end_location.L);
		calcRoute();
    });

	
  });
}

function calcRoute() {
	request = {
		origin: hyper.start, 
		destination: hyper.end, 
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) { 
			directionsDisplay.setDirections(response);
			hyperlapse.generate({route: response});
		} else {
			console.log(status);
		}					
	})	

}
google.maps.event.addDomListener(window, 'load', initialize);