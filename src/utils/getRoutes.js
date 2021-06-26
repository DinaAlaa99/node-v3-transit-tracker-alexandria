const { recursiveGetStation } = require('./getStation')
const chalk = require('chalk')
const mongo = require('../db/mongo')
const { Mongoose } = require('mongoose')
const stationModel = require('../model/stationsModel')
const vehicleModel = require('../model/vehicleModel')
const pathModel = require('../model/pathModel')
const path = require('../model/pathModel')


const routeToGo = [
    {
        description: 'aboqueer',
        result: []
    }, {
        description: 'elgeish',
        result: []
    }, {
        description: 'tram',
        result: []
    }
]
const getData = (callback) => {

    const connectToMongoDB = async () => {
        await mongo().then(async (Mongoose) => {
            try {
                console.log("connected to mongodb")
                const vehiclePath = await pathModel.find({})
                const vehicleStations = await stationModel.find({})
                const vehicles = await vehicleModel.find({})

                const stationsIdForAlgeishPath = await pathModel.findOne({ id: 1 })
                const stationsIdForAbuQirPath = await pathModel.findOne({ id: 3 })
                const stationsIdForTramPath = await pathModel.findOne({ id: 5 })

                const stationsIdAbuQir = stationsIdForAbuQirPath.stations
                const stationsIdAlgeish = stationsIdForAlgeishPath.stations
                const stationsIdTram = stationsIdForTramPath.stations

                const stationsForAbuQirPath = []
                const stationsForAlgeihsPath = []
                const stationsForTramPath = []

                for (var i = 0; i < stationsIdAbuQir.length; i++) {
                    const result = await stationModel.find({
                        _id: stationsIdAbuQir[i]
                    })
                    stationsForAbuQirPath.push(result[0])
                }
                for (var i = 0; i < stationsIdAlgeish.length; i++) {
                    const result = await stationModel.find({
                        _id: stationsIdAlgeish[i]
                    })
                    stationsForAlgeihsPath.push(result[0])
                }
                for (var i = 0; i < stationsIdTram.length; i++) {
                    const result = await stationModel.find({
                        _id: stationsIdTram[i]
                    })
                    stationsForTramPath.push(result[0])
                }

                const data = { vehiclePath, vehicleStations, vehicles, stationsForAbuQirPath, stationsForAlgeihsPath, stationsForTramPath }
                callback(undefined, data)
            } catch (error) {
                callback(error, undefined)
            } finally {
                Mongoose.connection.close()
            }

        })
    }
    connectToMongoDB()

}

const getRoutes = (currentLocation, desiredDestination, callback) => {
    //console.log('hi')
    getData((error, data) => {
        recursiveGetStation(currentLocation, desiredDestination, data.stationsForAbuQirPath, routeToGo[0].result=[], data.vehicleStations, data.vehicles, data.vehiclePath, (error, routes) => {
            recursiveGetStation(currentLocation, desiredDestination, data.stationsForAlgeihsPath, routeToGo[1].result=[], data.vehicleStations, data.vehicles, data.vehiclePath, (error, routes) => {
                recursiveGetStation(currentLocation, desiredDestination, data.stationsForTramPath, routeToGo[2].result=[], data.vehicleStations, data.vehicles, data.vehiclePath, (error, routes) => {
                    if (error) {
                        callback(error, undefined)
                    }
                    else {
                        callback(undefined, routeToGo)
                    }
                })
            })
        })
    })
}



const printRoute = (routes) => {
    routes.forEach(routeToGo => {
        console.log(chalk.redBright.bold(`----------${routeToGo.description}----------`))

        routeToGo.result.forEach(route => {
            console.log(chalk.greenBright.bold('----------Pickup Station----------'))
            console.log(chalk.greenBright(`Station ID: ${route.pickupStation.id}\nStation: ${route.pickupStation.description}\nLatitude: ${route.pickupStation.latitude}\nLongitude: ${route.pickupStation.longitude}\nWalking Time: ${route.walkingTimeToPickupStation}`))

            console.log(chalk.yellowBright.bold('----------Dropoff Station----------'))
            console.log(chalk.yellowBright(`Station ID: ${route.dropoffStation.id}\nStation: ${route.dropoffStation.description}\nLatitude: ${route.dropoffStation.latitude}\nLongitude: ${route.dropoffStation.longitude}\nWalking Time To Destination: ${route.walkingTimeToDestination}`))

            console.log(chalk.magentaBright.bold('----------Travel Time----------'))
            console.log(chalk.magentaBright(`Travel Time: ${route.travelTimeFromPickupToDropoff}`))

            console.log(chalk.cyanBright.bold('----------Vehicles----------'))
            console.log(chalk.cyanBright(route.vehicle))
        })
    });
}
module.exports = {
    getRoutes,
    printRoute
}
