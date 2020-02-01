const mongoose = require('mongoose')
const URI = 'mongodb://demo:demo@cluster0-shard-00-00-waehj.azure.mongodb.net:27017,cluster0-shard-00-01-waehj.azure.mongodb.net:27017,cluster0-shard-00-02-waehj.azure.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'

mongoose.connect(URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(db => process.stdout.write(`DB successfully connected.\n`))
    .catch(err => process.stdout.write(`DB not connected. ${err}\n`))

module.exports = mongoose