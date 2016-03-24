
var directionsService = new google.maps.DirectionsService();

function streetlapse(startlat, startlong, endlat, endlong) {

    hyper = {
        startlat,
        startlong,
        endlat,
        endlong
    };

    hyperlapse = new Hyperlapse(document.getElementById('pano'), {
        lookat: hyper.start,
        width: 925,
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

    $("#play").click(function(e) {
        hyperlapse.play();
    });

    $("#stop").click(function(e) {
        hyperlapse.pause();
    });

    $("#next").click(function(e) {
        hyperlapse.next();
    });

    $("#load").click(function() {
        calcRoute();
    });

}

function calcRoute() {
    console.log('calc route started');

    request = {
        origin: new google.maps.LatLng(hyper.startlat, hyper.startlong),
        destination: new google.maps.LatLng(hyper.endlat, hyper.endlong),
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    console.log(hyper)

    directionsService.route(request, function(response, status) {
        console.log('direction service entered');
        if (status == google.maps.DirectionsStatus.OK) {
            // directionsDisplay.setDirections(response);
            console.log('status is good!!')
            hyperlapse.generate({
                route: response
            });
        } else {
            console.log(status);
            console.log("Agh!!!");
        }
    })
}