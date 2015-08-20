
var app = angular.module("RubyLineApp", [])


// controller for google maps locator with markers & fare estimates 
app.controller("fareEstimator", function($scope, $http, $interval){
  


var styles = [
    {"featureType":"administrative.land_parcel",
     "elementType":"all",
     "stylers":[
        {"visibility":"off"}
        ]
    },
    {"featureType":"landscape.man_made",
     "elementType":"all",
     "stylers":[
        {"visibility":"off"}
        ]
      },
    {"featureType":"poi",
     "elementType":"labels",
     "stylers":[
        {"visibility":"off"}
        ]
      },
    {"featureType":"road",
     "elementType":"labels",
     "stylers":[
       {"visibility":"simplified"},
       {"lightness":20}
       ]
     },
     {"featureType":"road.highway",
     "elementType":"geometry",
     "stylers":[
       {"hue":"#f49935"}
     ]
   },
   {"featureType":"road.highway",
    "elementType":"labels",
    "stylers":[
      {"visibility":"simplified"}
      ]
    },
    {"featureType":"road.arterial",
     "elementType":"geometry",
     "stylers":[
      {"hue":"#fad959"}
      ]
    },
    {"featureType":"road.arterial",
     "elementType":"labels",
     "stylers":[
        {"visibility":"off"}
      ]
    },
    {"featureType":"road.local",
    "elementType":"geometry",
    "stylers":[
      {"visibility":"simplified"}
     ]
    },
    {"featureType":"road.local",
     "elementType":"labels",
     "stylers":[
        {"visibility":"simplified"}
      ]
    },
    {"featureType":"transit",
     "elementType":"all",
     "stylers":[
        {"visibility":"off"}
      ]
    },
    {"featureType":"water",
     "elementType":"all",
     "stylers":[
        {"hue":"#a1cdfc"},
        {"saturation":30},
        {"lightness":49}
      ]
    }
  ];

  

   
var getLocation = function(){
  var latitude;
  var longitude;
  var styledMap = new google.maps.StyledMapType(styles,
      {name: "Styled Map"});

    navigator.geolocation.getCurrentPosition(function(position){
                    console.log("position", position)
                    latitude = position.coords.latitude
                    longitude = position.coords.longitude

          var myLatlng = new google.maps.LatLng(latitude  , longitude);

          var mapOptions = {
            zoom: 8,
            center: myLatlng,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
          }

           var map = new google.maps.Map(document.getElementById("google-map"), mapOptions); 
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style'); 
         
          }) 
}();



$scope.address = {
    address1: '',
    address2: ''
}

$scope.people = {
   number: [1, 2, 3 , 4, 5 ,6 , 7, 8 , 9, 10, 11 , 12]
}

$scope.showing = false
$scope.clicked = false
$scope.viewType = 'none'


var a 
var b 
var c
var d
var map;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
  
var codeAddress = function() {
 

    var mapOptions = {
      zoom: 14,
      
    }
  var geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(document.getElementById("google-map"), mapOptions);

    geocoder.geocode( { 'address': $scope.address.address1}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        a = results[0].geometry.location['G']
        b = results[0].geometry.location['K']

        

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });


    geocoder.geocode( { 'address': $scope.address.address2}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

            c = results[0].geometry.location['G']
            d = results[0].geometry.location['K']


      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }); 

      
}


  $scope.calcRoute = function() {
      $scope.peeps = document.getElementById('people').value 
     
       var styledMap = new google.maps.StyledMapType(styles,
      {name: "Styled Map"});
      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();
        codeAddress()

        directionsDisplay = new google.maps.DirectionsRenderer();
        var dc = new google.maps.LatLng(38.9047,-77.0164);
        var mapOptions = {
          zoom: 14,
          center: dc,
          mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        }
        map = new google.maps.Map(document.getElementById("google-map"), mapOptions);
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style'); 
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById("walking-direct"));

              var request1 = {
                origin:$scope.address.address1,
                destination:$scope.address.address2,
                travelMode: google.maps.TravelMode.WALKING
              };

              var request2 = {
                origin:$scope.address.address1,
                destination:$scope.address.address2,
                travelMode: google.maps.TravelMode.BICYCLING
              };

              directionsService.route(request2, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) { 
                  console.log(response.routes[0])
                 $scope.bikeduration = response.routes[0].legs[0].duration.text
             
                }
              });

              directionsService.route(request1, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) { 
                  directionsDisplay.setDirections(response);
                  console.log(response.routes[0])
                 $scope.duration = response.routes[0].legs[0].duration.text
                 
                    $interval(60000, getMetrodata())
                    $interval(60000, getUberdata()) 
             
                }
              });
    }

  var getUberdata = function(){
    
      var peeps = document.getElementById("people").value
      var uberReq = $http.get('http://rubyline.herokuapp.com/fares/uber?lat1='+a+ '&long1=' +b+ '&lat2=' + c + '&long2=' +d+ '&riders=' + peeps)
              

        uberReq.then(
          function(data){ 
            $scope.ufares = data['data']['fares']
            console.log(data.data.fares)
          })
        .finally(function () {
           $scope.loading = false;
           $scope.showing = true;
        });

        var bikeReq = $http.get('http://rubyline.herokuapp.com/estimates/bike?lat='+a+'&long='+b)
           
          bikeReq.then(
            function(data){

      
                $scope.bikestation = data.data.locations
                console.log(data.data.locations)

          }).finally(function () {
            $scope.loading = false;
          });  


  }

  var getMetrodata = function(){
    
    var peeps = document.getElementById("people").value
   var mtrReq = $http.get('http://rubyline.herokuapp.com/fares/train?lat1='+a+'&long1=' +b+ '&lat2=' +c+ '&long2='+d+ '&riders=' + peeps) 
            

    mtrReq.then(
      function(data){
        
        $scope.mfares = data['data']['fares']
        $scope.mfares[0].total_fare = (data.data.fares[0].total_fare).toFixed(2)
        console.log(data.data.fares)

      }).finally(function () {
        $scope.loading = false;
      });

    
   var metroReq = $http.get('http://rubyline.herokuapp.com/estimates/train?lat='+a+'&long='+b)
     metroReq.then(
      function(data){
        $scope.metrostation = data.data.locations[0]
        console.log(data.data.locations)
     })
     .finally(function () {
      $scope.loading = false;
    });  
  }
  
   

});






