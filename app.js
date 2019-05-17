const express = require('express');
const bodyParser = require('body-parser');

const product = require('./routes/products.route'); // Imports routes for the products
const app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'Mongodb database';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);

app.get('/', (req, res) => {
    res.json({"message": "API"});
    console.log(req.body);
});

let port = 8081;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
