const moongose = require ('mongoose');

const dbConnecttion = async() =>{
    try{
        await moongose.connect(process.env.MONGODB)
        console.log('server connection success')
    }
    catch(error){
        console.log('server connection failed')
    }
}

module.exports = dbConnecttion;