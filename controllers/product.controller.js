const Product = require("../models/product.model");

//OPTIONS Method
exports.product_options = function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("Access", "GET, POST,OPTIONS");
    res.header("Allow", "GET ,POST ,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Keep-Alive", "timeout=5, max=100");

    //intercepts OPTIONS method
    if ("OPTIONS" === req.method)
        res.status(200).send();
};

exports.product_options_detail = function (req, res) {
    res.header('Access-Control-Allow-Methods', "GET,PUT,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Allow", "GET,PUT,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Origin', '*');
    res.sendStatus(200);
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

    let product = new Product();
    product.brand = req.body.brand;
    product.model = req.body.model;
    product.price = req.body.price;

    product.save()
        .then(product => {
            res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html").status(201).send(product);
        })
        .catch(error => {
            res.header("Access-Control-Allow-Origin", "*").status(500).send({
                message: error.message || "There was a problem adding the information to the database. Please check everything again and retry."
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
                var cars = [];
                for (let i = 0; i < products.length; i++) {
                    let brand = products[i].brand;
                    let model = products[i].model;
                    let price = products[i].price;
                    let id = products[i]._id;
                    let _links = {
                        self: {
                            href: req.protocol + "://" + req.headers.host + "/products/" + id
                        },
                        collection: {
                            href: req.protocol + "://" + req.headers.host + "/products/"
                        }
                    };
                    let car = {id, brand, model, price, _links};
                    cars.push(car);
                }

                res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, text/html").json({
                    items: cars,
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
            .catch(error => {
                res.status(500).send({
                    message: error.message || "There was an error when finding cars"
                });
            });
    } else {
        res.sendStatus(400)
    }
};

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
            res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, text/html").json(
                {
                    id: product._id,
                    brand: product.brand,
                    model: product.model,
                    price: product.price,
                    _links: {
                        self: {
                            href: req.protocol + "://" + req.headers.host + "/products/" + req.params.id
                        },
                        collection: {
                            href: req.protocol + "://" + req.headers.host + "/products/"
                        }
                    }
                })
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

                res.header("Access-Control-Allow-Origin", "*").header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, text/html").json({
                    id: product._id,
                    brand: product.brand,
                    model: product.model,
                    price: product.price,
                });
            }
        })
        .catch(err => {
            if (err.kind === "CarId") {
                return res.header("Access-Control-Allow-Origin", "*").status(404).send({
                    message: "Car not found with id " + req.params.id
                })
            }
            return res.header("Access-Control-Allow-Origin", "*").status(500).send({
                message: "Error retrieving car with id " + req.params.id
            });
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
