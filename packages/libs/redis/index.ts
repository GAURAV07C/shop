// import Redis from 'ioredis';
import 'dotenv/config';

// const redis = new Redis({
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   port: Number(process.env.REDIS_PORT) || 6379,
//   password: process.env.REDIS_PASSWORD,
//   tls: {},
// });

// export default redis;

// import Redis from 'ioredis';
// const redis = new Redis(
//   'rediss://default:AS45AAIjcDE5NWE5MzE5NjQ1ZTM0MzIwOGM2ODBlOTQzZTlkZjZkM3AxMA@still-redbird-11833.upstash.io:6379',
//   {
//     maxRetriesPerRequest: null,
//   }
// );

// redis.on('error', (err) => {
//   console.error('Redis Connection Error: ', err);
// });

// export default redis;

import Redis from 'ioredis';

console.log('Creating new Redis client...');

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redis.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

export default redis;
