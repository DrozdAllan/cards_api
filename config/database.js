const mongoose = require('mongoose')



const connectDB = async () => {
    mongoose.set("strictQuery", false);
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/bigeye')

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (e) {
        console.log(e)
        process.exit(1)
    }
}

module.exports = connectDB;