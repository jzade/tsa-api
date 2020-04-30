// import Airport from '..model/airport.js'
// import { publicDecrypt } from 'crypto';

exports.AirportDB = (sourcefilepath) => {

    //INNER VARIABLES
    var that = this;
    that.sourcefilepath = sourcefilepath;
    that.db = null;
    that.textIndex = null;

    //INITIALIZATION FUNCTION
    var init = function(){

        ///INIT THE POUCH DATABASE - jank code :P
        var PouchDB = require('pouchdb')
        that.db = new PouchDB('airport_database')

        that.db.destroy()
        
        that.db = new PouchDB('airport_database')

        //INIT THE FULL TEXT
        const txi = require('txi')
        
        that.textIndex = txi()

        var fs = require('fs')
        var path = require('path')
      
        // Load Airport Data
        var BUFFER = bufferFile(that.sourcefilepath)
      
        function bufferFile(relPath) {
            return fs.readFileSync((relPath));
          }

        var AirportsDecodedObj = JSON.parse(BUFFER)
        var AirDataArray = AirportsDecodedObj.responsePayload;       
        
        //IF IS NOT NULL AND IS ARRAY --TODO
        if(AirDataArray != null)
            AirDataArray.forEach(loadAirport)

        function loadAirport(airport, index) {
     
            airport._id = airport.code + index
          //  console.log(airport)
           // console.log(that.db)
            that.db.put(airport).then()
            .catch(err => console.log(err))
             that.textIndex.index(airport.code, airport).catch(err => console.log(err))
        }
    }

    //FIND BY LATITUDE
    var findAirportByLatLong = function(latitude, longitude){
        return null;
    }

    //FIND BY 
    var findAirportByText = function(text){
        return null;
    }

    var findAirportByCode= function(code){
        return null;
    }


    //STARTUP
    init(sourcefilepath);

    //RETURN THE PUBLIC INTERFACE
    return {
        FindAirportByLatLong : findAirportByLatLong,
        FindAirportByText : findAirportByText,
        FindAirportByText : findAirportByText
    };


}