export const queueRedisConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

export const defaultQueueConfig = {
  removeOnComplete: {
    age: 60 * 60,
    count: 100,
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
  removeOnFail: {
    count: 1000,
  },
};
