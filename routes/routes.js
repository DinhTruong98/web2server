const express = require('express')
const router = express.Router()
const { register, login, logout, getAllPendingUser, getAllActiveUser, activeAPendingUser, banAUser } = require('../controllers/UserController')
const { UserValidator } = require('../validators/validators')

router.post('/register', UserValidator, register)

//--------------login route
function requiresLogout(req, res, next) {
    if (req.session && req.session.user) {
        return res.json({ err: 'You must be Logout in to Login continue' });
    } else {
        return next();
    }
}
router.post('/login', requiresLogout, login)

//---------------logout route
function requiresLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.json({ err: 'You must be logged in to view this page.' });
    }
}

router.get('/logout', requiresLogin, logout)
router.get('/pending_user', getAllPendingUser)
router.get('/active_user', getAllActiveUser)
router.put('/active_a_pending_user/:username', activeAPendingUser)
router.put('/ban_a_user/:username', banAUser)

module.exports = router;