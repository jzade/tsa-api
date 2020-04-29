const express = require('express')
const app = express()
const unirest = require('unirest')

//config local variables
const PORT = process.env.TSA_ENV_PORT
const TSA_API_KEY = process.env.TSA_API_KEY
const ENV = process.env.TSA_DEV_ENV
const HOSTNAME = "https://www.tsawaittimes.com/api/airport"

//config library
var urlBuilder = require('./library/url-builder.js')


//API Routes - Testing
app.get('/', (req, res) => {
    res.status(200).json({
        currentTime: Date.now(),
        userMessage: "request success - you are on local host."
    })
})
app.get('/api/v1/test', (req, res) => {
    res.status(200).json({
        currentTime: Date.now(),
        userMessage: "request success - you are on api/v1/test"
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
            userMessage: "request success.",
            apiroute: '/airports',
            responsePayload: payload
        })
    })
})
//TSA API ROUTE GET LIST OF SPECIFIC AIRPORT
app.get('/api/v1/airport/:APcode', (req, res) => {

    let APCODE = req.params.APcode
    let FORMAT = "JSON"
    let uri = urlBuilder.getURI(HOSTNAME, TSA_API_KEY, APCODE, FORMAT)

    var unireq = unirest("GET", uri);

    unireq.end(function (unires) {
        if (unires.error) throw new Error(unires.error)
        let payload = unires.body
    
        res.status(200).json({
            currentTime: Date.now(),
            userMessage: "request success.",
            responsePayload: payload
        })
    })
})

app.listen(PORT, () => 
    console.log(`Express Server started on ${ENV} port ${PORT}, press ctrl-C to terminate.`)
)