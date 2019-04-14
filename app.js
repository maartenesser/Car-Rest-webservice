const express = require('express');
const bodyParser = require('body-parser');

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

//{ type:'application/json, application/xml'}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/products', product);
// app.use(function (req, res) {
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html")
// });

app.get('/', (req, res) => {
    res.json({"message": "API"});
});

// app.use(function(req, res) {
//     res.header('Access-Control-Allow-Methods', ['GET', 'POST', 'OPTIONS', 'PUT']);
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', ['Content-Type', 'text/html']);
//
//     if ('OPTIONS' === req.method) {
//         res.json({
//             "Options":"GET, POST, OPTIONS"
//         });
//     }
// });

let port = 8081;
// let host = '172.26.13.147';

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
