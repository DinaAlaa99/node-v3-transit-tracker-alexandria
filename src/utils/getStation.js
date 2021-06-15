const nearestStation = require('./nearbyStations')
const travelTime = require('./travelTime')
const { getVehicle } = require('./getVehicles')

const getStation = (startLocation, endLocation, stations, callback) => {
    nearestStation(startLocation.latitude, startLocation.longitude, stations, 'walking', (error, { nearestStationData, walkingTimeData }) => {
        if (error) {
            callback(error, undefined)
        }

        const pickupStation = nearestStationData
        const walkingTimeToPickupStation = walkingTimeData
        const paths = pickupStation.path

        const stationsOnTheSamePath = stations.filter((station) => paths.some((path) => station.path.includes(path)))

        nearestStation(endLocation.latitude, endLocation.longitude, stationsOnTheSamePath, 'walking', (error, { nearestStationData, walkingTimeData }) => {
            if (error) {
                callback(error, undefined)
            }

            const dropoffStation = nearestStationData
            const walkingTimeToDestination = walkingTimeData

            travelTime(pickupStation, dropoffStation, (error, travelTimeData) => {
                if (error) {
                    callback(error, undefined)
                }

                const travelTimeFromPickupToDropoff = travelTimeData

                const route = { walkingTimeToPickupStation, walkingTimeToDestination, travelTimeFromPickupToDropoff, pickupStation, dropoffStation, paths }
                callback(undefined, route)
            })
        })
    })
}

function recursiveGetStation(startLocation, endLocation, stations, routes, vehicleStations, vehicles, vehiclePath, callback) {

    getStation(startLocation, endLocation, stations, (error, route) => {
        if (error) {
            callback(error, undefined)
            return
        }

        if (route.pickupStation.id == route.dropoffStation.id) {
            callback(undefined, routes)
            return
        }
        
        route.vehicle = getVehicle(vehicles, route, vehicleStations, vehiclePath)

        routes.push(route)

        const stationsOnDifferentPaths = vehicleStations.filter((station) => !route.paths.some((path) => station.path.includes(path)))

        if (route.walkingTimeToDestination > 600) {
            recursiveGetStation(route.dropoffStation, endLocation, stationsOnDifferentPaths, routes, vehicleStations, vehicles, vehiclePath, callback)
        } else {
            callback(undefined, routes)
            return
        }
    })

}

module.exports = {
    recursiveGetStation
}