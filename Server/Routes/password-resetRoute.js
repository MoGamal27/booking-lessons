const { resetPassword, resetUserPassword } = require('../Controller/password-resetController');

const router = require('express').Router();

router.post('/reset-password', resetPassword);

router.post('/reset-password/:userId/:token', resetUserPassword);

module.exports = router;