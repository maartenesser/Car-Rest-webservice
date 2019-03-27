const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const product = require('./routes/products.route'); // Imports routes for the products
const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://maartenesser:konijnen13@cluster0-2e6sd.mongodb.net/cars?retryWrites=true';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json({ type:'application/json'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);

//TODO: CORS Collection => geen Access-Control-Allow-Origin & Access-Control-Allow-Headers
app.use(cors({
    origin: 'http://35.176.134.17:8081/products/',
    accept: 'application/json',
    allow: 'Origin, X-Requested-With, Content-Type, Accept'
}));

let port = 8081;
let host = '172.26.13.147';

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
