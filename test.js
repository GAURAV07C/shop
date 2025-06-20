import Redis from "ioredis"

const client = new Redis("rediss://default:AS45AAIjcDE5NWE5MzE5NjQ1ZTM0MzIwOGM2ODBlOTQzZTlkZjZkM3AxMA@still-redbird-11833.upstash.io:6379");
await client.set('foo', 'bar');