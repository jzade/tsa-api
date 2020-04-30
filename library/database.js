import Airport from '..model/airport.js'
import { publicDecrypt } from 'crypto';

function AirportDB(sourcefilepath){

    //INNER VARIABLES
    var that = this;
    that.sourcefilepath = sourcefilepath;
    that.db = null;
    that.textIndex = null;

    //INITIALIZATION FUNCTION
    var init = function(){

        ///INIT THE POUCH DATABASE
        var PouchDB = require('pouchdb');
        that.db = new PouchDB('airport_database');

        //INIT THE FULL TEXT
        var TXI = require('txi');
        that.textIndex = Txi();


        var fs = require('fs');
        var path = require('path');
      
        // Load Airport Data
        var BUFFER = bufferFile(sourcefile);
      
        function bufferFile(relPath) {
            return fs.readFileSync(path.join(__dirname, relPath)); 
          }

        var AirportsDecodedObj = JSON.parse(BUFFER.text);
        var AirDataArray = AirportsDecoded.responsePayload;       
        
        //IF IS NOT NULL AND IS ARRAY --TODO
        if(AirDataArray != null)
            AirDataArray.forEach(loadAirport);

        function loadAirport(airport, index) {
            await that.db.put(airport);
            await that.textIndex.index(airport.code, airport);
        }
    };

    //FIND BY LATITUDE
    var findAirportByLatLong = function(latitude, longitude){
        return null;
    };

    //FIND BY 
    var findAirportByText = function(text){
        return null;
    };

    var findAirportByCode= function(code){
        return null;
    };


    //STARTUP
    init(sourcefilepath);

    //RETURN THE PUBLIC INTERFACE
    return {
        FindAirportByLatLong : findAirportByLatLong,
        FindAirportByText : findAirportByText,
        FindAirportByText : findAirportByText
    };


}