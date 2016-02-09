function initialize() {

    /*Defining the origin of the map on start*/
    var mapstart = {
        center: new google.maps.LatLng(41.1613357, -97.8811623),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };

    var map = new google.maps.Map(document.getElementById("NavigationalMap"),mapstart);

    /*Seems to break the code beneath it, for some reason is not necessary*/
    //directionsDisplay.setMap(map);


    /*Putting the controls on the map*/
    var search_controls = document.getElementById('controlpanel');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_controls);

    /*Biasing the results to events near the user's selected map*/
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    /*autocomplete*/
    var startbox = document.getElementById('search_start');
    var endbox = document.getElementById('search_end');

    var autocomplete_startbox = new google.maps.places.Autocomplete(startbox);
    var autocomplete_endbox = new google.maps.places.Autocomplete(endbox);

}

google.maps.event.addDomListener(window, 'load', initialize);