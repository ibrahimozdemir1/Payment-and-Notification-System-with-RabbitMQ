const amqp = require('amqplib');

const nodemailer = {
    createTransport: () => ({
        sendMail: async (mailOptions) => {
            console.log('Mail Sent:', mailOptions);
            return Promise.resolve();
        },
    }),
};

async function sendNotification() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('NotificationQueue');

    console.log('Waiting for messages in NotificationQueue...');

    channel.consume('NotificationQueue', async (msg) => {
        const message = msg.content.toString();
        console.log('Sending notification:', message);

        const transporter = nodemailer.createTransport();

        await transporter.sendMail({
            from: 'user@rabbitmq.info',
            to: 'admin@rabbitmq.info',
            subject: 'Payment Notification',
            text: message,
        });

        console.log('Notification sent to user.');
        channel.ack(msg);
    });
}

sendNotification().catch(console.error);