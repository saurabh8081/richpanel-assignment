// ifacet/server/config/mongoose.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });

        console.log("Connected to the database :: MongoDB");
    } catch (error) {
        console.error("Error connecting to the database :: MongoDB", error);
        process.exit(1);
    }
}

module.exports = connectDB;