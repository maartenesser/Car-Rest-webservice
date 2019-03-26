const Product = require('../models/product.model');


//TODO: OPTIONS maken.
// exports.product_options = function (req, res, next) {
//     // res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//
//     if ('OPTIONS' === req.method) {
//         res.send(204);
//     }
//     else {
//         next();
//     }
// };
//

var corsOptions = {
    "Access-Control-Allow-Origin": "*",
    'Content-Type' : ['application/x-www-form-urlencoded', 'application/json'],
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
};


//product POST
//ACCESS VIA POSTMAN: localhost:1234/products/create
// body: Name & Price (POST)
// x-www-form-urlencoded
exports.product_create =
    function (req, res) {

        let product = new Product();

        product.brand = req.body.brand;
        product.model = req.body.model;
        product.price = req.body.price;

        product.save(function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(201).json(product)

        }, corsOptions);
    } ;

//GET All cars in DB.
// product GET
// ACCESS VIA POSTMAN: .../products/

exports.product_list = function (req, res) {

    console.log('GET /product/');

    //TODO: moet nog wat in!!
    Product.find({}, (function (err, result) {
        if (err) {
            return res.status(400).send(err);
        } else {
            // res.json(result);
            return res.status(201).json(result);
        }
    }),corsOptions)
};

//product GET
// ACCESS VIA POASTMAN:  /products/<PRODUCT_ID>
exports.product_details = function (req, res) {
    Product.findById(req.params.id, function (err, product) {
        if (err)
            return res.status(400).send(err);

        res.status(201).json({message: 'Car was updated!'});
    },corsOptions)
};

//product UPDATE
// ACCESS VIA POSTMAN: localhost:1234/products/<PRODUCT_ID>/update
// body: Name & Price (PUT)
// x-www-form-urlencoded
exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err)
            return res.status(400).send(err);
        res.status(204).json({message: 'Product udpated.'});
    },corsOptions);
};

//product DELETE
//ACCESS VIA POSTMAN: localhost:1234/products/<PRODUCT_ID>/delete
// (DELETE)
exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err)
            return res.status(400).send(err);
        res.status(204).json({message: 'Deleted successfully!'});
    },corsOptions)
};

