const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    brand: {type: String, required: true, max: 100, exists: true},
    model: {type: String, required: true, exists: true},
    price: {type: String, required: true, exists: true},
});

// Export the model
const product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.get = function (callback, limit) {
    product.find(callback).limit(limit);
};
