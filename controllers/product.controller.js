const Product = require("../models/product.model");

//OPTIONS Method
exports.product_options = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html");
    res.header("Access-Control-Allow-Methods", ["GET", "POST" , "OPTIONS"]);
    res.header("Allow", "GET ,POST ,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    // res.header("Access-Control-Allow-Headers", ["Content-Type", "text/html"]);
    // res.header("Keep-Alive", "timeout=5, max=100");
    //intercepts OPTIONS method
    if ("OPTIONS" === req.method)
    //respond with 200
        res.status(200).send();
};

//product POST
//ACCESS VIA POSTMAN: localhost:1234/products/create
// body: Name & Price (POST)
// x-www-form-urlencoded
exports.product_create = (req, res) => {
    if (!req.body.brand || !req.body.model || !req.body.price) {
        return res.header("Access-Control-Allow-Origin", "*").status(400).send({
            message: "The body is empty please make another request and give it a brand, model and price"
        });
    }

    let product = new Product({
        brand: req.body.brand,
        model: req.body.model,
        price: req.body.price
    });

    product.save()
        .then(product => {
            res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html").status(201).send(product);
        })
        .catch(err => {
            res.header("Access-Control-Allow-Origin", "*").status(500).send({
                message: err.message || "There was a problem adding the information to the database. Please check everything again and retry."
            })
        })
};

//GET All cars in DB.
// product GET
// ACCESS VIA POSTMAN: .../products/
exports.product_list = (req, res) => {
    if (req.accepts("json")) {
        Product.find()
            .then(products => {

                let startAt = 0;
                if (req.query.start) {
                    startAt = req.query.start;
                }

                let loopedCars = 0;
                let returnCars = [];
                products.forEach(function (element) {
                    if (startAt > loopedCars) {
                        loopedCars++;
                        return;
                    }
                    let newProduct = element.toJSON();
                    newProduct._links = {};
                    newProduct._links.self = {href: req.protocol + "://" + req.headers.host + "/products/" + newProduct._id};
                    newProduct._links.collection = {href: req.protocol + "://" + req.headers.host + "/products/"};
                    returnCars.push(newProduct)
                });


                // var cars = [];
                // for (let i = 0; i < products.length; i++) {
                //     let brand = products[i].brand;
                //     let model = products[i].model;
                //     let price = products[i].price;
                //     let id = products[i]._id;
                //     let _links = {
                //         self: {
                //             href: req.protocol + "://" + req.headers.host + "/products/" + id
                //         },
                //         collection: {
                //             href: req.protocol + "://" + req.headers.host + "/products/"
                //         }
                //     };
                //
                //     var car = {id, brand, model, price, _links};
                //     cars.push(car);

                res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html").json({
                    items: returnCars,
                    _links: {
                        self: {
                            href: req.protocol + "://" + req.headers.host + req.originalUrl
                        }
                    },
                    pagination: {
                        currentPage: 1,
                        currentItems: products.length,
                        totalPages: 1,
                        totalItems: products.length,
                        _links: {
                            first: {
                                page: 1,
                                href: req.protocol + "://" + req.headers.host + "/products/"
                            },
                            last: {
                                page: 1,
                                href: req.protocol + "://" + req.headers.host + "/products/"
                            },
                            previous: {
                                page: 1,
                                href: req.protocol + "://" + req.headers.host + "/products/"
                            }
                        },
                        next: {
                            page: 1,
                            href: req.protocol + "://" + req.headers.host + "/products/"
                        }
                    }
                })
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "There was an error when finding cars"
                });
            });
    } else {
        res.sendStatus(400);
    }
};

// .exec(function (err, products) {
//
//         Product.count().exec(function (err, count) {
//                 if (err) {
//                     return res.status(500).send("There was a problem finding the car.");
//                 }
//                 if (!products) {
//                     return res.status(404).send("No Car found.");
//                 }
//
//                 var cars = [];
//                 for (let i = 0; i < products.length; i++) {
//                     let brand = products[i].brand;
//                     let model = products[i].model;
//                     let price = products[i].price;
//                     let id = products[i]._id;
//                     let _links = {
//                         self: {
//                             href: req.protocol + "://" + req.headers.host + "/products/" + id
//                         },
//                         collection: {
//                             href: req.protocol + "://" + req.headers.host + "/products/"
//                         }
//                     };
//
//                     var car = {id, brand, model, price, _links};
//                     cars.push(car);
//                 }
//
//                 if (req.accepts("application/json")) {
//                     console.log("sent json file");
//                     res.header("Access-Control-Allow-Origin", "*").json({
//                         items: cars,
//                         _links: {
//                             self: {
//                                 href: req.protocol + "://" + req.headers.host + req.originalUrl
//                             }
//                         },
//                         pagination: {
//                             currentPage: 1,
//                             currentItems: count,
//                             totalPages: 1,
//                             totalItems: count,
//                             _links: {
//                                 first: {
//                                     page: 1,
//                                     href: req.protocol + "://" + req.headers.host + "/products/"
//                                 },
//                                 last: {
//                                     page: 1,
//                                     href: req.protocol + "://" + req.headers.host + "/products/"
//                                 },
//                                 previous: {
//                                     page: 1,
//                                     href: req.protocol + "://" + req.headers.host + "/products/"
//                                 }
//                             },
//                             next: {
//                                 page: 1,
//                                 href: req.protocol + "://" + req.headers.host + "/products/"
//                             }
//                         }
//                     })
//                 }
//             }
//         )
//     }
// )
//
// } else
// {
//     res.sendStatus(400)
// }
// }
// ;


//product GET
// ACCESS VIA POASTMAN:  /products/<PRODUCT_ID>
exports.product_details = (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            if (!product) {
                return res.header("Access-Control-Allow-Origin", "*").status(404).send({
                    message: "There was an error getting the precise car" + req.params.id
                })
            }
            res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html").status(200).json({
                product: product,
                _links: {
                    self: {
                        href: req.protocol + "://" + req.headers.host + "/products/" + req.params.id
                    },
                    collection: {
                        href: req.protocol + "://" + req.headers.host + "/products/"
                    }
                }
            });

        })
        .catch(err => {
            if (err.kind === "CarId") {
                return res.header("Access-Control-Allow-Origin", "*").status(404).send({
                    message: "Car not found with id " + req.params.id
                })
            } else {
                return res.header("Access-Control-Allow-Origin", "*").status(500).send({
                    message: "Error retrieving car with id " + req.params.id
                });
            }
        });
};

//product UPDATE
// ACCESS VIA POSTMAN: localhost:1234/products/<PRODUCT_ID>/update
// body: Name & Price (PUT)
// x-www-form-urlencoded
exports.product_update = (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            if (!product) {
                return res.header("Access-Control-Allow-Origin", "*").status(404).send({
                    message: "Car not found with id " + req.params.id
                });
            }
            if (!req.body.brand || !req.body.model || !req.body.price) {
                return res.header("Access-Control-Allow-Origin", "*").status(400).send("Fill in all fields for a Car");
            } else {
                product.brand = req.body.brand;
                product.model = req.body.model;
                product.price = req.body.price;
                product.save();
                let nProduct = product.toJSON();

                res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html").status(200).json(nProduct);
            }
        })
        .catch(err => {
            if (err.kind === "CarId") {
                return res.header("Access-Control-Allow-Origin", "*").status(404).send({
                    message: "Car not found with id " + req.params.id
                })
            } else {
                return res.header("Access-Control-Allow-Origin", "*").status(500).send({
                    message: "Error retrieving car with id " + req.params.id
                });
            }
        });

};

//product DELETE
//ACCESS VIA POSTMAN: localhost:1234/products/<PRODUCT_ID>/delete
// (DELETE)
exports.product_delete = (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            if (!product) {
                return res.header("Access-Control-Allow-Origin", "*").status(404).send({
                    message: "There was an error Deleting car with" + req.params.id
                });
            }
            res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html").status(204).send({
                message: "Car was successfully deleted!"
            });
        })
        .catch(error => {
            if (error.kind === "CarId" || error.name === "notFound") {
                return res.header("Access-Control-Allow-Origin", "*").status(404).send({
                    message: "There was no car found with" + req.params.id
                });
            }
            return res.header("Access-Control-Allow-Origin", "*").status(500).send({
                message: "There was an error Deleting car with" + req.params.id
            })
        });

};
