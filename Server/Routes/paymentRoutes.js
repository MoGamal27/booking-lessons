const { createOrder, payWithPoints } = require('../Controller/paymentController');

const router = require('express').Router();

router.post('/create-order', createOrder);
router.post('/pay-with-points', payWithPoints);

module.exports = router;
