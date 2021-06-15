const socket = io()

const $getLiveLocationForm = document.querySelector('#get-live-location-form')
const $getLiveLocationFormButton = $getLiveLocationForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

socket.on('location', ({ driverLatitude, driverLongitude }) => {
    console.log('Location : ', driverLatitude, driverLongitude)

})
/*
$getLiveLocationForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $getLiveLocationFormButton.setAttribute('disabled', 'disabled')

    socket.emit('getLiveLocation', (error) => {
        $getLiveLocationFormButton.removeAttribute('disabled')

        if (error) {
            return console.log(error)
        }
        console.log('Live location is delivered!')
    })
})
*/

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }
   

     setTimeout(() => {
        navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLiveLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Live location is shared!')
        })
    })}, 1000); 

})

