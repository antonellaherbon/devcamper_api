const mongoose = require ('mongoose');

const dbConnecttion = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB)
        console.log('server connection success')
    }
    catch(error){
        console.log('server connection failed')
    }
}

module.exports = dbConnecttion;