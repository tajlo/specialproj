
var latitude;
var longitude;

var getLocation = function(){
	navigator.geolocation.getCurrentPosition(function(position){
			console.log("position", position)

			latitude = position.coords.latitude
			longitude = position.coords.longitude

		getMetro(displayMetro);	
		getBike(displayBike);
	})
}


//get current geolocation 
var getMetro = function(callback){
 $.ajax({
    url: "http://343b716f.ngrok.com/rail/"+latitude + "/"+longitude,
    method: "GET",
    success: displayMetro
    })
}

var getBike = function(callback){

  $.ajax({
    url: "http://343b716f.ngrok.com/bike/"+latitude +"/"+longitude,
    method: "GET",
    success:  displayBike
  })

}

var displayMetro = function(data){
    console.log(data)
    $("#stat-title").text("")
	var templateFunction = Handlebars.compile( $("#left").html() )
	  	_.each(data, function(station){
            console.log(station)
			$("#stat-title").append(templateFunction(station))
		})
    
    }


var displayBike = function(data){
	$("#bike-title").text("")
	 var templateFunction = Handlebars.compile( $("#right").html() )
	 _.each(data, function(station){
  		$("#bike-title").append( templateFunction(station))
    	})

    }

var timeouts = {}
$(document).on("ready", function() {
	
	getMetro();
    getBike();
 

   var update = function(){
       getMetro()
       getBike()
       
   
   }
       
       setInterval(update, 60000);






})


