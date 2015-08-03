
var app = angular.module("RubyLineApp", [])


// controller for google maps locator with markers & fare estimates 
app.controller("fareEstimator", function($scope, $http){
   
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
   number: [2, 3 , 4, 5 ,6 , 7, 8 , 9, 10, 11 , 12]
}

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
  
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();
    codeAddress()

    directionsDisplay = new google.maps.DirectionsRenderer();
    var dc = new google.maps.LatLng(38.9047,-77.0164);
    var mapOptions = {
      zoom: 14,
      center: dc
    }
    map = new google.maps.Map(document.getElementById("google-map"), mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directions"));

          var request = {
            origin:$scope.address.address1,
            destination:$scope.address.address2,
            travelMode: google.maps.TravelMode.WALKING
          };
          directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(response);
                
                getUberdata()
                getMetrodata()
            }
          });
}

var getUberdata = function(){

var peeps = document.getElementById("people").value
var uberReq = $http({
          method: 'GET',
          url: 'http://rubyline.herokuapp.com/fares/uber?lat1='+a+ '&long1=' +b+ '&lat2=' + c + '&long2=' +d+ '&riders=' + peeps , 
      })

  uberReq.then(
    function(data){
      $scope.ufares = data['data']['fares']

      console.log(data.data.fares)
     


    }
    )
}

var getMetrodata = function(){
  var peeps = document.getElementById("people").value
  var mtrReq = $http({
            method: 'GET',
            url: 'http://rubyline.herokuapp.com/fares/train?lat1='+a+'&long1=' +b+ '&lat2=' +c+ '&long2='+d+ '&riders=' + peeps, 
          
        })

  mtrReq.then(
    function(data){
      $scope.mfares = data['data']['fares']

      console.log(data.data.fares)
    })

  
  var metroReq = {
      method: 'GET',
      url: 'http://rubyline.herokuapp.com/estimates/train?lat='+a+'&long='+b ,
     
      
  }

  $http(metroReq)
  .then(
    function(data){
      $scope.metrostation = data.data.locations[0]
      console.log(data.data.locations)
})
  

}
  

});



 // controller to "get" nearest metro and bikeshare stations
/*app.controller("nearestStation", function($scope, $http, $interval){

     var latitude;
     var longitude;

        navigator.geolocation.getCurrentPosition(function(position){
            console.log("position", position)

            latitude = position.coords.latitude
            longitude = position.coords.longitude


         $interval(60000, getMetroStation(latitude, longitude))
         $interval(60000, getBikeStation(latitude, longitude))
        })
      
  
      var getBikeStation = function() {
         var bikeReq = {
             method: 'GET',
             url: 'http://rubyline.herokuapp.com/estimates/bike?',
             data:{
              lat: latitude,
              long: longitude
             }   
            
        }

         $http(bikeReq)
          .success(
          function(data){

            $scope.bikestation = []
            

            $scope.bikestation = data.locations
            console.log($scope.bikestation)

          }
        )
       }

      

      var getMetroStation = function(){
        var metroReq = {
            method: 'GET',
            url: 'http://rubyline.herokuapp.com/estimates/train?',
            data: {
              lat: latitude,
              long: longitude
            }
            
        }

        $http(metroReq)
        .success(
          function(data){
            $scope.metrostation = data.locations
      }
    )
    }

         
      
      



})
*/


