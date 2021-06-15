const { getRoutes } = require('./utils/getRoutes')
const path = require('path')        
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

app.get('/routes', (req, res) => { // req (request) , res (response)
    if (!req.query.addressLat || !req.query.destinationLat || !req.query.addressLong || !req.query.destinationLong) {
        return res.send({
            error: 'You must provide address and destination'
        })
    }

    address = {
        latitude: req.query.addressLat,
        longitude: req.query.addressLong
    }

    destination = {
        latitude: req.query.destinationLat,
        longitude: req.query.destinationLong
    }

    getRoutes(address, destination, (error, routeToGo) => {
        if (error) {
            return res.send({ error })
        }
        else {
            res.send(routeToGo)
        }
    })
})

app.get('*', (req, res) => {
    res.status(404).send('Page not found')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})