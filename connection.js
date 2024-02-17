const mongoose = require('mongoose')

const handleConnectMongoDB = async(url)=>{
    mongoose.connect(url)
}

module.exports=handleConnectMongoDB