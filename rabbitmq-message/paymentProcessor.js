const amqp = require('amqplib');

async function processPayment() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('PaymentQueue');
    await channel.assertQueue('NotificationQueue');

    console.log('Waiting for messages in PaymentQueue...');

    channel.consume('PaymentQueue', (msg) => {
        const payment = JSON.parse(msg.content.toString());
        console.log('Processing payment:', payment);

        const notification = `Payment successful for ${payment.user}`;
        channel.sendToQueue('NotificationQueue', Buffer.from(notification));

        channel.ack(msg);
    });
}

processPayment().catch(console.error);