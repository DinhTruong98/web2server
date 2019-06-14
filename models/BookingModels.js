const mongoose = require('mongoose');
const schema = mongoose.Schema;


const bookingSchema = new schema({
    id:{type:String},
    bookerStartLat: { type: String},
    bookerStartLng: { type: String},
    bookerFinishLat: { type: String},
    bookerFinishLng: { type: String},
    bookerPhoneNumber: { type: String},
    driverUsername: { type: String },
    price:{type: String, default:'0'},
    distantBetween2point:{type:String},
    date:{type:Date, default: Date.now()},
    status:{type: String, enum:['booking','driver_comming','driving_customer','finished','canceled'], required: true},
    distant:{type:String}
});

module.exports = mongoose.model('Booking', bookingSchema);