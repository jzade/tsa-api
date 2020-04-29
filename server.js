const express = require('express')
const app = express()
const unirest = require('unirest')
const port = process.env.TSA_ENV_PORT



//Routes
app.get('/', (req, res) => {
    res.status(200).json({
        currentTime: Date.now(),
        userMessage: "request success."
    })
})
app.get('/api/v1/test', (req, res) => {
    res.status(200).json({
        currentTime: Date.now(),
        userMessage: "request success."
    })
})

// var req = unirest("GET", "https://www.tsawaittimes.com/api/airport/7pA4uDewjNXMAx1qhzhaxGFjVHcmT9qV/ATL/JSON");

// req.end(function (res) {
// 	if (res.error) throw new Error(res.error);

// 	console.log(res.body);
// });


app.listen(port, () => 
    console.log(`Express Server started on ${process.env.NODE_ENV} port ${port}, press ctrl-C to terminate.`)
)