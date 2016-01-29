function initialize() {

/*Defining the origin of the map on start*/
  var mapstart = {
    center:new google.maps.LatLng(41.1613357,-97.8811623),
    zoom:4,
    mapTypeId:google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
  };

var map=new google.maps.Map(document.getElementById("NavigationalMap"),mapstart);
//directionsDisplay.setMap(map);

/*grabbing the HTML elements, and positioning them on the map*/
var search_controls = document.getElementById('controlpanel');
var searchbox1 = document.getElementById('search_start');
var searchbox2 = document.getElementById('search_end');

map.controls[google.maps.ControlPosition.TOP_LEFT].push(search_controls);




/*autocomplete*/
var autocomplete_search1 = new google.maps.places.Autocomplete(searchbox1);
var autocomplete_search2 = new google.maps.places.Autocomplete(searchbox2);

/*Google maps directions*/
var directionsDisplay = new google.maps.DirectionsRenderer;
var directionsService = new google.maps.DirectionsService;

}


google.maps.event.addDomListener(window, 'load', initialize);



