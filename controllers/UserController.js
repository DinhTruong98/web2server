const User = require('../models/UserModels')
const Booking = require('../models/BookingModels')
const bcrypt = require('bcrypt');

exports.register = (req, res, next) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (user == null) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) { return next(err); }
                const user = new User(req.body)
                user.role = "pending";
                user.password = hash;
                user.save((err, result) => {
                    if (err) return res.json({ err })
                    res.json({ user: result })
                })
            })
        }
        else { res.json({ err: 'Tên đăng nhập này đã có người sử dụng' }) }
    })
}

exports.login = function (req, res) {
    console.log(req.body)
    User.findOne({ username: req.body.username }).exec(function (err, user) {
        if (err) {
            return res.json({ err })
        } else if (!user) {
            return res.json({ err: 'Tài khoản hoặc mật khẩu không đúng' })
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result === true) {
                req.session.user = user
                res.json({
                    user: user,
                    "login": "success"
                })

                //chuyen trang thai isWorking thanh true
                User.findOneAndUpdate({ username: req.body.username }, { isWorking: true }, (err, doc, res) => {
                })

            } else {
                return res.json({ err: 'Tài khoản hoặc mật khẩu không đúng' })
            }
        })
    })
}

exports.logout = function (req, res) {
    User.findOneAndUpdate({ username: req.body.username }, { isWorking: false }, (err, doc, res) => {
        console.log('User ' + req.body.username + ' is loged out')
    })
}

exports.getAllPendingUser = (req, res) => {
    User.find({ role: 'pending' }).exec((err, users) => {
        if (err) throw err;
        res.json({ userList: users })
    })
}

exports.getAllActiveUser = (req, res) => {
    User.find({ role: 'active' }).exec((err, users) => {
        if (err) throw err;
        res.json({ userList: users })
    })
}

exports.activeAPendingUser = (req, res) => {
    User.findOneAndUpdate({ username: req.params.username }, { role: "active" }, (err) => {
        if (err) throw err;
        console.log(req.params.username)
    })
}

exports.banAUser = (req, res) => {
    User.findOneAndUpdate({ username: req.params.username }, { role: "pending" }, (err) => {
        if (err) throw err;
        console.log(req.params.username)
    })
}

exports.delAUser = (req, res) => {
    User.findOneAndRemove({ username: req.params.username }, (err) => {
        if (err) throw err;
        console.log(req.params.username)
    })
}


exports.updateDriverLocation = (req, res) => {
    User.findOneAndUpdate({ username: req.body.username }, { currentLat: req.body.lat, currentLng: req.body.lng }, (err) => {
        if (err) throw err;
        console.log('cap nhat thanh cong toa do cua tai xe')
    })
}


//nhan vao 1 toa do cua nguoi dung lay danh sach tai xe, su dung 1 ham tinh khoang cach tu tai xe den vi tri cua nguoi dung, 
//tao ra 1 list tai xe thep thu tu khoang cach 
let findDriver = (req, res) => {
    let userLocation = req.body.userLocation

}

