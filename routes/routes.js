const express = require('express')
const router = express.Router()
const { updateDriverLocation, register, login, logout, getAllPendingUser, getAllActiveUser, activeAPendingUser, banAUser } = require('../controllers/UserController')
const { UserValidator } = require('../validators/validators')
const {finishTheBookingRequest, booking, checkingForCustomer, cancelTheBookingRequest, acceptTheBookingRequest, checkCustomerBookingStatus } = require('../controllers/BookingControllers')

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

router.post('/logout', logout)
router.get('/pending_user', getAllPendingUser)
router.get('/active_user', getAllActiveUser)
router.put('/active_a_pending_user/:username', activeAPendingUser)
router.put('/ban_a_user/:username', banAUser)
router.put('/update_driver_location', updateDriverLocation);

router.get('/checking_for_customer/:username', checkingForCustomer)
router.put('/checking_for_customer/:username/cancel', cancelTheBookingRequest)
router.put('/checking_for_customer/:username/accept', acceptTheBookingRequest)
router.put('/checking_for_customer/:username/finish', finishTheBookingRequest)



router.post('/booking',booking)

router.get('/check_my_booking_status/:phoneNumber/:id', checkCustomerBookingStatus)

module.exports = router;