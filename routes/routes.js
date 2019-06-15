const express = require('express')
const router = express.Router()
const { delAUser, updateDriverLocation, register, login, logout, getAllPendingUser, getAllActiveUser, activeAPendingUser, banAUser } = require('../controllers/UserController')
const { UserValidator } = require('../validators/validators')
const {weeklySummaryDriver,allSummaryDriver,dailySummaryAll, weeklySummaryAll, monthlySummaryAll, allSummaryAll, finishTheBookingRequest, booking, checkingForCustomer, cancelTheBookingRequest, acceptTheBookingRequest, checkCustomerBookingStatus } = require('../controllers/BookingControllers')

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
router.put('/del_a_user/:username', delAUser)

router.put('/update_driver_location', updateDriverLocation);

router.get('/checking_for_customer/:username', checkingForCustomer)
router.put('/checking_for_customer/:username/cancel', cancelTheBookingRequest)
router.put('/checking_for_customer/:username/accept', acceptTheBookingRequest)
router.put('/checking_for_customer/:username/finish', finishTheBookingRequest)

router.get('/daily_summary_all', dailySummaryAll)
router.get('/weekly_summary_all', weeklySummaryAll)
router.get('/monthly_summary_all', monthlySummaryAll)
router.get('/all_summary_all', allSummaryAll)

router.get('/all_summary_driver/:username', allSummaryDriver)
router.get('/weekly_summary_driver/:username', weeklySummaryDriver)



router.post('/booking',booking)

router.get('/check_my_booking_status/:phoneNumber/:id', checkCustomerBookingStatus)

module.exports = router;