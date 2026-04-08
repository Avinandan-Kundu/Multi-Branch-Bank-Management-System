const Branch = require('../models/Branch');
const { getChannel } = require('../config/rabbitmq');

const startTransactionConsumer = async () => {
  try {
    const channel = getChannel();

    if (!channel) {
      console.log('RabbitMQ channel not ready for consumer');
      return;
    }

    const queue = 'transactions';

    await channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());

          console.log('Received transaction event from RabbitMQ:', content);

          const transaction = content.data;
          const { branchId, amount, transactionType } = transaction;

          let updateAmount = 0;

          if (transactionType === 'deposit') {
            updateAmount = amount;
          } else if (transactionType === 'withdrawal') {
            updateAmount = -amount;
          }

          const updatedBranch = await Branch.findByIdAndUpdate(
            branchId,
            { $inc: { cashReserve: updateAmount } },
            { new: true }
          );

          console.log('Branch cashReserve updated asynchronously:', updatedBranch);

          channel.ack(msg);
        } catch (error) {
          console.error('Error processing transaction event:', error.message);
          channel.ack(msg);
        }
      }
    });

    console.log('Transaction consumer started');
  } catch (error) {
    console.error('Consumer error:', error.message);
  }
};

module.exports = startTransactionConsumer;