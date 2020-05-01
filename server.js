const express = require('express')
const app = express()
const unirest = require('unirest')
const geohash = require('ngeohash')
const path = require('path')

//config local variables
const PORT = process.env.TSA_ENV_PORT
const TSA_API_KEY = process.env.TSA_API_KEY
const ENV = process.env.TSA_DEV_ENV
const HOSTNAME = "https://www.tsawaittimes.com/api/airport"

//config library
var urlBuilder = require('./library/url-builder.js')
var geoBuilder = require('./library/geo-builder.js')

let startAirportDB = require('./library/database.js')

async function loadDatabase()
{
    let airportDB = await startAirportDB.AirportDB('./data/airports-meta.json')

    var airports = await airportDB.FindAirportByText("Walla")
    if (airports != null) {
        console.log(airports);
    }

    var airport = await airportDB.FindAirportByCode("ICT")
    if (airport != null) {
        console.log(airport);
    }

    var airports = await airportDB.FindAirportByLatLong(36, -119)
    if (airports != null) {
        console.log(airports);
    }
}

loadDatabase();

app.use(express.static(path.join(__dirname,'_site')))
//API Routes - Testing
/*
app.get('/', (req, res) => {
    res.status(200).json({
        currentTime: Date.now(),
        serverMessage: `request success - you are on ${TSA_DEV_ENV}`
    })
})
*/

app.get('/api/v1/test', (req, res) => {
    res.status(200).json({
        currentTime: Date.now(),
        serverMessage: "request success - you are on api/v1/test"
    })
})

//API Variables: {APIKEY}, {CODE}, {FORMAT} - URI structure: APIKEY/CODE/FORMAT
//TSA API ROUTE: GET LIST OF ALL AIRPORTS
app.get('/api/v1/airports', (req, res) => {

    var unireq = unirest("GET", `${HOSTNAME}s/${TSA_API_KEY}/JSON`);

    unireq.end(function (unires) {
        if (unires.error) throw new Error(unires.error)
        let payload = unires.body

        res.status(200).json({
            currentTime: Date.now(),
            serverMessage: "request success",
            apiRoute: '/airports',
            responsePayload: payload
        })
    })
})
//TSA API ROUTE GET LIST OF SPECIFIC AIRPORT AND WAIT TIMES
app.get('/api/v1/airport/:APcode', (req, res) => {

    let APCODE = req.params.APcode
    let FORMAT = "JSON"
    let uri = urlBuilder.getURI(HOSTNAME, TSA_API_KEY, APCODE, FORMAT)

    var unireq = unirest("GET", uri)

    unireq.end(function (unires) {
        if (unires.error) throw new Error(unires.error)
        let payload = unires.body

        res.status(200).json({
            currentTime: Date.now(),
            serverMessage: "request success",
            responsePayload: payload
        })
    })
})

//API Route for GIS Lookup 
//General Process -> take lat and long parameters and calcuate a geohash
//test data: http://localhost:3000/api/v1/geohash/45.4490556/-98.4218333

app.get('/api/v1/geohash/:lat/:long', (req, res) => {
    let lat = req.params.lat
    let long = req.params.long

    let latLongGeo = geoBuilder.getGeohash(lat, long)

    console.log(latLongGeo)

    res.status(200).json({
        currentTime: Date.now(),
        serverMessage: "request success",
        geoHash: latLongGeo
    })
})

app.listen(PORT, () =>
    console.log(`Express Server started on ${ENV} port ${PORT}, press ctrl-C to terminate.`)
)