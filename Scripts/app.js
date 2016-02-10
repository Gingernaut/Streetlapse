function initialize() {
    /*Defining the origin of the map on start*/
    var mapstart = {
        center: new google.maps.LatLng(41.1613357, -97.8811623),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(mapstart);

    var map = new google.maps.Map(document.getElementById("NavigationalMap"),mapstart);

    /*Putting the controls on the map*/
    var search_controls = document.getElementById('controlpanel');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_controls);

    /*autocomplete*/
    var startbox = document.getElementById('search_start');
    var endbox = document.getElementById('search_end');

    var origin_autocomplete = new google.maps.places.Autocomplete(startbox);
    origin_autocomplete.bindTo('bounds', map);

    var destination_autocomplete = new google.maps.places.Autocomplete(endbox);
    destination_autocomplete.bindTo('bounds', map);

    var modes = document.getElementById('mode-selector');

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.

    function setupClickListener(id, mode) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
            travel_mode = mode;
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

        // If the place has a geometry, store its place ID and route if we have
        // the other place ID

        origin_place_id = place.place_id;

        route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);

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
        // If the place has a geometry, store its place ID and route if we have
        // the other place ID
        destination_place_id = place.place_id;
        route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay);

    });

    function route(origin_place_id, destination_place_id, travel_mode,
        directionsService, directionsDisplay) {

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
            } 
            else {
                window.alert(
                    'Directions request failed due to ' +
                    status);
            }
        });
    }
};

google.maps.event.addDomListener(window, 'load', initialize);

// function initMap() {
//     var origin_place_id = null;
//     var destination_place_id = null;
//     var travel_mode = google.maps.TravelMode.WALKING;
//     var map = new google.maps.Map(document.getElementById('map'), {
//         mapTypeControl: false,
//         center: {
//             lat: -33.8688,
//             lng: 151.2195
//         },
//         zoom: 13
//     });
//     var directionsService = new google.maps.DirectionsService;
//     var directionsDisplay = new google.maps.DirectionsRenderer;


//     directionsDisplay.setMap(map);

//     var origin_input = document.getElementById('origin-input');
//     var destination_input = document.getElementById('destination-input');

//     var modes = document.getElementById('mode-selector');


//     // Sets a listener on a radio button to change the filter type on Places
//     // Autocomplete.
//     function setupClickListener(id, mode) {
//         var radioButton = document.getElementById(id);
//         radioButton.addEventListener('click', function() {
//             travel_mode = mode;
//         });
//     }
//     setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
//     setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

//     function expandViewportToFitPlace(map, place) {
//         if (place.geometry.viewport) {
//             map.fitBounds(place.geometry.viewport);
//         } else {
//             map.setCenter(place.geometry.location);
//             map.setZoom(17);
//         }
//     }
//     origin_autocomplete.addListener('place_changed', function() {
//         var place = origin_autocomplete.getPlace();
//         if (!place.geometry) {
//             window.alert(
//                 "Autocomplete's returned place contains no geometry"
//             );
//             return;
//         }
//         expandViewportToFitPlace(map, place);
//         // If the place has a geometry, store its place ID and route if we have
//         // the other place ID
//         origin_place_id = place.place_id;
//         route(origin_place_id, destination_place_id, travel_mode,
//             directionsService, directionsDisplay);
//     });
//     destination_autocomplete.addListener('place_changed', function() {
//         var place = destination_autocomplete.getPlace();
//         if (!place.geometry) {
//             window.alert(
//                 "Autocomplete's returned place contains no geometry"
//             );
//             return;
//         }
//         expandViewportToFitPlace(map, place);
//         // If the place has a geometry, store its place ID and route if we have
//         // the other place ID
//         destination_place_id = place.place_id;
//         route(origin_place_id, destination_place_id, travel_mode,
//             directionsService, directionsDisplay);
//     });

//     function route(origin_place_id, destination_place_id, travel_mode,
//         directionsService, directionsDisplay) {
//         if (!origin_place_id || !destination_place_id) {
//             return;
//         }
//         directionsService.route({
//             origin: {
//                 'placeId': origin_place_id
//             },
//             destination: {
//                 'placeId': destination_place_id
//             },
//             travelMode: travel_mode
//         }, function(response, status) {
//             if (status === google.maps.DirectionsStatus.OK) {
//                 directionsDisplay.setDirections(response);
//             } else {
//                 window.alert(
//                     'Directions request failed due to ' +
//                     status);
//             }
//         });
//     }
// }