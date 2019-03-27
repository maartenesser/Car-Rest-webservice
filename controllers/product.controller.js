const Product = require('../models/product.model');
const mongoose = require('mongoose');


//OPTIONS Method
exports.product_options = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Allow', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Keep-Alive', 'timeout=5, max=100');
    res.header('Content-Type', 'text/html; charset=UTF-8');
    // res.header('Accept', 'application/json, application/x-www-form-urlencoded');
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send();
    }
    else {
        //move on
        next();
    }
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
            if (req.body.brand == null || req.body.model == null || req.body.price == null) {
                return res.status(400).send("There was a bad request please try again")
            }
            else if (err) {
                return res.status(500).send("There was a problem adding the information to the database. Please check everything again and retry.");
            }
            else {
                return res.status(201).json(product)
            }

        });
    };

//GET All cars in DB.
// product GET
// ACCESS VIA POSTMAN: .../products/

exports.product_list = function (req, res, next) {
    console.log('GET /product/');

    var perPage = 9;
    var page = req.params.page || 1;

    Product.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function (err, products) {
            Product.count().exec(function (err, count) {
                if (err) {
                    return res.status(500).send("There was a problem finding the car.");
                }
                if (!products) {
                    return res.status(404).send("No Car found.");
                }
                res.status(200).json({
                    cars: products,
                    current_page: page,
                    total_pages: Math.ceil(count / perPage)
                });
            })
        });


};

//product GET
// ACCESS VIA POASTMAN:  /products/<PRODUCT_ID>
exports.product_details = function (req, res, next) {

    Product.findById(req.params.id, function (err, product) {
        if (err) {
            return res.status(400).send("There was an error getting the precise car")
        }

        else {
            return res.status(200).json(product);
            // console.log("Car "+ product._id +" detail")
        }
    })
};

//product UPDATE
// ACCESS VIA POSTMAN: localhost:1234/products/<PRODUCT_ID>/update
// body: Name & Price (PUT)
// x-www-form-urlencoded
exports.product_update = function (req, res) {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, product) {
        if (err) {
            return res.status(500).send("There was an error updating the Car.")
        }
        else {
            return res.status(200).json({message: 'Product ' + product._id + ' was updated.'});
        }
    });

};

//product DELETE
//ACCESS VIA POSTMAN: localhost:1234/products/<PRODUCT_ID>/delete
// (DELETE)
exports.product_delete = function (req, res) {
    Product.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            return res.status(500).send("There was an error Deleting the specific car.")
        }
        else {
            res.status(200).json({message: res.brand + 'and model' + res.model + ' was successfully deleted!'})
        }
    })
};

