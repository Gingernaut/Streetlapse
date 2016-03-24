function streetlapse(startlat, startlong, endlat, endlong, travel_mode) {

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
        $(".cs-loader").css("display","none");
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

    $("#Generate").click(function() {
        calcRoute(travel_mode);
    });

}

function calcRoute(travel_mode) {

    request = {
        origin: new google.maps.LatLng(hyper.startlat, hyper.startlong),
        destination: new google.maps.LatLng(hyper.endlat, hyper.endlong),
        travelMode: travel_mode
    };

    directionsService.route(request, function(response, status) {

        if (status == google.maps.DirectionsStatus.OK) {
            hyperlapse.generate({
                route: response
            });
        } else {
            console.log(status);
        }
    })
}