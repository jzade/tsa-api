var geohash = require('ngeohash')

exports.getGeohash = (lat, long) => {
    let latLongToGeo = geohash.encode(lat, long)
    return latLongToGeo
}

exports.getLatLong = (encGeohash) => {
    let geoToLatLong = geohash.decode(encGeohash)
    return 
}
//HOW TO CALL THIS FUNCTION: 
// let latLongGeo = geoBuilder.getGeohash(lat, long)

// console.log(latLongGeo)