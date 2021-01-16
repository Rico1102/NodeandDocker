const mongoose = require("mongoose"); //imported mongoose
const config = require("config"); //imported config
const dbURI = process.env['mongoURI'] ||config.get("mongoURI"); //imported mongoURI defined as global variable using config

const connectDB = async () => {
    try {
        //mongoose.connect returns a promise so we are putting it in async await
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log("Database connected...");
    } catch (err) {
        console.log(err); //Show the error in console
        process.exit(1); //Exit with failure code
    }
};

module.exports.connectDB = connectDB;