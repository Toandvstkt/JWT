const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const Schema = mongoose.Schema;
var leaderSchema = new Schema({
    name:String,
    image:String,
    designation:String,
    abbr:String,
    description:String,
    featured:Boolean
})
var Leaders = mongoose.model('leader',leaderSchema);
module.exports = Leaders