// import Airport from '..model/airport.js'
// import { publicDecrypt } from 'crypto';

exports.AirportDB = (sourcefilepath) => {

    //INNER VARIABLES
    var that = this;
    //that.sourcefilepath = sourcefilepath

        ///INIT THE POUCH DATABASE - jank code :P
        var PouchDB = require('pouchdb')
        PouchDB.plugin(require('pouchdb-find'));
        that.db = new PouchDB('airport_database')
        

    var LocalStorage = require('node-localstorage').LocalStorage;
    that.localStorage = new LocalStorage('./data/local-storage');

    //INIT THE FULL TEXT
    const txi = require('txi')
    that.textIndex = new txi({
        storage: {
            get: (key) => {
                const data = that.localStorage.getItem(key);
                if (data) return JSON.parse(data);
            },
            set: (key, value) => {
                that.localStorage.setItem(key, JSON.stringify(value));
            },
            keys: () => {
                var keys = []
                for (const i = 0; i < that.localStorage.length; i++) {
                    keys.push(that.localStorage.key(i));
                }
                return keys
            },
            count: () => {
                return that.localStorage.length;
            }
        }
    })



    //INITIALIZATION FUNCTION
    that.init = async function (sourcefilepath) {

        var geoBuilder = require('./geo-builder.js')

        try {
            await that.db.destroy();
        } catch (err) {
            console.log(err);
        }

        that.db = new PouchDB('airport_database')

        var fs = require('fs')
        var path = require('path')

        // Load Airport Data
        var BUFFER = bufferFile(sourcefilepath)

        function bufferFile(relPath) {
            return fs.readFileSync((relPath));
        }

        var AirportsDecodedObj = JSON.parse(BUFFER)
        var AirDataArray = AirportsDecodedObj.responsePayload;

        //IF IS NOT NULL AND IS ARRAY --TODO
        if (AirDataArray != null) {
            var codes = [];

            console.log("loading airports")
            for (x = 0; x < AirDataArray.length; x++) {
                await loadAirport(AirDataArray[x], x)

                if (x % 5 == 0 && x % 50 != 0)
                console.log('\x1b[33m%s\x1b[0m', '.')
                if (x % 50 == 0)
                console.log('\x1b[33m%s\x1b[0m',x)
            }
            console.log("loaded airports")


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
            }, { keys: codes, include_docs:true });
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


    //console.log("INITIALIZE");
    //STARTUP
    //await that.init(sourcefilepath);
    //console.log("READY");
    //console.log(await that.db.info());



    //RETURN THE PUBLIC INTERFACE
    return {
        InitializeDB: async (sourcefilepath) => { await that.init(sourcefilepath) },
        FindAirportByLatLong: async (Lat, Long) => { return that.findAirportByLatLong(Lat, Long) },
        FindAirportByText: async (text) => { return that.findAirportByText(text) },
        FindAirportByCode: async (code) => { return that.findAirportByCode(code) }
    };


}