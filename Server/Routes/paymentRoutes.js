const { createPayment } = require('../Controller/paymentController');

const router = require('express').Router();

router.post('/create-payment-intent', createPayment);

module.exports = router;
