const Booking = require('../models/BookingModels')
const User = require('../models/UserModels')


//Ham nay lay location cua tat ca cac tai xe dang online, tra ve 1 list tai xe co 3 thuoc tinh: username, lat, lng
exports.booking = (req, res) => {
    let driverDistant = []
    User.find({ isWorking: true }, (err, result) => {
        if (err) throw err
        console.log(result)
        result.forEach(u => {
            let { username, currentLat, currentLng } = u
            let distant = calcDistant(req.body.startLat, req.body.startLng, currentLat, currentLng)
            console.log(username + ': ' + distant)
            driverDistant.push({
                username,
                distant
            })
        })

    }).then(() => {

        // sap xep theo khoang cach den khach hang tang dan
        driverDistant.sort((a, b) => a.distant > b.distant ? 1 : -1)
        //console.log(driverDistant)
        if (driverDistant.length === 0) {
            res.json({ loi: 'khong tim thay tai xe' })
        }
        let price = Math.round(req.body.distantBetween2point *10)/10 * 2000
        let data = {
            id:req.body.phoneNumber+Date.now(),
            bookerStartLat: req.body.startLat,
            bookerStartLng: req.body.startLng,
            bookerFinishLat: req.body.finishLat,
            bookerFinishLng: req.body.finishLng,
            distantBetween2point: req.body.distantBetween2point,
            bookerPhoneNumber: req.body.phoneNumber,
            driverUsername: driverDistant[0].username,
            status: 'booking',
            distant: driverDistant[0].distant,
            price: price
        }
        Booking.findOne((err, booking) => {
            if (booking !== null) {
                const booking = new Booking(data)
                booking.save((err, result) => {
                    if(err) throw err;
                    console.log(result)
                })
            }
            else { res.json({ err: 'Khong tim thay tai xe' }) }
        })

    })
}

// ham nay nhan vao vi tri nguoi dung, vi tri cua tai xe, tinh khoang cach tu vi tri cua tai xe den nguoi dung
let calcDistant = (userLat, userLng, driverLat, driverLng) => {
    let dLng = Math.abs(driverLng - userLng)
    let dLat = Math.abs(driverLat - userLat)
    return Math.sqrt(dLng * dLng + dLat * dLat)
}

//Ham nay kiem tra xem bang booking co thong tin khong

exports.checkingForCustomer = (req, res) => {
    Booking.find({ driverUsername: req.params.username, status: 'booking' }, (err, result) => {
        if (result.length !== 0) {
            res.json(result)
        }
        else {
            res.json({
                err: "khong co ai booking"
            })
        }
    })
}

exports.cancelTheBookingRequest = (req, res) => {
    Booking.findOneAndUpdate({ driverUsername: req.params.username, status: 'booking' }, { status: 'cancel' }, (err, result) => {
        if (err) throw err
        console.log(result)
    })
    User.findOneAndUpdate({ username: req.params.username }, { isWorking: true }, (err, result) => {
        if (err) throw err
    })
}


exports.finishTheBookingRequest = (req, res) => {
    Booking.findOneAndUpdate({ driverUsername: req.params.username, status: 'driver_comming' }, { status: 'finish' }, (err, result) => {
        if (err) throw err
        User.findOneAndUpdate({ username: req.params.username, isWorking: false }, { isWorking: true }, (err, result) => {
            if (err) throw err
            console.log('Ket qua cua cap nhat trang thai user:' + result)
        })
    })
}

// Chuyen trang thai chuyen di thanh driver comming, sau do chuyen trang thai tai xe thanh dang ban
exports.acceptTheBookingRequest = (req, res) => {
    Booking.findOneAndUpdate({ driverUsername: req.params.username, status: 'booking' }, { status: 'driver_comming' }, (err, result) => {
        if (err) throw err
        console.log('Tai xe ' + req.params.username + ' da nhan khach')

    })
    User.findOneAndUpdate({ username: req.params.username }, { isWorking: false }, (err, result) => {
        if (err) throw err
    })
}

exports.checkCustomerBookingStatus = (req, res) => {
    Booking.findOne({ bookerPhoneNumber: req.params.phoneNumber, status: 'driver_comming' }, (err, result) => {
        if (err) throw err
        if (result === null) {
            Booking.findOne({id:req.params.id,status:'finish'},(err, result)=>{
                if(result === null){
                    res.json({loi:'cant find driver'});
                }
                else res.json({finish:true});
            })
        }
        if (result) {
            let { distant, id } = result
            User.find({ username: result.driverUsername }, (err, user) => {
                let { name, avatarLink, vehicleBrand, vehicleId } = user[0]
                res.json({
                    name, avatarLink, vehicleBrand, vehicleId,
                    distant,id
                })
            })
        }
    })
}