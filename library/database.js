// import Airport from '..model/airport.js'
// import { publicDecrypt } from 'crypto';

exports.AirportDB = async (sourcefilepath) => {

    //INNER VARIABLES
    var that = this;
    that.sourcefilepath = sourcefilepath;
    that.db = null;
    that.textIndex = null;

    //INITIALIZATION FUNCTION
    that.init = async function () {

        var geoBuilder = require('./geo-builder.js')

        ///INIT THE POUCH DATABASE - jank code :P
        var PouchDB = require('pouchdb')
        PouchDB.plugin(require('pouchdb-find'));
        that.db = new PouchDB('airport_database')

        try {
            await that.db.destroy();
        } catch (err) {
            console.log(err);
        }

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
        if (AirDataArray != null) {
            var codes = [];
            for (x = 0; x < AirDataArray.length; x++) {
                await loadAirport(AirDataArray[x], x)
            }

        }

        async function loadAirport(airport, index) {

            airport._id = airport.code + index
            airport.geohash = geoBuilder.getGeohash(airport.latitude, airport.longitude)
            //console.log(airport)
            //console.log(that.db)
            try {
                await that.db.put(airport);
            } catch (err) {
                console.log(err);
            }

            try {
                await that.textIndex.index(airport.code, airport)
            } catch (err) {
                console.log(err);
            }

        }
    }

    //FIND BY LATITUDE
    that.findAirportByLatLong = async function (latitude, longitude) {
        var airports = [];
        try {
            airports = await that.db.find({
                selector: {
                    $and: [{
                        $and: [
                            { "latitude": { $lt: latitude + 2 } },
                            { "latitude": { $gt: latitude - 2 } }
                        ]
                    }, {
                        $and: [
                            { "longitude": { $lt: longitude + 2 } },
                            { "longitude": { $gt: longitude - 2 } }
                        ]
                    }
                    ]
                }
            });
        } catch (err) {
            console.log(err);
        }
        return airports;
    }

    //FIND BY 
    that.findAirportByText = async function (text) {

        var searchResults = [];
        try {
            searchResults = await that.textIndex.search(text)
        } catch (err) {
            console.log(err);
        }

        var codes = [];
        for (x = 0; x < searchResults.length; x++) {
            codes.push(searchResults[x].id)
        }

        var airports = [];
        try {
            airports = await that.db.query(function (doc, emit) {
                emit(doc.code);
            }, { keys: codes });
        } catch (err) {
            console.log(err);
        }
        return airports;

    }

    that.findAirportByCode = async function (code) {
        return that.db.query(function (doc, emit) {
            emit(doc.code);
        }, { key: code });
    }


    console.log("INITIALIZE");
    //STARTUP
    await that.init(sourcefilepath);

    console.log("READY");
    console.log(await that.db.info());



    //RETURN THE PUBLIC INTERFACE
    return {
        FindAirportByLatLong: that.findAirportByLatLong,
        FindAirportByText: that.findAirportByText,
        FindAirportByCode: that.findAirportByCode
    };


}