require('dotenv').config();
const merchantId = process.env.MERCHANT_ID;
function getPaymentUrl(booking) {
    const paymentUrl = `https://payment.paybox.com?merchantId=${merchantId}&amount=${booking.amount * 100}&orderId=${booking.id}&currency=USD`;
    return paymentUrl; // Return the Paybox payment URL
}

module.exports = getPaymentUrl;