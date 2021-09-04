const request = require('request')
const station = require('../model/stationsModel')

const nearestStation = (latitude, longitude, stations, mode, callback) => {
    var destinations = ''
    stations.forEach((station) => destinations += station.latitude + ',' + station.longitude + '|')
    destinations = destinations.slice(0, -1)

    url = `https://maps.googleapis.com/maps/api/distancematrix/json?&origins=${latitude},${longitude}&destinations=${destinations}&mode=${mode}&key=MYKEY`

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to location services!', undefined)
        }
        else if (response.body.status != 'OK') {
            callback('Unable to find location. Try another search', undefined)
        } else {
            const distanceToDestination = []

            const destinations = response.body.rows[0].elements
            destinations.forEach((destination) => distanceToDestination.push(destination.distance.value))

            minDistanceIndex = distanceToDestination.indexOf(Math.min.apply(null, distanceToDestination))
            const nearestStationData = stations[minDistanceIndex]
            const walkingTimeData = destinations[minDistanceIndex].duration.value
            callback(undefined, { nearestStationData, walkingTimeData })
        }
    })
}

module.exports = nearestStation
