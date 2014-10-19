var socket = io();

var q = getUrlVars()["q"];
var zip = getUrlVars()["zip"];

var lat = 0.0;
var lng = 0.0;

socket.emit("search", q, zip);
socket.emit("geocode", zip);

socket.on('location', function(la, ln) {
  lat = la;
  lng = ln;
});

socket.on('results', function(products) {
  for (var i = 0; i < products.length; i++) {
    $('#products').append("<li class='product'><div onclick='emit_product(\"" + products[i].name + "\");'><img src='" + products[i].image + "'><p>" + products[i].name + "</p></div></li>");
    $("#loading").css("display", "none");
  }
});

socket.on('stores', function(stores) {
  function initialize() {
    var mapOptions = {
      center: { lat: lat, lng: lng },
      zoom: 12,
      styles: blue_gray
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    for (var i = 0; i < stores.length; i++) {
      var marker = new google.maps.Marker({
        position: { lat: stores[i].lat, lng: stores[i].lng },
        map: map,
        title: String(stores[i].name)
      });
    }
  }
  initialize();
});

function emit_product(name) {
  socket.emit('product', name);
  $("html, body").animate({ scrollTop: 0 }, "slow");
  $(".map").css("display", "block");
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
  function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

var blue_gray = [{
  "featureType": "water",
  "stylers": [{
    "visibility": "on"
  }, {
    "color": "#b5cbe4"
  }]
}, {
  "featureType": "landscape",
  "stylers": [{
    "color": "#efefef"
  }]
}, {
  "featureType": "road.highway",
  "elementType": "geometry",
  "stylers": [{
    "color": "#83a5b0"
  }]
}, {
  "featureType": "road.arterial",
  "elementType": "geometry",
  "stylers": [{
    "color": "#bdcdd3"
  }]
}, {
  "featureType": "road.local",
  "elementType": "geometry",
  "stylers": [{
    "color": "#ffffff"
  }]
}, {
  "featureType": "poi.park",
  "elementType": "geometry",
  "stylers": [{
    "color": "#e3eed3"
  }]
}, {
  "featureType": "administrative",
  "stylers": [{
    "visibility": "on"
  }, {
    "lightness": 33
  }]
}, {
  "featureType": "road"
}, {
  "featureType": "poi.park",
  "elementType": "labels",
  "stylers": [{
    "visibility": "on"
  }, {
    "lightness": 20
  }]
}, {}, {
  "featureType": "road",
  "stylers": [{
    "lightness": 20
  }]
}];
