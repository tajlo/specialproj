
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
}

getLocation();





$scope.clickMe = function(clickEvent){
   $scope.clickEvent = codeAddress(clickEvent), getUberdata(clickEvent) , getMetrodata(clickEvent)
}



var a 
var b 
var c
var d


var codeAddress = function() {
    var address1 = document.getElementById("start").value
    var address2 = document.getElementById("end").value
    var geocoder;
    var map;
  

    
    geocoder = new google.maps.Geocoder();
    
    var mapOptions = {
      zoom: 14,
    }
    map = new google.maps.Map(document.getElementById("google-map"), mapOptions);
  
    
    geocoder.geocode( { 'address': address1}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

      map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        
        a = marker.position['G']
        b = marker.position['K']

        

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });


    geocoder.geocode( { 'address': address2}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

          map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
           
            });
            c = marker.position['G']
            d = marker.position['K']

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }); 
      
}

      


var getUberdata = function(){
var uberReq = $http({
          method: 'GET',
          url: 'http://rubyline.herokuapp.com/fares/uber?lat1='+a+'&long1=' +b+ '&lat2=' +c+ '&long2='+ d, 
        
      })

  uberReq.then(
    function(data){
      $scope.ufares = data['data']['fares']
      console.log(data.data.fares)
    }
    )
}

var getMetrodata = function(){
var mtrReq = $http({
          method: 'GET',
          url: 'http://rubyline.herokuapp.com/fares/train?lat1='+a+'&long1=' +b+ '&lat2=' +c+ '&long2='+ d, 
        
      })

  mtrReq.then(
    function(data){
      $scope.mfares = data['data']['fares']
      console.log(data.data.fares)
    }
    )
}
      

});

 // controller to "get" nearest metro and bikeshare stations
app.controller("nearestStation", function($scope, $http, $interval){

     var latitude;
     var longitude;

      
        navigator.geolocation.getCurrentPosition(function(position){
            console.log("position", position)

            latitude = position.coords.latitude
            longitude = position.coords.longitude

            $interval(0, getMetroStation())
            $interval(0, getBikeStation())

        })
      
  

var bikeReq = {
     method: 'GET',
     url: 'http://rubyline.herokuapp.com/estimates/bike',   
    data: { 
      lat: latitude,
      long: longitude
    }
}

var metroReq ={
    method: 'GET',
    url: 'http://rubyline.herokuapp.com/estimates/train',
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

            $scope.metrostation = data.locations

            
         
              
          })
      }

      
      
      



})



