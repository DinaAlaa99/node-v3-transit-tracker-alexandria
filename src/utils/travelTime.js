const request = require('request')
const chalk = require('chalk')

const travelTime = (origin, destination, callback) => {
    url = `https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=driving&key=AIzaSyDnNvDFPC-zgjggGXYNoQR3yyZ-92UZ4LM`

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        }
        else if (response.body.status != 'OK') {
            callback('Unable to find location. Try another search', undefined)
        } else {

            const travelTimeData = response.body.rows[0].elements[0].duration.value

            callback(undefined, travelTimeData)
        }
    })
}
2
module.exports = travelTime