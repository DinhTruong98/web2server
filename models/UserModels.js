const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    name: { type: String, unique: false, required: true, trim: true },
    username: { type: String, required: true, trim: true, minlength: 2 },
    role: { type: String, enum: ['admin','active','pending']},
    password: { type: String, required: true, trim: true, minlength: 8 },
    avatarLink: { type: String, unique: false, required: true, trim: true },
    vehicleImageLink: { type: String, unique: false, required: true, trim: true },
    vehicleBrand: { type: String, unique: false, required: true, trim: true },
    vehicleId: { type: String, unique: false, required: true, trim: true },
    isWorking: {type: Boolean, default:false},
    currentLat:{type: String, default:"0"},
    currentLng:{type: String, default:"0"}
});

module.exports = mongoose.model('User', userSchema);