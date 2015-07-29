
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

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Hello World!'
            });    

            var latlng = new google.maps.LatLng(38.9061431, -77.0423197);

            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: 'Hello World!'
            });                
          }) 
}

getLocation();

var codeAddress = function() {
    var address1 = document.getElementById("start").value
    var address2 = document.getElementById("end").value
    var geocoder;
    var map;
    
    var latitude1
    var latitude2
    var longitude1
    var longitude2
    
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(38.9061431, -77.0423197);
    var mapOptions = {
      zoom: 8,
      center: latlng
    }
    map = new google.maps.Map(document.getElementById("google-map"), mapOptions);
  
    //var address2 = document.getElementById("end").value;
    geocoder.geocode( { 'address': address1}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

      map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });

        console.log(marker.position)
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }


var metroReq ={
    method: 'GET',
    url: 'http://1853ad1e.ngrok.com/fares',
    data: { 
      lat1: latitude1,
      long1: longitude2,
      lat2: latitude2,
      long2: longitude2 
    }
}

var getMetroEstimate = function() {
        $http(metroReq)
          .success(function(data){

            $scope.metroEstimate = []
            
          
            $scope.metroEstimate = data.estimates
            console.log($scope.bikestation)

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

        })
      
  

var bikeReq = {
     method: 'GET',
     url: 'http://1853ad1e.ngrok.com/estimates/bike',   
      data: { 
      lat: latitude,
      long: longitude

    }
}

var metroReq ={
    method: 'GET',
    url: 'http://1853ad1e.ngrok.com/estimates/train',
    data: { 
      lat: latitude,
      long: longitude
    }
}

      var getBikeStation = function() {
        $http(bikeReq)
          .success(function(data){

            $scope.bikestation = [
              {
              "name": $scope.name,
              "type": $scope.type,
              "bikes_avail": $scope.bikes_avail,
              "docks_avail":$scope.docks_avail
              }
            ]
            
          
            $scope.bikestation = data.locations
            console.log($scope.bikestation)


          })
        

      }

      var getMetroStation = function(){
        $http(metroReq)
          .success(function(data){

            $scope.metrostation =[
              {
                "name": $scope.name,
                "trains":[{
                  "destination": $scope.destination,
                  "line": $scope.line,
                  "minutes": $scope.minutes
                }]
              }

            ]

            $scope.metrostation = data.locations
           

            $scope.metrostation.forEach(function(index){
                console.log($scope.metrostation)
                $scope.metrostation[index]['trains'].forEach(function(){
                  console.log('hello')
                })
            })




          })
      }

      
      $interval(60000, getMetroStation())
      $interval(60000, getBikeStation())
      



})*/



