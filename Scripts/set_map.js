function initMap() {

    var origin_place_id = null;
    var destination_place_id = null;
    var travel_mode = google.maps.TravelMode.DRIVING;

    var map = new google.maps.Map(document.getElementById('NavigationalMap'), {
        center: new google.maps.LatLng(41.1613357, -97.8811623),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    });

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: false, //set to true when I can grab the pin's location and update the search bar
    });

    directionsDisplay.setMap(map);

    var origin_input = document.getElementById('search_start');
    var destination_input = document.getElementById('search_end');
    var modes = document.getElementById('mode-selector');

    var search_controls = document.getElementById('controlpanel');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_controls);

    var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
    origin_autocomplete.bindTo('bounds', map);

    var destination_autocomplete = new google.maps.places.Autocomplete(destination_input);
    destination_autocomplete.bindTo('bounds', map);

    function setupClickListener(id, mode) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
            travel_mode = mode;
            route(origin_place_id, destination_place_id,travel_mode, directionsService,directionsDisplay);
        });
    }

    setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
    setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

    function expandViewportToFitPlace(map, place) {
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }
    }

    origin_autocomplete.addListener('place_changed', function() {
        var place = origin_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert(
                "Autocomplete's returned place contains no geometry"
            );
            return;
        }
        expandViewportToFitPlace(map, place);
        origin_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode,directionsService, directionsDisplay);
    });

    destination_autocomplete.addListener('place_changed', function() {
        var place = destination_autocomplete.getPlace();
        if (!place.geometry) {
            window.alert(
                "Autocomplete's returned place contains no geometry"
            );
            return;
        }
        expandViewportToFitPlace(map, place);
        destination_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode,directionsService, directionsDisplay);
    });

    function route(origin_place_id, destination_place_id, travel_mode,directionsService, directionsDisplay) {
        if (!origin_place_id || !destination_place_id) {
            return;
        }

        directionsService.route({
            origin: {
                'placeId': origin_place_id
            },
            destination: {
                'placeId': destination_place_id
            },
            travelMode: travel_mode
        }, 


        function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);}
        });
    }
}

google.maps.event.addDomListener(window, 'load', initMap);


 $('#hide').click(function(){      // bind a click event to the div element...
    $("#mapwrapper").toggleClass('hidden');  // that toggles the 'hilite' class
  });

// function initialize() {

//     /*********    Defining the origin of the map on page load    *************/
//     var mapstart = {
//         center: new google.maps.LatLng(41.1613357, -97.8811623),
//         zoom: 4,
//         mapTypeId: google.maps.MapTypeId.ROADMAP,
//         disableDefaultUI: true
//     };

//     var directionsService = new google.maps.DirectionsService;
//     var directionsDisplay = new google.maps.DirectionsRenderer;
// 	var travel_mode = google.maps.TravelMode.DRIVING;

//     var map = new google.maps.Map(document.getElementById("NavigationalMap"),mapstart);

//     directionsDisplay.setMap(mapstart);

//     /*****************    Putting the controls on the map    *********/
//     var search_controls = document.getElementById('controlpanel');
//     map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_controls);

//     /*************************   autocomplete           *****************/
//     var startbox = document.getElementById('search_start');
//     var endbox = document.getElementById('search_end');

//     var origin_autocomplete = new google.maps.places.Autocomplete(startbox);
//     //origin_autocomplete.bindTo('bounds', map);

//     var destination_autocomplete = new google.maps.places.Autocomplete(endbox);
//     //destination_autocomplete.bindTo('bounds', map);

//     /************   Detecting when the input fields change      *********/
//     var start;
//     var destination;

// 	var onChangeHandler = function() {


// 	};

// 	function setupClickListener(id, mode) {
// 		var radioButton = document.getElementById(id);
// 		radioButton.addEventListener('click', function() {
// 			travel_mode = mode;
// 		});
// 	}

// 	document.getElementById('search_start').addEventListener('change', onChangeHandler);
// 	document.getElementById('search_end').addEventListener('change', onChangeHandler);

// 	setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
// 	setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);



// };

// function CalcRoute(directionsService, directionsDisplay) {

// }

// google.maps.event.addDomListener(window, 'load', initialize);









