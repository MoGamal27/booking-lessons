require('dotenv').config()
const {Booking, Teacher} = require('../Model/index');
const paypal = require('@paypal/checkout-server-sdk');

const environment = new paypal.core.SandboxEnvironment('AfhUouOs3xx6CHsWXPhX1K9dUfk0231k2U-8Nra2NkkTRdBdyIkOZVHkbnqEf-E54oMjXlfHTBe8Ddl6', 'EG6XpzScO4iLucG7UJawJANZIO3CV1zQB3I7sUbI064hQeinLhrJVOdw9wHv0nEXnzcVxnOAT3IDkV-T');
const client = new paypal.core.PayPalHttpClient(environment);

exports.createOrder = async (req, res) => {
  const { bookings } = req.body;
  console.log("Received bookings:", bookings);

  // Fetch the bookings from the database with teacher information
  const bookingsData = await Booking.findAll({
    where: {
      id: bookings,
    },
    include: [{
      model: Teacher,
      attributes: ['fees']
    }]
  });

  // Calculate total amount based on teacher fees
  const totalAmount = bookingsData.reduce((total, booking) => total + booking.Teacher.fees, 0);

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: totalAmount.toFixed(2),
        },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    res.status(200).json({ orderID: order.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ message: "Failed to create PayPal order" });
  }
};

    