const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;
var promotionSchema = new Schema({
    name: String,
    image:String,
    label:String,
    price:Currency,
    description:String,
    featured: Boolean
})
var Promotions = mongoose.model('promotion',promotionSchema);
module.exports = Promotions