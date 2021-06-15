const mongoose = require('mongoose')
const mongoPath = "mongodb+srv://GraduationProject:GraduationProject1234@PublicTransitTracker.p6tjd.mongodb.net/PublicTransitTracker?retryWrites=true&w=majority";

module.exports = async() =>{
    await mongoose.connect(mongoPath,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    //serverSelectionTimeoutMS: 5000 // Keep trying to send operations for 5 seconds
    })
    return mongoose
}
 

