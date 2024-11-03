const { createOrder } = require('../Controller/paymentController');

const router = require('express').Router();

router.post('/create-order', createOrder);

module.exports = router;
