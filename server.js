var express = require('express');
var app = express();
var mongoose = require('mongoose');
var unirest = require("unirest");

//Local Env Variables
const dotenv = require('dotenv');
    dotenv.config();
    console.log('Currently deployed on ${process.env.NODE_ENV' );


var req = unirest("GET", "https://www.tsawaittimes.com/api/airport/7pA4uDewjNXMAx1qhzhaxGFjVHcmT9qV/ATL/JSON");

req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});