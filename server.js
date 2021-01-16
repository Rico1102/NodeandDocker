const express = require('express');
const dbManager = require('./config/db.js');

const app = express();

const PORT = 8000;


//Connecting to database
dbManager.connectDB();

//Init bodyparser middleware
//Returns middleware that only parses JSON and only looks at requests where the Content-Type header matches the "application/json"
//A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body)
app.use(express.json({
    extended: false
}));

//Importing routes and binding them with endpoints
app.use('/user', require('./routes/api/users'));
app.use('/auth', require('./routes/api/auth'));
app.use('/profile', require('./routes/api/profile'));
app.use('/post', require('./routes/api/posts'));

//Starting the server on specified port
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})