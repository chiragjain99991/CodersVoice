const router = require('express').Router();
const authController = require('../controllers/auth-controller');
const activateController = require('../controllers/activate-controller')
const authenticationMiddleware = require('../middlewares/auth')
const roomController = require('../controllers/room-controller')

router.post('/api/send-otp',authController.sendOtp)
router.post('/api/verify-otp',authController.verifyOtp)
router.post('/api/activate', authenticationMiddleware, activateController.activate)
router.get('/api/refresh',authController.refreshTokenValidation)
router.post('/api/logout', authenticationMiddleware, authController.logout)
router.post('/api/rooms', authenticationMiddleware, roomController.createRoom)
router.get('/api/rooms', authenticationMiddleware, roomController.getAllRoom)
router.get('/api/rooms/:roomId', authenticationMiddleware, roomController.show)

module.exports = router