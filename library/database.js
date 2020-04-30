function AirportDB(sourcefilepath){

    var that = this;

    var init = function(){
        var fs = require('fs');
        var path = require('path');
      
        // Buffer mydata
        var BUFFER = bufferFile(sourcefile);
      
        function bufferFile(relPath) {
          return fs.readFileSync(path.join(__dirname, relPath)); 
        }
    };

    var findAirportByLatLong = function(latitude, longitude){
        return null;
    };

    var findAirportByText = function(text){
        return null;
    };

    return {
        FindAirportByLatLong : findAirportByLatLong,
        FindAirportByText : findAirportByText
    }


}