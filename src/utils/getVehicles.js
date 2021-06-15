const nearestStation = require('./nearbyStations')
const mongo = require('../db/mongo')
const pathModel = require('../model/pathModel')
const vehicleModel = require('../model/vehicleModel')
const stationModel = require('../model/stationsModel')
const station = require('../model/stationsModel')

const updateVehicle = (latitude, longitude, vehicleId, callback) => {
    const connectToMongoDB = async () => {
        await mongo().then(async (Mongoose) => {
            try {
                var myVehiclePath
                const stationsOnPath = []
                const vehiclePath = await pathModel.find({})
                const vehicle = await vehicleModel.findOne({ id: vehicleId })

                //vehicle = vehicles.find((vehicle) => vehicle.id == vehicleId)

                if (vehicle.status) {
                    myVehiclePath = vehicle.path[0]
                } else {
                    myVehiclePath = vehicle.path[1]
                }

                const path = vehiclePath[myVehiclePath - 1]
                const stations = path.stations
                for (var i = 0; i < stations.length; i++) {
                    const result = await stationModel.findOne({ _id: stations[i] })
                    stationsOnPath.push(result)
                }

                nearestStation(latitude, longitude, stationsOnPath, 'driving', (error, { nearestStationData }) => {
                    if (error) {
                        callback(error)
                    }
                    else {
                        var status = vehicle.status
                        if (nearestStationData.id == stationsOnPath[stationsOnPath.length - 1].id) {
                            status = !vehicle.status
                        }
                        const connectToMongoDB = async () => {
                            await mongo().then(async (Mongoose) => {
                                try {
                                    const data = await vehicleModel.findOneAndUpdate(
                                        { id: vehicleId },
                                        { lastStation: nearestStationData._id , status },
                                        { upsert: true, new: true })
                                    console.log('updated')
                                } catch (error) {
                                    console.log(error)
                                } finally {
                                    Mongoose.connection.close()
                                }
                            })
                        }
                        connectToMongoDB()
                        callback(undefined)
                    }
                })
            } catch (error) {
                callback(error)
            } finally {
                Mongoose.connection.close()
            }
        })
    }
    connectToMongoDB()
}

function getVehicle(vehicles, route, vehicleStations, vehiclePath) {
    //a3raf el path w a5od el ana 3aizah 
    //ashoof el gayiin na7yet el pickup station w a7otohom f priority queue
    var clientPath = 0
    var myVehiclePath = 0
    const Queue = []
    var counter = 0
    var lastStationID

    vehiclePath.forEach(path => {
        if (path.stations.indexOf(vehicleStations[route.pickupStation.id - 1]._id) < path.stations.indexOf(vehicleStations[route.dropoffStation.id - 1]._id)) {
            clientPath = path
        }
    })

    vehicles.forEach(vehicle => {
        var stationObjectID = vehicle.lastStation

        if (vehicle.status) {
            myVehiclePath = vehicle.path[0]
        } else {
            myVehiclePath = vehicle.path[1]
        }

        if (myVehiclePath == clientPath.id) {
            var i = 0

            const result = vehicleStations.find((station) => station._id == stationObjectID.toString())
            lastStationID = result.id
            // console.log(lastStationID)
            if (vehiclePath[myVehiclePath - 1].stations.indexOf((vehicleStations[route.pickupStation.id - 1])._id) >= vehiclePath[myVehiclePath - 1].stations.indexOf((vehicleStations[lastStationID - 1])._id)) {
                // console.log(lastStationID)
                Queue.push(vehicle)
            }
        }
        else {
            return //console.log('No Buses going this way') 
        }
    });
    // console.log(Queue)
    return Queue
}

module.exports = {
    getVehicle,
    updateVehicle
}