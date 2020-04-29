exports.getURI = (HOSTNAME, APIKEY, CODE, FORMAT) => {
let URI = HOSTNAME + '/' + APIKEY + '/' + CODE + '/' + FORMAT

return URI
}