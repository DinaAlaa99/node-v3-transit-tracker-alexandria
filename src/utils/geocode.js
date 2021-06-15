const request = require('request')

const geocode = (address, callback) => {
   const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1IjoicmFuYS1tYW1kb3VoMSIsImEiOiJja25ncXlxaGQwdHF2MnhudzBncXBxeW15In0.KQQRjLOU1uEo-JArkDVRvw&limit=1'
   request({ url: url, json: true }, (error, response) => {
      if (error) {
         callback('Unable to connect to location services!', undefined)
      } else if (response.body.features.length == 0) {
         callback('Unable to fined location. Try another search', undefined)
      } else {
         const { center, place_name: placeName } = response.body.features[0]
         console.log(center[0], center[1], placeName)
         callback(undefined, {
            longitude: center[0],
            latitude: center[1],
            location: placeName

         })
      }
   })
}

module.exports = geocode