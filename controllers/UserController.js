const User = require ('../models/UserModels')
const bcrypt = require('bcrypt');

exports.register = (req, res, next) => {
    User.findOne({username: req.body.username}, (err, user)=>{
        if(user == null){
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){return next(err);}
                const user = new User(req.body)
                user.role = "pending";
                user.password = hash;
                user.save((err, result)=>{
                    if(err) return res.json({err})
                    res.json({user: result})
                })
            })
        }
        else {res.json({err: 'Tên đăng nhập này đã có người sử dụng'})}
    })
}

exports.login = function(req, res){
    User.findOne({username: req.body.username}).exec(function(err, user){
        if(err) {
            return res.json({err})
        }else if (!user){
            return res.json({err: 'Tài khoản hoặc mật khẩu không đúng'})
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(result === true){
                req.session.user = user
                res.json({
                    user: user,
                    "login": "success"
                })
            }else{
                return res.json({err: 'Tài khoản hoặc mật khẩu không đúng'})
            }
        })
    })
}

exports.logout = function(req, res){
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return res.json({err});
            } else {
                return res.json({'logout': "Success"});
            }
        });
    }
}

exports.getAllPendingUser = (req, res)=>{
    User.find({role:'pending'}).exec((err, users)=>{
        if (err) throw err;
            res.json({userList: users})
    })
}

exports.getAllActiveUser = (req, res)=>{
    User.find({role:'active'}).exec((err, users)=>{
        if (err) throw err;
            res.json({userList: users})
    })
}

exports.activeAPendingUser = (req, res) => {
    User.findOneAndUpdate({username: req.params.username},{role:"active"},(err)=>{
        if (err) throw err;
        console.log(req.params.username)
    })
}

exports.banAUser = (req, res) => {
    User.findOneAndUpdate({username: req.params.username},{role:"pending"},(err)=>{
        if (err) throw err;
        console.log(req.params.username)
    })
}