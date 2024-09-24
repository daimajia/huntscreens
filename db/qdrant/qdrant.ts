import { QdrantClient } from '@qdrant/js-client-rest';

const qdrantClient = new QdrantClient({ host: process.env.QDRANT_HOST, port: Number(process.env.QDRANT_PORT) });
export const collectionName = "huntscreens";

export default qdrantClient;
