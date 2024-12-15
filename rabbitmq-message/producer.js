const amqp = require('amqplib');

async function sendToQueue() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('PaymentQueue');

    const payment = {
        user: 'user@rabbitmq.info',
        paymentType: 'credit',
        cardNo: '1234123412341234',
    };

    channel.sendToQueue('PaymentQueue', Buffer.from(JSON.stringify(payment)));
    console.log('Payment sent to queue:', payment);

    await channel.close();
    await connection.close();
}

sendToQueue().catch(console.error);