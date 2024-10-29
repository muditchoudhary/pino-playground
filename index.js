const pino = require('pino');
const path = require('path');

function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero!');
  }
  return a / b;
}

// Custom formatter to only include msg in file logs
const logFileFormatter = {
  level: 'info', // Change this to the desired log level
  translateTime: 'SYS:standard', // Optional: format the timestamp
  ignore: 'pid,hostname', // Optional: ignore these fields
  // Custom formatting for the message
  message: (msg, obj) => {
    return msg; // Only return the message part
  }
};

const logFilePath = path.resolve(__dirname, 'logs', 'pino.log');
// multiple transports
const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: {
        destination: logFilePath, mkdir: true
      }
    },
    {
      target: 'pino-pretty',
      options: {
        destination: process.stdout.fd
      }
    }
  ]
})

// output to a log file
/*const transport = pino.transport({
  target: 'pino/file',
  options: {
    destination: './logs/pino.log', mkdir: true, colorize: true
  }
})*/
const logger = pino({
  customLevels: {catastrophe: 70},
}, transport);

logger.info('Hello, world!');
logger.error({username: "Mudit Choudhary"}, "Something went wrong");

logger.catastrophe('Something catastrophic happened');

try {
  const res = divide(5, 0);
} catch (error) {
  logger.error(error, 'Error occurred during division');
}