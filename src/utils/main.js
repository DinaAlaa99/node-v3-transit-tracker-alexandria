const request = require('request')
const { loopToDropoff, loopToPickup } = require('./getStation')
const chalk = require('chalk')
const { Mongoose } = require('mongoose')
const mongo = require('../db/mongo')
const stationModel = require('../model/stationsModel')
const pathModel = require('../model/pathModel')
const { updateVehicle } = require('./getVehicles')
const vehicleModel = require('../model/vehicleModel')

const { getRoutes, printRoute } = require('./getRoutes')

userCurrentLocation = [
    {
        latitude: 31.244168819958,
        longitude: 29.970884386947585,
        id: 1,
        description: 'Mariam`s Place'
    },
    {
        latitude: 31.211287846741204,
        longitude:  29.91909115312011,
        id: 2,
        description: 'Dina`s Place'
    },
    {
        latitude: 31.231337454333772,
        longitude: 29.958931925856987,
        id: 3,
        description: 'Rana`s place'
    },
    {
        latitude: 31.254214282069714,
        longitude: 29.973841333023724,
        id: 4,
        description: 'El Mahrousa'
    },
    {
        latitude: 31.240696170331447,
        longitude: 29.95970866758859,
        id: 5,
        description: '3and gleem bay'
    },
    {
        latitude: 31.204139502206704,
        longitude: 29.934497076042675,
        id: 6,
        description: 'wekalet el 5odar w el fakha'
    },
    {
        latitude: 31.2127696,
        longitude: 29.9333728 
    }
]

userDesiredDestination = [
    {
        latitude: 31.2139385409169,
        longitude: 29.884383622780536,
        description: "citadel"
    },
    {
        latitude: 31.226453382362354,
        longitude: 29.95244735944623,
        description: "kafr Abdou"
    },
    {
        latitude: 31.239694206492175,
        longitude: 29.960183524439515 //gleem tram station
    },
    {
        latitude: 31.2088134, 
        longitude:29.9128572
    }
]

getRoutes(userCurrentLocation[6], userDesiredDestination[3], (error,routeToGo) => {
    if(error){
        return console.log(error)
    }
   printRoute(routeToGo)
})


// updateVehicle(31.20071064807695, 29.89106960486688, 1, (error) => {
//     if (error) {
//         console.log(error)
//     }
  
// })
