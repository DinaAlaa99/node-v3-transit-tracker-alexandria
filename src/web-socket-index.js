const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    socket.on('userCurrentLocation', ({ latitude, longitude }) => {
    })

    socket.on('sendLiveLocation', ({ latitude, longitude }) => {
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`)
        // update vehicle last station
        socket.broadcast.emit('location', {
            driverLatitude: latitude,
            driverLongitude: longitude
        })
    })

    socket.on(('disconnect'), () => {
        console.log('Disconnected')
    })

})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})