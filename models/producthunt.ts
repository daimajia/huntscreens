import { Schema } from 'mongoose';
import { PostNode } from 'node-producthunt-api';

// Document interface

interface Post extends PostNode{

};

// Schema
const schema = new Schema<Post>({
  name: { type: String, required: true },
});