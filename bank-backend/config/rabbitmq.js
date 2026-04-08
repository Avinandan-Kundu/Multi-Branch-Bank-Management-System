const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    channel = await connection.createChannel();
    console.log('RabbitMQ connected');
  } catch (error) {
    console.error('RabbitMQ error:', error.message);
  }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };