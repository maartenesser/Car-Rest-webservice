const Product = require('../models/product.model');
const mongoose = require('mongoose');
// var js2xmlparser = require('js2xmlparser');


//OPTIONS Method
exports.product_options = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Allow', 'GET ,POST ,OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Keep-Alive', 'timeout=5, max=100');
    res.header('Content-Type', 'text/html; charser-UTF-8');
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.status(200).send();
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
                return res.status(201).send(product)
            }

        });
    };

//GET All cars in DB.
// product GET
// ACCESS VIA POSTMAN: .../products/
exports.product_list = function (req, res) {

    var perPage = parseInt(req.query.per_page) || 9;
    var page = parseInt(req.query.page) || 1;

    Product.find({})
        .skip((perPage) - perPage)
        .limit(perPage)
        .exec(function (err, products) {

            Product.count().exec(function (err, count) {
                if (err) {
                    return res.status(500).send("There was a problem finding the car.");
                }
                if (!products) {
                    return res.status(404).send("No Car found.");
                }

                var cars = [];
                var totalPages = Math.ceil(count / perPage);
                //
                //looping throught evey seperate car add link and then push into array cars
                for (var i = 0; i < products.length; i++) {
                    var brand = products[i].brand;
                    var model = products[i].model;
                    var price = products[i].price;
                    var id = products[i]._id;
                    var _links = {
                        self: {
                            href: 'http://35.176.134.17:8081/products/' + id
                        },
                        collection: {
                            href: 'http://35.176.134.17:8081/products/'
                        }
                    };

                    var car = {id, brand, model, price, _links};
                    cars.push(car);
                }

                //_Links
                var _link = {
                    self: {
                        href: 'http://35.176.134.17:8081/products/'
                    }
                };
                // pagination
                var pagination = {
                    currentPage: page,
                    currentItems: count,
                    totalPages: totalPages,
                    totalItems: count,
                    _links: {
                        first: {
                            page: page,
                            href: 'http://35.176.134.17:8081/products/'
                        },
                        last: {
                            page: totalPages,
                            href: 'http://35.176.134.17:8081/products/'
                        },
                        previous: {
                            page: page - 1,
                            href: 'http://35.176.134.17:8081/products/'
                        }
                    },
                    next: {
                        page: page + 1,
                        href: 'http://35.176.134.17:8081/products/'
                    }
                };

                if (req.header('Accept', 'application/json')) {
                    res.header('Content-Type', 'application/json');
                    //Showing response in json format
                    res.status(200).json({
                        items: cars,
                        _links: _link,
                        pagination: pagination
                    });
                } else {
                    return res.status(500).send("There was a problem finding the car.");
                }
                //TODO: XML model Accept only XML and return data as XML
                // else if (req.accepts('application/xml')) {
                //     // res.set('Content-Type', 'text/xml');
                //     // res.type('application/xml');
                //     // var xmlCars = js2xmlparser.parse("test", cars);
                //     // res.status(200).send(xmlCars);
                //     // console.log(xmlCars);
                // }
            })
        })
};


//product GET
// ACCESS VIA POASTMAN:  /products/<PRODUCT_ID>
exports.product_details = function (req, res, next) {

    Product.findById(req.params.id, function (err, product) {
        if (err) {
            return res.status(400).send("There was an error getting the precise car")
        }

        else {
            return res.status(200).json({
                product:product,
                _links: {
                    self: {
                        href: 'http://35.176.134.17:8081/products/' + req.params.id
                    },
                    collection: {
                        href: 'http://35.176.134.17:8081/products/'
                    }
                }
            });
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
            res.status(200).json({message: ' Car was successfully deleted!'})
        }
    })
};

