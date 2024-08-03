import Redis from "ioredis";

const redis = new Redis(process.env.REDIS!);

export default redis;