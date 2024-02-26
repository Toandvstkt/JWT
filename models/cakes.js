const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const cakeSchema = new Schema({  
	type: String,   
    name: String,
  	price: Number,
    topping: [{type: Schema.Types.ObjectId, ref: 'Topping' }]
});

const toppingSchema =new Schema({
 
  type: String,
  price_extra: Number,
});

const Cakes = mongoose.model('Cake', cakeSchema);
const Topping = mongoose.model('Topping', toppingSchema);
module.exports = Cakes;
